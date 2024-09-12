"use client";
import { useGroupContext } from "@/lib/hooks";
import { formatDate, extractInitials } from "@/lib/utils";
import { InfoCircledIcon, Pencil2Icon } from "@radix-ui/react-icons";
import Link from "next/link";
import React, { useState } from "react";
import H1 from "./h1";
import { Button } from "./ui/button";
import DisplayInitials from "./display-initials";

type ExpenseDetailsViewProps = {
  groupId: string;
  expenseId: string;
};
export default function ExpenseDetailsView({
  groupId,
  expenseId,
}: ExpenseDetailsViewProps) {
  const { getExpenseFromList, selectedGroup } = useGroupContext();
  const expense = getExpenseFromList(expenseId);
  const [viewAdditionalInfo, setViewAdditionalInfo] = useState(false);

  const currencyType = selectedGroup?.currencyType;
  return (
    <>
      {selectedGroup && expense && (
        <>
          <div className="flex p-2 sm:p-0 items-center gap-4">
            <div className="flex flex-col text-white gap-2 sm:gap-3 w-10/12">
              {/*TODO: symbol of the expense type should be shown here */}
              <div className="text-white/70">{expense.expenseType}</div>
              <H1 className="text-2xl sm:text-3xl truncate items-center text-white">
                {expense.expenseDescription}
              </H1>

              <div className="text-[#FFE0B2]">
                {expense.amount.toString() + " " + currencyType}
              </div>

              <div className="flex  text-white/70 justify-start items-center gap-2">
                <DisplayInitials
                  firstName={expense.paidByUser.firstName}
                  lastName={expense.paidByUser.lastName}
                  className="bg-black/50"
                />
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
                  <Pencil2Icon />
                  <span className="ml-1">Edit</span>
                </Link>
              </Button>
            </div>
          </div>

          <div className="flex flex-col p-2 sm:mt-4 sm:p-0 text-black ">
            <H1 className="text-xl sm:text-2xl">
              {expense.shares.length} Participants
            </H1>
            {!viewAdditionalInfo && (
              <button
                onClick={() => {
                  setViewAdditionalInfo((prev) => !prev);
                }}
              >
                <InfoCircledIcon className="w-4 h-4" />
              </button>
            )}
            {viewAdditionalInfo && (
              <div
                className="text-black text-sm mb-2"
                onClick={() => setViewAdditionalInfo((prev) => !prev)}
              >
                <div>
                  {`Created by ${expense.addedByUser.firstName} ${
                    expense.addedByUser.lastName
                  } on ${formatDate(new Date(expense.createdAt))}`}
                </div>
                <div>
                  {`Last updated by ${expense.updatedByUser.firstName} ${
                    expense.updatedByUser.lastName
                  } on ${formatDate(new Date(expense.updatedAt))}`}
                </div>
              </div>
            )}
            <div className="text-black/70 flex flex-col gap-4 mt-3 w-full">
              {expense.shares.map((share) => {
                return (
                  <>
                    {Boolean(share.amount) && (
                      <div
                        key={share.shareId}
                        className="flex justify-between w-full"
                      >
                        <div className="flex justify-start items-center gap-2 w-8/12">
                          <DisplayInitials
                            firstName={share.paidToUser.firstName}
                            lastName={share.paidToUser.lastName}
                          />
                          <div className="truncate w-[80%]">
                            {share.paidToUser.firstName +
                              " " +
                              share.paidToUser.lastName}
                          </div>
                        </div>
                        <div className="flex gap-2 items-center">
                          {Boolean(share.share) && (
                            <div className="text-black/50">
                              {share.share + "x"}
                            </div>
                          )}
                          <div className="text-orange-400">
                            {share.amount.toString() + " " + currencyType}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}
