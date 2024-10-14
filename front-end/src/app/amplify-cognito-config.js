"use client";

import { Amplify } from "aws-amplify";
// import "../../envConfig";
// ^ https://nextjs.org/docs/app/building-your-application/configuring/environment-variables
// but don't need this import here since we're using NEXT_PUBLIC... in a client component
// only works for SERVER COMPONENTS when env vars are passed in through the ECS task definition config in Terraform
// NEXT_PUBLIC = build time, ^ = run time
// https://nextjs.org/docs/app/building-your-application/configuring/environment-variables

const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID;
const userPoolClientId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID;
// ^ defined in .env.local (.gitignored...) and baked into image at build time (see front-end/Dockerfile and .github/workflows/front-end.yaml)
// ^ using NEXT_PUBLIC... because this is a client component

export const authConfig = {
  Cognito: {
    userPoolId,
    userPoolClientId,
  },
};

console.log(
  "client-side - src/app/amplify-cognito-config.js - authConfig",
  authConfig,
);

Amplify.configure({ Auth: authConfig }, { ssr: true });
// setting ssr to true will make Amplify use cookie for state storage, because by default, Amplify uses local storage for state storage

export default function ConfigureAmplifyClientSide() {
  return null;
  // returning null because this component will have no UI
}
