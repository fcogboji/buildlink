import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getCurrentDbUser() {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }
  return prisma.user.findUnique({
    where: { clerkUserId: userId },
    include: { builderProfile: true },
  });
}

export async function getCurrentUserRole() {
  const user = await getCurrentDbUser();
  return user?.role ?? null;
}
