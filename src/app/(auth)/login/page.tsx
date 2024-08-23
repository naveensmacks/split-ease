import AuthForm from "@/components/auth-form";
import H1 from "@/components/h1";
import { sleep } from "@/lib/utils";

import Link from "next/link";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  return (
    <main className="flex flex-grow flex-col gap-y-5 justify-center items-center">
      <H1 className="mb-5 sm:text-4xl">Log In</H1>
      <AuthForm type="login" />
      <p className="mt-6 text-sm text-zinc-500">
        No account yet?{" "}
        <Link href="/signup" className="underline text-primecolor/85">
          Sign Up
        </Link>
      </p>
    </main>
  );
}
