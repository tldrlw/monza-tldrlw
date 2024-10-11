import getInsights from "@/services/getInsights";
import Image from "next/image";

export default async function ListInsights() {
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
    const defaultImage =
      "https://monza-tldrlw-images.s3.amazonaws.com/logos/logo-white.svg";
    const validUrlPattern =
      /^https:\/\/monza-tldrlw-images\.s3\.us-east-1\.amazonaws\.com\/insights\//;
    // Check if imageLink is a valid URL
    try {
      const url = new URL(imageLink);
      if (validUrlPattern.test(url.href)) {
        return imageLink;
      }
    } catch (err) {
      // If the input is not a valid URL or the pattern doesn't match, return the default image
      return defaultImage;
    }
    // If the URL is invalid or doesn't match the pattern, return the default image
    return defaultImage;
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
            <div className="flex flex-row">
              <div className="mb-2 basis-3/5 text-sm md:basis-2/5 md:text-lg">
                <a
                  href={insight.Link.S}
                  className="text-blue-500 hover:underline"
                >
                  {insight.Title.S}
                </a>
                <div className="flex flex-wrap">
                  <Pill text={insight.Team.S} color="purple"></Pill>
                  <Pill text={insight.Type.S} color="green"></Pill>
                  <Pill text={insight.Type.S} color="red"></Pill>
                  <Pill text={insight.Type.S} color="cyan"></Pill>
                  <Pill text={insight.Type.S} color="slate"></Pill>
                </div>
              </div>
              <div className="flex basis-2/5 items-center justify-end md:basis-3/5">
                <Image
                  src={getImageSrc(insight.ImageLink?.S)} // Use the helper function to get the correct src
                  alt={insight.ImageLink?.S || "tldrlw logo"}
                  className="w-3/4 md:w-2/3"
                  priority
                  width={500}
                  height={125}
                />
                {/* <p className="font-xs">{insight.ImageCredit.S}</p> */}
              </div>
            </div>
            {insight.Insights.L.map((item, idx) => (
              <span key={idx} className="my-2 block">
                {item.S} {/* Correctly extract the 'S' value from the object */}
              </span>
            ))}
            {/* <p>{insight.PK.S}</p> */}
            <p className="font-semibold">
              {formatToHumanReadable(insight.DateTime.S)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function Pill({ text, color }) {
  const colorClasses = {
    purple: "bg-purple-50 text-purple-700 ring-purple-700/10",
    green: "bg-green-50 text-green-700 ring-green-700/10",
    red: "bg-red-50 text-red-700 ring-red-700/10",
    cyan: "bg-cyan-50 text-cyan-700 ring-cyan-700/10",
    slate: "bg-slate-50 text-slate-700 ring-slate-700/10",
  };

  return (
    <span
      className={`mr-2 mt-1 inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
        colorClasses[color] || colorClasses["slate"]
      }`}
    >
      {text}
    </span>
  );
}
