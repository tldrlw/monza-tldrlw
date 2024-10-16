"use client"; // For client-side component

import postImage from "@/services/client/postImage";
import { useState } from "react";

export default function ImageUpload({ lambdaPostImageFunctionUrl }) {
  const [image, setImage] = useState(null); // Only the image is now required
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null); // State for upload result

  const handleFileChange = (e) => {
    setImage(e.target.files[0]); // Capture the selected file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please select an image to upload");
      return;
    }

    setUploading(true);

    try {
      // Pass the image to the postImage function
      const result = await postImage(image, lambdaPostImageFunctionUrl);
      setUploadResult(result); // Store the upload result in state
    } catch (error) {
      alert("Error uploading image: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="my-2 border-2 border-solid border-customOrangeLogo p-2 text-xs md:text-sm">
      <form onSubmit={handleSubmit}>
        <label htmlFor="uploadImage" className="block text-blue-500">
          Upload Image
        </label>

        {/* Container to align inputs and button inline */}
        <div className="mb-2 mt-3 flex items-center justify-between">
          {/* Inline inputs */}
          <div className="flex items-center">
            {/* Hidden file input */}
            <input
              id="fileInput"
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            {/* Styled label acting as the file input trigger */}
            <label
              htmlFor="fileInput"
              className="cursor-pointer rounded-md bg-slate-200 px-4 py-2 font-medium text-slate-600 transition duration-200 hover:bg-slate-600 hover:text-slate-200"
            >
              {image ? image.name : "Select Image"}
            </label>
          </div>

          {/* Upload button aligned to the right */}
          <button
            type="submit"
            disabled={uploading}
            className="rounded-md bg-customOrangeLogo px-4 py-2 font-medium text-white transition duration-200 hover:bg-black"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </form>

      {/* Conditionally render the upload result */}
      {uploadResult && (
        <div className="mt-4 border border-green-200 bg-green-100 p-4">
          <p className="mb-2">
            {uploadResult.message},{" "}
            <span className="underline">
              copy what&apos;s below to &quot;Image Link&quot;
            </span>
          </p>
          <a
            href={uploadResult.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {uploadResult.url}
          </a>
        </div>
      )}
    </div>
  );
}
