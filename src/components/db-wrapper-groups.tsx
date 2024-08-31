import GroupContextProvider from "@/contexts/group-context-provider";
import { getGroupsByUserId, getUserByEmail } from "@/lib/server-utils";
export default async function DBFetchWrapperGroups({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserByEmail("user4@example.com");
  const userId = user!.userId;
  const groups = await getGroupsByUserId(userId);
  return (
    <GroupContextProvider data={groups ? groups : []} userId={userId}>
      {children}
    </GroupContextProvider>
  );
}
