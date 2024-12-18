import { Roboto } from "next/font/google";
import { formatToHumanReadable } from "@/utils";
import Link from "next/link";

const roboto = Roboto({ weight: "400", subsets: ["latin"] });

export default function InsightText({
  dashboardView = false,
  viewport = "desktop",
  insight,
}) {
  const visibilityClass =
    viewport === "mobile" ? "block md:hidden" : "hidden md:block";

  // Extract the first paragraph
  const firstInsight = insight.Insights.L[0]?.S || "";

  // Split the first paragraph into sentences
  const sentences = firstInsight
    .split(/(?<=[.!?])\s+/) // Regex to split by punctuation followed by a space
    .filter((sentence) => sentence.trim().length > 0); // Remove any empty sentences

  // Check if there are multiple elements in insight.Insights.L
  const showLink = !dashboardView && insight.Insights.L.length > 1;

  return (
    <div className={`${roboto.className} mx-1 md:mx-2 md:mt-4`}>
      <div className={visibilityClass}>
        {sentences.length > 0 && (
          <ul
            className={`mb-2 list-square space-y-1 pl-3.5 md:mb-0 ${
              dashboardView ? "md:text-base" : "md:text-lg"
            }`}
          >
            {sentences.map((sentence, index) => (
              <li key={index} className="leading-snug">
                {sentence}
              </li>
            ))}
            {showLink && (
              <li className="leading-snug">
                <Link
                  href={`/insight/${insight.PK.S}`}
                  className="text-blue-500 hover:underline"
                >
                  Continue reading...
                </Link>
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
