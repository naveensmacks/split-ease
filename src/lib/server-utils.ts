import "server-only"; //installed with "npm i server-only@0.0.1", it will throw runTime error if we use any of the function in client component
import prisma from "./db";

export async function getGroupsByUserId(userId: string) {
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
