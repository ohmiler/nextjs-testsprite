"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import { createSession, createUser, findUserByEmail, logout } from "@/lib/auth";

export type AuthState = {
  error: string | null;
  values: {
    name: string;
    email: string;
  };
};

function readCredentials(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    password: String(formData.get("password") ?? ""),
  };
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function registerAction(_: AuthState, formData: FormData): Promise<AuthState> {
  const credentials = readCredentials(formData);

  if (credentials.name.length < 2) {
    return {
      error: "Name must be at least 2 characters long.",
      values: {
        name: credentials.name,
        email: credentials.email,
      },
    };
  }

  if (!isValidEmail(credentials.email)) {
    return {
      error: "Enter a valid email address.",
      values: {
        name: credentials.name,
        email: credentials.email,
      },
    };
  }

  if (credentials.password.length < 6) {
    return {
      error: "Password must be at least 6 characters long.",
      values: {
        name: credentials.name,
        email: credentials.email,
      },
    };
  }

  if (findUserByEmail(credentials.email)) {
    return {
      error: "That email is already registered.",
      values: {
        name: credentials.name,
        email: credentials.email,
      },
    };
  }

  const passwordHash = await bcrypt.hash(credentials.password, 12);

  let userId: number;

  try {
    userId = createUser(credentials.name, credentials.email, passwordHash);
  } catch {
    return {
      error: "That email is already registered.",
      values: {
        name: credentials.name,
        email: credentials.email,
      },
    };
  }

  await createSession(userId);
  redirect("/dashboard");
}

export async function loginAction(_: AuthState, formData: FormData): Promise<AuthState> {
  const credentials = readCredentials(formData);

  if (!isValidEmail(credentials.email)) {
    return {
      error: "Enter a valid email address.",
      values: {
        name: "",
        email: credentials.email,
      },
    };
  }

  if (!credentials.password) {
    return {
      error: "Password is required.",
      values: {
        name: "",
        email: credentials.email,
      },
    };
  }

  const user = findUserByEmail(credentials.email);

  if (!user) {
    return {
      error: "Invalid email or password.",
      values: {
        name: "",
        email: credentials.email,
      },
    };
  }

  const passwordsMatch = await bcrypt.compare(credentials.password, user.passwordHash);

  if (!passwordsMatch) {
    return {
      error: "Invalid email or password.",
      values: {
        name: "",
        email: credentials.email,
      },
    };
  }

  await createSession(user.id);
  redirect("/dashboard");
}

export async function logoutAction() {
  await logout();
  redirect("/login");
}
