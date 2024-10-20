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
  const tableName = process.env.DRIVERS_DYDB_TABLE_NAME;

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
                    driver: { S: standing.driver }, // String
                    team: { S: standing.team }, // String
                    points: { N: standing.points.toString() }, // Number as string
                    nationality: { S: standing.nationality }, // String
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
  {
    position: 1,
    driver: "Max Verstappen",
    team: "Red Bull Racing",
    points: 331,
    nationality: "Netherlands 🇳🇱",
  },
  {
    position: 2,
    driver: "Lando Norris",
    team: "McLaren",
    points: 279,
    nationality: "United Kingdom 🇬🇧",
  },
  {
    position: 3,
    driver: "Charles Leclerc",
    team: "Ferrari",
    points: 245,
    nationality: "Monaco 🇲🇨",
  },
  {
    position: 4,
    driver: "Oscar Piastri",
    team: "McLaren",
    points: 237,
    nationality: "Australia 🇦🇺",
  },
  {
    position: 5,
    driver: "Carlos Sainz",
    team: "Ferrari",
    points: 190,
    nationality: "Spain 🇪🇸",
  },
  {
    position: 6,
    driver: "Lewis Hamilton",
    team: "Mercedes",
    points: 174,
    nationality: "United Kingdom 🇬🇧",
  },
  {
    position: 7,
    driver: "George Russell",
    team: "Mercedes",
    points: 155,
    nationality: "United Kingdom 🇬🇧",
  },
  {
    position: 8,
    driver: "Sergio Perez",
    team: "Red Bull Racing",
    points: 144,
    nationality: "Mexico 🇲🇽",
  },
  {
    position: 9,
    driver: "Fernando Alonso",
    team: "Aston Martin Aramco",
    points: 62,
    nationality: "Spain 🇪🇸",
  },
  {
    position: 10,
    driver: "Nico Hulkenberg",
    team: "Haas",
    points: 24,
    nationality: "Germany 🇩🇪",
  },
  {
    position: 11,
    driver: "Lance Stroll",
    team: "Aston Martin Aramco",
    points: 24,
    nationality: "Canada 🇨🇦",
  },
  {
    position: 12,
    driver: "Yuki Tsunoda",
    team: "RB",
    points: 22,
    nationality: "Japan 🇯🇵",
  },
  {
    position: 13,
    driver: "Alexander Albon",
    team: "Williams",
    points: 12,
    nationality: "Thailand 🇹🇭",
  },
  {
    position: 14,
    driver: "Daniel Ricciardo",
    team: "RB",
    points: 12,
    nationality: "Australia 🇦🇺",
  },
  {
    position: 15,
    driver: "Pierre Gasly",
    team: "Alpine",
    points: 8,
    nationality: "France 🇫🇷",
  },
  {
    position: 16,
    driver: "Oliver Bearman",
    team: "Haas",
    points: 7,
    nationality: "United Kingdom 🇬🇧",
  },
  {
    position: 17,
    driver: "Kevin Magnussen",
    team: "Haas",
    points: 6,
    nationality: "Denmark 🇩🇰",
  },
  {
    position: 18,
    driver: "Esteban Ocon",
    team: "Alpine",
    points: 5,
    nationality: "France 🇫🇷",
  },
  {
    position: 19,
    driver: "Franco Colapinto",
    team: "Williams",
    points: 4,
    nationality: "Argentina 🇦🇷",
  },
  {
    position: 20,
    driver: "Zhou Guanyu",
    team: "Kick Sauber",
    points: 0,
    nationality: "China 🇨🇳",
  },
  {
    position: 21,
    driver: "Logan Sargeant",
    team: "Williams",
    points: 0,
    nationality: "United States 🇺🇸",
  },
  {
    position: 22,
    driver: "Valtteri Bottas",
    team: "Kick Sauber",
    points: 0,
    nationality: "Finland 🇫🇮",
  },
  {
    position: 23,
    driver: "Liam Lawson",
    team: "RB",
    points: 0,
    nationality: "New Zealand 🇳🇿",
  },
];

addItemToDynamoDB(standings);
