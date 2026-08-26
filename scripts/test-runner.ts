import fs from 'node:fs';
import path from 'node:path';
import { runCheck, parseJUnit } from '../src/lib/runner/run';

/**
 * HERMETIC: this test must not depend on whatever repo the user happens to have configured.
 * It points config at the in-repo practice-repo for the duration, then restores the original.
 */
const CFG = path.join(process.cwd(), '.chainpath', 'config.json');
const FIXTURE = path.join(process.cwd(), 'practice-repo');
let saved: string | null = null;
try { saved = fs.readFileSync(CFG, 'utf8'); } catch { saved = null; }
fs.mkdirSync(path.dirname(CFG), { recursive: true });
fs.writeFileSync(CFG, JSON.stringify({ ...(saved ? JSON.parse(saved) : {}), practiceRepo: FIXTURE }, null, 2));
const restore = () => { if (saved !== null) fs.writeFileSync(CFG, saved); else fs.rmSync(CFG, { force: true }); };
process.on('exit', restore);

let fail = 0;
const ok = (n: string, c: boolean, x = '') => { if (!c) { fail++; console.log(`  FAIL  ${n} ${x}`); } else console.log(`  ok    ${n} ${x}`); };

(async () => {
  console.log('--- JUnit parsing ---');
  const xml = `<testsuites><testsuite name="A"><testcase name="test_ok" classname="A" time="0.01"/>
    <testcase name="test_bad" classname="A" time="0.02"><failure message="assertion failed: 1 != 2"/></testcase></testsuite></testsuites>`;
  const cs = parseJUnit(xml);
  ok('parses both cases', cs.length === 2);
  ok('detects pass', cs[0].passed === true);
  ok('detects failure', cs[1].passed === false);
  ok('captures failure message', (cs[1].failure ?? '').includes('1 != 2'), `(${cs[1].failure})`);

  console.log('\n--- real forge run against a real repo ---');
  const r = await runCheck('forge test --match-path test/MerkleForgery.t.sol');
  // The starter exercises are deliberately unsolved, so 'failed' is the CORRECT outcome here.
  ok('ran and produced a verdict', r.outcome === 'failed' || r.outcome === 'passed', `(${r.outcome}${r.reason ? ': ' + r.reason : ''})`);
  ok('parsed real test cases', r.cases.length > 0, `(${r.cases.length} cases, ${r.passed} passed)`);
  ok('failures carry a message', r.cases.filter(c => !c.passed).every(c => (c.failure ?? '').length > 0));
  ok('recorded a duration', r.durationMs > 0, `(${r.durationMs}ms)`);

  console.log('\n--- a genuinely failing test is "failed", not "could-not-run" ---');
  const f = await runCheck('forge test --match-path test/DoesNotExist.t.sol');
  ok('missing path is could-not-run, not failed', f.outcome === 'could-not-run', `(${f.outcome}: ${f.reason})`);

  console.log('\n--- refusal path ---');
  const bad = await runCheck('forge test; rm -rf /');
  ok('injection refused, not executed', bad.outcome === 'refused', `(${bad.reason})`);
  ok('refusal produced no cases', bad.cases.length === 0);

  console.log(`\n${fail === 0 ? 'ALL PASS' : fail + ' FAILURES'}`);
  process.exit(fail ? 1 : 0);
})();
