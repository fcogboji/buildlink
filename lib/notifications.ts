import { NotificationType } from "@prisma/client";
import { sendTransactionalEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

type NotifyInput = {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  jobId?: string;
};

export async function notifyUser(input: NotifyInput) {
  const recipient = await prisma.user.findUnique({
    where: { id: input.userId },
    select: { email: true, emailNotificationsEnabled: true, fullName: true },
  });
  if (!recipient) return;

  await prisma.notification.create({
    data: {
      userId: input.userId,
      type: input.type,
      title: input.title,
      body: input.body,
      jobId: input.jobId,
    },
  });

  if (recipient.emailNotificationsEnabled) {
    await sendTransactionalEmail({
      to: recipient.email,
      subject: `BuildLink: ${input.title}`,
      html: `<p>Hi ${recipient.fullName || "there"},</p><p>${input.body}</p><p><strong>${input.title}</strong></p>`,
    });
  }
}

export async function notifyUsers(inputs: NotifyInput[]) {
  if (inputs.length === 0) return;
  await prisma.notification.createMany({
    data: inputs.map((n) => ({
      userId: n.userId,
      type: n.type,
      title: n.title,
      body: n.body,
      jobId: n.jobId,
    })),
  });

  const userIds = [...new Set(inputs.map((n) => n.userId))];
  const recipients = await prisma.user.findMany({
    where: { id: { in: userIds }, emailNotificationsEnabled: true },
    select: { id: true, email: true, fullName: true },
  });
  const byId = new Map(recipients.map((r) => [r.id, r]));

  await Promise.all(
    inputs.map(async (n) => {
      const recipient = byId.get(n.userId);
      if (!recipient) return;
      await sendTransactionalEmail({
        to: recipient.email,
        subject: `BuildLink: ${n.title}`,
        html: `<p>Hi ${recipient.fullName || "there"},</p><p>${n.body}</p><p><strong>${n.title}</strong></p>`,
      });
    }),
  );
}
