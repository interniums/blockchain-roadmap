// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";
import {LogsApi} from "../src/evm-logs-bloom/LogsApi.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-logs-bloom-the-api-you-shipped  (break, grain block, difficulty 3)
 * Run:      forge test --junit --match-path test/LogsApi.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Logs are a one-way channel, and the shape you emit is a contract with everyone downstream
 *   whether you meant it or not. WRITE-ONLY. Write a contract that tries to read one of its own
 *   past events and show it cannot. Then show that logs are nonetheless committed to by the
 *   block, by proving one against the receipts root. Both facts are true at once and the pair is
 *   the point. REVERTS TAKE THEM. Emit an event and then revert the frame. Show the log absent.
 *   Then emit in a sub-call that reverts while the outer call succeeds, and show what happens to
 *   that log. State the rule. QUERY IT PROPERLY. Emit fifty events across several blocks with
 *   varied indexed arguments. Then write four queries against them that demonstrate the topic
 *   semantics: match on the first topic only, match on a later topic, match either of two values
 *   in one position, and a query that returns nothing because the positional rule was
 *   misunderstood. Explain that last one. THE API. Now change the event: reorder two arguments
 *   and move one from indexed to unindexed. Show which of your four queries break and which
 *   silently return wrong results. The silent ones are the finding. Close with the versioning
 *   rule you would adopt, in one sentence.
 */
contract LogsApiTest is Test {
    /// The subject, from src/evm-logs-bloom/LogsApi.sol. Add functions there and call them here.
    LogsApi internal subject;

    function setUp() public {
        subject = new LogsApi();
    }

    /// A contract is shown unable to read its own past event
    function test_criterion01_aContractIsShownUnableToReadItsOwn() public {
        fail("A contract is shown unable to read its own past event");
    }

    /// A log is proven against the receipts root, showing it is committed to despite being
    /// unreadable on chain
    function test_criterion02_aLogIsProvenAgainstTheReceiptsRootShowing() public {
        fail("A log is proven against the receipts root, showing it is committed to despite being unreadable on chain");
    }

    /// An event emitted before a revert is shown absent, and one from a reverting sub-call under a
    /// succeeding outer call is shown with the rule stated
    function test_criterion03_anEventEmittedBeforeARevertIsShownAbsent() public {
        fail(
            "An event emitted before a revert is shown absent, and one from a reverting sub-call under a succeeding outer call is shown with the rule stated"
        );
    }

    /// Four queries demonstrate first-topic matching, later-topic matching, either-of-two matching,
    /// and a positional misunderstanding returning nothing
    function test_criterion04_fourQueriesDemonstrateFirstTopicMatchingLaterTopicMatching() public {
        fail(
            "Four queries demonstrate first-topic matching, later-topic matching, either-of-two matching, and a positional misunderstanding returning nothing"
        );
    }

    /// The positional failure is explained
    function test_criterion05_thePositionalFailureIsExplained() public {
        fail("The positional failure is explained");
    }

    /// Reordering arguments and unindexing one is shown breaking some queries and silently
    /// corrupting others
    function test_criterion06_reorderingArgumentsAndUnindexingOneIsShownBreakingSome() public {
        fail("Reordering arguments and unindexing one is shown breaking some queries and silently corrupting others");
    }

    /// The silently wrong cases are identified as such
    function test_criterion07_theSilentlyWrongCasesAreIdentifiedAsSuch() public {
        fail("The silently wrong cases are identified as such");
    }

    /// A one-sentence versioning rule is stated
    function test_criterion08_aOneSentenceVersioningRuleIsStated() public {
        fail("A one-sentence versioning rule is stated");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
