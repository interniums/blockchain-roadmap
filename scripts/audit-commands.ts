import { parseAcceptanceCommand, UnsafeCommand } from '../src/lib/runner/safety';
import { graph } from '../src/lib/content/load';
const g = graph();
let ok = 0; const bad: [string, string, string][] = [];
for (const [id, p] of g.practiceById) {
  const cmd = p.acceptance?.command;
  if (!cmd) { bad.push([id, '(none)', 'no acceptance command']); continue; }
  try { parseAcceptanceCommand(cmd); ok++; }
  catch (e) { bad.push([id, cmd, e instanceof UnsafeCommand ? e.message : String(e)]); }
}
console.log(`parse cleanly: ${ok} / ${g.practiceById.size}`);
console.log(`rejected:      ${bad.length}`);
const byReason = new Map<string, number>();
for (const [, , r] of bad) { const k = r.replace(/:.*/, ''); byReason.set(k, (byReason.get(k) ?? 0) + 1); }
for (const [r, n] of [...byReason].sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(4)}  ${r}`);
console.log();
for (const [id, cmd, r] of bad.slice(0, 12)) console.log(`  ${id}\n     cmd: ${cmd}\n     ${r}\n`);
