// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: defi-concentrated-liquidity-position-amounts  (implement, grain module, difficulty 4)
 * Run:      forge test --match-path test/PositionAmounts.t.sol --fork-url $ETH_RPC_URL -vv
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Implement, in Solidity, a pure function that takes a lower tick, an upper tick, a current
 *   sqrtPriceX96 and a liquidity L, and returns the amounts of token0 and token1 the position
 *   holds. Handle all three cases: current price below the range, inside it, and above it. Do
 *   the tick to sqrtPrice conversion yourself rather than calling a library, and reproduce the
 *   protocol's rounding direction. Then, on a mainnet fork, pick a real Uniswap v3 position,
 *   read its ticks and liquidity from the position manager and the pool's slot0, and compare
 *   your computed amounts against the amounts the protocol itself reports for that position.
 */
contract PositionAmountsTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// Your computed token0 and token1 for a live position match the protocol's own figures to
    /// within one wei per token
    function test_criterion01_yourComputedToken0AndToken1ForALivePosition() public {
        fail("Your computed token0 and token1 for a live position match the protocol's own figures to within one wei per token");
    }

    /// Unit tests cover price below range (all token0), above range (all token1) and inside the
    /// range
    function test_criterion02_unitTestsCoverPriceBelowRangeAllToken0Above() public {
        fail("Unit tests cover price below range (all token0), above range (all token1) and inside the range");
    }

    /// A test asserts your tick-to-sqrtPrice conversion matches the protocol's for at least ten
    /// ticks spread across the usable range, including negative ticks
    function test_criterion03_aTestAssertsYourTickToSqrtpriceConversionMatches() public {
        fail("A test asserts your tick-to-sqrtPrice conversion matches the protocol's for at least ten ticks spread across the usable range, including negative ticks");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
