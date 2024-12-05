import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Exportable function to scan the DynamoDB table
export const scanDynamoDBTable = async () => {
  const limit = 20;
  // Environment variables from .env file
  const tableName = process.env.DYDB_TABLE_NAME;
  const region = process.env.REGION;

  // DynamoDB client configuration
  const client = new DynamoDBClient({ region });

  // Define parameters for ScanCommand
  const params = {
    TableName: tableName,
    Limit: limit, // Use the limit from the environment variables
  };

  try {
    const command = new ScanCommand(params);
    const ScanCommandReturnData = await client.send(command);
    // console.log("Scan successful:", ScanCommandReturnData.Items);
    console.log("Scan successful:");
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Scan successful",
        data: ScanCommandReturnData.Items,
      }),
    };
  } catch (error) {
    console.error("Error scanning DynamoDB table:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to scan table",
        error: error.message,
      }),
    };
  }
};
