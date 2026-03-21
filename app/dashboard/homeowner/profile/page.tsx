import { ensureUser } from "@/lib/user-sync";
import { prisma } from "@/lib/prisma";

export default async function HomeownerProfilePage() {
  const user = await ensureUser();
  if (!user) return null;

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });

  return (
    <div>
      <h1 className="text-3xl font-semibold">Profile</h1>
      <p className="mt-2 text-stone-600">Account details from Clerk + BuildLink.</p>
      <dl className="mt-6 max-w-lg space-y-2 rounded-2xl border border-stone-200 bg-white p-5 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-stone-500">Email</dt>
          <dd className="font-medium">{dbUser?.email}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-stone-500">Name</dt>
          <dd className="font-medium">{dbUser?.fullName || "—"}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-stone-500">Role</dt>
          <dd className="font-medium">{dbUser?.role}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-stone-500">Onboarding</dt>
          <dd className="font-medium">{dbUser?.onboardingCompleted ? "Complete" : "Incomplete"}</dd>
        </div>
      </dl>
      <p className="mt-4 text-sm text-stone-600">Saved addresses (JSON) can be edited in a future profile form.</p>
    </div>
  );
}
