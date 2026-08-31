// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: zk-onchain-verification-capstone-a-proof-is-not-permission  (break, grain module, difficulty 4)
 * Run:      forge test --junit --match-path test/capstone/ProofConsumption.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   A verifier is a pure function. Every bug worth having in this area is in the contract that
 *   calls it, and this exercise is to write both bugs and then price the thing properly. THE
 *   UNBOUND INPUT. Build a payout contract that verifies a proof and pays out. Leave a public
 *   input unbound — the recipient, or the amount — and take the money with a proof that verifies
 *   perfectly. Then fix the binding and show the same attack failing. A comment states which
 *   input was unbound and what the verifier was and was not asserting. THE REPLAY. Now make the
 *   proof itself valid, bound, and replayable: claim twice with the same proof. Fix it, and
 *   state what your fix costs per claim in gas and in storage. WHERE THE GAS GOES. Profile the
 *   verifier. Report what fraction is pairings, and show the verification floor — the gas you
 *   pay before any input-specific work. Compare a Groth16 and a PLONK verifier for the same
 *   statement and report both totals and both floors. MANY PROOFS, ONE COST. Implement a batched
 *   pairing check over N proofs and plot gas per proof against N. State the N at which the
 *   batching saves more than it costs in added complexity. Then describe, without necessarily
 *   implementing it, what recursive aggregation would change about that curve. VERIFY VERSUS
 *   RE-EXECUTE. For one concrete statement, compute both: the gas to verify a proof, and the gas
 *   to just re-execute the computation on chain. Say which wins and at what size the answer
 *   flips — this is the break-even nobody puts on the slide. THE OTHER COSTS. Separate three
 *   numbers that get conflated: verification gas, the calldata cost of the public inputs and the
 *   proof, and the off-chain proving cost in dollars. Report all three for one claim. THE ADMIN.
 *   Finally: find the upgrade path on your own verifier and state what the proofs are worth if
 *   the verifier can be replaced. Then say what you would do about it.
 */
contract ProofConsumptionTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// A proof that verifies correctly drains the contract via an unbound public input, with the
    /// input named in a comment
    function test_criterion01_aProofThatVerifiesCorrectlyDrainsTheContractVia() public {
        fail("A proof that verifies correctly drains the contract via an unbound public input, with the input named in a comment");
    }

    /// Binding the input makes the same attack fail
    function test_criterion02_bindingTheInputMakesTheSameAttackFail() public {
        fail("Binding the input makes the same attack fail");
    }

    /// A bound, valid proof is successfully replayed, then prevented, with the fix's per-claim gas
    /// and storage cost stated
    function test_criterion03_aBoundValidProofIsSuccessfullyReplayedThenPrevented() public {
        fail("A bound, valid proof is successfully replayed, then prevented, with the fix's per-claim gas and storage cost stated");
    }

    /// The verifier is profiled with the pairing fraction and the verification floor reported
    function test_criterion04_theVerifierIsProfiledWithThePairingFractionAnd() public {
        fail("The verifier is profiled with the pairing fraction and the verification floor reported");
    }

    /// Groth16 and PLONK verifiers for the same statement are compared on total and floor
    function test_criterion05_groth16AndPlonkVerifiersForTheSameStatementAre() public {
        fail("Groth16 and PLONK verifiers for the same statement are compared on total and floor");
    }

    /// A batched pairing check is implemented with gas per proof plotted against N and a break-even
    /// N stated
    function test_criterion06_aBatchedPairingCheckIsImplementedWithGasPer() public {
        fail("A batched pairing check is implemented with gas per proof plotted against N and a break-even N stated");
    }

    /// The effect of recursive aggregation on that curve is described
    function test_criterion07_theEffectOfRecursiveAggregationOnThatCurveIs() public {
        fail("The effect of recursive aggregation on that curve is described");
    }

    /// Verification gas and native re-execution gas are computed for one statement, with the size
    /// at which the answer flips
    function test_criterion08_verificationGasAndNativeReExecutionGasAreComputed() public {
        fail("Verification gas and native re-execution gas are computed for one statement, with the size at which the answer flips");
    }

    /// Verification gas, public-input and proof calldata cost, and off-chain proving cost in
    /// dollars are reported separately for one claim
    function test_criterion09_verificationGasPublicInputAndProofCalldataCostAnd() public {
        fail("Verification gas, public-input and proof calldata cost, and off-chain proving cost in dollars are reported separately for one claim");
    }

    /// The verifier's upgrade path is found and what the proofs are worth under it is stated, with
    /// a proposed mitigation
    function test_criterion10_theVerifierSUpgradePathIsFoundAndWhat() public {
        fail("The verifier's upgrade path is found and what the proofs are worth under it is stated, with a proposed mitigation");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
