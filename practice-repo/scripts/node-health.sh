#!/usr/bin/env bash
# CHAINPATH-GENERATED-SCAFFOLD
# Practice: infra-running-nodes-bring-up-a-pair
# Run:      bash scripts/node-health.sh --require-synced --max-lag 2
#
# This is the tool the exercise asks you to build. It exits non-zero on purpose: an empty
# script that exited 0 would report success for work nobody has done.
#
# What it has to end up doing:
#   1. `eth_syncing` returns false against your own endpoint
#   2. Your node's `eth_blockNumber` is within 2 blocks of a public endpoint for the same network
#   3. The compose file mounts one shared jwtsecret path into both services and does not publish
     8551 outside the container network
#   4. A written note names which half of the pair is the minority client and the network-level
     reason for that choice

set -euo pipefail

echo "TODO: scripts/node-health.sh is unimplemented (practice infra-running-nodes-bring-up-a-pair)" >&2
exit 1
