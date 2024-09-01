import { ArrowLeftIcon, GearIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function NavigationHeader() {
  return (
    <div className="pt-1 flex justify-between items-center sm:hidden">
      <Link href="/app/groups">
        <ArrowLeftIcon className="w-8 h-8" />
      </Link>
      <Link href="/app/account">
        <GearIcon className="w-8 h-8" />
      </Link>
    </div>
  );
}
