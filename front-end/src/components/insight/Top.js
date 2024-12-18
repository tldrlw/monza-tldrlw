import { formatToHumanReadable } from "@/utils";
import Pills from "@/components/Pills";

export default function InsightTop({ insight }) {
  return (
    <div>
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
      <p className="text-sm text-gray-500">
        {formatToHumanReadable(insight.DateTime.S)}
      </p>
      <Pills insight={insight}></Pills>
    </div>
  );
}
