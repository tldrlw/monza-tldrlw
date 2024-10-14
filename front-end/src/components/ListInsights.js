import getInsights from "@/services/getInsights";
import Image from "next/image";
import Pill from "./Pill";

export default async function ListInsights({ dashboardView }) {
  const { data: insights } = await getInsights();
  // ^ getInsights() returns the following, so destructuring out "data" and renaming the array to "insights"

  console.log(
    "front-end/src/components/ListInsights.js - # of insights - ",
    insights.length,
  );

  console.log(insights);

  // Sort by DateTime in descending order (most recent first)
  const sortedInsights = insights.sort((a, b) => {
    const dateA = new Date(a.DateTime.S);
    const dateB = new Date(b.DateTime.S);
    return dateB - dateA; // Sort in descending order
  });

  function formatToHumanReadable(isoString) {
    const date = new Date(isoString);
    const options = {
      year: "numeric",
      month: "long", // Full month name (e.g., September)
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZoneName: "short", // Includes time zone (e.g., GMT)
    };
    // Format the date using Intl.DateTimeFormat
    return new Intl.DateTimeFormat("en-US", options).format(date);
  }

  const getImageSrc = (imageLink) => {
    console.log(imageLink);
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
          <div className="text-xs md:text-sm">
            {/* Render the list of strings properly */}
            <div className="md:flex md:flex-row">
              <div className="mb-2 text-sm md:basis-4/6">
                {dashboardView && (
                  <p className="mb-4 font-bold">ID: {insight.PK.S}</p>
                )}
                <a
                  href={insight.Link.S}
                  className="text-blue-500 hover:underline md:text-lg"
                >
                  {insight.Title.S}
                </a>
                <Pills insight={insight}></Pills>
                <Insight insight={insight}></Insight>
              </div>
              {/* <div className="flex items-center justify-end border border-lime-500 md:basis-2/6"> */}
              <div className="flex items-center justify-end md:basis-2/6">
                <Image
                  src={getImageSrc(insight.ImageLink?.S)} // Use the helper function to get the correct src
                  alt={insight.ImageLink?.S || "tldrlw logo"}
                  // className="md:w-2/3"
                  // className={`${dashboardView ? "" : ""}`}
                  priority
                  width={500}
                  height={125}
                  unoptimized // Disable image optimization for this specific image
                  // without ^, uploaded images couldn't be fetched when deployed to prod (400 error, 'url' related), BUT no issues in dev / see notes section at the end
                />
                {/* <p className="font-xs">{insight.ImageCredit.S}</p> */}
              </div>
            </div>
            <Insight viewport={"mobile"} insight={insight}></Insight>
            {/* <p>{insight.PK.S}</p> */}
            <p className="mt-4 font-semibold">
              {formatToHumanReadable(insight.DateTime.S)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function Insight({ viewport = "desktop", insight }) {
  const visibilityClass =
    viewport === "mobile" ? "block md:hidden" : "hidden md:block";
  return (
    <div className={`text-justify ${visibilityClass}`}>
      {insight.Insights.L.map((item, idx) => (
        <span
          key={idx}
          className={`block ${viewport === "desktop" ? "pr-2" : ""}`}
        >
          <p className="my-1 text-center">+</p>
          {item.S}
        </span>
      ))}
    </div>
  );
}

function Pills({ insight }) {
  return (
    <div className="flex flex-wrap">
      <Pill text={insight.Team.S} color="purple"></Pill>
      <Pill text={insight.AuthorsOrParticipants.S} color="pink"></Pill>
      <Pill text={insight.PublicationOrChannelOrOutlet.S} color="green"></Pill>
      <Pill text={insight.Type.S} color="cyan"></Pill>
      {insight.AIAssisted.BOOL && <Pill text="AI-Assisted" color="slate" />}
      {insight.Prod.BOOL && <Pill text="Prod" color="green" />}
      {insight.AdditionalKeyword1.S && (
        <Pill text={insight.AdditionalKeyword1.S} color="blue" />
      )}
      {insight.AdditionalKeyword2.S && (
        <Pill text={insight.AdditionalKeyword2.S} color="orange" />
      )}
      {insight.AdditionalKeyword3.S && (
        <Pill text={insight.AdditionalKeyword3.S} color="purple" />
      )}
      {insight.AdditionalKeyword4.S && (
        <Pill text={insight.AdditionalKeyword4.S} color="pink" />
      )}
    </div>
  );
}

// The issue you are encountering is due to Next.js’s built-in Image Optimization API, which modifies the image URL for performance improvements like resizing and quality adjustments. This is why the URL is being rewritten to include /_next/image?url=.... When Next.js tries to fetch the image, it optimizes it and appends parameters like w=1080 (width) and q=75 (quality), and includes the original S3 URL in the url query parameter. If you only want to disable optimization for certain images, you can use the unoptimized attribute in the Image component to bypass the Image Optimization API. This will prevent Next.js from modifying the URL and will serve the image directly from S3.
