"use client";
import DisplayInitials from "@/components/display-initials";
import { Button } from "@/components/ui/button";
import { useGroupContext } from "@/lib/hooks";
import Link from "next/link";

type BalancePageProps = {
  params: { slug: string };
};
export default function BalancePageProps({ params }: BalancePageProps) {
  const { selectedGroup } = useGroupContext();
  return (
    <div className="flex flex-col gap-4 justify-center">
      <div>
        {selectedGroup?.balance?.map((balance) => {
          return (
            <Link
              href={`/app/group/${params.slug}/balance/${balance.user.userId}`}
              key={balance.user.userId}
              className="flex px-5 py-5 sm:py-3  sm:my-2 bg-white sm:rounded-lg items-center text-black border-b border-black/10"
            >
              <DisplayInitials
                firstName={balance.user.firstName}
                lastName={balance.user.lastName}
              />
              <div className="flex flex-col grow mx-3">
                <div className="truncate">
                  {balance.user.firstName + " " + balance.user.lastName}
                </div>
              </div>
              <div
                className={
                  balance.amount < 0 ? "text-orange-400" : "text-primecolor"
                }
              >
                {balance.amount + " " + selectedGroup.currencyType}
              </div>
            </Link>
          );
        })}
      </div>
      <div className="flex items-center justify-center mb-10">
        <Button className="w-1/2" asChild>
          <Link href={`/app/group/${params.slug}/balance/settleup`}>
            Settle Up
          </Link>
        </Button>
      </div>
    </div>
  );
}
