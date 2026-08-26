#!/usr/bin/env node
/*
 * Entry point for fundamentals-networks-measure-propagation-delta.
 * Named to match the practice's acceptance command; the measurement itself lives in
 * scripts/networks/propagation-delta.mjs.
 */
import { run } from './networks/propagation-delta.mjs';

await run(process.argv.slice(2));
