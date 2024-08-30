import { Expense, Group, User } from "@prisma/client";

export type GroupEssential = Omit<
  Group,
  "groupId" | "totalExpense" | "updatedAt" | "createdAt" | "createdByUserId"
>;

export type GroupWithRelations = Group & {
  users: User[];
  expenses: Expense[];
};

export type MemberEssential = Omit<
  User,
  "hashedPassword" | "updatedAt" | "createdAt"
>;
