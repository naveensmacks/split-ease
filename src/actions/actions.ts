"use server";

import prisma from "@/lib/db";
import {
  getGroupsByUserId,
  getUserByEmail,
  getUserById,
  getVerificationTokenByEmail,
  getVerificationTokenByToken,
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
  resetPasswordSchema,
  changeEmailSchema,
} from "@/lib/validation";
import { ExpenseType, Prisma, TokenPurpose } from "@prisma/client";
import { signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect";
import bcrypt from "bcryptjs";
import { OptimizedTransaction } from "@/lib/types";
import {
  generateVerificationToken,
  generateVerificationTokenForEmailChange,
  verifyToken,
  verifyTokenForEmailChange,
} from "@/lib/token";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendVerificationEmailForEmailChange,
} from "@/lib/email-utils";
import { redirect } from "next/dist/server/api-utils";

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
        fieldErrors: { email: ["An account with this email already exists."] },
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
      isSuccess: false,
      message: "Invalid form Data..",
    };
  }

  //convert formData to a plain Object
  const formDataObject = Object.fromEntries(formData.entries());

  //validation
  const validatedFormDataObject = signUpSchema.safeParse(formDataObject);
  if (!validatedFormDataObject.success) {
    return {
      isSuccess: false,
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
        const emailExists = await getUserByEmail(email);
        if (emailExists) {
          if (emailExists.emailVerified) {
            return {
              isSuccess: false,
              message: "An account with this email already exists.",
            };
          } else {
            // Check if a token already exists for the user
            const existingToken = await getVerificationTokenByEmail(
              email,
              TokenPurpose.REGISTRATION
            );

            if (existingToken) {
              return {
                isSuccess: false,
                message:
                  "Awaiting your email verification. Please check your inbox.",
              };
            }
          }
        }
      }
    }
  }
  const emailExists = await getUserByEmail(email);
  if (emailExists) {
    // Generate a verification token
    const verificationToken = await generateVerificationToken(
      email,
      TokenPurpose.REGISTRATION
    );

    // Send verification email
    await sendVerificationEmail(emailExists, verificationToken.token);

    //we can send formData Directly instead of converting to json object, next-auth supports this
    //means next auth wil convert it to object automatically
    //await signIn("credentials", formData);
    return {
      isSuccess: true,
      message: "Verification email is sent to your inbox, please verify.",
    };
  }
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
      console.log("error type: ", error.type);
      switch (error.type) {
        case "CredentialsSignin":
          return {
            message: "Invalid credentials.",
          };
        default:
          const email = formData.get("email") as string;
          const user = await getUserByEmail(email);
          if (user && !user.emailVerified) {
            const existingToken = await getVerificationTokenByEmail(
              email,
              TokenPurpose.REGISTRATION
            );
            if (existingToken) {
              const hasExpired = new Date(existingToken.expires) < new Date();

              if (hasExpired) {
                // Generate a new verification token
                const newToken = await generateVerificationToken(
                  email,
                  TokenPurpose.REGISTRATION
                );
                // Send verification email
                await sendVerificationEmail(user, newToken.token);
                return {
                  message:
                    "Your token has expired. We’ve sent a new verification email. Check your inbox.",
                };
              } else {
                return {
                  message:
                    "Awaiting your email verification. Please check your inbox.",
                };
              }
            } else {
              // This happens on db corruption
              // Generate a verification token
              const newToken = await generateVerificationToken(
                email,
                TokenPurpose.REGISTRATION
              );

              // Send verification email
              await sendVerificationEmail(user, newToken.token);
              return {
                message:
                  "We’ve sent you a new verification email. Check your inbox",
              };
            }
          }
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

export async function logOut(redirectUrl?: string) {
  await signOut(redirectUrl ? { redirectTo: redirectUrl } : undefined);
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
        fieldErrors: {
          email: ["This email is not associated with any account"],
        },
      };
    }
    //check if user is already a member of the same group
    if (await isMemberOfGroup(newMember.email, groupId)) {
      return {
        isSuccess: false,
        fieldErrors: {
          email: ["This email is already a member of the group"],
        },
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

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(
    token,
    TokenPurpose.REGISTRATION
  );
  console.log("existingToken: ", existingToken);
  const tokenVerification = await verifyToken(token);
  console.log("tokenVerification: ", tokenVerification);

  if (!existingToken) {
    console.log("if block ");
    if (tokenVerification.isJwtVerified || tokenVerification.isExpired) {
      const email = tokenVerification.email!;
      const existingUser = await getUserByEmail(email);
      console.log("existingUser: ", existingUser);
      if (!existingUser) {
        return { error: "User not found. Try signing up again." };
      } else if (existingUser.emailVerified) {
        return { success: "Email already verified, please proceed with login" };
      } else {
        // this part will hit on tokenVerification.isExpired or DB corruption(tokenVerification.isJwtVerified)

        //check if that mail has an exising token valid token, if yes then donot send new email, ask to use the existing one
        const tokenForEmail = await getVerificationTokenByEmail(
          email,
          TokenPurpose.REGISTRATION
        );
        if (tokenForEmail) {
          const hasExpired = new Date(tokenForEmail.expires) < new Date();

          if (!hasExpired) {
            return {
              error:
                "Please use the latest email sent to you to verify your account.",
            };
          }
        }

        // Generate a verification token
        const verificationToken = await generateVerificationToken(
          email,
          TokenPurpose.REGISTRATION
        );

        // Send verification email
        await sendVerificationEmail(existingUser, verificationToken.token);
        return {
          error: tokenVerification.isExpired
            ? tokenVerification.message
            : "Error verifying the token, new verification link has been sent to your email",
        };
      }
    } else {
      return { error: tokenVerification.message };
    }
  } else {
    console.log("else block ");
    const hasExpired = new Date(existingToken.expires) < new Date();

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
      return { error: "User not found. Try signing up again." };
    }

    if (hasExpired) {
      const email = tokenVerification.email!;
      // Generate a verification token
      const verificationToken = await generateVerificationToken(
        email,
        TokenPurpose.REGISTRATION
      );

      // Send verification email
      await sendVerificationEmail(existingUser, verificationToken.token);

      return {
        success:
          "Your verification link has expired. We’ve sent a new one to your email.",
      };
    }

    await prisma.user.update({
      where: {
        userId: existingUser.userId,
      },
      data: {
        emailVerified: new Date(),
        email: existingToken.email,
      },
    });

    await prisma.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });

    return { success: "Email verified" };
  }
};

export async function forgotPassword(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const user = await getUserByEmail(email);
  if (!user) {
    return {
      isSuccess: false,
      message: "Email not registered. Please enter a registered email ID.",
    };
  } else {
    const existingToken = await getVerificationTokenByEmail(
      email,
      TokenPurpose.PASSWORD_RESET
    );
    if (existingToken) {
      const hasExpired = new Date(existingToken.expires) < new Date();
      if (!hasExpired) {
        return {
          isSuccess: false,
          message:
            "Please use the latest email we sent to reset your password.",
        };
      }
    }
  }
  //if (!user.emailVerified) no need to check email verification here
  //as lets consider  reseting password through link as an email verfication

  //we are doing jwt verification so any random generation token is enough
  //as we are doing only db record check(if token exist for email)
  //but jwt token just to avoid installing a library for installing a library to generate random token
  const resetToken = await generateVerificationToken(
    email,
    TokenPurpose.PASSWORD_RESET
  );
  await sendPasswordResetEmail(user, resetToken.token);
  return {
    isSuccess: true,
    message: "A reset password link has been sent to your email.",
  };
}

export async function resetPassword(
  resetPasswordToken: string,
  formDataObject: unknown
) {
  const validatedformDataObject = resetPasswordSchema.safeParse(formDataObject);
  if (!validatedformDataObject.success) {
    return {
      isSuccess: false,
      fieldErrors: validatedformDataObject.error.flatten().fieldErrors,
    };
  }

  const formData = validatedformDataObject.data;

  const resetToken = await getVerificationTokenByToken(
    resetPasswordToken,
    TokenPurpose.PASSWORD_RESET
  );
  if (!resetToken) {
    return {
      isSuccess: false,
      message:
        "Invalid reset password link. Please request forgot password again",
    };
  }
  const hasExpired = new Date(resetToken.expires) < new Date();
  if (hasExpired) {
    return {
      isSuccess: false,
      message:
        "Reset password link has expired. Please request forgot password again",
    };
  }
  const user = await getUserByEmail(resetToken.email);
  if (!user) {
    return {
      isSuccess: false,
      message: "User not found, contact support team",
    };
  }

  await prisma.user.update({
    where: {
      userId: user.userId,
    },
    data: {
      hashedPassword: await bcrypt.hash(formData.newPassword as string, 10),
    },
  });
  await prisma.verificationToken.delete({
    where: {
      id: resetToken.id,
    },
  });
  return {
    isSuccess: true,
    message:
      "Password reset successful. You can now log in with your new password.",
  };
}

export async function changeEmailId(userId: string, userDetails: unknown) {
  //validation
  const validatedEmailChangeData = changeEmailSchema.safeParse(userDetails);
  if (!validatedEmailChangeData.success) {
    return {
      isSuccess: false,
      fieldErrors: validatedEmailChangeData.error.flatten().fieldErrors,
    };
  }
  const { email, password } = validatedEmailChangeData.data;

  //getUserById
  const user = await getUserById(userId);
  if (!user || !user.hashedPassword) {
    return {
      isSuccess: false,
      message: "User not found",
    };
  }

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
        fieldErrors: { email: ["An account with this email already exists."] },
      };
    }
  } else {
    return {
      isSuccess: false,
      fieldErrors: { email: ["Email cannot be same as current email"] },
    };
  }

  if (user.email) {
    // Generate a verification token
    const verificationToken = await generateVerificationTokenForEmailChange(
      user.email,
      email,
      TokenPurpose.EMAIL_CHANGE
    );

    if (!verificationToken.isSuccess) {
      return verificationToken;
    } else {
      // Send verification email
      await sendVerificationEmailForEmailChange(
        user,
        email,
        verificationToken.token
      );
      return {
        isSuccess: true,
        message: `A verification link has been sent to ${email}. Please verify it to update your email.`,
      };
    }
  }
  const groups = await getGroupsByUserId(userId);

  return {
    isSuccess: true,
    data: { groups, user },
  };
}

export async function verifyEmailChangeToken(token: string) {
  const existingToken = await getVerificationTokenByToken(
    token,
    TokenPurpose.EMAIL_CHANGE
  );
  console.log("existingToken: ", existingToken);
  const tokenVerification = await verifyTokenForEmailChange(token);
  console.log("tokenVerification: ", tokenVerification);

  if (existingToken) {
    console.log("email change token Exist in DB");
    if (tokenVerification.isExpired) {
      return {
        isSuccess: false,
        message:
          "Token has expired. Please request for a new verification link.",
      };
    }
    if (tokenVerification.isJwtVerified) {
      const email = tokenVerification.email!;
      const updatedEmail = tokenVerification.updatedEmail!;
      const existingUser = await getUserByEmail(email);
      console.log("existingUser: ", existingUser);
      if (existingUser) {
        const newEmailUser = await getUserByEmail(updatedEmail);
        if (newEmailUser) {
          return {
            isSuccess: false,
            message: `An account with email ${updatedEmail} already exists.`,
          };
        } else {
          await prisma.user.update({
            where: {
              userId: existingUser.userId,
            },
            data: {
              email: updatedEmail,
            },
          });
          await prisma.verificationToken.delete({
            where: {
              id: existingToken.id,
            },
          });
          return {
            isSuccess: true,
            message:
              "Email change successful. You can now log in with your new email.",
          };
        }
      } else {
        return {
          isSuccess: false,
          message: "User not found. Request for a new verification link.",
        };
      }
    }
  }
  console.log("email change token does not exist in DB");
  return {
    isSuccess: false,
    message: tokenVerification.message
      ? tokenVerification.message
      : "Invalid token. Request for a new verification link.",
  };
}
