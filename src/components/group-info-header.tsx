import Image from "next/image";
import usersIcon from "../../public/users.svg";
import H1 from "./h1";
import { useGroupContext } from "@/lib/hooks";

export default function GroupInfoHeader() {
  const { selectedGroup, selectedGroupMemberList } = useGroupContext();
  return (
    <>
      <Image
        src={usersIcon}
        alt={"Groups"}
        className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 opacity-80 bg-black/20 rounded-full"
      />
      <div className="flex flex-col gap-2 w-[70%]">
        <H1 className="text-2xl sm:text-3xl truncate items-center text-white">
          {selectedGroup?.groupName}
        </H1>
        <div className="text-white/60 w-full line-clamp-2">
          {selectedGroup?.groupDescription}
        </div>
        <div className="text-white">
          {selectedGroupMemberList?.length} Members
        </div>
      </div>
    </>
  );
}
