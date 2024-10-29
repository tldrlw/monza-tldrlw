import get from "@/services/get";
import StandingsTable from "@/components/StandingsTable";
import { sortDataByTime } from "@/utils";
import SubHeader from "@/components/SubHeader";

export default async function Standings() {
  const { data: constructorsStandings } = await get("constructors");
  const sortedConstructorsStandings = sortDataByTime(constructorsStandings);
  // console.log(JSON.stringify(sortedConstructorsStandings, null, 2));

  const { data: driversStandings } = await get("drivers");
  const sortedDriversStandings = sortDataByTime(driversStandings);
  // console.log(JSON.stringify(sortedDriversStandings, null, 2));

  return (
    <main>
      <SubHeader currentPage="/standings"></SubHeader>
      <div className="flex flex-col md:flex-row">
        <div className="basis-7/12 md:mb-2 md:mr-2">
          <div className="my-2 border-2 border-solid border-customOrangeLogo p-2">
            <h1 className="text-lg font-bold">Drivers</h1>
            <StandingsTable
              standings={sortedDriversStandings[0]}
              drivers={true}
            ></StandingsTable>
          </div>
        </div>
        <div className="basis-5/12 md:mb-2 md:mr-2">
          <div className="mb-2 border-2 border-solid border-customOrangeLogo p-2 md:my-2">
            <h1 className="font-bold md:text-lg">Constructors</h1>
            <StandingsTable
              standings={sortedConstructorsStandings[0]}
            ></StandingsTable>
          </div>
        </div>
      </div>
    </main>
  );
}
