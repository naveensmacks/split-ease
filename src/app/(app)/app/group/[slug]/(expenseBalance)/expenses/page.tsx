"use client";
import AddExpenseButton from "@/components/add-expense-btn";
import DisplayInitials from "@/components/display-initials";
import ExpenseSearchForm from "@/components/expense-search-form";
import { useGroupContext, useUserContext } from "@/lib/hooks";
import { ExpenseWithRelations } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";
import { ExpenseType } from "@prisma/client";
import Decimal from "decimal.js";
import Link from "next/link";
import { useEffect, useState } from "react";

type ExpensesPageProps = {
  params: { slug: string };
};
export default function ExpensesPage({ params }: ExpensesPageProps) {
  const { selectedGroup } = useGroupContext();
  const { user } = useUserContext();
  const userId = user.userId;
  //sort expenses by date
  let sortedExpenses = selectedGroup?.expenses?.sort(
    (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
  );
  const [expenses, setExpenses] = useState(sortedExpenses);
  const [allExpenses, setAllExpenses] = useState(expenses);
  const currencyType = selectedGroup?.currencyType;

  const getYourBalance = (expense: ExpenseWithRelations) => {
    let balance = new Decimal(0);
    if (expense.shares) {
      if (expense.paidByUser.userId === userId) {
        balance = expense.shares
          .filter((share) => share.paidToId !== userId)
          .reduce((prevval, share) => {
            return new Decimal(prevval).plus(share.amount);
          }, new Decimal(0));
      } else {
        balance = expense.shares
          .filter((share) => share.paidToId === userId)
          .reduce((prevval, share) => {
            return new Decimal(prevval).plus(share.amount);
          }, new Decimal(0));
        //negate the balance
        balance = new Decimal(0).minus(balance);
      }
    }
    balance.toDecimalPlaces(2);
    const balanceLessThanZero = balance.lessThan(0);
    const balanceIsZero = balance.isZero();
    return (
      <div
        className={cn("text-xs", {
          "text-orange-400": balanceLessThanZero,
          "text-primecolor": !balanceLessThanZero,
          "text-inherit": balanceIsZero,
        })}
      >
        {balanceIsZero
          ? "Not Involved"
          : balanceLessThanZero
          ? balance.toString() + " " + currencyType
          : "+" + balance.toString() + " " + currencyType}
      </div>
    );
  };

  useEffect(() => {
    const fetchExpenses = async () => {
      let sortedExpenses = selectedGroup?.expenses?.sort(
        (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
      );
      setExpenses(sortedExpenses);
      setAllExpenses(sortedExpenses);
    };
    fetchExpenses();
  }, [selectedGroup]); // empty dependency array means this effect runs only once on mount

  return (
    <>
      <div className="fixed sm:hidden right-4 bottom-14">
        <AddExpenseButton />
      </div>

      <ExpenseSearchForm
        allExpenses={allExpenses}
        expenses={expenses}
        setExpenses={setExpenses}
      />

      {expenses && expenses.length > 0 ? (
        expenses.map((item) => {
          if (ExpenseType.PAYMENT === item.expenseType) {
            return (
              <Link
                href={`/app/group/${params.slug}/expenses/${item.expenseId}`}
                key={item.expenseId}
                className="flex px-4 py-3 sm:py-3  sm:my-2 bg-white sm:rounded-lg items-center text-black border-b border-black/10"
              >
                <DisplayInitials
                  firstName={item.paidByUser.firstName}
                  lastName={item.paidByUser.lastName}
                />
                <div className="flex flex-col grow mx-3">
                  <div>{"Money Transfer"}</div>
                  <div className="text-black/50 flex flex-col text-sm">
                    <span className="truncate max-w-[180px] sm:max-w-[200px]">
                      Paid by&nbsp;
                      {item.paidByUser.firstName +
                        " " +
                        item.paidByUser.lastName}
                    </span>
                    <span>{formatDate(new Date(item.expenseDate))}</span>
                  </div>
                </div>
                <div className="text-black/50 text-sm flex flex-col items-end">
                  <div>{item.amount.toString() + " " + currencyType}</div>
                  {getYourBalance(item)}
                </div>
              </Link>
            );
          }
          return (
            <Link
              href={`/app/group/${params.slug}/expenses/${item.expenseId}`}
              key={item.expenseId}
              className="flex px-4 py-3 sm:py-3  sm:my-2 bg-white sm:rounded-lg items-center text-black border-b border-black/10"
            >
              <DisplayInitials
                firstName={item.paidByUser.firstName}
                lastName={item.paidByUser.lastName}
              />
              <div className="flex flex-col grow mx-3">
                <div>{item.expenseDescription}</div>
                <div className="text-black/50 flex flex-col text-sm">
                  <span className="truncate max-w-[180px] sm:max-w-[200px]">
                    Paid by&nbsp;
                    {item.paidByUser.firstName + " " + item.paidByUser.lastName}
                  </span>
                  <span>{formatDate(new Date(item.expenseDate))}</span>
                </div>
              </div>
              <div className="text-black/50 text-sm flex flex-col items-end">
                <div>{item.amount.toString() + " " + currencyType}</div>
                {getYourBalance(item)}
              </div>
            </Link>
          );
        })
      ) : (
        <EmptyView selectedGroupId={params.slug} />
      )}
    </>
  );
}

function EmptyView({ selectedGroupId }: { selectedGroupId: string }) {
  return (
    <div className="flex items-center justify-center text-black/40 rounded-lg min-h-64">
      <Link
        href={`/app/group/${selectedGroupId}/expenses/add`}
        className="h-15 max-w-96 p-5 flex items-center justify-center"
      >
        You don&apos;t have any expenses. Add one now!
      </Link>
    </div>
  );
}
