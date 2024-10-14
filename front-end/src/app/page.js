import { unstable_noStore as noStore } from "next/cache";
// ^ https://github.com/vercel/next.js/discussions/44628#discussioncomment-7040424
import ListInsights from "@/components/ListInsights";
import { Suspense } from "react";
import Link from "next/link";

export default function App() {
  // build time env vars below
  // NEXT_PUBLIC_* - https://nextjs.org/docs/app/building-your-application/configuring/environment-variables#bundling-environment-variables-for-the-browser
  // const buildTime =
  //   process.env.NEXT_PUBLIC_BUILD_TIME || "buildTime placeholder";
  // const image = process.env.NEXT_PUBLIC_IMAGE || "image placeholder";
  // runtime env vars below
  noStore(); // Opt into dynamic rendering
  // These values will be evaluated at runtime
  const env = process.env.ENV || "env placeholder";
  const lambdaGetFunctionUrl =
    process.env.LAMBDA_GET_FUNCTION_URL || "lambdaGetFunctionUrl placeholder";

  return (
    <main>
      <div className="flex justify-between">
        <h1 className="mt-1 text-2xl md:text-3xl">monza🏎️🏁</h1>
        <div className="mt-3">
          {/* <Link
            href="/about"
            className="content-center italic text-blue-100 hover:underline"
          >
            about
          </Link> */}
          <Link
            href="/auth/login"
            className="content-center italic text-blue-100 hover:underline"
          >
            admin
          </Link>
        </div>
      </div>
      <Suspense fallback={<p>Loading insights...</p>}>
        <ListInsights></ListInsights>
      </Suspense>
    </main>
  );
}
