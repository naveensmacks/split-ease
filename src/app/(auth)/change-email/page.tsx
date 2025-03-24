import { Suspense } from "react";
import VerifyChangeEmail from "@/components/verify-change-email";

// Create a loading component
const Loading = () => {
  return <p>Updating email...</p>;
};

export default function VerifyEmailPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Suspense fallback={<Loading />}>
        <VerifyChangeEmail />
      </Suspense>
    </div>
  );
}
