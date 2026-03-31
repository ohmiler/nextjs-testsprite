import "server-only";

import { randomBytes } from "node:crypto";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { db, type SessionUser, type UserRecord } from "@/lib/db";

const SESSION_COOKIE_NAME = "session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7;

type SessionRow = SessionUser;

const findUserByEmailStatement = db.prepare(`
  SELECT
    id,
    name,
    email,
    password_hash AS passwordHash,
    created_at AS createdAt
  FROM users
  WHERE email = ?
`);

const insertUserStatement = db.prepare(`
  INSERT INTO users (name, email, password_hash)
  VALUES (?, ?, ?)
`);

const insertSessionStatement = db.prepare(`
  INSERT INTO sessions (id, user_id, expires_at)
  VALUES (?, ?, ?)
`);

const findSessionStatement = db.prepare(`
  SELECT
    users.id,
    users.name,
    users.email,
    sessions.id AS sessionId,
    sessions.expires_at AS expiresAt
  FROM sessions
  INNER JOIN users ON users.id = sessions.user_id
  WHERE sessions.id = ?
`);

const deleteSessionStatement = db.prepare(`
  DELETE FROM sessions
  WHERE id = ?
`);

const purgeExpiredSessionsStatement = db.prepare(`
  DELETE FROM sessions
  WHERE expires_at <= ?
`);

export function findUserByEmail(email: string) {
  return (findUserByEmailStatement.get(email) as UserRecord | undefined) ?? null;
}

export function createUser(name: string, email: string, passwordHash: string) {
  const result = insertUserStatement.run(name, email, passwordHash);
  return Number(result.lastInsertRowid);
}

export async function createSession(userId: number) {
  purgeExpiredSessionsStatement.run(new Date().toISOString());

  const sessionId = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  insertSessionStatement.run(sessionId, userId, expiresAt.toISOString());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function getCurrentUser() {
  purgeExpiredSessionsStatement.run(new Date().toISOString());

  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionId) {
    return null;
  }

  const session = (findSessionStatement.get(sessionId) as SessionRow | undefined) ?? null;

  if (!session || new Date(session.expiresAt) <= new Date()) {
    deleteSessionStatement.run(sessionId);
    cookieStore.delete(SESSION_COOKIE_NAME);
    return null;
  }

  return session;
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function logout() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (sessionId) {
    deleteSessionStatement.run(sessionId);
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}