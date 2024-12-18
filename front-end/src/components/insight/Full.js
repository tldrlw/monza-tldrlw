import { Roboto } from "next/font/google";
import InsightImage from "@/components/insight/Image";
import InsightTop from "@/components/insight/Top";

const roboto = Roboto({ weight: "400", subsets: ["latin"] });

export default function InsightFull({ viewport = "desktop", insight }) {
  console.log("InsightNew", JSON.stringify(insight, null, 2));

  const visibilityClass =
    viewport === "mobile" ? "block md:hidden" : "hidden md:block";
  return (
    <div className="my-2 border-2 border-solid border-customOrangeLogo p-2">
      <InsightTop insight={insight}></InsightTop>
      <div className="mt-4 flex justify-center">
        <InsightImage insight={insight} full={true}></InsightImage>
      </div>
      <div className={`${roboto.className} mx-1 mb-3 md:mx-2 md:text-lg`}>
        <div>
          {insight.Insights.L.map((item, idx) => (
            <span
              key={idx}
              className={`mt-4 block ${viewport === "desktop" ? "pr-2" : ""}`}
            >
              {item.S}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
