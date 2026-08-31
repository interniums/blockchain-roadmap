// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";
import {InvariantPlacement} from "../src/security-threat-modeling/InvariantPlacement.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: security-threat-modeling-invariant-gas-placement  (measure, grain block, difficulty 3)
 * Run:      forge test --junit --match-path test/InvariantPlacement.t.sol -vv
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Take one system-level invariant from a protocol you have modelled - a solvency or
 *   conservation statement - "and implement it three ways: as an on-chain runtime check inside
 *   the state-changing function, as an" invariant_ property in a Foundry invariant suite, and as
 *   the pseudocode of a monitoring alert with its data source and threshold. Measure the gas the
 *   on-chain form adds to a realistic call, using a gasleft() delta harness that assigns each
 *   read into a storage sink so the read is not eliminated as dead code. Then argue in writing
 *   which of the three placements this invariant should have, and why.
 */
contract InvariantPlacementTest is Test {
    /// The subject, from src/security-threat-modeling/InvariantPlacement.sol. Add functions there and call them here.
    InvariantPlacement internal subject;

    function setUp() public {
        subject = new InvariantPlacement();
    }

    /// A reported gas figure for the on-chain check on a realistic call path, with the harness
    /// overhead subtracted
    function test_criterion01_aReportedGasFigureForTheOnChainCheck() public {
        fail(
            "A reported gas figure for the on-chain check on a realistic call path, with the harness overhead subtracted"
        );
    }

    /// The same invariant expressed as a passing Foundry invariant_ property
    function test_criterion02_theSameInvariantExpressedAsAPassingFoundryInvariant() public {
        fail("The same invariant expressed as a passing Foundry invariant_ property");
    }

    /// A written placement decision that cites the gas number and the failure mode the invariant is
    /// meant to catch
    function test_criterion03_aWrittenPlacementDecisionThatCitesTheGasNumber() public {
        fail(
            "A written placement decision that cites the gas number and the failure mode the invariant is meant to catch"
        );
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
