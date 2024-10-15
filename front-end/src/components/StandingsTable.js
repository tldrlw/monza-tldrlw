import { formatToHumanReadable } from "@/utils";

export default function StandingsTable({ standings, drivers = false }) {
  return (
    <div className="mb-4 mt-2 text-xs md:text-sm">
      Updated: {formatToHumanReadable(standings.DateTime.S)}
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Position</th>
            {drivers && (
              <th className="border border-gray-300 px-4 py-2">Driver</th>
            )}
            <th className="border border-gray-300 px-4 py-2">Team</th>
            <th className="border border-gray-300 px-4 py-2">Points</th>
            {drivers && (
              <th className="border border-gray-300 px-4 py-2">Nationality</th>
            )}
          </tr>
        </thead>
        <tbody>
          {standings.Standings.L.map((item, index) => (
            <tr key={index}>
              <td className="border border-gray-300 px-4 py-2">
                {item.M.position.N}
              </td>
              {drivers && (
                <td className="border border-gray-300 px-4 py-2">
                  {item.M.driver.S}
                </td>
              )}
              <td className="border border-gray-300 px-4 py-2">
                {item.M.team.S}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {item.M.points.N}
              </td>
              {drivers && (
                <td className="border border-gray-300 px-4 py-2">
                  {item.M.nationality.S}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
