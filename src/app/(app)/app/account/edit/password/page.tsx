import H1 from "@/components/h1";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { checkAuth, getUserById } from "@/lib/server-utils";
import EditPasswordForm from "@/components/edit-password-form";

export default async function EditPasswordPage() {
  const session = await checkAuth();
  const user = await getUserById(session.user.id);

  return (
    <>
      <div className="p-1 flex justify-between items-center sm:hidden">
        <Link href={`/app/account/edit`}>
          <ArrowLeftIcon className="w-8 h-8" />
        </Link>
      </div>
      <div className="px-4 py-2">
        <H1 className="text-xl sm:text-2xl text-white">Edit Password</H1>
      </div>
      <EditPasswordForm user={user} />
    </>
  );
}
