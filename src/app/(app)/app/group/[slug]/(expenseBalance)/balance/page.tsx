"use client";
import DisplayInitials from "@/components/display-initials";
import SettleUpBtn from "@/components/settle-up-btn";
import { Button } from "@/components/ui/button";
import { useGroupContext } from "@/lib/hooks";

import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useState } from "react";

type BalancePageProps = {
  params: { slug: string };
};
export default function BalancePageProps({ params }: BalancePageProps) {
  const { selectedGroup, detailedBalance: balance } = useGroupContext();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Toggle function for expanding/collapsing
  const toggleExpand = (userId: string) => {
    setExpandedIds((prevExpandedIds) => {
      const newExpandedIds = new Set(prevExpandedIds);
      if (newExpandedIds.has(userId)) {
        newExpandedIds.delete(userId);
      } else {
        newExpandedIds.add(userId);
      }
      return newExpandedIds;
    });
  };

  return (
    <div className="flex flex-col gap-4 justify-center">
      <div>
        {balance?.map((balance) => {
          const isExpanded = expandedIds.has(balance.user.userId);
          return (
            <div
              key={balance.user.userId}
              className="flex flex-col px-4 py-5 sm:py-3  sm:my-2 bg-white sm:rounded-lg  text-black border-b border-black/10"
              onClick={() => toggleExpand(balance.user.userId)}
            >
              <div key={balance.user.userId} className="flex  items-center">
                <DisplayInitials
                  firstName={balance.user.firstName}
                  lastName={balance.user.lastName}
                />
                <div className="flex flex-col grow mx-3">
                  <div className="max-w-[200px] sm:max-w-[400px] truncate">
                    {balance.user.firstName + " " + balance.user.lastName}
                  </div>
                </div>
                <div
                  className={
                    balance.amount < 0 ? "text-orange-400" : "text-primecolor"
                  }
                >
                  {balance.amount + " " + selectedGroup?.currencyType}
                </div>
              </div>
              {/* Transactors details with expand/collapse effect */}
              <div
                className={`flex flex-col ml-12 px-1 gap-y-2 overflow-hidden transition-all duration-300 ease-out ${
                  isExpanded ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {balance.transactors?.map((transactor) => {
                  return transactor.amount > 0 ? (
                    <div
                      key={transactor.user.userId}
                      className="flex items-center justify-between sm:w-9/12"
                    >
                      <div className="flex items-center gap-x-2">
                        <PlusIcon className="min-w-3 min-h-3 hidden sm:block" />
                        <div>
                          {transactor.user.firstName +
                            " " +
                            transactor.user.lastName}{" "}
                          owes{" "}
                          <span className="text-primecolor">
                            {transactor.amount +
                              " " +
                              selectedGroup?.currencyType}
                          </span>{" "}
                          to{" "}
                          {balance.user.firstName + " " + balance.user.lastName}
                        </div>
                      </div>
                      <SettleUpBtn
                        actionType="add"
                        payerId={transactor.user.userId}
                        recepientId={balance.user.userId}
                        amount={Math.abs(transactor.amount)}
                      >
                        Settle Up
                      </SettleUpBtn>
                    </div>
                  ) : (
                    <div
                      key={transactor.user.userId}
                      className="flex items-center justify-between sm:w-9/12"
                    >
                      <div className="flex items-center gap-x-2">
                        <MinusIcon className="min-w-3 min-h-3 hidden sm:block" />
                        <div>
                          {balance.user.firstName + " " + balance.user.lastName}{" "}
                          owes{" "}
                          <span className="text-orange-400">
                            {-transactor.amount +
                              " " +
                              selectedGroup?.currencyType}
                          </span>{" "}
                          to{" "}
                          {transactor.user.firstName +
                            " " +
                            transactor.user.lastName}
                        </div>
                      </div>
                      <SettleUpBtn
                        actionType="add"
                        payerId={balance.user.userId}
                        recepientId={transactor.user.userId}
                        amount={Math.abs(transactor.amount)}
                      >
                        Settle Up
                      </SettleUpBtn>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-center mb-10">
        <Button className="w-1/2 rounded-lg bg-opacity-85" asChild>
          <Link href={`/app/group/${params.slug}/balance/settleup`}>
            Settle all balances
          </Link>
        </Button>
      </div>
    </div>
  );
}
