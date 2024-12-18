import Image from "next/image";
import { getImageSrc } from "@/utils";

export default function InsightImage({ insight, full = false }) {
  return (
    <Image
      src={getImageSrc(insight.ImageLink?.S)} // Use the helper function to get the correct src
      alt={insight.ImageCredit?.S || "tldrlw logo/no image credit provided"}
      priority
      width={full ? 600 : 500} // Adjust width dynamically based on "full"
      height={full ? 300 : 125} // Adjust height proportionally to "full"
      unoptimized // Disable image optimization for this specific image
      // without ^, uploaded images couldn't be fetched when deployed to prd (400 error, 'url' related), BUT no issues in dev, see notes section at the end
      className="shadow-lg"
    />
  );
}
