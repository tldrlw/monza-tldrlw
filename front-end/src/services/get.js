import { unstable_noStore as noStore } from "next/cache";
// ^ https://github.com/vercel/next.js/discussions/44628#discussioncomment-7040424

export default async function getConstructors(type) {
  "use server";

  noStore(); // Opt into dynamic rendering
  // This value will be evaluated at runtime

  const getLambdaURL = (type) => {
    switch (type) {
      case "insights":
        return (
          process.env.LAMBDA_GET_INSIGHTS || "lambdaGetInsightsURL placeholder"
        );
      case "constructors":
        return (
          process.env.LAMBDA_GET_CONSTRUCTORS ||
          "lambdaGetConstructorsURL placeholder"
        );
      case "drivers":
        return (
          process.env.LAMBDA_GET_DRIVERS || "lambdaGetDriversURL placeholder"
        );
      case "results":
        return (
          process.env.LAMBDA_GET_RESULTS || "lambdaGetResultsURL placeholder"
        );
      default:
        return "Invalid type provided";
    }
  };

  console.info(`front-end/src/services/get-<${type.toUpperCase()}>.js`);

  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let data;

  try {
    const response = await fetch(
      getLambdaURL(type),
      { next: { tags: [type] } },
      // https://nextjs.org/docs/app/api-reference/functions/revalidateTag
      { cache: "force-cache" },
      // https://nextjs.org/docs/app/api-reference/functions/fetch#optionscache
      // https://nextjs.org/docs/app/api-reference/next-config-js/logging
      requestOptions,
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    data = await response.json();
    // console.log(
    //   `front-end/src/services/get<${type.toUpperCase()}>.js - API call successful`,
    //   JSON.stringify(data, null, 2),
    // );
    console.log(
      `front-end/src/services/get<${type.toUpperCase()}>.js - API call successful`,
    );
    console.log(getLambdaURL(type));
  } catch (error) {
    console.error(
      `front-end/src/services/get<${type.toUpperCase()}>.js - API call failed`,
      error,
    );
  }
  return data;
}
