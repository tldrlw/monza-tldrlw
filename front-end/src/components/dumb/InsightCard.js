import Image from "next/image";
import Pills from "@/components/Pills";
import InsightText from "@/components/dumb/InsightText";
import { getImageSrc } from "@/utils";
import { formatToHumanReadable } from "@/utils";

export default function InsightCard({ insight, dashboardView = false }) {
  return (
    <div className="my-2 border-2 border-solid border-customOrangeLogo p-2">
      <div className="md:flex md:flex-row">
        {/* Text content for the insight */}
        <div className="mb-2 md:mb-0 md:basis-8/12 md:pr-10">
          {dashboardView && (
            <p className="font-bold md:text-sm">
              {/* Display the primary key for dashboard view */}
              {insight.PK.S}
            </p>
          )}
          {insight.Link.S === "monza.tldrlw.com" ? (
            // If the link is internal, render as plain text
            <span className="text-base font-bold text-slate-800 md:text-lg">
              {insight.Title.S}
            </span>
          ) : (
            // If the link is external, render as a hyperlink
            <a
              href={insight.Link.S}
              className="text-base font-bold text-blue-500 hover:underline md:text-lg"
            >
              {insight.Title.S}
            </a>
          )}
          {/* Render Pills and additional insight details */}
          <p className="text-sm text-gray-500">
            {formatToHumanReadable(insight.DateTime.S)}
          </p>
          <Pills insight={insight} dashboardView={dashboardView} />
          <InsightText insight={insight} dashboardView={dashboardView} />
        </div>

        {/* Render the insight's associated image */}
        <div className="my-4 flex items-center justify-end md:my-0 md:basis-4/12">
          <Image
            src={getImageSrc(insight.ImageLink?.S)} // Use the helper function to get the correct src
            alt={
              insight.ImageCredit?.S || "tldrlw logo/no image credit provided"
            }
            priority
            width={500} // Adjust width for appropriate display
            height={125} // Adjust height proportionally to width
            unoptimized // Disable image optimization for this specific image
            // without ^, uploaded images couldn't be fetched when deployed to prd (400 error, 'url' related), BUT no issues in dev, see notes section at the end
            className="shadow-lg"
          />
        </div>
      </div>

      {/* Render for mobile viewport */}
      <InsightText viewport={"mobile"} insight={insight} />
    </div>
  );
}

// The issue you are encountering is due to Next.js’s built-in Image Optimization API, which modifies the image URL for performance improvements like resizing and quality adjustments. This is why the URL is being rewritten to include /_next/image?url=.... When Next.js tries to fetch the image, it optimizes it and appends parameters like w=1080 (width) and q=75 (quality), and includes the original S3 URL in the url query parameter. If you only want to disable optimization for certain images, you can use the unoptimized attribute in the Image component to bypass the Image Optimization API. This will prevent Next.js from modifying the URL and will serve the image directly from S3.
