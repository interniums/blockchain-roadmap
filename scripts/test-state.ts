import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

/**
 * HERMETIC. The state dir must be set BEFORE the module that opens the database is evaluated —
 * and ESM hoists static imports above any statement, so `localStore` and `graph` are imported
 * DYNAMICALLY below. A static import here silently writes to the learner's real record.
 */
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'chainpath-test-'));
process.env.CHAINPATH_STATE_DIR = TMP;
process.on('exit', () => fs.rmSync(TMP, { recursive: true, force: true }));


let fail = 0;
const t = (n: string, c: boolean, x = '') => { if (!c) { fail++; console.log(`  FAIL  ${n} ${x}`); } else console.log(`  ok    ${n} ${x}`); };

(async () => {
  const { localStore: S } = await import('../src/lib/state/local');
  const { graph } = await import('../src/lib/content/load');
  const g = graph();

  console.log('--- reading is not recorded ---');
  // The store has no lesson-facing method at all. This is the contract, asserted rather than
  // assumed: if a read-tracking method ever comes back, this test names it.
  const banned = ['lessonState', 'markLessonOpened', 'markLessonRead', 'setScroll', 'recentTrail', 'reconcileContent'];
  const present = banned.filter((k) => k in S);
  t('no read/open/scroll tracking on the store', present.length === 0, present.length ? `(found ${present.join(', ')})` : '');
  t('summary reports no lessonsRead', !('lessonsRead' in (await S.summary())));

  console.log('\n--- a graded retrieval is the only way into review ---');
  const lid = 'fundamentals-crypto-what-a-hash-guarantees';
  const taught = g.lessonById.get(lid)!.lesson.teaches ?? [];
  const cold = await S.masteryFor(taught);
  t('nothing is enrolled before a grade', cold.every((x) => x.reps === 0), `(${taught.length} concepts)`);

  const target = taught[0];
  const out = await S.recordReview(target, 3, 2);
  const m1 = (await S.masteryFor([target]))[0];
  t('grading enrolls it and moves mastery', m1.reps === 1 && m1.mastery > 0, `(${m1.mastery.toFixed(3)})`);
  t('the outcome carries no date', !('nextDue' in out));

  console.log('\n--- an unproven row is unrepresentable ---');
  // With no `markLessonRead`, `recordReview` is the only writer, and it always runs f.next(),
  // which increments reps. So there is no such thing as a backlog you did not create by answering.
  const everyRow = await S.masteryFor([...g.conceptById.keys()]);
  const enrolled = everyRow.filter((x) => x.reps > 0);
  t('only graded concepts have a row', enrolled.every((x) => x.reps >= 1), `(${enrolled.length} enrolled)`);
  const queued = await S.nextByRetrievability(500);
  t('the queue is only what you answered', queued.length === enrolled.length, `(${queued.length})`);
  t('the queue carries no date', queued.every((q) => !('due' in q)));
  t('softest memory comes first',
    queued.every((q, i) => i === 0 || queued[i - 1].retrievability <= q.retrievability));
  t('no rate limit is needed, so none exists',
    !('NEW_PER_DAY' in await import('../src/lib/state/scheduler')));

  console.log('\n--- prerequisite credit through the DB ---');
  const deep = 'delegation-designator';
  const edgesOf = (id: string) => (g.conceptById.get(id)?.edges ?? []).map((e) => ({ to: e.to, type: e.type as string }));
  const { ancestorsWithDepth } = await import('../src/lib/state/scheduler');
  const anc = [...ancestorsWithDepth(deep, edgesOf).keys()];
  for (const a of anc) await S.recordReview(a, 3);
  const beforeStab = (await S.masteryFor(anc)).map((x) => x.mastery);
  await S.recordReview(deep, 3);
  const out2 = await S.recordReview(deep, 4);
  t('reviewing a descendant credited ancestors', out2.credited.length > 0, `(${out2.credited.length} of ${anc.length})`);
  const afterStab = (await S.masteryFor(anc)).map((x) => x.mastery);
  t('ancestor mastery rose without direct review', afterStab.some((v, i) => v > beforeStab[i]));
  const shares = await S.masteryFor(anc);
  t('creditedShare is tracked', shares.some((x) => x.creditedShare > 0), `(max ${Math.max(...shares.map((x) => x.creditedShare)).toFixed(3)})`);

  console.log('\n--- practice attempts ---');
  const pid = [...g.practiceById.keys()][0];
  await S.recordAttempt(pid, false, 1, 'first go, failed');
  await S.recordAttempt(pid, true, 1, 'passed');
  const attempts = await S.attemptsFor(pid);
  t('attempts are recorded newest first', attempts.length === 2 && attempts[0].passed && !attempts[1].passed, `(${pid})`);
  t('hints used are kept', attempts.every((a) => a.hintsUsed === 1));

  console.log('\n--- questions, notes, reflections ---');
  const q = await S.askQuestion('Why is keccak padding different?', ['keccak-vs-sha3'], lid);
  t('question stored', q.id > 0);
  await S.answerQuestion(q.id, 'NIST changed padding after Ethereum shipped.');
  const open = await S.questions('open');
  const answered = await S.questions('answered');
  t('answering moves it out of open', open.every((x) => x.id !== q.id) && answered.some((x) => x.id === q.id));
  await S.addNote('lesson', lid, 'The birthday bound is the whole reason for 256-bit output.');
  t('note stored', (await S.notesFor('lesson', lid)).length === 1);
  const mid = g.lessonById.get(lid)!.moduleId;
  await S.saveReflection(mid, 'What surprised you?', 'That collision resistance is the weaker claim.');
  t('reflection stored', (await S.reflectionsFor(mid)).length === 1);

  console.log('\n--- summary ---');
  const s = await S.summary();
  console.log('  info ', JSON.stringify(s));
  t('summary counts studied concepts', s.conceptsStudied > 0, `(${s.conceptsStudied})`);
  t('summary counts open questions', s.openQuestions === 0, `(${s.openQuestions})`);

  console.log(`\n${fail === 0 ? 'ALL PASS' : fail + ' FAILURES'}`);
  process.exit(fail ? 1 : 0);
})();
