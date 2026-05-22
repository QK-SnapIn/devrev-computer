import { useState } from 'react';
import { Layers, HelpCircle, Shield, Code, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StackLayer {
  id: string;
  title: string;
  sub: string;
  desc: string;
  details: string[];
  patents?: string;
  metric?: string;
  features: string[];
}

const STACK_LAYERS: StackLayer[] = [
  {
    id: 'computer',
    title: 'Computer Layer',
    sub: 'Universal Interface & Persona Scope',
    desc: 'The intelligent orchestration plane that answers questions, synthesizes context, and acts on live instructions in real-time.',
    details: [
      'Self-improving retrieval-augmented context scoping',
      'Dynamic security trimming tailored to specific teammate roles',
      'Unified natural language interface spanning every integrated tool'
    ],
    patents: 'Patent US-118992-B2: Scoped multi-role LLM context generation',
    metric: '95% Reduction in Ticket Archaeology',
    features: ['Semantic Search', 'Role-scoped Memory', 'Action Tooling']
  },
  {
    id: 'agents',
    title: 'Agent Studio & Pre-built Core',
    sub: 'The Logic, Judgment & Action Loop',
    desc: 'Wired event handlers and specialized worker modules. Run out-of-the-box or author custom agents in minutes using safe evaluation frameworks.',
    details: [
      'Pre-built: The Judge (automated QA & eval), Observability, Auto-Reply, SRE triage',
      'Custom Agent authoring with drag-drop Event triggers and LLM prompting',
      'Rigorous golden-case regression tests run automatically on state changes'
    ],
    metric: '90s to Consolidate Alert Storms',
    features: ['Agent Studio IDE', 'Golden-case Evaluation', 'Out-of-the-box Library']
  },
  {
    id: 'workflows',
    title: 'Workflows & Event Bus',
    sub: 'Real-time Event Transport & Orchestration',
    desc: 'Publish-subscribe messaging fabric tracking status transitions, comments, and external triggers across the graph.',
    details: [
      'High-throughput, guaranteed-ordering event streams',
      'Immediate push notification to subscribed agents (e.g. ticket.escalated)',
      'Granular change data capture across all master objects'
    ],
    metric: 'Sub-10ms Event Propagation',
    features: ['Event Triggers', 'CDC Hooks', 'Webhook Gateways']
  },
  {
    id: 'memory',
    title: 'Computer Memory (Knowledge Graph)',
    sub: 'A Shared Semantic Graph of Truth',
    desc: 'The foundational knowledge layer. Not isolated relational tables, but cohesive, multi-linked nodes preserving cross-surface context.',
    details: [
      'Cohesive entity link schema connecting tickets, parts, issues, commits and user sessions',
      'Eliminates complex JOIN operations and slow ETL synchronization pipelines',
      'Full semantic trace history for deep context retrieval'
    ],
    patents: 'Patent US-119445-B1: Multi-link object graph synchronization',
    metric: 'Zero-Join Semantic Retrieval',
    features: ['Unified Object Schema', 'Cross-Entity Links', 'Transactional Reconciler']
  },
  {
    id: 'capture',
    title: 'Capture & Connect Edge',
    sub: 'Real-world Interaction Ingestion',
    desc: 'PLuG chat widget, session replay capturing exact user behavior, and multi-source AirSync connectors pushing data into Memory.',
    details: [
      'Dual capture: What users write (PLuG Chat) alongside what they did (Session Analytics)',
      'AirSync: Bidirectional, idempotent synchronization keeping existing tools (Jira, Slack) in lock-step',
      'Snap-ins and Model Context Protocol (MCP) servers extending tool-use seamlessly'
    ],
    patents: 'Patent US-120114-A3: Idempotent bidirectional sync engine',
    metric: '100% Client Behavior Visibility',
    features: ['PLuG SDK', 'Session Analytics', 'AirSync Connectors']
  }
];

export default function SlideStack() {
  const [selectedLayerId, setSelectedLayerId] = useState<string>('computer');

  const activeLayer = STACK_LAYERS.find((l) => l.id === selectedLayerId) || STACK_LAYERS[0];

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-8 items-stretch justify-center">
      {/* Visual Stack Layout */}
      <div className="flex-1 flex flex-col justify-center min-h-[300px]">
        <div className="flex justify-between items-center mb-4">
          <span className="font-mono text-xs text-stone-500 tracking-wider font-semibold uppercase">
            Click layer to inspect specifications:
          </span>
          <span className="text-xs text-indigo-600 font-mono flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 animate-pulse" /> 5-Tier DevRev Orchestration
          </span>
        </div>

        <div className="flex flex-col gap-3 font-sans">
          {STACK_LAYERS.map((layer) => {
            const isSelected = layer.id === selectedLayerId;
            return (
              <button
                key={layer.id}
                id={`stack-layer-${layer.id}`}
                onClick={() => setSelectedLayerId(layer.id)}
                className={`w-full text-left p-5 rounded-xl border transition-all duration-300 relative overflow-hidden group ${
                  isSelected
                    ? 'bg-neutral-900 border-neutral-950 text-white shadow-xl translate-x-3 scale-[1.01]'
                    : 'bg-white border-stone-200 hover:border-indigo-400 text-stone-900 hover:shadow-md'
                }`}
              >
                {/* Glow accent for selected */}
                {isSelected && (
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-indigo-500 to-violet-600" />
                )}

                <div className="flex items-start justify-between relative z-10">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono text-xs font-semibold ${
                          isSelected ? 'text-indigo-400' : 'text-indigo-600'
                        }`}
                      >
                        {layer.id.toUpperCase()}
                      </span>
                      {layer.patents && (
                        <span
                          className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${
                            isSelected ? 'bg-neutral-800 text-neutral-300' : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          PATENTED
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold tracking-tight mt-1">
                      {layer.title}
                    </h3>
                    <p
                      className={`text-xs mt-1 leading-normal ${
                        isSelected ? 'text-stone-300' : 'text-stone-500 group-hover:text-stone-700'
                      }`}
                    >
                      {layer.sub}
                    </p>
                  </div>

                  <div
                    className={`p-2 rounded-lg transition-colors ${
                      isSelected ? 'bg-neutral-800 text-white' : 'bg-stone-50 text-stone-500 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                    }`}
                  >
                    {layer.id === 'computer' && <Cpu className="w-5 h-5" />}
                    {layer.id === 'agents' && <Code className="w-5 h-5" />}
                    {layer.id === 'workflows' && <Layers className="w-5 h-5" />}
                    {layer.id === 'memory' && <Shield className="w-5 h-5" />}
                    {layer.id === 'capture' && <HelpCircle className="w-5 h-5" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Layer Specs Inspector Panel */}
      <div className="w-full md:w-[480px] bg-white border border-stone-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeLayer.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col"
          >
            {/* Header */}
            <div>
              <span className="font-mono text-[10px] tracking-widest text-indigo-600 font-bold uppercase">
                Specifications Inspector
              </span>
              <h2 className="text-2xl font-bold text-stone-900 mt-1 leading-tight">
                {activeLayer.title}
              </h2>
              <p className="font-mono text-xs text-stone-400 mt-1">
                {activeLayer.sub}
              </p>
            </div>

            {/* Description */}
            <p className="text-sm text-stone-600 mt-4 leading-relaxed">
              {activeLayer.desc}
            </p>

            {/* Key Bullet Points */}
            <div className="mt-5 space-y-3.5 flex-1">
              <span className="font-mono text-[10px] tracking-wider text-stone-400 font-semibold block uppercase">
                Architectural Features & Protocols:
              </span>
              {activeLayer.details.map((detail, idx) => (
                <div key={idx} className="flex gap-2.5 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 flex-shrink-0" />
                  <p className="text-xs text-stone-700 leading-relaxed font-sans">
                    {detail}
                  </p>
                </div>
              ))}
            </div>

            {/* Feature Badges list */}
            <div className="mt-6 pt-5 border-t border-stone-100">
              <div className="flex flex-wrap gap-2">
                {activeLayer.features.map((feat) => (
                  <span
                    key={feat}
                    className="font-mono text-[9px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded"
                  >
                    {feat.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>

            {/* Layer Performance Metric */}
            {activeLayer.metric && (
              <div className="mt-5 p-4 bg-stone-50 rounded-xl border border-stone-100 flex items-center justify-between">
                <div>
                  <div className="font-mono text-[9px] tracking-wider text-stone-400 uppercase">
                    PROVEN BENEFIT
                  </div>
                  <div className="font-mono text-lg font-bold text-stone-900 leading-tight">
                    {activeLayer.metric}
                  </div>
                </div>
                <div className="bg-emerald-50 text-emerald-700 border border-emerald-150 rounded px-2 py-0.5 text-[10px] font-mono font-bold">
                  LIVE
                </div>
              </div>
            )}

            {/* Patents footer */}
            {activeLayer.patents ? (
              <div className="mt-4 pt-3 border-t border-stone-100 text-[10px] font-mono text-neutral-400 italic">
                {activeLayer.patents}
              </div>
            ) : (
              <div className="mt-4 pt-3 border-t border-stone-100 text-[10px] font-mono text-neutral-400 italic">
                Standard DevRev Integration Fabric
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
