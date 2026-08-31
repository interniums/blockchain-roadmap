// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";
import {RevocationWindow} from "../src/app-session-keys/RevocationWindow.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-session-keys-measure-revocation-window  (measure, grain block, difficulty 3)
 * Run:      forge test --match-path test/RevocationWindow.t.sol --gas-report && pnpm tsx scripts/revocation-latency.ts --out latency.json
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Instrument the revocation path for your session-key module. Measure the gas cost of
 *   uninstalling the module or otherwise invalidating the session, and the wall-clock time from
 *   the moment a user would press revoke to the moment the transaction is mined on a public
 *   testnet. Then, on Anvil with auto-mining disabled, demonstrate the race directly: broadcast
 *   the revocation, and from the session key broadcast an operation at a higher fee. Mine and
 *   record which landed.
 */
contract RevocationWindowTest is Test {
    /// The subject, from src/app-session-keys/RevocationWindow.sol. Add functions there and call them here.
    RevocationWindow internal subject;

    function setUp() public {
        subject = new RevocationWindow();
    }

    /// The gas report contains a measured cost for the revocation path, quoted from the report
    /// rather than estimated
    function test_criterion01_theGasReportContainsAMeasuredCostForThe() public {
        fail(
            "The gas report contains a measured cost for the revocation path, quoted from the report rather than estimated"
        );
    }

    /// latency.json records click-to-receipt seconds on a testnet and converts it into a window
    /// expressed in blocks
    function test_criterion02_latencyJsonRecordsClickToReceiptSecondsOnA() public {
        fail(
            "latency.json records click-to-receipt seconds on a testnet and converts it into a window expressed in blocks"
        );
    }

    /// The Anvil race test shows the session-key operation being included ahead of the revocation
    /// and asserts it succeeded
    function test_criterion03_theAnvilRaceTestShowsTheSessionKeyOperation() public {
        fail(
            "The Anvil race test shows the session-key operation being included ahead of the revocation and asserts it succeeded"
        );
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
