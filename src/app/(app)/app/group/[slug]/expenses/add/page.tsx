import ExpenseForm from "@/components/expense-form";
import H1 from "@/components/h1";
import React from "react";

export default function CreateNewExpense() {
  return (
    <>
      <div className="px-4 py-2">
        <H1 className="text-xl sm:text-2xl text-white">Add new expense</H1>
      </div>
      <ExpenseForm type="create" />
    </>
  );
}
