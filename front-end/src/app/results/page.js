import get from "@/services/get";
import { sortDataByTime } from "@/utils";
import SubHeader from "@/components/SubHeader";
import ListResults from "@/components/ListResults";

export default async function Results() {
  const { data: results } = await get("results");
  const sortedResults = sortDataByTime(results);
  // console.log(JSON.stringify(sortedResults, null, 2));

  return (
    <main>
      <SubHeader currentPage="/results"></SubHeader>
      <div className="mt-2 md:mb-4 md:mt-0">
        <ListResults results={sortedResults} dashboard={true}></ListResults>
      </div>
    </main>
  );
}
