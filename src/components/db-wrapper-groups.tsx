import GroupContextProvider from "@/contexts/group-context-provider";
import { getGroupsByUserId } from "@/lib/server-utils";
import { User } from "@prisma/client";
export default async function DBFetchWrapperGroups({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const groups = await getGroupsByUserId(user.userId);
  return (
    //ToDo: Loading should be unique to each page, allowing for custom loading designs per page.
    //Therefore, instead of setting the data in layout.tsx, we should move the data setting to pages.tsx while keeping the context provider in layout.tsx.
    //No data should be passed to the context in layout.tsx; instead, each pages.tsx should fetch data from the database and update the context provider state.
    <GroupContextProvider data={groups ? groups : []}>
      {children}
    </GroupContextProvider>
  );
}
