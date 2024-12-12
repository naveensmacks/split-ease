"use client";
import DisplayInitials from "@/components/display-initials";
import H1 from "@/components/h1";
import { MyAlertDialog } from "@/components/my-alert-dialog";
import { Button } from "@/components/ui/button";
import { useGroupContext } from "@/lib/hooks";
import { transactions } from "@/lib/utils";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type SettleUpPageProps = {
  params: { slug: string };
};
export default function SettleUpPage({ params }: SettleUpPageProps) {
  const { selectedGroup, handleSettleAllBalances } = useGroupContext();
  const trans = transactions(selectedGroup);
  const router = useRouter();

  const onClick = async () => {
    if (trans) {
      await handleSettleAllBalances(trans);
    }
    toast.success("All the balances have been settled successfully");
    router.push(`/app/group/${params.slug}/balance`);
  };
  return (
    <>
      <div className="p-1 flex justify-between items-center sm:hidden">
        <Link href={`/app/group/${params.slug}/balance`}>
          <ArrowLeftIcon className="w-8 h-8" />
        </Link>
      </div>
      <div className="px-4 py-2">
        <H1 className="text-xl sm:text-2xl text-white">Preview settlement</H1>
      </div>

      <div className="p-1 rounded-lg">
        {trans &&
          trans.map((item, index) => (
            <div
              key={index}
              className="flex px-5 py-5 sm:py-3 bg-white sm:my-2 sm:rounded-lg items-center border-b border-black/10"
            >
              <DisplayInitials
                firstName={item.ower.firstName}
                lastName={item.ower.lastName}
              />
              <div className="flex flex-col grow mx-3">
                <div className="truncate">
                  {item.ower.firstName + " " + item.ower.lastName}
                </div>

                <div className="text-black/50 text-sm">
                  Owes{" "}
                  {item.amount.toString() + " " + selectedGroup?.currencyType}
                </div>
                <div className="">
                  to {item.owed.firstName + " " + item.owed.lastName}
                </div>
              </div>
            </div>
          ))}
      </div>
      {trans && trans.length == 0 ? (
        <div className="flex items-center justify-center m-3">
          <H1 className="text-lg text-white">It&apos;s all settled up</H1>
        </div>
      ) : (
        <div className="flex items-center justify-center m-3">
          <MyAlertDialog
            title="Are you sure you want to settle all balances?"
            content="Do this only if all balances are settled."
            onSubmit={onClick}
          >
            <Button className="w-1/2 rounded-lg bg-opacity-85">
              Settle all balances
            </Button>
          </MyAlertDialog>
        </div>
      )}
    </>
  );
}
