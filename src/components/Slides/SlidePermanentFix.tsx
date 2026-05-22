import { useState } from 'react';
import { Terminal, CheckCircle2, Bot, Mail, ShieldCheck, FileText, ArrowRight, Layers, HelpCircle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PromptCard {
  id: number;
  role: string;
  avatar: string;
  header: string;
  buttonLabel: string;
  items: string[];
  simulatedOutput: string;
}

const BENTO_CARDS_DATA: PromptCard[] = [
  {
    id: 1,
    role: 'SOFTWARE ENGINEER (IMMEDIATE)',
    avatar: '👩‍💻',
    header: '"How do I fix it?"',
    buttonLabel: 'Synthesize Hotfix Patch',
    items: [
      'Scale postgres_replica_pool allocations',
      'Deploy idempotent transaction retry limits',
      'Inspect recent checkout microservice releases'
    ],
    simulatedOutput: `// PATCH PROPOSAL: FEAT-policy-bind
export async function bindPolicy(transactionId: string) {
  // Check if signature already committed (idempotency safety)
  const existing = await graph.findNode('Policy', { transactionId });
  if (existing) return existing;

  const session = await db.startSession();
  try {
    session.startTransaction();
    const result = await db.policies.create({ id: uuid(), transactionId, stage: 'development' });
    await session.commitTransaction();
    return result;
  } catch (err) {
    await session.abortTransaction();
    throw new ConnectionPoolLimitError('Postgres thread pool full. Queueing...');
  }
}`
  },
  {
    id: 2,
    role: 'QA / DEVELOPER (TEST BOUNDARY)',
    avatar: '🛡️',
    header: '"Write the unit tests"',
    buttonLabel: 'Automate Unit-Tests',
    items: [
      'Assert checkout checkout-success leads to toast status',
      'Mock Postgres connections saturation blockages',
      'Regression test Webhook timeouts limits'
    ],
    simulatedOutput: `describe('Policy Binding State Tests', () => {
  it('should prevent duplicated policy bindings under high-frequency retry', async () => {
    const transactionId = 'tx_razorpay_99a8c';
    // Fire concurrent requests simultaneously to stress idempotency
    const runs = await Promise.all([
      bindPolicy(transactionId),
      bindPolicy(transactionId),
      bindPolicy(transactionId)
    ]);
    const successfulBinds = runs.filter(r => r.id !== null);
    expect(successfulBinds.length).toBe(1); // Idempotent!
  });
});`
  },
  {
    id: 3,
    role: 'SUPPORT LEAD (CLIENT COMMS)',
    avatar: '💬',
    header: '"Tell the customer"',
    buttonLabel: 'Draft Client Notification Email',
    items: [
      'Retrieve Sandbox email accounts logs from tickets',
      'Resolve TKT-9921 queues auto-notifying buyers',
      'Confirm billing refunds within 24 hours'
    ],
    simulatedOutput: `Subject: Resolved: Policy Activation Confirmation [Ref: TKT-9921]

Hi Sandeep,

Our engineering team completed hotfix deployments for incident INC-521 checkout timeouts. Your billing records were successfully matched, and we confirmed your policy-bind activation is completed and verified live.

No action is required from your side. We sincerely apologize for the inconvenience and remain at your disposal.

Empathy Team,
DevRev Support.`
  },
  {
    id: 4,
    role: 'SRE COMPLIANCE (POSTMORTEM)',
    avatar: '🏆',
    header: '"Draft the postmortem"',
    buttonLabel: 'Generate Postmortem Report',
    items: [
      'Pre-populate incident chronology logs',
      'Audit alert count noise reduction indicators',
      'Publish remediation action task list'
    ],
    simulatedOutput: `# Outage Postmortem Report: INC-521
**Incident MTTR**: 18 Minutes (Target SLA: 4 Hours)
**Impact scope**: 12 accounts paged (ARR $140,000 preserved)
**Suppressed Alarms**: 2,160 alarms suppressed (99% noise mitigation)

## Timeline Chronology
- 14:01:42 - Gateway timeouts detected.
- 14:01:47 - AI Core suppression activates; clusters alerts to INC-521.
- 14:03:15 - Developer @dasha paged via Slack.
- 14:07:11 - Pool limits expanded to 4 database replicas.
- 14:18:22 - Hotfix PR #3318 merged; checkout restored.

## Remediation Target Tasks
- [ ] Add pooling baseline benchmarks.
- [x] Merge PR #3318 adding payment transaction locks.`
  }
];

export default function SlidePermanentFix() {
  const [selectedCardId, setSelectedCardId] = useState<number>(1);
  const [activeOutput, setActiveOutput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const selectedCard = BENTO_CARDS_DATA.find(c => c.id === selectedCardId) || BENTO_CARDS_DATA[0];

  const triggerActionShed = (card: PromptCard) => {
    setIsTyping(true);
    setActiveOutput('Connecting context nodes to synthesize output...');

    setTimeout(() => {
      setActiveOutput(card.simulatedOutput);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between items-stretch">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 py-2 items-stretch min-h-[360px]">
        
        {/* Left column: 4 Bento Cards */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
          {BENTO_CARDS_DATA.map((card) => {
            const isSelected = selectedCardId === card.id;
            return (
              <button
                key={card.id}
                id={`bento-card-${card.id}`}
                onClick={() => {
                  setSelectedCardId(card.id);
                  setActiveOutput('');
                }}
                className={`p-4 border rounded-2xl text-left transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-neutral-900 border-neutral-950 text-white shadow-lg translate-x-1 scale-[1.01]'
                    : 'bg-white border-stone-200 text-stone-900 hover:border-indigo-300'
                }`}
              >
                <div>
                  <div className="flex gap-2 items-center">
                    <span className="text-lg">{card.avatar}</span>
                    <span className={`font-mono text-[9px] font-bold ${isSelected ? 'text-indigo-400' : 'text-indigo-600'}`}>
                      {card.role}
                    </span>
                  </div>

                  <h3 className="text-base font-bold mt-2 leading-tight">
                    {card.header}
                  </h3>

                  <ul className="mt-3.5 space-y-1.5 text-xs">
                    {card.items.slice(0, 2).map((item, i) => (
                      <li key={i} className="flex gap-1.5 items-start">
                        <span className="text-stone-400 font-bold">➔</span>
                        <span className={`leading-normal ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100/10 flex items-center justify-between text-[11px] font-semibold text-indigo-500">
                  <span>Activate Prompt Block</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Right column: Action executor with output console */}
        <div className="lg:col-span-6 bg-stone-900 border border-stone-950 rounded-2xl p-4 flex flex-col justify-between overflow-hidden text-stone-300">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <span className="font-mono text-[9px] text-stone-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-indigo-400" /> Auto-Generated Workspace output
              </span>
              <span className="font-mono text-[10px] text-indigo-400 font-bold">
                PROMPT ATTACHED
              </span>
            </div>

            {/* Prompt description */}
            <div className="mt-4 bg-stone-950 p-3 rounded-xl border border-stone-850">
              <div className="font-mono text-[8.5px] text-stone-500 uppercase font-semibold">ROLE SCHEMA TARGET:</div>
              <p className="text-xs font-semibold text-white mt-0.5 leading-snug">
                Computer, answer: {selectedCard.header}
              </p>
            </div>

            {/* Simulated generation content block */}
            <div className="mt-4 flex-1">
              <AnimatePresence mode="wait">
                {isTyping && (
                  <motion.div
                    key="typing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-12 flex flex-col items-center justify-center text-center gap-2.5"
                  >
                    <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                    <p className="font-mono text-[10px] text-indigo-400">
                      Resolving shared graph entities... Assembling code nodes, commits, customer emails and chronology timeline...
                    </p>
                  </motion.div>
                )}

                {!isTyping && !activeOutput && (
                  <motion.div
                    key="empty"
                    className="py-12 flex flex-col items-center justify-center text-center text-stone-500 gap-1.5"
                  >
                    <Terminal className="w-7 h-7 text-stone-600 mb-1" />
                    <p className="text-xs text-stone-400 max-w-[240px]">
                      Click '{selectedCard.buttonLabel}' below to simulate DevRev's AI agent generating outputs across channels simultaneously.
                    </p>
                  </motion.div>
                )}

                {!isTyping && activeOutput && (
                  <motion.div
                    key="resolved"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-stone-950 p-3 rounded-xl border border-stone-850 max-h-[190px] overflow-y-auto"
                  >
                    <pre className="font-mono text-[10.5px] leading-relaxed whitespace-pre-wrap text-stone-200">
                      {activeOutput}
                    </pre>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Action Trigger button */}
          <div className="mt-4 pt-3 border-t border-stone-800 flex flex-col sm:flex-row justify-between items-center gap-3">
            <span className="font-mono text-[10px] text-stone-550 italic">
              * Same knowledge nodes yield zero duplication error models.
            </span>

            <button
              id="bento-action-trigger"
              onClick={() => triggerActionShed(selectedCard)}
              disabled={isTyping}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition font-mono text-[11px] font-semibold w-full sm:w-auto text-center"
            >
              {selectedCard.buttonLabel.toUpperCase()}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
