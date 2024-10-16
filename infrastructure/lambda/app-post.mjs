import {
  DynamoDBClient,
  BatchWriteItemCommand,
} from "@aws-sdk/client-dynamodb"; // ES Modules import

export const lambdaHandler = async (event, context) => {
  // Extracting requestContext and context info
  const { domainName, http, time } = event.requestContext;
  const { functionName, memoryLimitInMB, logGroupName, invokedFunctionArn } =
    context;

  console.log("from `event.requestContext` and `context`", {
    domainName,
    method: http.method,
    sourceIp: http.sourceIp,
    userAgent: http.userAgent,
    time,
    // below from context
    functionName,
    memoryLimitInMB,
    logGroupName,
    invokedFunctionArn,
  });

  // Environment variables from Lambda configuration
  const tableName = process.env.DYDB_TABLE_NAME;
  const region = process.env.REGION;

  // Extract request body from event
  let requestBody;
  try {
    requestBody = JSON.parse(event.body);
  } catch (err) {
    console.error("Error parsing request body:", err);
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Invalid JSON in request body",
      }),
    };
  }

  // Destructure the expected payload from the request body
  const {
    title,
    link,
    imageLink,
    imageCredit,
    team,
    type,
    aiAssisted,
    prod,
    additionalKeyword1,
    additionalKeyword2,
    additionalKeyword3,
    publicationOrChannelOrOutlet,
    authorsOrParticipants,
    insights, // This should now be an array of strings
  } = requestBody;

  console.log("`requestBody`", requestBody);

  // Function to generate a 10-character unique identifier
  function generateUniqueId() {
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    let uniqueId = "";
    for (let i = 0; i < 10; i++) {
      uniqueId += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return uniqueId;
  }

  // Function to generate ISO 8601 timestamp
  function getISO8601Timestamp(date = new Date()) {
    return date.toISOString();
  }

  // Prepare DynamoDB Item with the new payload structure
  const item = {
    PK: { S: generateUniqueId() },
    DateTime: { S: getISO8601Timestamp() },
    Title: { S: title },
    Link: { S: link },
    ImageLink: { S: imageLink },
    ImageCredit: { S: imageCredit },
    Team: { S: team },
    Type: { S: type },
    AIAssisted: { BOOL: aiAssisted },
    Prod: { BOOL: prod },
    AdditionalKeyword1: { S: additionalKeyword1 },
    AdditionalKeyword2: { S: additionalKeyword2 },
    AdditionalKeyword3: { S: additionalKeyword3 },
    AdditionalKeyword4: { S: additionalKeyword4 },
    AuthorsOrParticipants: { S: authorsOrParticipants },
    PublicationOrChannelOrOutlet: { S: publicationOrChannelOrOutlet },
    Insights: {
      L: insights.map((insight) => ({ S: insight })), // Convert array of strings into DynamoDB List format
    },
  };

  // DynamoDB client configuration
  const client = new DynamoDBClient({ region });

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
    const BatchWriteItemCommandReturnData = await client.send(command);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Write successful",
        unprocessedItems:
          BatchWriteItemCommandReturnData.UnprocessedItems || [],
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
