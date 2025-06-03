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
    const loggedInUser = await prisma.user.findUnique({
      where: { clerkUserId: user.id },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    const name = `${user.firstName} ${user.lastName}`;

    const newUser = await prisma.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });

    return newUser;
  } catch (error) {
    if (error instanceof Error) console.log(error.message);
    else console.log(error);
  }
};
