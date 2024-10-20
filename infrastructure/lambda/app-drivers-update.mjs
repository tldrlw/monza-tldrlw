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
  const getDriversURL = process.env.LAMBDA_GET_DRIVERS_FUNCTION_URL;
  const getConstructorsURL = process.env.LAMBDA_GET_CONSTRUCTORS_FUNCTION_URL;
  // const testTable = process.env.TEST_DYDB_TABLE_NAME;
  const region = process.env.REGION;

  console.log("getDriversURL", getDriversURL);
  console.log("getConstructorsURL", getConstructorsURL);
  // console.log("testTable", testTable);

  console.log(
    "DynamoDB Stream event received:",
    JSON.stringify(event, null, 2)
  );

  async function fetchData(endpoint) {
    // used to get both drivers and constructors (still need to do) standings
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

  function parseDriversData(data) {
    console.log("parseDriversData function - data - line 71");
    console.log(JSON.stringify(data, null, 2));

    function simplifyData(standings) {
      return standings.map((item) => ({
        position: parseInt(item.M.position.N, 10), // Extract position and convert to a number
        // The 10 at the end of parseInt(item.M.position.N, 10) specifies the radix (or base) to be used for converting the string into a number. A radix of 10 indicates that the string should be interpreted as a decimal number. This is important to avoid unexpected results, as omitting the radix can cause JavaScript to interpret the number in other bases like octal (base-8) if the string starts with a 0.
        driver: item.M.driver.S, // Extract driver name
        points: item.M.points.N, // Extract DNF status as boolean
      }));
    }

    // Accessing the correct property in the data object
    const simplifiedData = simplifyData(data.Standings.L);
    return simplifiedData;
  }

  function parseResultsData(data) {
    console.log("parseResultsData function - data", data);
    function simplifyRaceData(data) {
      const fastestLapDriver = data.FastestLap;
      return data.Results.map((item) => ({
        position: item.Position, // Use the direct property name
        driver: item.Driver, // Get the driver name
        dnf: item.DNF, // Get the DNF status
        fastestLap: item.Driver === fastestLapDriver, // Check if this driver got the fastest lap
      }));
    }

    const simplifiedData = simplifyRaceData(data);
    return simplifiedData;
  }

  function calculateDriverPoints(results, previousPoints, raceScoringSystem) {
    // Create a map of positions to points for easier lookup
    const pointsMap = new Map(
      raceScoringSystem.map((item) => [item.position, item.points])
    );

    // Create a new array with updated driver points
    return results.map((result) => {
      // Find the previous points for the driver
      const previousDriver = previousPoints.find(
        (driver) => driver.driver === result.driver
      );

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
        position: result.position,
        driver: result.driver,
        points: (Number(previousDriver?.points) || 0) + earnedPoints, // Convert to number and add
      };
    });
  }

  function mergeAndSortDriverData(driversData, updatedPoints) {
    // Merge driver data with updated points
    const mergedData = driversData.map((driver) => {
      const driverPoints = updatedPoints.find(
        (points) => points.driver === driver.driver
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

  async function main(newItem) {
    // get the latest drivers standings
    const { data: driverStandings } = await fetchData(getDriversURL);
    // console.log(JSON.stringify(driverStandings, null, 2));
    // sorting all the returned dydb items by time, then passing in the most recent (first element) to be parsed
    const sortedDriverStandingsData = sortDataByTime(driverStandings);
    console.log(
      "sortedDriverStandingsData[0] - line 142",
      sortedDriverStandingsData[0]
    );
    const parsedDriverStandingsData = parseDriversData(
      sortedDriverStandingsData[0]
    );
    console.log("parsedDriverStandingsData", parsedDriverStandingsData);
    ////

    // parse the results stream data newItem
    const parsedResultsData = parseResultsData(newItem);
    console.log("parsedResultsData", parsedResultsData);

    const updatedDriverPoints = calculateDriverPoints(
      parsedResultsData,
      parsedDriverStandingsData,
      raceScoringSystem
    );
    console.log("updatedDriverPoints", updatedDriverPoints);

    const mergedData = mergeAndSortDriverData(drivers, updatedDriverPoints);
    console.log("mergedData", mergedData);
  }

  console.log("event.Records", event.Records);

  // Loop through each record in the stream event
  for (const record of event.Records) {
    // Only process INSERT events
    if (record.eventName === "INSERT") {
      console.log("New item inserted:", record.dynamodb.NewImage);
      // Extract the new item from the DynamoDB Stream event
      const newItem = unmarshall(record.dynamodb.NewImage);
      console.log(JSON.stringify(newItem, null, 2));
      await main(newItem);
    }
  }

  // return `Successfully processed ${event.Records.length} records.`;
};
