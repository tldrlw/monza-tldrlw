import { Roboto } from "next/font/google";
import { formatToHumanReadable } from "@/utils";
import Image from "next/image";
import Pills from "./Pills";
import { getImageSrc } from "@/utils";

const roboto = Roboto({ weight: "400", subsets: ["latin"] });

export default function InsightFull({ viewport = "desktop", insight }) {
  console.log("InsightNew", JSON.stringify(insight, null, 2));

  const visibilityClass =
    viewport === "mobile" ? "block md:hidden" : "hidden md:block";
  return (
    <div className="my-2 border-2 border-solid border-customOrangeLogo p-2">
      {insight.Link.S === "monza.tldrlw.com" ? (
        <span className="text-base font-bold text-slate-800 md:text-lg">
          {insight.Title.S}
        </span>
      ) : (
        <a
          href={insight.Link.S}
          className="text-base font-bold text-blue-500 hover:underline md:text-lg"
        >
          {insight.Title.S}
        </a>
      )}
      <Pills insight={insight}></Pills>
      <div className="mt-4 flex justify-center">
        <Image
          src={getImageSrc(insight.ImageLink.S)} // Use the helper function to get the correct src
          alt={insight.ImageCredit.S || "tldrlw logo/no image credit provided"}
          priority
          width={600} // Adjust the width to make the image bigger
          height={300} // Adjust the height to maintain the aspect ratio or desired size
          unoptimized // Disable image optimization for this specific image
          className="shadow-lg" // Optional: Add styles like rounded corners or shadow for better aesthetics
        />
      </div>
      <div className={`${roboto.className} mx-1 md:mx-2`}>
        <div>
          {insight.Insights.L.map((item, idx) => (
            <span
              key={idx}
              className={`mt-4 block ${viewport === "desktop" ? "pr-6" : ""}`}
            >
              {item.S}
            </span>
          ))}
          <p className="mt-2 pb-2 text-sm font-bold text-emerald-800 md:text-base">
            {formatToHumanReadable(insight.DateTime.S)}
          </p>
        </div>
      </div>
    </div>
  );
}
