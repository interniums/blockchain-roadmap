// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-contract-patterns-capstone-where-the-money-goes  (break, grain module, difficulty 4)
 * Run:      forge test --junit --match-path test/capstone/Bank.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Build a deliberately naive bank that pays out to a list of recipients, then attack it four
 *   times, then rebuild it. Each attack corresponds to one pattern in this module, and the order
 *   is the argument: the one that takes the most money is not the one curricula put first.
 *   ATTACK ONE — REENTRANCY. Drain it. Then fix with CEI and show the drain fails. Then
 *   demonstrate what CEI does not cover, with a second attack that survives correct ordering.
 *   Add a guard, and compare the storage guard against the transient one with measured gas.
 *   ATTACK TWO — PUSH PAYMENT DOS. Add one recipient that reverts on receive and brick the whole
 *   distribution. Convert to pull payments and show the same recipient now harms only itself.
 *   State what the conversion cost in gas and in interface complexity. ATTACK THREE — ACCESS
 *   CONTROL. This is the one that actually takes the money, and the exercise is to treat it that
 *   way. Find or plant a privileged-function mistake and take the bank with it. Then implement
 *   three authorization models over the same contract — Ownable2Step, roles, and a manager — and
 *   for each state the blast radius of every key: what its holder can take, and what they can
 *   destroy that cannot be recovered. ATTACK FOUR — THE PAUSE. Add pausability. Then argue
 *   against it: state exactly who can now freeze the contract, and construct the scenario where
 *   the pause is the attack rather than the defence. THE FACTORY. Deploy the fixed bank a
 *   thousand times with clones. Show a clone has no constructor and demonstrate what goes wrong
 *   if you assume it does. Compare CREATE and CREATE2 for this, and say which you chose and why.
 *   Then state, in one sentence, what a clone cannot do that a full deployment can.
 */
contract BankTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// A reentrancy drain succeeds against the naive bank and fails after CEI ordering
    function test_criterion01_aReentrancyDrainSucceedsAgainstTheNaiveBankAnd() public {
        fail("A reentrancy drain succeeds against the naive bank and fails after CEI ordering");
    }

    /// A second attack survives correct CEI ordering, demonstrating what CEI does not cover
    function test_criterion02_aSecondAttackSurvivesCorrectCeiOrderingDemonstratingWhat() public {
        fail("A second attack survives correct CEI ordering, demonstrating what CEI does not cover");
    }

    /// Storage and transient reentrancy guards are compared with measured gas
    function test_criterion03_storageAndTransientReentrancyGuardsAreComparedWithMeasured() public {
        fail("Storage and transient reentrancy guards are compared with measured gas");
    }

    /// One reverting recipient bricks the push distribution, and the pull version confines the
    /// damage to that recipient
    function test_criterion04_oneRevertingRecipientBricksThePushDistributionAndThe() public {
        fail("One reverting recipient bricks the push distribution, and the pull version confines the damage to that recipient");
    }

    /// The cost of the pull conversion is stated in gas and in interface complexity
    function test_criterion05_theCostOfThePullConversionIsStatedIn() public {
        fail("The cost of the pull conversion is stated in gas and in interface complexity");
    }

    /// An access-control mistake is exploited to take the bank
    function test_criterion06_anAccessControlMistakeIsExploitedToTakeThe() public {
        fail("An access-control mistake is exploited to take the bank");
    }

    /// Three authorization models are implemented, each with the blast radius of every key stated
    /// as what it can take and what it can irrecoverably destroy
    function test_criterion07_threeAuthorizationModelsAreImplementedEachWithTheBlast() public {
        fail("Three authorization models are implemented, each with the blast radius of every key stated as what it can take and what it can irrecoverably destroy");
    }

    /// A scenario is constructed where the pause is the attack rather than the defence, with the
    /// freezing party named
    function test_criterion08_aScenarioIsConstructedWhereThePauseIsThe() public {
        fail("A scenario is constructed where the pause is the attack rather than the defence, with the freezing party named");
    }

    /// Clones are deployed, shown to have no constructor, and the failure from assuming otherwise
    /// is demonstrated
    function test_criterion09_clonesAreDeployedShownToHaveNoConstructorAnd() public {
        fail("Clones are deployed, shown to have no constructor, and the failure from assuming otherwise is demonstrated");
    }

    /// CREATE and CREATE2 are compared with a stated choice, and one sentence names what a clone
    /// cannot do
    function test_criterion10_createAndCreate2AreComparedWithAStatedChoice() public {
        fail("CREATE and CREATE2 are compared with a stated choice, and one sentence names what a clone cannot do");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
