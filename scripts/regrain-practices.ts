/**
 * One-shot: write `grain` into every practice file, and promote one per module to the capstone.
 *
 * The 236 authored practices are all block-sized — measured, not assumed: their concept sets span
 * 1 lesson 22 times, 2 lessons 106 times, 3 lessons 87 times, 4 lessons 20 times and 5 once. So
 * `grain: block` is the default and the interesting decision is which one is the module's capstone.
 *
 * The rule: the module's hardest practice, by authored difficulty, breaking ties by how much of the
 * module's `teaches` set it covers, then by id so the result is deterministic. It is written into
 * the YAML rather than derived at load time because it is a judgement about the content, and a
 * judgement belongs somewhere a human can read and override it.
 *
 * Idempotent — running it twice changes nothing.
 */
import fs from 'node:fs';
import path from 'node:path';
import { allTracks, getModulesOf, getPracticesOf } from '../src/lib/content/load';

const DIR = path.join(process.cwd(), 'content', 'practices');
const apply = !process.argv.includes('--dry');

let promoted = 0, blocks = 0, touched = 0, needCapstone = 0;
const missing: string[] = [];

for (const t of allTracks()) {
  for (const m of getModulesOf(t.id)) {
    const ps = getPracticesOf(m.id);
    if (ps.length === 0) { missing.push(m.id); continue; }

    // An exit project is hand-authored at track grain and lives in its track's last module. It must
    // never be re-graded as that module's capstone, or re-running this clobbers all six.
    const gradable = ps.filter((p) => p.grain !== 'exit');
    if (gradable.length === 0) continue;

    const teaches = new Set(m.teaches ?? []);
    const score = (p: typeof ps[number]) => (p.concepts ?? []).filter((c) => teaches.has(c)).length;
    const ranked = [...gradable].sort((a, b) =>
      (b.difficulty ?? 0) - (a.difficulty ?? 0)
      || score(b) - score(a)
      || a.id.localeCompare(b.id));

    // Only a genuinely hard practice earns the capstone slot. A module whose hardest exercise is a
    // 2 or a 3 does not have a capstone yet — it has a gap, and saying so is the point.
    const top = ranked[0];
    const capstone = (top.difficulty ?? 0) >= 4 ? top : null;
    if (!capstone) needCapstone++;

    for (const p of gradable) {
      const file = path.join(DIR, `${p.id}.yaml`);
      if (!fs.existsSync(file)) { console.log(`  MISSING FILE ${p.id}`); continue; }
      const isCapstone = capstone?.id === p.id || p.grain === 'module';
      const grain = isCapstone ? 'module' : 'block';
      if (isCapstone) promoted++; else blocks++;

      let src = fs.readFileSync(file, 'utf8');
      const alreadyGrained = new RegExp(`^grain: ${grain}$`, 'm').test(src);
      const needsFill = isCapstone
        && (!/^coversConcepts:/m.test(src) || (Boolean(m.reflectionPrompt) && !/^writeUp:/m.test(src)));
      if (alreadyGrained && !needsFill) continue;

      src = src.replace(/^grain: .*\n/m, '');
      // After `moduleId:`, so the file reads id / module / grain — narrowest to widest.
      src = src.replace(/^(moduleId: .*\n)/m, `$1grain: ${grain}\n`);

      // A hand-authored capstone already declares `grain: module`, so it lands here on the same
      // path as a promoted one and gets coversConcepts and writeUp filled the same way. That is
      // deliberate: those two fields are mechanical — the module's teaches set verbatim, and its
      // existing reflectionPrompt — and duplicating them by hand is how they drift.
      if (isCapstone) {
        src = src.replace(/^coversConcepts:.*(\n( +.*|)\n?)*/m, '');
        const covers = [...teaches];
        if (covers.length) {
          const block = `coversConcepts:\n${covers.map((c) => `  - ${c}`).join('\n')}\n`;
          src = src.replace(/^(grain: module\n)/m, `$1${block}`);
        }
        if (m.reflectionPrompt) {
          src = src.replace(/^writeUp: [\s\S]*?(?=^\w|\Z)/m, '');
          const prompt = m.reflectionPrompt.trim().replace(/\s+/g, ' ');
          src = src.replace(/^(grain: module\n)/m, `$1writeUp: >\n  ${prompt}\n`);
        }
      }
      if (apply) fs.writeFileSync(file, src);
      touched++;
    }
  }
}

console.log(`${apply ? 'wrote' : 'would write'} ${touched} files`);
console.log(`  grain: module  ${promoted}`);
console.log(`  grain: block   ${blocks}`);
console.log(`modules with no d4/d5 to promote (capstone must be authored): ${needCapstone}`);
console.log(`modules with no practices at all: ${missing.length ? missing.join(', ') : 'none'}`);
