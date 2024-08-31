export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  return (
    <main className="flex flex-grow flex-col gap-y-5">
      <p>Logged in as example User</p>
    </main>
  );
}
