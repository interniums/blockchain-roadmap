// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Script, console2} from "forge-std/Script.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: infra-indexing-break-it-with-a-reorg  (break, grain block, difficulty 4)
 * Run:      forge script script/ReorgDrill.s.sol && pnpm vitest run tests/reorg-indexer --reporter=junit
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Write the naive indexer first: a loop that reads logs from the tip and appends derived rows,
 *   with no notion of the branch a row came from. Point it at a local Anvil chain. Mine a few
 *   blocks containing token transfers, snapshot, then revert to the snapshot and mine a
 *   different branch containing different transfers to the same addresses. Show that the naive
 *   indexer's table now contains rows from the abandoned branch alongside rows from the
 *   canonical one, and that nothing in the process logged an error. Then fix it: record the
 *   block hash with every row, detect the common ancestor when the parent hash of a new block
 *   does not match the hash you stored, delete every row above it, and reapply.
 *
 * A script, not a test: it is run for its effects. The acceptance criteria are listed below
 * because they are what the run has to demonstrate; there is nothing here to assert them with.
 */
contract ReorgDrillScript is Script {
    function run() external {
        // What a script opens with, and what stops solc suggesting this be `pure`: the
        // broadcast is the reason a script exists rather than a test.
        vm.startBroadcast();
        revert("TODO: this script is unimplemented");
    }

    // 1. A test proves the naive indexer's final table differs from the canonical chain's true state,
    //    and names the exact rows that should not be there
    // 2. A test proves the naive run exited zero and logged no error while producing that wrong table
    // 3. After the fix, the table matches the canonical branch exactly, with no rows attributable to
    //    the abandoned blocks
    // 4. The fixed indexer is shown to be idempotent - rerunning it over the same range produces an
    //    identical table
}
