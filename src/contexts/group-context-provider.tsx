"use client";
import { addgroup } from "@/actions/actions";
import { GroupEssential, GroupWithRelations } from "@/lib/types";
import { sleep } from "@/lib/utils";
import { TGroupForm } from "@/lib/validation";
import React, { createContext, useState } from "react";

export const GroupContext = createContext<GroupContextType | null>(null);

type GroupContextType = {
  groupList: GroupWithRelations[] | null;
  handleEditGroupList: (
    editedGroup: GroupWithRelations,
    groupId: string
  ) => void;
  getGroupFromList: (groupId: string) => GroupWithRelations | null;
  // selectedGroup: GroupWithRelations | null;
  // selectedGroupId: string | null;
  // handleChangeSelectedGroupId: (groupId: string) => void;
  handleAddGroup: (newGroup: TGroupForm) => ReturnType<typeof addgroup>;
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
  const [groupList, setGroupList] = useState<GroupWithRelations[]>(data);
  //const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  //derived state
  // const selectedGroup =
  //   groupList?.find((group) => group.groupId === selectedGroupId) || null;

  // const handleChangeSelectedGroupId = async (
  //   groupId: GroupWithRelations["groupId"]
  // ) => {
  //   setSelectedGroupId(groupId);
  // };

  const handleAddGroup = async (newGroup: GroupEssential) => {
    //await sleep(1000);
    console.log("newGroup: ", newGroup, "userId: ", userId);
    const actionData = await addgroup(newGroup, userId);

    console.log("actionData: ", actionData);

    if (actionData.isSuccess && actionData.data) {
      setGroupList((prev) =>
        prev ? [...prev, actionData.data] : [actionData.data]
      );
    }
    return actionData;
  };

  const getGroupFromList = (groupId: string) => {
    return groupList?.find((group) => group.groupId === groupId) || null;
  };

  const handleEditGroupList = (
    editedGroup: GroupWithRelations,
    groupId: GroupWithRelations["groupId"]
  ) => {
    setGroupList((prev) => {
      return prev
        ? [
            //remove the group with group ID from the list
            ...prev.filter((group) => group.groupId !== groupId),
            editedGroup,
          ]
        : [editedGroup];
    });
  };

  return (
    <GroupContext.Provider
      value={{
        groupList,
        handleEditGroupList,
        getGroupFromList,
        handleAddGroup,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
}
