import { unmarshall } from "@aws-sdk/util-dynamodb"; // Import the unmarshall function
import {
  DynamoDBClient,
  BatchWriteItemCommand,
} from "@aws-sdk/client-dynamodb"; // ES Modules import
import {
  drivers,
  raceScoringSystem,
  sprintScoringSystem,
  sortDataByTime,
  generateUniqueId,
  getISO8601Timestamp,
  fetchData,
  normalizeResults,
} from "./utils.mjs";

export const lambdaHandler = async (event, context) => {
  const { functionName, memoryLimitInMB, logGroupName, invokedFunctionArn } =
    context;

  console.log("from `context`", {
    functionName,
    memoryLimitInMB,
    logGroupName,
    invokedFunctionArn,
  });

  // Environment variables from Lambda configuration
  const getConstructorsEndpoint =
    process.env.LAMBDA_GET_CONSTRUCTORS_FUNCTION_URL;
  console.log("getConstructorsEndpoint", getConstructorsEndpoint);
  const constructorsTable = process.env.CONSTRUCTORS_DYDB_TABLE_NAME;
  console.log("constructorsTable", constructorsTable);
  const region = process.env.REGION;

  console.log(
    "DynamoDB Stream event received:",
    JSON.stringify(event, null, 2)
  );

  function normalizeStandings(data) {
    return data.Standings.L.map((item) => ({
      position: parseInt(item.M.position.N, 10), // Extract position and convert to a number. The 10 at the end of parseInt specifies the radix (or base) to be used for converting the string into a number. A radix of 10 indicates that the string should be interpreted as a decimal number. This is important to avoid unexpected results, as omitting the radix can cause JavaScript to interpret the number in other bases like octal (base-8) if the string starts with a 0.
      team: item.M.team.S, // Extract team name
      points: item.M.points.N, // Extract points as string or convert if needed
    }));
  }

  function calculateDriverPoints(results, scoringSystem) {
    // Create a map of positions to points for easier lookup
    const pointsMap = new Map(
      scoringSystem.map((item) => [item.position, item.points])
    );

    // Create an object to store drivers and their earned points
    const driverPointsObject = {};

    results.forEach((result) => {
      let earnedPoints = result.dnf
        ? 0
        : Number(pointsMap.get(result.position)) || 0;
      if (result.fastestLap && !result.dnf) {
        earnedPoints += Number(pointsMap.get("fastestLap")) || 0;
      }
      // Assign points to the driver in the object
      driverPointsObject[result.driver] = earnedPoints;
    });

    return driverPointsObject;
  }

  function calculateTeamPoints(driverPoints, previousPoints) {
    // Create a map of drivers to their teams for easy lookup
    const driverTeamMap = new Map(
      drivers.map((driver) => [driver.name, driver.team])
    );

    // Create a map to accumulate points per team
    const newTeamPoints = {};

    // Calculate points per team based on driver points
    for (const [driver, points] of Object.entries(driverPoints)) {
      const team = driverTeamMap.get(driver);
      if (team) {
        // Initialize team points if not already present and accumulate points
        newTeamPoints[team] = (newTeamPoints[team] || 0) + points;
      }
    }

    // Merge new points with previous standings
    const updatedTeamStandings = previousPoints.map((standing) => {
      // Convert previous points to number and add new points if available
      const currentPoints = Number(standing.points);
      const additionalPoints = newTeamPoints[standing.team] || 0;

      return {
        position: standing.position,
        team: standing.team,
        points: currentPoints + additionalPoints,
      };
    });

    // Sort teams by updated points in descending order
    updatedTeamStandings.sort((a, b) => b.points - a.points);

    // Update positions based on sorted order
    return updatedTeamStandings.map((team, index) => ({
      position: index + 1,
      team: team.team,
      points: team.points,
    }));
  }

  async function calculatePoints(results, previousPoints, scoringSystem) {
    console.log("calculatePoints - previousPoints", previousPoints);
    console.log("calculatePoints - results", results);

    const driverPoints = calculateDriverPoints(results, scoringSystem);
    // console.log("driverPoints", driverPoints);
    const updatedTeamStandings = calculateTeamPoints(
      driverPoints,
      previousPoints
    );
    console.log("updatedTeamStandings", updatedTeamStandings);
    return updatedTeamStandings;
  }

  async function writeToDydb(tableName, updatedTeamStandings) {
    // Client configuration
    const client = new DynamoDBClient({
      region: process.env.REGION,
    });

    // Params for BatchWriteItemCommand with an array of objects
    const params = {
      RequestItems: {
        [tableName]: [
          {
            PutRequest: {
              Item: {
                PK: { S: generateUniqueId() },
                DateTime: { S: getISO8601Timestamp() },
                Standings: {
                  L: updatedTeamStandings.map((item) => ({
                    M: {
                      position: { N: item.position.toString() }, // Number as string
                      team: { S: item.team }, // String
                      points: { N: item.points.toString() }, // Number as string
                    },
                  })), // Convert array of objects into DynamoDB List format
                },
              },
            },
          },
        ],
      },
    };

    try {
      const command = new BatchWriteItemCommand(params);
      const result = await client.send(command);
      console.log("Write successful:");
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Write successful",
          unprocessedItems: result.UnprocessedItems || [],
        }),
      };
    } catch (error) {
      console.error("Error writing to DynamoDB table:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Failed to write to table",
          error: error.message,
        }),
      };
    }
  }

  async function main(newItem) {
    // get the latest constructor standings
    const { data: constructorStandings } = await fetchData(
      getConstructorsEndpoint
    );

    // sorting all the returned dydb items by time, then passing in the most recent (first element) to be normalized
    const sortedStandings = sortDataByTime(constructorStandings);
    const normalizedStandings = normalizeStandings(sortedStandings[0]);

    // normalize the data `newItem` from  the results table
    const normalizedResults = normalizeResults(newItem);

    // calculate based on type of newItem, race or sprint
    let updatedStandings;

    if (newItem.Type === "Race") {
      updatedStandings = await calculatePoints(
        normalizedResults,
        normalizedStandings,
        raceScoringSystem
      );
    } else if (newItem.Type === "Sprint") {
      updatedStandings = await calculatePoints(
        normalizedResults,
        normalizedStandings,
        sprintScoringSystem
      );
    } else {
      console.log('Nothing to do, newItem.Type !== "Race" || "Sprint"');
      return;
    }

    // write to constructors dydb table
    const response = await writeToDydb(constructorsTable, updatedStandings);
    console.log("dydb write response", response);
  }

  // Process the single record in the stream event (assuming there's always only one)
  const record = event.Records[0];

  // Only processing INSERT events
  // Check the event name
  if (record.eventName === "INSERT") {
    console.log("New item inserted:", record.dynamodb.NewImage);
    // Extract the new item from the DynamoDB Stream event
    const newItem = unmarshall(record.dynamodb.NewImage);
    // Process the new item
    await main(newItem);
  } else {
    console.log(
      "Nothing to do, event is not an INSERT. Event type:",
      record.eventName
    );
  }
};
