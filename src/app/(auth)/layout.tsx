import AuthFooter from "@/components/auth-footer";
import AuthHeader from "@/components/auth-header";
import BackgroundPattern from "@/components/background-pattern";
import Container from "@/components/container";
import { Toaster } from "sonner";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* BackgroundPattern for auth pages*/}
      <div className="fixed bg-primecolor sm:h-[73px] h-16 w-full top-0 -z-10"></div>
      <Container>
        <div className="flex flex-col min-h-screen">
          <AuthHeader />
          {children}
          <AuthFooter />
        </div>
        <Toaster position="top-right" />
      </Container>
    </>
  );
}
