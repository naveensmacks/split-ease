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
