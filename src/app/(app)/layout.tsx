import Container from "@/components/container";
import AppFooter from "@/components/app-footer";
import AppHeader from "@/components/app-header";
import { Toaster } from "@/components/ui/sonner";
import GroupContextProvider from "@/contexts/group-context-provider";
import { getGroupsByUserId, getUserByEmail } from "@/lib/server-utils";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserByEmail("user4@example.com");
  const userId = user!.userId;
  const groups = await getGroupsByUserId(userId);
  console.log("group: ", groups);
  return (
    <Container>
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <GroupContextProvider data={groups ? groups : []} userId={userId}>
          {children}
        </GroupContextProvider>
        <AppFooter />
      </div>
      <Toaster position="top-right" />
    </Container>
  );
}
