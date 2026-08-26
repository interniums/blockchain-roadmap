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
  console.log('--- lesson read introduces concepts ---');
  const lid = 'fundamentals-crypto-what-a-hash-guarantees';
  const l = g.lessonById.get(lid)!;
  const taught = l.lesson.teaches ?? [];
  await S.markLessonRead(lid, taught);
  const st = (await S.lessonState([lid]))[0];
  t('lesson marked read', st.status === 'read');
  const m0 = await S.masteryFor(taught);
  t('concepts entered the system', m0.length === taught.length, `(${taught.length})`);
  t('but unproven — mastery 0', m0.every((x) => x.mastery === 0));

  console.log('\n--- direct review moves mastery ---');
  const target = taught[0];
  const out = await S.recordReview(target, 3, 2);
  const m1 = (await S.masteryFor([target]))[0];
  t('mastery rose after review', m1.mastery > 0, `(${m1.mastery.toFixed(3)})`);
  t('due is in the future', out.nextDue > Date.now());

  console.log('\n--- prerequisite credit through the DB ---');
  // find a studied concept with studied ancestors
  const deep = 'delegation-designator';
  const edgesOf = (id: string) => (g.conceptById.get(id)?.edges ?? []).map((e) => ({ to: e.to, type: e.type as string }));
  const { ancestorsWithDepth } = await import('../src/lib/state/scheduler');
  const anc = [...ancestorsWithDepth(deep, edgesOf).keys()];
  // study the ancestors first
  for (const a of anc) await S.recordReview(a, 3);
  const beforeStab = (await S.masteryFor(anc)).map((x) => x.mastery);
  await S.recordReview(deep, 3);
  const out2 = await S.recordReview(deep, 4);
  t('reviewing a descendant credited ancestors', out2.credited.length > 0, `(${out2.credited.length} of ${anc.length})`);
  const afterStab = (await S.masteryFor(anc)).map((x) => x.mastery);
  t('ancestor mastery rose without direct review', afterStab.some((v, i) => v > beforeStab[i]));
  const shares = await S.masteryFor(anc);
  t('creditedShare is tracked', shares.some((x) => x.creditedShare > 0), `(max ${Math.max(...shares.map(x=>x.creditedShare)).toFixed(3)})`);

  console.log('\n--- questions, notes, reflections ---');
  const q = await S.askQuestion('Why is keccak padding different?', ['keccak-vs-sha3'], lid);
  t('question stored', q.id > 0);
  await S.answerQuestion(q.id, 'NIST changed padding after Ethereum shipped.');
  const open = await S.questions('open');
  const answered = await S.questions('answered');
  t('answering moves it out of open', open.every((x) => x.id !== q.id) && answered.some((x) => x.id === q.id));
  await S.addNote('lesson', lid, 'The birthday bound is the whole reason for 256-bit output.');
  t('note stored', (await S.notesFor('lesson', lid)).length === 1);

  console.log('\n--- §17 content reconciliation ---');
  const rl = 'fundamentals-crypto-keccak-is-not-sha3';
  const rlTaught = (g.lessonById.get(rl)!.lesson.teaches ?? []);
  await S.markLessonRead(rl, rlTaught);
  for (const c of rlTaught) await S.recordReview(c, 3);
  const before = (await S.masteryFor(rlTaught)).map(x => x.mastery);
  const first = await S.reconcileContent(rl, 'hash-v1', 'corrective', rlTaught);
  t('first sighting is not a change', first.changed === false && first.reset.length === 0);
  const same = await S.reconcileContent(rl, 'hash-v1', 'corrective', rlTaught);
  t('same hash again is not a change', same.changed === false);
  const clarify = await S.reconcileContent(rl, 'hash-v2', 'clarifying', rlTaught);
  t('clarifying edit changes nothing', clarify.changed === true && clarify.reset.length === 0);
  const corrective = await S.reconcileContent(rl, 'hash-v3', 'corrective', rlTaught);
  t('corrective edit resets proven concepts', corrective.reset.length > 0, `(${corrective.reset.length})`);
  const after = (await S.masteryFor(rlTaught)).map(x => x.mastery);
  t('mastery actually dropped', after.some((v, i) => v < before[i]));
  const notes = await S.notesFor('lesson', rl);
  t('learner is TOLD why, not silently reset', notes.some(n => n.body.includes('corrected')));

  console.log('\n--- §17 new-concept rate limit ---');
  const { NEW_PER_DAY } = await import('../src/lib/state/scheduler');
  const big = [...g.conceptById.keys()].filter(id => !rlTaught.includes(id)).slice(0, NEW_PER_DAY * 2 + 5);
  await S.markLessonRead('synthetic-bulk-read', big);
  const dueNow = await S.dueConcepts(Date.now(), 500);
  const introduced = (await S.masteryFor(big)).filter(m => m.reps === 0);
  t('all were introduced', introduced.length === big.length, `(${introduced.length})`);
  const dueToday = introduced.filter(m => m.due !== null && m.due <= Date.now() + 1000).length;
  t('but not all due at once', dueToday < big.length, `(${dueToday} of ${big.length} due now, cap ${NEW_PER_DAY})`);
  void dueNow;

  console.log('\n--- summary ---');
  const s = await S.summary();
  console.log('  info ', JSON.stringify(s));
  t('summary counts studied concepts', s.conceptsStudied > 0);
  // three lessons are read by this suite: the crypto one, the reconciliation one, and the
  // synthetic bulk read used to exercise the rate limit.
  t('summary counts lessons read', s.lessonsRead === 3, `(${s.lessonsRead})`);

  console.log(`\n${fail === 0 ? 'ALL PASS' : fail + ' FAILURES'}`);
  process.exit(fail ? 1 : 0);
})();
