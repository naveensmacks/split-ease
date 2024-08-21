import AddGroupButton from "@/components/add-group-btn";
import H1 from "@/components/h1";
import { getGroupsByUserId } from "@/lib/server-utils";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const userId = "a4ceb2b1-0ec1-4b18-8b6a-2f41463a34b7";
  const group = await getGroupsByUserId(userId);
  console.log("group: ", group);
  return (
    <main className="flex flex-grow flex-col mb-4">
      <div className="max-w-[920px] h-full w-full sm:p-3 mx-auto">
        <div className="px-4 pt-4 pb-2 flex justify-between items-center">
          <H1 className="sm:my-2 text-xl sm:text-2xl">Groups</H1>
          <AddGroupButton />
        </div>
        {group?.map((group) => (
          <div
            key={group.groupId}
            className="flex flex-col bg-white sm:rounded-lg px-5 py-4 sm:my-2 border-b border-black/10"
          >
            <div>{group.groupName}</div>
            <div className="text-black/50">
              Balance: <span className="text-orange-400">-500</span>
            </div>
            <div className="flex justify-between text-black/50">
              <div>Members: {group.users.length}</div>
              <div>
                {(() => {
                  const createdDate = group.createdAt;
                  //Format in the Form of May 18,2022
                  return createdDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                })()}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="h-10 sm:h-0"></div>
    </main>
  );
}
