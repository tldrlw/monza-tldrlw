import { NextResponse } from "next/server";
import { authenticatedUser } from "@/utils/amplify-server-utils";

// remove this comment

// Middleware function to handle user authentication and redirection logic
export async function middleware(request) {
  const response = NextResponse.next();

  // Retrieve the authenticated user from Amplify using server-side utilities
  const user = await authenticatedUser({ request, response });
  // console.log("Authenticated user:", user); // For debugging - logs user details

  // Check if the user is on the homepage ("/")
  const isOnHomePage = request.nextUrl.pathname === "/";

  // Check if the user is on a dashboard page (any route that starts with "/dashboard")
  const isOnDashboard = request.nextUrl.pathname.startsWith("/dashboard");
  // covers pages within "/dashboard" like "/dashboard/results" as well

  // If there's no authenticated user:
  // - Redirect them to "/auth/signin" if they are trying to access the homepage or the dashboard
  if (!user) {
    if (isOnDashboard) {
      const url = new URL("/auth/login", request.nextUrl);
      return NextResponse.redirect(url);
    }
  }
  // If the user is authenticated and on the homepage, redirect them to the dashboard
  else if (isOnHomePage) {
    const url = new URL("/dashboard", request.nextUrl);
    return NextResponse.redirect(url);
  }

  // If none of the conditions match, let the request proceed as normal
  return response;
}

// Configuration to match all paths except API routes, static files, and specific file extensions
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};

// authenticatedUser function: This uses Amplify to get the current authenticated user. If no user is found, it returns null or undefined.
// Dashboard check (isOnDashboard): This checks if the request URL starts with /dashboard, which helps protect the dashboard route. Unauthenticated users are redirected to /auth/login if they try to access this area.
// Conditional redirects:
// If the user is not authenticated and tries to access protected routes, they’re redirected to the login page.
// If the user is authenticated and on the homepage, they’re redirected to the dashboard.
