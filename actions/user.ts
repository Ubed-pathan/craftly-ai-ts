"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateAIInsights } from "./dashboard";
import type { IndustryInsight, User } from "@prisma/client";

export interface UpdateUserInput {
  industry: string;
  experience: number;
  bio?: string | null;
  skills?: string[] | null;
}

export async function updateUser(data: UpdateUserInput): Promise<{ updatedUser: User; industryInsight: IndustryInsight }> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");

  try {
    const result = await db.$transaction(async (tx) => {
      let industryInsight = await tx.industryInsight.findUnique({
        where: { industry: data.industry },
      });

      if (!industryInsight) {
        const insights = await generateAIInsights(data.industry);

        industryInsight = await tx.industryInsight.create({
          data: {
            industry: data.industry,
            ...insights,
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });
      }

      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          industry: data.industry,
          experience: data.experience,
          bio: data.bio ?? null,
          skills: data.skills ?? [],
        },
      });

      return { updatedUser, industryInsight } as { updatedUser: User; industryInsight: IndustryInsight };
    },
    { timeout: 10000 });

    revalidatePath("/");
    return result;
  } catch (error: any) {
    console.error("Error updating user and industry:", error?.message);
    throw new Error("Failed to update profile");
  }
}

export async function getUserOnboardingStatus(): Promise<{ isOnboarded: boolean }> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");

  try {
    const u = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: { industry: true },
    });

    return { isOnboarded: !!u?.industry };
  } catch {
    throw new Error("Failed to check onboarding status");
  }
}
