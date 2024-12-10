import { Roboto } from "next/font/google";
import { formatToHumanReadable } from "@/utils";
import Link from "next/link";

const roboto = Roboto({ weight: "400", subsets: ["latin"] });

export default function InsightNew({ viewport = "desktop", insight }) {
  const visibilityClass =
    viewport === "mobile" ? "block md:hidden" : "hidden md:block";

  // Extract the first paragraph
  const firstInsight = insight.Insights.L[0];

  return (
    <div className={`${roboto.className} mx-1 md:mx-2`}>
      <div className={visibilityClass}>
        {firstInsight && (
          <span
            key={0}
            className={`mt-4 block ${viewport === "desktop" ? "pr-6" : ""}`}
          >
            {firstInsight.S}
            <Link
              href={`/insight/${insight.PK.S}`}
              className="ml-10 italic text-blue-500 hover:underline"
            >
              continue reading...
            </Link>
          </span>
        )}
        <p className="mt-2 text-sm font-bold text-emerald-800 md:text-base">
          {formatToHumanReadable(insight.DateTime.S)}
        </p>
      </div>
    </div>
  );
}
