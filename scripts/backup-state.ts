/**
 * Plan §17: state.db holds years of reflections, answered questions and mastery history, is
 * deliberately not in git, and is therefore the ONE irreplaceable artifact with no redundancy.
 * This exports it to JSON that IS committed. Runs on every content build.
 */
import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';

const DB = path.join(process.cwd(), '.chainpath', 'state.db');
const OUT = path.join(process.cwd(), 'content', 'state-backup');

const TABLES = ['review_state', 'review_log', 'practice_attempt', 'note', 'question', 'reflection'];

if (!fs.existsSync(DB)) {
  console.log('no state.db yet — nothing to back up');
  process.exit(0);
}
fs.mkdirSync(OUT, { recursive: true });
const db = new Database(DB, { readonly: true });
const dump: Record<string, unknown[]> = {};
let rows = 0;
for (const t of TABLES) {
  try {
    const r = db.prepare(`SELECT * FROM ${t}`).all();
    dump[t] = r; rows += r.length;
  } catch { dump[t] = []; }
}
// Stable key order so the committed file diffs cleanly instead of churning every run.
const file = path.join(OUT, 'state.json');
fs.writeFileSync(file, JSON.stringify(dump, Object.keys(dump).sort(), 2) + '\n');
console.log(`backed up ${rows} rows across ${TABLES.length} tables -> ${path.relative(process.cwd(), file)}`);
