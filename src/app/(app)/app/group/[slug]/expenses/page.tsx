"use client";
import { useGroupContext } from "@/lib/hooks";

type ExpensesPageProps = {
  params: { slug: string };
};
export default async function ExpensesPage({ params }: ExpensesPageProps) {
  console.log("paramsP: ", params);
  const { selectedGroup } = useGroupContext();
  const expenses = selectedGroup?.expenses;
  return (
    <div>
      {expenses &&
        expenses.length > 0 &&
        expenses.map((item) => {
          return (
            <div key={item.expenseId}>
              <div>{item.expenseDescription}</div>
              <div>
                Paid by:{" "}
                {item.paidByUser.firstName + " " + item.paidByUser.lastName}
              </div>
              <div>{item.amount.toString()}</div>
            </div>
          );
        })}
      {expenses &&
        expenses.length > 0 &&
        expenses.map((item) => {
          return (
            <div key={item.expenseId}>
              <div>{item.expenseDescription}</div>
              <div>
                Paid by:{" "}
                {item.paidByUser.firstName + " " + item.paidByUser.lastName}
              </div>
              <div>{item.amount.toString()}</div>
            </div>
          );
        })}
      {expenses &&
        expenses.length > 0 &&
        expenses.map((item) => {
          return (
            <div key={item.expenseId}>
              <div>{item.expenseDescription}</div>
              <div>
                Paid by:{" "}
                {item.paidByUser.firstName + " " + item.paidByUser.lastName}
              </div>
              <div>{item.amount.toString()}</div>
            </div>
          );
        })}
      {expenses &&
        expenses.length > 0 &&
        expenses.map((item) => {
          return (
            <div key={item.expenseId}>
              <div>{item.expenseDescription}</div>
              <div>
                Paid by:{" "}
                {item.paidByUser.firstName + " " + item.paidByUser.lastName}
              </div>
              <div>{item.amount.toString()}</div>
            </div>
          );
        })}
      {expenses &&
        expenses.length > 0 &&
        expenses.map((item) => {
          return (
            <div key={item.expenseId}>
              <div>{item.expenseDescription}</div>
              <div>
                Paid by:{" "}
                {item.paidByUser.firstName + " " + item.paidByUser.lastName}
              </div>
              <div>{item.amount.toString()}</div>
            </div>
          );
        })}
      {expenses &&
        expenses.length > 0 &&
        expenses.map((item) => {
          return (
            <div key={item.expenseId}>
              <div>{item.expenseDescription}</div>
              <div>
                Paid by:{" "}
                {item.paidByUser.firstName + " " + item.paidByUser.lastName}
              </div>
              <div>{item.amount.toString()}</div>
            </div>
          );
        })}
      {expenses &&
        expenses.length > 0 &&
        expenses.map((item) => {
          return (
            <div key={item.expenseId}>
              <div>{item.expenseDescription}</div>
              <div>
                Paid by:{" "}
                {item.paidByUser.firstName + " " + item.paidByUser.lastName}
              </div>
              <div>{item.amount.toString()}</div>
            </div>
          );
        })}
      {expenses &&
        expenses.length > 0 &&
        expenses.map((item) => {
          return (
            <div key={item.expenseId}>
              <div>{item.expenseDescription}</div>
              <div>
                Paid by:{" "}
                {item.paidByUser.firstName + " " + item.paidByUser.lastName}
              </div>
              <div>{item.amount.toString()}</div>
            </div>
          );
        })}
    </div>
  );
}
