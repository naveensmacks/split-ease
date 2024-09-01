import { Expense, Group, Share, User } from "@prisma/client";

export type GroupEssential = Omit<
  Group,
  "groupId" | "totalExpense" | "updatedAt" | "createdAt" | "createdByUserId"
>;

type ExpenseWithRelations = Expense & {
  paidByUser: User;
  shares: Share[];
};
export type GroupWithRelations = Group & {
  users: User[];
  expenses: ExpenseWithRelations[];
};

export type MemberEssential = Omit<
  User,
  "hashedPassword" | "updatedAt" | "createdAt"
>;
