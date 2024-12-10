export default function Pills({ insight, dashboardView = false }) {
  return (
    <div className="mt-2 flex flex-wrap">
      <Pill text={insight.Team.S} color="purple"></Pill>
      {insight.AuthorsOrParticipants.S && (
        <Pill text={insight.AuthorsOrParticipants.S} color="pink" />
      )}
      <Pill text={insight.PublicationOrChannelOrOutlet.S} color="green"></Pill>
      <Pill text={insight.Type.S} color="cyan"></Pill>
      {insight.AIAssisted.BOOL && <Pill text="AI-Assisted" color="yellow" />}
      {dashboardView && insight.Prod.BOOL && <Pill text="Prod" color="slate" />}
      {/* ^ no point displaying this to users */}
      {insight.AdditionalKeyword1.S && (
        <Pill text={insight.AdditionalKeyword1.S} color="blue" />
      )}
      {insight.AdditionalKeyword2?.S && (
        <Pill text={insight.AdditionalKeyword2.S} color="orange" />
      )}
      {insight.AdditionalKeyword3?.S && (
        <Pill text={insight.AdditionalKeyword3.S} color="red" />
      )}
      {insight.AdditionalKeyword4?.S && (
        <Pill text={insight.AdditionalKeyword4.S} color="green" />
      )}
      {/* ^ newer insights do not have a fourth keyword, just left this here for data pre 10/16/24 */}
    </div>
  );
}

function Pill({ text, color }) {
  const colorClasses = {
    purple: "bg-purple-50 text-purple-700 ring-purple-700/10",
    green: "bg-green-50 text-green-700 ring-green-700/10",
    red: "bg-red-50 text-red-700 ring-red-700/10",
    cyan: "bg-cyan-50 text-cyan-700 ring-cyan-700/10",
    yellow: "bg-yellow-50 text-yellow-700 ring-yellow-700/10",
    slate: "bg-slate-50 text-slate-700 ring-slate-700/10",
    blue: "bg-blue-50 text-blue-700 ring-blue-700/10",
    orange: "bg-orange-50 text-orange-700 ring-orange-700/10",
    pink: "bg-pink-50 text-pink-700 ring-pink-700/10",
  };
  return (
    <span
      className={`mr-2 mt-1 inline-flex items-center rounded-md px-2 py-1 text-xs ring-1 ring-inset md:text-sm ${text === "Prod" ? "underline" : ""} ${
        colorClasses[color] || colorClasses["slate"]
      } `}
    >
      {text}
    </span>
  );
}
