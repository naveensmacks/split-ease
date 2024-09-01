import Container from "@/components/container";
import AppFooter from "@/components/app-footer";
import AppHeader from "@/components/app-header";
import { Toaster } from "@/components/ui/sonner";
import SpaceCreatorDiv from "@/components/space-creater-div";
import DBFetchWrapperGroups from "@/components/db-wrapper-groups";
import { Suspense } from "react";
import Loading from "@/components/loading";
import BackgroundPattern from "@/components/background-pattern";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BackgroundPattern />
      <Container>
        <div className="flex flex-col min-h-screen">
          <AppHeader />
          <main className="flex flex-grow flex-col">
            <div className="max-w-[920px] h-full w-full sm:p-3 mx-auto ">
              <Suspense fallback={<Loading />}>
                <DBFetchWrapperGroups>{children}</DBFetchWrapperGroups>
              </Suspense>
            </div>
          </main>
          <SpaceCreatorDiv />
          <AppFooter />
        </div>
        <Toaster position="top-right" />
      </Container>
    </>
  );
}
