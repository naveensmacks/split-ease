"use server";

import prisma from "@/lib/db";
import { getUserByEmail, isMemberOfGroup } from "@/lib/server-utils";
import {
  expenseSchema,
  groupFormSchema,
  memberFormSchema,
  settleUpFormSchema,
  TExpenseForm,
} from "@/lib/validation";
import { ExpenseType } from "@prisma/client";

//---DB actions
async function updateExpense(
  expenseId: string,
  updatedById: string,
  paidById: string,
  data: {
    amount: number;
    expenseType: ExpenseType;
    expenseDate: Date;
    expenseDescription: string;
    isSplitEqually: boolean;
  },
  shares: { paidToId: string; amount: number; share: number }[]
) {
  // Step 1: Delete existing shares for the expense
  await prisma.share.deleteMany({
    where: { expenseId: expenseId },
  });
  // Step 2: Update the expense and create new shares
  try {
    const expenseWithRelations = await prisma.expense.update({
      where: { expenseId: expenseId },
      data: {
        ...data,
        paidByUser: { connect: { userId: paidById } },
        updatedByUser: { connect: { userId: updatedById } },
        shares: { create: shares },
      },
      include: {
        group: true,
        addedByUser: true,
        updatedByUser: true,
        paidByUser: true,
        shares: {
          include: {
            paidToUser: true,
          },
        },
      },
    });
    return { isSuccess: true, data: expenseWithRelations };
  } catch (error) {
    return {
      isSuccess: false,
      message: "Could not edit expense/payment. Try again later.",
    };
  }
}

async function createNewExpense(
  groupId: string,
  userId: string,
  paidById: string,
  data: {
    amount: number;
    expenseType: ExpenseType;
    expenseDate: Date;
    expenseDescription: string;
    isSplitEqually: boolean;
  },
  shares: { paidToId: string; amount: number; share: number }[]
) {
  try {
    const expenseWithRelations = await prisma.expense.create({
      data: {
        ...data,
        group: { connect: { groupId: groupId } },
        paidByUser: { connect: { userId: paidById } },
        addedByUser: { connect: { userId: userId } },
        updatedByUser: { connect: { userId: userId } },
        shares: { create: shares },
      },
      include: {
        group: true,
        addedByUser: true,
        paidByUser: true,
        updatedByUser: true,
        shares: {
          include: {
            paidToUser: true,
          },
        },
      },
    });
    return { isSuccess: true, data: expenseWithRelations };
  } catch (error) {
    console.log("error: ", error);
    return {
      isSuccess: false,
      message: "Could not create expense/payment. Try again later.",
    };
  }
}

//--- Expense actions ---
export async function editPayment(
  expenseId: string,
  userId: string,
  updatedPayment: unknown
) {
  const validatedPayment = settleUpFormSchema.safeParse(updatedPayment);
  if (!validatedPayment.success) {
    return {
      isSuccess: false,
      fieldErrors: validatedPayment.error.flatten().fieldErrors,
    };
  }

  const shares = [
    {
      paidToId: validatedPayment.data.recepientId,
      amount: validatedPayment.data.amount,
      share: 0.0,
    },
  ];

  const updatedData = {
    amount: validatedPayment.data.amount,
    expenseType: ExpenseType.PAYMENT,
    expenseDate: validatedPayment.data.settleUpDate,
    expenseDescription: validatedPayment.data.settleUpDescription
      ? validatedPayment.data.settleUpDescription
      : "SettleUp Payment",
    isSplitEqually: false,
  };

  //database mutation
  return updateExpense(
    expenseId,
    userId,
    validatedPayment.data.payerId,
    updatedData,
    shares
  );
}

export async function addPayment(
  newPayment: unknown,
  userId: string,
  groupId: string
) {
  const validatedPayment = settleUpFormSchema.safeParse(newPayment);
  if (!validatedPayment.success) {
    return {
      isSuccess: false,
      fieldErrors: validatedPayment.error.flatten().fieldErrors,
    };
  }

  //form or create an expense data from validatedPayment
  let expenseData: TExpenseForm = {
    expenseType: ExpenseType.PAYMENT,
    amount: validatedPayment.data.amount,
    expenseDescription: validatedPayment.data.settleUpDescription
      ? validatedPayment.data.settleUpDescription
      : "SettleUp Payment",
    expenseDate: validatedPayment.data.settleUpDate,
    paidById: validatedPayment.data.payerId,
    isSplitEqually: false,
    shares: [
      {
        paidToId: validatedPayment.data.recepientId,
        amount: validatedPayment.data.amount,
        share: 0.0,
      },
    ],
  };

  const { shares, paidById, ...data } = expenseData;
  //Db create
  return createNewExpense(groupId, userId, paidById, data, shares);
}
export async function addExpense(
  expense: unknown,
  userId: string,
  groupId: string
) {
  const validatedExpense = expenseSchema.safeParse(expense);
  if (!validatedExpense.success) {
    return {
      isSuccess: false,
      fieldErrors: validatedExpense.error.flatten().fieldErrors,
    };
  }
  //remove  validatedGroup.data.currencyType from validatedGroup.data
  const { shares, paidById, ...data } = validatedExpense.data;

  //Db create
  return createNewExpense(groupId, userId, paidById, data, shares);
}
export async function editExpense(
  expense: unknown,
  userId: string,
  expenseId: string
) {
  const validatedExpense = expenseSchema.safeParse(expense);
  if (!validatedExpense.success) {
    return {
      isSuccess: false,
      fieldErrors: validatedExpense.error.flatten().fieldErrors,
    };
  }

  //remove  validatedGroup.data.currencyType from validatedGroup.data
  const { shares, paidById, ...data } = validatedExpense.data;

  //database mutation
  return updateExpense(expenseId, userId, paidById, data, shares);
}

// --- group actions ---
export async function addgroup(group: unknown, userId: string) {
  const validatedGroup = groupFormSchema.safeParse(group);
  if (!validatedGroup.success) {
    return {
      isSuccess: false,
      fieldErrors: validatedGroup.error.flatten().fieldErrors,
    };
  }

  //remove  validatedGroup.data.currencyType from validatedGroup.data
  const { currencyType, ...data } = validatedGroup.data;

  // create group
  try {
    const group = await prisma.group.create({
      data: {
        ...data,
        users: { connect: [{ userId: userId }] },
        createdBy: { connect: { userId: userId } },
        currency: { connect: { code: currencyType } },
      },
      include: {
        users: true,
        expenses: {
          include: {
            paidByUser: true,
            addedByUser: true,
            updatedByUser: true,
            shares: {
              include: {
                paidToUser: true,
              },
            },
          },
        },
      },
    });
    return { isSuccess: true, data: group };
  } catch (error) {
    console.log("error: ", error);
    return {
      isSuccess: false,
      message: "Could not create group. Try again later.",
    };
  }
}

export async function editGroup(
  group: unknown,
  groupId: string,
  userId: string
) {
  const validatedGroup = groupFormSchema.safeParse(group);
  if (!validatedGroup.success) {
    return {
      isSuccess: false,
      fieldErrors: validatedGroup.error.flatten().fieldErrors,
    };
  }

  //remove  validatedGroup.data.currencyType from validatedGroup.data
  const { currencyType, ...data } = validatedGroup.data;
  try {
    const group = await prisma.group.update({
      where: { groupId: groupId },
      data: {
        ...data,
        users: { connect: [{ userId: userId }] },
        currency: { connect: { code: currencyType } },
      },
      include: {
        users: true,
        expenses: {
          include: {
            paidByUser: true,
            addedByUser: true,
            updatedByUser: true,
            shares: {
              include: {
                paidToUser: true,
              },
            },
          },
        },
      },
    });
    return { isSuccess: true, data: group };
  } catch (error) {
    console.log("error: ", error);
    return {
      isSuccess: false,
      message: "Could not update group. Try again later.",
    };
  }
}

export async function addMemberToGroup(member: unknown, groupId: string) {
  const validatedMember = memberFormSchema.safeParse(member);
  if (!validatedMember.success) {
    return {
      isSuccess: false,
      fieldErrors: validatedMember.error.flatten().fieldErrors,
    };
  }
  const newMember = validatedMember.data;

  if (newMember.isRegistered && newMember.email) {
    //check if user is a registered user
    const member = await getUserByEmail(newMember.email);
    if (!member) {
      return {
        isSuccess: false,
        fieldErrors: { email: ["This email is not registered"] },
      };
    }
    //check if user is already a member of the same group
    if (await isMemberOfGroup(newMember.email, groupId)) {
      return {
        isSuccess: false,
        fieldErrors: { email: ["Already a member of this group"] },
      };
    }
    try {
      const group = await prisma.group.update({
        where: { groupId: groupId },
        data: {
          users: { connect: { userId: member.userId } },
        },
        include: {
          users: true,
          expenses: {
            include: {
              paidByUser: true,
              addedByUser: true,
              updatedByUser: true,
              shares: {
                include: {
                  paidToUser: true,
                },
              },
            },
          },
        },
      });
      return {
        isSuccess: true,
        data: group,
      };
    } catch (error) {
      console.log("error: ", error);
      return {
        isSuccess: false,
        message: "Could not add member.",
      };
    }
  } else {
    //create new member(guest) for non-registered users
    newMember.isRegistered = false; //since we havenot added that check in elseif, we are setting it here(to be robust)
    try {
      // const member = await prisma.user.create({
      //   data: {
      //     ...newMember,
      //   },
      // });
      const memList = [{ ...newMember }];
      const group = await prisma.group.update({
        where: { groupId: groupId },
        data: {
          users: { create: memList },
        },
        include: {
          users: true,
          expenses: {
            include: {
              paidByUser: true,
              addedByUser: true,
              updatedByUser: true,
              shares: {
                include: {
                  paidToUser: true,
                },
              },
            },
          },
        },
      });
      return {
        isSuccess: true,
        data: group,
      };
    } catch (error) {
      console.log("error: ", error);
      return {
        isSuccess: false,
        message: "Could not add member.",
      };
    }
  }
}
