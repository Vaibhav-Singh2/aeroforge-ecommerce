"use server";
import { currentUser } from "@clerk/nextjs/server";
import { User } from "@prisma/client";
import prisma from "../prisma";

export const checkUser = async (): Promise<User | null | undefined> => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    const name = `${user.firstName} ${user.lastName}`;

    const upsertedUser = await prisma.user.upsert({
      where: { clerkUserId: user.id },
      update: {
        name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
      create: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });

    return upsertedUser;
  } catch (error) {
    if (error instanceof Error) console.log(error.message);
    else console.log(error);
  }
};
