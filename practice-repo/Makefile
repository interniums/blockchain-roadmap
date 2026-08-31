# One target, for one practice, and it deliberately does not do the thing.
#
# `scaling-op-stack-derive-it-yourself` runs `make devnet-up && cast rpc optimism_syncStatus`. The
# devnet it wants is the one in the Optimism monorepo: a dozen services, an L1, a sequencer, and a
# Docker Compose file that is upstream's to maintain. Nothing in this repo can stand in for it, and
# a target that started something else and called it a devnet would be worse than this message.
.PHONY: devnet-up

devnet-up:
	@echo "This practice runs against the Optimism devnet, which lives upstream:" >&2
	@echo "" >&2
	@echo "    git clone https://github.com/ethereum-optimism/optimism" >&2
	@echo "    cd optimism && make devnet-up" >&2
	@echo "" >&2
	@echo "Then run the acceptance command from that clone, not from here:" >&2
	@echo "" >&2
	@echo "    cast rpc optimism_syncStatus --rpc-url http://localhost:7545" >&2
	@echo "" >&2
	@echo "Read the derivation pipeline in op-node/rollup/derive while it comes up - that is the" >&2
	@echo "half of the exercise the devnet cannot do for you." >&2
	@exit 1
