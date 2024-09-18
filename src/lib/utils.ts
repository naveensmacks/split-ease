import { type ClassValue, clsx } from "clsx";
import { Path, UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import {
  BalanceView,
  ExpenseWithRelations,
  GroupWithRelations,
  OptimizedTransaction,
  Transactor,
} from "./types";
import { User } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms = 1000) {
  if (process.env.NODE_ENV === "development") {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export function setServerFieldErrors<T extends Record<string, any>>(
  fieldErrors: Partial<Record<keyof T, string[]>>,
  setError: UseFormSetError<T>
) {
  const errors = Object.keys(fieldErrors) as Array<keyof T>;
  console.log("errors: ", errors);

  for (const field of errors) {
    const messages = fieldErrors[field];
    if (messages) {
      setError(field as Path<T>, {
        type: "server",
        message: messages.join(", "),
      });
    }
  }
}

export function formatDate(date: Date) {
  //Format in the Form of May 18,2022
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function extractInitials(
  firstName: string,
  lastName: string | undefined | null
) {
  return (
    firstName.slice(0, 1).toUpperCase() +
    (lastName ? lastName.slice(0, 1).toUpperCase() : ".")
  );
}

// Function to calculate optimized balances
export function calculateOptimizedTransactions(
  group: GroupWithRelations
): OptimizedTransaction[] {
  const expenses = group.expenses;
  // Store balances in a Map of the form: { 'senderId:receiverId': balance }
  const balanceMap = new Map<string, number>();

  // Helper function to update balance between two users
  function updateBalance(paidByUser: User, paidToUser: User, amount: number) {
    if (paidByUser.userId === paidToUser.userId) return; // Skip if sender and receiver are the same

    const key = `${paidByUser.userId}:${paidToUser.userId}`;
    const reverseKey = `${paidToUser.userId}:${paidByUser.userId}`;

    // Check if there is already a reverse balance (receiver owes sender)
    if (balanceMap.has(reverseKey)) {
      const reverseBalance = balanceMap.get(reverseKey)!;

      if (reverseBalance > amount) {
        // Reduce reverse balance
        balanceMap.set(reverseKey, reverseBalance - amount);
      } else if (reverseBalance < amount) {
        // Remove reverse balance and set new balance in correct direction
        balanceMap.delete(reverseKey);
        balanceMap.set(key, amount - reverseBalance);
      } else {
        // If amounts are equal, both balances are settled
        balanceMap.delete(reverseKey);
      }
    } else {
      // Add or update the balance in the correct direction
      balanceMap.set(key, (balanceMap.get(key) || 0) + amount);
    }
  }

  // Iterate over all expenses
  expenses.forEach((expense) => {
    const { paidByUser, shares } = expense;
    shares.forEach((share) => {
      if (share.amount > 0)
        updateBalance(paidByUser, share.paidToUser, share.amount);
    });
  });

  // Convert balanceMap to an array of { sender, receiver, amount }
  const result: OptimizedTransaction[] = [];

  balanceMap.forEach((amount, key) => {
    const [owedId, owerId] = key.split(":");
    const owed = group.users.find((user) => user.userId === owedId);
    const ower = group.users.find((user) => user.userId === owerId);
    if (ower && owed) {
      result.push({ ower, owed, amount });
    }
  });

  return result;
}

export function calculateBalances(group: GroupWithRelations) {
  const optimizedTransactions = calculateOptimizedTransactions(group);
  console.log("optimizedTransactions: ", optimizedTransactions);

  const balances: BalanceView[] = [];
  group.users.forEach((user) => {
    const sent = optimizedTransactions
      .filter((transaction) => transaction.owed.userId === user.userId)
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const received = optimizedTransactions
      .filter((transaction) => transaction.ower.userId === user.userId)
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    balances.push({ user, amount: sent - received });
  });
  //sort balance from high amount to low amount
  balances.sort((a, b) => b.amount - a.amount);

  // const splitEase = group && group.splitEase;
  // let trans;
  // if (!splitEase) {
  //   trans = group && calculateOptimizedTransactions(group);
  // } else {
  //   trans = minimizedTransactions(balances);
  // }
  // console.log("trans: ", trans);

  return balances;
}

export function transactions(group: GroupWithRelations | null) {
  const splitEase = group && group.splitEase;
  let trans;
  if (!splitEase) {
    trans = group && calculateOptimizedTransactions(group);
  } else {
    trans = minimizedTransactions(group.balance);
  }
  return trans;
}

export function getDetailedBalance(group: GroupWithRelations | null) {
  const splitEase = group && group.splitEase;
  let trans;
  if (!splitEase) {
    trans = group && calculateOptimizedTransactions(group);
  } else {
    trans = minimizedTransactions(group.balance);
  }
  const balance = group?.balance;
  balance?.map((bal) => {
    const owedTrans = trans?.filter(
      (trans) => trans.owed.userId === bal.user.userId
    );
    let transactors: Transactor[] = [];
    owedTrans?.forEach((trans) => {
      transactors.push({ user: trans.ower, amount: trans.amount });
    });
    const owerTrans = trans?.filter(
      (trans) => trans.ower.userId === bal.user.userId
    );
    owerTrans?.forEach((trans) => {
      transactors.push({ user: trans.owed, amount: -trans.amount });
    });
    //balances.sort((a, b) => b.amount - a.amount);
    transactors.sort((a, b) => a.amount - b.amount);
    bal.transactors = transactors;
  });
  return balance;
}

function minimizedTransactions(balance: BalanceView[] | undefined) {
  let rePayers: BalanceView[] = [],
    reReceivers: BalanceView[] = [];

  // Separate participants into payers and receivers
  balance?.forEach(({ user, amount }) => {
    if (amount > 0) reReceivers.push({ user, amount });
    else if (amount < 0) rePayers.push({ user, amount: -amount }); // make debt positive for easier calculation
  });
  // Sort payers and receivers by balance in ascending order
  rePayers.sort((a, b) => a.amount - b.amount);
  reReceivers.sort((a, b) => a.amount - b.amount);

  let transactions: OptimizedTransaction[] = [];

  // Greedily match payers and receivers
  while (rePayers.length > 0 && reReceivers.length > 0) {
    let ower = rePayers[rePayers.length - 1];
    let owed = reReceivers[reReceivers.length - 1];

    let amount = Math.min(ower.amount, owed.amount);

    // Create the transaction
    transactions.push({
      ower: ower.user,
      owed: owed.user,
      amount,
    });

    // Update the balances
    ower.amount -= amount;
    owed.amount -= amount;

    // Remove participants with zero balance
    if (ower.amount === 0) rePayers.pop();
    if (owed.amount === 0) reReceivers.pop();
  }

  return transactions;
}

// // Example User and BalanceView types
// type User = {
//   userId: string;
//   email: string | null;
//   hashedPassword: string | null;
//   firstName: string;
//   lastName: string | null;
//   isRegistered: boolean;
//   updatedAt: Date;
//   createdAt: Date;
// };
// type BalanceView = {
//   user: User;
//   amount: number;
// };
// // Test case
// const balanceView: BalanceView[] = [
//   {
//     user: {
//       userId: "A",
//       firstName: "A",
//       lastName: "",
//       email: "",
//       hashedPassword: "",
//       isRegistered: true,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     },
//     amount: 1000,
//   },
//   {
//     user: {
//       userId: "B",
//       firstName: "B",
//       lastName: "",
//       email: "",
//       hashedPassword: "",
//       isRegistered: true,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     },
//     amount: 500,
//   },
//   {
//     user: {
//       userId: "C",
//       firstName: "C",
//       lastName: "",
//       email: "",
//       hashedPassword: "",
//       isRegistered: true,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     },
//     amount: -250,
//   },
//   {
//     user: {
//       userId: "D",
//       firstName: "D",
//       lastName: "",
//       email: "",
//       hashedPassword: "",
//       isRegistered: true,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     },
//     amount: -500,
//   },
//   {
//     user: {
//       userId: "E",
//       firstName: "E",
//       lastName: "",
//       email: "",
//       hashedPassword: "",
//       isRegistered: true,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     },
//     amount: -750,
//   },
// ];
// // Run and test
// console.log(minimizeTransactions(balanceView));

// Function to find the possible permutations.
// Initial value of idx is 0.
