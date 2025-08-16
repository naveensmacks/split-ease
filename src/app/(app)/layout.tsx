import Container from "@/components/container";
import AppFooter from "@/components/app-footer";
import AppHeader from "@/components/app-header";
import { Toaster } from "@/components/ui/sonner";
import SpaceCreatorDiv from "@/components/space-creater-div";
import DBFetchWrapperGroups from "@/components/db-wrapper-groups";
import { Suspense } from "react";
import Loading from "@/components/loading";
import BackgroundPattern from "@/components/background-pattern";
import { checkAuth, getUserById } from "@/lib/server-utils";
import { UserContextProvider } from "@/contexts/user-context-provider";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await checkAuth();
  const user = await getUserById(session.user.id);

  return (
    <>
      <BackgroundPattern />
      <Container>
        <div className="flex flex-col min-h-screen">
          <UserContextProvider initialUser={user}>
            <AppHeader />
            <main className="flex flex-grow flex-col">
              <div className="max-w-[920px] flex flex-col flex-grow h-full w-full sm:p-3 sm:pb-1 mx-auto ">
                <Suspense fallback={<Loading />}>
                  <DBFetchWrapperGroups user={user}>
                    {children}
                  </DBFetchWrapperGroups>
                </Suspense>
              </div>
            </main>
            <SpaceCreatorDiv />
            <AppFooter />
          </UserContextProvider>
        </div>
        <Toaster position="top-right" />
      </Container>
    </>
  );
}
