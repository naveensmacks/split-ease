import AuthForm from "@/components/auth-form";
import H1 from "@/components/h1";

import Link from "next/link";

export default async function Page() {
  return (
    <main className="flex flex-grow flex-col gap-y-2 justify-center items-center">
      <H1 className="sm:pt-28 pt-16 m-2">Log In</H1>
      <AuthForm type="login" />
      <p className="text-sm text-zinc-500 pb-11 sm:pb-14">
        No account yet?{" "}
        <Link href="/signup" className="underline text-primecolor/85">
          Sign Up
        </Link>
      </p>
    </main>
  );
}
