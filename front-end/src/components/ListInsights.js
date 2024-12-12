import get from "@/services/get";
import InsightCard from "@/components/dumb/InsightCard";
import { sortDataByTime } from "@/utils";

export default async function ListInsights({ dashboardView }) {
  // Fetch insights from the API
  const { data: insights } = await get("insights");
  // ^ getInsights() returns data a specific way, so destructuring out "data" and renaming the array to "insights"
  // Sort the insights by time for display order
  const sortedInsights = sortDataByTime(insights);

  console.log(
    "@/components/ListInsights.js - # of insights - ",
    insights.length,
  );

  return (
    <div>
      {sortedInsights.map((insight, index) => (
        // Render each insight using the InsightCard component
        <InsightCard
          key={index}
          insight={insight}
          dashboardView={dashboardView}
        />
      ))}
    </div>
  );
}
