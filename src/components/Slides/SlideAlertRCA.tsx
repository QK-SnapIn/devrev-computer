import { useState } from 'react';
import { Sliders, RefreshCw, Layers, ShieldAlert, AlertCircle, FileText, CheckCircle2, CloudLightning } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertInstance } from '../../types';

const RAW_MOCK_ALERTS: AlertInstance[] = [
  { id: '1', timestamp: '14:01:42', service: 'payment-gateway', source: 'Dynatrace', message: 'HTTP 504 Gateway Timeout during webhook execution', severity: 'CRITICAL' },
  { id: '2', timestamp: '14:01:43', service: 'policy-manager', source: 'Qtrac', message: 'DB connection limit reached on postgres_replica_pool', severity: 'CRITICAL' },
  { id: '3', timestamp: '14:01:45', service: 'frontend-checkout', source: 'PLuG SDK', message: 'Console Exception: Cannot read property bindOf of undefined', severity: 'WARNING' },
  { id: '4', timestamp: '14:01:50', service: 'checkout-service', source: 'Splunk', message: 'Thread pool exhaustion warning on node checkout_aws_3', severity: 'CRITICAL' },
  { id: '5', timestamp: '14:01:55', service: 'payment-gateway', source: 'Dynatrace', message: 'Transaction failure rate above 15% threshold in EMEA', severity: 'CRITICAL' }
];

export default function SlideAlertRCA() {
  const [sources, setSources] = useState({
    Dynatrace: true,
    Qtrac: true,
    Splunk: true,
    'PLuG SDK': true
  });
  const [threshold, setThreshold] = useState<number>(0.82);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [rcaResult, setRcaResult] = useState<any | null>(null);

  const toggleSource = (src: keyof typeof sources) => {
    setSources((prev) => ({ ...prev, [src]: !prev[src] }));
  };

  const runTelemetrySynthesis = () => {
    setIsProcessing(true);
    setRcaResult(null);

    // Progressive RCA compilation stages
    setTimeout(() => {
      setRcaResult({
        incidentID: 'INC-521',
        alertCount: 2400,
        clusterCount: 8,
        suppressedCount: 2160,
        impactedPart: 'FEAT-policy-bind (Policy Bind Service)',
        owner: '@dasha (Checkout Engine Team)',
        summary: 'Underlying Postgres thread exhaustion caused by unmatched transaction hooks during burst payment completions upstream.',
        actions: [
          'Add transaction locks on postgres_replica_pool',
          'Deploy hotfix PR #3318 (idempotent retry reconciler)',
          'Automated support article update via PLuG widget'
        ]
      });
      setIsProcessing(false);
    }, 2200);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between items-stretch">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 py-2 items-stretch min-h-[360px]">
        
        {/* Left column Control Board & raw alerts stream */}
        <div className="lg:col-span-5 bg-white border border-stone-200 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <span className="font-mono text-xs text-stone-500 tracking-wider font-semibold uppercase">
                RCA Synthesis board
              </span>
              <CloudLightning className="w-4 h-4 text-indigo-500 animate-pulse" />
            </div>

            {/* Ingestion Sources Switches */}
            <div>
              <span className="font-mono text-[9px] text-stone-400 font-bold uppercase tracking-wider block mb-2">
                Toggle Active Telemetry Feeds:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(sources).map((src) => {
                  const active = sources[src as keyof typeof sources];
                  return (
                    <button
                      key={src}
                      id={`source-toggle-${src.replace(/\s+/g, '-')}`}
                      onClick={() => toggleSource(src as any)}
                      className={`py-2 px-3 text-xs rounded-xl font-mono border transition flex items-center justify-between font-semibold ${
                        active
                          ? 'bg-indigo-50 border-indigo-400 text-indigo-700'
                          : 'bg-stone-50 border-stone-150 text-stone-400'
                      }`}
                    >
                      <span>{src.toUpperCase()}</span>
                      <span className={`w-2 h-2 rounded-full ${active ? 'bg-indigo-600 animate-pulse' : 'bg-stone-300'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cosine Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono text-stone-500 mb-1 font-semibold">
                <span>CORRELATION THRESHOLD:</span>
                <span className="text-indigo-600 font-bold">{(threshold * 100).toFixed(0)}% Match</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                value={threshold * 100}
                onChange={(e) => setThreshold(Number(e.target.value) / 100)}
                className="w-full accent-indigo-500 h-1 rounded"
              />
              <span className="text-[9.5px] font-mono text-stone-400 block mt-1.5 leading-snug">
                * Suppresses alarms failing to reach topological proximity or temporal proximity indexes within our 90s gating.
              </span>
            </div>

            {/* Raw Alerts Stream Simulator */}
            <div>
              <span className="font-mono text-[9px] text-stone-400 font-bold uppercase tracking-wider block mb-2">
                Live Ingested Telemetry (Sample):
              </span>
              <div className="space-y-1.5 max-h-[110px] overflow-y-auto border border-stone-50 bg-stone-50/50 p-2 rounded-xl text-[10px] uppercase font-mono">
                {RAW_MOCK_ALERTS.map((alert) => {
                  const isSourceActive = sources[alert.source as keyof typeof sources];
                  return (
                    <div
                      key={alert.id}
                      className={`p-1.5 rounded border border-stone-100 flex justify-between items-center ${
                        isSourceActive ? 'opacity-100 bg-white' : 'opacity-30 bg-stone-50/20'
                      }`}
                    >
                      <span className="text-stone-400 font-bold">{alert.timestamp}</span>
                      <span className="text-stone-700 max-w-[130px] truncate">{alert.service}</span>
                      <span className={alert.severity === 'CRITICAL' ? 'text-rose-500 font-bold' : 'text-amber-500'}>
                        {alert.message.slice(0, 24)}...
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <button
            id="synthesis-btn"
            onClick={runTelemetrySynthesis}
            disabled={isProcessing}
            className={`w-full py-3 rounded-xl font-mono text-xs font-bold border transition flex items-center justify-center gap-2 ${
              isProcessing
                ? 'bg-stone-200 border-stone-300 text-stone-500 cursor-not-allowed'
                : 'bg-indigo-600 border-indigo-700 hover:bg-indigo-700 text-white hover:shadow-md'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
            {isProcessing ? 'SQUASHING & CORRELATING TELEMETRY...' : 'SYNTHESIZE RCA INCIDENT'}
          </button>
        </div>

        {/* Right column Animated Processing & synthesized RCA card outputs */}
        <div className="lg:col-span-7 bg-stone-900 border border-stone-950 rounded-2xl p-4 flex flex-col justify-between overflow-hidden text-stone-300">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <span className="font-mono text-[9px] text-stone-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> AI Core Synthesizer Output
              </span>
              <span className="font-mono text-[10px] text-indigo-400 font-bold">
                10-MIN CLUSTER WINDOW
              </span>
            </div>

            <div className="mt-4 flex-1">
              <AnimatePresence mode="wait">
                {isProcessing && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-12 flex flex-col items-center justify-center text-center gap-3"
                  >
                    <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                    <p className="font-mono text-[11.5px] text-indigo-400">
                      Processing 2,400 alarms... Temporal match window open... Linear topology checked... suppressed 90% duplicated signals.
                    </p>
                  </motion.div>
                )}

                {!isProcessing && !rcaResult && (
                  <motion.div
                    key="empty"
                    className="py-14 flex flex-col items-center justify-center text-center text-stone-500 gap-2"
                  >
                    <AlertCircle className="w-8 h-8 text-stone-600 mb-1" />
                    <p className="text-xs text-stone-400">
                      Mix parameters on the left and click "Synthesize" to execute direct multi-hop dependency tracing.
                    </p>
                  </motion.div>
                )}

                {!isProcessing && rcaResult && (
                  <motion.div
                    key="resolved"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 font-sans text-xs"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-center bg-stone-950/50 p-2.5 rounded-lg border border-stone-850">
                      <div className="flex items-center gap-2">
                        <span className="bg-rose-500 text-white rounded px-1.5 py-0.5 text-[9.5px] font-mono font-bold">
                          SEV-1
                        </span>
                        <div className="font-mono font-bold text-stone-100">{rcaResult.incidentID}</div>
                      </div>
                      <span className="font-mono text-[10px] text-emerald-400 font-bold">
                        CONSOLIDATED 2,400 ALERTS
                      </span>
                    </div>

                    {/* Meta stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-stone-950/30 p-2.5 rounded-lg border border-stone-850 font-mono text-[10.5px]">
                        <span className="text-stone-500 block text-[9px]">AFFECTED TARGET PART</span>
                        <span className="text-white font-bold leading-tight mt-0.5 block">{rcaResult.impactedPart}</span>
                      </div>
                      <div className="bg-stone-950/30 p-2.5 rounded-lg border border-stone-850 font-mono text-[10.5px]">
                        <span className="text-stone-500 block text-[9px]">AUTO-DERIVED OWNER</span>
                        <span className="text-white font-bold leading-tight mt-0.5 block">{rcaResult.owner}</span>
                      </div>
                    </div>

                    {/* Summary box */}
                    <div className="p-3 bg-[#1e1b4b]/30 border border-indigo-900/40 rounded-xl">
                      <div className="font-mono text-[9px] text-indigo-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                        <FileText className="w-3 h-3 text-indigo-400" /> Root Cause Analysis Synthesis
                      </div>
                      <p className="text-[11.5px] text-stone-200 leading-relaxed">
                        {rcaResult.summary}
                      </p>
                    </div>

                    {/* Actions checkboxes */}
                    <div className="space-y-1.5">
                      <span className="font-mono text-[9px] text-stone-400 font-bold uppercase block tracking-wider mb-2">
                        Suggested Remediation Tasks:
                      </span>
                      {rcaResult.actions.map((action: string, i: number) => (
                        <div key={i} className="flex gap-2.5 items-center font-mono text-[10.5px] text-stone-300 bg-stone-950/20 p-2 rounded border border-stone-850">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          <span>{action}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-4 p-3 bg-stone-950 rounded-xl border border-stone-850 flex justify-between items-center font-mono text-[10px] text-stone-500 leading-normal">
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-stone-400" /> Telemetry compression ratio: 99.6% (2400 alerts ➔ 1 incident).
            </span>
            <span className="font-bold text-indigo-400">90 SECONDS</span>
          </div>
        </div>

      </div>
    </div>
  );
}
