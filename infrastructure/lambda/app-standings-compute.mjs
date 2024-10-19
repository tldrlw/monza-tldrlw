import {
  DynamoDBClient,
  BatchWriteItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb"; // ES Modules import
import { unmarshall } from "@aws-sdk/util-dynamodb"; // Import the unmarshall function

export const lambdaHandler = async (event, context) => {
  const { functionName, memoryLimitInMB, logGroupName, invokedFunctionArn } =
    context;

  // console.log("from `event.requestContext` and `context`", {
  //   functionName,
  //   memoryLimitInMB,
  //   logGroupName,
  //   invokedFunctionArn,
  // });

  // Environment variables from Lambda configuration
  const getDriversURL = process.env.LAMBDA_GET_DRIVERS_FUNCTION_URL;
  const getConstructorsURL = process.env.LAMBDA_GET_CONSTRUCTORS_FUNCTION_URL;
  const constructorsTable = process.env.CONSTRUCTORS_DYDB_TABLE_NAME;
  const driversTable = process.env.DRIVERS_DYDB_TABLE_NAME;
  const testTable = process.env.TEST_DYDB_TABLE_NAME;
  const region = process.env.REGION;
  console.log("getDriversURL", getDriversURL);
  console.log("getConstructorsURL", getConstructorsURL);
  console.log("constructorsTable", constructorsTable);
  console.log("driversTable", driversTable);
  console.log("testTable", testTable);

  console.log(
    "DynamoDB Stream event received:",
    JSON.stringify(event, null, 2)
  );

  // DynamoDB client configuration
  // const client = new DynamoDBClient({ region });

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

  // Loop through each record in the stream event
  for (const record of event.Records) {
    // Only process INSERT events
    if (record.eventName === "INSERT") {
      // console.log("New item inserted:", record.dynamodb.NewImage);
      // Extract the new item from the DynamoDB Stream event
      const newItem = unmarshall(record.dynamodb.NewImage);
      // console.log(JSON.stringify(newItem, null, 2));
      // get the latest drivers standings and results to perform computation
      const { data: driverStandings } = await fetchData(getDriversURL);
      console.log(driverStandings);
    }
  }

  return `Successfully processed ${event.Records.length} records.`;
};
