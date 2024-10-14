export default function Pill({ text, color }) {
  const colorClasses = {
    purple: "bg-purple-50 text-purple-700 ring-purple-700/10",
    green: "bg-green-50 text-green-700 ring-green-700/10",
    red: "bg-red-50 text-red-700 ring-red-700/10",
    cyan: "bg-cyan-50 text-cyan-700 ring-cyan-700/10",
    yellow: "bg-yellow-50 text-yellow-700 ring-yellow-700/10",
    slate: "bg-slate-50 text-slate-700 ring-slate-700/10",
  };
  return (
    <span
      className={`mr-2 mt-1 inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${text === "Prod" ? "underline" : ""} ${
        colorClasses[color] || colorClasses["slate"]
      } `}
    >
      {text}
    </span>
  );
}
