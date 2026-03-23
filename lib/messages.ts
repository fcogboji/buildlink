import { prisma } from "@/lib/prisma";

export async function markThreadRead(userId: string, jobId: string) {
  await prisma.messageThreadState.upsert({
    where: { userId_jobId: { userId, jobId } },
    update: { lastReadAt: new Date() },
    create: { userId, jobId, lastReadAt: new Date() },
  });
}
