import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb"; // ES Modules import

export const lambdaHandler = async (event, context) => {
  // Environment variables from Lambda configuration
  const limitAsEnvVar = process.env.LIMIT; // assuming it's coming from an environment variable
  const limit = parseInt(limitAsEnvVar, 10) ?? 30; // Convert to integer, fallback to 10 if null or undefined
  const tableName = process.env.DRIVERS_DYDB_TABLE_NAME;
  const region = process.env.REGION;

  // DynamoDB client configuration
  const client = new DynamoDBClient({ region });
  // Define parameters for ScanCommand
  const params = {
    TableName: tableName, // Your DynamoDB table name from environment variable
    Limit: limit, // Optionally, you can use the limit environment variable to limit the number of items returned
  };

  try {
    const command = new ScanCommand(params);
    const ScanCommandReturnData = await client.send(command);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Scan successful",
        data: ScanCommandReturnData.Items, // Returns the items from the table
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
