import { Roboto } from "next/font/google";
import { formatToHumanReadable } from "@/utils";
import Link from "next/link";

const roboto = Roboto({ weight: "400", subsets: ["latin"] });

export default function InsightText({ viewport = "desktop", insight }) {
  const visibilityClass =
    viewport === "mobile" ? "block md:hidden" : "hidden md:block";

  // Extract the first paragraph
  const firstInsight = insight.Insights.L[0]?.S || "";

  // Split the first paragraph into sentences
  const sentences = firstInsight
    .split(/(?<=[.!?])\s+/) // Regex to split by punctuation followed by a space
    .filter((sentence) => sentence.trim().length > 0); // Remove any empty sentences

  return (
    <div className={`${roboto.className} mx-1 md:mx-2 md:mt-4`}>
      <div className={visibilityClass}>
        {sentences.length > 0 && (
          <ul className="mb-2 list-disc space-y-1 pl-5 md:mb-0">
            {sentences.map((sentence, index) => (
              <li key={index} className="leading-snug">
                {sentence}
              </li>
            ))}
            <li className="leading-snug">
              <Link
                href={`/insight/${insight.PK.S}`}
                className="text-blue-500 hover:underline"
              >
                Continue reading...
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
