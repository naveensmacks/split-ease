import "server-only"; //installed with "npm i server-only@0.0.1", it will throw runTime error if we use any of the function in client component
import prisma from "./db";
import { sleep } from "./utils";

export async function getGroupsByUserId(userId: string) {
  //await sleep(6000);
  const userGroups = await prisma.user.findFirst({
    where: {
      userId: {
        equals: userId.toLowerCase(),
        mode: "insensitive",
      },
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
        orderBy: {
          updatedAt: "desc",
        },
      },
    },
  });
  return userGroups?.groups;
}

export async function getUserByEmail(email: string) {
  const user = await prisma.user.findFirst({
    where: {
      email: {
        equals: email.toLowerCase(),
        mode: "insensitive",
      },
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

export async function getMembersByGroupId(groupId: string) {
  const group = await prisma.group.findFirst({
    where: {
      groupId: {
        equals: groupId.toLowerCase(),
        mode: "insensitive",
      },
    },
    select: {
      users: {
        select: {
          userId: true,
          firstName: true,
          lastName: true,
          email: true,
          isRegistered: true,
        },
      },
    },
  });
  return group?.users;
}

export async function isMemberOfGroup(email: string, groupId: string) {
  let isMemGroup = false;
  const group = await prisma.group.findFirst({
    where: {
      groupId: {
        equals: groupId.toLowerCase(),
        mode: "insensitive",
      },
    },
    select: {
      users: {
        where: {
          email: email,
        },
      },
    },
  });
  if (group && group.users && group.users.length > 0) {
    isMemGroup = true;
  }
  return isMemGroup;
}

export async function getGroupByGroupId(groupId: string) {
  const group = await prisma.group.findFirst({
    where: {
      groupId: {
        equals: groupId.toLowerCase(),
        mode: "insensitive",
      },
    },
    include: {
      users: true,
      expenses: true,
    },
  });
  return group;
}
