"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Scissors, 
  Sparkles, 
  Flame, 
  TrendingUp, 
  Layers, 
  ArrowRight, 
  Cpu, 
  Clock, 
  CheckCircle2, 
  Play, 
  Zap,
  Volume2,
  Sliders,
  Smartphone
} from "lucide-react";
import { WaveformPulseBackground } from "@/components/WaveformPulseBackground";
import { LandingHeader } from "@/components/LandingHeader";
import { PhoneViewportMockup } from "@/components/PhoneViewportMockup";

const RETENTION_MILESTONES = [
  {
    second: "0s - 3s",
    title: "Viral Pattern Interrupt",
    rule: "First 3-Second Retention Law",
    impact: "+48% Hook Survival",
    description: "Whisper-v3 detects the speaker opening sentence and instantly triggers Livepeer AI B-Roll to inject a contextual high-impact visual match before the viewer can swipe."
  },
  {
    second: "6s",
    title: "Dynamic Kinetic Re-Zoom",
    rule: "Frame Velocity Modulation",
    impact: "+22% Attention Reset",
    description: "Camera crop transitions smoothly from wide 9:16 to tight punch-in centered on facial emotion, resetting visual fatigue."
  },
  {
    second: "12s",
    title: "Word-Level Color Punch",
    rule: "Bebas Kinetic Captions",
    impact: "+18% Comprehension",
    description: "Key high-sentiment keywords are color-coded in acid lime and electric cyan with zero frame delay."
  },
  {
    second: "24s",
    title: "Loop Handoff Seamless Seam",
    rule: "Infinite Loop Retention",
    impact: "+35% Re-watch Rate",
    description: "The concluding sentence seamlessly completes the grammar of the opening hook, encouraging algorithmic re-plays."
  }
];

export default function DissectLandingPage() {
  const router = useRouter();
  const [ingestUrl, setIngestUrl] = useState("Accelerated Computing & Physical AI Factories");
  const [selectedMilestone, setSelectedMilestone] = useState(0);

  const handleLaunchStudio = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!ingestUrl.trim()) return;
    playClickSound();
    router.push(`/studio?url=${encodeURIComponent(ingestUrl.trim())}`);
  };

  const playClickSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(960, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1440, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // Ignore audio error if blocked by browser policy
    }
  };

  return (
    <div className="relative min-h-screen bg-[#08090e] text-zinc-100 overflow-x-hidden selection:bg-[#84cc16]/30 selection:text-white">
      {/* 60fps Living Audio Spectral Ribbon Canvas */}
      <WaveformPulseBackground />

      {/* Header */}
      <LandingHeader />

      <main className="relative z-10">
        {/* HERO SECTION */}
        <section className="relative pt-24 pb-20 sm:pt-32 sm:pb-28 px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Monolithic Kinetic Copy */}
            <div className="lg:col-span-7 text-left space-y-6">
              
              {/* Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-[#84cc16]/30 text-[11px] font-mono text-[#84cc16] backdrop-blur-md shadow-[0_0_20px_rgba(132,204,22,0.15)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#84cc16] animate-pulse" />
                <span className="tracking-wider uppercase">AUTONOMOUS B-ROLL RE-CUTTER</span>
              </div>

              {/* Master Headline in Outfit Black */}
              <h1 className="font-kinetic font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white leading-[0.88] text-balance">
                DISSECT LONG TALKS INTO <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#84cc16] via-[#06b6d4] to-[#f43f5e]">
                  VIRAL 9:16 GOLD.
                </span>
              </h1>

              {/* Subtext */}
              <p className="max-w-xl text-base sm:text-lg text-zinc-400 font-sans leading-relaxed text-balance">
                Turn 60-minute podcast monologues into 10 high-retention vertical shorts. Dissect uses Whisper-v3 
                timestamp intelligence to autonomously inject generative AI B-roll every 3 seconds.
              </p>

              {/* Interactive Ingest Input Bar for User Input */}
              <div className="p-3.5 rounded-2xl bg-[#0d101a]/95 border border-[#84cc16]/35 shadow-[0_0_35px_rgba(132,204,22,0.15)] max-w-xl space-y-2.5">
                <div className="text-[10px] font-mono text-zinc-400 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-white font-bold">
                    <Sparkles className="w-3 h-3 text-[#84cc16]" />
                    <span>Input Your Longform Video:</span>
                  </span>
                  <span className="text-[#84cc16]">Whisper-v3 + Livepeer AI</span>
                </div>

                <form onSubmit={handleLaunchStudio} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={ingestUrl}
                    onChange={(e) => setIngestUrl(e.target.value)}
                    placeholder="Enter lecture or keynote topic, speech transcript, or YouTube URL..."
                    className="flex-1 bg-black/60 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:border-[#84cc16] focus:outline-none placeholder:text-zinc-600"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#84cc16] to-[#06b6d4] text-black font-heading font-bold text-xs hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 shrink-0 shadow-md cursor-pointer"
                  >
                    <span>Dissect</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>

                <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500 pt-0.5">
                  <span>Quick Test Topics:</span>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <button
                      onClick={() => setIngestUrl("Accelerated Computing & Physical AI Factories")}
                      className="hover:text-[#84cc16] underline transition-colors"
                    >
                      Physical AI
                    </button>
                    <span>·</span>
                    <button
                      onClick={() => setIngestUrl("Autonomous Neural Vision & Software 2.0")}
                      className="hover:text-[#84cc16] underline transition-colors"
                    >
                      Robotic Vision
                    </button>
                    <span>·</span>
                    <button
                      onClick={() => setIngestUrl("Decentralized Compute & Foundation Model Scaling")}
                      className="hover:text-[#84cc16] underline transition-colors"
                    >
                      Decentralized Compute
                    </button>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
                <Link
                  href="/studio"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-sm font-heading font-bold text-black bg-gradient-to-r from-[#84cc16] to-[#06b6d4] hover:brightness-110 transition-all shadow-[0_0_35px_rgba(132,204,22,0.3)] group"
                >
                  <span>Launch Dissect Studio</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <a
                  href="#retention"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-sm font-heading font-semibold text-zinc-200 bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all backdrop-blur-md"
                >
                  <TrendingUp className="w-4 h-4 text-[#84cc16]" />
                  <span>The 3-Second Retention Law</span>
                </a>
              </div>

              {/* Stat Strip */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/5 font-mono text-xs">
                <div>
                  <span className="text-xl sm:text-2xl font-kinetic font-black text-white block">91.4%</span>
                  <span className="text-[10px] text-zinc-400 uppercase">Avg 30s Retention</span>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-kinetic font-black text-[#84cc16] block">3.0s</span>
                  <span className="text-[10px] text-zinc-400 uppercase">B-Roll Cut Frequency</span>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-kinetic font-black text-[#06b6d4] block">10x</span>
                  <span className="text-[10px] text-zinc-400 uppercase">Speed vs Manual Editors</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Phone Mockup */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <PhoneViewportMockup />
            </div>

          </div>
        </section>

        {/* INTERACTIVE RETENTION ENGINE SECTION */}
        <section id="retention" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/5">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase text-[#84cc16] tracking-wider mb-2">
              <Flame className="w-3.5 h-3.5" />
              <span>The Attention Economy Curve</span>
            </div>
            <h2 className="font-kinetic font-black text-3xl sm:text-5xl text-white tracking-tight">
              Why Traditional Talking Heads Fail
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto mt-2 font-sans">
              TikTok and Instagram Reels algorithms penalize static footage. If visual stimuli don't refresh within 3 seconds, 72% of viewers swipe.
            </p>
          </div>

          {/* Interactive Milestone Checkpoints */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {RETENTION_MILESTONES.map((m, idx) => {
              const isSelected = selectedMilestone === idx;
              return (
                <button
                  key={m.second}
                  onClick={() => {
                    playClickSound();
                    setSelectedMilestone(idx);
                  }}
                  className={`text-left p-5 rounded-2xl border transition-all ${
                    isSelected
                      ? "bg-[#84cc16]/10 border-[#84cc16]/50 shadow-[0_0_25px_rgba(132,204,22,0.15)]"
                      : "bg-white/[0.02] border-white/5 hover:border-white/15 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2 font-mono text-xs">
                    <span className="text-[#84cc16] font-bold">{m.second}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-zinc-300">{m.impact}</span>
                  </div>
                  <h3 className="font-heading font-bold text-base text-white mb-1">{m.title}</h3>
                  <span className="text-[11px] font-mono text-zinc-500 block uppercase mb-2">{m.rule}</span>
                  <p className="text-xs text-zinc-400 font-sans line-clamp-3 leading-relaxed">
                    {m.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Retention Comparison Visualizer */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0e1017]/90 border border-white/10 backdrop-blur-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Unedited Talking Head */}
              <div className="p-5 rounded-xl bg-red-950/10 border border-red-500/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono uppercase text-red-400 font-semibold">Uncut Monologue</span>
                  <span className="text-xs font-mono text-red-400">14% 30s Completion</span>
                </div>
                <div className="w-full h-3 rounded-full bg-red-950/50 overflow-hidden mb-3">
                  <div className="w-[14%] h-full bg-red-500" />
                </div>
                <p className="text-xs text-zinc-400 font-sans">
                  Monotonous visual framing triggers rapid scroll instinct. Algorithmic distribution halts within 200 impressions.
                </p>
              </div>

              {/* Dissect Generative Cut */}
              <div className="p-5 rounded-xl bg-[#84cc16]/10 border border-[#84cc16]/30">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono uppercase text-[#84cc16] font-semibold">Dissect AI Re-Cut</span>
                  <span className="text-xs font-mono text-[#84cc16]">91% 30s Completion</span>
                </div>
                <div className="w-full h-3 rounded-full bg-emerald-950/50 overflow-hidden mb-3">
                  <div className="w-[91%] h-full bg-gradient-to-r from-[#84cc16] to-[#06b6d4]" />
                </div>
                <p className="text-xs text-zinc-400 font-sans">
                  generative AI B-roll cut-ins keep ocular dopamine constant. Viewer completion signals high value to discovery algorithms.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* 3-TRACK LIVEPEER PIPELINE */}
        <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/5">
          <div className="text-center mb-12">
            <h2 className="font-kinetic font-black text-3xl sm:text-5xl text-white tracking-tight">
              The 3-Track Livepeer Pipeline
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto mt-2 font-sans">
              Three autonomous intelligence streams orchestrate your vertical cut in parallel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#84cc16]/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#84cc16]/10 border border-[#84cc16]/30 flex items-center justify-center text-[#84cc16] mb-4">
                <Volume2 className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-lg text-white mb-2">Track 1: Whisper-v3 Ingestion</h3>
              <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed">
                Processes speech audio into millisecond-accurate token timestamps, detecting emotional emphasis and high-velocity sentence hooks.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#06b6d4]/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#06b6d4]/10 border border-[#06b6d4]/30 flex items-center justify-center text-[#06b6d4] mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-lg text-white mb-2">Track 2: AI B-Roll Generation</h3>
              <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed">
                Dispatches contextual video generation jobs to decentralized Livepeer GPU nodes, producing seamless B-roll cut-ins in under 4 seconds.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#f43f5e]/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#f43f5e]/10 border border-[#f43f5e]/30 flex items-center justify-center text-[#f43f5e] mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-lg text-white mb-2">Track 3: Kinetic Typography Engine</h3>
              <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed">
                Overlays high-impact Bebas Neue captions with word-level glow highlights, synchronizing visual cadence directly to the vocal meter.
              </p>
            </div>
          </div>
        </section>

        {/* BOTTOM STUDIO CTA */}
        <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto text-center">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#121622] to-[#08090e] border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#84cc16]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#06b6d4]/10 rounded-full blur-3xl pointer-events-none" />

            <span className="text-[11px] font-heading font-bold uppercase text-[#84cc16] tracking-widest block mb-3">
              INSTANT VIRAL VIDEO ENGINE
            </span>

            <h2 className="font-kinetic font-black text-3xl sm:text-5xl text-white tracking-tight mb-4">
              Stop Losing 72% of Your Viewers
            </h2>

            <p className="max-w-xl mx-auto text-sm sm:text-base text-zinc-400 font-sans mb-8 leading-relaxed">
              Open Dissect Studio, paste any long-form video URL or transcript, and let the 3-Track pipeline generate your high-retention cuts.
            </p>

            <Link
              href="/studio"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-sm font-heading font-bold text-black bg-gradient-to-r from-[#84cc16] to-[#06b6d4] hover:brightness-110 transition-all shadow-[0_0_30px_rgba(132,204,22,0.3)]"
            >
              <span>Launch Dissect Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
