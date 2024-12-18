import InsightImage from "@/components/insight/Image";
import InsightText from "@/components/insight/Text";
import InsightTop from "@/components/insight/Top";

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
          <InsightTop insight={insight}></InsightTop>
          <InsightText insight={insight} dashboardView={dashboardView} />
        </div>

        {/* Render the insight's associated image */}
        <div className="my-4 flex items-center justify-end md:my-0 md:basis-4/12">
          <InsightImage insight={insight}></InsightImage>
        </div>
      </div>

      {/* Render for mobile viewport */}
      <InsightText viewport={"mobile"} insight={insight} />
    </div>
  );
}

// The issue you are encountering is due to Next.js’s built-in Image Optimization API, which modifies the image URL for performance improvements like resizing and quality adjustments. This is why the URL is being rewritten to include /_next/image?url=.... When Next.js tries to fetch the image, it optimizes it and appends parameters like w=1080 (width) and q=75 (quality), and includes the original S3 URL in the url query parameter. If you only want to disable optimization for certain images, you can use the unoptimized attribute in the Image component to bypass the Image Optimization API. This will prevent Next.js from modifying the URL and will serve the image directly from S3.
