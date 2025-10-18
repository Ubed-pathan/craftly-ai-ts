import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";
import type { User } from "@prisma/client";

export const checkUser = async (): Promise<User | null> => {
  let user: Awaited<ReturnType<typeof currentUser>> | null = null;
  try {
    user = await currentUser();
  } catch {
    return null;
  }

  if (!user) return null;

  try {
    const loggedInUser = await db.user.findUnique({
      where: { clerkUserId: user.id },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    const name = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
      (user.username ?? "") ||
      (user.emailAddresses?.[0]?.emailAddress?.split("@")?.[0] ?? "User");

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl ?? null,
        email: user.emailAddresses?.[0]?.emailAddress ?? "",
      },
    });

    return newUser;
  } catch (error) {
    return null;
  }
};
