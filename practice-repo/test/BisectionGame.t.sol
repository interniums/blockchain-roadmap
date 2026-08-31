// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: scaling-proof-systems-toy-bisection-game  (implement, grain module, difficulty 5)
 * Run:      forge test --match-path test/BisectionGame.t.sol -vvv
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   In Foundry, implement a minimal dispute game over an execution trace. Both parties commit to
 *   a Merkle root over the trace of a simple deterministic step function. The challenger
 *   disputes the final state; each round, the contract asks both sides for their claimed state
 *   at the midpoint of the disputed range and narrows to the half where they first disagree.
 *   When the range is a single step, the contract executes that one step on-chain and awards the
 *   loser's bond to the winner. Write tests proving an honest party beats a dishonest one, that
 *   the number of on-chain rounds grows logarithmically with trace length, and that a party who
 *   stops responding loses on timeout. Then add a delay attacker who always responds at the last
 *   permitted moment, and measure how long the honest party is forced to stay engaged.
 */
contract BisectionGameTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// An honest party defeats a dishonest one and receives the forfeited bond
    function test_criterion01_anHonestPartyDefeatsADishonestOneAndReceives() public {
        fail("An honest party defeats a dishonest one and receives the forfeited bond");
    }

    /// Round count is asserted to grow logarithmically as trace length goes from 2^8 to 2^20
    function test_criterion02_roundCountIsAssertedToGrowLogarithmicallyAsTrace() public {
        fail("Round count is asserted to grow logarithmically as trace length goes from 2^8 to 2^20");
    }

    /// The one-step resolution executes exactly one step of the trace on-chain, asserted by a gas
    /// or event check
    function test_criterion03_theOneStepResolutionExecutesExactlyOneStepOf() public {
        fail("The one-step resolution executes exactly one step of the trace on-chain, asserted by a gas or event check");
    }

    /// A party who stops responding loses on timeout, including the case where both sides stop
    function test_criterion04_aPartyWhoStopsRespondingLosesOnTimeoutIncluding() public {
        fail("A party who stops responding loses on timeout, including the case where both sides stop");
    }

    /// A delay-attacker test reports the total wall-clock the honest party must remain engaged
    function test_criterion05_aDelayAttackerTestReportsTheTotalWallClock() public {
        fail("A delay-attacker test reports the total wall-clock the honest party must remain engaged");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
