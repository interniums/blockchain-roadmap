#!/usr/bin/env python3
"""
Link checker for the source library.

A status code alone is NOT proof a source is alive. Real failures found in this repo:
  - docs.makerdao.com returns 200 for every path while redirecting to another host's HOMEPAGE
  - some SPA docs hosts serve 200 shells for paths that do not exist
So this checks the FINAL url too: a redirect that lands on a bare "/" or on a different host is
treated as dead, because the cited page is gone even though something answered.
"""
import glob, re, sys, subprocess, urllib.parse, concurrent.futures, collections
import yaml

def wayback_ok(url):
    """web.archive.org is blocked or throttled from some networks (it returns 000 here) while the
    snapshot is perfectly fine. Ask the availability API — which IS reachable — instead of guessing."""
    m = re.search(r'web\.archive\.org/web/\d+/(https?://.+)$', url)
    if not m: return None
    target = re.sub(r'^https?://', '', m.group(1))   # the API 429s on a scheme-qualified url
    try:
        out = subprocess.run(['curl', '-s', '--max-time', '25',
                              f'https://archive.org/wayback/available?url={target}'],
                             capture_output=True, text=True, timeout=35).stdout
    except Exception:
        return None
    if '"available": true' in out or '"available":true' in out:
        return True
    # A rate limit or an HTML error page is NOT evidence the snapshot is gone.
    if '429' in out or '<html' in out.lower() or not out.strip():
        return None
    return False

def probe(item):
    sid, url = item
    try:
        out = subprocess.run(
            ['curl', '-sSL', '-o', '/dev/null', '-w', '%{http_code} %{url_effective}',
             '--max-time', '20', '-A', 'Mozilla/5.0 (chainpath link check)', url],
            capture_output=True, text=True, timeout=30).stdout.split(None, 1)
    except Exception as e:
        return sid, url, 'ERR', str(e)[:60], 'dead'
    code = out[0] if out else '000'
    if code == '000':
        wb = wayback_ok(url)
        if wb is True:  return sid, url, 'wayback', url, 'ok'
        if wb is False: return sid, url, 'wayback', url, 'dead'
        # host unreachable from here — that is not evidence the resource is gone
        return sid, url, code, out[1].strip() if len(out) > 1 else url, 'unverifiable'
    final = out[1].strip() if len(out) > 1 else url
    o, f = urllib.parse.urlparse(url), urllib.parse.urlparse(final)
    # 403/429/503 are bot-challenge and rate-limit signals, NOT missing resources. Folding them into
    # 'dead' produced five false positives that render fine in a real browser. They go to human review.
    if code in ('403', '429', '503'):       return sid, url, code, final, 'blocked'
    if not code.startswith('2'):            return sid, url, code, final, 'dead'
    # landed on a bare homepage when we asked for a real path
    if o.path.strip('/') and not f.path.strip('/'):
        return sid, url, code, final, 'soft404-homepage'
    # landed on a different site entirely
    if o.netloc.replace('www.', '') != f.netloc.replace('www.', ''):
        return sid, url, code, final, 'redirected-offsite'
    return sid, url, code, final, 'ok'

srcs = {}
local = {}
for fp in glob.glob('content/sources/*.yaml'):
    d = yaml.safe_load(open(fp, encoding='utf-8')) or {}
    for s in d.get('sources') or []:
        if not s.get('id') or not s.get('url'):
            continue
        # A repo-local citation (e.g. constants measured on this machine) has no URL to check.
        # It is a legitimate source; inventing an external one would be worse.
        if s.get('internal') or not str(s['url']).startswith('http'):
            local[s['id']] = s['url']
            continue
        srcs[s['id']] = s['url']

print(f'checking {len(srcs)} sources ({len(local)} repo-local, skipped)...\n')
results = []
with concurrent.futures.ThreadPoolExecutor(max_workers=16) as ex:
    for r in ex.map(probe, srcs.items()):
        results.append(r)

by = collections.Counter(r[4] for r in results)
for k, n in by.most_common():
    print(f'  {n:5d}  {k}')
bad = [r for r in results if r[4] not in ('ok', 'blocked', 'unverifiable')]
if bad:
    print(f'\n{len(bad)} need attention:\n')
    for sid, url, code, final, why in sorted(bad, key=lambda x: x[4]):
        print(f'  [{why}] {sid}')
        print(f'      {url}')
        print(f'   -> {final}  ({code})\n')
unver = [r for r in results if r[4] == 'unverifiable']
if unver:
    print(f'\n{len(unver)} unverifiable from this network (host unreachable, NOT evidence of removal):')
    for sid, url, *_ in unver: print(f'  {sid}  {url}')

blocked = [r for r in results if r[4] == 'blocked']
if blocked:
    print(f'{len(blocked)} blocked by bot protection (not necessarily dead):')
    for sid, url, *_ in blocked: print(f'  {sid}  {url}')
sys.exit(1 if bad else 0)
