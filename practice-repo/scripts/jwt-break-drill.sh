#!/usr/bin/env bash
# CHAINPATH-GENERATED-SCAFFOLD
# Practice: infra-running-nodes-break-the-jwt
# Run:      bash scripts/jwt-break-drill.sh --capture logs/ --assert-stalled --assert-recovered
#
# This is the tool the exercise asks you to build. It exits non-zero on purpose: an empty
# script that exited 0 would report success for work nobody has done.
#
# What it has to end up doing:
#   1. The captured logs contain the specific authentication-failure line from both the execution
     client and the consensus client, quoted with the client name and version
#   2. Evidence that both processes remained running and that `eth_blockNumber` stopped advancing
     while the secret was mismatched
#   3. After restoring the shared secret the node returns to within 2 blocks of a public endpoint
     without a resync
#   4. A written health-check assertion is given that would have detected this, and it is not "the
     process is up"

set -euo pipefail

echo "TODO: scripts/jwt-break-drill.sh is unimplemented (practice infra-running-nodes-break-the-jwt)" >&2
exit 1
