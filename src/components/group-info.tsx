import { Pencil1Icon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import Image from "next/image";
import usersIcon from "../../public/users.svg";
import H1 from "./h1";
import { useGroupContext } from "@/lib/hooks";

type GroupInfoProps = {
  groupId: string;
};
export default function GroupInfo({ groupId }: GroupInfoProps) {
  const { getGroupFromList } = useGroupContext();
  const selectedGroup = getGroupFromList(groupId);
  return (
    <div className="flex gap-6 rounded-lg  my-2 justify-between items-start sm:w-[600px]">
      <div className="flex flex-col justify-center items-start w-4/5 gap-2">
        <div className="flex gap-2 justify-between">
          <Image
            src={usersIcon}
            alt={"Groups"}
            className="w-8 h-8 sm:w-10 sm:h-10 opacity-80"
          />
          <H1 className="text-2xl sm:text-4xl truncate items-center">
            {selectedGroup?.groupName}
          </H1>
        </div>
        <div className="text-black/60 w-full line-clamp-2">
          {selectedGroup?.groupDescription}
        </div>
      </div>
      <div className="w-fit">
        <Button className="state-effects opacity-90">
          <Pencil1Icon />
          <span className="ml-1 hidden sm:block">Edit</span>
        </Button>
      </div>
    </div>
  );
}