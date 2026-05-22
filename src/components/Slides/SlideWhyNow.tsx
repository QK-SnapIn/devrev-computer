import { useState } from 'react';
import { Sparkles, CheckCircle2, ChevronRight, FileText, Download, Calendar, ArrowRight, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProposalResult {
  tierName: string;
  workflow: string;
  ingest: string;
  timeline: Array<{ days: string; task: string; sub: string }>;
  successMetric: string;
}

export default function SlideWhyNow() {
  // Input builders
  const [clientTier, setClientTier] = useState<string>('Growth Tier');
  const [targetWorkflow, setTargetWorkflow] = useState<string>('Telemetry alert storms');
  const [ingestionSource, setIngestionSource] = useState<string>('PLuG Web SDK');
  const [isBuildingProposal, setIsBuildingProposal] = useState<boolean>(false);
  const [proposal, setProposal] = useState<ProposalResult | null>(null);

  const buildPilotProposalPlan = () => {
    setIsBuildingProposal(true);
    setProposal(null);

    setTimeout(() => {
      let timelinePlan = [
        { days: 'Days 1–3', task: 'AirSync Schema Connection & Webhook Setup', sub: 'Establish bidirectional mapping sync to legacy tickets (Jira/ZD).' },
        { days: 'Days 4–7', task: 'Agent Builder Studio Integration', sub: 'Compose customized routing prompt templates and golden test regressions.' },
        { days: 'Days 8–10', task: 'Unified Knowledge Graph Tracing', sub: 'Simulate telemetry alert spikes and trace directly to the checkout part catalog.' },
        { days: 'Days 11–14', task: 'The Judge Assessment & ROI Clearance', sub: 'Compare Mttr metrics, review noise suppression percentages, roll out handoff.' }
      ];

      setProposal({
        tierName: clientTier,
        workflow: targetWorkflow,
        ingest: ingestionSource,
        timeline: timelinePlan,
        successMetric: targetWorkflow.includes('storms')
          ? '95% alerts suppression, Consolidated 1 prioritised incident page.'
          : targetWorkflow.includes('refund')
          ? 'MTTR dropped from 2 hours to sub-10 minutes via PLuG auto-reconciliations.'
          : 'PR draft hotfixes pre-created in 90 seconds, validated by automated regressions.'
      });
      setIsBuildingProposal(false);
    }, 1500);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between items-stretch">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 py-2 items-stretch min-h-[360px]">
        
        {/* Left Side: Setup parameters inputs */}
        <div className="lg:col-span-5 bg-white border border-stone-200 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <span className="font-mono text-xs text-stone-500 tracking-wider font-semibold uppercase">
                Interactive Proposal setup
              </span>
              <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
            </div>

            {/* Input 1 */}
            <div>
              <label className="block font-mono text-[10px] text-stone-400 uppercase tracking-wider font-semibold mb-1">
                Establish Company Scale:
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
                {['Startup Scale', 'Growth Tier', 'Large Enterprise'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setClientTier(t)}
                    className={`py-1.5 px-1 rounded border text-[10px] transition font-semibold font-sans ${
                      clientTier === t
                        ? 'bg-indigo-50 border-indigo-400 text-indigo-700'
                        : 'bg-stone-50 border-stone-150 text-stone-500'
                    }`}
                  >
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Input 2 */}
            <div>
              <label className="block font-mono text-[10px] text-stone-400 uppercase tracking-wider font-semibold mb-1.5">
                Target Noisest Workspace Friction:
              </label>
              <select
                id="target-friction-select"
                value={targetWorkflow}
                onChange={(e) => setTargetWorkflow(e.target.value)}
                className="w-full border border-stone-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none bg-white font-semibold text-stone-850"
              >
                <option value="Telemetry alert storms">Telemetry alert storms & flapping</option>
                <option value="Customer payment timeouts">Customer payment & policy timeouts</option>
                <option value="Jira multi-surface syncing delays">Jira multi-surface syncing delays</option>
                <option value="Slow manual regression/code validations">Slow manual regression/code validations</option>
              </select>
            </div>

            {/* Input 3 */}
            <div>
              <label className="block font-mono text-[10px] text-stone-400 uppercase tracking-wider font-semibold mb-1.5">
                Primary Intake channel:
              </label>
              <select
                id="intake-channel-select"
                value={ingestionSource}
                onChange={(e) => setIngestionSource(e.target.value)}
                className="w-full border border-stone-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none bg-white font-semibold text-stone-850"
              >
                <option value="PLuG Web SDK">PLuG Web SDK (Chat + Telemetry)</option>
                <option value="Zendesk Live Support Inbox">Zendesk Live Support Inbox</option>
                <option value="Intercom messaging integration">Intercom messaging integration</option>
                <option value="Slack channels sync lines">Slack channels sync lines</option>
              </select>
            </div>
          </div>

          <button
            id="build-proposal-btn"
            onClick={buildPilotProposalPlan}
            disabled={isBuildingProposal}
            className={`w-full py-3 rounded-xl font-mono text-xs font-bold border transition flex items-center justify-center gap-2 ${
              isBuildingProposal
                ? 'bg-stone-200 border-stone-300 text-stone-500 cursor-not-allowed'
                : 'bg-indigo-600 border-indigo-700 hover:bg-indigo-700 text-white hover:shadow-md animate-pulse'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            {isBuildingProposal ? 'DESIGNING CUSTOM MILESTONES...' : 'ASSEMBLE CUSTOM PILOT PROPOSAL'}
          </button>
        </div>

        {/* Right Side: Generated Proposal display */}
        <div className="lg:col-span-7 bg-stone-900 border border-stone-950 rounded-2xl p-4 flex flex-col justify-between overflow-hidden text-stone-300">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <span className="font-mono text-[9px] text-stone-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-400" /> DevRev Bespoke Pilot Outline
              </span>
              <span className="font-mono text-[10px] text-indigo-400 font-bold">
                ESTIMATED TIMELINE: 2 WEEKS
              </span>
            </div>

            <div className="mt-4 flex-1">
              <AnimatePresence mode="wait">
                {isBuildingProposal && (
                  <motion.div
                    key="building"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-14 flex flex-col items-center justify-center text-center gap-3"
                  >
                    <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                    <p className="font-mono text-[11px] text-indigo-400">
                      Creating bespoke milestones tailored to target friction: {targetWorkflow} ... Mapping ingestion channels...
                    </p>
                  </motion.div>
                )}

                {!isBuildingProposal && !proposal && (
                  <motion.div
                    key="empty"
                    className="py-14 flex flex-col items-center justify-center text-center text-stone-500 gap-3"
                  >
                    <Calendar className="w-8 h-8 text-stone-600 mb-1" />
                    <h3 className="text-sm font-bold text-stone-300">Assemble Your 2-Week Trial</h3>
                    <p className="text-xs text-stone-400 max-w-[280px]">
                      Configure parameters on the left and click "Assemble proposal" to generate a direct step-by-step pilot schedule custom-fit to your noise parameters.
                    </p>
                  </motion.div>
                )}

                {!isBuildingProposal && proposal && (
                  <motion.div
                    key="proposal"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {/* Meta tags */}
                    <div className="flex flex-wrap gap-2.5 font-mono text-[9px] bg-stone-950/40 p-2 border border-stone-850 rounded-xl justify-between items-center">
                      <div>TARGET SCALE: <span className="text-indigo-400 font-bold">{proposal.tierName.toUpperCase()}</span></div>
                      <div>INGEST CHANNEL: <span className="text-indigo-400 font-bold">{proposal.ingest.toUpperCase()}</span></div>
                    </div>

                    {/* Timeline Stages list */}
                    <div className="space-y-2">
                      {proposal.timeline.map((step, i) => (
                        <div key={i} className="flex gap-3 text-xs p-2 bg-stone-950/20 rounded-lg border border-stone-850 items-center">
                          <span className="font-mono text-[9px] bg-indigo-950 border border-indigo-900/30 text-indigo-400 px-2 py-0.5 rounded font-bold whitespace-nowrap min-w-[70px] text-center">
                            {step.days}
                          </span>
                          <div className="min-w-0">
                            <h4 className="font-bold text-white font-sans text-xs">{step.task}</h4>
                            <p className="text-[10.5px] text-stone-400 leading-snug mt-0.5">{step.sub}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Target Metric preservation */}
                    <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-xl flex gap-2.5 items-start">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      <div>
                        <div className="font-mono text-[8.5px] text-emerald-400 font-bold uppercase tracking-wider">PROJECTED PILOT ROI OUTCOME:</div>
                        <p className="text-[11.5px] text-stone-200 mt-1 leading-relaxed">
                          {proposal.successMetric}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-4 p-3 bg-stone-950 rounded-xl border border-stone-850 flex justify-between items-center font-mono text-[10px] text-stone-500 leading-normal">
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-stone-400" /> Pick your noisiest workflow. We'll co-design on real graph data in weeks.
            </span>
            <button
              onClick={() => alert(`Copied pilot proposal summary outlining: ${targetWorkflow} connecting through ${ingestionSource}!`)}
              className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 transition"
            >
              SAVE PROPOSAL <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
