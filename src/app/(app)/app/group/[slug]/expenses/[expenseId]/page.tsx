"use client";
import ExpenseDetailsView from "@/components/expense-details-view";
import NavigationHeader from "@/components/navigation-header";
import SettleUpBtn from "@/components/settle-up-btn";
import { Button } from "@/components/ui/button";
import { useGroupContext } from "@/lib/hooks";
import { ExpenseType } from "@prisma/client";
import { ArrowLeftIcon, Pencil2Icon } from "@radix-ui/react-icons";
import Link from "next/link";

type ExpenseSharesPageProps = {
  params: { slug: string; expenseId: string };
};
export default function ExpenseSharesPage({ params }: ExpenseSharesPageProps) {
  const { slug, expenseId } = params;
  const { selectedGroup } = useGroupContext();
  const selectedExpense =
    selectedGroup?.expenses?.find(
      (expense) => expense.expenseId === expenseId
    ) || null;
  // const editRoute = selectedExpense?.expenseType === ExpenseType.PAYMENT ? `/app/group/${slug}/expenses/${expenseId}/edit`;

  return (
    <>
      {selectedExpense?.expenseType !== ExpenseType.PAYMENT && (
        <NavigationHeader
          backRoute={`/app/group/${slug}/expenses`}
          editRoute={`/app/group/${slug}/expenses/${expenseId}/edit`}
        />
      )}
      {selectedExpense?.expenseType === ExpenseType.PAYMENT && (
        <div className="p-1 flex justify-between items-center sm:hidden h-10">
          <Link href={`/app/group/${slug}/expenses`}>
            <ArrowLeftIcon className="w-8 h-8" />
          </Link>

          <SettleUpBtn
            actionType="edit"
            payerId={selectedExpense?.paidById}
            recepientId={selectedExpense?.shares[0].paidToId}
            amount={selectedExpense?.amount}
            settleUpDescription={selectedExpense?.expenseDescription}
            settleUpDate={selectedExpense?.expenseDate}
          >
            <Button variant="realGhost">
              <Pencil2Icon className="w-7 h-7" />
            </Button>
          </SettleUpBtn>
        </div>
      )}

      <ExpenseDetailsView groupId={slug} expenseId={expenseId} />
    </>
  );
}
