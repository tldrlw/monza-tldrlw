import { unstable_noStore as noStore } from "next/cache";
// ^ https://github.com/vercel/next.js/discussions/44628#discussioncomment-7040424
import { Suspense } from "react";
import ListInsights from "@/components/ListInsights";
import NewInsight from "@/components/NewInsight";

export default function Dashboard() {
  noStore(); // Opt into dynamic rendering
  // These values will be evaluated at runtime
  const lambdaPostImageFunctionUrl =
    process.env.LAMBDA_POST_IMAGE_FUNCTION_URL ||
    "lambdaPostImageFunctionUrl placeholder";

  return (
    <main>
      <div className="flex flex-col md:flex-row">
        <div className="basis-1/2 md:mb-2 md:mr-2">
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
