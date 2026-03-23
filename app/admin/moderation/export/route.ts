import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function csvCell(value: unknown) {
  const s = String(value ?? "");
  return `"${s.replaceAll('"', '""')}"`;
}

function csvRow(values: unknown[]) {
  return `${values.map(csvCell).join(",")}\n`;
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    select: { role: true },
  });
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const logs = await prisma.adminAuditLog.findMany({
    include: { admin: true },
    orderBy: { createdAt: "desc" },
    take: 5000,
  });

  let csv = "";
  csv += csvRow(["created_at", "admin_email", "action", "target_type", "target_id", "reason_code", "metadata_json"]);
  for (const log of logs) {
    csv += csvRow([
      log.createdAt.toISOString(),
      log.admin.email,
      log.action,
      log.targetType,
      log.targetId,
      log.reasonCode || "",
      JSON.stringify(log.metadata ?? {}),
    ]);
  }

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="moderation-audit-${new Date().toISOString()}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
