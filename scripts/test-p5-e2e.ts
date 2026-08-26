import { graph } from '../src/lib/content/load';
import { classifyAcceptance } from '../src/lib/runner/safety';
import { runCheck } from '../src/lib/runner/run';

(async () => {
  const g = graph();
  const ids = [...g.practiceById.keys()].filter((id) => {
    const p = g.practiceById.get(id)!;
    return g.moduleById.get(p.moduleId)?.trackId === 'fundamentals'
      && classifyAcceptance(p.acceptance?.command).tier === 'runnable';
  });
  console.log(`runnable Track 01 practices: ${ids.length}\n`);
  for (const id of ids) {
    const p = g.practiceById.get(id)!;
    const cmd = p.acceptance!.command!;
    const r = await runCheck(cmd);
    const detail = r.outcome === 'passed' || r.outcome === 'failed'
      ? `${r.passed}/${r.cases.length} passed, ${r.durationMs}ms`
      : (r.reason ?? '');
    console.log(`  ${r.outcome.toUpperCase().padEnd(14)} ${id}`);
    console.log(`    cmd: ${cmd}`);
    console.log(`    ${detail}`);
    if (r.outcome === 'failed' && r.cases.length) {
      const f = r.cases.find((c) => !c.passed)!;
      console.log(`    first failure: ${f.name} — ${(f.failure ?? '').slice(0, 100)}`);
    }
    console.log();
  }
})();
