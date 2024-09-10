import { Expense, Group, Share, User } from "@prisma/client";

export type GroupEssential = Omit<
  Group,
  "groupId" | "totalExpense" | "updatedAt" | "createdAt" | "createdByUserId"
>;

type ShareWithRelations = Share & {
  paidToUser: User;
};

export type ExpenseWithRelations = Expense & {
  paidByUser: User;
  shares: ShareWithRelations[];
};

export type GroupWithRelations = Group & {
  users: User[];
  expenses: ExpenseWithRelations[];
};

export type MemberEssential = Omit<
  User,
  "hashedPassword" | "updatedAt" | "createdAt"
>;

export type ExpenseEssential = { shares: ShareEssential[] } & Omit<
  Expense,
  "expenseId" | "groupId" | "updatedAt" | "createdAt" | "addedById"
>;

type ShareEssential = Omit<Share, "shareId" | "expenseId" | "paidToUserId">;
