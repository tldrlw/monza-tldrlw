import {
  DynamoDBClient,
  BatchWriteItemCommand,
} from "@aws-sdk/client-dynamodb"; // ES Modules import
import { unmarshall } from "@aws-sdk/util-dynamodb"; // Import the unmarshall function

export const lambdaHandler = async (event, context) => {
  const { functionName, memoryLimitInMB, logGroupName, invokedFunctionArn } =
    context;

  console.log("from `event.requestContext` and `context`", {
    functionName,
    memoryLimitInMB,
    logGroupName,
    invokedFunctionArn,
  });

  // Environment variables from Lambda configuration
  const resultsTableName = process.env.RESULTS_DYDB_TABLE_NAME;
  const constructorsTableName = process.env.CONSTRUCTORS_DYDB_TABLE_NAME;
  const driversTableName = process.env.DRIVERS_DYDB_TABLE_NAME;
  const testTableName = process.env.TEST_DYDB_TABLE_NAME;
  const region = process.env.REGION;

  console.log("resultsTableName", resultsTableName);
  console.log("constructorsTableName", constructorsTableName);
  console.log("driversTableName", driversTableName);
  console.log("testTableName", testTableName);

  console.log(
    "DynamoDB Stream event received:",
    JSON.stringify(event, null, 2)
  );

  // Loop through each record in the stream event
  for (const record of event.Records) {
    // Only process INSERT events
    if (record.eventName === "INSERT") {
      console.log("New item inserted:", record.dynamodb.NewImage);

      // Extract the new item from the DynamoDB Stream event
      const newItem = unmarshall(record.dynamodb.NewImage);

      console.log(newItem);

      // Prepare the item to write to the target DynamoDB table
      // const params = {
      //   TableName: 'target-table',  // Replace with your target DynamoDB table name
      //   Item: {
      //     id: newItem.id,  // Assuming 'id' is the key attribute
      //     name: newItem.name,  // Add any other attributes as needed
      //   },
      // };

      // Write the new item to the target DynamoDB table
      // try {
      //   await dynamoDB.put(params).promise();
      //   console.log("Successfully wrote item to target table:", params.Item);
      // } catch (error) {
      //   console.error("Error writing to target table:", error);
      // }
    }
  }

  // Function to generate a 10-character unique identifier
  // function generateUniqueId() {
  //   const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  //   let uniqueId = "";
  //   for (let i = 0; i < 10; i++) {
  //     uniqueId += characters.charAt(
  //       Math.floor(Math.random() * characters.length)
  //     );
  //   }
  //   return uniqueId;
  // }

  // Function to generate ISO 8601 timestamp
  // function getISO8601Timestamp(date = new Date()) {
  //   return date.toISOString();
  // }

  // Prepare DynamoDB Item with the new payload structure
  // const item = {
  //   PK: { S: generateUniqueId() },
  //   DateTime: { S: getISO8601Timestamp() },
  //   Title: { S: title },
  //   Link: { S: link },
  //   ImageLink: { S: imageLink },
  //   ImageCredit: { S: imageCredit },
  //   Team: { S: team },
  //   Type: { S: type },
  //   AIAssisted: { BOOL: aiAssisted },
  //   Prod: { BOOL: prod },
  //   AdditionalKeyword1: { S: additionalKeyword1 },
  //   AdditionalKeyword2: { S: additionalKeyword2 },
  //   AdditionalKeyword3: { S: additionalKeyword3 },
  //   AdditionalKeyword4: { S: additionalKeyword4 },
  //   AuthorsOrParticipants: { S: authorsOrParticipants },
  //   PublicationOrChannelOrOutlet: { S: publicationOrChannelOrOutlet },
  //   Insights: {
  //     L: insights.map((insight) => ({ S: insight })), // Convert array of strings into DynamoDB List format
  //   },
  // };

  // DynamoDB client configuration
  // const client = new DynamoDBClient({ region });

  // DynamoDB params for BatchWriteItemCommand
  // const params = {
  //   RequestItems: {
  //     [tableName]: [
  //       {
  //         PutRequest: {
  //           Item: item,
  //         },
  //       },
  //     ],
  //   },
  // };

  // try {
  //   const command = new BatchWriteItemCommand(params);
  //   const BatchWriteItemCommandReturnData = await client.send(command);
  //   return {
  //     statusCode: 200,
  //     body: JSON.stringify({
  //       message: "Write successful",
  //       unprocessedItems:
  //         BatchWriteItemCommandReturnData.UnprocessedItems || [],
  //     }),
  //   };
  // } catch (error) {
  //   console.error("Error writing to DynamoDB table:", error);
  //   return {
  //     statusCode: 500,
  //     body: JSON.stringify({
  //       message: "Failed to write to table",
  //       error: error.message,
  //     }),
  //   };
  // }

  return `Successfully processed ${event.Records.length} records.`;
};
