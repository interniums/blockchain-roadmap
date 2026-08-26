import { sqliteTable, text, integer, real, primaryKey } from 'drizzle-orm/sqlite-core';

/**
 * All learner state. Never committed to git — see plan §17, backed up as JSON on every content build.
 * Keyed by content ids, which are immutable by contract (renames are formerIds, never edits).
 */

export const reviewState = sqliteTable('review_state', {
  conceptId: text('concept_id').primaryKey(),
  due: integer('due', { mode: 'timestamp_ms' }).notNull(),
  stability: real('stability').notNull(),
  difficulty: real('difficulty').notNull(),
  elapsedDays: real('elapsed_days').notNull().default(0),
  scheduledDays: real('scheduled_days').notNull().default(0),
  reps: integer('reps').notNull().default(0),
  lapses: integer('lapses').notNull().default(0),
  learningSteps: integer('learning_steps').notNull().default(0),
  state: integer('state').notNull().default(0),
  lastReview: integer('last_review', { mode: 'timestamp_ms' }),
  /** how much of this concept's stability came from prerequisite credit rather than direct review */
  creditedStability: real('credited_stability').notNull().default(0),
});

export const reviewLog = sqliteTable('review_log', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  conceptId: text('concept_id').notNull(),
  rating: integer('rating').notNull(),
  confidence: integer('confidence'),
  /** true when the learner was confident AND wrong — the dangerous case */
  confidentlyWrong: integer('confidently_wrong', { mode: 'boolean' }).notNull().default(false),
  reviewedAt: integer('reviewed_at', { mode: 'timestamp_ms' }).notNull(),
  /** null for a direct review; the descendant concept id when this was prerequisite credit */
  creditedFrom: text('credited_from'),
});

export const lessonProgress = sqliteTable('lesson_progress', {
  lessonId: text('lesson_id').primaryKey(),
  status: text('status').notNull().default('unread'), // unread | reading | read
  scrollPct: real('scroll_pct').notNull().default(0),
  lastOpenedAt: integer('last_opened_at', { mode: 'timestamp_ms' }),
  completedAt: integer('completed_at', { mode: 'timestamp_ms' }),
  checksSkipped: integer('checks_skipped').notNull().default(0),
});

export const practiceAttempt = sqliteTable('practice_attempt', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  practiceId: text('practice_id').notNull(),
  attemptedAt: integer('attempted_at', { mode: 'timestamp_ms' }).notNull(),
  passed: integer('passed', { mode: 'boolean' }).notNull(),
  hintsUsed: integer('hints_used').notNull().default(0),
  output: text('output'),
});

export const note = sqliteTable('note', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  scope: text('scope').notNull(),      // lesson | module | concept
  targetId: text('target_id').notNull(),
  body: text('body').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
});

export const question = sqliteTable('question', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  text: text('text').notNull(),
  conceptIds: text('concept_ids').notNull().default('[]'),
  raisedFrom: text('raised_from'),
  status: text('status').notNull().default('open'),  // open | answered | parked
  answer: text('answer'),
  raisedAt: integer('raised_at', { mode: 'timestamp_ms' }).notNull(),
  resolvedAt: integer('resolved_at', { mode: 'timestamp_ms' }),
});

export const reflection = sqliteTable('reflection', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  moduleId: text('module_id').notNull(),
  prompt: text('prompt').notNull(),
  body: text('body').notNull(),
  writtenAt: integer('written_at', { mode: 'timestamp_ms' }).notNull(),
});

export const contentVersion = sqliteTable('content_version', {
  lessonId: text('lesson_id').notNull(),
  contentHash: text('content_hash').notNull(),
  seenAt: integer('seen_at', { mode: 'timestamp_ms' }).notNull(),
}, (t) => [primaryKey({ columns: [t.lessonId, t.contentHash] })]);
