import type { Metadata } from 'next';
import { Anatomy, Bars, ByteLayout, Compare, Flow, Matrix, StackTrace, Timeline, Tree } from '@/components/lesson/diagrams';
import { Figure } from '@/components/lesson/mdx';

export const metadata: Metadata = { title: 'Figure kit · Chainpath' };

/**
 * Living reference for the diagram primitives. Every example uses real curriculum data, so this page
 * doubles as the thing an author reads before adding a figure and the thing that breaks loudly if a
 * primitive regresses.
 */
function Section({ name, when, only, children }: { name: string; when: string; only?: string; children: React.ReactNode }) {
  if (only && only.toLowerCase() !== name.toLowerCase()) return null;
  return (
    <section id={name.toLowerCase()} className="scroll-mt-4 border-t border-[var(--color-rule)] py-8">
      <h2 className="m-0 font-mono text-[15px] font-semibold">{`<${name}>`}</h2>
      <p className="mb-4 mt-1 text-[13.5px] text-[var(--color-ink-2)]">{when}</p>
      {children}
    </section>
  );
}

export default async function FigureKit({ searchParams }: { searchParams: Promise<{ only?: string }> }) {
  const { only } = await searchParams;
  return (
    <main className="mx-auto max-w-[760px] px-8 py-12">
      <h1 className="m-0 text-[24px] font-semibold tracking-tight">Figure kit</h1>
      <p className="mt-2 text-[14.5px] text-[var(--color-ink-2)]">
        Nine primitives. Authors supply data; layout is computed. Every example below is real
        curriculum content, not filler.
      </p>

      <Section only={only} name="Flow" when="A process with ordered steps. Stack two nodes in one column to show a fork.">
        <Figure caption="A transaction from signature to finality." alt="Transaction lifecycle in six stages.">
          <Flow
            lanes={['local', 'network', 'block', 'consensus']}
            nodes={[
              { id: 'sign', label: 'sign', note: 'secp256k1', col: 0, tone: 'accent' },
              { id: 'pool', label: 'mempool', note: 'public', col: 1 },
              { id: 'priv', label: 'private relay', note: 'skips the pool', col: 1, tone: 'warn', dashed: true },
              { id: 'build', label: 'builder', note: 'orders by bid', col: 2 },
              { id: 'prop', label: 'proposer', note: 'signs header', col: 3, tone: 'accent' },
              { id: 'fin', label: 'finalised', note: '2 epochs', col: 4, tone: 'good' },
            ]}
            edges={[
              { from: 'sign', to: 'pool' },
              { from: 'sign', to: 'priv', tone: 'warn', dashed: true },
              { from: 'pool', to: 'build' },
              { from: 'priv', to: 'build', tone: 'warn', dashed: true },
              { from: 'build', to: 'prop', label: 'bid' },
              { from: 'prop', to: 'fin', tone: 'good' },
            ]}
          />
        </Figure>
      </Section>

      <Section only={only} name="FlowDown" when='dir="down" runs the process vertically; lanes then label rows, in a left gutter.'>
        <Figure caption="A proof leaves the prover, and every stage below can reject it." alt="Vertical flow from witness generation to on-chain verification.">
          <Flow
            dir="down"
            lanes={['off-chain', 'aggregate', 'on-chain']}
            nodes={[
              { id: 'w', label: 'witness', note: 'execution trace', col: 0 },
              { id: 'p', label: 'prove', note: 'the expensive step', col: 0, tone: 'warn' },
              { id: 'agg', label: 'aggregate', note: 'many proofs, one', col: 1, tone: 'accent' },
              { id: 'v', label: 'verifier contract', note: 'pairing check', col: 2 },
              { id: 'ok', label: 'root accepted', col: 2, tone: 'good' },
            ]}
            edges={[
              { from: 'w', to: 'p' }, { from: 'p', to: 'agg', tone: 'warn' },
              { from: 'agg', to: 'v', tone: 'accent' }, { from: 'v', to: 'ok', tone: 'good' },
            ]}
          />
        </Figure>
      </Section>

      <Section only={only} name="Reentry" when="An edge that runs backwards routes through a channel below the nodes.">
        <Figure caption="The withdraw frame has not zeroed the balance yet when the attacker re-enters it." alt="Checks-effects-interactions violated: the external call re-enters withdraw before the balance is written.">
          <Flow
            nodes={[
              { id: 'w', label: 'withdraw()', note: 'checks balance', col: 0, tone: 'accent' },
              { id: 'c', label: 'call{value}', note: 'attacker receives', col: 1, tone: 'warn' },
              { id: 'z', label: 'balance = 0', note: 'never reached in time', col: 2, tone: 'muted', dashed: true },
            ]}
            edges={[
              { from: 'w', to: 'c' },
              { from: 'c', to: 'z' },
              { from: 'c', to: 'w', label: 're-enters, balance still set', tone: 'danger' },
            ]}
          />
        </Figure>
      </Section>

      <Section only={only} name="ReentryDown" when="A back-edge in a vertical flow routes beside the nodes, never down the centreline through them.">
        <Figure caption="A reorg sends the cursor back to the last finalised block, and processing resumes from there." alt="Vertical pipeline with a rollback edge returning to the finalised checkpoint.">
          <Flow
            dir="down"
            lanes={['tail', 'apply', 'commit']}
            nodes={[
              { id: 'r', label: 'read block', note: 'at head', col: 0 },
              { id: 'a', label: 'apply events', col: 1 },
              { id: 'c', label: 'advance cursor', col: 2, tone: 'good' },
              { id: 'x', label: 'reorg detected', note: 'head changed under us', col: 3, tone: 'warn' },
            ]}
            edges={[
              { from: 'r', to: 'a' }, { from: 'a', to: 'c' }, { from: 'c', to: 'x' },
              { from: 'x', to: 'r', label: 'rewind to finalised', tone: 'plain' },
            ]}
          />
        </Figure>
      </Section>

      <Section only={only} name="ByteLayout" when="Encodings: calldata, storage slots, tx envelopes, blobs.">
        <Figure caption="A type-2 transaction envelope. The type byte is outside the RLP list." alt="EIP-1559 transaction fields.">
          <ByteLayout
            caption="0x02 || rlp([...])"
            fields={[
              { label: 'type', size: 1, tone: 'accent', note: '0x02' },
              { label: 'chainId', size: 1 },
              { label: 'nonce', size: 1 },
              { label: 'maxPriorityFee', size: 8, tone: 'warn' },
              { label: 'maxFee', size: 8, tone: 'warn' },
              { label: 'gasLimit', size: 4 },
              { label: 'to', size: 20 },
              { label: 'value', size: 32 },
              { label: 'data', variable: true, tone: 'muted' },
              { label: 'accessList', variable: true, tone: 'muted' },
              { label: 'y,r,s', size: 65, tone: 'good' },
            ]}
          />
        </Figure>
        <Figure caption="Three values packed into one 32-byte slot — one SSTORE instead of three." alt="Storage slot packing.">
          <ByteLayout proportional offsets unit="bytes"
            fields={[
              { label: 'unused', size: 5, tone: 'muted' },
              { label: 'uint32 id', size: 4, tone: 'accent' },
              { label: 'uint64 ts', size: 8, tone: 'warn' },
              { label: 'address owner', size: 20, tone: 'good' },
            ]}
          />
        </Figure>
      </Section>

      <Section only={only} name="Anatomy" when="One literal, bracketed and named. The diagram for 'what are these bytes'.">
        <Figure caption="An ERC-20 transfer, decoded from the wire." alt="Calldata for transfer(address,uint256).">
          <Anatomy
            value="0xa9059cbb0000000000000000000000005b38da6a701c568545dcfcb03fcb875f56beddc40000000000000000000000000000000000000000000000000de0b6b3a7640000"
            parts={[
              { from: 0, to: 2, label: '0x', tone: 'muted' },
              { from: 2, to: 10, label: 'selector', note: 'keccak("transfer(address,uint256)")[0:4]', tone: 'accent' },
              { from: 10, to: 74, label: 'to', note: 'left-padded to 32 bytes', tone: 'warn' },
              { from: 74, to: 138, label: 'amount', note: '1e18 = 1 token', tone: 'good' },
            ]}
          />
        </Figure>
      </Section>

      <Section only={only} name="Formula" when="An equation is a monospace string, so <Anatomy> brackets its operands like any other literal.">
        <Figure caption="Gas sets the floor and slippage sets the ceiling; between them is the only profitable window." alt="Liquidator profit as bonus minus gas minus slippage, with each term named.">
          <Anatomy
            value="profit(V) = b·V - G - V²/R"
            parts={[
              { from: 0, to: 9, label: 'profit', note: 'at repayment size V', tone: 'accent' },
              { from: 12, to: 15, label: 'bonus', note: 'grows linearly', tone: 'good' },
              { from: 18, to: 19, label: 'gas', note: 'fixed, sets the floor', tone: 'warn' },
              { from: 22, to: 26, label: 'slippage', note: 'grows quadratically', tone: 'danger' },
            ]}
          />
        </Figure>
      </Section>

      <Section only={only} name="Timeline" when="Measured time: slots, epochs, challenge windows, exit delays.">
        <Figure caption="Where an optimistic rollup withdrawal actually spends its week." alt="Optimistic rollup withdrawal timeline.">
          <Timeline
            from={0} to={7} unit="days" ticks={[0, 1, 3, 7]}
            marks={[{ at: 0, label: 'withdraw() on L2' }, { at: 7, label: 'claim on L1', tone: 'good' }]}
            spans={[
              { label: 'batch posted to L1', start: 0, end: 0.3, tone: 'accent' },
              { label: 'output root proposed', start: 0.3, end: 1, tone: 'accent' },
              { label: 'fault-proof window', start: 1, end: 7, tone: 'warn', note: 'anyone may challenge' },
            ]}
          />
        </Figure>
      </Section>

      <Section only={only} name="Tree" when="Hierarchies: Merkle and Patricia tries, call trees, proof paths.">
        <Figure caption="A Merkle proof is the siblings, not the leaves." alt="Merkle tree with a highlighted proof path.">
          <Tree root={{
            label: 'root', tone: 'accent',
            children: [
              { label: 'H(AB)', tone: 'muted', note: 'in proof', dashed: true,
                children: [{ label: 'A' }, { label: 'B' }] },
              { label: 'H(CD)', tone: 'accent',
                children: [
                  { label: 'C', tone: 'muted', note: 'in proof', dashed: true },
                  { label: 'D', tone: 'good', note: 'the leaf' },
                ] },
            ],
          }} />
        </Figure>
      </Section>

      <Section only={only} name="StackTrace" when="The EVM as a machine you can watch. Marks the entries that moved.">
        <Figure caption="SUB takes the second item from the top minus the top — the reverse of how it reads." alt="Stack evolution across four opcodes.">
          <StackTrace steps={[
            { op: 'PUSH1 0x0a', stack: ['0x0a'], gas: 3, changed: [0], tone: 'accent' },
            { op: 'PUSH1 0x03', stack: ['0x03', '0x0a'], gas: 3, changed: [0], tone: 'accent' },
            { op: 'SUB', stack: ['0xfff…fd'], gas: 3, changed: [0], tone: 'warn', note: '3 - 10, wrapped' },
            { op: 'POP', stack: [], gas: 2 },
          ]} />
        </Figure>
      </Section>

      <Section only={only} name="Bars" when="A magnitude series. Log scale when the honest range spans orders of magnitude.">
        <Figure caption="A cold storage read costs twenty-one times a warm one; a first write, two hundred times." alt="Gas cost of five storage operations on a log scale.">
          <Bars
            scale="log" unit="gas" axisLabel="cost of one operation"
            items={[
              { label: 'SSTORE zero→non-zero', value: 20000, tone: 'danger', note: 'plus a cold surcharge' },
              { label: 'SSTORE non-zero→non-zero', value: 2900, tone: 'warn' },
              { label: 'SLOAD cold', value: 2100, tone: 'warn' },
              { label: 'SLOAD warm', value: 100, tone: 'good' },
              { label: 'TSTORE / TLOAD', value: 100, tone: 'accent', note: 'flat — no cold tier' },
            ]}
          />
        </Figure>
      </Section>

      <Section only={only} name="Compare" when="Two or three systems held against the same questions.">
        <Compare
          axis="Question"
          columns={[
            { title: 'EVM', note: 'Ethereum', tone: 'accent' },
            { title: 'SVM', note: 'Solana', tone: 'warn' },
          ]}
          rows={[
            { label: 'How is work metered?', cells: ['Gas, priced in wei by a fee market', 'Compute units, with no exchange rate to lamports'] },
            { label: 'When is state discovered?', cells: ['Mid-execution, by any SLOAD', 'Declared up front in the account list'] },
            { label: 'Can transactions run in parallel?', cells: ['No — any tx may touch any slot', 'Yes, when declared account sets are disjoint'] },
            { label: 'Where does code live?', cells: ['In the account being called', 'In a separate executable account'] },
          ]}
        />
      </Section>

      <Section only={only} name="Matrix" when="A dense grid. Numbers get tabular figures so magnitudes line up.">
        <Matrix
          numeric corner="Opcode" cols={['Cold', 'Warm', 'Set by']}
          rows={[
            { label: 'SLOAD', cells: [{ v: '2,100', tone: 'warn' }, { v: '100', tone: 'good' }, 'EIP-2929'] },
            { label: 'BALANCE', cells: [{ v: '2,600', tone: 'warn' }, { v: '100', tone: 'good' }, 'EIP-2929'] },
            { label: 'CALL', cells: [{ v: '2,600', tone: 'warn' }, { v: '100', tone: 'good' }, 'EIP-2929'] },
            { label: 'SSTORE (zero→non-zero)', cells: [{ v: '22,100', tone: 'danger' }, { v: '20,000', tone: 'danger' }, 'EIP-2200'] },
          ]}
        />
      </Section>
    </main>
  );
}
