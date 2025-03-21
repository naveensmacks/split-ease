"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import CardWrapper from "./card-wrapper";
import { newVerification } from "@/actions/actions";

const VerifyEmailForm = () => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const hasRun = useRef(false); // Prevents multiple API calls

  const onSubmit = useCallback(() => {
    if (hasRun.current) return; // 🚀 Prevent second execution (Strict Mode)
    hasRun.current = true;

    console.log("token2: ", token);
    if (success || error) {
      return;
    }

    if (!token) {
      setError("No token provided");
      return;
    }

    newVerification(token)
      .then((data) => {
        console.log(" data : ", data);
        if (data.success) {
          setSuccess(data.success);
        }
        if (data.error) {
          setError(data.error);
        }
      })
      .catch((error) => {
        console.error(error);
        setError("An unexpected error occurred");
      });
  }, [error, success, token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Verifying your email address"
      title="Confirming now..."
      backButtonHref="/login"
      backButtonLabel="Click to login"
    >
      <div className="flex items-center w-full justify-center">
        {!success && !error && <p>Verifying</p>}
        {/* <FormSuccess message={success} />
        {!success && <FormError message={error} />} */}
        {error && <p className="text-red-500/85">{error}</p>}
        {success && <p className="text-primecolor/85">{success}</p>}
      </div>
    </CardWrapper>
  );
};

export default VerifyEmailForm;
