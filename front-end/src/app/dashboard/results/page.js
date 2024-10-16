import SubHeader from "@/components/SubHeader";
import Auth from "@/components/Auth";
import { unstable_noStore as noStore } from "next/cache";
// ^ https://github.com/vercel/next.js/discussions/44628#discussioncomment-7040424
import { cookies } from "next/headers";
import { getLoggedInUser } from "@/utils";
import NewResult from "@/components/NewResult";

export default function Results() {
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

  return (
    <main>
      <SubHeader currentPage={"/dashboard/results"}></SubHeader>
      <div className="flex flex-col md:flex-row">
        <div className="basis-1/2 md:mb-2 md:mr-2">
          <Auth loggedInUser={loggedInUser}></Auth>
          <NewResult></NewResult>
        </div>
        <div className="basis-1/2">
          {/* <Suspense fallback={<p>Loading insights...</p>}>
            <ListInsights dashboardView={true}></ListInsights>
          </Suspense> */}
        </div>
      </div>
    </main>
  );
}
