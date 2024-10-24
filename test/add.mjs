import {
  DynamoDBClient,
  BatchWriteItemCommand,
} from "@aws-sdk/client-dynamodb";
import dotenv from "dotenv";
import {
  generateUniqueId,
  getISO8601Timestamp,
  getSource,
  getRandomF1Team,
} from "./utils.mjs";

// Load environment variables from .env file
dotenv.config();

// DynamoDB client configuration
const client = new DynamoDBClient({
  region: process.env.REGION,
});

// Function to add an item to DynamoDB
export const addItemToDynamoDB = async (insights) => {
  const tableName = process.env.DYDB_TABLE_NAME;

  // DynamoDB params for BatchWriteItemCommand with an array of strings
  const params = {
    RequestItems: {
      [tableName]: [
        {
          PutRequest: {
            Item: {
              PK: { S: generateUniqueId() },
              DateTime: { S: getISO8601Timestamp() },
              Title: { S: "Test" },
              Link: { S: "https://blog.tldrlw.com" },
              ImageLink: {
                S: "https://monza-tldrlw-images.s3.amazonaws.com/insights/bjynj5rmw1.jpg",
              },
              ImageCredit: { S: "Haas Formula 1 Team" },
              Team: { S: getRandomF1Team() },
              Type: { S: getSource() },
              AIAssisted: { BOOL: true },
              Prod: { BOOL: false },
              AdditionalKeyword: { S: "Toyota" },
              AuthorsOrParticipants: { S: "Lawrence Barretto" },
              PublicationOrChannelOrOutlet: { S: "Formula 1 website" },
              Insights: {
                L: insights.map((insight) => ({ S: insight })), // Convert array of strings into DynamoDB List format
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
    // console.log("Write successful:", result);
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
