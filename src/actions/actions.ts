"use server";

import prisma from "@/lib/db";
import {
  getGroupsByUserId,
  getUserByEmail,
  getUserById,
  isMemberOfGroup,
} from "@/lib/server-utils";
import {
  signUpSchema,
  expenseSchema,
  groupFormSchema,
  memberFormSchema,
  settleUpFormSchema,
  TExpenseForm,
  editAccountSchema,
  editPasswordSchema,
} from "@/lib/validation";
import { ExpenseType, Prisma } from "@prisma/client";
import { signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect";
import bcrypt from "bcryptjs";
import { OptimizedTransaction } from "@/lib/types";

// --- account actions ---
export async function editPassword(userId: string, formData: unknown) {
  //validation
  const validatedFormDetails = editPasswordSchema.safeParse(formData);
  if (!validatedFormDetails.success) {
    return {
      isSuccess: false,
      fieldErrors: validatedFormDetails.error.flatten().fieldErrors,
    };
  }
  const formDataObject = validatedFormDetails.data;
  const user = await getUserById(userId);
  if (!user || !user.hashedPassword) {
    return {
      isSuccess: false,
      message: "User not found",
    };
  }
  const passwordsMatch = await bcrypt.compare(
    formDataObject.currentPassword as string,
    user.hashedPassword
  );
  if (!passwordsMatch) {
    return {
      isSuccess: false,
      fieldErrors: { currentPassword: ["Invalid password"] },
    };
  }
  if (formDataObject.currentPassword === formDataObject.newPassword) {
    return {
      isSuccess: false,
      fieldErrors: {
        confirmNewPassword: [
          "New password must be different from current password",
        ],
      },
    };
  }

  if (formDataObject.newPassword !== formDataObject.confirmNewPassword) {
    return {
      isSuccess: false,
      fieldErrors: { confirmNewPassword: ["Passwords do not match"] },
    };
  }
  const newPassword = formDataObject.newPassword as string;
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  //update password
  try {
    const updatedUser = await prisma.user.update({
      where: {
        userId: userId,
      },
      data: {
        hashedPassword: hashedNewPassword,
      },
    });
    const groups = await getGroupsByUserId(userId);

    return {
      isSuccess: true,
      data: { groups, updatedUser },
    };
  } catch (error) {
    return {
      isSuccess: false,
      message: "Error updating password",
    };
  }
}

export async function editAccountDetails(userId: string, userDetails: unknown) {
  //validation
  const validatedAccountDetails = editAccountSchema.safeParse(userDetails);
  if (!validatedAccountDetails.success) {
    return {
      isSuccess: false,
      fieldErrors: validatedAccountDetails.error.flatten().fieldErrors,
    };
  }
  const { firstName, lastName, email, password } = validatedAccountDetails.data;

  //getUserById
  const user = await getUserById(userId);
  if (!user || !user.hashedPassword) {
    return {
      isSuccess: false,
      message: "User not found",
    };
  }

  console.log("user: ", user);

  //check password
  const passwordsMatch = await bcrypt.compare(
    password as string,
    user.hashedPassword
  );
  if (!passwordsMatch) {
    return {
      isSuccess: false,
      fieldErrors: { password: ["Invalid password"] },
    };
  }

  //check if email already exists
  if (email.toLowerCase() !== user.email?.toLowerCase()) {
    const emailExists = await getUserByEmail(email);
    if (emailExists) {
      return {
        isSuccess: false,
        fieldErrors: { email: ["Email already registered"] },
      };
    }
  }

  //update user
  try {
    const updatedUser = await prisma.user.update({
      where: {
        userId,
      },
      data: {
        firstName,
        lastName,
        email: email.toLowerCase(),
      },
    });
    const groups = await getGroupsByUserId(userId);

    return {
      isSuccess: true,
      data: { groups, updatedUser },
    };
  } catch (error) {
    return {
      isSuccess: false,
      message: "Error updating user",
    };
  }
}

// --- user actions ---
//this action is called by useFormState, hence need to have an extra first argument which denotes the previous state
export async function signup(prevState: unknown, formData: unknown) {
  //check if FormData is an FormData type
  console.log("formData: ", formData);
  if (!(formData instanceof FormData)) {
    return {
      message: "Invalid form Data..",
    };
  }

  //convert formData to a plain Object
  const formDataObject = Object.fromEntries(formData.entries());

  //validation
  const validatedFormDataObject = signUpSchema.safeParse(formDataObject);
  if (!validatedFormDataObject.success) {
    return {
      message: "Invalid form Data.",
    };
  }

  const { firstName, lastName, email, password } = validatedFormDataObject.data;
  //hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await prisma.user.create({
      data: {
        firstName,
        lastName,
        email: email.toLowerCase(),
        hashedPassword,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          message: "Email already exists.",
        };
      }
    }
  }
  //we can send formData Directly instead of converting to json object, next-auth supports this
  //means next auth wil convert it to object automatically
  await signIn("credentials", formData);
}

export async function login(prevState: unknown, formData: unknown) {
  //check if FormData is an instance of FormData type
  if (!(formData instanceof FormData)) {
    return {
      message: "Invalid form Data.",
    };
  }

  try {
    //after signin redirect to the callback url
    await signIn("credentials", formData);
    //no code after this line executes as redirects happens at the SignIn function itself
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            message: "Invalid credentials.",
          };
        default:
          return {
            message: "Could not log In.",
          };
      }
    }

    // NExtJs redirects are thrown as errors, so they will be caught here.
    // Rethrowing to allow the redirect to proceed, otherwise, manual path revalidation is required in here.
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      message: "Could not log In...",
    };
  }
}

export async function logOut() {
  await signOut({ redirectTo: "/" });
}

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

export async function settleAllBalances(
  settleUpTransactions: OptimizedTransaction[],
  userId: string,
  groupId: string
) {
  let expenses = [];
  //iterate over settleUpTransactions and create new expenses
  for (let i = 0; i < settleUpTransactions.length; i++) {
    const transaction = settleUpTransactions[i];
    const expenseData: TExpenseForm = {
      expenseType: ExpenseType.PAYMENT,
      amount: transaction.amount,
      expenseDescription: "SettleUp Payment",
      expenseDate: new Date(),
      paidById: transaction.ower.userId,
      isSplitEqually: false,
      shares: [
        {
          paidToId: transaction.owed.userId,
          amount: transaction.amount,
          share: 0.0,
        },
      ],
    };
    const { shares, paidById, ...data } = expenseData;
    //Db create
    expenses.push(
      await createNewExpense(groupId, userId, paidById, data, shares)
    );
  }

  return { isSuccess: true, data: expenses };
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

export async function deleteExpense(expenseId: string) {
  //database mutation
  try {
    //delete the shares and expense
    await prisma.share.deleteMany({
      where: { expenseId: expenseId },
    });
    await prisma.expense.delete({
      where: { expenseId: expenseId },
    });

    return { isSuccess: true };
  } catch (error) {
    console.log(error);
    return {
      isSuccess: false,
    };
  }
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
