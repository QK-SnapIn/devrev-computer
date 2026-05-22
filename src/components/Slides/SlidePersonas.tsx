import { useState } from 'react';
import { UserCheck, ShieldAlert, TrendingUp, HelpCircle, FileText, CheckSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Persona } from '../../types';

const PERSONAL_DEFFS: Persona[] = [
  {
    role: 'SRE / DevOps',
    name: 'Sarah Chen',
    avatar: '👩‍💻',
    question: 'Which services have been flapping the last 24 hours?',
    metricLabel: 'SYSTEM MTTR',
    metricVal: '18 minutes',
    metricSub: 'Down from 2.4 hours classic',
    traversal: ['Alerts', 'Outages', 'SRE Incidents', 'Services Grid'],
    response: 'Sarah, we trace flapping alerts to checkout-prod-v1. Replica thread pools exhausted onpostgres_replica_pool. Scaled database replicas to 4 at 14:07 IST. Alert state is now fully green, latency resting at 42ms.'
  },
  {
    role: 'Software Engineer',
    name: 'Alex Rivera',
    avatar: '👨‍💻',
    question: 'What is ISS-2669 — and how do I fix it?',
    metricLabel: 'ACTIVE SPRINT DELIVERIES',
    metricVal: '14 / 15',
    metricSub: 'PR auto-drafted by agent',
    traversal: ['Jira Issues', 'Parts Catalog', 'Code Repository', 'Remediation Logs'],
    response: 'Alex, ISS-2669 links to postgres connections getting stuck during webhook timeouts. Fix is to introduce transactional retry limits. Code Agent has pre-drafted Hotfix PR #3318 with tests validated. Approve and merge when ready.'
  },
  {
    role: 'Customer Support Lead',
    name: 'Michael Vance',
    avatar: '👨‍💼',
    question: "What's the SLA on TKT-9921 and what do I tell them?",
    metricLabel: 'TICKET CLEARED RATE',
    metricVal: '100%',
    metricSub: '12 accounts auto-reconciled',
    traversal: ['PLuG Chats', 'SLA contracts', 'Accounts database', 'Support queues'],
    response: 'Michael, SLA on TKT-9921 is 4 hours (Premium Enterprise Contract tier). Checkout mitigation is completed and PR merged. You can auto-reply using the drafted PLuG text notifying clients of completion + refund processing.'
  },
  {
    role: 'Product Manager',
    name: 'Elena Rostova',
    avatar: '👩‍💼',
    question: 'What is dragging the policy-bind capability this sprint?',
    metricLabel: 'Sprint Velocity',
    metricVal: '54 / 60 points',
    metricSub: 'Part Catalog healthy',
    traversal: ['Roadmaps', 'Issues', 'Sprint Boards', 'Microservice Parts'],
    response: 'Elena, policy-bind capability experienced high incident rates this sprint (8 alert groups, 1 outages). This drag was resolved by Hotfix PR #3318. Performance health is back to 99.9% uptime baseline.'
  },
  {
    role: 'Chief Executive (CXO)',
    name: 'Marcus Sterling',
    avatar: '🤵',
    question: 'What revenue is at risk this quarter, and where?',
    metricLabel: 'ARR AT RISK',
    metricVal: '$0 at Risk',
    metricSub: '$140k successfully preserved',
    traversal: ['CRM Accounts', 'ARR value metrics', 'Support tickets', 'Preservation logs'],
    response: 'Marcus, checkout failure group INC-521 briefly impacted 12 premium enterprise customers. Combined ARR of affected accounts represents $140,000. Mitigations were completed inside 18 minutes; customer churn risk is assessed at 0.0%.'
  }
];

export default function SlidePersonas() {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);

  const activePersona = PERSONAL_DEFFS[selectedIdx];

  return (
    <div className="w-full h-full flex flex-col justify-between items-stretch">
      
      {/* 5-Member Face/Role Grid selector */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {PERSONAL_DEFFS.map((p, idx) => {
          const isActive = selectedIdx === idx;
          return (
            <button
              key={p.role}
              id={`persona-btn-${p.role.replace(/\s+/g, '-')}`}
              onClick={() => setSelectedIdx(idx)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isActive
                  ? 'bg-neutral-900 border-neutral-950 text-white shadow-md scale-[1.01]'
                  : 'bg-white border-stone-150 text-stone-900 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{p.avatar}</span>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold truncate leading-tight">{p.name}</h4>
                  <p className={`text-[9.5px] font-mono mt-0.5 truncate ${isActive ? 'text-indigo-400 font-semibold' : 'text-stone-400'}`}>
                    {p.role.toUpperCase()}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Interface Split Row */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 py-4 items-stretch min-h-[300px]">
        
        {/* Left Side: Specific Dashboard metrics for this persona */}
        <div className="md:col-span-5 bg-white border border-stone-200 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-stone-100">
              <span className="font-mono text-[9px] tracking-widest text-stone-400 font-bold uppercase">
                Teammate Dashboard Indicators
              </span>
              <span className="font-mono text-[10.5px] text-indigo-600 font-bold">
                {activePersona.name}
              </span>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <span className="font-mono text-[8.5px] text-stone-400 uppercase font-semibold">{activePersona.metricLabel}</span>
                <div className="text-2xl font-bold text-stone-900 mt-1 flex items-baseline gap-2 leading-none">
                  {activePersona.metricVal}
                </div>
                <div className="text-[11px] text-stone-500 mt-1 leading-normal font-mono">
                  {p => p.metricSub}*{activePersona.metricSub}
                </div>
              </div>

              {/* Traversal sequence map */}
              <div className="space-y-1.5">
                <span className="font-mono text-[8.5px] text-stone-400 uppercase font-semibold block mb-2">
                  Trace Path Graph traversal:
                </span>
                <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
                  {activePersona.traversal.map((step, i) => (
                    <div key={step} className="flex items-center gap-1.5 text-stone-600">
                      <span className="bg-stone-50 px-2 py-1 rounded border border-stone-150 text-[10px] font-semibold text-stone-700">
                        {step}
                      </span>
                      {i < activePersona.traversal.length - 1 && <span className="text-indigo-600 font-bold">➔</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-400 leading-normal italic font-mono flex gap-2 items-start">
            <UserCheck className="w-4 h-4 text-stone-450 flex-shrink-0 mt-0.5" />
            <span>Scope limits restrict Sarah to systems logs, and Michael to support databases. Security trimmed automatically.</span>
          </div>
        </div>

        {/* Right Side: Computer Output tailored specifically for this persona */}
        <div className="md:col-span-7 bg-stone-900 border border-stone-950 rounded-2xl p-5 flex flex-col justify-between overflow-hidden text-stone-300">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-800 font-mono text-[9px] text-stone-400 uppercase tracking-wider font-semibold">
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" /> Secure Prompt scoping
              </span>
              <span>Ask in normal human language</span>
            </div>

            {/* Simulated Question input */}
            <div className="mt-4 p-3 bg-stone-950/40 rounded-xl border border-stone-850">
              <div className="font-mono text-[8.5px] text-stone-500 uppercase font-semibold">INBOUND QUESTION:</div>
              <p className="text-sm font-semibold text-white mt-1 italic leading-snug">
                "{activePersona.question}"
              </p>
            </div>

            {/* Generated answer */}
            <div className="mt-4 p-3.5 bg-indigo-950/20 border border-indigo-900/40 rounded-xl">
              <div className="font-mono text-[9px] text-indigo-400 font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-indigo-400" /> Computer answered:
              </div>
              <p className="text-[12.5px] text-stone-100 leading-relaxed font-sans">
                {activePersona.response}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-800 text-[10.5px] font-mono text-stone-500 leading-normal flex gap-2">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5 animate-pulse" />
            <span>Computer translates graph dependencies into user-scoped answers on the fly, eliminating ETL, custom BI dashboards, or Slack wars.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
