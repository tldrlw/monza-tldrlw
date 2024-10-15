// import { unstable_noStore as noStore } from "next/cache";
// ^ https://github.com/vercel/next.js/discussions/44628#discussioncomment-7040424
import ListInsights from "@/components/ListInsights";
import { Suspense } from "react";
import Link from "next/link";

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
            className="mr-10 content-center text-xs italic text-blue-100 hover:underline md:text-base"
          >
            admin
          </Link>
          <Link
            href="/standings"
            className="content-center text-xs italic hover:underline md:text-base"
          >
            {/* Responsive text based on viewport */}
            <span className="md:hidden">👉​ current standings</span>
            <span className="hidden md:inline">
              👉​ current standings (drivers and constructors)
            </span>
          </Link>
        </div>
      </div>
      <Suspense fallback={<p>Loading insights...</p>}>
        <ListInsights></ListInsights>
      </Suspense>
    </main>
  );
}
