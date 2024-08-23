"use client";
import { addgroup } from "@/actions/actions";
import { GroupEssential, GroupWithRelations } from "@/lib/types";
import { sleep } from "@/lib/utils";
import { TGroupForm } from "@/lib/validation";
import React, { createContext, useState } from "react";
import { toast } from "sonner";

export const GroupContext = createContext<GroupContextType | null>(null);

type GroupContextType = {
  group: GroupWithRelations[] | null;
  handleAddGroup: (newGroup: TGroupForm) => void;
};

type GroupContextProviderProps = {
  data: GroupWithRelations[];
  userId: string;
  children: React.ReactNode;
};

export default function GroupContextProvider({
  data,
  userId,
  children,
}: GroupContextProviderProps) {
  const [group, setGroup] = useState<GroupWithRelations[] | null>(data);

  const handleAddGroup = async (newGroup: GroupEssential) => {
    await sleep(8000);
    console.log("newGroup: ", newGroup, "userId: ", userId);
    const actionData = await addgroup(newGroup, userId);

    console.log("actionData: ", actionData);

    if (actionData.message) {
      toast.warning(actionData.message);
      return;
    } else if (actionData.group) {
      toast.success("Group created successfully");
      setGroup((prev) =>
        prev ? [...prev, actionData.group] : [actionData.group]
      );
    }
  };

  return (
    <GroupContext.Provider value={{ group, handleAddGroup }}>
      {children}
    </GroupContext.Provider>
  );
}
