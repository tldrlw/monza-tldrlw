export default async function ListResults({ results, dashboardView = false }) {
  return (
    // <div className="flex flex-col md:mt-2 md:flex-row md:flex-wrap md:justify-center md:space-x-8">
    <div
      className={`flex flex-col ${
        !dashboardView
          ? "md:mt-2 md:flex-row md:flex-wrap md:justify-center md:space-x-8"
          : "mt-2"
      }`}
    >
      {results.map((result, index) => (
        <div
          key={index}
          className={`mb-2 border-2 border-solid border-customOrangeLogo p-4 md:p-8 ${dashboardView ? "md:mb-2" : "md:mb-0"}`}
        >
          <h1 className="text-base md:text-xl">{result.Race.S}</h1>
          <h2 className="text-base font-bold md:mt-4 md:text-lg">
            {result.Type.S} {result.Type.S === "Race" && "🏁"}
            {result.Type.S === "Sprint" && "🏃‍♂️"}
            {result.Type.S === "Quali" && "⏱️"}
          </h2>

          <div className="mt-4">
            {result.Results.L.map((driver, index) => (
              <div className="text-sm md:text-base" key={index}>
                {index + 1} -{" "}
                <span className={index === 0 ? "font-bold text-green-600" : ""}>
                  {driver.M.Driver.S}
                </span>
                <span className="text-red-500">
                  {driver.M.DNF.BOOL ? " (DNF)" : ""}
                </span>
              </div>
            ))}
          </div>

          {result.FastestLap.S !== "N/A" && (
            <h3 className="mt-4 text-sm md:text-base">
              <span className="italic">Fastest Lap:</span> {result.FastestLap.S}
            </h3>
          )}
          {result.DriverOfTheDay.S !== "N/A" && (
            <h3 className="text-sm md:text-base">
              <span className="italic">Driver of the Day:</span>{" "}
              {result.DriverOfTheDay.S}
            </h3>
          )}
        </div>
      ))}
    </div>
  );
}
