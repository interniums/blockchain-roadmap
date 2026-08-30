import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

/**
 * HERMETIC — same rule as test-state: the state dir must be set before the module that opens the
 * database is evaluated, so every import below is dynamic.
 */
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'chainpath-gate-'));
process.env.CHAINPATH_STATE_DIR = TMP;
process.on('exit', () => fs.rmSync(TMP, { recursive: true, force: true }));

let fail = 0;
const t = (n: string, c: boolean, x = '') => { if (!c) { fail++; console.log(`  FAIL  ${n} ${x}`); } else console.log(`  ok    ${n} ${x}`); };

(async () => {
  const { localStore: S } = await import('../src/lib/state/local');
  const { readingOrder, getLesson, graph } = await import('../src/lib/content/load');
  const { gateFor, keyConceptsOf } = await import('../src/lib/content/gate');
  const g = graph();
  const order = readingOrder();

  // The gate's own predicate, exactly as the UI applies it: a lesson is open when every key
  // concept of every blocking reading has been answered.
  const open = (lessonId: string, answered: Set<string>) =>
    gateFor(lessonId).blockers.every((b) => b.keyConcepts.every((c) => answered.has(c)));

  console.log('--- the shape of the gate ---');
  const entries = order.filter((x) => gateFor(x.lessonId).blockers.length === 0);
  t('there are entry points', entries.length > 0, `(${entries.length} open at a cold start)`);
  t('every lesson contributes a key concept',
    order.every((x) => keyConceptsOf(x.lessonId).length > 0));
  t('no lesson gates on itself',
    order.every((x) => gateFor(x.lessonId).blockers.every((b) => b.lessonId !== x.lessonId)));

  const widths = order.map((x) => gateFor(x.lessonId).blockers.length);
  t('no lesson is a wall of prerequisites', Math.max(...widths) <= 6,
    `(max ${Math.max(...widths)} blocking readings)`);

  console.log('\n--- softAssumes never gates ---');
  // A softAssumes edge points forward in reading order, so gating on it would lock a lesson behind
  // content downstream of itself. R10/R12 keep the fields honest; this asserts the gate agrees.
  let softChecked = 0;
  for (const { lessonId } of order) {
    const soft = getLesson(lessonId)?.lesson.softAssumes ?? [];
    if (!soft.length) continue;
    softChecked++;
    const gatedOn = new Set(gateFor(lessonId).blockers.map((b) => b.conceptId));
    t(`  ${lessonId} does not gate on its softAssumes`, soft.every((c) => !gatedOn.has(c)));
  }
  t('softAssumes lessons were actually exercised', softChecked > 0, `(${softChecked} lessons)`);

  console.log('\n--- nothing is permanently locked ---');
  const complete = new Set<string>();
  let rounds = 0, changed = true;
  while (changed) {
    changed = false; rounds++;
    for (const { lessonId } of order) {
      if (complete.has(lessonId)) continue;
      if (open(lessonId, new Set())) { /* entry point: nothing to answer */ }
      if (gateFor(lessonId).blockers.every((b) => complete.has(b.lessonId))) {
        complete.add(lessonId); changed = true;
      }
    }
  }
  t('every lesson is reachable', complete.size === order.length,
    `(${complete.size} of ${order.length} in ${rounds} rounds)`);

  console.log('\n--- grading one check opens what it gates ---');
  // Find a lesson blocked by exactly one reading, so the causal chain is unambiguous.
  const target = order.find((x) => gateFor(x.lessonId).blockers.length === 1)!;
  const blocker = gateFor(target.lessonId).blockers[0];
  console.log(`  info  ${target.lessonId}`);
  console.log(`  info  gated by ${blocker.lessonId} via ${blocker.keyConcepts.join(', ')}`);

  const readState = async () => {
    const rows = await S.masteryFor(gateFor(target.lessonId).watch);
    return new Set(rows.filter((r) => r.reps > 0).map((r) => r.conceptId));
  };

  t('locked before anything is answered', !open(target.lessonId, await readState()));

  // Grade every check of the blocking lesson — "Again", the worst possible grade.
  for (const c of blocker.keyConcepts) await S.recordReview(c, 1);
  t('open after grading the blocker, even graded Again', open(target.lessonId, await readState()));

  console.log('\n--- the gate is monotone ---');
  // A second, worse pass must not re-close it. Nothing this app records can take access away.
  for (const c of blocker.keyConcepts) await S.recordReview(c, 1);
  t('a failed re-review does not re-lock it', open(target.lessonId, await readState()));

  console.log('\n--- the entry points need nothing ---');
  const entry = entries[0];
  t('an entry point is open on a blank record', open(entry.lessonId, new Set()),
    `(${entry.lessonId})`);

  console.log('\n--- every blocker names a real, reachable reading ---');
  let bad = 0;
  for (const { lessonId } of order) {
    for (const b of gateFor(lessonId).blockers) {
      if (!g.lessonById.has(b.lessonId) || !b.lessonHref || b.keyConcepts.length === 0) bad++;
    }
  }
  t('no blocker is a door with no key', bad === 0, bad ? `(${bad} broken)` : '');

  console.log(`\n${fail === 0 ? 'ALL PASS' : fail + ' FAILURES'}`);
  process.exit(fail ? 1 : 0);
})();
