import sizeOf from "image-size";
import { promisify } from "util";

const sizeOfAsync = promisify(sizeOf);

// Function to get scaled image dimensions from a remote image URL
export default async function resizeImage(imageUrl, scaleFactor) {
  try {
    // Fetch the remote image using native fetch
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch image. Status: ${response.status}`);
    }

    // Convert the response to an array buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer); // Convert the array buffer to a Node.js Buffer

    // Get the image dimensions from the buffer
    const dimensions = await sizeOfAsync(buffer);

    // Calculate the scaled dimensions with precision (retaining two decimal places)
    const scaledWidth = Math.round(dimensions.width * scaleFactor * 100) / 100;
    const scaledHeight =
      Math.round(dimensions.height * scaleFactor * 100) / 100;

    // Return the scaled dimensions
    return {
      width: scaledWidth,
      height: scaledHeight,
    };
  } catch (error) {
    console.error("Error fetching or processing the image:", error);
    throw new Error("Failed to resize the image");
  }
}
