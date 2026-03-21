import { currentUser } from "@clerk/nextjs/server";
import type { User as ClerkUser } from "@clerk/nextjs/server";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";

function getAutoRoleByEmail(email: string): UserRole | null {
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((x) => x.trim().toLowerCase())
    .filter(Boolean);

  if (adminEmails.includes(email.toLowerCase())) {
    return "ADMIN";
  }

  return null;
}

/**
 * Resolve app role from Clerk public metadata (set in Dashboard → Users → Public metadata).
 *
 * Supported shapes:
 * - `{ "role": "admin" }` or `"ADMIN"` → ADMIN
 * - `{ "isAdmin": true }` → ADMIN
 * - `{ "role": "homeowner" | "builder" }` → HOMEOWNER | BUILDER
 *
 * If nothing matches, returns null (caller may fall back to env or default).
 */
function getRoleFromClerkPublicMetadata(clerkUser: ClerkUser): UserRole | null {
  const meta = clerkUser.publicMetadata as Record<string, unknown> | null | undefined;
  if (!meta || typeof meta !== "object") {
    return null;
  }

  if (meta.isAdmin === true) {
    return "ADMIN";
  }

  const raw = meta.role;
  if (typeof raw !== "string") {
    return null;
  }

  const r = raw.trim().toUpperCase();
  if (r === "ADMIN" || r === "ADMINISTRATOR") {
    return "ADMIN";
  }
  if (r === "HOMEOWNER") {
    return "HOMEOWNER";
  }
  if (r === "BUILDER") {
    return "BUILDER";
  }

  return null;
}

export async function ensureUser(defaultRole: UserRole = "HOMEOWNER") {
  const clerkUser = await currentUser();
  if (!clerkUser?.id || !clerkUser.primaryEmailAddress?.emailAddress) {
    return null;
  }
  const email = clerkUser.primaryEmailAddress.emailAddress;

  const fromClerk = getRoleFromClerkPublicMetadata(clerkUser);
  const fromEnv = getAutoRoleByEmail(email);
  /** Clerk metadata wins, then env allowlist */
  const resolvedRole = fromClerk ?? fromEnv ?? null;

  return prisma.user.upsert({
    where: { clerkUserId: clerkUser.id },
    update: {
      email,
      fullName: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ").trim() || null,
      ...(resolvedRole !== null ? { role: resolvedRole } : {}),
    },
    create: {
      clerkUserId: clerkUser.id,
      email,
      fullName: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ").trim() || null,
      role: resolvedRole ?? defaultRole,
    },
  });
}
