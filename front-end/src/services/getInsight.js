// this service calls the λ function to query dydb to get out a specific item by primary key

import { unstable_noStore as noStore } from "next/cache";

export default async function getInsight(primaryKey) {
  "use server";

  // Opt into dynamic rendering
  noStore();

  // API URL from environment variables
  const lambdaGetInsightURL =
    process.env.LAMBDA_GET_INSIGHT || "lambdaGetInsightURL placeholder";

  // Ensure primaryKey is used
  if (!primaryKey) {
    console.error("Primary key is missing for getInsight");
    return null;
  }

  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    // Include cache setting here
    cache: "no-store",
  };

  try {
    // Append primaryKey as a query parameter
    const response = await fetch(
      `${lambdaGetInsightURL}?primaryKey=${encodeURIComponent(primaryKey)}`,
      requestOptions,
    );

    // Handle non-OK responses
    if (!response.ok) {
      console.error(
        `API call failed with status: ${response.status} ${response.statusText}`,
      );
      throw new Error(`Failed to fetch insight with primaryKey: ${primaryKey}`);
    }

    // Parse response
    const data = await response.json();
    console.log("API call successful:", data);

    return data;
  } catch (error) {
    // Log the error
    console.error("Error in getInsight API call:", error.message);
    return null;
  }
}
