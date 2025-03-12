import { ExpenseType } from "@prisma/client";
import { z } from "zod";
import Decimal from "decimal.js";
import { forgotPassword } from "@/actions/actions";
export const groupFormSchema = z.object({
  groupName: z
    .string()
    .trim()
    .min(1, "Group name is required")
    .max(100, "Group name cannot exceed 100 characters"),
  groupDescription: z.union([
    z.literal(""),
    z
      .string()
      .trim()
      .max(1000, "Group description cannot exceed 1000 characters"),
  ]),
  currencyType: z
    .string({
      //when you dont give default vaue in zod resolver, use this required_error or default just "required" will be thrown
      required_error: "Please select a Currency type.",
    })
    .min(1, "Please select a Currency type."),
  splitEase: z.boolean().default(true),
});

export type TGroupForm = z.infer<typeof groupFormSchema>;

export const memberFormSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, "First name is required")
      .max(100, "First name cannot exceed 100 characters"),
    lastName: z
      .string()
      .trim()
      .max(100, "Last name cannot exceed 100 characters")
      .nullable()
      .optional(),
    email: z
      .union([
        z
          .string()
          .max(100, { message: "Email can't be longer than 100 characters" })
          .email({ message: "Please enter a valid email address" }),
        z.literal(""),
      ])
      .nullable()
      .optional(),
    isRegistered: z.boolean().default(false),
  })
  .refine(
    (data) => {
      // If isRegistered is true, email should not be null or undefined
      if (data.isRegistered) {
        return data.email ? true : false;
      }
      return true; // Otherwise, it's optional
    },
    {
      path: ["email"], // Attach this error to the email field
      message: "Email is required when the user is registered.",
    }
  )
  .transform((data) => {
    if (!data.isRegistered) {
      // If isRegistered is false, email should be null or undefined
      return { ...data, email: null };
    }
    return { ...data, email: data.email?.toLowerCase() };
  });

export type TMemberForm = z.infer<typeof memberFormSchema>;

export const expenseSchema = z
  .object({
    expenseType: z.enum(
      [
        ExpenseType.FOOD,
        ExpenseType.PETROL,
        ExpenseType.SNACKS,
        ExpenseType.DRINKS,
        ExpenseType.GROCERIES,
        ExpenseType.RENT,
        ExpenseType.UTILITIES,
        ExpenseType.MOVIE,
        ExpenseType.OTHER,
        ExpenseType.SHOPPING,
        ExpenseType.PAYMENT,
      ],
      {
        message: "Expense Type is required.",
      }
    ),
    expenseDescription: z
      .string()
      .min(1, "Expense Description is required")
      .max(100, "Expense Description can't be longer than 100 characters"),
    amount: z.preprocess(
      (val) => parseFloat(val as string),
      z
        .number({ message: "Amount is required" })
        .positive("Amount must be a positive number")
    ),
    paidById: z
      .string({
        //when you dont give default vaue in zod resolver, use this required_error or default just "required" will be thrown
        required_error: "Please select who paid.",
      })
      .min(1, "Please select who paid."),
    expenseDate: z.date({ required_error: "Date of expense is required." }),
    isSplitEqually: z.boolean().default(true),
    shares: z.array(
      z.object({
        paidToId: z.string(),
        share: z.preprocess(
          (val) => parseFloat(val as string),
          z.number().min(0, "Share must be 0 or greater")
        ),
        amount: z.preprocess(
          (val) => parseFloat(val as string),
          z.number().min(0, "Amount must be 0 or greater")
        ),
      })
    ),
  })
  .refine(
    (data) => {
      // Custom validation to check if the sum of shares equals the amount
      //use decimal to avoid rounding errors
      const totalAmount = data.shares
        .reduce(
          (prevVal, curr) =>
            new Decimal(prevVal).plus(new Decimal(curr.amount)),
          new Decimal(0)
        )
        .toDecimalPlaces(2);
      console.log("totalAmount: ", totalAmount.toNumber());
      console.log("data.amount: ", data.amount);
      return totalAmount.toNumber() === data.amount;
    },
    {
      path: ["amount"],
      message: "Amount must equal to the sum of shares",
    }
  );

export type TExpenseForm = z.infer<typeof expenseSchema>;

export const settleUpFormSchema = z
  .object({
    settleUpDate: z.date({
      required_error: "Settle up date is required.",
    }),
    settleUpDescription: z
      .string()
      .max(100, "Settle up description can't be longer than 100 characters")
      .nullable()
      .optional(),
    amount: z.preprocess(
      (val) => parseFloat(val as string),
      z
        .number({ message: "Amount is required" })
        .positive("Amount must be a positive number")
    ),
    payerId: z
      .string({
        required_error: "Please select who paid.",
      })
      .min(1, "Please select who paid."),
    recepientId: z
      .string({
        required_error: "Please select who received.",
      })
      .min(1, "Please select who received."),
  })
  .refine(
    (data) => {
      // Custom validation to check if sender and receiver are not same

      return data.payerId !== data.recepientId;
    },
    {
      path: ["payerId"],
      message: "Payer and receiver can't be same",
    }
  );

export type TSettleUpForm = z.infer<typeof settleUpFormSchema>;

export const signUpSchema = z
  .object({
    firstName: z
      .string()
      .min(1, { message: "First name is required" })
      .max(100, { message: "First name can't be longer than 100 characters" }),
    lastName: z
      .string()
      .max(100, { message: "Last name can't be longer than 100 characters" }),
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .max(100, { message: "Email can't be longer than 100 characters" })
      .email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(7, { message: "Password must be at least 7 characters long" })
      .max(100, { message: "Password can't be longer than 100 characters" })
      .refine((val) => val !== "", { message: "Password is required" }),
    confirmPassword: z.string(),
  })
  .refine(
    (data) => {
      // Custom validation to check if passwords match
      return data.password === data.confirmPassword;
    },
    {
      path: ["confirmPassword"],
      message: "Passwords don't match",
    }
  );

export type TSignUpForm = z.infer<typeof signUpSchema>;

export const logInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .refine((val) => val !== "", { message: "Password is required" }),
});

export type TLoginForm = z.infer<typeof logInSchema>;

export const editAccountSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .max(100, { message: "First name can't be longer than 100 characters" }),
  lastName: z
    .string()
    .max(100, { message: "Last name can't be longer than 100 characters" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .max(100, { message: "Email can't be longer than 100 characters" })
    .email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, "Enter password to update account details"),
});

export type TAccountForm = z.infer<typeof signUpSchema>;

export const editPasswordSchema = z
  .object({
    currentPassword: z.string(),
    newPassword: z
      .string()
      .min(7, { message: "Password must be at least 7 characters long" })
      .max(100, { message: "Password can't be longer than 100 characters" })
      .refine((val) => val !== "", { message: "Password is required" }),
    confirmNewPassword: z.string(),
  })
  .refine(
    (data) => {
      // Custom validation to check if passwords match
      return data.newPassword === data.confirmNewPassword;
    },
    {
      path: ["confirmNewPassword"],
      message: "Passwords don't match",
    }
  );

export type TEditPasswordForm = z.infer<typeof editPasswordSchema>;

export type TForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(7, { message: "Password must be at least 7 characters long" })
      .max(100, { message: "Password can't be longer than 100 characters" })
      .refine((val) => val !== "", { message: "Password is required" }),
    confirmNewPassword: z.string(),
  })
  .refine(
    (data) => {
      // Custom validation to check if passwords match
      return data.newPassword === data.confirmNewPassword;
    },
    {
      path: ["confirmNewPassword"],
      message: "Passwords don't match",
    }
  );

export type TResetPasswordForm = z.infer<typeof resetPasswordSchema>;
