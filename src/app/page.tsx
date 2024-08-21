import image from "../../public/splitEaseIcon.svg";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-primecolor min-h-screen flex flex-col justify-center items-center">
      <div className="max-w-[519px] mx-2">
        <Image src={image} alt="SplitEase logo" width={200} height={200} />
        <h1 className="text-4xl font-semibold my-6 max-w-[500px]">
          Manage your <span className="font-extrabold">Expenses</span> with ease
        </h1>
        <p className="text-2xl font-medium max-w-[600px]">
          Use SplitEase to easily track your expenses and Split them among
          friends with ease.
        </p>
        <div className="mt-10 space-x-3">
          <Button asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
