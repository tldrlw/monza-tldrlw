import { unstable_noStore as noStore } from "next/cache";
// ^ https://github.com/vercel/next.js/discussions/44628#discussioncomment-7040424

export default async function getInsights() {
  "use server";

  noStore(); // Opt into dynamic rendering
  // This value will be evaluated at runtime
  const lambdaGetFunctionUrl =
    process.env.LAMBDA_GET_FUNCTION_URL || "lambdaGetFunctionUrl placeholder";

  console.log("front-end/src/services/getInsights.js");

  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let data;

  try {
    const response = await fetch(
      lambdaGetFunctionUrl,
      { next: { tags: ["insights"] } },
      // https://nextjs.org/docs/app/api-reference/functions/revalidateTag
      // { tags: ["insights"] },
      // ^ also works, but not in docs above
      { cache: "no-store" },
      // ^ for NO caching
      // https://nextjs.org/docs/app/api-reference/functions/fetch#fetchurl-options
      // you can see differences between cached and non-cached API calls by configuring special logging in `next.config.mjs`, comment out ^ and it'll log 'cache-hit'
      requestOptions,
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    data = await response.json();
    // console.log(
    //   "front-end/src/services/getInsights.js - API call successful",
    //   JSON.stringify(data, null, 2),
    // );
  } catch (error) {
    console.error(
      "front-end/src/services/getInsights.js - API call failed",
      error,
    );
  }

  return data;
}
