import { unstable_noStore as noStore } from "next/cache";
// ^ https://github.com/vercel/next.js/discussions/44628#discussioncomment-7040424
import { Suspense } from "react";
import ListInsights from "@/components/ListInsights";
import NewInsight from "@/components/NewInsight";
import { cookies } from "next/headers";
import Auth from "@/components/Auth";

export default function Dashboard() {
  noStore(); // Opt into dynamic rendering
  // These values will be evaluated at runtime
  const lambdaPostImageFunctionUrl =
    process.env.LAMBDA_POST_IMAGE_FUNCTION_URL ||
    "lambdaPostImageFunctionUrl placeholder";

  // BUILD time env vars
  const userPoolClientId =
    process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID ||
    "placeholder_client_id";

  const cookieStore = cookies();
  // ^ allows you to get browser-stored cookies server-side
  // console.log(cookieStore);
  // ^ The logged output you’re seeing is a JavaScript Map object, not a regular JavaScript object. You can still parse through it, but the syntax differs slightly from standard objects (need to use `.get`, see below)
  const cookieStoreParsedMap = cookieStore._parsed;

  function getLoggedInUser() {
    const lastAuthUserKey = `CognitoIdentityServiceProvider.${userPoolClientId}.LastAuthUser`;
    const lastAuthUser = cookieStoreParsedMap.get(lastAuthUserKey);
    const loggedInUser = lastAuthUser.value;
    // console.log(loggedInUser)
    return loggedInUser;
    // returns the username
  }

  function getIdToken() {
    const username = getLoggedInUser();
    const idTokenKey = `CognitoIdentityServiceProvider.${userPoolClientId}.${username}.idToken`;
    const idToken = cookieStoreParsedMap.get(idTokenKey);
    const idTokenValue = idToken.value;
    // console.log(idTokenValue);
    return idTokenValue;
  }
  // will need to pass idToken into NewInsight (and also ImageUpload component) component later when POST Lambdas are fronted by APIG with Cognito auth

  const loggedInUser = getLoggedInUser();
  // ^ passing return value to Auth component

  return (
    <main>
      <div className="flex flex-col md:flex-row">
        <div className="basis-1/2 md:mb-2 md:mr-2">
          <Auth loggedInUser={loggedInUser}></Auth>
          <NewInsight
            lambdaPostImageFunctionUrl={lambdaPostImageFunctionUrl}
          ></NewInsight>
        </div>
        <div className="basis-1/2">
          <Suspense fallback={<p>Loading insights...</p>}>
            <ListInsights dashboardView={true}></ListInsights>
          </Suspense>
        </div>
      </div>
    </main>
  );
}
