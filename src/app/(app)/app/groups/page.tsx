import AddGroupButton from "@/components/add-group-btn";
import GroupList from "@/components/group-list";
import H1 from "@/components/h1";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  return (
    <main className="flex flex-grow flex-col mb-4">
      <div className="max-w-[920px] h-full w-full sm:p-3 mx-auto">
        <div className="px-4 pt-4 pb-2 flex justify-between items-center">
          <H1 className="sm:my-2 text-xl sm:text-2xl">Groups</H1>
          <AddGroupButton />
        </div>
        <GroupList />
      </div>
      <div className="h-10 sm:h-0"></div>
    </main>
  );
}
