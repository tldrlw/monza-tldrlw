import { unstable_noStore as noStore } from "next/cache";
// ^ https://github.com/vercel/next.js/discussions/44628#discussioncomment-7040424

export default function App() {
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
      <div>
        <h1 className="text-2xl">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed.
        </h1>
        <h2 className="text-xl">
          Do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </h2>
        <p>
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
          nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur.
        </p>
        <p>{buildTime}</p>
        <p>{image}</p>
        <p>{env}</p>
        <p>{lambdaGetFunctionUrl}</p>
      </div>
    </main>
  );
}
