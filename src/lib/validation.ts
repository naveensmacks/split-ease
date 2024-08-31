import { User } from "@prisma/client";
import { z } from "zod";
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
