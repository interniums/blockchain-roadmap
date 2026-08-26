#!/usr/bin/env node
/*
 * Entry point for fundamentals-networks-diff-two-mempools.
 * Named to match the practice's acceptance command; the measurement itself lives in
 * scripts/networks/mempool-diff.mjs.
 */
import { run } from './networks/mempool-diff.mjs';

await run(process.argv.slice(2));
