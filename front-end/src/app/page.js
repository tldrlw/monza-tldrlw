// import { unstable_noStore as noStore } from "next/cache";
// ^ https://github.com/vercel/next.js/discussions/44628#discussioncomment-7040424
import ListInsights from "@/components/ListInsights";
import { Suspense } from "react";
import SubHeader from "@/components/SubHeader";

export default function App() {
  // BUILD time env vars below
  // const buildTime =
  //   process.env.NEXT_PUBLIC_BUILD_TIME || "buildTime placeholder";
  // NEXT_PUBLIC_* prefix - https://nextjs.org/docs/app/building-your-application/configuring/environment-variables#bundling-environment-variables-for-the-browser
  // ^ these PREFIXED BUILD time env vars are also available server-side, see front-end/src/app/dashboard/page.js
  // RUNTIME env vars below
  // noStore(); // Opt into dynamic rendering
  // These values will be evaluated at runtime
  // const lambdaGetFunctionUrl =
  //   process.env.LAMBDA_GET_FUNCTION_URL || "lambdaGetFunctionUrl placeholder";

  return (
    <main>
      <SubHeader></SubHeader>
      <Suspense fallback={<p>Loading insights...</p>}>
        <ListInsights></ListInsights>
      </Suspense>
    </main>
  );
}
