import { useState, useEffect } from 'react';
import { Search, Database, Globe, Play, RotateCcw, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { NodeItem } from '../../types';

const GRAPH_NODES: NodeItem[] = [
  { id: 'TKT', label: 'Tickets', sub: 'TKT-9921', x: 220, y: 120, details: 'Stores user-reported bugs, feature requests, with SLAs, assignees, and severity rankings.' },
  { id: 'ISS', label: 'Issues', sub: 'ISS-2669', x: 500, y: 80, details: 'Engineering task/bug definitions synced from Jira, Linear or created inside DevRev.' },
  { id: 'INC', label: 'Incidents', sub: 'INC-521', x: 800, y: 80, details: 'Consolidated system outages or alert storm clusters linked directly to root cause.' },
  { id: 'PRT', label: 'Parts', sub: 'PROD/CAP/FEAT', x: 1080, y: 120, details: 'System catalog components. Represents microservices (e.g. policy-bind, checkout).' },
  { id: 'COD', label: 'Code', sub: 'PRs & commits', x: 1140, y: 270, details: 'GitHub/GitLab PR logs, code commits, and release files linked to specific tickets.' },
  { id: 'SPR', label: 'Sprints', sub: 'Iterations', x: 1080, y: 430, details: 'Development tracker bounding issue cycles, velocity charts, and deployment targets.' },
  { id: 'SES', label: 'Sessions', sub: 'Replays & logs', x: 800, y: 490, details: 'Session Analytics click traces, failed request network lines, and client-profile details.' },
  { id: 'CON', label: 'Conversations', sub: 'PLuG Chats', x: 500, y: 490, details: 'Inbound chat widgets, customer conversations, and AI-routed troubleshooting threads.' },
  { id: 'ACC', label: 'Accounts', sub: 'ARR & Contacts', x: 220, y: 430, details: 'Sales CRM records, customer profiles, ARR calculations, and SLA contract boundaries.' },
  { id: 'ART', label: 'Articles', sub: 'Knowledge Base', x: 160, y: 270, details: 'Support runbooks, documentation articles, and FAQs paired to automatic support routing.' }
];

const SCENARIOS = [
  {
    title: 'EMEA Checkout Outage Trace',
    query: 'Why did checkout fail in EMEA last week?',
    path: ['SES', 'CON', 'TKT', 'INC', 'PRT', 'COD'],
    narrative: 'A customer session crashed during checkout (SES) leading to a chat (CON) which raised a ticket (TKT). DevRev correlated it with an alert storm incident (INC) affecting the checkout service part (PRT) caused by a buggy database commit (COD).'
  },
  {
    title: 'Database Flap Blast Analysis',
    query: 'Which parts are impacted by the active database flap?',
    path: ['INC', 'PRT', 'COD', 'SPR'],
    narrative: 'A database connectivity incident (INC) directly matches back to the policy-bind microservice microcatalog (PRT). We trace the related file commit (COD) currently blocked in the deployment cycle sprinters (SPR).'
  },
  {
    title: 'Interactive Support Audit',
    query: 'What user sessions triggered recent contract support threads?',
    path: ['ACC', 'CON', 'TKT', 'SES'],
    narrative: 'From high-value enterprise accounts (ACC) in PLuG, conversations (CON) escalates to priority tickets (TKT). Traces are investigated using session replays (SES) to isolate UI memory exhaustion.'
  }
];

export default function SlideGraph() {
  const [selectedNode, setSelectedNode] = useState<NodeItem | null>(null);
  const [activeScenarioIdx, setActiveScenarioIdx] = useState<number | null>(null);
  const [animatedPath, setAnimatedPath] = useState<string[]>([]);
  const [narrativeText, setNarrativeText] = useState<string>('Select a customer query below to witness how DevRev instantly crawls the graph across 6+ entities on one hop.');

  // Handles running a graph-traversal simulation
  const runScenario = (idx: number) => {
    setActiveScenarioIdx(idx);
    const scenario = SCENARIOS[idx];
    setAnimatedPath([]);
    setNarrativeText('Evaluating query semantics against shared knowledge graph...');

    // Progressively light up nodes
    scenario.path.forEach((nodeId, pathIdx) => {
      setTimeout(() => {
        setAnimatedPath(prev => [...prev, nodeId]);
        const node = GRAPH_NODES.find(n => n.id === nodeId);
        if (node) {
          setSelectedNode(node);
        }
      }, (pathIdx + 1) * 700);
    });

    setTimeout(() => {
      setNarrativeText(`🎉 Answer resolved: ${scenario.narrative}`);
    }, (scenario.path.length + 1) * 700);
  };

  const resetGraph = () => {
    setActiveScenarioIdx(null);
    setAnimatedPath([]);
    setSelectedNode(null);
    setNarrativeText('Select a customer query below to witness how DevRev instantly crawls the graph across 6+ entities on one hop.');
  };

  return (
    <div className="w-full h-full flex flex-col justify-between items-stretch">
      {/* Search / Control Row */}
      <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Search className="w-4 h-4" />
          </div>
          <div className="flex-1 md:flex-none">
            <div className="text-xs font-mono text-stone-400 uppercase tracking-widest font-semibold">
              Semantic Search Playground
            </div>
            <div className="text-sm font-semibold text-stone-900">
              {activeScenarioIdx !== null ? SCENARIOS[activeScenarioIdx].query : 'Ask Computer any question...'}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 text-xs font-mono text-stone-500">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
            <span>Search Path</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-200" />
            <span>Memory Node</span>
          </div>
          <button
            onClick={resetGraph}
            className="flex items-center gap-1 bg-white hover:bg-stone-100 border border-stone-200 rounded px-2 py-1 text-stone-600 transition"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>
      </div>

      {/* Main Canvas & Sandbox */}
      <div className="flex-1 min-h-[340px] grid grid-cols-1 lg:grid-cols-12 gap-6 py-4 items-stretch">
        {/* Interactive SVG Graph Area */}
        <div id="graph-panel" className="lg:col-span-8 bg-stone-900 rounded-2xl border border-stone-950 p-2 relative overflow-hidden flex items-center justify-center">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#2a2a2f_1px,transparent_1px),linear-gradient(to_bottom,#2a2a2f_1px,transparent_1px)] bg-[size:40px_40px] opacity-25" />

          <svg viewBox="0 0 1300 560" className="w-full h-full max-h-[420px] relative z-10 select-none">
            {/* Draw connectors / lines */}
            {/* Cross links default edges */}
            <g stroke="rgba(255,255,255,0.08)" strokeWidth="1.2">
              <line x1="220" y1="120" x2="500" y2="80" />
              <line x1="500" y1="80" x2="800" y2="80" />
              <line x1="800" y1="80" x2="1080" y2="120" />
              <line x1="1080" y1="120" x2="1140" y2="270" />
              <line x1="1140" y1="270" x2="1080" y2="430" />
              <line x1="1080" y1="430" x2="800" y2="490" />
              <line x1="800" y1="490" x2="500" y2="490" />
              <line x1="500" y1="490" x2="220" y2="430" />
              <line x1="220" y1="430" x2="160" y2="270" />
              <line x1="160" y1="270" x2="220" y2="120" />
              
              <line x1="220" y1="120" x2="1140" y2="270" strokeDasharray="3 3" opacity="0.3" />
              <line x1="500" y1="490" x2="500" y2="80" strokeDasharray="3 3" opacity="0.3" />
            </g>

            {/* Glowing Search Pathway links based on current query status */}
            {activeScenarioIdx !== null && (
              <g stroke="#6366f1" strokeWidth="3" opacity="0.85">
                {(() => {
                  const path = SCENARIOS[activeScenarioIdx].path;
                  const lines: any[] = [];
                  for (let i = 0; i < path.length - 1; i++) {
                    const u = GRAPH_NODES.find(n => n.id === path[i]);
                    const v = GRAPH_NODES.find(n => n.id === path[i + 1]);
                    if (u && v && animatedPath.includes(path[i]) && animatedPath.includes(path[i + 1])) {
                      lines.push(
                        <motion.line
                          key={`link-${u.id}-${v.id}`}
                          x1={u.x}
                          y1={u.y}
                          x2={v.x}
                          y2={v.y}
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5 }}
                        />
                      );
                    }
                  }
                  return lines;
                })()}
              </g>
            )}

            {/* central hub connecting everyone */}
            <g>
              <circle cx="650" cy="270" r="54" fill="#6366f1" className="animate-pulse" opacity="0.15" />
              <circle cx="650" cy="270" r="44" fill="#312e81" stroke="#6366f1" strokeWidth="2" />
              <text x="650" y="266" textAnchor="middle" fill="#ffffff" fontFamily="Inter" fontSize="13" fontWeight="bold">GRAPH</text>
              <text x="650" y="282" textAnchor="middle" fill="#818cf8" fontFamily="JetBrains Mono" fontSize="9" letterSpacing="1">MEMORY</text>
            </g>

            {/* Hub spokes radiating */}
            <g stroke="#6366f1" strokeWidth="1" strokeDasharray="2 4" opacity="0.4">
              {GRAPH_NODES.map(node => (
                <line key={`spoke-${node.id}`} x1="650" y1="270" x2={node.x} y2={node.y} />
              ))}
            </g>

            {/* Render Nodes */}
            {GRAPH_NODES.map(node => {
              const isSelected = selectedNode?.id === node.id;
              const isPathMember = animatedPath.includes(node.id);
              
              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className="cursor-pointer"
                  id={`node-${node.id}`}
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="34"
                    fill={isSelected ? '#c7d2fe' : isPathMember ? '#312e81' : '#1e1b4b'}
                    stroke={isSelected ? '#6366f1' : isPathMember ? '#818cf8' : 'rgba(255,255,255,0.15)'}
                    strokeWidth={isSelected ? '3' : '1.5'}
                    className="transition-all duration-300"
                  />
                  <text
                    x={node.x}
                    y={node.y - 2}
                    textAnchor="middle"
                    fill={isSelected ? '#0f172a' : '#ffffff'}
                    fontFamily="Inter"
                    fontSize="11.5"
                    fontWeight="bold"
                  >
                    {node.label}
                  </text>
                  <text
                    x={node.x}
                    y={node.y + 11}
                    textAnchor="middle"
                    fill={isSelected ? '#475569' : '#94a3b8'}
                    fontFamily="JetBrains Mono"
                    fontSize="8.5"
                  >
                    {node.sub}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Data Inspection & Narrative Panel */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Metadata Card */}
          <div className="bg-white border border-stone-200 rounded-2xl p-5 flex flex-col flex-1 justify-between shadow-sm">
            <div>
              <div className="flex justify-between items-center bg-stone-50 p-2 rounded-lg border border-stone-100">
                <span className="font-mono text-[9px] tracking-widest text-indigo-600 font-bold uppercase">
                  Selected Entity View
                </span>
                <span className="font-mono text-[10px] text-stone-500 font-bold uppercase">
                  {selectedNode ? selectedNode.id : 'N/A'}
                </span>
              </div>

              {selectedNode ? (
                <div className="mt-4">
                  <h3 className="text-lg font-bold text-stone-900 leading-tight">
                    {selectedNode.label}
                  </h3>
                  <div className="font-mono text-xs text-indigo-600 mt-1">
                    Node Record Identifier: {selectedNode.sub}
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed mt-3.5">
                    {selectedNode.details}
                  </p>

                  <div className="mt-5 space-y-2">
                    <span className="font-mono text-[9px] tracking-wider text-stone-400 font-semibold uppercase block">
                      Sync Status logs:
                    </span>
                    <div className="bg-stone-900 text-stone-300 font-mono text-[10px] p-3 rounded-lg leading-relaxed overflow-hidden">
                      <div className="text-indigo-400 font-semibold">{`// schema bindings for ${selectedNode.id}`}</div>
                      <div>{`id: 110992-${selectedNode.id}`}</div>
                      <div>{`last_analyzed: "2026-05-22"`}</div>
                      <div>{`incident_hops: 1`}</div>
                      <div className="text-emerald-500">status: "synced_live"</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <Database className="w-8 h-8 text-stone-300 mx-auto mb-2 animate-bounce" />
                  <p className="text-xs text-stone-400">
                    Click any node in the knowledge graph to view real-time synchronized JSON payload keys.
                  </p>
                </div>
              )}
            </div>

            {/* Mini Narrative */}
            <div className="mt-4 pt-3 border-t border-stone-100 text-stone-500 text-xs italic">
              100% Shared schema avoids traditional database silos.
            </div>
          </div>

          {/* Quick Query Launcher Panel */}
          <div className="bg-stone-900 text-stone-100/90 rounded-2xl p-5 border border-stone-950 flex flex-col justify-between">
            <div>
              <span className="font-mono text-[9px] tracking-widest text-indigo-400 font-bold uppercase block mb-3">
                1st-Generation Queries
              </span>

              <div className="space-y-2">
                {SCENARIOS.map((s, idx) => {
                  const isActive = activeScenarioIdx === idx;
                  return (
                    <button
                      key={idx}
                      id={`scenario-btn-${idx}`}
                      onClick={() => runScenario(idx)}
                      className={`w-full text-left p-2.5 rounded-lg border text-xs leading-snug transition-all flex items-start gap-2 ${
                        isActive
                          ? 'bg-indigo-900/40 border-indigo-500 text-white shadow-md font-semibold'
                          : 'bg-stone-800/40 border-stone-800 text-stone-300 hover:bg-stone-800 hover:border-stone-700'
                      }`}
                    >
                      <Play className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${isActive ? 'text-indigo-400 fill-indigo-400' : 'text-stone-400'}`} />
                      <div>
                        <div className="font-semibold text-white">{s.title}</div>
                        <div className="font-mono text-[9.5px] text-stone-400 mt-0.5">{`"${s.query}"`}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-800 text-[10.5px] font-mono text-stone-400 leading-normal flex gap-2">
              <Globe className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
              <span>{narrativeText}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
