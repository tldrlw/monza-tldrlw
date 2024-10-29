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
      <ListResults results={sortedResults} dashboard={true}></ListResults>
    </main>
  );
}
