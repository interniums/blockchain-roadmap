# Price a finality reversal from live data, in ETH, refusing to guess

Practice: `fundamentals-incentives-price-the-attack-live`
Acceptance: `node scripts/attack-cost.mjs --source beacon --out results/attack-cost.json`

## What you are building

`scripts/attack-cost.mjs` — fetches live stake data, calls into
`src/incentives/attack-cost.ts`, writes `results/attack-cost.json`.

The arithmetic and the printing rules are already specified by
`test/incentives/attack-cost.test.ts`. The script is the network half.

## The number

One third of total staked ETH. Reverting a finalised checkpoint requires two
conflicting supermajority links, which pins at least one third of stake as
provably equivocating and therefore slashable.

**Do not multiply validator count by 32.** Since EIP-7251 raised the maximum
effective balance to 2048 ETH, validator count and total stake have decoupled.
Read the aggregate balance from your source. This is the single error the
exercise is built to catch, and it now silently understates the answer.

## The output rules, which are half the point

- Always print the ETH figure, the validator count, the fetch timestamp, and
  the **source URL**.
- Print **no fiat figure at all** unless `--eth-price` was supplied. Running
  without it must still exit successfully.
- When a price is supplied, label the fiat output as a **derived estimate** and
  echo back the price and the timestamp it was taken at.

Reported August 2026 staked totals disagree between sources. Record which one
you used rather than picking the number you like. A number someone can check
beats a number someone has to trust.

## The memo, which is the harder half

Name one specific application — a bridge, an exchange deposit flow, an L2 exit.
Not "a DeFi protocol". A named thing with a documented trust model.

Then map at least three of its distinct trust assumptions onto the three attack
thresholds, each with a number attached:

| Threshold | What it buys an attacker | Roughly what it costs |
| --- | --- | --- |
| Cheap unfinalised reorg | reorder or drop recent blocks | very little |
| Majority-stake censorship | exclude transactions for a period | cost of capital |
| Finality reversal | contradict a finalised checkpoint | one third of stake, slashed |

For each assumption ask, in this order:

1. Would this break if a single unfinalised block were reorged?
2. Would this break if transactions were censored for an hour?
3. Would this break only if a finalised checkpoint were reversed?

Only the third question is about the number you just computed. Most
application-level trust assumptions turn out to depend on the first, which is
nearly free to attack — and that gap between "what secures the chain" and "what
secures my application" is the finding.

## What a good answer addresses

- The distinction between cost of corruption, cost of capital, and attacker
  profit. Your one-third figure is only the first of the three.
- Why attack cost is not attack profit, and why an attack that costs $30B is
  still worth doing if it unlocks $60B.
- What the number does *not* cover: social slashing, the market impact of
  acquiring the stake, and whether the stake could be borrowed rather than
  bought.
- Why a fiat figure stamped ninety seconds ago is a different kind of claim
  from an ETH figure.
