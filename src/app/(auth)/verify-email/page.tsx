import VerifyEmailForm from "@/components/verify-email-form";
import React, { Suspense } from "react";

// Add a loading component
const Loading = () => {
  return (
    <div className="flex justify-center items-center">
      <p>Loading verification...</p>
    </div>
  );
};

const VerifyEmailPage = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Suspense fallback={<Loading />}>
        <VerifyEmailForm />
      </Suspense>
    </div>
  );
};

export default VerifyEmailPage;
