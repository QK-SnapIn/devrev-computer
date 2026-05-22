import { useState } from 'react';
import { Terminal, Smartphone, Play, Pause, ChevronRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';
import { ReplayLog } from '../../types';

const SIMULATED_PLAYBACK_STEPS: ReplayLog[] = [
  { time: '14:01:42', action: 'click', detail: 'Buy Policy Button', color: 'text-sky-400' },
  { time: '14:01:43', action: 'fetch', detail: 'POST /api/insurance/purchase-policy', status: '500 Error', color: 'text-rose-450' },
  { time: '14:01:51', action: 'click', detail: 'Buy Policy Button (Retry 1)', color: 'text-sky-450' },
  { time: '14:01:56', action: 'click', detail: 'Buy Policy Button (Retry 2 - Rage)', color: 'text-amber-400' },
  { time: '14:02:03', action: 'console.error', detail: 'PolicyBindError: postgres threads exhausted', color: 'text-rose-400' },
  { time: '14:02:18', action: 'toast', detail: 'Pushed notification: "Reconciling..."', color: 'text-amber-400' }
];

export default function SlideViewSideBySide() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [stepIdx, setStepIdx] = useState<number>(4);

  const currentStep = SIMULATED_PLAYBACK_STEPS[stepIdx];

  return (
    <div className="w-full h-full flex flex-col justify-between items-stretch">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 py-2 items-stretch min-h-[300px]">
        
        {/* Left terminal panel representing interactive query to Computer */}
        <div id="terminal-panel" className="md:col-span-6 bg-stone-950 text-stone-200 rounded-2xl p-5 border border-stone-900 flex flex-col justify-between overflow-hidden">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-850 font-mono text-[9px] text-stone-550 uppercase tracking-widest font-bold">
              <span className="flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" /> Computer Natural Query Shell
              </span>
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            </div>

            {/* Prompt bar */}
            <div className="font-mono text-xs text-stone-300">
              <span className="text-indigo-400 font-bold">sndp@qualitykiosk ~ $ </span>
              <span className="italic text-stone-400">/ask "what is this checkout incident, what happened here?"</span>
            </div>

            {/* Computer response terminal markup */}
            <div className="p-4 bg-stone-900/50 rounded-xl border border-stone-850 font-sans text-xs text-stone-300 leading-relaxed space-y-3.5">
              <div className="flex items-center gap-2">
                <span className="bg-indigo-600 text-white px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase">
                  Computer Response
                </span>
                <span className="font-mono text-[10px] text-stone-500 font-bold">INCIDENT: ISS-2669</span>
              </div>

              <div className="space-y-2">
                <p>
                  Severity: <span className="text-rose-400 font-bold">SEV-1</span> — Priority: <span className="text-amber-400 font-bold">P1 (auto-derived)</span>.
                </p>
                <p>
                  Clustered incidents: <span className="text-indigo-400 font-semibold underline">INC-521</span>, <span className="text-indigo-400 font-semibold underline">INC-522</span> (Temporal coincidence window of 90 seconds).
                </p>
                <p>
                  Root Cause: <span className="text-stone-100 font-bold">"Failed to finalise policy after Razorpay payment capture."</span> Microservice component: <span className="text-indigo-300 font-semibold font-mono">FEAT-policy-bind</span>.
                </p>
                <p>
                  Assigned owner: <span className="text-amber-300 font-semibold font-mono">@dasha</span>. Associated Code changes: <span className="text-emerald-400 font-semibold font-mono">PR #3318 (idempotent retry mechanics)</span> has been drafted.
                </p>
              </div>
            </div>
          </div>

          <p className="font-mono text-[9.5px] text-stone-500 leading-normal italic pt-3 border-t border-stone-850">
            * 5 disconnected tool databases merged into 1 natural reply: Dynatrace · Qtrac · Splunk · Jira · PLuG
          </p>
        </div>

        {/* Right side representing Session Replay logs */}
        <div id="video-panel" className="md:col-span-6 bg-white border border-stone-200 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <span className="font-mono text-xs text-stone-500 tracking-wider font-semibold uppercase flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-indigo-500" /> Active Client Replay Trace
              </span>
              <span className="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                USER #41AB9
              </span>
            </div>

            {/* Micro Scrub player */}
            <div className="my-4 bg-stone-50 border border-stone-150 p-3.5 rounded-xl text-xs flex flex-col gap-2">
              <div className="flex justify-between items-baseline font-mono text-[10px] text-stone-500">
                <span>policy-purchase session</span>
                <span className="text-indigo-600 font-bold">Event Log Index: {stepIdx + 1} / 6</span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                value={stepIdx}
                onChange={(e) => setStepIdx(Number(e.target.value))}
                className="w-full accent-indigo-600 h-1 rounded mt-1.5"
              />
            </div>

            {/* List logs */}
            <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
              {SIMULATED_PLAYBACK_STEPS.map((step, i) => {
                const isActive = stepIdx === i;
                return (
                  <div
                    key={i}
                    onClick={() => setStepIdx(i)}
                    className={`cursor-pointer border p-2.5 rounded-xl text-[11px] grid grid-cols-12 gap-2 transition items-center ${
                      isActive
                        ? 'bg-neutral-900 border-neutral-950 text-white font-semibold'
                        : 'bg-stone-50/50 border-stone-100 text-stone-500'
                    }`}
                  >
                    <span className="col-span-2 font-mono">{step.time}</span>
                    <span className={`col-span-4 font-mono font-bold uppercase truncate ${step.color}`}>
                      {step.action}
                    </span>
                    <span className="col-span-6 truncate">{step.detail}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-3.5 p-3 bg-indigo-50/40 rounded-xl border border-indigo-100/50 flex items-center gap-2.5 font-mono text-[10px] leading-relaxed select-none text-indigo-800">
            <ShieldAlert className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <span>Click trace items on the right to dynamically observe how Computer updates details in line.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
