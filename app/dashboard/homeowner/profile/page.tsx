import { updateEmailNotificationPreference } from "@/app/actions";
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
      <section className="mt-5 max-w-lg rounded-2xl border border-stone-200 bg-white p-5 text-sm">
        <p className="font-medium text-stone-900">Email notifications</p>
        <p className="mt-1 text-stone-600">Receive event emails for quotes, messages, and milestones.</p>
        <form action={updateEmailNotificationPreference} className="mt-3 flex items-center gap-3">
          <input type="hidden" name="emailNotificationsEnabled" value="0" />
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              name="emailNotificationsEnabled"
              value="1"
              defaultChecked={dbUser?.emailNotificationsEnabled ?? true}
              className="h-4 w-4 rounded border-stone-300"
            />
            <span>Enable email notifications</span>
          </label>
          <button type="submit" className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-800">
            Save
          </button>
        </form>
      </section>
      <p className="mt-4 text-sm text-stone-600">Saved addresses (JSON) can be edited in a future profile form.</p>
    </div>
  );
}
