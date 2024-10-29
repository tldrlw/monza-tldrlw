import { Roboto } from "next/font/google";
import { formatToHumanReadable } from "@/utils";

const roboto = Roboto({ weight: "400", subsets: ["latin"] });

export default function Insight({ viewport = "desktop", insight }) {
  const visibilityClass =
    viewport === "mobile" ? "block md:hidden" : "hidden md:block";
  return (
    <div className={`${roboto.className} mx-1 md:mx-2`}>
      <div className={visibilityClass}>
        {insight.Insights.L.map((item, idx) => (
          <span
            key={idx}
            className={`mt-4 block ${viewport === "desktop" ? "pr-6" : ""}`}
          >
            {item.S}
          </span>
        ))}
        <p className="mt-4 text-sm font-bold text-emerald-700 md:text-base">
          {formatToHumanReadable(insight.DateTime.S)}
        </p>
      </div>
    </div>
  );
}
