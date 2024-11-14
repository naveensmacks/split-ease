import AccountDetailsForm from "@/components/account-details-form";
import H1 from "@/components/h1";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default async function AccountsPage() {
  return (
    <>
      <div className="p-1 flex justify-between items-center sm:hidden">
        <Link href={`/app/account`}>
          <ArrowLeftIcon className="w-8 h-8" />
        </Link>
      </div>
      <div className="px-4 py-2">
        <H1 className="text-xl sm:text-2xl text-white">Edit Account Details</H1>
      </div>
      <AccountDetailsForm />
    </>
  );
}
