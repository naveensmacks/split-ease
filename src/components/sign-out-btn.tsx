"use client";
import { useTransition } from "react";
import { Button } from "./ui/button";
import { logOut } from "@/actions/actions";

export default function SignOutBtn() {
  //use transition hook needs to be used as we invoking outside the form
  //inside the form we can use useFormStatus
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      disabled={isPending}
      onClick={async () => {
        startTransition(async () => await logOut("/"));
      }}
      className="rounded-md state-effects mt-20"
    >
      Sign Out
    </Button>
  );
}
