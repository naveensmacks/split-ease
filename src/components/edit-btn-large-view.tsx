import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Pencil2Icon } from "@radix-ui/react-icons";

type EditButtonLargeViewProps = {
  href: string;
};
export default function EditButtonLargeView({
  href,
}: EditButtonLargeViewProps) {
  return (
    <div className="hidden sm:block">
      <Button className="state-effects opacity-90 w-[100%]" asChild>
        <Link href={href}>
          <Pencil2Icon />
          <span className="ml-1">Edit</span>
        </Link>
      </Button>
    </div>
  );
}
