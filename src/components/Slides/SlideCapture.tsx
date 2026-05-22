import { useState, useEffect } from 'react';
import { Send, Play, Pause, FastForward, Smartphone, Bot, User, CheckCircle2, AlertTriangle, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ReplayLog } from '../../types';

const INITIAL_REPLAY_LOGS: ReplayLog[] = [
  { time: '14:01:42', action: 'click', detail: 'Buy Policy Button', color: 'text-sky-500' },
  { time: '14:01:43', action: 'fetch', detail: 'POST /api/insurance/purchase-policy', status: '500 Internal Error', color: 'text-rose-500' },
  { time: '14:01:51', action: 'click', detail: 'Buy Policy Button (Retry 1)', color: 'text-sky-500' },
  { time: '14:01:56', action: 'click', detail: 'Buy Policy Button (Retry 2 - Rage Click)', color: 'text-amber-500' },
  { time: '14:02:01', action: 'input', detail: 'Entered promo code "FALLBACK_SAVE"', color: 'text-teal-500' },
  { time: '14:02:03', action: 'console.error', detail: 'PolicyBindError: webhook timeout from Razorpay', color: 'text-rose-500' },
  { time: '14:02:18', action: 'toast', detail: 'Pushed notification: "Something went wrong. Reconciling..."', color: 'text-amber-500' }
];

const SUGGESTED_CHAT_MESSAGES = [
  { text: 'My check-out payment succeeded but my policy is still inactive.', label: 'Active Payment Error' },
  { text: 'I keep getting a timeout error after clicks.', label: 'Client UI freeze' },
  { text: 'Our developer team needs the trace logs for user #41AB9.', label: 'Get telemetry logs' }
];

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export default function SlideCapture() {
  // Chat state
  const [chatInputValue, setChatInputValue] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { id: '1', sender: 'bot', text: 'Hi! I am the automated PLuG Agent. I can inspect your active browser sessions to diagnose errors instantly. How can I help?', timestamp: '14:03:01' }
  ]);
  const [isBotTyping, setIsBotTyping] = useState<boolean>(false);

  // Session player state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playheadIndex, setPlayheadIndex] = useState<number>(1);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  // Auto playback simulation
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlayheadIndex((prev) => {
          if (prev >= INITIAL_REPLAY_LOGS.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1500 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setChatHistory((prev) => [...prev, userMsg]);
    setChatInputValue('');
    setIsBotTyping(true);

    // Simulated chatbot intelligence scoped directly to graph session telemetry
    setTimeout(() => {
      let botResponse = '';
      if (text.includes('payment') || text.includes('inactive')) {
        botResponse = `Thanks for writing. Checking session #41AB9... Yes, I see a 500 Network error on '/api/insurance/purchase-policy' occurring at 14:01:43. I have auto-assigned this to Issue ISS-2669 and consolidated under severe Ticket TKT-9921. Our SRE team is resolving this.`;
      } else if (text.includes('freeze') || text.includes('timeout')) {
        botResponse = `I see. Our Session Analytics detected warning indicators: 2 rage clicks on 'Buy Policy' buttons around 14:01:56. This is currently linked to the microservice part 'FEAT-policy-bind'. We are rolling out a hotfix now.`;
      } else {
        botResponse = `Understood. Analyzing telemetry trace maps for your profile. I've linked your account ref directly to active incidents on our engineering board to prioritize your refund.`;
      }

      setChatHistory((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: botResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        }
      ]);
      setIsBotTyping(false);
    }, 1200);
  };

  const currentLog = INITIAL_REPLAY_LOGS[playheadIndex] || INITIAL_REPLAY_LOGS[0];

  return (
    <div className="w-full h-full flex flex-col justify-between items-stretch">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 py-2 items-stretch min-h-[360px]">
        
        {/* Left Panel: Simulated PLuG Web Chat widget */}
        <div className="lg:col-span- così-bnd lg:col-span-5 bg-white border border-stone-200 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-xs text-stone-500 tracking-wider font-semibold uppercase">
                  PLuG Inbound SDK Widget
                </span>
              </div>
              <span className="text-[10px] font-mono text-stone-400">
                SNDP-SUPPORT (ACTIVE)
              </span>
            </div>

            {/* Quick Prompts Suggestions */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {SUGGESTED_CHAT_MESSAGES.map((msg, i) => (
                <button
                  key={i}
                  id={`chat-prompt-btn-${i}`}
                  onClick={() => handleSendMessage(msg.text)}
                  className="font-mono text-[9px] bg-stone-50 border border-stone-150 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 px-2 py-1 rounded transition text-left"
                >
                  {msg.label}
                </button>
              ))}
            </div>

            {/* Chat message history box */}
            <div className="mt-4 space-y-3 h-[200px] overflow-y-auto border border-stone-50 bg-stone-50/30 p-2.5 rounded-xl pr-1 text-xs">
              {chatHistory.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 max-w-[85%] ${
                    msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl flex-shrink-0 ${
                      msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-stone-100 text-stone-800'
                    }`}
                  >
                    {msg.sender === 'bot' ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <div
                      className={`p-2.5 rounded-2xl leading-normal ${
                        msg.sender === 'user'
                          ? 'bg-indigo-50 border border-indigo-100 text-stone-850 rounded-tr-none'
                          : 'bg-white border border-stone-200 text-stone-850 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <div className="font-mono text-[8px] text-stone-400 mt-1 px-1">
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              ))}

              {isBotTyping && (
                <div className="flex gap-2 mr-auto max-w-[80%] items-center text-stone-400">
                  <div className="p-2 rounded-xl bg-stone-100">
                    <Bot className="w-3.5 h-3.5 text-stone-400" />
                  </div>
                  <span className="font-mono text-[10px] animate-pulse">
                    PLuG Agent analyzing active trace...
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Chat input box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(chatInputValue);
            }}
            className="mt-3.5 flex gap-2"
          >
            <input
              type="text"
              id="plug-chat-input"
              placeholder="Ask PLuG or submit query..."
              value={chatInputValue}
              onChange={(e) => setChatInputValue(e.target.value)}
              className="flex-1 border border-stone-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
            <button
              type="submit"
              id="plug-chat-send"
              className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Right Panel: Simulated Session Replay with scrubbing logs */}
        <div className="lg:col-span-7 bg-stone-900 border border-stone-950 rounded-2xl p-4 flex flex-col justify-between overflow-hidden text-stone-300">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-stone-800">
              <span className="font-mono text-[10px] text-stone-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-indigo-400" /> Session Analytics Replay
              </span>
              <span className="font-mono text-[10px] text-indigo-400 font-bold">
                USER_KEY: 41AB9
              </span>
            </div>

            {/* Video scrub player bar */}
            <div className="mt-4 bg-stone-950 border border-stone-850 p-4 rounded-xl">
              <div className="flex items-center justify-between font-mono text-[10px] text-stone-400">
                <span>REPLAY: policy-purchase</span>
                <span className="text-indigo-400 font-bold">
                  {currentLog.time} IST (Event {playheadIndex + 1}/{INITIAL_REPLAY_LOGS.length})
                </span>
              </div>

              {/* Progress Bar scrubber slider */}
              <div className="mt-3 flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max={INITIAL_REPLAY_LOGS.length - 1}
                  value={playheadIndex}
                  onChange={(e) => setPlayheadIndex(Number(e.target.value))}
                  className="w-full accent-indigo-500 h-1 rounded"
                />
              </div>

              {/* Player control buttons */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-900">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1 px-3.5 rounded bg-stone-850 hover:bg-stone-800 text-white font-mono text-[10.5px] font-semibold flex items-center gap-1 transition"
                  >
                    {isPlaying ? <Pause className="w-3 h-3 text-amber-400 fill-amber-400" /> : <Play className="w-3 h-3 text-indigo-400 fill-indigo-400" />}
                    {isPlaying ? 'PAUSE' : 'PLAY'}
                  </button>

                  <button
                    onClick={() => setPlaybackSpeed((s) => (s >= 4 ? 1 : s * 2))}
                    className="p-1 px-2.5 rounded bg-stone-850 hover:bg-stone-800 text-stone-300 font-mono text-[10.5px] flex items-center gap-1 transition"
                  >
                    <FastForward className="w-3 h-3 text-indigo-400" /> {playbackSpeed}x
                  </button>
                </div>

                <div className="font-mono text-[10px] text-stone-500">
                  Target Part: <span className="text-stone-300">FEAT-policy-bind</span>
                </div>
              </div>
            </div>

            {/* Simulated Live telemetry/log logs */}
            <div className="mt-4 space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
              {INITIAL_REPLAY_LOGS.map((log, idx) => {
                const isActive = playheadIndex === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setPlayheadIndex(idx)}
                    className={`cursor-pointer transition-all p-2 rounded-lg text-[11px] grid grid-cols-12 gap-3 items-center ${
                      isActive
                        ? 'bg-indigo-950/30 border border-indigo-500/30 text-white font-semibold'
                        : 'bg-stone-950/30 border border-transparent text-stone-400'
                    }`}
                  >
                    <span className="col-span-2 font-mono">{log.time}</span>
                    <span className={`col-span-3 font-mono font-bold uppercase truncate ${log.color}`}>
                      {log.action}
                    </span>
                    <span className="col-span-5 truncate">{log.detail}</span>
                    <span className="col-span-2 font-mono text-[9px] text-right text-stone-500">
                      {log.status || ''}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-3.5 p-3 bg-stone-950 rounded-xl border border-stone-850 flex items-center gap-2.5 font-mono text-[10.5px] leading-relaxed">
            <Cpu className="w-4 h-4 text-indigo-400 flex-shrink-0 animate-pulse" />
            <span>
              Both conversation and session tags write into the graph. SRE/Support query them in line.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
