import { unstable_noStore as noStore } from "next/cache";
// ^ https://github.com/vercel/next.js/discussions/44628#discussioncomment-7040424
import { revalidateTag } from "next/cache";

export default async function postResult(formData) {
  "use server";

  noStore(); // Opt into dynamic rendering
  // This value will be evaluated at runtime
  const lambdaPostResultFunctionUrl =
    process.env.LAMBDA_POST_RESULT_FUNCTION_URL ||
    "lambdaPostResultFunctionUrl placeholder";

  // console.log("front-end/src/services/postResult.js - formData", formData);

  function createPayload(formData) {
    const payload = {
      race: formData.get("race"), // Extract 'race' value
      type: formData.get("type"),
      fastestLap: formData.get("fastestLap"),
      driverOfTheDay: formData.get("driverOfTheDay"),
      result: [], // This will hold the grouped driver and DNF data
    };

    // Iterate through all the form entries
    const formEntries = formData.entries();
    let currentDriver = {};

    for (const [name, value] of formEntries) {
      // Process only fields that start with "driver-" or "dnf-"
      if (name.startsWith("driver-")) {
        // If there's a current driver being processed, push it to the array
        if (Object.keys(currentDriver).length > 0) {
          payload.result.push(currentDriver);
        }
        // Start a new driver entry
        currentDriver = {
          position: parseInt(name.split("-")[1], 10), // Extract the position from the name (e.g., "driver-1") and convert the position to a number
          driver: value,
          dnf: false, // Default DNF to false
        };
      } else if (name.startsWith("dnf-")) {
        // If a DNF field is encountered, set the DNF value
        currentDriver.dnf = value === "on";
      }
    }

    // Push the last driver after the loop completes
    if (Object.keys(currentDriver).length > 0) {
      payload.result.push(currentDriver);
    }

    return payload;
  }

  const payload = createPayload(formData);

  console.log("front-end/src/services/postResult.js - payload", payload);

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  let data;

  try {
    const response = await fetch(lambdaPostResultFunctionUrl, requestOptions);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    data = await response.json();
    console.log(
      "front-end/src/services/postResult.js - API call successful",
      data,
    );
    revalidateTag("results");
    // https://nextjs.org/docs/app/api-reference/functions/revalidateTag
    // https://www.youtube.com/watch?v=VBlSe8tvg4U
    // ^ using tags to revalidate the cache (i.e., getting the ListResults component to make a new API call to get insights) is explained around 11:00
  } catch (error) {
    console.error(
      "front-end/src/services/postResult.js - API call failed",
      error,
    );
  }

  return data;
}
