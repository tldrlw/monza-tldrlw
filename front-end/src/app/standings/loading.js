import SubHeader from "@/components/SubHeader";

export default function Loading() {
  return (
    <main>
      <SubHeader currentPage="/standings"></SubHeader>
      <p>Loading standings...</p>
    </main>
  );
}

// https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming
