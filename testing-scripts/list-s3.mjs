// Import the necessary AWS SDK clients and commands
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

// Function to list objects in the S3 bucket
async function listS3Objects(bucketName, region) {
  const client = new S3Client({ region }); // Replace with your region

  const params = {
    Bucket: bucketName, // Your S3 bucket name
  };

  try {
    const command = new ListObjectsV2Command(params);
    const data = await client.send(command);

    if (data.Contents) {
      console.log(
        `Found ${data.Contents.length} objects in bucket ${bucketName}:`
      );
      data.Contents.forEach((obj) => {
        console.log(`- ${obj.Key} (Size: ${obj.Size} bytes)`);
      });
    } else {
      console.log(`No objects found in bucket ${bucketName}.`);
    }
  } catch (error) {
    console.error("Error listing objects:", error);
  }
}

// Call the function with your S3 bucket name
const bucketName = "monza-tldrlw-images";
const region = "us-east-1";
listS3Objects(bucketName, region);
