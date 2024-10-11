import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Buffer } from "buffer";
import { fileTypeFromBuffer } from "file-type"; // Import the file-type library

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
  const bucketName = process.env.S3_BUCKET_NAME;
  const region = process.env.REGION;

  // DynamoDB client configuration
  const s3Client = new S3Client({ region });

  // Extract request body and decode if Base64
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
  // Extract image data (assuming it's Base64-encoded string)
  const { imageBase64 } = requestBody;

  console.log("`requestBody`", requestBody);

  if (!imageBase64) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Image missing in request",
      }),
    };
  }

  // Decode Base64-encoded image
  const imageBuffer = Buffer.from(imageBase64, "base64");

  // Use file-type to detect the image MIME type from the buffer
  const fileTypeResult = await fileTypeFromBuffer(imageBuffer);
  if (!fileTypeResult) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Unsupported file type or could not determine file type",
      }),
    };
  }

  const { mime: imageType } = fileTypeResult; // Extract the MIME type

  // Extract the file extension from the MIME type (e.g., image/jpeg -> jpeg)
  const extension = imageType.split("/")[1]; // This will give you "jpeg", "png", etc.

  console.log("Detected image type:", imageType);

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

  // Add timestamp as metadata
  const metadata = {
    uploadedTimestamp: getISO8601Timestamp(),
  };

  // S3 upload parameters
  const params = {
    Bucket: bucketName, // Your S3 bucket name from environment variable
    Key: `insights/${generateUniqueId()}.${extension}`, // File path inside the S3 bucket
    Body: imageBuffer, // Image data
    ContentType: imageType, // Adjust to the correct MIME type
    Metadata: metadata, // Attach the timestamp as metadata
  };

  try {
    const command = new PutObjectCommand(params);
    const s3Response = await s3Client.send(command);

    // Construct the S3 URL
    const s3Url = `https://${bucketName}.s3.${region}.amazonaws.com/${params.Key}`;

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Image uploaded successfully",
        s3Response,
        url: s3Url,
      }),
    };
  } catch (error) {
    console.error("Error uploading image to S3:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to upload image",
        error: error.message,
      }),
    };
  }
};
