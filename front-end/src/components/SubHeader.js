"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

// Reusable components for Links
const ResultsLink = () => (
  <Link
    href="/results"
    className="mr-5 content-center text-sm italic hover:underline md:mr-10 md:text-base"
  >
    👉​results
  </Link>
);

const StandingsLink = ({ marginRight = true }) => (
  <Link
    href="/standings"
    className={`content-center text-sm italic hover:underline md:text-base ${
      marginRight ? "mr-5 md:mr-10" : ""
    }`}
  >
    <span className="md:hidden">👉​stndngs</span>
    <span className="hidden md:inline">
      👉​standings (drivers & constructors)
    </span>
  </Link>
);

const HomeLink = ({ marginRight = true }) => (
  <Link
    href="/"
    className={`content-center text-sm italic hover:underline md:text-base ${
      marginRight ? "mr-5 md:mr-10" : ""
    }`}
  >
    👉​home
  </Link>
);

const DashboardLink = () => (
  <Link
    href="/dashboard"
    className="content-center text-sm italic hover:underline md:text-base"
  >
    👉​dashboard
  </Link>
);

const DashboardResultsLink = () => (
  <Link
    href="/dashboard/results"
    className="content-center text-sm italic hover:underline md:text-base"
  >
    👉​results
  </Link>
);

const LoginLink = () => (
  <Link
    href="/auth/login"
    className="mr-5 content-center text-sm italic text-blue-50 hover:underline md:mr-10 md:text-base"
  >
    admin
  </Link>
);

export default function SubHeader() {
  const pathname = usePathname(); // Get the current path dynamically
  console.log("Current Path (pathname):", pathname); // Debugging the current route

  const renderLinks = () => {
    switch (true) {
      case pathname === "/dashboard":
        return <DashboardResultsLink />;
      case pathname === "/dashboard/results":
        return <DashboardLink />;
      case pathname === "/":
        return (
          <>
            <ResultsLink />
            <StandingsLink marginRight={false} />
          </>
        );
      case pathname === "/standings":
        return (
          <>
            <ResultsLink />
            <HomeLink />
          </>
        );
      case pathname === "/auth/login":
        return <HomeLink />;
      case pathname === "/results":
        return (
          <>
            <StandingsLink />
            <HomeLink />
          </>
        );
      case pathname.startsWith("/insight/"): // Handle dynamic insight routes
        return (
          <>
            <HomeLink marginRight={true} />
            <ResultsLink />
            <StandingsLink marginRight={false} />
          </>
        );
      default:
        return null;
    }
  };

  const shouldRenderLoginLink =
    pathname !== "/auth/login" &&
    pathname !== "/dashboard" &&
    pathname !== "/dashboard/results";

  return (
    <div className="flex justify-between">
      <h1 className="mt-1 text-2xl md:text-3xl">monza🏎️</h1>
      <div className="mr-2 mt-3 md:mr-0">
        {/* Conditionally render the 'admin' link unless on specific pages */}
        {shouldRenderLoginLink && <LoginLink />}

        {/* Render links based on the current page */}
        {renderLinks()}
      </div>
    </div>
  );
}
