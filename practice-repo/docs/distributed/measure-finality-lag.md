# Measure the gap between the head and what is actually finalised

Practice: `fundamentals-distributed-measure-finality-lag`
Acceptance: `node scripts/finality-lag.mjs --minutes 60 --out results/finality-lag.json`

## What you are building

Two pieces, deliberately separated:

1. **`scripts/finality-lag.mjs`** — the I/O half. Polls one RPC endpoint once
   per slot for at least an hour, recording `latest`, `safe` and `finalized`
   with your local clock alongside each block's own header timestamp. Writes
   JSON to `results/finality-lag.json`.
2. **`src/distributed/finality-lag.ts`** — the half with an opinion. Lag
   computation, the distribution, exceedance flagging. Already specified by
   `test/distributed/finality-lag.test.ts`; build it first and the script
   becomes plumbing.

`eth_getBlockByNumber` accepts the string tags `safe` and `finalized`. You do
not need a beacon API for this.

## The deliverable is two things, and the second is the hard one

### 1. The distribution

Not a mean. Report min, p50, p90, p99 and max, in **both** blocks and seconds,
over at least 250 samples. Flag every sample where the head-to-finalised gap
exceeded the nominal two-epoch expectation, with its wall-clock timestamp.

Derive seconds from the observed header timestamps, never from
`blockGap * 12`. A missed slot means fewer blocks elapsed for the same
wall-clock gap; assuming a fixed slot time erases exactly the events you spent
an hour sampling to catch.

Write down your quantile convention. Nearest-rank and linear interpolation
disagree at p99 on 300 samples, and you are about to quote a p99 in a
recommendation.

### 2. The confirmation policy

Name three product actions of increasing value. Concrete ones — not "a low
value action" but, say:

- showing a balance update in a UI
- crediting an exchange deposit under $100
- releasing $2M across a bridge

For each, say which of `latest`, `safe` or `finalized` you would gate on, and
attach a number from **your own data** to the justification.

A recommendation of "wait for finalized for everything" is not an answer. Say
what latency that costs the user — your p50 and p99 head-to-finalised seconds
are exactly that cost — and identify where the trade stops being worth it.

## What a good answer addresses

- The observed p99, not just the median, because the policy has to survive the
  tail you actually measured.
- What `safe` means on the client you queried, and whether that matches what
  you assumed it meant. It is a weaker claim than `finalized` and clients have
  differed on it.
- What happens to your policy during the exceedances you flagged. If your
  answer is "the product stalls", say for how long, using your data.
- Whether one RPC endpoint is enough to trust these three numbers at all. You
  are asking a single machine what the network agreed on.

## Common ways this goes wrong

- Sampling `latest`, `safe` and `finalized` in three separate round trips far
  enough apart that the head moved between them. Note the skew or batch them.
- Recording only your local clock and losing the header timestamps, which makes
  the "seconds" half of the distribution unrecoverable after the run.
- Reporting an average lag of "about 13 minutes" and stopping. That number is
  in every blog post already; the reason to run for an hour is the tail.
