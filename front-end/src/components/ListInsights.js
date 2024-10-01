import getInsights from "@/services/getInsights";

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
          className="my-2 flex flex-row rounded-md border-2 border-solid border-green-500 p-2"
        >
          <div className="basis-5/6">
            {/* Render the list of strings properly */}
            <p className="font-bold">
              {insight.Insights.L.map((item, idx) => (
                <span key={idx} className="block">
                  {item.S}{" "}
                  {/* Correctly extract the 'S' value from the object */}
                </span>
              ))}
            </p>
            <p>
              ID: <span className="italic">{insight.PK.S}</span>
            </p>
          </div>
          <div className="flex basis-1/6">
            <p>{formatToHumanReadable(insight.DateTime.S)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
