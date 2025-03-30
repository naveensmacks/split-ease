"use client";
import { cn, extractInitials } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import groupIcon from "../../public/groupIcon.svg";
import Image from "next/image";
import { useUserContext } from "@/lib/hooks";

export default function AppFooter() {
  const activePathname = usePathname();
  const { user } = useUserContext();
  const initials = extractInitials(user.firstName, user.lastName);
  return (
    <>
      <footer className="h-16 border-t border-black/5 p-3 hidden sm:block">
        <small className="opacity-50">
          &copy; 2025 naveenSmacks. All rights reserved.
        </small>
      </footer>

      <nav className="fixed bottom-0 w-full sm:hidden h-12 bg-white shadow-black shadow-2xl">
        <ul className="flex justify-around items-center h-full gap-x-6 text-sm">
          <li
            key={"/app/groups"}
            className={cn(
              "hover:text-primecolor flex items-center relative transition text-black/50",
              {
                "text-primecolor": activePathname == "/app/groups",
              }
            )}
          >
            <Link
              href={"/app/groups"}
              className="sm:text-2xl text-sm mb-2 flex justify-center items-center gap-x-1"
            >
              {/* className="text-xl mb-2 flex justify-center items-center gap-x-1" */}
              <Image src={groupIcon} alt={"Groups"} className="w-6 h-6" />
              Groups
            </Link>
            {activePathname === "/app/groups" && (
              <motion.div
                layoutId="footer-underline"
                className="bg-primecolor h-1 w-full absolute rounded-sm bottom-0"
              ></motion.div>
            )}
          </li>

          <li
            key={"/app/account"}
            className={cn(
              "hover:text-primecolor flex items-center relative transition text-black/50",
              {
                "text-primecolor": activePathname == "/app/account",
              }
            )}
          >
            <Link
              href={"/app/account"}
              className="sm:text-2xl text-sm mb-2 flex justify-center items-center gap-x-1"
            >
              <div className="flex w-7 h-7 bg-accountcolor rounded-full text-white text-sm justify-center items-center">
                {initials}
              </div>
              Account
            </Link>
            {activePathname === "/app/account" && (
              <motion.div
                layoutId="footer-underline"
                className="bg-primecolor h-1 w-full absolute rounded-sm bottom-0"
              ></motion.div>
            )}
          </li>
        </ul>
      </nav>
    </>
  );
}
