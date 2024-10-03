import {
  DynamoDBClient,
  ScanCommand,
  DeleteItemCommand,
} from "@aws-sdk/client-dynamodb"; // ES Modules import
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// DynamoDB client configuration
const client = new DynamoDBClient({
  region: process.env.REGION,
});

async function deleteAllItemsFromTable() {
  const tableName = process.env.DYDB_TABLE_NAME;

  try {
    // Scan the table to get all items
    const scanParams = {
      TableName: tableName,
    };

    const scanCommand = new ScanCommand(scanParams);
    const scanResult = await client.send(scanCommand);

    const items = scanResult.Items;

    if (!items || items.length === 0) {
      console.log("No items found to delete.");
      return;
    }

    console.log(`${items.length} items found. Deleting...`);

    // Delete items one by one using DeleteItemCommand
    for (const item of items) {
      const deleteParams = {
        TableName: tableName,
        Key: {
          PK: item.PK, // Use your table's primary key (adjust accordingly)
          // Add your sort key here if applicable, e.g., SK: item.SK
        },
      };

      const deleteCommand = new DeleteItemCommand(deleteParams);
      await client.send(deleteCommand);

      console.log(`Item with PK: ${item.PK.S} deleted successfully.`);
    }

    console.log("All items deleted successfully.");
  } catch (error) {
    console.error("Error deleting items from DynamoDB:", error);
  }
}

// Execute the function
deleteAllItemsFromTable();
