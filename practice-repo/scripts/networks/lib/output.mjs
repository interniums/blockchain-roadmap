/**
 * Writing the results file. Support code - not part of either exercise.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

export async function writeResult(outPath, payload) {
  const target = resolve(process.cwd(), outPath);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  return target;
}

/**
 * Both practices ask for a written conclusion, not only numbers. The measurement is only half of
 * the exercise, so an empty write-up leaves the run incomplete and says so.
 */
export function checkWriteUp(writeUp, what) {
  const text = String(writeUp ?? '').trim();
  if (text.length >= 120) return true;
  process.stderr.write(
    `\nIncomplete: the results were written, but WRITE_UP is empty or too short.\n` +
      `  ${what}\n` +
      `  Fill in the WRITE_UP constant at the top of the script and run it again.\n`,
  );
  process.exitCode = 1;
  return false;
}
