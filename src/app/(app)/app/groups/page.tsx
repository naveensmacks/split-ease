import AddGroupButton from "@/components/add-group-btn";
import GroupList from "@/components/group-list";
import H1 from "@/components/h1";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  return (
    <>
      <div className="px-4 py-2 flex justify-between items-center">
        <H1 className="sm:my-2 text-xl sm:text-2xl">Groups</H1>
        <AddGroupButton />
      </div>
      <GroupList />
    </>
  );
}
