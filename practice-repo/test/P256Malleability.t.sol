// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-passkeys-malleable-replay  (break, grain module, difficulty 4)
 * Run:      forge test --match-path test/P256Malleability.t.sol -vv
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Take a valid P-256 signature from the previous exercise and compute its counterpart with `s`
 *   replaced by `n - s`. Show the precompile accepts both. Then build an account whose replay
 *   protection keys off the signature bytes and demonstrate a double execution. Fix it two ways
 *   - normalise to low-s on the way in, and key replay protection off the nonce instead - and
 *   say which fix you would ship. Separately, verify only the P-256 signature while skipping the
 *   clientDataJSON checks, and replay an assertion harvested from a different ceremony.
 */
contract P256MalleabilityTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// A test asserts that both (r, s) and (r, n - s) return one from the precompile
    function test_criterion01_aTestAssertsThatBothRSAndR() public {
        fail("A test asserts that both (r, s) and (r, n - s) return one from the precompile");
    }

    /// A test shows the naive account executing the same authorised action twice, and both fixes
    /// preventing it
    function test_criterion02_aTestShowsTheNaiveAccountExecutingTheSame() public {
        fail("A test shows the naive account executing the same authorised action twice, and both fixes preventing it");
    }

    /// A further test shows the signature-only verifier accepting an assertion from another
    /// ceremony and the hardened verifier rejecting it on the type or challenge check
    function test_criterion03_aFurtherTestShowsTheSignatureOnlyVerifierAccepting() public {
        fail("A further test shows the signature-only verifier accepting an assertion from another ceremony and the hardened verifier rejecting it on the type or challenge check");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
