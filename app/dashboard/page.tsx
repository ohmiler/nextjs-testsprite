import { logoutAction } from "@/app/actions/auth";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

type CountRow = {
  count: number;
};

export default async function DashboardPage() {
  const user = await requireUser();

  const userCount = (db.prepare("SELECT COUNT(*) AS count FROM users").get() as CountRow).count;
  const activeSessions = (
    db
      .prepare("SELECT COUNT(*) AS count FROM sessions WHERE expires_at > ?")
      .get(new Date().toISOString()) as CountRow
  ).count;

  return (
    <main className="min-h-screen px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow)] sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <p className="text-sm font-medium tracking-[0.16em] text-amber-700 uppercase">Dashboard</p>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
                  Hello, {user.name}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                  You are logged in with <span className="font-semibold text-stone-900">{user.email}</span>. This page is protected by a server-side session check.
                </p>
              </div>
            </div>

            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-900 transition hover:border-stone-400 hover:bg-stone-50"
              >
                Log out
              </button>
            </form>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface-strong)] p-6 shadow-[var(--shadow)]">
            <p className="text-sm font-medium tracking-[0.16em] text-amber-700 uppercase">Users</p>
            <p className="mt-4 text-4xl font-semibold text-stone-950">{userCount}</p>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">Total registered accounts stored in the local SQLite database.</p>
          </article>

          <article className="rounded-[1.75rem] border border-[var(--border)] bg-stone-950 p-6 text-stone-50 shadow-[var(--shadow)]">
            <p className="text-sm font-medium tracking-[0.16em] text-amber-300 uppercase">Active sessions</p>
            <p className="mt-4 text-4xl font-semibold">{activeSessions}</p>
            <p className="mt-2 text-sm leading-7 text-stone-200">Session records that are still valid and can access protected routes.</p>
          </article>
        </section>
      </div>
    </main>
  );
}