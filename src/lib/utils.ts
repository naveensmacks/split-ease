import { type ClassValue, clsx } from "clsx";
import { Path, UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import {
  BalanceView,
  ExpenseWithRelations,
  GroupWithRelations,
  OptimizedTransaction,
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
  return firstName.slice(0, 1) + (lastName ? lastName.slice(0, 1) : ".");
}

// Function to calculate optimized balances
export function calculateOptimizedTransactions(
  group: GroupWithRelations
): OptimizedTransaction[] {
  const expenses = group.expenses;
  // Store balances in a Map of the form: { 'senderId:receiverId': balance }
  const balanceMap = new Map<string, number>();

  // Helper function to update balance between two users
  function updateBalance(sender: User, receiver: User, amount: number) {
    if (sender.userId === receiver.userId) return; // Skip if sender and receiver are the same

    const key = `${sender.userId}:${receiver.userId}`;
    const reverseKey = `${receiver.userId}:${sender.userId}`;

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
      updateBalance(paidByUser, share.paidToUser, share.amount);
    });
  });

  // Convert balanceMap to an array of { sender, receiver, amount }
  const result: OptimizedTransaction[] = [];

  balanceMap.forEach((amount, key) => {
    const [senderId, receiverId] = key.split(":");
    const sender = group.users.find((user) => user.userId === senderId);
    const receiver = group.users.find((user) => user.userId === receiverId);
    if (sender && receiver) {
      result.push({ sender, receiver, amount });
    }
  });

  return result;
}

export function calculateBalances(group: GroupWithRelations) {
  const optimizedTransactions = calculateOptimizedTransactions(group);

  const balances: BalanceView[] = [];
  group.users.forEach((user) => {
    const sent = optimizedTransactions
      .filter((transaction) => transaction.sender.userId === user.userId)
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const received = optimizedTransactions
      .filter((transaction) => transaction.receiver.userId === user.userId)
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    balances.push({ user, amount: sent - received });
  });
  //sort balance from high amount to low amount
  balances.sort((a, b) => b.amount - a.amount);
  return balances;
}

export function minimizeTransactions(balance: BalanceView[] | undefined) {
  let payers: BalanceView[] = [],
    receivers: BalanceView[] = [];

  // Separate participants into payers and receivers
  balance?.forEach(({ user, amount }) => {
    if (amount > 0) receivers.push({ user, amount });
    else if (amount < 0) payers.push({ user, amount: -amount }); // make debt positive for easier calculation
  });
  // Sort payers and receivers by balance in ascending order
  payers.sort((a, b) => a.amount - b.amount);
  receivers.sort((a, b) => a.amount - b.amount);

  let transactions = [];

  // Greedily match payers and receivers
  while (payers.length > 0 && receivers.length > 0) {
    let payer = payers[payers.length - 1];
    let receiver = receivers[receivers.length - 1];

    let amount = Math.min(payer.amount, receiver.amount);

    // Create the transaction
    transactions.push(
      `${payer.user.firstName + " " + payer.user.lastName} pays ${amount} to ${
        receiver.user.firstName + " " + receiver.user.lastName
      }`
    );

    // Update the balances
    payer.amount -= amount;
    receiver.amount -= amount;

    // Remove participants with zero balance
    if (payer.amount === 0) payers.pop();
    if (receiver.amount === 0) receivers.pop();
  }

  return transactions;
}
