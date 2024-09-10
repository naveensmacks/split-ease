"use client";
import AddExpenseButton from "@/components/add-expense-btn";
import { useGroupContext } from "@/lib/hooks";
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
              {/* add initial of first name and last name in a circle */}
              <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center">
                {item.paidByUser.firstName.slice(0, 1) +
                  (item.paidByUser.lastName
                    ? item.paidByUser.lastName.slice(0, 1)
                    : ".")}
              </div>
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
