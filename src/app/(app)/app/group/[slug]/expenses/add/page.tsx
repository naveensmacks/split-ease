import ExpenseForm from "@/components/expense-form";
import H1 from "@/components/h1";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import React from "react";

type CreateNewExpenseProps = {
  params: { slug: string };
};
export default function CreateNewExpense({ params }: CreateNewExpenseProps) {
  return (
    <>
      <div className="p-1 flex justify-between items-center sm:hidden">
        <Link href={`/app/group/${params.slug}/expenses`}>
          <ArrowLeftIcon className="w-8 h-8" />
        </Link>
      </div>
      <div className="px-4 py-2">
        <H1 className="text-xl sm:text-2xl text-white">Add new expense</H1>
      </div>
      <ExpenseForm type="create" />
    </>
  );
}
