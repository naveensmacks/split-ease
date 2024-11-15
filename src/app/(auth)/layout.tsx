import AuthFooter from "@/components/auth-footer";
import AuthHeader from "@/components/auth-header";
import Container from "@/components/container";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container>
      <div className="flex flex-col min-h-screen">
        <AuthHeader />
        {children}
        <AuthFooter />
      </div>
    </Container>
  );
}
