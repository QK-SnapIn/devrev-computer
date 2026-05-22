import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  User, 
  BookOpen, 
  Tv, 
  Maximize, 
  Workflow,
  Sparkles,
  Layers,
  Award,
  HelpCircle
} from 'lucide-react';

// Modular slide widgets
import SlideStack from './components/Slides/SlideStack';
import SlideGraph from './components/Slides/SlideGraph';
import SlideAirSync from './components/Slides/SlideAirSync';
import SlideCapture from './components/Slides/SlideCapture';
import SlideAgents from './components/Slides/SlideAgents';
import SlideAlertRCA from './components/Slides/SlideAlertRCA';
import SlideWalkthrough from './components/Slides/SlideWalkthrough';
import SlideViewSideBySide from './components/Slides/SlideViewSideBySide';
import SlidePermanentFix from './components/Slides/SlidePermanentFix';
import SlidePersonas from './components/Slides/SlidePersonas';
import SlideWhyNow from './components/Slides/SlideWhyNow';

// Strategic Talk Track bullet points for the Speaker notes panel
const SPEAKER_NOTES: Record<number, string[]> = {
  0: [
    "Welcome the customer. State clearly: DevRev is not another SaaS widget; it is the Agentic Workspace.",
    "Hook: Ask them how many tools they open to answer a simple SRE checkout error (Zendesk, Jira, Datadog, Slack, GitHub).",
    "Value: Shift focus from separate siloed tabs to one unified semantic graph of action where Computer speaks to everyone."
  ],
  1: [
    "Walk through the 5 architectural Layers of DevRev vertical integration.",
    "Explain that other players place an AI wrapper or chat box on top of disjointed tools. DevRev verticalizes from ingestion up to interface.",
    "Mention how the bottom Capture layer (PLuG & Session Analytics) actively feeds everything above in real time."
  ],
  2: [
    "Run the semantic query simulator on the graph. Click 'EMEA Checkout Outage Trace'.",
    "Explain: This query crawls through Sessions, Conversations, Tickets, Incidents, Parts, and Code commits on one hop.",
    "Highlight: No complex SQL queries, no fragile analytics ETL pipelines, no multi-team data syncing gaps."
  ],
  3: [
    "Dwell on bidirectional sync with AirSync (14 patents).",
    "Key note: Support/SRE teams do NOT need to abandon Zendesk, Jira or GitHub immediately. AirSync mirrors attributes idempotently onto the graph, allowing seamless migration."
  ],
  4: [
    "Compare and contrast client conversations with user behavior sessions.",
    "Explain: Standard tools capture the text (the PLuG chat). DevRev correlates the actual clicked actions (the Session traces) alongside network exceptions, exposing precise friction."
  ],
  5: [
    "Showcase the Prebuilt library vs. custom IDE Studio.",
    "Key: Demonstrate how quick custom agents are compiled. Running 'The Judge' ensures 100% prompt accuracy and safety before deployment."
  ],
  6: [
    "Walk through telemetry clustering.",
    "Explain: Suppressing 99.6% alarm noise means SREs are paged only for true positive microcatalog failures, lowering MTTR to 90 seconds."
  ],
  7: [
    "Review the horizontal timeline steps from incident detection down to postmortem drafting.",
    "Contrast with classic teams: 7 minutes MTTR vs 18 minutes resolution, 8 duplicated tickets, 3-team war rooms."
  ],
  8: [
    "Walk through Double Screen session replay. Review how Computer summarizes complex SRE incidents with contextual links.",
    "Explain: The developer instantly targets PR hotfix suggestions with trace logs alongside."
  ],
  9: [
    "Discuss the four key operational questions of incident recovery.",
    "Highlight: SREs, developers, supports, and product leads query the same board in normal human language."
  ],
  10: [
    "Emphasize the 5-member persona lenses.",
    "Key: Although Sarah keys into system-replica logs and Marcus keys into ARR preservation, both query the same catalog nodes."
  ],
  11: [
    "Conclude the pitch. Generate a custom 2-week trial blueprint with the customer.",
    "Call to Action: co-design their noisiest transaction loop on real graph data. Minimal SRE handoff required."
  ]
};

interface SlideDef {
  id: number;
  eyebrow: string;
  title: string;
  subtitle: string;
}

const SLIDES: SlideDef[] = [
  { id: 0, eyebrow: 'The Pitch', title: 'One Workspace. Every Role. The Same Graph.', subtitle: 'Capture customer loops, sync engineering tasks, and reason with SRE alerts on a unified master blueprint — with Computer answering everything.' },
  { id: 1, eyebrow: 'The Stack', title: 'Computer Sits on Top of memory', subtitle: 'A vertical pipeline: connectors, capture channels, workflows, and memory feed custom micro-agents. Every team uses the same core database brain.' },
  { id: 2, eyebrow: 'The Graph', title: 'Multi-linked Entity memory Nodes', subtitle: 'A ticket is not a siloed spreadsheet row. It is linked to incidents, code commits, and active customer profiles. Traversal is immediate.' },
  { id: 3, eyebrow: 'AirSync Schema Maps', title: 'Connect systems without losing context', subtitle: 'Teams can continue working in Jira, GitHub, or Zendesk. AirSync translates metadata schemas on the fly bidirectional, idempotent, field-aware.' },
  { id: 4, eyebrow: 'PLuG & Session Capture', title: 'Integrate client voice with lived traces', subtitle: 'Support widgets capture the complaint text, while Session Analytics logs precise network exceptions and rage-click behaviors simultaneously.' },
  { id: 5, eyebrow: 'Agent Library & Studio Workspace', title: 'Ship immediately, or author customized agents', subtitle: 'Deploy prebuilt workers, or author custom event triggers, mapping models, and prompt structures validated against robust testing harnesses.' },
  { id: 6, eyebrow: 'Alert Intelligence (RCA Mixer)', title: 'Compress 2,400 raw alerts down to exactly 1 Page', subtitle: 'Evaluate live temporal, topological, and semantic relationships across server node metrics. Suppress noise, isolate root cause, write hotfix PRs.' },
  { id: 7, eyebrow: 'Horizontal SRE Walkthrough', title: 'Timeline of an active transaction timeout', subtitle: 'Follow the lifecycle of an outage from initial webhook detection up to PR compilation, email notification, and automated postmortem drafting.' },
  { id: 8, eyebrow: 'Operation Board Replays', title: '"What is ISS-2669?" — Computer analyzes in line', subtitle: 'View natural query results alongside telemetry, network metrics and console stack traces simultaneously without tab-switching.' },
  { id: 9, eyebrow: 'Permanent Fix Bento Nodes', title: 'Answer 4 operational channels simultaneously', subtitle: '"How to fix it?" · "Write unit-tests" · "Inform customer queues" · "Draft postmortem metrics". 4 prompts, 1 knowledge graph.' },
  { id: 10, eyebrow: 'Teammates Dashboard Lenses', title: '5 Personas query the same database brain', subtitle: 'SREs inspect replica flapping rates, support agents analyze SLAs, and CXOs review ARR value preservation. Scoped security bounds.' },
  { id: 11, eyebrow: 'Why Now Assessment', title: 'The agentic workspace, in live trial', subtitle: 'Set up an interactive 2-week roadmap. Select your target friction and ingestion interfaces, and let DevRev co-design the model with your data.' }
];

export default function App() {
  const [currentSlideIdx, setCurrentSlideIdx] = useState<number>(0);
  const [showNotes, setShowNotes] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Presenter Clock Timer states
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(true);

  useEffect(() => {
    let interval: any;
    if (timerActive) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const formatTimer = (sec: number) => {
    const minutes = Math.floor(sec / 60);
    const remainingSecs = sec % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
  };

  // Keyboard navigation bindings
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        setCurrentSlideIdx((prev) => (prev >= SLIDES.length - 1 ? prev : prev + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        setCurrentSlideIdx((prev) => (prev <= 0 ? prev : prev - 1));
      } else if (e.key === 'Home') {
        setCurrentSlideIdx(0);
      } else if (e.key === 'End') {
        setCurrentSlideIdx(SLIDES.length - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const goToNext = () => {
    setCurrentSlideIdx((prev) => (prev >= SLIDES.length - 1 ? prev : prev + 1));
  };

  const goToPrev = () => {
    setCurrentSlideIdx((prev) => (prev <= 0 ? 0 : prev - 1));
  };

  // Toggle Presentation Fullscreen
  const togglePresentationFullscreen = () => {
    const elem = document.documentElement;
    if (!isFullscreen) {
      elem.requestFullscreen().then(() => setIsFullscreen(true)).catch((err) => {
        alert('Fullscreen request denied in iFrame. Open app in a new tab to activate.');
      });
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const activeSlide = SLIDES[currentSlideIdx];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#fafaf7] text-[#15171e] font-sans transition-colors duration-305">
      
      {/* Top Presentation Header Navigation bar */}
      <header className="h-[64px] border-b border-stone-200 px-6 sm:px-8 flex items-center justify-between bg-white z-40 relative shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1 px-3 bg-neutral-900 text-white rounded font-mono text-[10.5px] font-bold tracking-widest uppercase">
            DEVREV
          </div>
          <div className="hidden sm:inline-block font-mono text-xs text-stone-400 font-semibold tracking-wider">
            × QUALITYKIOSK PITCH DECK
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Active presenter clock */}
          <div className="flex items-center gap-2 bg-stone-50 border border-stone-150 px-3 py-1.5 rounded-lg text-xs font-mono text-stone-600 shadow-sm">
            <Clock className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span className="font-bold">{formatTimer(secondsElapsed)}</span>
            <button 
              onClick={() => setTimerActive(!timerActive)}
              className="hover:text-indigo-600 uppercase text-[9px] font-bold tracking-wider ml-1"
            >
              {timerActive ? 'Pause' : 'Play'}
            </button>
          </div>

          <button
            id="toggle-fullscreen-btn"
            onClick={togglePresentationFullscreen}
            className="p-2 hover:bg-stone-100 rounded-lg text-stone-500 hover:text-stone-900 transition"
            title="Toggle fullscreen mode"
          >
            <Maximize className="w-4 h-4" />
          </button>

          <button
            id="speaker-notes-toggle"
            onClick={() => setShowNotes(!showNotes)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold font-mono transition border ${
              showNotes 
                ? 'bg-indigo-600 border-indigo-700 text-white shadow-md' 
                : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            {showNotes ? 'HIDE SPEECH NOTES' : 'SPEECH NOTES'}
          </button>
        </div>
      </header>

      {/* Main Slide viewer workspace */}
      <main className="flex-1 flex overflow-hidden relative items-stretch">
        
        {/* Dynamic Presentation Screen */}
        <div className="flex-1 flex flex-col p-6 sm:p-8 justify-between relative overflow-y-auto">
          
          {/* Header titles of current Slide */}
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-indigo-600 tracking-wider font-bold uppercase">
                {String(currentSlideIdx + 1).padStart(2, '0')} · {activeSlide.eyebrow}
              </span>
              <span className="font-mono text-[9px] text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded uppercase font-semibold">
                Customer Pitch
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1 leading-tight tracking-tight">
              {activeSlide.title}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-4xl leading-relaxed">
              {activeSlide.subtitle}
            </p>
          </div>

          {/* Interactive Screen Sandbox block */}
          <div className="flex-1 min-h-0 flex items-stretch justify-center my-2 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlideIdx}
                initial={{ opacity: 0, scale: 0.98, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.01, y: -15 }}
                transition={{ duration: 0.22 }}
                className="w-full h-full"
              >
                {/* Slide 1 - Pitch Title view */}
                {currentSlideIdx === 0 && (
                  <div className="w-full h-full flex flex-col justify-center relative min-h-[340px] px-1 overflow-hidden">
                    
                    {/* Display display styling */}
                    <div className="space-y-4 max-w-5xl relative z-10">
                      <div className="font-mono text-[11px] text-indigo-600 font-bold uppercase tracking-widest bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-lg self-start inline-block">
                        A unified workspace. A shared graph. Computer at the top.
                      </div>
                      
                      <h2 className="text-5xl sm:text-7xl font-extrabold text-stone-950 leading-[0.98] tracking-tighter">
                        One workspace. <br className="hidden md:inline" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-700">
                          Every role.
                        </span>
                      </h2>

                      <p className="text-sm sm:text-base text-stone-605 max-w-3xl leading-relaxed font-semibold">
                        The same graph that captures what your customers do, what your engineers build, and what your business runs on — with Computer sitting on top of it for everyone.
                      </p>
                    </div>

                    {/* Bottom feature blocks layout */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 max-w-6xl relative z-10 border-t border-stone-200/60 pt-6">
                      {[
                        { title: 'Capture', text: 'PLuG chat widget, Session Analytics, sync integrations.' },
                        { title: 'Connect', text: 'Tickets, issues, code commits, parts — one graph nodes.' },
                        { title: 'Reason', text: 'Wired event handlers, workflows + agents reacting in real time.' },
                        { title: 'Ask', text: 'Computer answers queries tailored to your specific role.' }
                      ].map((item) => (
                        <div key={item.title} className="p-3 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl transition">
                          <h4 className="font-mono text-xs text-indigo-600 font-bold uppercase">{item.title}</h4>
                          <p className="text-xs text-stone-500 mt-1 leading-relaxed">{item.text}</p>
                        </div>
                      ))}
                    </div>

                    {/* Faint vector graphics background elements */}
                    <div className="absolute right-0 bottom-4 w-[280px] h-[280px] bg-gradient-to-tr from-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
                  </div>
                )}

                {/* Modular Slides matching custom elements */}
                {currentSlideIdx === 1 && <SlideStack />}
                {currentSlideIdx === 2 && <SlideGraph />}
                {currentSlideIdx === 3 && <SlideAirSync />}
                {currentSlideIdx === 4 && <SlideCapture />}
                {currentSlideIdx === 5 && <SlideAgents />}
                {currentSlideIdx === 6 && <SlideAlertRCA />}
                {currentSlideIdx === 7 && <SlideWalkthrough />}
                {currentSlideIdx === 8 && <SlideViewSideBySide />}
                {currentSlideIdx === 9 && <SlidePermanentFix />}
                {currentSlideIdx === 10 && <SlidePersonas />}
                {currentSlideIdx === 11 && <SlideWhyNow />}

              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Presenter Navigation Controller bar */}
          <footer className="h-[56px] border-t border-stone-200/70 mt-4 flex items-center justify-between shrink-0 select-none">
            
            <div className="flex items-center gap-1.5">
              <button
                id="prev-slide-btn"
                onClick={goToPrev}
                disabled={currentSlideIdx === 0}
                className="p-2 bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 rounded-xl transition disabled:opacity-40 disabled:hover:bg-white"
                title="Previous slide"
              >
                <ChevronLeft className="w-4 h-4 font-bold" />
              </button>

              <span className="font-mono text-xs text-stone-500 px-2">
                Slide {String(currentSlideIdx + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
              </span>

              <button
                id="next-slide-btn"
                onClick={goToNext}
                disabled={currentSlideIdx === SLIDES.length - 1}
                className="p-2 bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 rounded-xl transition disabled:opacity-40 disabled:hover:bg-white"
                title="Next slide"
              >
                <ChevronRight className="w-4 h-4 font-bold" />
              </button>
            </div>

            {/* Navigation Dots list clickables */}
            <div className="hidden md:flex items-center gap-1.5">
              {SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  id={`nav-dot-${slide.id}`}
                  onClick={() => setCurrentSlideIdx(idx)}
                  className={`h-2 rounded-full transition-all ${
                    currentSlideIdx === idx 
                      ? 'bg-indigo-600 w-6' 
                      : 'bg-stone-300 w-2 hover:bg-stone-400'
                  }`}
                  title={`Go to Slide: ${slide.eyebrow}`}
                />
              ))}
            </div>

            <div className="text-xs text-stone-450 font-mono tracking-widest uppercase hidden lg:inline-block">
              * Press Space or Arrow Keys to navigate slides.
            </div>

          </footer>

        </div>

        {/* Presenter Speaker Notes Sidebar Drawer */}
        <AnimatePresence>
          {showNotes && (
            <motion.aside
              key="notes-sidebar"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 340 }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-stone-900 border-l border-stone-950 text-stone-300 p-5 flex flex-col justify-between shrink-0 relative overflow-hidden"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                  <span className="font-mono text-[9px] text-stone-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-indigo-400 animate-pulse" /> Strategic Talk track guide
                  </span>
                  <button
                    onClick={() => setShowNotes(false)}
                    className="text-stone-500 hover:text-white text-xs font-mono font-bold"
                  >
                    CLOSE
                  </button>
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-white tracking-tight font-sans">
                    {activeSlide.eyebrow} Talking points
                  </h3>
                  <p className="font-mono text-[9.5px] text-indigo-400 mt-0.5">
                    ESTIMATED TIME: ~1.5 MINUTES
                  </p>
                </div>

                {/* Speaker bullet points checklist */}
                <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                  {SPEAKER_NOTES[currentSlideIdx]?.map((note, idx) => (
                    <div key={idx} className="flex gap-2.5 items-start text-xs leading-relaxed font-sans">
                      <div className="bg-indigo-950 text-indigo-400 border border-indigo-900/30 font-mono text-[9.5px] p-0.5 px-2 rounded-lg font-bold mt-0.5 flex-shrink-0">
                        {idx + 1}
                      </div>
                      <p className="text-stone-200">
                        {note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Presenter recommendation help tag */}
              <div className="mt-6 p-3 bg-stone-950/40 rounded-xl border border-stone-850 flex items-center gap-2 font-mono text-[9.5px] text-stone-450 leading-relaxed">
                <Award className="w-4 h-4 text-indigo-400 flex-shrink-0 animate-bounce" />
                <span>Interact with widgets during the walkthrough to show the graph updates immediately.</span>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
