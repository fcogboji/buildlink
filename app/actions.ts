"use server";

import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ensureUser } from "@/lib/user-sync";
import { prisma } from "@/lib/prisma";

function toInt(value: FormDataEntryValue | null, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.floor(parsed) : fallback;
}

function parseList(value: FormDataEntryValue | null): string[] {
  const raw = String(value || "").trim();
  if (!raw) return [];
  return raw
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function updateMyRole(formData: FormData) {
  const role = String(formData.get("role") || "HOMEOWNER") as UserRole;
  if (!["HOMEOWNER", "BUILDER", "ADMIN"].includes(role)) {
    return;
  }

  const user = await ensureUser();
  if (!user) {
    redirect("/sign-in");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { role },
  });

  revalidatePath("/dashboard");
}

export async function setOnboardingRole(formData: FormData) {
  const role = String(formData.get("role") || "HOMEOWNER") as UserRole;
  if (!["HOMEOWNER", "BUILDER"].includes(role)) {
    return;
  }
  const user = await ensureUser();
  if (!user) redirect("/sign-in");
  await prisma.user.update({ where: { id: user.id }, data: { role } });
  revalidatePath("/onboarding");
  if (role === "BUILDER") redirect("/onboarding/builder");
  redirect("/onboarding/homeowner");
}

export async function completeHomeownerOnboarding(formData: FormData) {
  const user = await ensureUser();
  if (!user) redirect("/sign-in");
  if (user.role !== "ADMIN") {
    await prisma.user.update({ where: { id: user.id }, data: { role: "HOMEOWNER" } });
  }

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const postcode = String(formData.get("postcode") || "").trim().toUpperCase();
  const propertyType = String(formData.get("propertyType") || "").trim() || null;
  const budgetMin = toInt(formData.get("budgetMin"));
  const budgetMax = toInt(formData.get("budgetMax"));
  const timelineWeeks = toInt(formData.get("timelineWeeks"), 0) || null;
  const imageUrls = parseList(formData.get("imageUrls"));

  if (!title || !description || !postcode || budgetMin <= 0 || budgetMax <= 0 || budgetMax < budgetMin) {
    return;
  }

  await prisma.job.create({
    data: {
      homeownerId: user.id,
      title,
      description,
      postcode,
      propertyType,
      imageUrls,
      budgetMin,
      budgetMax,
      timelineWeeks,
      status: "OPEN",
    },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { onboardingCompleted: true },
  });

  revalidatePath("/dashboard/homeowner");
  redirect("/dashboard/homeowner/jobs");
}

export async function completeBuilderOnboarding(formData: FormData) {
  const user = await ensureUser();
  if (!user) redirect("/sign-in");
  if (user.role !== "ADMIN") {
    await prisma.user.update({ where: { id: user.id }, data: { role: "BUILDER" } });
  }

  const companyName = String(formData.get("companyName") || "").trim() || user.fullName || "My business";
  const trades = parseList(formData.get("trades"));
  const serviceAreas = parseList(formData.get("serviceAreas"));
  const yearsExperience = toInt(formData.get("yearsExperience"), 0) || null;
  const certifications = parseList(formData.get("certifications"));
  const availability = String(formData.get("availability") || "").trim() || null;
  const bio = String(formData.get("bio") || "").trim() || null;
  const portfolioVideoUrl = String(formData.get("portfolioVideoUrl") || "").trim() || null;
  const portfolioImageUrls = parseList(formData.get("portfolioImageUrls"));

  await prisma.builderProfile.upsert({
    where: { userId: user.id },
    update: {
      companyName,
      trades: trades.length ? trades : ["general"],
      specialties: trades.length ? trades : ["general"],
      serviceAreas,
      yearsExperience,
      certifications,
      availability,
      bio,
      portfolioVideoUrl,
      portfolioImageUrls,
    },
    create: {
      userId: user.id,
      companyName,
      trades: trades.length ? trades : ["general"],
      specialties: trades.length ? trades : ["general"],
      serviceAreas,
      yearsExperience,
      certifications,
      availability,
      bio,
      portfolioVideoUrl,
      portfolioImageUrls,
    },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { onboardingCompleted: true },
  });

  revalidatePath("/dashboard/builder");
  redirect("/dashboard/builder/jobs/feed");
}

export async function createJob(formData: FormData) {
  const user = await ensureUser("HOMEOWNER");
  if (!user) {
    redirect("/sign-in");
  }

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const postcode = String(formData.get("postcode") || "").trim().toUpperCase();
  const propertyType = String(formData.get("propertyType") || "").trim() || null;
  const budgetMin = toInt(formData.get("budgetMin"));
  const budgetMax = toInt(formData.get("budgetMax"));
  const timelineWeeks = toInt(formData.get("timelineWeeks"), 0) || null;
  const imageUrls = parseList(formData.get("imageUrls"));

  if (!title || !description || !postcode || budgetMin <= 0 || budgetMax <= 0 || budgetMax < budgetMin) {
    return;
  }

  await prisma.job.create({
    data: {
      homeownerId: user.id,
      title,
      description,
      postcode,
      propertyType,
      imageUrls,
      budgetMin,
      budgetMax,
      timelineWeeks,
      status: "OPEN",
    },
  });

  revalidatePath("/homeowner/jobs");
  revalidatePath("/dashboard/homeowner/jobs");
  redirect("/dashboard/homeowner/jobs");
}

export async function createQuote(formData: FormData) {
  const user = await ensureUser("BUILDER");
  if (!user) {
    redirect("/sign-in");
  }

  const jobId = String(formData.get("jobId") || "");
  const amount = toInt(formData.get("amount"));
  const daysToComplete = toInt(formData.get("daysToComplete"));
  const introMessage = String(formData.get("introMessage") || "").trim();

  if (!jobId || amount <= 0 || daysToComplete <= 0 || !introMessage) {
    return;
  }

  await prisma.quote.upsert({
    where: { jobId_builderId: { jobId, builderId: user.id } },
    update: { amount, daysToComplete, introMessage },
    create: {
      jobId,
      builderId: user.id,
      amount,
      daysToComplete,
      introMessage,
    },
  });

  await prisma.job.update({
    where: { id: jobId },
    data: { status: "MATCHED" },
  });

  revalidatePath("/builder/leads");
  revalidatePath("/dashboard/builder/jobs/feed");
  revalidatePath(`/homeowner/jobs/${jobId}`);
  revalidatePath(`/dashboard/homeowner/jobs/${jobId}`);
}

export async function acceptQuote(formData: FormData) {
  const user = await ensureUser("HOMEOWNER");
  if (!user) redirect("/sign-in");
  const quoteId = String(formData.get("quoteId") || "");
  if (!quoteId) return;

  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    include: { job: true },
  });
  if (!quote || quote.job.homeownerId !== user.id) return;

  await prisma.$transaction([
    prisma.quote.updateMany({
      where: { jobId: quote.jobId, id: { not: quoteId } },
      data: { status: "REJECTED" },
    }),
    prisma.quote.update({ where: { id: quoteId }, data: { status: "ACCEPTED" } }),
    prisma.job.update({
      where: { id: quote.jobId },
      data: { status: "IN_PROGRESS" },
    }),
    prisma.project.upsert({
      where: { jobId: quote.jobId },
      update: { builderId: quote.builderId, status: "ACTIVE" },
      create: { jobId: quote.jobId, builderId: quote.builderId, status: "ACTIVE" },
    }),
  ]);

  revalidatePath(`/dashboard/homeowner/jobs/${quote.jobId}`);
  revalidatePath(`/dashboard/builder/projects`);
}

export async function sendJobMessage(formData: FormData) {
  const user = await ensureUser();
  if (!user) redirect("/sign-in");
  const jobId = String(formData.get("jobId") || "");
  const body = String(formData.get("body") || "").trim();
  if (!jobId || !body) return;

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { project: true },
  });
  if (!job) return;

  const isOwner = job.homeownerId === user.id;
  const isAssignedBuilder = job.project?.builderId === user.id;
  const isAdmin = user.role === "ADMIN";
  if (!isOwner && !isAssignedBuilder && !isAdmin) return;

  await prisma.message.create({
    data: { jobId, senderId: user.id, body },
  });

  revalidatePath(`/dashboard/homeowner/messages`);
  revalidatePath(`/dashboard/builder/messages`);
  revalidatePath(`/dashboard/homeowner/jobs/${jobId}`);
  revalidatePath(`/dashboard/builder/jobs/feed`);
}

export async function addMilestone(formData: FormData) {
  const user = await ensureUser("HOMEOWNER");
  if (!user) {
    redirect("/sign-in");
  }

  const jobId = String(formData.get("jobId") || "");
  const title = String(formData.get("title") || "").trim();
  const amount = toInt(formData.get("amount"));

  if (!jobId || !title || amount <= 0) {
    return;
  }

  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job || job.homeownerId !== user.id) {
    return;
  }

  await prisma.milestone.create({
    data: {
      jobId,
      title,
      amount,
      status: "PENDING",
    },
  });

  revalidatePath(`/homeowner/jobs/${jobId}`);
  revalidatePath(`/dashboard/homeowner/jobs/${jobId}`);
  revalidatePath(`/dashboard/homeowner/payments`);
}

export async function markJobDisputed(formData: FormData) {
  const user = await ensureUser();
  if (!user) {
    redirect("/sign-in");
  }
  const jobId = String(formData.get("jobId") || "");
  if (!jobId) return;

  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) return;

  const ownsJob = job.homeownerId === user.id;
  const isAdmin = user.role === "ADMIN";
  if (!ownsJob && !isAdmin) return;

  await prisma.job.update({
    where: { id: jobId },
    data: { status: "DISPUTED" },
  });

  revalidatePath(`/homeowner/jobs/${jobId}`);
  revalidatePath(`/dashboard/homeowner/jobs/${jobId}`);
  revalidatePath("/admin/disputes");
}

export async function resolveDispute(formData: FormData) {
  const user = await ensureUser();
  if (!user || user.role !== "ADMIN") {
    return;
  }

  const jobId = String(formData.get("jobId") || "");
  if (!jobId) return;

  await prisma.job.update({
    where: { id: jobId },
    data: { status: "IN_PROGRESS" },
  });

  revalidatePath("/admin/disputes");
}

export async function verifyBuilder(formData: FormData) {
  const user = await ensureUser();
  if (!user || user.role !== "ADMIN") {
    return;
  }

  const profileId = String(formData.get("profileId") || "");
  if (!profileId) return;

  await prisma.builderProfile.update({
    where: { id: profileId },
    data: { verified: true, verificationScore: 90 },
  });

  revalidatePath("/admin/users");
}

export async function suspendUser(formData: FormData) {
  const admin = await ensureUser();
  if (!admin || admin.role !== "ADMIN") return;
  const userId = String(formData.get("userId") || "");
  const suspend = String(formData.get("suspend") || "1") === "1";
  if (!userId) return;
  await prisma.user.update({ where: { id: userId }, data: { suspended: suspend } });
  revalidatePath("/admin/users");
}

export async function hideReview(formData: FormData) {
  const admin = await ensureUser();
  if (!admin || admin.role !== "ADMIN") return;
  const reviewId = String(formData.get("reviewId") || "");
  if (!reviewId) return;
  await prisma.review.update({
    where: { id: reviewId },
    data: { hidden: true, moderated: true },
  });
  revalidatePath("/admin/reviews");
}
