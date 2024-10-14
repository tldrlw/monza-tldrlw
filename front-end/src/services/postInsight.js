import { unstable_noStore as noStore } from "next/cache";
// ^ https://github.com/vercel/next.js/discussions/44628#discussioncomment-7040424
import { revalidateTag } from "next/cache";

export default async function postInsight(formData) {
  "use server";

  noStore(); // Opt into dynamic rendering
  // This value will be evaluated at runtime
  const lambdaPostFunctionUrl =
    process.env.LAMBDA_POST_FUNCTION_URL || "lambdaPostFunctionUrl placeholder";

  console.log("front-end/src/services/postInsight.js - formData", formData);

  const payload = {
    title: formData.get("title"),
    link: formData.get("link"),
    imageLink: formData.get("imageLink"),
    imageCredit: formData.get("imageCredit"),
    team: formData.get("team"),
    type: formData.get("type"),
    aiAssisted: formData.get("aiAssisted") === "on" ? true : false,
    prod: formData.get("prod") === "on" ? true : false,
    additionalKeyword1: formData.get("additionalKeyword1"),
    additionalKeyword2: formData.get("additionalKeyword2"),
    additionalKeyword3: formData.get("additionalKeyword3"),
    additionalKeyword4: formData.get("additionalKeyword4"),
    publicationOrChannelOrOutlet: formData.get("publicationOrChannelOrOutlet"),
    authorsOrParticipants: formData.get("authorsOrParticipants"),
    insights: [
      formData.get("insight1"),
      formData.get("insight2"),
      formData.get("insight3"),
      formData.get("insight4"),
      formData.get("insight5"),
    ].filter((insight) => insight && insight.trim()), // Filters out empty or whitespace-only insights
  };

  console.log(payload);

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  let data;

  try {
    const response = await fetch(lambdaPostFunctionUrl, requestOptions);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    data = await response.json();
    console.log(
      "front-end/src/services/postInsight.js - API call successful",
      data,
    );
    revalidateTag("insights");
    // https://nextjs.org/docs/app/api-reference/functions/revalidateTag
    // https://www.youtube.com/watch?v=VBlSe8tvg4U
    // ^ using tags to revalidate the cache (i.e., getting the ListInsights component to make a new API call to get insights) is explained around 11:00
  } catch (error) {
    console.error(
      "front-end/src/services/postInsight.js - API call failed",
      error,
    );
  }

  return data;
}
