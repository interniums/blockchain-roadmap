import { emptyState, review, applyCredit, ancestorsWithDepth, creditFactor, Rating } from '../src/lib/state/scheduler';
import { graph } from '../src/lib/content/load';

let fail = 0;
const t = (name: string, cond: boolean, extra = '') => {
  if (!cond) { fail++; console.log(`  FAIL  ${name} ${extra}`); }
  else console.log(`  ok    ${name} ${extra}`);
};
const D = (d: number) => new Date(Date.UTC(2026, 7, 25) + d * 86400000);

console.log('--- direct review ---');
let s = emptyState('x', D(0));
t('fresh card has 0 reps', s.reps === 0);
s = review(s, Rating.Good, D(0));
t('review increments reps', s.reps === 1);
t('review sets stability > 0', s.stability > 0, `(${s.stability.toFixed(2)})`);
const afterFirst = s.due.getTime();

console.log('\n--- prerequisite credit ---');
const anc = review(emptyState('anc', D(0)), Rating.Good, D(0));
const before = { stab: anc.stability, due: anc.due.getTime(), reps: anc.reps };
const credited = applyCredit(anc, 1, Rating.Good, D(1));
t('credit does NOT increment reps', credited.reps === before.reps, `(${credited.reps})`);
t('credit increases stability', credited.stability > before.stab, `(${before.stab.toFixed(2)} -> ${credited.stability.toFixed(2)})`);
t('credit pushes due out', credited.due.getTime() > before.due);
t('creditedStability tracks the gain', credited.creditedStability > 0, `(${credited.creditedStability.toFixed(2)})`);

console.log('\n--- credit decays with depth, and never beats a real review ---');
const d1 = creditFactor(1, Rating.Good), d2 = creditFactor(2, Rating.Good);
t('depth 2 credit < depth 1', d2 < d1, `(${d1} vs ${d2})`);
t('depth 1 credit < 1.0 (never a full rep)', d1 < 1, `(${d1})`);
t('Again grade credits nothing', creditFactor(1, Rating.Again) === 0);

console.log('\n--- never credit an unstudied concept ---');
const never = emptyState('never', D(0));
t('unstudied concept is untouched by credit', applyCredit(never, 1, Rating.Good, D(1)) === never);

console.log('\n--- ancestors over the REAL graph ---');
const g = graph();
const edgesOf = (id: string) => (g.conceptById.get(id)?.edges ?? []).map(e => ({ to: e.to, type: e.type as string }));
const target = 'delegation-designator';
const a = ancestorsWithDepth(target, edgesOf);
t('finds ancestors for a real concept', a.size > 0, `(${a.size} for ${target})`);
t('all depths within cap', [...a.values()].every(d => d >= 1 && d <= 2));
t('does not include itself', !a.has(target));

let widest = { id: '', n: 0 };
for (const id of g.conceptById.keys()) {
  const n = ancestorsWithDepth(id, edgesOf).size;
  if (n > widest.n) widest = { id, n };
}
console.log(`  info  widest ancestor set: ${widest.id} -> ${widest.n} concepts credited per review`);
t('widest set is bounded (no runaway)', widest.n < 200, `(${widest.n})`);

console.log(`\n${fail === 0 ? 'ALL PASS' : fail + ' FAILURES'}`);
process.exit(fail ? 1 : 0);
