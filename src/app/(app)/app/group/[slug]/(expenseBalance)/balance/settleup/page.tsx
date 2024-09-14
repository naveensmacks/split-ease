"use client";
import DisplayInitials from "@/components/display-initials";
import { useGroupContext } from "@/lib/hooks";
import { minimizeTransactions } from "@/lib/utils";
import React from "react";

export default function SettleUpPage() {
  const { selectedGroup } = useGroupContext();
  const balance = selectedGroup?.balance;
  const minTrans = minimizeTransactions(balance);
  return (
    <div>
      {minTrans.map((trans) => (
        <div className="flex px-5 py-5 sm:py-3  sm:my-2 bg-white sm:rounded-lg items-center text-black border-b border-black/10">
          {/* <DisplayInitials
                firstName={trans.user.firstName}
                lastName={balance.user.lastName}
              /> */}
          {trans}
        </div>
      ))}
    </div>
  );
}
