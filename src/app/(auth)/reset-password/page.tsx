import React, { Suspense } from "react";
import H1 from "@/components/h1";

import ResetPasswordForm from "@/components/reset-password-form";

// Loading component
const Loading = () => {
  return <p>Loading reset password form...</p>;
};
function ResetPasswordPage() {
  return (
    <main className="flex flex-grow flex-col justify-center items-left m-auto w-11/12 sm:w-1/2">
      <H1 className="text-lg sm:text-xl mb-1">Reset Password</H1>
      <Suspense fallback={<Loading />}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}

export default ResetPasswordPage;
