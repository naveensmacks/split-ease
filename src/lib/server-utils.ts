//import "server-only"; //installed with "npm i server-only@0.0.1", it will throw runTime error if we use any of the function in client component
import prisma from "./db";
import { sleep } from "./utils";

export async function getGroupsByUserId(userId: string) {
  await sleep(6000);
  const userGroups = await prisma.user.findUnique({
    where: {
      userId: userId,
    },
    select: {
      groups: {
        select: {
          groupId: true,
          groupName: true,
          groupDescription: true,
          totalExpense: true,
          currencyType: true,
          splitEase: true,
          updatedAt: true,
          createdAt: true,
          createdByUserId: true,
          expenses: true, // This will fetch the expenses for each group
          users: true, // This will fetch the users for each group
        },
      },
    },
  });
  console.log("userGroups: ", userGroups);
  return userGroups?.groups;
}

export async function getUserByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  return user;
}

export async function getlistOfCurrencies() {
  //omit USD, INR, EUR and GBP since its added in combo box under popular
  const currencies = await prisma.currency.findMany({
    where: {
      code: {
        notIn: ["USD", "INR", "EUR", "GBP"],
      },
    },
  });
  return currencies;
}
