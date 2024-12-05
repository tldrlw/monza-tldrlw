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
export const addItemToDynamoDB = async (standings) => {
  const tableName = process.env.CONSTRUCTORS_DYDB_TABLE_NAME;

  // DynamoDB params for BatchWriteItemCommand with an array of objects
  const params = {
    RequestItems: {
      [tableName]: [
        {
          PutRequest: {
            Item: {
              PK: { S: generateUniqueId() },
              DateTime: { S: getISO8601Timestamp() },
              Standings: {
                L: standings.map((standing) => ({
                  M: {
                    position: { N: standing.position.toString() }, // Number as string
                    team: { S: standing.team }, // String
                    points: { N: standing.points.toString() }, // Number as string
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
};

const standings = [
  // as of 10/21/24
  { position: 1, team: "McLaren Mercedes", points: 544 },
  { position: 2, team: "Red Bull Racing Honda RBPT", points: 504 },
  { position: 3, team: "Ferrari", points: 496 },
  { position: 4, team: "Mercedes", points: 344 },
  { position: 5, team: "Aston Martin Aramco Mercedes", points: 86 },
  { position: 6, team: "Haas Ferrari", points: 38 },
  { position: 7, team: "RB Honda RBPT", points: 36 },
  { position: 8, team: "Williams Mercedes", points: 17 },
  { position: 9, team: "Alpine Renault", points: 13 },
  { position: 10, team: "Kick Sauber Ferrari", points: 0 },
];

addItemToDynamoDB(standings);
