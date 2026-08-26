/**
 * Hex-prefix (compact) encoding.
 *
 * Practice: fundamentals-state-compact-encoding-from-scratch
 *
 * A nibble path has to be stored inside a byte string, and two facts have to survive the
 * round trip: whether the path length was odd, and whether the node is a leaf or an
 * extension. Both are packed into the very first nibble:
 *
 *     flag = 2 * isLeaf + isOdd
 *
 * That is two independent bits in one nibble, giving four values. Write out what each of
 * the four means BEFORE you write any code — the hint in the practice says so for a
 * reason, and getting the parity branch backwards makes the even vectors fail while the
 * odd ones pass, which is a confusing way to spend an afternoon.
 *
 * Even-length paths take a zero padding nibble immediately after the flag.
 * Odd-length paths put the first real nibble there instead.
 *
 * No trie library. No solutions here.
 */

/**
 * Encode a terminator-free nibble path plus its leaf flag into compact form.
 *
 * Published vectors (see test/compact-encoding.test.ts for the authoritative list):
 *   [1,2,3,4,5]         extension -> 0x112345
 *   [0,1,2,3,4,5]       extension -> 0x00012345
 *   [0,f,1,c,b,8]       leaf      -> 0x200f1cb8
 *   [f,1,c,b,8]         leaf      -> 0x3f1cb8
 *
 * Must validate every nibble is in 0..15 and throw `NibbleRangeError` if not.
 */
export function compactEncode(_nibbles: number[], _isLeaf: boolean): Uint8Array {
  throw new Error('TODO: flag nibble = 2 * isLeaf + isOdd, then pad or absorb the first nibble');
}

/**
 * Exact inverse of `compactEncode`. Must recover the leaf flag as well as the path —
 * a decoder that returns only the nibbles has thrown away half the information the
 * encoding exists to carry.
 *
 * Must reject an empty input (there is nowhere for the flag nibble to live) and must
 * reject a flag nibble greater than 3.
 */
export function compactDecode(_encoded: Uint8Array): { nibbles: number[]; isLeaf: boolean } {
  throw new Error('TODO: read the flag nibble, then decide whether nibble 1 is padding or payload');
}
