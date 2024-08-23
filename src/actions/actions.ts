"use server";

import prisma from "@/lib/db";
import { sleep } from "@/lib/utils";
import { groupFormSchema } from "@/lib/validation";
//import { revalidatePath } from "next/cache";

// --- group actions ---
export async function addgroup(group: unknown, userId: string) {
  await sleep(3000);

  const validatedGroup = groupFormSchema.safeParse(group);
  if (!validatedGroup.success) {
    return {
      message: "Invalid Group data.",
    };
  }
  //change currency type to code by taing only the last three letters
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
    return { group: group, message: "" };
  } catch (error) {
    console.log("error: ", error);
    return {
      message: "Could not create group.",
    };
  }
  //revalidatePath("/app/groups", "layout");
}
