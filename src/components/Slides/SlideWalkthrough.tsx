import { useState } from 'react';
import { Play, CheckCircle2, Clock, Users, ArrowRight, UserCheck, ShieldAlert, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WalkthroughStep {
  id: number;
  label: string;
  sub: string;
  who: string;
  timeStr: string;
  col: string;
  bgCol: string;
  borderCol: string;
  textCol: string;
  info: string;
  chatLog: Array<{ sender: string; avatar: string; text: string; time: string }>;
}

const WALKTHROUGH_STAGES: WalkthroughStep[] = [
  {
    id: 1,
    label: 'Detect',
    sub: 'Ingestion of signals',
    who: 'Razorpay / Dynatrace',
    timeStr: 'T=0',
    col: '#a8aebe',
    bgCol: 'bg-stone-100',
    borderCol: 'border-stone-300',
    textCol: 'text-stone-700',
    info: 'Dynatrace logs trace a spike in HTTP 504 gateway failures. In parallel, Razorpay webhooks report successful payment captures, but policy binding systems stay silent.',
    chatLog: [
      { sender: 'TELEMETRY', avatar: '🤖', text: 'Spike in gateway timeouts detected: POST /api/insurance/purchase-policy. HTTP fail-rate at 18.2%.', time: '14:01:42' },
      { sender: 'SRE ON-CALL', avatar: '👨‍💻', text: 'Acknowledged. Checking if related database pools are struggling.', time: '14:01:50' }
    ]
  },
  {
    id: 2,
    label: 'Validate',
    sub: 'AI Core noise gating',
    who: 'Observability' ,
    timeStr: '+5S',
    col: '#6366f1',
    bgCol: 'bg-indigo-50',
    borderCol: 'border-indigo-200',
    textCol: 'text-indigo-700',
    info: 'AI Core suppresses duplicate system alarms. Identifies specific transaction error signatures: database connection replica limits reached.',
    chatLog: [
      { sender: 'AI AGENT', avatar: '🤖', text: 'Analyzing 245 raw alarm lines. Suppress rate: 91.2%. Flagging postgres_replica_pool saturation.', time: '14:01:47' },
      { sender: 'THE JUDGE', avatar: '🛡️', text: 'Rule verify: Alert matches priority P1 signature template. Initialized active tracking path.', time: '14:01:48' }
    ]
  },
  {
    id: 3,
    label: 'Correlate',
    sub: 'Graph hop clustering',
    who: 'AI Core Router',
    timeStr: '+20S',
    col: '#6366f1',
    bgCol: 'bg-indigo-50 border-indigo-350',
    borderCol: 'border-indigo-400',
    textCol: 'text-indigo-800',
    info: 'The correlated incident INC-521 maps across entities: links the alert storm incident with the Policy Bind Code Part, the development sprint iteration, and 12 incoming support tickets.',
    chatLog: [
      { sender: 'AI CORE', avatar: '🤖', text: 'Clustered 8 independent telemetry streams into INC-521. Connected Ticket TKT-9921 to Catalog FEAT-policy-bind.', time: '14:02:02' },
      { sender: 'SRE ON-CALL', avatar: '👨‍💻', text: 'Superb. We have one master ticket instead of 8 duplicates spammed across channels.', time: '14:02:05' }
    ]
  },
  {
    id: 4,
    label: 'Triage',
    sub: 'Account impact routing',
    who: 'Escalations / SLA',
    timeStr: '+90S',
    col: '#f97316',
    bgCol: 'bg-orange-50',
    borderCol: 'border-orange-200',
    textCol: 'text-orange-700',
    info: 'Priors are resolved. Support registers incoming customer complaints. PLuG Chat identifies active failures; matches user profiles to premium SLA tiers and alerts on-call owner.',
    chatLog: [
      { sender: 'PLuG SUPPORT', avatar: '💬', text: 'Customer support request (sndpblgr5@gmail.com): "Policy checkout timed out but charged." SLA threshold: Severe.', time: '14:03:12' },
      { sender: 'AI CORE', avatar: '🤖', text: 'Auto-linked user account to master ticket INC-521. Assignee owner paged: @dasha.', time: '14:03:15' }
    ]
  },
  {
    id: 5,
    label: 'Mitigate',
    sub: 'Active troubleshooting',
    who: '@dasha (Checkout Team)',
    timeStr: '+6M',
    col: '#0f766e',
    bgCol: 'bg-teal-50',
    borderCol: 'border-teal-200',
    textCol: 'text-teal-700',
    info: 'On-call developer dasha accesses the incident context on the shared board. Reviews the exact session click trace alongside DB logs, scaling postgres replica count to safely reconcile transactions.',
    chatLog: [
      { sender: 'dasha', avatar: '👧', text: 'Looking at the Postgres connection logs. Connection pool limits exceeded due to sticky threads. Scaling replica count to 4.', time: '14:07:11' },
      { sender: 'SRE ON-CALL', avatar: '👨‍💻', text: 'Confirming DB connection pool count relaxed. Webhook timeouts dropping to normal.', time: '14:07:44' }
    ]
  },
  {
    id: 6,
    label: 'Resolve',
    sub: 'Permanent code fix',
    who: '@dasha + Code Agent',
    timeStr: '+18M',
    col: '#0f766e',
    bgCol: 'bg-emerald-50',
    borderCol: 'border-emerald-250',
    textCol: 'text-emerald-800',
    info: 'Code Agent auto-drafts hotfix PR #3318 adding payment state idempotency checks. dasha approves the code changes and merges them safely to production. PLuG auto-replies to customers.',
    chatLog: [
      { sender: 'CODE AGENT', avatar: '🤖', text: 'Drafted Hotfix PR #3318 adding payment signature verification. Passing unit tests (14/14).', time: '14:15:11' },
      { sender: 'dasha', avatar: '👧', text: 'Approved and merged. PLuG Outbound: notify 12 impacted customers that checkout is active.', time: '14:18:22' }
    ]
  },
  {
    id: 7,
    label: 'Postmortem',
    sub: 'Audit-ready metrics',
    who: 'SRE Team',
    timeStr: '+1D',
    col: '#2563eb',
    bgCol: 'bg-blue-50',
    borderCol: 'border-blue-200',
    textCol: 'text-blue-700',
    info: 'SRE compiles the root-cause report. Postmortem is automatically pre-assembled from the incident timeline, referencing telemetry files and linking actions into Jira.',
    chatLog: [
      { sender: 'AI AGENT', avatar: '🤖', text: 'Postmortem outline drafted automatically: MTTR: 18m, Suppressed signals: 2160, SLA impact: 0%.', time: 'May 23, 09:00' },
      { sender: 'SRE LEAD', avatar: '👨‍💻', text: 'Approved. Great post-incident execution. Perfect visibility.', time: 'May 23, 10:15' }
    ]
  }
];

export default function SlideWalkthrough() {
  const [selectedIdx, setSelectedIdx] = useState<number>(2); // Default to 'Correlate'

  const activeStep = WALKTHROUGH_STAGES[selectedIdx];

  return (
    <div className="w-full h-full flex flex-col justify-between items-stretch">
      
      {/* Horizontal step timeline navigation row */}
      <div className="flex justify-between items-center bg-stone-50 border border-stone-200 rounded-2xl p-4 overflow-x-auto gap-3">
        {WALKTHROUGH_STAGES.map((s, idx) => {
          const isActive = selectedIdx === idx;
          return (
            <button
              key={s.id}
              id={`walkthrough-step-${s.id}`}
              onClick={() => setSelectedIdx(idx)}
              className={`flex-1 min-w-[124px] text-left p-3 rounded-xl border transition-all ${
                isActive
                  ? 'bg-neutral-900 border-neutral-950 text-white shadow-md'
                  : 'bg-white border-stone-150 text-stone-950 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-mono text-[9px] font-bold ${isActive ? 'text-indigo-400' : 'text-indigo-600'}`}>
                  {s.timeStr}
                </span>
                <span className={`w-1.5 h-1.5 rounded-full`} style={{ backgroundColor: s.col }} />
              </div>
              <h3 className="text-[13.5px] font-bold tracking-tight mt-1 truncate">
                {idx + 1}. {s.label}
              </h3>
              <p className={`text-[10px] truncate mt-0.5 ${isActive ? 'text-stone-300' : 'text-stone-500'}`}>
                {s.sub}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Core Block */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 py-4 items-stretch min-h-[300px]">
        
        {/* Left Specification Detail Block */}
        <div className="md:col-span-6 bg-white border border-stone-200 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep.id}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col"
            >
              {/* Header block */}
              <div>
                <span className="font-mono text-[9px] tracking-widest text-indigo-600 font-bold uppercase">
                  Walkthrough Stage Specification
                </span>
                <h3 className="text-2xl font-bold text-stone-900 tracking-tight mt-1">
                  {activeStep.label} Event Lifecycle
                </h3>
                <div className="font-mono text-xs text-stone-400 mt-1">
                  Active Operator: <span className="font-bold text-stone-700">{activeStep.who}</span>
                </div>
              </div>

              {/* Rich detail info */}
              <p className="text-stone-600 text-xs leading-relaxed mt-4 flex-1">
                {activeStep.info}
              </p>

              {/* Step Metrics list */}
              <div className="mt-6 pt-5 border-t border-stone-100 flex items-center gap-6">
                <div>
                  <div className="font-mono text-[8.5px] text-stone-400 uppercase font-semibold">MTTR MILESTONE</div>
                  <div className="font-mono text-lg font-bold text-stone-900 mt-0.5">{activeStep.timeStr}</div>
                </div>
                <div>
                  <div className="font-mono text-[8.5px] text-stone-400 uppercase font-semibold">ROUTING TARGET</div>
                  <div className="font-mono text-xs font-bold text-indigo-600 truncate max-w-[190px] mt-1 pr-1">
                    {activeStep.who.toUpperCase()}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right communication log simulator */}
        <div className="md:col-span-6 bg-stone-900 border border-stone-950 rounded-2xl p-4 flex flex-col justify-between overflow-hidden text-stone-205">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <span className="font-mono text-[9px] text-stone-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-400" /> SLA Incident Room Chat
              </span>
              <span className="font-mono text-[10px] text-indigo-400 font-bold">
                INC-521 · LIVE
              </span>
            </div>

            {/* Chat list */}
            <div className="mt-3.5 space-y-3 h-[180px] overflow-y-auto pr-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-3"
                >
                  {activeStep.chatLog.map((chat, i) => (
                    <div key={i} className="flex gap-2.5 items-start text-xs">
                      <div className="bg-stone-800 p-1 px-1.5 rounded-lg text-sm flex-shrink-0">
                        {chat.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <span className="font-mono text-[10px] text-stone-400 font-bold uppercase">{chat.sender}</span>
                          <span className="font-mono text-[8.5px] text-stone-500">{chat.time}</span>
                        </div>
                        <p className="text-[11px] text-stone-200 mt-1 leading-relaxed bg-stone-950/40 p-2 rounded-lg border border-stone-850">
                          {chat.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-3.5 pt-2 border-t border-stone-800 flex justify-between items-center text-[10.5px] font-mono text-stone-500">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Next event waiting...
            </span>
            <button
              onClick={() => setSelectedIdx((prev) => (prev >= WALKTHROUGH_STAGES.length - 1 ? 0 : prev + 1))}
              className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 transition"
            >
              NEXT STAGE <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
