import { useState, useEffect } from 'react';
import { Settings, RefreshCcw, ArrowRightLeft, ShieldAlert, GitBranch, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SyncMessage } from '../../types';

interface DirectMapping {
  foreignKey: string;
  foreignLabel: string;
  localKey: string;
  localLabel: string;
  type: 'text' | 'select' | 'part' | 'user';
  value: string;
}

const CONNECTOR_MAPPINGS: Record<string, DirectMapping[]> = {
  Jira: [
    { foreignKey: 'key', foreignLabel: 'Issue Key (PROJ-231)', localKey: 'id', localLabel: 'ISS-2669', type: 'text', value: 'PROJ-231' },
    { foreignKey: 'summary', foreignLabel: 'Summary Description', localKey: 'title', localLabel: 'Title', type: 'text', value: 'Failed checkout binder policy timeout' },
    { foreignKey: 'status', foreignLabel: 'Status (In Progress)', localKey: 'stage', localLabel: 'Stage (development)', type: 'select', value: 'development' },
    { foreignKey: 'customfield_10023', foreignLabel: 'Component Part Catalog ID', localKey: 'part', localLabel: 'Part (Policy-Bind)', type: 'part', value: 'FEAT-policy-bind' },
    { foreignKey: 'assignee', foreignLabel: 'Assignee Email', localKey: 'owner', localLabel: 'Owner Ref (@dasha)', type: 'user', value: 'dasha@qualitykiosk.com' }
  ],
  Zendesk: [
    { foreignKey: 'ticket_id', foreignLabel: 'Zendesk ID (#5521)', localKey: 'id', localLabel: 'TKT-9921', type: 'text', value: '#5521' },
    { foreignKey: 'subject', foreignLabel: 'Subject Box', localKey: 'title', localLabel: 'Title', type: 'text', value: 'Cannot bind policy after payment confirmation' },
    { foreignKey: 'status', foreignLabel: 'Status (Open)', localKey: 'stage', localLabel: 'Stage (triage)', type: 'select', value: 'triage' },
    { foreignKey: 'priority', foreignLabel: 'SLA Priority (High)', localKey: 'severity', localLabel: 'Severity (Severe)', type: 'select', value: 'severe' },
    { foreignKey: 'requester_email', foreignLabel: 'Requester Account Email', localKey: 'account', localLabel: 'Account Customer Node', type: 'user', value: 'sndpblgr5@gmail.com' }
  ],
  GitHub: [
    { foreignKey: 'number', foreignLabel: 'PR Number (#114)', localKey: 'id', localLabel: 'COD-114', type: 'text', value: 'PR-#114' },
    { foreignKey: 'title', foreignLabel: 'Pull Request Header', localKey: 'title', localLabel: 'Title', type: 'text', value: 'fix: validate payment retry threshold policy-bind' },
    { foreignKey: 'state', foreignLabel: 'State (Merged)', localKey: 'stage', localLabel: 'Stage (completed)', type: 'select', value: 'completed' },
    { foreignKey: 'repository', foreignLabel: 'Repo Catalog Origin', localKey: 'part', localLabel: 'Linked Part Catalog', type: 'part', value: 'FEAT-policy-bind' },
    { foreignKey: 'user.login', foreignLabel: 'Author Username', localKey: 'owner', localLabel: 'Owner Code Committer', type: 'user', value: '@dasha' }
  ]
};

export default function SlideAirSync() {
  const [activeConnector, setActiveConnector] = useState<'Jira' | 'Zendesk' | 'GitHub'>('Jira');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [replicaVersion, setReplicaVersion] = useState<number>(42);
  const [editedMappingIdx, setEditedMappingIdx] = useState<number | null>(null);
  const [editedValue, setEditedValue] = useState<string>('');

  const currentMappings = CONNECTOR_MAPPINGS[activeConnector];

  const triggerAirSyncRun = () => {
    setIsSyncing(true);
    setLogs([]);
    const logsSequence = [
      `[${new Date().toISOString().split('T')[1].slice(0, 8)}] 🔄 AirSync trigger initiated from webhook event.`,
      `[INFO] Pulling Delta payload from verified ${activeConnector} API layer...`,
      `[RESOLVED] Multi-link mapping validation running: field-by-field translation.`,
      `[INFO] Field mapped: foreignKey [${currentMappings[2].foreignKey}] ➔ localKey [${currentMappings[2].localKey}] successfully mapped.`,
      `[INFO] Checking idempotency tags in graph database...`,
      `[IDEMPOTENT] Duplicate token match: false. Writing master record.`,
      `[SUCCESS] Bidirectional synchronization completed! Symmetrical update committed to DevRev Hub.`
    ];

    logsSequence.forEach((logLine, idx) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, logLine]);
        if (idx === logsSequence.length - 1) {
          setIsSyncing(false);
          setReplicaVersion((v) => v + 1);
        }
      }, (idx + 1) * 350);
    });
  };

  const handleEditValue = (idx: number) => {
    setEditedMappingIdx(idx);
    setEditedValue(currentMappings[idx].value);
  };

  const handleSaveValue = (idx: number) => {
    currentMappings[idx].value = editedValue;
    setEditedMappingIdx(null);
    setLogs((prev) => [
      ...prev,
      `[USER_EDIT] Overwrote mapping attribute [${currentMappings[idx].foreignKey}] ➔ "${editedValue}". Click Sync to push delta.`
    ]);
  };

  useEffect(() => {
    setLogs([
      `⚡ Connector [${activeConnector}] listening on webhook channel: https://api.devrev.ai/v1/airsync/hook`,
      `Status: Listening. Click 'Run Delta Sync' to simulate live message events.`
    ]);
  }, [activeConnector]);

  return (
    <div className="w-full h-full flex flex-col justify-between items-stretch">
      {/* Connector selector */}
      <div className="flex gap-2 bg-stone-100 p-1.5 rounded-xl border border-stone-200 self-start">
        {['Jira', 'Zendesk', 'GitHub'].map((conn) => (
          <button
            key={conn}
            id={`connector-tab-${conn}`}
            onClick={() => setActiveConnector(conn as any)}
            className={`font-mono text-xs px-4 py-2 rounded-lg transition-all font-semibold ${
              activeConnector === conn
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            {conn.toUpperCase()} AIRSYNC
          </button>
        ))}
      </div>

      {/* Main Workspace Split */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 py-4 items-stretch min-h-[300px]">
        {/* Left Side: Field Matching Map Table */}
        <div className="md:col-span-7 bg-white border border-stone-200 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-stone-100">
              <span className="font-mono text-xs text-stone-500 tracking-wider font-semibold uppercase">
                Active Mapping: {activeConnector} ➔ DevRev Graph
              </span>
              <span className="font-mono text-[9.5px] bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded font-bold">
                14 PATENTS INCLUDED
              </span>
            </div>

            {/* Custom Interactive Table */}
            <div className="mt-4 space-y-2.5">
              {currentMappings.map((map, idx) => {
                const isEditing = editedMappingIdx === idx;
                return (
                  <div
                    key={map.foreignKey}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border border-stone-100 bg-stone-50/50 p-2.5 rounded-xl text-xs gap-3"
                  >
                    {/* Left Node */}
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-[10px] text-stone-400 font-semibold">{`foreign_field: ${map.foreignKey}`}</div>
                      <div className="font-semibold text-stone-900 truncate mt-0.5">{map.foreignLabel}</div>
                    </div>

                    {/* Transition Arrow icon */}
                    <div className="flex items-center justify-center p-1 bg-white border border-stone-150 rounded-lg text-indigo-600 shadow-sm self-center">
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                    </div>

                    {/* Right Node */}
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-[10px] text-indigo-600 font-bold">{`mapped_node: ${map.localKey}`}</div>
                      <div className="font-semibold text-indigo-900 truncate mt-0.5">{map.localLabel}</div>
                    </div>

                    {/* Interactive value override */}
                    <div className="sm:w-[150px] flex items-center justify-end text-right">
                      {isEditing ? (
                        <div className="flex items-center gap-1 w-full">
                          <input
                            type="text"
                            value={editedValue}
                            onChange={(e) => setEditedValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveValue(idx)}
                            className="w-full bg-white border border-indigo-400 rounded px-1.5 py-0.5 text-[11px] font-mono focus:outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveValue(idx)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded px-2 py-0.5 text-[10px] font-bold"
                          >
                            Set
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEditValue(idx)}
                          className="font-mono text-[10.5px] text-stone-500 hover:text-indigo-600 underline font-semibold max-w-full truncate"
                          title="Click to edit value"
                        >
                          {map.value}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-[11px] text-stone-400 font-mono mt-4 leading-normal italic">
            * AirSync matches custom field metadata dialects on the fly, avoiding translation breaks during remote Schema edits.
          </p>
        </div>

        {/* Right Side: Operational CLI & Sync Actions */}
        <div className="md:col-span-5 flex flex-col gap-4">
          {/* Action Trigger Card */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-indigo-600 animate-spin" />
                <span className="font-mono text-xs text-stone-500 tracking-wider font-semibold uppercase">
                  Telemetry Sync Controls
                </span>
              </div>
              <span className="font-mono text-[11px] font-bold text-stone-900">
                Replica v{replicaVersion}
              </span>
            </div>

            <div className="my-5">
              <h3 className="text-base font-bold text-stone-900">
                Bidirectional Sync Testbench
              </h3>
              <p className="text-xs text-stone-500 leading-normal mt-1">
                Trigger AirSync mapping rules. Changes made inside Jira sync down below. Updates committed locally to DevRev automatically mirror upstream.
              </p>
            </div>

            <button
              id="airsync-trigger-btn"
              onClick={triggerAirSyncRun}
              disabled={isSyncing}
              className={`w-full py-3 rounded-xl font-mono text-xs font-bold transition flex items-center justify-center gap-2 border ${
                isSyncing
                  ? 'bg-stone-200 border-stone-300 text-stone-500 cursor-not-allowed'
                  : 'bg-indigo-600 border-indigo-700 hover:bg-indigo-700 text-white hover:shadow-md'
              }`}
            >
              <RefreshCcw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'SYNCHRONIZING IDEMPOTENT DELTA...' : 'RUN DELTA SYNC'}
            </button>
          </div>

          {/* Operational logs */}
          <div className="bg-stone-900 border border-stone-950 rounded-2xl p-4 flex-1 flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                <span className="font-mono text-[9px] text-stone-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Terminal className="w-3 h-3 text-indigo-400" /> Operational log logs
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="mt-3.5 space-y-2 max-h-[140px] overflow-y-auto pr-1">
                <AnimatePresence>
                  {logs.map((log, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="font-mono text-[10px] text-stone-300 leading-relaxed font-sans"
                    >
                      {log}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-4 pt-2.5 border-t border-stone-800 text-[10px] font-mono text-stone-500 flex gap-2 items-center">
              <ShieldAlert className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
              <span>Idempotency verification guarantees zero duplicated tickets upstream.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
