import GroupContextProvider from "@/contexts/group-context-provider";
import { getGroupsByUserId, getUserByEmail } from "@/lib/server-utils";
export default async function DBFetchWrapperGroups({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserByEmail("user4@example.com");
  console.log("user: ", user);
  const userId = user!.userId;
  const groups = await getGroupsByUserId(userId);
  return (
    //ToDo: Loading should be unique to each page, allowing for custom loading designs per page.
    //Therefore, instead of setting the data in layout.tsx, we should move the data setting to pages.tsx while keeping the context provider in layout.tsx.
    //No data should be passed to the context in layout.tsx; instead, each pages.tsx should fetch data from the database and update the context provider state.
    <GroupContextProvider data={groups ? groups : []} userId={userId}>
      {children}
    </GroupContextProvider>
  );
}
