import { unstable_noStore as noStore } from "next/cache";
// ^ https://github.com/vercel/next.js/discussions/44628#discussioncomment-7040424

export default async function getConstructors(type) {
  "use server";

  noStore(); // Opt into dynamic rendering
  // This value will be evaluated at runtime

  const getLambdaFunctionUrl = (type) => {
    switch (type) {
      case "constructors":
        return (
          process.env.LAMBDA_GET_CONSTRUCTORS_FUNCTION_URL ||
          "lambdaGetConstructorsFunctionUrl placeholder"
        );
      case "drivers":
        return (
          process.env.LAMBDA_GET_DRIVERS_FUNCTION_URL ||
          "lambdaGetDriversFunctionUrl placeholder"
        );
      case "insights":
        return (
          // process.env.LAMBDA_GET_FUNCTION_URL ||
          // test
          process.env.LAMBDA_GET_TEST ||
          "lambdaGetFunctionUrl placeholder"
        );
      case "results":
        return (
          process.env.LAMBDA_GET_RESULTS_FUNCTION_URL ||
          "lambdaGetResultsFunctionUrl placeholder"
        );
      default:
        return "Invalid type provided";
    }
  };

  console.log(`front-end/src/services/get${type}.js`);

  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let data;

  try {
    const response = await fetch(
      getLambdaFunctionUrl(type),
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
    //   `front-end/src/services/get${type}.js - API call successful`,
    //   JSON.stringify(data, null, 2),
    // );
  } catch (error) {
    console.error(
      `front-end/src/services/get${type}.js - API call failed`,
      error,
    );
  }
  return data;
}
