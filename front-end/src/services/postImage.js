import { unstable_noStore as noStore } from "next/cache";
// import "../../envConfig";

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file); // Read the file as a data URL
    reader.onload = () => resolve(reader.result.split(",")[1]); // Extract Base64 part
    reader.onerror = (error) => reject(error);
  });

export default async function postImage(image, functionUrl) {
  // "use server";
  // ^ since caller is a client component, logs will be in the browser

  noStore(); // Opt into dynamic rendering
  // This value will be evaluated at runtime
  const lambdaPostImageFunctionUrl =
    // process.env.NEXT_PUBLIC_LAMBDA_POST_IMAGE_FUNCTION_URL ||
    process.env.NEXT_PUBLIC_LAMBDA_POST_IMAGE_FUNCTION_URL ||
    "lambdaPostImageFunctionUrl placeholder";
  // ^ "NEXT_PUBLIC_" since this runs in the browser

  console.log(
    "front-end/src/services/postImage.js - image, lambdaPostImageFunctionUrl",
    image,
    lambdaPostImageFunctionUrl,
  );

  // Convert the image to Base64
  const imageBase64 = await fileToBase64(image);

  // Prepare the payload
  const payload = {
    imageBase64, // Send the Base64 encoded image
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  try {
    // Send the payload to the API route
    console.log(functionUrl)
    const response = await fetch(functionUrl.functionUrl, requestOptions);
    const result = await response.json();
    if (!response.ok) {
      throw new Error(
        result.message ||
          "front-end/src/services/postImage.js - API call - Failed to upload image",
      );
    }
    console.log(result);
    return result;
  } catch (error) {
    console.error(
      "front-end/src/services/postImage.js - API call - Error uploading image:",
      error,
    );
    throw error;
  }
}
