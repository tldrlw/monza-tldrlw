import Link from "next/link";

export default function SubHeader({ currentPage = "/" }) {
  return (
    <div className="flex justify-between">
      <h1 className="mt-1 text-2xl md:text-3xl">monza🏎️🏁</h1>
      <div className="mt-3">
        {/* Conditionally render 'admin' link unless on the login page */}
        {currentPage !== "/auth/login" && (
          <Link
            href="/auth/login"
            className="mr-10 content-center text-xs italic text-blue-100 hover:underline md:text-base"
          >
            admin
          </Link>
        )}

        {/* Conditionally render 'current standings' link when on the home page */}
        {currentPage === "/" && (
          <Link
            href="/standings"
            className="content-center text-xs italic hover:underline md:text-base"
          >
            {/* Responsive text based on viewport */}
            <span className="md:hidden">👉​ current standings</span>
            <span className="hidden md:inline">
              👉​ current standings (drivers and constructors)
            </span>
          </Link>
        )}

        {/* Conditionally render 'home' link when on the standings or auth/login page */}
        {(currentPage === "/standings" || currentPage === "/auth/login") && (
          <Link
            href="/"
            className="content-center text-xs italic hover:underline md:text-base"
          >
            👉​ home
          </Link>
        )}
      </div>
    </div>
  );
}
