import { addItemToDynamoDB } from "./add.mjs"; // Assuming this is your add item file
import { scanDynamoDBTable } from "./scan.mjs"; // Your scan function
import { getRandomSentences } from "./utils.mjs";

// Define the async function to handle sequential execution
const run = async () => {
  try {
    // Provide data directly for local testing
    // const insights = ["Insight 1", "Insight 2", "Insight 3"]; // Example array of strings
    const insights = getRandomSentences(); // Example array of strings

    // Add the item to the DynamoDB table
    const addItemResponse = await addItemToDynamoDB(insights);
    console.log("Add Item Response:", addItemResponse);

    // After adding the item, scan the table to retrieve items
    const scanResponse = await scanDynamoDBTable();

    // Parse and pretty print the response body
    const parsedBody = JSON.parse(scanResponse.body);
    console.log(
      "Scan Response (pretty print):",
      JSON.stringify(parsedBody, null, 2)
    );
    // Pretty print with 2-space indentation

    console.log("Scan Response:", scanResponse);
  } catch (error) {
    console.error("Error occurred:", error);
  }
};

// Execute the function
run();
