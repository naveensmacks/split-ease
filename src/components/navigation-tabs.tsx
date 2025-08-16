"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import AddExpenseButton from "./add-expense-btn";

type NavigationTabsProps = {
  groupId: string;
};
export default function NavigationTabs({ groupId }: NavigationTabsProps) {
  const activePathname = usePathname();
  const isExpensesPage = activePathname?.includes("expenses");
  const isBalancePage = activePathname?.includes("balance");
  const isAiChatPage = activePathname?.includes("chatbot");
  console.log("activePathname: ", activePathname);
  return (
    <div className="sticky h-11 top-0 flex bg-primecolor justify-between sm:justify-start sm:gap-16 items-center text-black border-t border-white/10">
      <div
        className={cn(
          "hover:text-white relative mx-auto sm:mx-0 flex items-center transition  text-white/50",
          {
            "text-white": isExpensesPage,
          }
        )}
      >
        <Link href={`/app/group/${groupId}/expenses`} className="mb-2">
          Expenses
        </Link>
        {isExpensesPage && (
          <motion.div
            layoutId="footer-underline"
            className="bg-white h-1 w-full absolute rounded-sm bottom-0"
          ></motion.div>
        )}
      </div>
      <div
        className={cn(
          "hover:text-white h-full relative mx-auto sm:mx-0 flex items-center transition text-white/50",
          {
            "text-white": isBalancePage,
          }
        )}
      >
        <Link href={`/app/group/${groupId}/balance`} className="mb-2">
          Balance
        </Link>
        {isBalancePage && (
          <motion.div
            layoutId="footer-underline"
            className="bg-white h-1 w-full absolute rounded-sm bottom-2"
          ></motion.div>
        )}
      </div>
      <div
        className={cn(
          "hover:text-white h-full relative mx-auto sm:mx-0 flex items-center transition text-white/50",
          {
            "text-white": isAiChatPage,
          }
        )}
      >
        <Link href={`/app/group/${groupId}/chatbot`} className="mb-2">
          AI Chat
        </Link>
        {isAiChatPage && (
          <motion.div
            layoutId="footer-underline"
            className="bg-white h-1 w-full absolute rounded-sm bottom-2"
          ></motion.div>
        )}
      </div>
      {isExpensesPage && (
        <div className="hidden bottom-[-25px] right-0 sm:block sm:absolute">
          <AddExpenseButton />
        </div>
      )}
    </div>
  );
}
