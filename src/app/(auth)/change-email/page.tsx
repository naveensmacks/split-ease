"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { logOut, verifyEmailChangeToken } from "@/actions/actions";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    async function verifyEmail() {
      console.log("verifyEmail token: ", token);
      if (!token) {
        toast.error("Invalid verification link.");
        return;
      }

      const result = await verifyEmailChangeToken(token);
      setMessage(result.message);
      if (result.isSuccess) {
        toast.success(result.message);
        await logOut();
        setIsSuccess(true);
      } else {
        toast.error(result.message);
      }
    }

    verifyEmail();
  }, [token, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {!message && <p>Updating email...</p>}
      {message && (
        <>
          <p>{message}</p>
          {isSuccess && (
            <Button className="state-effects mt-4" asChild>
              <Link href="/login">Login</Link>
            </Button>
            // <button onClick={() => router.push("/login")}>Log In</button>
          )}
        </>
      )}
    </div>
  );
}
