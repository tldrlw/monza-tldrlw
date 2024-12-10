import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Buffer } from "buffer";
import { fileTypeFromBuffer } from "file-type"; // Import the file-type library

// Initialize the S3 client outside the handler for reuse
const s3Client = new S3Client({ region: process.env.REGION });

// Helper function to generate a 10-character unique identifier
const generateUniqueId = () => {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: 10 })
    .map(() => characters.charAt(Math.floor(Math.random() * characters.length)))
    .join("");
};

// Helper function to generate ISO 8601 timestamp
const getISO8601Timestamp = (date = new Date()) => date.toISOString();

// Helper function to decode Base64 and detect file type
const decodeAndDetermineFileType = async (imageBase64) => {
  const imageBuffer = Buffer.from(imageBase64, "base64");
  const fileTypeResult = await fileTypeFromBuffer(imageBuffer);
  if (!fileTypeResult) throw new Error("Unsupported file type");
  return {
    imageBuffer,
    imageType: fileTypeResult.mime,
    extension: fileTypeResult.ext,
  };
};

// Logs important context information for debugging
const logContext = (event, context) => {
  const { domainName, http, time } = event.requestContext;
  const { functionName, memoryLimitInMB, logGroupName, invokedFunctionArn } =
    context;
  console.log("RequestContext and Context:", {
    domainName,
    method: http.method,
    sourceIp: http.sourceIp,
    userAgent: http.userAgent,
    time,
    functionName,
    memoryLimitInMB,
    logGroupName,
    invokedFunctionArn,
  });
};

// Parses the request body and handles errors
const parseRequestBody = (body) => {
  try {
    return JSON.parse(body);
  } catch {
    throw new Error("Invalid JSON in request body");
  }
};

// Creates parameters for uploading the image to S3
const createS3UploadParams = (imageBuffer, imageType, extension) => ({
  Bucket: process.env.S3_BUCKET_NAME,
  Key: `insights/${generateUniqueId()}.${extension}`,
  Body: imageBuffer,
  ContentType: imageType,
  Metadata: {
    uploadedTimestamp: getISO8601Timestamp(),
    "cache-control": "public, max-age=31536000, immutable",
  },
  // CacheControl: "public, max-age=31536000, immutable", // Cache-Control metadata
});
// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/command/PutObjectCommand/

// Uploads the image to S3
const uploadImageToS3 = async (params) => {
  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  // const region = process.env.REGION;
  const bucketName = process.env.S3_BUCKET_NAME;
  return `https://${bucketName}.s3.amazonaws.com/${params.Key}`;
};

// Success response for image upload
const successResponse = (s3Url) => ({
  statusCode: 200,
  body: JSON.stringify({
    message: "Image uploaded successfully",
    url: s3Url,
  }),
});

// Error response handler
const errorResponse = (message) => ({
  statusCode: 400,
  body: JSON.stringify({ message }),
});

// Main Lambda handler
export const lambdaHandler = async (event, context) => {
  try {
    // Extract request context info
    logContext(event, context);

    // Parse and validate request body
    const { imageBase64 } = parseRequestBody(event.body);
    if (!imageBase64) throw new Error("Image missing in request");

    // Decode image and determine file type
    const { imageBuffer, imageType, extension } =
      await decodeAndDetermineFileType(imageBase64);
    console.log("Detected image type:", imageType);

    // Define S3 upload parameters
    const params = createS3UploadParams(imageBuffer, imageType, extension);

    // Upload to S3 and return response
    const s3Url = await uploadImageToS3(params);
    return successResponse(s3Url);
  } catch (error) {
    console.error("Error processing request:", error.message);
    return errorResponse(error.message);
  }
};
