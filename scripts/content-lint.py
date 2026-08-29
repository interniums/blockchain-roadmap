#!/usr/bin/env python3
"""Chainpath content linter. Enforces the hard rules in content/SCHEMA.md."""
import sys, glob, os, collections, re
import yaml

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
C = lambda *p: os.path.join(ROOT, 'content', *p)
EDGE_TYPES = {'requires','recommends','deepens','contrasts','applies','supersedes'}
GOOD_TIERS = {'spec','canonical-docs'}
ALL_TIERS = GOOD_TIERS | {'primary-analysis','secondary'}

# Concurrency note: this linter reads the WHOLE repo. When many agents write in parallel and each
# runs it as a verification step, they observe each other's half-written files and report failures
# that do not exist once the run settles. CHAINPATH_LINT_SCOPE=<prefix> narrows the *error* surface
# to files an agent owns, so a parallel verification step is meaningful instead of noisy.
SCOPE = [x.strip() for x in os.environ.get('CHAINPATH_LINT_SCOPE', '').split(',') if x.strip()]

errors, warns = [], []
def err(c, m):
    # Out-of-scope problems are still reported, but as warnings — another agent may be mid-write.
    if SCOPE and not any(x in str(m) for x in SCOPE):
        warns.append((c + '-OUT-OF-SCOPE', m)); return
    errors.append((c, m))
def warn(c, m): warns.append((c, m))

def load(path):
    try:
        with open(path, encoding='utf-8') as f: return yaml.safe_load(f)
    except Exception as e:
        err('PARSE', f'{os.path.relpath(path, ROOT)}: {e}'); return None

tracks, modules, concepts, sources, practices = {}, {}, {}, {}, {}

for p in sorted(glob.glob(C('tracks','*.yaml'))):
    d = load(p)
    if d and d.get('id'): tracks[d['id']] = d
for p in sorted(glob.glob(C('modules','*.yaml'))):
    d = load(p)
    if d and d.get('id'): modules[d['id']] = d
for p in sorted(glob.glob(C('sources', '*.yaml'))):
    # An agent appending to an existing sources file once added a SECOND top-level `sources:` key.
    # PyYAML resolves that last-write-wins, silently discarding every entry under the first key —
    # 24 sources in that case. It parses cleanly, so nothing else would ever catch it.
    with open(p, encoding='utf-8') as fh:
        top = [ln.split(':')[0] for ln in fh
               if ln and not ln[0].isspace() and not ln.lstrip().startswith(('#', '-'))
               and ':' in ln.split('#')[0]]
    for k in set(top):
        if top.count(k) > 1:
            err('DUPLICATE-YAML-KEY',
                f"{os.path.relpath(p, ROOT)}: top-level key '{k}' appears {top.count(k)} times — "
                f"YAML keeps only the last, silently dropping the rest")
    d = load(p)
    if not d: continue
    for s in (d.get('sources') or []):
        if not s.get('id'): continue
        if s['id'] in sources:
            prev = sources[s['id']]
            # Identical duplicates are harmless (a shared source cited by two tracks).
            # A duplicate that DISAGREES is a real bug: the loader silently last-write-wins, so which
            # tier or URL you get depends on filesystem order.
            if prev.get('url') != s.get('url') or prev.get('tier') != s.get('tier'):
                err('CONFLICTING-SOURCE', f"'{s['id']}' defined twice with different tier/url")
            else:
                warn('DUP-SOURCE', f"source id '{s['id']}' defined twice (identical)")
        sources[s['id']] = s
for p in sorted(glob.glob(C('practices','*.yaml'))):
    d = load(p)
    if d and d.get('id'): practices[d['id']] = d

concept_home = {}
for p in sorted(glob.glob(C('concepts','*.yaml'))):
    d = load(p)
    if not d: continue
    mid = d.get('moduleId') or os.path.basename(p)[:-5]
    for c in (d.get('concepts') or []):
        cid = c.get('id')
        if not cid: err('NO-ID', f'{os.path.relpath(p,ROOT)}: concept without id'); continue
        if cid in concepts:
            err('RULE7-DUP-CONCEPT', f"'{cid}' defined twice: {concept_home[cid]} and {mid}")
        else:
            concepts[cid] = c; concept_home[cid] = mid

print(f'loaded  tracks={len(tracks)} modules={len(modules)} concepts={len(concepts)} sources={len(sources)} practices={len(practices)}')

# RULE 1 — edges resolve
graph = collections.defaultdict(set)
for cid, c in concepts.items():
    for e in (c.get('edges') or []):
        if not isinstance(e, dict): err('EDGE-SHAPE', f'{cid}: malformed edge {e!r}'); continue
        to, t = e.get('to'), e.get('type')
        if t not in EDGE_TYPES: err('EDGE-TYPE', f"{cid}: bad edge type '{t}'")
        if to not in concepts: err('RULE1-BROKEN-EDGE', f"{cid} --{t}--> '{to}' does not exist")
        elif t == 'requires': graph[cid].add(to)

# RULE 2 — no requires cycle
WHITE, GREY, BLACK = 0, 1, 2
color = collections.defaultdict(int); cycles = []
def dfs(n, stack):
    color[n] = GREY; stack.append(n)
    for m in graph.get(n, ()):
        if color[m] == GREY:
            i = stack.index(m); cycles.append(stack[i:] + [m])
        elif color[m] == WHITE: dfs(m, stack)
    stack.pop(); color[n] = BLACK
for n in list(graph):
    if color[n] == WHITE: dfs(n, [])
for cyc in cycles[:12]:
    err('RULE2-CYCLE', ' -> '.join(cyc))

# RULE 3 — spec/canonical source
for cid, c in concepts.items():
    srcs = c.get('sources') or []
    if c.get('needsSource'): warn('NEEDS-SOURCE', f'{cid}: flagged by author'); continue
    if not srcs: err('RULE3-NO-SOURCE', f'{cid}: no sources'); continue
    unknown = [s for s in srcs if s not in sources]
    if unknown: err('BROKEN-SOURCE-REF', f'{cid}: {unknown[:3]}')
    tiers = {sources[s].get('tier') for s in srcs if s in sources}
    if tiers & GOOD_TIERS: continue
    # An empirical/market claim has no spec to cite. Peer-reviewed analysis IS the right tier for it,
    # but it must be declared, so the exemption can never be taken silently.
    if c.get('claimKind') == 'empirical' and 'primary-analysis' in tiers:
        warn('EMPIRICAL-CLAIM', f'{cid}: rests on primary-analysis by declaration'); continue
    err('RULE3-WEAK-SOURCE', f'{cid}: only {sorted(t for t in tiers if t)}')

# §17 — concept identity. Retired ids must resolve, and must not collide with live ones.
alias = {}
for cid, c in concepts.items():
    for old in (c.get('formerIds') or []) + (c.get('mergedFrom') or []):
        if old in concepts:
            err('ALIAS-COLLIDES', f"'{old}' is both a live concept and a retired alias of '{cid}'")
        if old in alias and alias[old] != cid:
            err('ALIAS-AMBIGUOUS', f"retired id '{old}' claimed by both '{alias[old]}' and '{cid}'")
        alias[old] = cid
    for child in (c.get('splitInto') or []):
        if child not in concepts:
            err('SPLIT-TARGET-MISSING', f"'{cid}' splitInto unknown concept '{child}'")

# §17 — stored state must never point at an id the content no longer knows.
state_db = os.path.join(ROOT, '.chainpath', 'state.db')
if os.path.exists(state_db):
    try:
        import sqlite3
        con = sqlite3.connect(f'file:{state_db}?mode=ro', uri=True)
        rows = [r[0] for r in con.execute('SELECT concept_id FROM review_state')]
        con.close()
        orphans = [r for r in rows if r not in concepts and r not in alias]
        if orphans:
            err('ORPHANED-STATE', f'{len(orphans)} review_state rows point at unknown concepts, e.g. {orphans[:3]}')
    except Exception as e:
        warn('STATE-UNREADABLE', str(e))

# RULE 4 — Track 01 paysOffIn
f_mods = {m['id'] for m in modules.values() if m.get('trackId') == 'fundamentals'}
for cid, c in concepts.items():
    if concept_home.get(cid) in f_mods and not (c.get('paysOffIn') or []):
        err('RULE4-NO-PAYSOFF', f'{cid}: fundamentals concept without paysOffIn')

# RULE 5 — practice coverage for tracks 3-13
core12 = {'fundamentals','ledgers'}
by_mod = collections.defaultdict(list)
for pid, p in practices.items():
    # YAML silently turns "Lead-in: rest of sentence" into a mapping. Catch it here, not in the UI.
    for i, h in enumerate(p.get('hints') or []):
        if not isinstance(h, str):
            err('HINT-NOT-STRING', f'{pid}: hints[{i}] parsed as {type(h).__name__} — quote the string')
    for f in ('spec', 'title'):
        if p.get(f) is not None and not isinstance(p[f], str):
            err('FIELD-NOT-STRING', f'{pid}: {f} parsed as {type(p[f]).__name__}')
    m = p.get('moduleId')
    if m not in modules: err('BROKEN-PRACTICE-MODULE', f'{pid}: moduleId {m!r} unknown')
    else: by_mod[m].append(pid)
for mid, m in modules.items():
    if m.get('trackId') in core12: continue
    if m.get('status') == 'stub': continue          # stubs are deliberately practice-free
    if not by_mod.get(mid) and not (m.get('practices') or []):
        err('RULE5-NO-PRACTICE', f'{mid}: no practice')

# RULE 6 — layout collisions
seen = {}
for tid, t in tracks.items():
    l = t.get('layout') or {}
    k = (l.get('lane'), l.get('row'))
    if k in seen: err('RULE6-TRACK-LAYOUT', f'{tid} collides with {seen[k]} at {k}')
    seen[k] = tid
per_track = collections.defaultdict(dict)
for mid, m in modules.items():
    l = m.get('layout') or {}
    k = (l.get('lane'), l.get('row')); tid = m.get('trackId')
    if k == (None, None): warn('NO-LAYOUT', f'{mid}: no layout'); continue
    if k in per_track[tid]: err('RULE6-MODULE-LAYOUT', f'{mid} collides with {per_track[tid][k]} at {k} in {tid}')
    per_track[tid][k] = mid

# structural integrity
lessons = 0; lesson_ids = set()
for mid, m in modules.items():
    if m.get('trackId') not in tracks: err('BROKEN-TRACK-REF', f"{mid}: trackId {m.get('trackId')!r}")
    for c in (m.get('teaches') or []):
        if c not in concepts: err('BROKEN-TEACHES', f'{mid}: teaches unknown {c!r}')
    for L in (m.get('lessons') or []):
        lessons += 1
        lid = L.get('id')
        if not lid: err('LESSON-NO-ID', mid); continue
        if lid in lesson_ids: err('DUP-LESSON', lid)
        lesson_ids.add(lid)
        rm = L.get('readingMin')
        if isinstance(rm, int) and not (5 <= rm <= 25): warn('READING-MIN', f'{lid}: {rm} min')
        for c in (L.get('teaches') or []):
            if c not in concepts: err('BROKEN-LESSON-TEACHES', f'{lid}: {c!r}')
        for c in (L.get('assumes') or []):
            if c not in concepts: err('BROKEN-LESSON-ASSUMES', f'{lid}: {c!r}')
# --- gating integrity ---------------------------------------------------------------------------
# Content is gated on `assumes`: a lesson opens once the lesson teaching each assumed concept is
# complete. Three properties have to hold or the gate locks the learner out of real content, and
# none of them was enforced before — the zk track shipped a mutual pair that made 12 lessons
# permanently unreachable at any amount of work.
#
#   R9  every concept is taught by exactly one lesson  (a concept with two homes has no
#       canonical parent, so it cannot be addressed in one tree either)
#   R10 no `assumes` edge points forward in reading order
#   R11 no cycle in the module projection of `assumes`

_teachers = {}
for mid, m in modules.items():
    for L in (m.get('lessons') or []):
        for c in (L.get('teaches') or []):
            _teachers.setdefault(c, []).append(L.get('id'))

for c, ls in _teachers.items():
    if len(ls) > 1:
        err('R9-CONCEPT-TWO-HOMES', f'{c}: taught by {len(ls)} lessons ({", ".join(ls)})')
for c in concepts:
    if c not in _teachers:
        warn('R9-CONCEPT-UNTAUGHT', f'{c}: no lesson teaches it')

# reading order = track number, module order, lesson order
_pos = {}
_lesson_module = {}
_i = 0
for t in sorted(tracks.values(), key=lambda x: x.get('number', 0)):
    _mods = [m for m in modules.values() if m.get('trackId') == t.get('id')]
    for m in sorted(_mods, key=lambda x: x.get('order', 0)):
        for L in sorted(m.get('lessons') or [], key=lambda x: x.get('order', 0)):
            _pos[L.get('id')] = _i
            _lesson_module[L.get('id')] = m.get('id')
            _i += 1

_module_edges = collections.defaultdict(set)
for mid, m in modules.items():
    for L in (m.get('lessons') or []):
        lid = L.get('id')
        if lid not in _pos: continue
        for c in (L.get('assumes') or []):
            src = _teachers.get(c)
            if not src: continue
            src_lid = src[0]
            if src_lid not in _pos: continue
            if _pos[src_lid] > _pos[lid]:
                # WARN, not ERR, until the gate ships: these 4 are a pre-existing content
                # condition, not a regression, and each needs an authoring decision (drop the
                # edge, or move the lesson) rather than a mechanical fix. Promote to err() in the
                # same commit as gating, or the gate will lock these 4 lessons behind content
                # up to 154 lessons downstream of them.
                warn('R10-ASSUMES-POINTS-FORWARD',
                     f'{lid} assumes {c!r}, taught {_pos[src_lid] - _pos[lid]} lessons later in {src_lid}')
            src_mid = _lesson_module[src_lid]
            if src_mid != mid: _module_edges[mid].add(src_mid)

# Tarjan-free cycle check: a module reachable from itself through `assumes` is a deadlock.
_state = {}
def _walk(node, stack):
    if _state.get(node) == 'done': return
    if _state.get(node) == 'open':
        cut = stack[stack.index(node):]
        err('R11-ASSUMES-CYCLE', ' -> '.join(cut + [node]))
        return
    _state[node] = 'open'
    for nxt in sorted(_module_edges.get(node, ())):
        _walk(nxt, stack + [node])
    _state[node] = 'done'
for mid in sorted(modules): _walk(mid, [])

for tid, t in tracks.items():
    for mid in (t.get('modules') or []):
        if mid not in modules: err('BROKEN-MODULE-REF', f'{tid}: {mid!r}')
    for o in (t.get('entersFrom') or []) + (t.get('feedsInto') or []):
        if o not in tracks: err('BROKEN-TRACK-LINK', f'{tid}: {o!r}')
for sid, s in sources.items():
    if s.get('tier') not in ALL_TIERS: err('BAD-TIER', f"{sid}: {s.get('tier')!r}")
    # A source may legitimately cite something in this repo (constants measured on this machine).
    # It must declare `internal: true` so the exemption is visible rather than assumed.
    if not str(s.get('url', '')).startswith('http') and not s.get('internal'):
        warn('BAD-URL', f'{sid}')


# --- figures -----------------------------------------------------------------------------------
# Figures are React primitives fed data, not hand-drawn SVG. These rules catch the three ways that
# contract breaks: a figure with no accessible text, a hand-rolled drawing that bypasses the kit,
# and a comparison table whose rows do not line up with its columns.
DIAGRAMS = {'Flow','ByteLayout','Anatomy','Timeline','Tree','StackTrace','Compare','Matrix','Bars'}
SELF_CONTAINED = {'Compare','Matrix'}
BOX_CHARS = re.compile(r'[\u2500-\u257f]')
# A hand-drawn diagram does not have to use box-drawing characters. A hex string with a row of
# carets underneath naming each field is exactly what <Anatomy> is for, and the box-drawing check
# never saw it. Caught by an agent, not by this linter.
CARET_ART = re.compile(r'^\s*[\^~]{2,}[\s\^~]*\S', re.M)

def top_level_items(src):
    """Split a bracketed list on commas that are not nested. Returns the item strings.

    JSX counts as nesting. A cell like `<>Approximately 128 bits, which EIP-7951 states...</>` holds a
    comma inside a fragment, and treating only brackets as nesting split one cell into two — which
    reported a perfectly good row as ragged. Tags are scanned as whole tokens because `<>` opens and
    `</>` closes, and a naive angle-bracket count nets both to zero.
    """
    out, depth, angle, cur, quote = [], 0, 0, '', None
    i, n = 0, len(src)
    while i < n:
        ch = src[i]
        if quote:
            cur += ch
            if ch == quote and not cur.endswith('\\' + ch): quote = None
            i += 1; continue
        # Only outside a tag. Inside JSX children an apostrophe is prose — "That network's data" —
        # and treating it as a string delimiter swallowed the following comma, merging two cells and
        # reporting a sound row as ragged.
        if ch in '"\'`' and angle == 0:
            quote = ch; cur += ch; i += 1; continue
        if ch == '<':
            if i + 1 < n and src[i+1] == '>':                 # <>  fragment open
                angle += 1; cur += '<>'; i += 2; continue
            if i + 1 < n and src[i+1] == '/':                 # </…>  any close
                j = src.find('>', i)
                if j == -1: cur += ch; i += 1; continue
                angle -= 1; cur += src[i:j+1]; i = j + 1; continue
            if i + 1 < n and (src[i+1].isalpha() or src[i+1] == '_'):
                j, q = i + 1, None                            # <Tag …>  or  <Tag … />
                while j < n:
                    c = src[j]
                    if q:
                        if c == q: q = None
                    elif c in '"\'': q = c
                    elif c == '>': break
                    j += 1
                if j >= n: cur += ch; i += 1; continue
                if src[j-1] != '/': angle += 1                # self-closing nets zero
                cur += src[i:j+1]; i = j + 1; continue
        if ch in '([{': depth += 1
        elif ch in ')]}': depth -= 1
        if ch == ',' and depth == 0 and angle == 0:
            out.append(cur.strip()); cur = ''
        else:
            cur += ch
        i += 1
    if cur.strip(): out.append(cur.strip())
    return out

def _skip_tag(text, i):
    """At a '<' that opens a JSX tag, return (index after the tag, angle delta)."""
    n = len(text)
    if i + 1 < n and text[i+1] == '>':                       # <>  fragment open
        return i + 2, +1
    if i + 1 < n and text[i+1] == '/':                       # </…>  any close
        j = text.find('>', i)
        return (n, 0) if j == -1 else (j + 1, -1)
    j, q = i + 1, None
    while j < n:                                             # <Tag …>  or  <Tag … />
        c = text[j]
        if q:
            if c == q: q = None
        elif c in '"\'': q = c
        elif c == '>': break
        j += 1
    if j >= n: return n, 0
    return j + 1, (0 if text[j-1] == '/' else +1)            # self-closing nets zero


def balanced_after(text, i):
    """Given index of an opening bracket, return the slice inside its matching close.

    Tags are scanned as whole tokens for the same reason top_level_items scans them: `<>` opens a
    fragment and `</>` closes one, and a naive angle-bracket count nets both to zero. Getting that
    wrong let a bare apostrophe in JSX text — "the counterparty's consensus" — be read as a string
    delimiter, so this scanner ran past the closing bracket and a sound row reported as ragged.
    """
    open_ch = text[i]; close_ch = {'[': ']', '{': '}', '(': ')'}[open_ch]
    depth, j, quote, angle, n = 0, i, None, 0, len(text)
    while j < n:
        ch = text[j]
        if quote:
            if ch == quote and text[j-1] != '\\': quote = None
            j += 1; continue
        if ch == '<' and j + 1 < n and (text[j+1].isalpha() or text[j+1] in '/>_'):
            j, d = _skip_tag(text, j); angle += d; continue
        if ch in '"\'`' and angle == 0:
            quote = ch; j += 1; continue
        if angle == 0:
            if ch == open_ch: depth += 1
            elif ch == close_ch:
                depth -= 1
                if depth == 0: return text[i+1:j]
        j += 1
    return None


figure_counts = {}
for path in sorted(glob.glob(os.path.join(ROOT, 'content/lessons/*.mdx'))):
    lid = os.path.basename(path)[:-4]
    body = open(path, encoding='utf-8').read()
    rel = f'content/lessons/{lid}.mdx'
    # Rust generics, JSX in a tutorial, an SVG being explained: anything inside code is prose about
    # code, not markup the compiler will see. Scan for components only outside it.
    prose = re.sub(r'`[^`\n]*`', '', re.sub(r'```.*?```', '', body, flags=re.S))

    n = len(re.findall(r'<Figure\b', prose)) + sum(len(re.findall(rf'<{d}\b', prose)) for d in SELF_CONTAINED)
    figure_counts[lid] = n

    for m in re.finditer(r'<Figure\b([^>]*)>', prose):
        attrs = m.group(1)
        if 'caption=' not in attrs: err('FIGURE-NO-CAPTION', f'{rel}: <Figure> without caption')
        if 'alt=' not in attrs: err('FIGURE-NO-ALT', f'{rel}: <Figure> without alt')

    # LESSON-FORMAT.md requires frontmatter `sources` to list every source the body cites. Nothing
    # enforced it, and three lessons drifted the moment a citation was added by hand.
    fm = re.match(r'^---\n(.*?)\n---\n', body, re.S)
    if fm:
        try:
            declared = set((yaml.safe_load(fm.group(1)) or {}).get('sources') or [])
        except Exception:
            declared = set()
        cited = set(re.findall(r'<Cite\s+src="([^"]+)"', prose))
        undeclared = sorted(cited - declared)
        if undeclared:
            err('CITE-NOT-IN-FRONTMATTER', f'{rel}: cites {undeclared[:3]} but frontmatter does not list it')

    if re.search(r'<svg\b', prose, re.I):
        err('RAW-SVG', f'{rel}: hand-written <svg> — use a diagram primitive')

    for used in set(re.findall(r'<([A-Z][A-Za-z]*)\b', prose)):
        if used not in DIAGRAMS | {'Figure','Cite','Check','Answer','Misconception','Aside'}:
            err('UNKNOWN-COMPONENT', f'{rel}: <{used}> is not registered in mdxComponents')

    # A self-contained table nested inside <Figure> double-wraps the container.
    for d in SELF_CONTAINED:
        if re.search(rf'<Figure\b[^>]*>\s*<{d}\b', prose):
            err('FIGURE-DOUBLE-WRAP', f'{rel}: <{d}> renders its own container — drop the <Figure>')

    for d in SELF_CONTAINED:
        for m in re.finditer(rf'<{d}\b', prose):
            # Scanning to the first "/>" is wrong: a <Cite ... /> inside a cell provides one, so a
            # table whose caption sits after its cells was reported as caption-less. Walk the opening
            # tag with brace and quote depth instead, which is where nested JSX actually lives.
            i, depth, quote = m.end(), 0, None
            while i < len(prose):
                ch = prose[i]
                if quote:
                    if ch == quote: quote = None
                elif ch in '"\'':
                    quote = ch
                elif ch == '{': depth += 1
                elif ch == '}': depth -= 1
                elif ch == '>' and depth == 0:
                    break
                i += 1
            # FIGURE-FORMAT rule 1 wants both props here exactly as it does on <Figure>, but only
            # `caption` was ever checked and only as a warning — which is how 40 caption-less tables
            # shipped across the first two tracks before anyone noticed, and why `alt` was never
            # measured at all. Both are errors now that the whole corpus satisfies them.
            attrs = prose[m.end():i]
            if 'caption=' not in attrs:
                err('TABLE-NO-CAPTION', f'{rel}: <{d}> without a caption assertion')
            if 'alt=' not in attrs:
                err('TABLE-NO-ALT', f'{rel}: <{d}> without alt')

    for m in re.finditer(r'<Compare\b', prose):
        # Bound the segment to THIS element. A fixed-size window ran past the closing tag into a
        # following <Matrix> and measured its rows against the Compare's column count — every one of
        # those reports was the checker's own bug, not a ragged row.
        j, d, q = m.end(), 0, None
        while j < len(prose):
            c = prose[j]
            if q:
                if c == q: q = None
            elif c in '"\'': q = c
            elif c == '{': d += 1
            elif c == '}': d -= 1
            elif c == '>' and d == 0: break
            j += 1
        seg = prose[m.start(): j + 1]
        ci = seg.find('columns={[')
        if ci < 0: continue
        cols = balanced_after(seg, ci + len('columns={'))
        if cols is None: continue
        ncols = len(top_level_items(cols))
        reported = False
        for cm in re.finditer(r'cells:\s*\[', seg):
            cells = balanced_after(seg, cm.end() - 1)
            if cells is None: continue
            k = len(top_level_items(cells))
            if k != ncols and not reported:
                err('COMPARE-RAGGED', f'{rel}: a <Compare> row has {k} cells for {ncols} columns')
                reported = True  # one report per Compare is enough to send an author back to it

    # A console transcript legitimately contains box-drawing characters — `forge tree` and `chisel`
    # both print them. Converting captured tool output into an authored figure would misrepresent it
    # as a drawing, so the shell-tagged fences are exempt. Every real hand-drawn diagram in this
    # corpus is tagged `text`.
    for lang, fence in re.findall(r'```([a-z]*)\n(.*?)```', body, re.S):
        if lang in ('console', 'shell', 'bash', 'sh'):
            continue
        if BOX_CHARS.search(fence) and fence.count('\n') > 2:
            warn('ASCII-DIAGRAM', f'{rel}: box-drawing art in a code fence — convert to a figure')
        elif CARET_ART.search(fence):
            warn('CARET-ANNOTATION', f'{rel}: caret-annotated literal in a fence — this is an <Anatomy>')

drawn = sum(1 for v in figure_counts.values() if v)
print(f'figures={sum(figure_counts.values())} in {drawn}/{len(figure_counts)} lessons')
for lid, v in figure_counts.items():
    if v == 0: warn('LESSON-NO-FIGURE', f'content/lessons/{lid}.mdx')

print(f'lessons={lessons}')
print()
if errors:
    g = collections.Counter(c for c, _ in errors)
    print(f'ERRORS: {len(errors)}')
    for c, n in g.most_common(): print(f'  {n:5d}  {c}')
    print()
    shown = collections.Counter()
    for c, m in errors:
        if shown[c] < 4: print(f'  [{c}] {m}'); shown[c] += 1
else:
    print('ERRORS: 0')
print()
if warns:
    g = collections.Counter(c for c, _ in warns)
    print(f'WARNINGS: {len(warns)}')
    for c, n in g.most_common(): print(f'  {n:5d}  {c}')
sys.exit(1 if errors else 0)
