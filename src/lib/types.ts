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
  addedByUser: User;
  updatedByUser: User;
  shares: ShareWithRelations[];
};

export type GroupWithRelations = Group & {
  users: User[];
  expenses: ExpenseWithRelations[];
  balance?: BalanceView[];
};

export type MemberEssential = Omit<
  User,
  "hashedPassword" | "updatedAt" | "createdAt"
>;

export type ExpenseEssential = { shares: ShareEssential[] } & Omit<
  Expense,
  | "expenseId"
  | "groupId"
  | "updatedAt"
  | "createdAt"
  | "addedById"
  | "updatedById"
>;

type ShareEssential = Omit<Share, "shareId" | "expenseId" | "paidToUserId">;

export type BalanceView = {
  user: User;
  amount: number;
  transactors?: Transactor[];
};

export type Transactor = {
  amount: number;
  user: User;
};
export type OptimizedTransaction = {
  ower: User;
  owed: User;
  amount: number;
};
