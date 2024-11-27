"use client";
import {
  addExpense,
  addgroup,
  addMemberToGroup,
  addPayment,
  deleteExpense,
  editAccountDetails,
  editExpense,
  editGroup,
  editPassword,
  editPayment,
  settleAllBalances,
} from "@/actions/actions";
import { useUserContext } from "@/lib/hooks";
import {
  BalanceView,
  ExpenseEssential,
  ExpenseWithRelations,
  GroupEssential,
  GroupWithRelations,
  OptimizedTransaction,
} from "@/lib/types";
import { calculateBalances, getDetailedBalance } from "@/lib/utils";
import {
  TAccountForm,
  TEditPasswordForm,
  TGroupForm,
  TMemberForm,
  TSettleUpForm,
} from "@/lib/validation";
import { Group, User } from "@prisma/client";
import { createContext, useEffect, useState } from "react";

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
  handleSettleAllBalances: (
    settleUpTransactions: OptimizedTransaction[]
  ) => void;
  handleAddPayment: (
    newPayment: TSettleUpForm
  ) => ReturnType<typeof addPayment>;
  handleEditPayment: (
    updatedPayment: TSettleUpForm
  ) => ReturnType<typeof editPayment>;
  handleAddExpense: (
    newExpense: ExpenseEssential
  ) => ReturnType<typeof addExpense>;
  handleEditExpense: (
    updatedExpense: ExpenseEssential
  ) => ReturnType<typeof editExpense>;
  handleDeleteExpense: (expenseId: string) => ReturnType<typeof deleteExpense>;
  detailedBalance: BalanceView[] | undefined;
  handleEditAccountDetails: (
    userDetails: TAccountForm
  ) => ReturnType<typeof editAccountDetails>;
  handleEditPassword: (
    editPasswordForm: TEditPasswordForm
  ) => ReturnType<typeof editPassword>;
};

type GroupContextProviderProps = {
  data: GroupWithRelations[];
  children: React.ReactNode;
};

export default function GroupContextProvider({
  data,
  children,
}: GroupContextProviderProps) {
  const [groupList, setGroupList] = useState<GroupWithRelations[]>(data);
  const { user, setUser } = useUserContext();

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(
    null
  );

  //derived state
  const selectedGroup =
    groupList?.find((group) => group.groupId === selectedGroupId) || null;

  const detailedBalance = getDetailedBalance(selectedGroup);

  const selectedGroupMemberList =
    selectedGroup && selectedGroup.users ? selectedGroup.users : [];

  const handleEditAccountDetails = async (userDetails: TAccountForm) => {
    const actionData = await editAccountDetails(user.userId, userDetails);

    if (actionData.isSuccess && actionData.data?.groups) {
      const { groups, updatedUser } = actionData.data;
      setUser(updatedUser);
      setGroupList(updateGroupBalances(groups));
    }
    return actionData;
  };

  const handleEditPassword = async (editPasswordForm: TEditPasswordForm) => {
    const actionData = await editPassword(user.userId, editPasswordForm);
    if (actionData.isSuccess && actionData.data?.groups) {
      const { groups, updatedUser } = actionData.data;
      setUser(updatedUser);
      setGroupList(updateGroupBalances(groups));
    }
    return actionData;
  };

  const handleChangeSelectedGroupId = async (
    groupId: GroupWithRelations["groupId"]
  ) => {
    setSelectedGroupId(groupId);
  };

  const handleSelectedExpenseId = (expenseId: string) => {
    setSelectedExpenseId(expenseId);
  };
  //expense form
  const updateExpenseList = (
    actionData: Awaited<ReturnType<typeof addExpense>>,
    isEdit: boolean
  ) => {
    if (actionData.isSuccess && "data" in actionData && actionData.data) {
      setGroupList((prev) =>
        prev.map((group) => {
          if (group.groupId === selectedGroupId) {
            const updatedGroup = {
              ...group,
              expenses: isEdit
                ? group.expenses.map((expense) => {
                    if (expense.expenseId === selectedExpenseId) {
                      return actionData.data;
                    }
                    return expense;
                  })
                : [...group.expenses, actionData.data],
            };
            return {
              ...updatedGroup,
              balance: calculateBalances(updatedGroup),
            };
          }
          return group;
        })
      );
    }
  };
  const handleAddExpense = async (newExpense: ExpenseEssential) => {
    const actionData = await addExpense(
      newExpense,
      user.userId,
      selectedGroupId!
    );
    updateExpenseList(actionData, false);
    return actionData;
  };

  const handleAddPayment = async (newPayment: TSettleUpForm) => {
    const actionData = await addPayment(
      newPayment,
      user.userId,
      selectedGroupId!
    );
    updateExpenseList(actionData, false);
    return actionData;
  };

  const handleSettleAllBalances = async (
    settleUpTransactions: OptimizedTransaction[]
  ) => {
    const actionData = await settleAllBalances(
      settleUpTransactions,
      user.userId,
      selectedGroupId!
    );
    if (actionData.isSuccess && actionData.data) {
      for (let i = 0; i < actionData.data.length; i++) {
        const expense = actionData.data[i].data;
        if (expense) {
          setGroupList((prev) =>
            prev.map((group) => {
              if (group.groupId === selectedGroupId) {
                const updatedGroup = {
                  ...group,
                  expenses: [...group.expenses, expense],
                };
                return {
                  ...updatedGroup,
                  balance: calculateBalances(updatedGroup),
                };
              }
              return group;
            })
          );
        }
      }
    }
  };

  const handleEditPayment = async (updatedPayment: TSettleUpForm) => {
    console.log("handleEditPayment selectedExpenseId: ", selectedExpenseId);
    const actionData = await editPayment(
      selectedExpenseId!,
      user.userId,
      updatedPayment
    );
    updateExpenseList(actionData, true);
    return actionData;
  };

  const handleEditExpense = async (updatedExpense: ExpenseEssential) => {
    console.log("selectedExpenseId: ", selectedExpenseId);
    const actionData = await editExpense(
      updatedExpense,
      user.userId,
      selectedExpenseId!
    );
    updateExpenseList(actionData, true);
    return actionData;
  };

  const handleDeleteExpense = async (expenseId: string) => {
    const actionData = await deleteExpense(expenseId);
    if (actionData.isSuccess) {
      setGroupList((prev) =>
        prev.map((group) => {
          if (group.groupId === selectedGroupId) {
            const updatedGroup = {
              ...group,
              expenses: group.expenses.filter(
                (expense) => expense.expenseId !== expenseId
              ),
            };
            return {
              ...updatedGroup,
              balance: calculateBalances(updatedGroup),
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
    const actionData = await addgroup(newGroup, user.userId);

    if (actionData.isSuccess && actionData.data) {
      setGroupList((prev) =>
        prev
          ? [
              ...prev,
              {
                ...actionData.data,
                balance: calculateBalances(actionData.data),
              },
            ]
          : [actionData.data]
      );
    }
    return actionData;
  };

  const handleEditGroup = async (
    updatedGroup: GroupEssential,
    groupId: Group["groupId"]
  ) => {
    const actionData = await editGroup(updatedGroup, groupId, user.userId);

    if (actionData.isSuccess && actionData.data) {
      setGroupList((prev) =>
        prev
          ? prev.map((group) => {
              if (group.groupId === groupId) {
                return { ...group, ...actionData.data };
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
            {
              ...prev.find((group) => group.groupId === groupId),
              ...editedGroup,
            },
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

  //set Balances
  const updateGroupBalances = (groupList: GroupWithRelations[]) => {
    return groupList.map((group) => ({
      ...group,
      balance: calculateBalances(group),
    }));
  };
  useEffect(() => {
    setGroupList((prev) => updateGroupBalances(prev));
  }, []);

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
        handleSettleAllBalances,
        handleAddPayment,
        handleEditPayment,
        handleAddExpense,
        handleEditExpense,
        handleDeleteExpense,
        detailedBalance,
        handleEditAccountDetails,
        handleEditPassword,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
}
