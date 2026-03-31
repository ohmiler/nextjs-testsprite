import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";

export default async function Home() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <section className="space-y-8 rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow)] backdrop-blur sm:p-12">
          <div className="inline-flex rounded-full border border-amber-300/70 bg-amber-100 px-4 py-2 text-sm font-medium tracking-[0.16em] text-amber-900 uppercase">
            Next.js + Tailwind + SQLite
          </div>
          <div className="space-y-5">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl lg:text-6xl">
              A very simple auth flow with registration, login, and a protected dashboard.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
              Register a user, sign in with an email and password, and land on a dashboard that only authenticated users can access.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <form action="/register">
              <button
                type="submit"
                aria-label="Go to the registration page"
                data-testid="landing-register-link"
                className="inline-flex items-center justify-center rounded-full bg-stone-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
                style={{ color: "#ffffff" }}
              >
                Create account
              </button>
            </form>
            <form action="/login">
              <button
                type="submit"
                aria-label="Go to the login page"
                data-testid="landing-login-link"
                className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white/80 px-6 py-3 text-sm font-semibold text-stone-900 transition hover:border-stone-400 hover:bg-white"
              >
                Sign in
              </button>
            </form>
          </div>
        </section>

        <section className="grid gap-4">
          <article className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface-strong)] p-6 shadow-[var(--shadow)]">
            <p className="text-sm font-medium tracking-[0.18em] text-amber-700 uppercase">What&apos;s included</p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--muted)] sm:text-base">
              <li>SQLite database file created automatically in the local data directory.</li>
              <li>Password hashing with bcrypt and session cookies stored server-side.</li>
              <li>Protected dashboard route with logout support.</li>
            </ul>
          </article>
          <article className="rounded-[1.75rem] border border-[var(--border)] bg-stone-950 p-6 text-stone-50 shadow-[var(--shadow)]">
            <p className="text-sm font-medium tracking-[0.18em] text-amber-300 uppercase">First run</p>
            <p className="mt-4 text-base leading-7 text-stone-200">
              Start by registering your first user. The database schema is initialized automatically on the first request.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
