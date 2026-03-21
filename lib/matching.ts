import { Job } from "@prisma/client";

export function scoreLeadFit(
  job: Job,
  builderTrades: string[] = [],
  builderSpecialties: string[] = [],
  builderAreas: string[] = [],
) {
  let score = 50;

  if (job.budgetMax >= 10000) score += 10;
  if (job.timelineWeeks && job.timelineWeeks >= 2 && job.timelineWeeks <= 16) score += 10;

  const jobText = `${job.title} ${job.description} ${job.propertyType ?? ""}`.toLowerCase();
  const combinedSkills = [...new Set([...builderTrades, ...builderSpecialties])];
  const specialtyMatch = combinedSkills.some((s) => jobText.includes(s.toLowerCase()));
  if (specialtyMatch) score += 20;

  const areaMatch = builderAreas.some((a) => job.postcode.toLowerCase().includes(a.toLowerCase()));
  if (areaMatch) score += 10;

  if (job.status !== "OPEN" && job.status !== "MATCHED") score -= 25;

  if (score >= 80) return { score, label: "High fit" };
  if (score >= 60) return { score, label: "Medium fit" };
  return { score, label: "Low fit" };
}
