import get from "@/services/get";
import Image from "next/image";
import Pills from "./Pills";
import Insight from "./Insight";
import { sortDataByTime } from "@/utils";

export default async function ListInsights({ dashboardView }) {
  const { data: insights } = await get("insights");
  // ^ getInsights() returns the following, so destructuring out "data" and renaming the array to "insights"
  const sortedInsights = sortDataByTime(insights);
  // console.log(sortedInsights);

  console.log(
    "front-end/src/components/ListInsights.js - # of insights - ",
    insights.length,
  );

  // delete later

  // console.log(insights);
  // console.log(JSON.stringify(insights, null, 2));

  const getImageSrc = (imageLink) => {
    // console.log(imageLink);
    const defaultImage =
      // "https://monza-tldrlw-images.s3.amazonaws.com/logos/logo-white.svg";
      "https://monza-tldrlw-images.s3.amazonaws.com/logos/logo-no-background.svg";
    const validUrlPattern =
      /^https:\/\/monza-tldrlw-images\.s3\.amazonaws\.com\/insights\//;
    // Check if imageLink is a valid URL
    if (!imageLink) {
      console.warn("Missing or undefined imageLink, using default image.");
      return defaultImage;
    }
    try {
      const url = new URL(imageLink); // Validate if imageLink is a valid URL
      if (validUrlPattern.test(url.href)) {
        return imageLink; // If it matches the pattern, return the image URL
      } else {
        console.warn("Invalid URL pattern, using default image:", imageLink);
        return defaultImage; // Invalid pattern, return default
      }
    } catch (err) {
      console.error("Error parsing image URL, using default image:", err);
      return defaultImage; // If invalid URL format, return default
    }
  };

  return (
    <div>
      {sortedInsights.map((insight, index) => (
        <div
          key={index}
          className="my-2 border-2 border-solid border-customOrangeLogo p-2"
        >
          <div className="">
            {/* Render the list of strings properly */}
            <div className="md:flex md:flex-row">
              <div className="mb-2 md:basis-4/6">
                {dashboardView && (
                  <p className="mb-4 font-bold">ID: {insight.PK.S}</p>
                )}
                {insight.Link.S === "monza.tldrlw.com" ? (
                  <span className="text-base font-bold text-slate-800 md:text-lg">
                    {insight.Title.S}
                  </span>
                ) : (
                  <a
                    href={insight.Link.S}
                    className="text-base font-bold text-blue-500 hover:underline md:text-lg"
                  >
                    {insight.Title.S}
                  </a>
                )}
                <Pills insight={insight} dashboardView={dashboardView}></Pills>
                <Insight insight={insight}></Insight>
              </div>
              <div className="flex items-center justify-end md:basis-2/6">
                <Image
                  src={getImageSrc(insight.ImageLink?.S)} // Use the helper function to get the correct src
                  alt={
                    insight.ImageCredit?.S ||
                    "tldrlw logo/no image credit provided"
                  }
                  priority
                  width={500}
                  height={125}
                  unoptimized // Disable image optimization for this specific image
                  // without ^, uploaded images couldn't be fetched when deployed to prod (400 error, 'url' related), BUT no issues in dev / see notes section at the end
                />
              </div>
            </div>
            <Insight viewport={"mobile"} insight={insight}></Insight>
          </div>
        </div>
      ))}
    </div>
  );
}

// The issue you are encountering is due to Next.js’s built-in Image Optimization API, which modifies the image URL for performance improvements like resizing and quality adjustments. This is why the URL is being rewritten to include /_next/image?url=.... When Next.js tries to fetch the image, it optimizes it and appends parameters like w=1080 (width) and q=75 (quality), and includes the original S3 URL in the url query parameter. If you only want to disable optimization for certain images, you can use the unoptimized attribute in the Image component to bypass the Image Optimization API. This will prevent Next.js from modifying the URL and will serve the image directly from S3.
