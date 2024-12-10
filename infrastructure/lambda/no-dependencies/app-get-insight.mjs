import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb"; // ES Modules import
// import { unmarshall } from "@aws-sdk/util-dynamodb"; // Utility to unmarshall DynamoDB response

export const lambdaHandler = async (event, context) => {
  // Environment variables from Lambda configuration
  const tableName = process.env.DYDB_TABLE_NAME; // DynamoDB table name
  const region = process.env.REGION; // AWS region

  // Extracting primary key from the event object
  const primaryKey = event?.queryStringParameters?.primaryKey; // Expecting the key in query string parameters

  // Validate input: Check if primary key is provided
  if (!primaryKey) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Missing primary key in request",
      }),
    };
  }

  // DynamoDB client configuration
  const client = new DynamoDBClient({ region });

  // Define parameters for GetItemCommand
  const params = {
    TableName: tableName, // Your DynamoDB table name from the environment variable
    Key: {
      PK: { S: primaryKey }, // Replace 'PK' with your actual primary key attribute name
    },
  };

  try {
    const command = new GetItemCommand(params);
    const result = await client.send(command);

    // Check if the item exists
    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "Item not found",
        }),
      };
    }

    // Use the item as-is, without unmarshalling
    // Uncomment the following lines in the future if unmarshall is needed:
    // const item = unmarshall(result.Item);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "GetItem successful",
        // Replace 'result.Item' with 'item' if unmarshall is re-enabled
        data: result.Item,
      }),
    };
  } catch (error) {
    console.error("Error getting item from DynamoDB table:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to retrieve item",
        error: error.message,
      }),
    };
  }
};
