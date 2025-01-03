import { unstable_noStore as noStore } from "next/cache";
// ^ https://github.com/vercel/next.js/discussions/44628#discussioncomment-7040424
import { Suspense } from "react";
import ListInsights from "@/components/ListInsights";
import NewInsight from "@/components/AddInsight";
import { cookies } from "next/headers";
import Auth from "@/components/Auth";
import SubHeader from "@/components/SubHeader";
import { getLoggedInUser } from "@/utils";

export default function Dashboard() {
  noStore(); // Opt into dynamic rendering
  // These values will be evaluated at runtime
  const lambdaPostImageFunctionUrl =
    process.env.LAMBDA_POST_IMAGE || "lambdaPostImageFunctionUrl placeholder";

  // BUILD time env vars
  const userPoolClientId =
    process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID ||
    "placeholder_client_id";

  const cookieStore = cookies();
  // ^ allows you to get browser-stored cookies server-side
  // console.log(cookieStore);

  const loggedInUser = getLoggedInUser(cookieStore, userPoolClientId);
  // ^ passing return value to Auth component

  function getIdToken() {
    const username = getLoggedInUser(cookieStore, userPoolClientId);
    const idTokenKey = `CognitoIdentityServiceProvider.${userPoolClientId}.${username}.idToken`;
    const idToken = cookieStoreParsedMap.get(idTokenKey);
    const idTokenValue = idToken.value;
    // console.log(idTokenValue);
    return idTokenValue;
  }
  // will need to pass idToken into NewInsight (and also ImageUpload component) component later when POST image upload Lambda is fronted by APIG with Cognito auth

  return (
    <main>
      <SubHeader currentPage={"/dashboard"}></SubHeader>
      <div className="flex flex-col md:flex-row">
        <div className="basis-1/2 md:mb-2 md:mr-2">
          <Auth loggedInUser={loggedInUser}></Auth>
          <NewInsight
            lambdaPostImageFunctionUrl={lambdaPostImageFunctionUrl}
          ></NewInsight>
        </div>
        <div className="basis-1/2">
          <Suspense fallback={<p className="mt-1">Loading insights...</p>}>
            <ListInsights dashboardView={true}></ListInsights>
          </Suspense>
        </div>
      </div>
    </main>
  );
}
