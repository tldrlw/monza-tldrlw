import SubHeader from "@/components/SubHeader";
import Auth from "@/components/Auth";
import { unstable_noStore as noStore } from "next/cache";
// ^ https://github.com/vercel/next.js/discussions/44628#discussioncomment-7040424
import { cookies } from "next/headers";
import { getLoggedInUser, sortDataByTime } from "@/utils";
import AddResult from "@/components/AddResult";
import ListResults from "@/components/ListResults";
import get from "@/services/get";

export default async function Results() {
  noStore(); // Opt into dynamic rendering

  // BUILD time env vars
  const userPoolClientId =
    process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID ||
    "placeholder_client_id";

  const cookieStore = cookies();
  // ^ allows you to get browser-stored cookies server-side
  // console.log(cookieStore);

  const loggedInUser = getLoggedInUser(cookieStore, userPoolClientId);
  // ^ passing return value to Auth component

  const { data: results } = await get("results");
  const sortedResults = sortDataByTime(results);

  return (
    <main>
      <SubHeader currentPage={"/dashboard/results"}></SubHeader>
      <div className="flex flex-col md:flex-row">
        <div className="basis-1/2 md:mb-2 md:mr-2">
          <Auth loggedInUser={loggedInUser}></Auth>
          <AddResult></AddResult>
        </div>
        <div className="basis-1/2">
          <ListResults
            results={sortedResults}
            dashboardView={true}
          ></ListResults>
        </div>
      </div>
    </main>
  );
}
