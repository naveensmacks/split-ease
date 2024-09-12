"use client";
import AddExpenseButton from "@/components/add-expense-btn";
import DisplayInitials from "@/components/display-initials";
import { useGroupContext } from "@/lib/hooks";
import { ExpenseWithRelations } from "@/lib/types";
import Link from "next/link";

type ExpensesPageProps = {
  params: { slug: string };
};
export default function ExpensesPage({ params }: ExpensesPageProps) {
  console.log("paramsP: ", params);
  const { selectedGroup } = useGroupContext();
  const expenses = selectedGroup?.expenses;
  const currencyType = selectedGroup?.currencyType;
  return (
    <>
      <div className="fixed sm:hidden right-4 bottom-14">
        <AddExpenseButton />
      </div>
      {expenses &&
        expenses.length > 0 &&
        expenses.map((item) => {
          return (
            <Link
              href={`/app/group/${params.slug}/expenses/${item.expenseId}`}
              key={item.expenseId}
              className="flex px-5 py-5 sm:py-3  sm:my-2 bg-white sm:rounded-lg items-center text-black border-b border-black/10"
            >
              <DisplayInitials
                firstName={item.paidByUser.firstName}
                lastName={item.paidByUser.lastName}
              />
              <div className="flex flex-col grow mx-3">
                <div>{item.expenseDescription}</div>
                <div className="text-black/50">
                  Paid by{" "}
                  {item.paidByUser.firstName + " " + item.paidByUser.lastName}
                </div>
              </div>
              <div className="text-black/50 text-sm">
                {item.amount.toString() + " " + currencyType}
              </div>
            </Link>
          );
        })}
    </>
  );
}
