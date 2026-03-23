import { prisma } from "@/lib/prisma";

type RateLimitInput = {
  scopeKey: string;
  action: string;
  limit: number;
  windowSeconds: number;
};

const RETENTION_DAYS = 14;

/**
 * Simple DB-backed sliding-window limiter.
 * Returns true when request is allowed, false when limit is exceeded.
 */
export async function consumeRateLimit(input: RateLimitInput) {
  // Opportunistic cleanup to keep table size bounded.
  if (Math.random() < 0.02) {
    const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000);
    void prisma.rateLimitHit.deleteMany({
      where: { createdAt: { lt: cutoff } },
    });
  }

  const since = new Date(Date.now() - input.windowSeconds * 1000);
  const recentCount = await prisma.rateLimitHit.count({
    where: {
      scopeKey: input.scopeKey,
      action: input.action,
      createdAt: { gte: since },
    },
  });

  if (recentCount >= input.limit) {
    return false;
  }

  await prisma.rateLimitHit.create({
    data: {
      scopeKey: input.scopeKey,
      action: input.action,
    },
  });

  return true;
}
