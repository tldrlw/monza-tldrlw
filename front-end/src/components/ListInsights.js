import getInsights from "@/services/getInsights";
import Image from "next/image";

export default async function ListInsights() {
  const { data: insights } = await getInsights();
  // ^ getInsights() returns the following, so destructuring out "data" and renaming the array to "insights"

  console.log(
    "front-end/src/components/ListInsights.js - # of insights - ",
    insights.length
  );

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

  return (
    <div>
      {sortedInsights.map((insight, index) => (
        <div
          key={index}
          className="my-2 rounded-sm border-2 border-solid border-customOrangeLogo p-2"
        >
          <div className="text-xs md:text-sm">
            {/* Render the list of strings properly */}
            <div className="flex flex-row">
              <div className="mb-2 text-sm md:text-lg basis-2/5">
                <a
                  href={insight.Link.S}
                  className="text-blue-500 hover:underline"
                >
                  {insight.Title.S}
                </a>
              </div>
              <div className="basis-3/5 flex justify-end items-center">
                <Image
                  src="https://monza-tldrlw-images.s3.amazonaws.com/logos/logo-white.svg"
                  alt="tldrlw logo"
                  className="w-3/4 md:w-1/3"
                  priority
                  width={500}
                  height={125}
                />
              </div>
            </div>
            {insight.Insights.L.map((item, idx) => (
              <span key={idx} className="block my-2">
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
