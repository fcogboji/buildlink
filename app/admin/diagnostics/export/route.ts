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

function since(minutes: number) {
  return new Date(Date.now() - minutes * 60 * 1000);
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

  const [hits1hByAction, hits24hByAction, topScopeActionPairs] = await Promise.all([
    prisma.rateLimitHit.groupBy({
      by: ["action"],
      where: { createdAt: { gte: since(60) } },
      _count: { _all: true },
      orderBy: { _count: { action: "desc" } },
    }),
    prisma.rateLimitHit.groupBy({
      by: ["action"],
      where: { createdAt: { gte: since(24 * 60) } },
      _count: { _all: true },
      orderBy: { _count: { action: "desc" } },
    }),
    prisma.rateLimitHit.groupBy({
      by: ["scopeKey", "action"],
      where: { createdAt: { gte: since(60) } },
      _count: { _all: true },
      orderBy: { _count: { scopeKey: "desc" } },
      take: 250,
    }),
  ]);

  const actionTo1h = new Map(hits1hByAction.map((r) => [r.action, r._count._all]));
  const actionTo24h = new Map(hits24hByAction.map((r) => [r.action, r._count._all]));
  const actions = [...new Set([...actionTo1h.keys(), ...actionTo24h.keys()])].sort();

  let csv = "";
  csv += csvRow(["section", "action", "hits_1h", "hits_24h", "scope_key"]);
  for (const action of actions) {
    csv += csvRow(["action_summary", action, actionTo1h.get(action) || 0, actionTo24h.get(action) || 0, ""]);
  }
  for (const row of topScopeActionPairs) {
    csv += csvRow(["scope_hotspot", row.action, row._count._all, "", row.scopeKey]);
  }

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="rate-limit-diagnostics-${new Date().toISOString()}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
