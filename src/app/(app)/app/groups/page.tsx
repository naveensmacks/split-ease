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
      <div className="px-4 sm:px-2 py-2 flex justify-between items-center sticky top-0 bg-primecolor">
        <H1 className="text-xl sm:text-2xl text-white">Groups</H1>
        <AddGroupButton />
      </div>
      <GroupList />
    </>
  );
}
