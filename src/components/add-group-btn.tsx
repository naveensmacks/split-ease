import React from "react";
import { Button } from "./ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function AddGroupButton() {
  return (
    <Button className="h-9 w-9 px-0 py-0 sm:px-4 sm:w-fit sm:py-2" asChild>
      <Link href="/app/groups/create">
        <PlusIcon className="w-6 h-6 sm:hidden block" />
        <span className="hidden sm:block">Add Group</span>
      </Link>
    </Button>
  );
}
