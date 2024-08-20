import Container from "@/components/container";
import AppFooter from "@/components/app-footer";
import AppHeader from "@/components/app-header";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container>
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        {children}
        <AppFooter />
      </div>
    </Container>
  );
}
