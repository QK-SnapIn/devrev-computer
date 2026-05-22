import { useState } from 'react';
import { Play, CheckCircle2, Shield, Settings, Sliders, PlayCircle, PlusCircle, Terminal, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AgentItem {
  name: string;
  sub: string;
  trigger: string;
  sources: string[];
  desc: string;
}

const PREBUILT_AGENTS: AgentItem[] = [
  { name: 'The Judge', sub: 'QA Reviewer', trigger: 'agent.action_completed', sources: ['Golden Test Cases', 'Evaluation Rules'], desc: 'Evaluates other agents output on parameters of speed, safety, semantic correctness and formatting standard compliance.' },
  { name: 'Observability', sub: 'Triage Specialist', trigger: 'telemetry.alert_storm', sources: ['Alert Metrics', 'Dynatrace Logs'], desc: 'Aggregates burst notifications; runs clustering calculations to isolate root-cause incidents on the part catalog.' },
  { name: 'Code Agent', sub: 'PR Automator', trigger: 'incident.rca_established', sources: ['GitHub Repos', 'Jira Issue Text'], desc: 'Drafts hotfixes, executes unit tests autonomously, and prepares PR proposals for human clearance.' },
  { name: 'Search Agent', sub: 'Graph Retriever', trigger: 'user.query_submitted', sources: ['Graph Database', 'Knowledge Articles'], desc: 'Understands customer intent, traverses deep graph chains and delivers multi-hop semantic answers.' },
  { name: 'Support Agent', sub: 'Auto Resolver', trigger: 'conversation.created', sources: ['Resolved tickets', 'FAQs'], desc: 'First line of support. Automatically responds with KB articles and session links; routes to human when SLAs require.' }
];

export default function SlideAgents() {
  const [activeTab, setActiveTab] = useState<'library' | 'studio'>('library');

  // Interactive Agent Builder Form State
  const [agentName, setAgentName] = useState<string>('My SLA Escalatòr Agent');
  const [selectedTrigger, setSelectedTrigger] = useState<string>('ticket.updated');
  const [selectedSource, setSelectedSource] = useState<string>('Graph Memory Lookup');
  const [modelType, setModelType] = useState<string>('Gemini 1.5 Pro');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationSteps, setEvaluationSteps] = useState<string[]>([]);
  const [isDeployed, setIsDeployed] = useState<boolean>(false);

  const triggerDeployEvaluator = () => {
    setIsEvaluating(true);
    setIsDeployed(false);
    setEvaluationSteps([]);

    const steps = [
      '⚡ Connecting pipeline trigger to event-bus telemetry...',
      '🔍 Constructing runtime evaluation container for testing...',
      '🧬 Mocking source objects: retrieving graph context schema...',
      '🤖 "The Judge" executing 10 baseline golden-set regressions...',
      '✅ 10/10 Test items passed! (SLA compliance 100%, Safety score 5.0/5.0).',
      '📦 Deploying sandbox model configuration to global MCP server...'
    ];

    steps.forEach((stepLine, idx) => {
      setTimeout(() => {
        setEvaluationSteps((prev) => [...prev, stepLine]);
        if (idx === steps.length - 1) {
          setIsEvaluating(false);
          setIsDeployed(true);
        }
      }, (idx + 1) * 450);
    });
  };

  return (
    <div className="w-full h-full flex flex-col justify-between items-stretch">
      {/* Tab selection bar */}
      <div className="flex gap-2 bg-stone-150 p-1 rounded-xl border border-stone-200 self-start">
        <button
          id="tab-btn-library"
          onClick={() => setActiveTab('library')}
          className={`font-mono text-xs px-4 py-2 rounded-lg transition-all font-semibold ${
            activeTab === 'library'
              ? 'bg-neutral-900 text-white shadow-sm'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          PRE-BUILT LIBRARY (CORE)
        </button>
        <button
          id="tab-btn-studio"
          onClick={() => setActiveTab('studio')}
          className={`font-mono text-xs px-4 py-2 rounded-lg transition-all font-semibold ${
            activeTab === 'studio'
              ? 'bg-neutral-900 text-white shadow-sm'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          AGENT STUDIO IDE
        </button>
      </div>

      {/* Main Container Area */}
      <div className="flex-1 min-h-[300px] py-4">
        {activeTab === 'library' ? (
          /* PREBUILT LIBRARIES SCREEN */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
            {PREBUILT_AGENTS.map((agent) => (
              <div
                key={agent.name}
                className="bg-white border border-stone-200 hover:border-indigo-400 p-5 rounded-2xl shadow-sm transition-all hover:shadow hover:-translate-y-0.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-600">
                      <Bot className="w-5 h-5 animate-pulse" />
                    </div>
                    <span className="font-mono text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-100 font-bold px-2 py-0.5 rounded uppercase">
                      READY TO SHIP
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 mt-3 leading-tight">
                    {agent.name}
                  </h3>
                  <p className="font-mono text-[10.5px] text-stone-400 font-semibold">{agent.sub}</p>

                  <p className="text-xs text-stone-600 leading-relaxed mt-2.5">
                    {agent.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100">
                  <div className="font-mono text-[9px] text-stone-400 uppercase font-semibold">
                    Core event subscription:
                  </div>
                  <div className="font-mono text-[10.5px] text-indigo-600 mt-0.5 font-bold">
                    {agent.trigger}
                  </div>
                </div>
              </div>
            ))}

            {/* Placeholder card inviting custom creation */}
            <button
              onClick={() => setActiveTab('studio')}
              className="bg-stone-50 border-2 border-dashed border-stone-300 hover:border-indigo-400 rounded-2xl p-5 flex flex-col items-center justify-center text-center transition group min-h-[190px]"
            >
              <PlusCircle className="w-8 h-8 text-stone-450 group-hover:text-indigo-600 animate-bounce mb-2" />
              <div className="text-sm font-bold text-stone-850 group-hover:text-indigo-600">
                Studio Custom Agent
              </div>
              <p className="text-xs text-stone-500 mt-1 max-w-[190px]">
                Build bespoke triggers and prompt behaviors in physical minutes.
              </p>
            </button>
          </div>
        ) : (
          /* INTERACTIVE AGENT STUDIO SCREEN */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch h-full">
            {/* Form Config Block */}
            <div className="lg:col-span-5 bg-white border border-stone-200 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2.5 border-b border-stone-100">
                  <span className="font-mono text-xs text-stone-500 font-bold uppercase">
                    Agent Architect Block
                  </span>
                  <Settings className="w-4 h-4 text-stone-400" />
                </div>

                {/* Input 1 */}
                <div>
                  <label className="block font-mono text-[10px] text-stone-400 uppercase tracking-wider font-semibold mb-1">
                    Agent Descriptive Identifier:
                  </label>
                  <input
                    type="text"
                    id="agent-name-input"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    className="w-full border border-stone-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                {/* Select 2 */}
                <div>
                  <label className="block font-mono text-[10px] text-stone-400 uppercase tracking-wider font-semibold mb-1">
                    Select Event Trigger (Bus):
                  </label>
                  <select
                    id="agent-trigger-select"
                    value={selectedTrigger}
                    onChange={(e) => setSelectedTrigger(e.target.value)}
                    className="w-full border border-stone-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none bg-white font-mono"
                  >
                    <option value="ticket.updated">ticket.updated</option>
                    <option value="incident.created">incident.created</option>
                    <option value="conversation.closed">conversation.closed</option>
                  </select>
                </div>

                {/* Select 3 */}
                <div>
                  <label className="block font-mono text-[10px] text-stone-400 uppercase tracking-wider font-semibold mb-1">
                    Select Knowledge Sources:
                  </label>
                  <select
                    id="agent-source-select"
                    value={selectedSource}
                    onChange={(e) => setSelectedSource(e.target.value)}
                    className="w-full border border-stone-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none bg-white font-mono"
                  >
                    <option value="Graph Memory Lookup">Graph Memory Lookup</option>
                    <option value="Session Trace logs">Session Trace logs</option>
                    <option value="Article KBs">Article KBs</option>
                  </select>
                </div>

                {/* Model Scope */}
                <div>
                  <label className="block font-mono text-[10px] text-stone-400 uppercase tracking-wider font-semibold mb-1">
                    Select Foundation Model:
                  </label>
                  <div className="flex gap-2">
                    {['Gemini 1.5 Flash', 'Gemini 1.5 Pro'].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setModelType(m)}
                        className={`flex-1 py-1.5 rounded border text-xs font-mono transition font-semibold ${
                          modelType === m
                            ? 'bg-indigo-50 border-indigo-400 text-indigo-700'
                            : 'bg-stone-50 border-stone-150 text-stone-500 hover:text-stone-850'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                id="agent-eval-trigger"
                onClick={triggerDeployEvaluator}
                disabled={isEvaluating}
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <Sliders className="w-3.5 h-3.5" />
                {isEvaluating ? 'RUNNING DEPLOY EVALS...' : 'RUN THE JUDGE & DEPLOY'}
              </button>
            </div>

            {/* Sandbox Runner / Console Output Panel */}
            <div className="lg:col-span-7 bg-stone-900 border border-stone-950 rounded-2xl p-4 flex flex-col justify-between text-stone-300">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                  <span className="font-mono text-[9px] text-stone-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Terminal className="w-3 h-3 text-indigo-400" /> Operational Testing Terminal
                  </span>
                  <span className="font-mono text-[10px] text-indigo-400 font-bold">
                    AGENT: {agentName.toUpperCase()}
                  </span>
                </div>

                <div className="mt-4 space-y-2 h-[178px] overflow-y-auto font-mono text-[10.5px] pr-1 leading-relaxed">
                  {evaluationSteps.length === 0 && (
                    <div className="text-stone-500 italic py-10 text-center">
                      Configure parameters and click "Run The Judge" to compile, validate and deploy onto physical pipelines.
                    </div>
                  )}

                  {evaluationSteps.map((step, idx) => (
                    <div key={idx} className="flex gap-2">
                      <span className="text-stone-500">[{idx+1}]</span>
                      <span className={idx === 4 ? 'text-emerald-400 font-bold' : 'text-stone-200'}>
                        {step}
                      </span>
                    </div>
                  ))}

                  {isEvaluating && (
                    <div className="text-indigo-400 animate-pulse font-semibold mt-1 flex items-center gap-2">
                      <Bot className="w-3.5 h-3.5 animate-bounce" /> Checking prompts against regression benchmarks...
                    </div>
                  )}
                </div>
              </div>

              {/* Status footer */}
              {isDeployed ? (
                <div className="mt-4 bg-emerald-950/40 border border-emerald-900 p-3 rounded-xl flex items-center justify-between text-[11px] font-mono">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" /> COMPILATION & TESTING DEPLOYED LIVE ON GRAPH
                  </div>
                  <span className="text-stone-400">Ver: 1.0.0</span>
                </div>
              ) : (
                <div className="mt-4 p-3 bg-stone-950 rounded-xl border border-stone-850 flex items-center justify-between font-mono text-[10.5px] text-stone-400">
                  <span className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-stone-500" /> All custom agents are automatically safe-evaluated before merge.
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
