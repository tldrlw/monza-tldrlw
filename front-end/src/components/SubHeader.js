import Link from "next/link";

// Reusable components for Links
const ResultsLink = () => (
  <Link
    href="/results"
    className="mr-5 content-center text-xs italic hover:underline md:mr-10 md:text-base"
  >
    👉​results
  </Link>
);

const StandingsLink = ({ marginRight = true }) => (
  <Link
    href="/standings"
    className={`content-center text-xs italic hover:underline md:text-base ${
      marginRight ? "mr-5 md:mr-10" : ""
    }`}
  >
    <span className="md:hidden">👉​standings</span>
    <span className="hidden md:inline">
      👉​standings (drivers & constructors)
    </span>
  </Link>
);

const HomeLink = () => (
  <Link
    href="/"
    className="content-center text-xs italic hover:underline md:text-base"
  >
    👉​home
  </Link>
);

const DashboardLink = () => (
  <Link
    href="/dashboard"
    className="content-center text-xs italic hover:underline md:text-base"
  >
    👉​dashboard
  </Link>
);

const DashboardResultsLink = () => (
  <Link
    href="/dashboard/results"
    className="content-center text-xs italic hover:underline md:text-base"
  >
    👉​results
  </Link>
);

const LoginLink = () => (
  <Link
    href="/auth/login"
    className="mr-5 content-center text-xs italic text-blue-100 hover:underline md:mr-10 md:text-base"
  >
    admin
  </Link>
);

export default function SubHeader({ currentPage = "/" }) {
  const renderLinks = () => {
    switch (currentPage) {
      case "/dashboard":
        return <DashboardResultsLink />;
      case "/dashboard/results":
        return <DashboardLink />;
      case "/":
        return (
          <>
            <ResultsLink />
            <StandingsLink marginRight={false} />
          </>
        );
      case "/standings":
        return (
          <>
            <ResultsLink />
            <HomeLink />
          </>
        );
      case "/auth/login":
        return <HomeLink />;
      case "/results":
        return (
          <>
            <StandingsLink />
            <HomeLink />
          </>
        );
      default:
        return null;
    }
  };

  const shouldRenderLoginLink =
    currentPage !== "/auth/login" &&
    currentPage !== "/dashboard" &&
    currentPage !== "/dashboard/results";

  return (
    <div className="flex justify-between">
      <h1 className="mt-1 text-2xl md:text-3xl">monza🏎️🏁</h1>
      <div className="mr-2 mt-3 md:mr-0">
        {/* Conditionally render the 'admin' link unless on specific pages */}
        {shouldRenderLoginLink && <LoginLink />}

        {/* Render links based on the current page */}
        {renderLinks()}
      </div>
    </div>
  );
}
