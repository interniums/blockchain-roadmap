# Implement hex-prefix encoding until the vectors match exactly

Practice: `fundamentals-state-compact-encoding-from-scratch`
Acceptance: `npx vitest run test/compact-encoding.test.ts`

This one is nearly all code. The spec is `test/compact-encoding.test.ts`;
implement `src/state/compact.ts` and `src/state/nibbles.ts` against it.

## Write the table before you write the code

Two bits packed into one nibble, `flag = 2 * isLeaf + isOdd`:

| Flag | isLeaf | isOdd | Meaning | Second nibble |
| --- | --- | --- | --- | --- |
| 0 | false | false | extension, even path | zero padding |
| 1 | false | true | extension, odd path | first real nibble |
| 2 | true | false | leaf, even path | zero padding |
| 3 | true | true | leaf, odd path | first real nibble |

Getting the parity branch backwards makes the two even vectors fail while the
two odd ones pass, which is a confusing way to spend an afternoon.

## The terminator decision

The published vectors write leaf paths with a trailing `16` — the terminator
marker. It is not a real nibble; nibbles are `0..15`.

You must decide explicitly whether your representation carries it, and be
consistent between encode and decode. The tests fix the convention as: paths are
terminator-free, and `isLeaf` carries that information instead.
`stripTerminator` is the bridge from the published form.

## Why this is worth doing by hand

Hex-prefix encoding exists because a nibble path has to survive a round trip
through a byte string with two extra bits of information attached, and there was
no spare byte to put them in. Once you have written it, the reason a trie node
can be classified from its first nibble stops being a rule you memorised.
