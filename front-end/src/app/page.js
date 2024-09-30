export default function App() {
  const buildTime =
    process.env.NEXT_PUBLIC_BUILD_TIME || "build time placeholder";
  const image = process.env.NEXT_PUBLIC_IMAGE || "image placeholder";

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
      </div>
    </main>
  );
}
