import "server-only"; //installed with "npm i server-only@0.0.1", it will throw runTime error if we use any of the function in client component
import prisma from "./db";
import { sleep } from "./utils";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { TokenPurpose } from "@prisma/client";

export async function checkAuth() {
  //authentication check
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  //after this line session.user cannot undefined

  session.user.id;
  //but for some peculiar reason, session.user is undefined after this
  //code when it is called from action.ts, so we are overriding
  //the type in next-auth.d.ts (globally)
  return session;
}

export async function getGroupsByUserId(userId: string) {
  //TODO: add this while testing
  //await sleep(2000);
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
          expenses: {
            include: {
              paidByUser: true,
              addedByUser: true,
              updatedByUser: true,
              shares: {
                include: {
                  paidToUser: true,
                },
              },
            },
          }, // This will fetch the expenses for each group
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

export async function getGroupDetailsByGroupId(groupId: string) {
  const group = await prisma.group.findFirst({
    where: {
      groupId: {
        equals: groupId.toLowerCase(),
        mode: "insensitive",
      },
    },
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
      expenses: {
        include: {
          paidByUser: true,
          addedByUser: true,
          updatedByUser: true,
          shares: {
            include: {
              paidToUser: true,
            },
          },
        },
      }, // This will fetch all the expenses of the group
      users: true, // This will fetch the all users of the group
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  return group!;
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

export async function getUserById(userId: string) {
  const user = await prisma.user.findMany({
    where: {
      userId: {
        equals: userId.toLowerCase(),
        mode: "insensitive",
      },
    },
  });
  return user[0];
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

//ToDo: Not used
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

export const getVerificationTokenByEmail = async (
  email: string,
  tokenPurpose: TokenPurpose
) => {
  try {
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        email: email,
        purpose: tokenPurpose,
      },
    });

    return verificationToken;
  } catch (error) {
    console.log(error);
  }
};

export const getVerificationTokenByToken = async (
  token: string,
  purpose: TokenPurpose
) => {
  try {
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        token: token,
        purpose: purpose,
      },
    });

    return verificationToken;
  } catch (error) {
    console.log(error);
  }
};
