import AuthForm from "@/components/auth-form";
import H1 from "@/components/h1";
import Link from "next/link";

export default function Page() {
  return (
    <main className="flex flex-grow flex-col gap-y-2 justify-center items-center">
      <H1 className="mb-2">Sign Up</H1>
      <AuthForm type="signup" />
      <p className="text-sm text-zinc-500">
        Already have an account?{" "}
        <Link href="/login" className="underline text-primecolor/85">
          Log In
        </Link>
      </p>
    </main>
  );
}
