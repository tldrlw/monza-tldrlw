import { unstable_noStore as noStore } from "next/cache";
// import "../../envConfig";

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file); // Read the file as a data URL
    reader.onload = () => resolve(reader.result.split(",")[1]); // Extract Base64 part
    reader.onerror = (error) => reject(error);
  });

export default async function postImage(image, { lambdaPostImageFunctionUrl }) {
  // ^ since caller is a client component, logs will be in the browser

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

  // const { lambdaPostImageFunctionUrl } = lambdaPostImageFunctionUrl;

  try {
    // Send the payload to the API route
    const response = await fetch(lambdaPostImageFunctionUrl, requestOptions);
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
