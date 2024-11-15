"use client";
import Logo from "./logo";
import H1 from "./h1";
import { cn, extractInitials } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import groupIcon from "../../public/groupIcon.svg";
import Image from "next/image";
import { useUserContext } from "@/lib/hooks";

export default function AppHeader() {
  const activePathname = usePathname();
  const { user } = useUserContext();
  const initials = extractInitials(user.firstName, user.lastName);
  return (
    <div className="flex items-center sm:h-20 h-16 bg-primecolor gap-x-1 px-4 justify-between border-b border-white/10">
      <div className="flex items-center gap-x-3">
        <Logo />
        <H1 className="sm:text-3xl text-2xl text-white/80">Split Ease</H1>
      </div>

      <nav className="h-full hidden sm:flex justify-center items-center">
        <ul className="flex h-[50%] gap-x-6 text-sm">
          <li
            key={"/app/groups"}
            className={cn(
              "hover:text-white flex items-center relative transition text-white/50",
              {
                "text-white": activePathname == "/app/groups",
              }
            )}
          >
            <Link
              href={"/app/groups"}
              className="text-xl mb-2 flex justify-center items-center gap-x-1"
            >
              <Image src={groupIcon} alt={"Groups"} className="w-6 h-6" />
              Groups
            </Link>
            {activePathname === "/app/groups" && (
              <motion.div
                layoutId="header-underline"
                className="bg-white h-1 w-full absolute rounded-sm bottom-0"
              ></motion.div>
            )}
          </li>
          <li
            key={"/app/account"}
            className={cn(
              "hover:text-white flex items-center relative transition text-white/50",
              {
                "text-white": activePathname == "/app/account",
              }
            )}
          >
            <Link
              href={"/app/account"}
              className="text-xl mb-2 flex justify-center items-center gap-x-1"
            >
              <div className="flex w-7 h-7 bg-accountcolor rounded-full text-white text-sm justify-center items-center">
                {initials}
              </div>
              Account
            </Link>
            {activePathname === "/app/account" && (
              <motion.div
                layoutId="header-underline"
                className="bg-white h-1 w-full absolute rounded-sm bottom-0"
              ></motion.div>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
}
