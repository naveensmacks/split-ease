import ExpenseForm from "@/components/expense-form";
import H1 from "@/components/h1";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import React from "react";

type ExpenseEditProps = {
  params: { slug: string; expenseId: string };
};
export default function ExpenseEdit({ params }: ExpenseEditProps) {
  return (
    <>
      <div className="p-1 flex justify-between items-center sm:hidden">
        <Link href={`/app/group/${params.slug}/expenses`}>
          <ArrowLeftIcon className="w-8 h-8" />
        </Link>
      </div>
      <div className="px-4 py-2">
        <H1 className="text-xl sm:text-2xl text-white">Edit Expense Details</H1>
      </div>
      <ExpenseForm type="edit" />
    </>
  );
}
