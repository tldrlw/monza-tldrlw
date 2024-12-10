import getInsight from "@/services/getInsight";
import InsightFull from "@/components/InsightFull";

export default async function Page({ params }) {
  const { data: insight } = await getInsight(params.slug);
  console.log("page.js", JSON.stringify(insight, null, 2));

  return (
    <div>
      {/* <h1>Dynamic Page for ID: {params.slug}</h1> */}
      <InsightFull insight={insight}></InsightFull>
    </div>
  );
}
