import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import React, { useState } from "react";
import MemberForm from "./member-form";
import { cn } from "@/lib/utils";
import H1 from "./h1";

export default function AddMember() {
  const [isAddMemberVisible, setIsAddMemberVisible] = useState(false);

  const toggleAddMemberVisibility = () => {
    setIsAddMemberVisible((prev) => !prev);
  };
  return (
    <>
      <button
        onClick={toggleAddMemberVisibility}
        aria-label="Toggle Member Form"
        className="flex gap-2 items-center mt-2"
      >
        {isAddMemberVisible ? (
          <MinusIcon className="h-5 w-5 sm:h-6 sm:w-6" />
        ) : (
          <PlusIcon className="h-5 w-5 sm:h-6 sm:w-6" />
        )}
        <H1 className="sm:my-2 text-xl sm:text-2xl">Add Member</H1>
      </button>
      <div
        className={cn(
          "transition-all duration-500 ease-in-out overflow-hidden",
          isAddMemberVisible ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <MemberForm />
      </div>
    </>
  );
}
