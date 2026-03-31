"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import type { AuthState } from "@/app/actions/auth";
import { emptyState } from "@/app/actions/auth-state";

type AuthFormProps = {
  action: (state: AuthState, formData: FormData) => Promise<AuthState>;
  mode: "login" | "register";
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center rounded-full bg-stone-950 px-4 py-3 text-sm font-semibold text-stone-50 transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Working..." : label}
    </button>
  );
}

export function AuthForm({ action, mode }: AuthFormProps) {
  const [state, formAction] = useActionState(action, emptyState);

  const isLogin = mode === "login";
  const alternateHref = isLogin ? "/register" : "/login";
  const alternateLabel = isLogin ? "Create account" : "Go to sign in";
  const alternateDescription = isLogin ? "Need an account?" : "Already registered?";

  return (
    <div className="w-full max-w-md rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow)] backdrop-blur sm:p-10">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] pb-5 text-sm">
        <Link
          href="/"
          className="font-medium text-[var(--muted)] transition hover:text-stone-950"
        >
          Back home
        </Link>
        <form action={alternateHref}>
          <button
            type="submit"
            aria-label={isLogin ? "Go to the registration page" : "Go to the login page"}
            data-testid={isLogin ? "auth-switch-register-link" : "auth-switch-login-link"}
            className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-4 py-2 font-semibold text-stone-950 transition hover:border-stone-400 hover:bg-stone-50"
          >
            {alternateLabel}
          </button>
        </form>
      </div>
      <p className="text-sm font-medium tracking-[0.16em] text-amber-700 uppercase">
        {isLogin ? "Welcome back" : "Create your account"}
      </p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-950">
        {isLogin ? "Sign in to your dashboard" : "Register and get started"}
      </h1>
      <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
        {isLogin
          ? "Use the email and password you registered with."
          : "Your account will be stored locally in SQLite and redirected to the dashboard immediately after signup."}
      </p>

      <form action={formAction} className="mt-8 space-y-4">
        {!isLogin ? (
          <label className="block space-y-2 text-sm font-medium text-stone-900">
            <span>Name</span>
            <input
              type="text"
              name="name"
              defaultValue={state.values.name}
              required
              minLength={2}
              className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-950 outline-none transition focus:border-amber-500"
              placeholder="Ada Lovelace"
            />
          </label>
        ) : null}

        <label className="block space-y-2 text-sm font-medium text-stone-900">
          <span>Email</span>
          <input
            type="email"
            name="email"
            defaultValue={state.values.email}
            required
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-950 outline-none transition focus:border-amber-500"
            placeholder="you@example.com"
          />
        </label>

        <label className="block space-y-2 text-sm font-medium text-stone-900">
          <span>Password</span>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-950 outline-none transition focus:border-amber-500"
            placeholder="At least 6 characters"
          />
        </label>

        {state.error ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.error}
          </p>
        ) : null}

        <SubmitButton label={isLogin ? "Sign in" : "Create account"} />
      </form>

      <p className="mt-6 text-sm text-[var(--muted)]">
        {alternateDescription}{" "}
        <a
          href={alternateHref}
          aria-label={isLogin ? "Go to the registration page" : "Go to the login page"}
          className="font-semibold text-stone-950 underline decoration-amber-400 decoration-2 underline-offset-4"
        >
          {isLogin ? "Register" : "Sign in"}
        </a>
      </p>
    </div>
  );
}