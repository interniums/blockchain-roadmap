import 'server-only';
import path from 'node:path';
import fs from 'node:fs';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

/**
 * CHAINPATH_STATE_DIR exists so tests never touch the learner's real record. It is read once at
 * module load and is not settable from the app — nothing in a request path can redirect state.
 */
const DIR = process.env.CHAINPATH_STATE_DIR
  ? path.resolve(process.env.CHAINPATH_STATE_DIR)
  : path.join(process.cwd(), '.chainpath');
const FILE = path.join(DIR, 'state.db');

let _db: ReturnType<typeof drizzle> | null = null;

export function db() {
  if (_db) return _db;
  fs.mkdirSync(DIR, { recursive: true });
  const sqlite = new Database(FILE);
  sqlite.pragma('journal_mode = WAL');
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS review_state (
      concept_id TEXT PRIMARY KEY, due INTEGER NOT NULL, stability REAL NOT NULL,
      difficulty REAL NOT NULL, elapsed_days REAL NOT NULL DEFAULT 0,
      scheduled_days REAL NOT NULL DEFAULT 0, reps INTEGER NOT NULL DEFAULT 0,
      lapses INTEGER NOT NULL DEFAULT 0, learning_steps INTEGER NOT NULL DEFAULT 0,
      state INTEGER NOT NULL DEFAULT 0, last_review INTEGER,
      credited_stability REAL NOT NULL DEFAULT 0);
    CREATE TABLE IF NOT EXISTS review_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT, concept_id TEXT NOT NULL, rating INTEGER NOT NULL,
      confidence INTEGER, confidently_wrong INTEGER NOT NULL DEFAULT 0,
      reviewed_at INTEGER NOT NULL, credited_from TEXT);
    CREATE TABLE IF NOT EXISTS practice_attempt (
      id INTEGER PRIMARY KEY AUTOINCREMENT, practice_id TEXT NOT NULL, attempted_at INTEGER NOT NULL,
      passed INTEGER NOT NULL, hints_used INTEGER NOT NULL DEFAULT 0, output TEXT);
    CREATE TABLE IF NOT EXISTS note (
      id INTEGER PRIMARY KEY AUTOINCREMENT, scope TEXT NOT NULL, target_id TEXT NOT NULL,
      body TEXT NOT NULL, created_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS question (
      id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT NOT NULL, concept_ids TEXT NOT NULL DEFAULT '[]',
      raised_from TEXT, status TEXT NOT NULL DEFAULT 'open', answer TEXT,
      raised_at INTEGER NOT NULL, resolved_at INTEGER);
    CREATE TABLE IF NOT EXISTS reflection (
      id INTEGER PRIMARY KEY AUTOINCREMENT, module_id TEXT NOT NULL, prompt TEXT NOT NULL,
      body TEXT NOT NULL, written_at INTEGER NOT NULL);
    CREATE INDEX IF NOT EXISTS idx_due ON review_state(due);
    CREATE INDEX IF NOT EXISTS idx_attempt_practice ON practice_attempt(practice_id);
    DROP TABLE IF EXISTS lesson_progress;
    DROP TABLE IF EXISTS content_version;
  `);
  _db = drizzle(sqlite, { schema });
  return _db;
}

export const STATE_PATH = FILE;
