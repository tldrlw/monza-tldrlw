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
                    name: { S: standing.name }, // String
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
  // as of 10/21/24
  {
    position: 1,
    name: "Max Verstappen",
    team: "Red Bull Racing Honda RBPT",
    points: 354,
    nationality: "Netherlands 🇳🇱",
  },
  {
    position: 2,
    name: "Lando Norris",
    team: "McLaren Mercedes",
    points: 297,
    nationality: "United Kingdom 🇬🇧",
  },
  {
    position: 3,
    name: "Charles Leclerc",
    team: "Ferrari",
    points: 275,
    nationality: "Monaco 🇲🇨",
  },
  {
    position: 4,
    name: "Oscar Piastri",
    team: "McLaren Mercedes",
    points: 247,
    nationality: "Australia 🇦🇺",
  },
  {
    position: 5,
    name: "Carlos Sainz",
    team: "Ferrari",
    points: 215,
    nationality: "Spain 🇪🇸",
  },
  {
    position: 6,
    name: "Lewis Hamilton",
    team: "Mercedes",
    points: 177,
    nationality: "United Kingdom 🇬🇧",
  },
  {
    position: 7,
    name: "George Russell",
    team: "Mercedes",
    points: 167,
    nationality: "United Kingdom 🇬🇧",
  },
  {
    position: 8,
    name: "Sergio Perez",
    team: "Red Bull Racing Honda RBPT",
    points: 150,
    nationality: "Mexico 🇲🇽",
  },
  {
    position: 9,
    name: "Fernando Alonso",
    team: "Aston Martin Aramco Mercedes",
    points: 62,
    nationality: "Spain 🇪🇸",
  },
  {
    position: 10,
    name: "Nico Hulkenberg",
    team: "Haas Ferrari",
    points: 29,
    nationality: "Germany 🇩🇪",
  },
  {
    position: 11,
    name: "Lance Stroll",
    team: "Aston Martin Aramco Mercedes",
    points: 24,
    nationality: "Canada 🇨🇦",
  },
  {
    position: 12,
    name: "Yuki Tsunoda",
    team: "RB Honda RBPT",
    points: 22,
    nationality: "Japan 🇯🇵",
  },
  {
    position: 13,
    name: "Alexander Albon",
    team: "Williams Mercedes",
    points: 12,
    nationality: "Thailand 🇹🇭",
  },
  {
    position: 14,
    name: "Daniel Ricciardo",
    team: "RB Honda RBPT",
    points: 12,
    nationality: "Australia 🇦🇺",
  },
  {
    position: 15,
    name: "Kevin Magnussen",
    team: "Haas Ferrari",
    points: 8,
    nationality: "Denmark 🇩🇰",
  },
  {
    position: 16,
    name: "Pierre Gasly",
    team: "Alpine Renault",
    points: 8,
    nationality: "France 🇫🇷",
  },
  {
    position: 17,
    name: "Oliver Bearman",
    team: "Haas Ferrari",
    points: 7,
    nationality: "United Kingdom 🇬🇧",
  },
  {
    position: 18,
    name: "Franco Colapinto",
    team: "Williams Mercedes",
    points: 5,
    nationality: "Argentina 🇦🇷",
  },
  {
    position: 19,
    name: "Esteban Ocon",
    team: "Alpine Renault",
    points: 5,
    nationality: "France 🇫🇷",
  },
  {
    position: 20,
    name: "Liam Lawson",
    team: "RB Honda RBPT",
    points: 2,
    nationality: "New Zealand 🇳🇿",
  },
  {
    position: 21,
    name: "Zhou Guanyu",
    team: "Kick Sauber Ferrari",
    points: 0,
    nationality: "China 🇨🇳",
  },
  {
    position: 22,
    name: "Logan Sargeant",
    team: "Williams Mercedes",
    points: 0,
    nationality: "United States 🇺🇸",
  },
  {
    position: 23,
    name: "Valtteri Bottas",
    team: "Kick Sauber Ferrari",
    points: 0,
    nationality: "Finland 🇫🇮",
  },
];

addItemToDynamoDB(standings);
