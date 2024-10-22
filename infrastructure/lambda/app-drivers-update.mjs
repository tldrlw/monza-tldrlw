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
  const getDriversEndpoint = process.env.LAMBDA_GET_DRIVERS_FUNCTION_URL;
  console.log("getDriversEndpoint", getDriversEndpoint);
  const driversTable = process.env.DRIVERS_DYDB_TABLE_NAME;
  console.log("driversTable", driversTable);
  const testTable = process.env.TEST_DYDB_TABLE_NAME;
  console.log("testTable", testTable);
  const region = process.env.REGION;

  console.log(
    "DynamoDB Stream event received:",
    JSON.stringify(event, null, 2)
  );

  async function fetchData(endpoint) {
    // used to get current drivers standings
    try {
      const response = await fetch(endpoint); // Make the GET request
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`); // Handle HTTP errors
      }
      const data = await response.json(); // Parse the JSON from the response
      return data; // Return the parsed data
    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors
      return null;
    }
  }

  function normalizeStandings(data) {
    return data.Standings.L.map((item) => ({
      position: parseInt(item.M.position.N, 10), // Extract position and convert to a number. The 10 at the end of parseInt specifies the radix (or base) to be used for converting the string into a number. A radix of 10 indicates that the string should be interpreted as a decimal number. This is important to avoid unexpected results, as omitting the radix can cause JavaScript to interpret the number in other bases like octal (base-8) if the string starts with a 0.
      driver: item.M.name.S, // Extract driver name
      points: item.M.points.N, // Extract points as string or convert if needed
    }));
  }

  function normalizeResults(data) {
    // Destructure to extract the driver who achieved the fastest lap and the race results from the input data
    const { FastestLap: fastestLapDriver, Results } = data;

    // Map through each result item to create a simplified object
    return Results.map((item) => ({
      position: item.Position, // Extract the driver's position in the race
      driver: item.Driver, // Extract the driver's name
      dnf: item.DNF, // Extract the DNF (Did Not Finish) status
      fastestLap: item.Driver === fastestLapDriver, // Check if the current driver achieved the fastest lap
    }));
  }

  async function calculatePoints(results, previousPoints, scoringSystem) {
    console.log("calculatePoints - previousPoints", previousPoints);
    console.log("calculatePoints - results", results);

    // Create a map of positions to points for easier lookup
    const pointsMap = new Map(
      scoringSystem.map((item) => [item.position, item.points])
    );

    // Create a map of results to access driver results easily by driver name
    const resultsMap = new Map(
      results.map((result) => [result.driver, result])
    );

    // Update points for all drivers (both those who raced and those who didn't)
    const updatedPoints = previousPoints.map((previousDriver) => {
      // Check if the driver is in the results (i.e., they participated in the race)
      const result = resultsMap.get(previousDriver.driver);

      if (result) {
        // Calculate points based on position and DNF
        let earnedPoints = result.dnf
          ? 0
          : Number(pointsMap.get(result.position)) || 0;

        // Add additional points if the driver has the fastest lap and didn't DNF
        if (result.fastestLap && !result.dnf) {
          earnedPoints += Number(pointsMap.get("fastestLap")) || 0;
        }

        // Return the updated driver object with new points
        return {
          driver: result.driver,
          points: (Number(previousDriver.points) || 0) + earnedPoints, // Add new earned points
        };
      } else {
        // If the driver is not in the results, keep their existing points
        return {
          driver: previousDriver.driver,
          points: Number(previousDriver.points), // Keep previous points
        };
      }
    });

    // Sort drivers by points in descending order (highest points first)
    updatedPoints.sort((a, b) => b.points - a.points);

    // Update the positions based on the sorted order
    return updatedPoints.map((driver, index) => ({
      position: index + 1,
      driver: driver.driver,
      points: driver.points,
    }));
  }

  function mergeData(driversData, updatedPoints) {
    console.log("mergeData - driversData", driversData);
    console.log("mergeData - updatedPoints", updatedPoints);
    // Merge driver data with updated points
    const mergedData = driversData.map((driver) => {
      const driverPoints = updatedPoints.find(
        (points) => points.driver === driver.name
      );
      return {
        ...driver,
        points: driverPoints ? driverPoints.points : 0,
        // dnf: driverPoints ? driverPoints.dnf : false,
        // fastestLap: driverPoints ? driverPoints.fastestLap : false,
      };
    });

    // Sort the merged data by points in descending order
    mergedData.sort((a, b) => b.points - a.points);

    // Update the positions based on the sorted order
    return mergedData.map((driver, index) => ({
      ...driver,
      position: index + 1,
    }));
  }

  async function writeToDydb(tableName, mergedData) {
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
                  L: mergedData.map((item) => ({
                    M: {
                      position: { N: item.position.toString() }, // Number as string
                      name: { S: item.name }, // String
                      team: { S: item.team }, // String
                      points: { N: item.points.toString() }, // Number as string
                      nationality: { S: item.nationality }, // String
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
    // get the latest driver standings
    const { data: driverStandings } = await fetchData(getDriversEndpoint);

    // sorting all the returned dydb items by time, then passing in the most recent (first element) to be normalized
    const sortedStandings = sortDataByTime(driverStandings);
    const normalizedStandings = normalizeStandings(sortedStandings[0]);

    // normalize the data `newItem` from  the results table
    const normalizedResults = normalizeResults(newItem);

    // calculate based on type of newItem, race or sprint
    let updatedPoints;

    if (newItem.Type === "Race") {
      updatedPoints = await calculatePoints(
        normalizedResults,
        normalizedStandings,
        raceScoringSystem
      );
    } else {
      updatedPoints = await calculatePoints(
        normalizedResults,
        normalizedStandings,
        sprintScoringSystem
      );
    }

    // prepares data with updated points for write to driver standings table
    const mergedData = mergeData(drivers, updatedPoints);
    console.log("mergedData", mergedData);

    // write to drivers dydb table (but test table for now)
    const response = await writeToDydb(driversTable, mergedData);
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
