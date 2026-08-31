// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Script, console2} from "forge-std/Script.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: infra-indexer-selection-factory-blind-spot  (break, grain module, difficulty 4)
 * Run:      forge script script/DeployFactory.s.sol --broadcast && pnpm vitest run tests/factory-indexing --reporter=junit
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Deploy a factory contract and several child contracts created by it on a local chain, and
 *   have the children emit swap-like events. Write an indexer that registers only the factory's
 *   creation event and not the children, so the child events are never subscribed to. Show
 *   exactly which events go missing and quantify them. Then fix it with the platform's
 *   dynamic-contract or template mechanism so children created at runtime are indexed from their
 *   creation block. Finally, add a value transfer that moves ETH through an internal call
 *   emitting no event, and demonstrate whether your chosen platform can see it at all.
 *
 * A script, not a test: it is run for its effects. The acceptance criteria are listed below
 * because they are what the run has to demonstrate; there is nothing here to assert them with.
 */
contract DeployFactoryScript is Script {
    function run() external {
        // What a script opens with, and what stops solc suggesting this be `pure`: the
        // broadcast is the reason a script exists rather than a test.
        vm.startBroadcast();
        revert("TODO: this script is unimplemented");
    }

    // 1. A test reports the exact count and identity of child-contract events missed by the
    //    unregistered version
    // 2. After adding dynamic registration, every child event from its creation block onward appears
    //    in the table
    // 3. A written finding states whether the platform can observe the event-less internal transfer,
    //    with the evidence
    // 4. The write-up maps each finding onto one of the four capability gates and says which
    //    platforms it would eliminate
}
