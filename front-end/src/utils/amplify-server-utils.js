import { authConfig } from "@/app/amplify-cognito-config";
import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth/server";
// ^ the /server is important because these functions will get called on the server-side

// Create a server-side runner using Amplify configuration
export const { runWithAmplifyServerContext } = createServerRunner({
  config: {
    Auth: authConfig, // Provide Amplify authentication configuration
  },
});

// Function to authenticate the user and check group membership (e.g., Admin)
export async function authenticatedUser(context) {
  const adminGroupName = "Admins";
  // ^ must match up exactly with what you're naming your group,
  // currently have no groups set up, could add in infrastructure/cognito.tf later
  // This allows you to check if the user belongs to a specific group, like Admins.

  // Call the Amplify server context runner to execute authentication logic server-side
  return await runWithAmplifyServerContext({
    nextServerContext: context, // Pass in the server context (request/response from middleware)
    operation: async (contextSpec) => {
      try {
        // Fetch the current authentication session using Amplify
        const session = await fetchAuthSession(contextSpec);

        // If there are no tokens in the session, it means the user isn't authenticated
        if (!session.tokens) {
          return; // Exit the function and return undefined (user is not logged in)
        }

        // Get the current user details and add an `isAdmin` property
        const user = {
          ...(await getCurrentUser(contextSpec)), // Get user info like username, email, etc.
          isAdmin: false, // Initialize the isAdmin property to false
        };

        // Check if the user belongs to the Admin group by looking at the tokens
        const groups = session.tokens.accessToken.payload["cognito:groups"];
        // If the user belongs to the specified group, set isAdmin to true
        user.isAdmin = Boolean(groups && groups.includes(adminGroupName));

        // Return the user object, which includes information on admin privileges
        return user;
      } catch (error) {
        console.log(error); // Log any errors that occur during the authentication process
      }
    },
  });
}

// Amplify configuration: The createServerRunner function is used to initialize the server-side context with Amplify. It uses your authentication configuration (authConfig) to set up the necessary server environment.
// authenticatedUser function:
// This function authenticates the user and checks their group membership (e.g., if they are an Admin).
// It starts by defining adminGroupName, which you may later configure in AWS Cognito.
// Server-side context:
// The function uses runWithAmplifyServerContext to run the authentication code with the Next.js server context (passed in from the middleware).
// Fetching the session:
// The fetchAuthSession function retrieves the current authentication session.
// If there are no tokens in the session, the user is not authenticated, and the function exits early.
// Getting the current user:
// If the user is authenticated, it retrieves the user’s information (like username, email, etc.) using getCurrentUser.
// The function initializes user.isAdmin to false by default.
// Checking user groups:
// The groups variable extracts the cognito:groups claim from the user’s access token. This claim contains the groups the user belongs to in Cognito.
// If the user belongs to the Admins group, user.isAdmin is set to true.
// Returning the user:
// Finally, the user object is returned with all the relevant information, including whether the user has admin privileges.
