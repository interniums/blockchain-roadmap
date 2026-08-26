import 'server-only';
import { spawn } from 'node:child_process';
import { TOOLS, type ToolSpec } from './tools';

/**
 * Toolchain doctor.
 *
 * Same rule as the practice runner (plan §17): argv array, `shell: false`, a fixed roster from
 * tools.ts, a timeout on every spawn and an output cap. The only difference is that these
 * invocations do not touch the practice repo at all — they run with the app's own cwd, because
 * "is forge on PATH" must be answerable before a repo is configured.
 */

const PROBE_TIMEOUT_MS = 5_000;
const MAX_OUTPUT = 8_000;

export interface ToolProbe extends ToolSpec {
  /** the process started — i.e. the binary is on PATH */
  present: boolean;
  /** first line of its answer, trimmed */
  version: string | null;
  /** why it is not present, or what was odd about the answer */
  note?: string;
  durationMs: number;
}

function probe(spec: ToolSpec): Promise<ToolProbe> {
  const started = Date.now();
  return new Promise<ToolProbe>((resolve) => {
    let out = '';
    let err = '';
    let done = false;

    const finish = (r: { present: boolean; version: string | null; note?: string }) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      resolve({ ...spec, ...r, durationMs: Date.now() - started });
    };

    let child;
    try {
      child = spawn(spec.bin, [...spec.argv], {
        shell: false,
        env: { ...process.env, NO_COLOR: '1' },
        stdio: ['ignore', 'pipe', 'pipe'],
      });
    } catch (e) {
      finish({ present: false, version: null, note: e instanceof Error ? e.message : String(e) });
      return;
    }

    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      finish({ present: false, version: null, note: `no answer within ${PROBE_TIMEOUT_MS / 1000}s — killed` });
    }, PROBE_TIMEOUT_MS);

    child.stdout?.on('data', (d) => { if (out.length < MAX_OUTPUT) out += String(d); });
    child.stderr?.on('data', (d) => { if (err.length < MAX_OUTPUT) err += String(d); });

    child.on('error', (e) => finish({
      present: false,
      version: null,
      note: /ENOENT/.test(e.message) ? 'not on PATH' : e.message,
    }));

    child.on('close', (code) => {
      const line = `${out}\n${err}`.split('\n').map((s) => s.trim()).filter(Boolean)[0] ?? '';
      // The process started, so the binary exists whatever it then decided to exit with.
      finish({
        present: true,
        version: line ? line.slice(0, 140) : null,
        note: code === 0 ? undefined : `exited ${code} — installed, but the version probe was unhappy`,
      });
    });
  });
}

export interface DoctorReport {
  probes: ToolProbe[];
  missing: string[];
  durationMs: number;
}

/** Probe the whole roster in parallel. Never throws — a missing tool is a value, not an error. */
export async function runDoctor(): Promise<DoctorReport> {
  const started = Date.now();
  const probes = await Promise.all(TOOLS.map(probe));
  return {
    probes,
    missing: probes.filter((p) => !p.present).map((p) => p.bin),
    durationMs: Date.now() - started,
  };
}
