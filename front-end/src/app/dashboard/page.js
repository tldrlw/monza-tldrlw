import { unstable_noStore as noStore } from "next/cache";
// ^ https://github.com/vercel/next.js/discussions/44628#discussioncomment-7040424
import { Suspense } from "react";
import Link from "next/link";
import ListInsights from "@/components/ListInsights";
import NewInsight from "@/components/NewInsight";

export default function Dashboard() {
  // build time env vars below
  // NEXT_PUBLIC_* - https://nextjs.org/docs/app/building-your-application/configuring/environment-variables#bundling-environment-variables-for-the-browser
  const buildTime =
    process.env.NEXT_PUBLIC_BUILD_TIME || "buildTime placeholder";
  const image = process.env.NEXT_PUBLIC_IMAGE || "image placeholder";
  // runtime env vars below
  noStore(); // Opt into dynamic rendering
  // These values will be evaluated at runtime
  const env = process.env.ENV || "env placeholder";
  const lambdaGetFunctionUrl =
    process.env.LAMBDA_GET_FUNCTION_URL || "lambdaGetFunctionUrl placeholder";

  return (
    <main>
      <div className="flex flex-col md:flex-row">
        <div className="basis-1/2 md:mb-2 md:mr-2">
          <NewInsight></NewInsight>
        </div>
        <div className="basis-1/2">
          <Suspense fallback={<p>Loading insights...</p>}>
            <ListInsights></ListInsights>
          </Suspense>
        </div>
      </div>
    </main>
  );
}
