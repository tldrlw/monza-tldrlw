import {
  DynamoDBClient,
  BatchWriteItemCommand,
} from "@aws-sdk/client-dynamodb";
import dotenv from "dotenv";
import { generateUniqueId, getISO8601Timestamp } from "./utils.mjs";

// Load environment variables from .env file
dotenv.config();

// DynamoDB client configuration
const client = new DynamoDBClient({
  region: process.env.REGION,
});

// Function to add an item to DynamoDB
export const addItemToDynamoDB = async (testResult) => {
  const tableName = process.env.RESULTS_DYDB_TABLE_NAME;

  const { race, type, fastestLap, driverOfTheDay, result } = testResult;

  // Prepare DynamoDB Item with the new payload structure
  const item = {
    PK: { S: generateUniqueId() },
    DateTime: { S: getISO8601Timestamp() },
    Race: { S: race },
    Type: { S: type },
    FastestLap: { S: fastestLap },
    DriverOfTheDay: { S: driverOfTheDay },
    Results: {
      L: result.map((item) => ({
        M: {
          Position: { N: item.position.toString() },
          Driver: { S: item.driver },
          DNF: { BOOL: item.dnf },
        },
      })), // Convert array into DynamoDB List format
    },
  };

  // DynamoDB params for BatchWriteItemCommand
  const params = {
    RequestItems: {
      [tableName]: [
        {
          PutRequest: {
            Item: item,
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
};

const testResult = {
  race: "British Grand Prix",
  type: "Race",
  // type: "Sprint",
  fastestLap: "Lando Norris", // Fastest lap by a driver who finished the race
  driverOfTheDay: "Lando Norris",
  result: [
    {
      position: 1,
      driver: "Max Verstappen",
      dnf: false,
    },
    {
      position: 2,
      driver: "Lando Norris",
      dnf: false,
    },
    {
      position: 3,
      driver: "Lewis Hamilton",
      dnf: false,
    },
    {
      position: 4,
      driver: "Charles Leclerc",
      dnf: false,
    },
    {
      position: 5,
      driver: "Carlos Sainz",
      dnf: false,
    },
    {
      position: 6,
      driver: "George Russell",
      dnf: false,
    },
    {
      position: 7,
      driver: "Sergio Perez",
      dnf: false,
    },
    {
      position: 8,
      driver: "Oscar Piastri",
      dnf: false,
    },
    {
      position: 9,
      driver: "Fernando Alonso",
      dnf: false,
    },
    {
      position: 10,
      driver: "Esteban Ocon",
      dnf: false,
    },
    {
      position: 11,
      driver: "Pierre Gasly",
      dnf: false,
    },
    {
      position: 12,
      driver: "Lance Stroll",
      dnf: false,
    },
    {
      position: 13,
      driver: "Yuki Tsunoda",
      dnf: false,
    },
    {
      position: 14,
      driver: "Alexander Albon",
      dnf: false,
    },
    {
      position: 15,
      driver: "Valtteri Bottas",
      dnf: false,
    },
    {
      position: 16,
      driver: "Kevin Magnussen",
      dnf: false,
    },
    {
      position: 17,
      driver: "Nico Hulkenberg",
      dnf: false,
    },
    {
      position: 18,
      driver: "Zhou Guanyu",
      dnf: true, // Did not finish
    },
    {
      position: 19,
      driver: "Logan Sargeant",
      dnf: true, // Did not finish
    },
    {
      position: 20,
      driver: "Daniel Ricciardo",
      dnf: true, // Did not finish
    },
  ],
};

addItemToDynamoDB(testResult);
