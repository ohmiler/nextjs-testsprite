import "server-only";

import Database from "better-sqlite3";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";

const dataDirectory = path.join(process.cwd(), "data");

if (!existsSync(dataDirectory)) {
  mkdirSync(dataDirectory, { recursive: true });
}

const databasePath = path.join(dataDirectory, "app.db");

type GlobalDatabase = typeof globalThis & {
  sqlite?: Database.Database;
};

const globalDatabase = globalThis as GlobalDatabase;

export const db =
  globalDatabase.sqlite ??
  new Database(databasePath, {
    fileMustExist: false,
  });

if (process.env.NODE_ENV !== "production") {
  globalDatabase.sqlite = db;
}

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
  CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
`);

export type UserRecord = {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  sessionId: string;
  expiresAt: string;
};