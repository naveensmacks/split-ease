"use server";

import prisma from "@/lib/db";
import { getUserByEmail, isMemberOfGroup } from "@/lib/server-utils";
import { groupFormSchema, memberFormSchema } from "@/lib/validation";

// --- group actions ---
export async function addgroup(group: unknown, userId: string) {
  const validatedGroup = groupFormSchema.safeParse(group);
  if (!validatedGroup.success) {
    return {
      isSuccess: false,
      fieldErrors: validatedGroup.error.flatten().fieldErrors,
    };
  }
  //change currency type to code by taking only the last three letters
  const code = validatedGroup.data.currencyType.slice(-3);
  console.log("code after slice: ", code);

  //remove  validatedGroup.data.currencyType from validatedGroup.data
  const { currencyType, ...data } = validatedGroup.data;

  // create group
  try {
    const group = await prisma.group.create({
      data: {
        ...data,
        users: { connect: [{ userId: userId }] },
        createdBy: { connect: { userId: userId } },
        currency: { connect: { code: code } },
      },
      include: {
        users: true,
        expenses: true,
      },
    });
    return { isSuccess: true, data: group };
  } catch (error) {
    console.log("error: ", error);
    return {
      isSuccess: false,
      message: "Could not create group. Try again later.",
    };
  }
}
export async function addMemberToGroup(member: unknown, groupId: string) {
  const validatedMember = memberFormSchema.safeParse(member);
  if (!validatedMember.success) {
    return {
      isSuccess: false,
      fieldErrors: validatedMember.error.flatten().fieldErrors,
    };
  }
  const newMember = validatedMember.data;
  console.log("newMember: ", newMember);

  if (newMember.isRegistered && newMember.email) {
    //check if user is a registered user
    const member = await getUserByEmail(newMember.email);
    if (!member) {
      return {
        isSuccess: false,
        fieldErrors: { email: ["This email is not registered"] },
      };
    }
    //check if user is already a member of the same group
    if (await isMemberOfGroup(newMember.email, groupId)) {
      return {
        isSuccess: false,
        fieldErrors: { email: ["Already a member of this group"] },
      };
    }
    try {
      const group = await prisma.group.update({
        where: { groupId: groupId },
        data: {
          users: { connect: { userId: member.userId } },
        },
        include: {
          users: true,
          expenses: true,
        },
      });
      return {
        isSuccess: true,
        data: group,
      };
    } catch (error) {
      console.log("error: ", error);
      return {
        isSuccess: false,
        message: "Could not add member.",
      };
    }
  } else {
    //create new member(guest) for non-registered users
    newMember.isRegistered = false; //since we havenot added that check in elseif, we are setting it here(to be robust)
    try {
      const member = await prisma.user.create({
        data: {
          ...newMember,
        },
      });
      const group = await prisma.group.update({
        where: { groupId: groupId },
        data: {
          users: { connect: { userId: member.userId } },
        },
        include: {
          users: true,
          expenses: true,
        },
      });
      return {
        isSuccess: true,
        data: group,
      };
    } catch (error) {
      console.log("error: ", error);
      return {
        isSuccess: false,
        message: "Could not add member.",
      };
    }
  }
}
