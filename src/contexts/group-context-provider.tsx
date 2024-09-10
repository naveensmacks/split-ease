"use client";
import {
  addExpense,
  addgroup,
  addMemberToGroup,
  editGroup,
} from "@/actions/actions";
import {
  ExpenseEssential,
  ExpenseWithRelations,
  GroupEssential,
  GroupWithRelations,
} from "@/lib/types";
import { TGroupForm, TMemberForm } from "@/lib/validation";
import { Group, User } from "@prisma/client";
import { createContext, useState } from "react";

export const GroupContext = createContext<GroupContextType | null>(null);

type GroupContextType = {
  groupList: GroupWithRelations[] | null;
  getGroupFromList: (groupId: string) => GroupWithRelations | null;
  selectedGroup: GroupWithRelations | null;
  selectedGroupId: string | null;
  handleChangeSelectedGroupId: (groupId: string) => void;
  handleAddGroup: (newGroup: TGroupForm) => ReturnType<typeof addgroup>;
  handleEditGroup: (
    editedGroup: TGroupForm,
    groupId: string
  ) => ReturnType<typeof editGroup>;
  selectedGroupMemberList: User[];
  handleAddMember: (
    newMember: TMemberForm,
    groupId: string
  ) => ReturnType<typeof addMemberToGroup>;
  selectedExpenseId: string | null;
  handleSelectedExpenseId: (expenseId: string) => void;
  getExpenseFromList: (expenseId: string) => ExpenseWithRelations | null;
  handleAddExpense: (
    newExpense: ExpenseEssential
  ) => ReturnType<typeof addExpense>;
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
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(
    null
  );

  //derived state
  const selectedGroup =
    groupList?.find((group) => group.groupId === selectedGroupId) || null;

  const selectedGroupMemberList =
    selectedGroup && selectedGroup.users ? selectedGroup.users : [];

  const handleChangeSelectedGroupId = async (
    groupId: GroupWithRelations["groupId"]
  ) => {
    setSelectedGroupId(groupId);
  };

  const handleSelectedExpenseId = (expenseId: string) => {
    if (!selectedGroupId) {
      setSelectedExpenseId(expenseId);
    }
  };
  //expense form
  const handleAddExpense = async (newExpense: ExpenseEssential) => {
    const actionData = await addExpense(newExpense, userId, selectedGroupId!);
    if (actionData.isSuccess && actionData.data) {
      setGroupList((prev) =>
        prev.map((group) => {
          if (group.groupId === selectedGroupId) {
            return {
              ...group,
              expenses: [...group.expenses, actionData.data],
            };
          }
          return group;
        })
      );
    }
    return actionData;
  };

  //Group Form
  const handleAddGroup = async (newGroup: GroupEssential) => {
    const actionData = await addgroup(newGroup, userId);

    if (actionData.isSuccess && actionData.data) {
      setGroupList((prev) =>
        prev ? [...prev, actionData.data] : [actionData.data]
      );
    }
    return actionData;
  };

  const handleEditGroup = async (
    updatedGroup: GroupEssential,
    groupId: Group["groupId"]
  ) => {
    const actionData = await editGroup(updatedGroup, groupId, userId);

    if (actionData.isSuccess && actionData.data) {
      setGroupList((prev) =>
        prev
          ? prev.map((group) => {
              if (group.groupId === groupId) {
                return actionData.data;
              }
              return group;
            })
          : [actionData.data]
      );
    }
    return actionData;
  };

  const getGroupFromList = (groupId: string) => {
    return groupList?.find((group) => group.groupId === groupId) || null;
  };

  const getExpenseFromList = (expenseId: string) => {
    return (
      selectedGroup?.expenses?.find(
        (expense) => expense.expenseId === expenseId
      ) || null
    );
  };

  const handleEditGroupList = (
    editedGroup: GroupWithRelations,
    groupId: GroupWithRelations["groupId"]
  ) => {
    setGroupList((prev) => {
      return prev
        ? [
            editedGroup,
            //remove the group with group ID from the list
            ...prev.filter((group) => group.groupId !== groupId),
          ]
        : [editedGroup];
    });
  };

  //Member Form
  const handleAddMember = async (newMember: TMemberForm, groupId: string) => {
    const actionData = await addMemberToGroup(newMember, groupId);

    if (actionData && actionData.isSuccess && actionData.data) {
      //setMemberList(actionData.data.users);
      handleEditGroupList(actionData.data, groupId);
    }
    return actionData;
  };

  return (
    <GroupContext.Provider
      value={{
        groupList,
        getGroupFromList,
        handleAddGroup,
        handleEditGroup,
        selectedGroup,
        selectedGroupId,
        handleChangeSelectedGroupId,
        selectedGroupMemberList,
        handleAddMember,
        selectedExpenseId,
        handleSelectedExpenseId,
        getExpenseFromList,
        handleAddExpense,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
}
