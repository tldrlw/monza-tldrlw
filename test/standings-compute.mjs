import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Environment variables from Lambda configuration
const getDriversURL = process.env.LAMBDA_GET_DRIVERS_FUNCTION_URL;
const getConstructorsURL = process.env.LAMBDA_GET_CONSTRUCTORS_FUNCTION_URL;
const getResultsURL = process.env.LAMBDA_GET_RESULTS_FUNCTION_URL;
// const constructorsTable = process.env.CONSTRUCTORS_DYDB_TABLE_NAME;
// const driversTable = process.env.DRIVERS_DYDB_TABLE_NAME;
// const testTable = process.env.TEST_DYDB_TABLE_NAME;
const region = process.env.REGION;

console.log("getDriversURL", getDriversURL);
console.log("getConstructorsURL", getConstructorsURL);
console.log("getResultsURL", getResultsURL);
// console.log("constructorsTable", constructorsTable);
// console.log("driversTable", driversTable);
// console.log("testTable", testTable);

// Sort by DateTime in descending order (most recent first)
export function sortDataByTime(data) {
  return data.slice().sort((a, b) => {
    const dateA = new Date(a.DateTime.S);
    const dateB = new Date(b.DateTime.S);
    return dateB - dateA;
  });
}

const scoringSystem = [
  { position: 1, points: 25 },
  { position: 2, points: 18 },
  { position: 3, points: 15 },
  { position: 4, points: 12 },
  { position: 5, points: 10 },
  { position: 6, points: 8 },
  { position: 7, points: 6 },
  { position: 8, points: 4 },
  { position: 9, points: 2 },
  { position: 10, points: 1 },
  { position: "fastestLap", points: 1 },
];

async function fetchData(endpoint) {
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
  console.log(parsedDriverStandingsData);
  // get the latest results
  const { data: results } = await fetchData(getResultsURL);
  const sortedResultsData = sortDataByTime(results);
  const parsedResultsData = parseResultsData(sortedResultsData[0]);
  console.log(parsedResultsData);
}

main();
