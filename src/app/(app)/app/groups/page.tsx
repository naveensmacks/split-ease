import H1 from "@/components/h1";

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  return (
    <main className="flex flex-grow flex-col mb-4">
      <H1 className="mb-5 sm:text-3xl">Groups</H1>
      <div className="h-10 sm:h-0"></div>
    </main>
  );
}
