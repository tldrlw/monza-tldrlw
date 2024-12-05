import dotenv from "dotenv";
import {
  DynamoDBClient,
  BatchWriteItemCommand,
} from "@aws-sdk/client-dynamodb";
import {
  drivers,
  raceScoringSystem,
  sprintScoringSystem,
  sortDataByTime,
  generateUniqueId,
  getISO8601Timestamp,
} from "./utils.mjs";

// Load environment variables from .env file
dotenv.config();

// Environment variables from Lambda configuration
const getDriversURL = process.env.LAMBDA_GET_DRIVERS_FUNCTION_URL;
const getConstructorsURL = process.env.LAMBDA_GET_CONSTRUCTORS_FUNCTION_URL;
const getResultsURL = process.env.LAMBDA_GET_RESULTS_FUNCTION_URL;
// const testTable = process.env.TEST_DYDB_TABLE_NAME
const region = process.env.REGION;

console.log("getDriversURL", getDriversURL);
console.log("getConstructorsURL", getConstructorsURL);
console.log("getResultsURL", getResultsURL);
// console.log("testTable", testTable);

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
  // console.log(JSON.stringify(data.Standings.L, null, 2));
  function simplifyData(data) {
    return data.map((item) => ({
      position: parseInt(item.M.position.N, 10), // Convert the position to an integer
      driver: item.M.driver.S, // Get the driver name
      points: parseInt(item.M.points.N, 10), // Convert the points to an integer
    }));
  }
  const simplifiedData = simplifyData(data.Standings.L);
  // console.log(simplifiedData)
  // [
  //   { position: 1, driver: 'Max Verstappen', points: 331 },
  //   { position: 2, driver: 'Lando Norris', points: 279 },
  //   { position: 3, driver: 'Charles Leclerc', points: 245 },
  return simplifiedData;
}

function parseResultsData(data) {
  // don't forget to do something with fastestLap
  // console.log(JSON.stringify(data, null, 2));
  // console.log(JSON.stringify(data.Results.L, null, 2));
  function simplifyRaceData(data) {
    const fastestLapDriver = data.FastestLap.S;
    return data.Results.L.map((item) => ({
      position: parseInt(item.M.Position.N, 10), // Convert position to a number
      driver: item.M.Driver.S, // Extract driver name
      dnf: item.M.DNF.BOOL, // Extract DNF status
      fastestLap: item.M.Driver.S === fastestLapDriver, // Check if this driver got the fastest lap
    }));
  }
  const simplifiedData = simplifyRaceData(data);
  // console.log(simplifiedData);
  // [
  //   {
  //     position: 1,
  //     driver: 'Max Verstappen',
  //     dnf: false,
  //     fastestLap: false
  //   },
  //   { position: 2, driver: 'Lando Norris', dnf: false, fastestLap: true },
  //   {
  //     position: 3,
  //     driver: 'Lewis Hamilton',
  //     dnf: false,
  //     fastestLap: false
  //   },
  //   {
  //     position: 4,
  //     driver: 'Charles Leclerc',
  //     dnf: false,
  //     fastestLap: false
  //   },
  //   {
  //     position: 5,
  //     driver: 'Carlos Sainz',
  //     dnf: false,
  //     fastestLap: false
  //   },
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
    let earnedPoints = result.dnf ? 0 : pointsMap.get(result.position) || 0;
    // Add additional points if the driver has the fastest lap and didn't DNF
    if (result.fastestLap && !result.dnf) {
      earnedPoints += pointsMap.get("fastestLap") || 0;
    }
    // Return the updated driver object with new points
    return {
      position: result.position,
      driver: result.driver,
      points: (previousDriver?.points || 0) + earnedPoints,
      // dnf: result.dnf,
      // fastestLap: result.fastestLap,
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

async function main() {
  // RETURN NULL IF TYPE OF RESULT IS QUALI
  // get the latest drivers standings and results to perform computation

  // get the latest drivers standings
  const { data: driverStandings } = await fetchData(getDriversURL);
  // console.log(JSON.stringify(driverStandings, null, 2));
  // sorting all the returned dydb items by time, then passing in the most recent (first element) to be parsed
  const sortedDriverStandingsData = sortDataByTime(driverStandings);
  const parsedDriverStandingsData = parseDriversData(
    sortedDriverStandingsData[0]
  );
  console.log("parsedDriverStandingsData", parsedDriverStandingsData);

  // get the latest results
  const { data: results } = await fetchData(getResultsURL);
  const sortedResultsData = sortDataByTime(results);
  // console.log('sortedResultsData[0]', sortedResultsData[0]) - same as newItem in Lambda
  const parsedResultsData = parseResultsData(sortedResultsData[0]);
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

main();
