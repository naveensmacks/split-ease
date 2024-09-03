"use client";
import H1 from "@/components/h1";
import NavigationHeader from "@/components/navigation-header";
import { Button } from "@/components/ui/button";
import { useGroupContext } from "@/lib/hooks";
import { extractInitials, formatDate } from "@/lib/utils";
import { Pencil1Icon } from "@radix-ui/react-icons";
import Link from "next/link";
import React, { useEffect } from "react";

type ExpenseSharesPageProps = {
  params: { slug: string; expenseId: string };
};
export default function ExpenseSharesPage({ params }: ExpenseSharesPageProps) {
  const groupId = params.slug;
  const expenseId = params.expenseId;
  const {
    handleChangeSelectedGroupId,
    handleSelectedExpenseId,
    getExpenseFromList,
    selectedGroup,
  } = useGroupContext();
  const expense = getExpenseFromList(expenseId);
  console.log("groupId1: ", groupId, "expenseId1: ", expenseId);
  console.log("expense: ", expense);

  const currencyType = selectedGroup?.currencyType;
  useEffect(() => {
    handleChangeSelectedGroupId(groupId);
    handleSelectedExpenseId(expenseId);
  }, [handleChangeSelectedGroupId, handleSelectedExpenseId]);

  return (
    <div>
      <NavigationHeader
        backRoute={`/app/group/${groupId}/expenses`}
        editRoute={`/app/group/${groupId}/expense/${expenseId}/edit`}
      />
      {selectedGroup && expense && (
        <>
          <div className="flex p-2 sm:p-0 items-center gap-4">
            <div className="flex flex-col text-white gap-2 sm:gap-3 w-10/12">
              {/*TODO: symbol of the expense type should be shown here */}
              <div className="text-white/70">{expense.expenseType}</div>
              <H1 className="text-2xl sm:text-3xl truncate items-center text-white">
                {expense.expenseDescription}
              </H1>

              <div>{expense.amount.toString() + " " + currencyType}</div>

              <div className="flex  text-white/70 justify-start items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center">
                  {expense.paidByUser.firstName.slice(0, 1) +
                    (expense.paidByUser.lastName
                      ? expense.paidByUser.lastName.slice(0, 1)
                      : ".")}
                </div>
                <div>
                  {"Paid by " +
                    expense.paidByUser.firstName +
                    " " +
                    expense.paidByUser.lastName +
                    " on " +
                    formatDate(new Date(expense.expenseDate))}
                </div>
              </div>
            </div>
            <div className="hidden sm:block">
              <Button className="state-effects opacity-90 w-[100%]" asChild>
                <Link
                  href={`/app/group/${selectedGroup.groupId}/expenses/${expense.expenseId}/edit`}
                >
                  <Pencil1Icon />
                  <span className="ml-1">Edit</span>
                </Link>
              </Button>
            </div>
          </div>

          <div className="flex flex-col p-2 sm:mt-4 sm:p-0 text-black ">
            <H1 className="text-xl sm:text-2xl">
              {expense.shares.length} Participants
            </H1>
            <div className="text-black text-sm mb-2">
              Split by {expense.splitBy}
            </div>
            <div className="text-black/70 flex flex-col gap-4 mt-3 w-full">
              {expense.shares.map((share) => {
                return (
                  <div
                    key={share.shareId}
                    className="flex justify-between w-full"
                  >
                    <div className="flex justify-start items-center gap-2 w-8/12">
                      <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center">
                        {extractInitials(
                          share.paidToUser.firstName,
                          share.paidToUser.lastName
                        )}
                      </div>
                      <div className="truncate w-[80%]">
                        {share.paidToUser.firstName +
                          " " +
                          share.paidToUser.lastName}
                      </div>
                    </div>
                    <div className="flex gap-2 items-center">
                      {expense.splitBy !== "UNEQUAL" && (
                        <div className="text-black/50">{share.share + "x"}</div>
                      )}
                      <div>{share.amount.toString() + " " + currencyType}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
