import Container from "@/components/container";
import AppFooter from "@/components/app-footer";
import AppHeader from "@/components/app-header";
import { Toaster } from "@/components/ui/sonner";
import GroupContextProvider from "@/contexts/group-context-provider";
import { getGroupsByUserId, getUserByEmail } from "@/lib/server-utils";
import SpaceCreatorDiv from "@/components/space-creater-div";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserByEmail("user4@example.com");
  const userId = user!.userId;
  const groups = await getGroupsByUserId(userId);
  return (
    <Container>
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex flex-grow flex-col">
          <div className="max-w-[920px] h-full w-full sm:p-3 mx-auto">
            <GroupContextProvider data={groups ? groups : []} userId={userId}>
              {children}
            </GroupContextProvider>
          </div>
        </main>
        <SpaceCreatorDiv />
        <AppFooter />
      </div>
      <Toaster position="top-right" />
    </Container>
  );
}
