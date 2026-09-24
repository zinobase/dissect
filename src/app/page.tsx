"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Scissors, 
  ArrowRight, 
  TrendingUp
} from "lucide-react";
import { WaveformPulseBackground } from "@/components/WaveformPulseBackground";
import { LandingHeader } from "@/components/LandingHeader";
import { PhoneViewportMockup } from "@/components/PhoneViewportMockup";

const RETENTION_MILESTONES = [
  {
    second: "0s - 3s",
    title: "Pattern Interrupt",
    rule: "First 3-Second Rule",
    impact: "+48% Hook Survival",
    description: "Detects the opening sentence and cuts in contextual B-roll before viewer disengagement."
  },
  {
    second: "6s",
    title: "Dynamic Re-Zoom",
    rule: "Velocity Modulation",
    impact: "+22% Attention Reset",
    description: "Modulates camera framing from wide to punch-in, resetting visual fatigue."
  },
  {
    second: "12s",
    title: "Keyword Accent",
    rule: "Kinetic Captions",
    impact: "+18% Comprehension",
    description: "High-sentiment keywords highlight dynamically with zero frame latency."
  },
  {
    second: "24s",
    title: "Seamless Loop",
    rule: "Continuous Replay",
    impact: "+35% Re-watch Rate",
    description: "Closing sentence connects directly into the opening hook for continuous loop retention."
  }
];

export default function DissectLandingPage() {
  const [selectedMilestone, setSelectedMilestone] = useState(0);

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
      // Audio policy safe
    }
  };

  return (
    <div className="relative min-h-screen bg-[#07080d] text-zinc-100 overflow-x-hidden selection:bg-[#84cc16]/30 selection:text-white">
      {/* 60fps Audio Ribbon Canvas */}
      <WaveformPulseBackground />

      {/* Header */}
      <LandingHeader />

      <main className="relative z-10 pt-20">
        {/* HERO SECTION */}
        <section className="pt-8 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#84cc16]/10 border border-[#84cc16]/30 text-[10px] font-mono text-[#84cc16] tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#84cc16] animate-pulse" />
                <span>Autonomous B-Roll Re-Cutter · 9:16 Vertical Engine</span>
              </div>

              {/* Master Headline */}
              <h1 className="font-kinetic font-black text-3xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[0.92] text-balance">
                RE-CUT LONG TALKS INTO <br />
                <span className="text-[#84cc16] uppercase">HIGH-RETENTION SHORTS.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-zinc-400 font-sans leading-relaxed max-w-xl text-balance">
                Dissect analyzes spoken cadence, detects visual dead zones, and cuts in contextually matched 9:16 cinematic B-roll on decentralized Livepeer GPU nodes.
              </p>

              {/* Telemetry Indicator Strip */}
              <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-black/60 border border-white/10 font-mono text-xs max-w-xl">
                <div>
                  <span className="text-lg sm:text-xl font-kinetic font-black text-white block">3.0s</span>
                  <span className="text-[9px] text-zinc-400 uppercase">Cut Frequency</span>
                </div>
                <div>
                  <span className="text-lg sm:text-xl font-kinetic font-black text-[#84cc16] block">91.4%</span>
                  <span className="text-[9px] text-zinc-400 uppercase">Avg Completion</span>
                </div>
                <div>
                  <span className="text-lg sm:text-xl font-kinetic font-black text-[#06b6d4] block">&lt;2.4s</span>
                  <span className="text-[9px] text-zinc-400 uppercase">B-Roll Latency</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  href="/studio"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg text-xs font-heading font-bold text-black bg-[#84cc16] hover:bg-[#a3e635] active:scale-95 transition-all shadow-[0_0_25px_rgba(132,204,22,0.3)] cursor-pointer"
                >
                  <span>Open Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <a
                  href="#retention"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg text-xs font-mono text-zinc-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 transition-colors cursor-pointer"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-[#84cc16]" />
                  <span>Retention Analytics</span>
                </a>
              </div>

              {/* Supported Platforms Strip */}
              <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-500 pt-1">
                <span className="text-zinc-400 uppercase font-semibold">Safe Zones:</span>
                <span className="text-zinc-300">TikTok 9:16</span>
                <span>·</span>
                <span className="text-zinc-300">Instagram Reels</span>
                <span>·</span>
                <span className="text-zinc-300">YouTube Shorts</span>
              </div>
            </div>

            {/* Right Column: Live Phone Viewport */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <PhoneViewportMockup />
            </div>

          </div>
        </section>

        {/* RETENTION ANALYSIS SECTION */}
        <section id="retention" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
          <div className="text-left mb-8">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase text-[#84cc16] tracking-wider mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Retention Analysis</span>
            </div>
            <h2 className="font-kinetic font-black text-2xl sm:text-3xl text-white tracking-tight">
              Viewer Drop-off Dynamics
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mt-1 font-sans">
              When camera framing stays static past three seconds, viewer completion drops precipitously.
            </p>
          </div>

          {/* Interactive Checkpoints */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {RETENTION_MILESTONES.map((m, idx) => {
              const isSelected = selectedMilestone === idx;
              return (
                <button
                  key={m.second}
                  onClick={() => {
                    playClickSound();
                    setSelectedMilestone(idx);
                  }}
                  className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#84cc16]/10 border-[#84cc16]/50 shadow-[0_0_15px_rgba(132,204,22,0.12)]"
                      : "bg-white/[0.02] border-white/5 hover:border-white/15 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5 font-mono text-xs">
                    <span className="text-[#84cc16] font-bold">{m.second}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-zinc-300">{m.impact}</span>
                  </div>
                  <h3 className="font-heading font-semibold text-xs text-white mb-0.5">{m.title}</h3>
                  <span className="text-[10px] font-mono text-zinc-500 block uppercase mb-1.5">{m.rule}</span>
                  <p className="text-[11px] text-zinc-400 font-sans line-clamp-3 leading-relaxed">
                    {m.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Retention Comparison */}
          <div className="p-5 sm:p-6 rounded-xl bg-[#090b10] border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Static Monologue */}
              <div className="p-4 rounded-lg bg-red-950/15 border border-red-500/25 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-red-400 font-semibold">Static Monologue</span>
                  <span className="text-xs font-mono text-red-400 font-bold">14% Completion</span>
                </div>
                <div className="w-full h-2 rounded-full bg-red-950/50 overflow-hidden">
                  <div className="w-[14%] h-full bg-red-500" />
                </div>
                <p className="text-[11px] text-zinc-400 font-sans">
                  Monotonous visual framing triggers thumb swipes within the first five seconds.
                </p>
              </div>

              {/* Dissect Re-Cut */}
              <div className="p-4 rounded-lg bg-[#84cc16]/10 border border-[#84cc16]/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-[#84cc16] font-semibold">Dissect Re-Cut</span>
                  <span className="text-xs font-mono text-[#84cc16] font-bold">91.4% Completion</span>
                </div>
                <div className="w-full h-2 rounded-full bg-emerald-950/50 overflow-hidden">
                  <div className="w-[91.4%] h-full bg-gradient-to-r from-[#84cc16] to-[#06b6d4]" />
                </div>
                <p className="text-[11px] text-zinc-400 font-sans">
                  Contextual B-roll cut-ins maintain engagement through the final loop seam.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* 3-TRACK TIMELINE SPECIFICATION */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
          <div className="text-left mb-8">
            <span className="text-[10px] font-mono font-semibold uppercase text-[#84cc16] tracking-widest block mb-1">
              TIMELINE ARCHITECTURE
            </span>
            <h2 className="font-kinetic font-black text-2xl sm:text-3xl text-white tracking-tight">
              Synchronized 3-Track Composition
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mt-1 font-sans">
              Multi-track audio, generative video cutaways, and kinetic captions synchronized at 60 FPS.
            </p>
          </div>

          {/* Timeline Display */}
          <div className="p-5 sm:p-6 rounded-xl bg-[#090b10] border border-white/10 space-y-3 font-mono text-xs">
            
            {/* Track 1: Speaker Audio Track */}
            <div className="flex items-center gap-3">
              <div className="w-24 shrink-0 flex items-center gap-1.5 text-zinc-400 text-[10px]">
                <span className="px-1.5 py-0.5 rounded bg-[#06b6d4]/15 text-[#06b6d4] font-semibold border border-[#06b6d4]/30">A1:HOST</span>
              </div>
              <div className="flex-1 h-8 rounded-lg bg-[#06b6d4]/10 border border-[#06b6d4]/25 flex items-center justify-between px-3 text-[10px] text-[#06b6d4] overflow-hidden">
                <span className="font-bold">Speaker Track (1080x1920)</span>
                <span className="text-zinc-500 hidden sm:inline">Active Tracking (0.99)</span>
              </div>
            </div>

            {/* Track 2: B-Roll Inserts Track */}
            <div className="flex items-center gap-3">
              <div className="w-24 shrink-0 flex items-center gap-1.5 text-zinc-400 text-[10px]">
                <span className="px-1.5 py-0.5 rounded bg-[#84cc16]/15 text-[#84cc16] font-semibold border border-[#84cc16]/30">V2:B-ROLL</span>
              </div>
              <div className="flex-1 h-9 rounded-lg bg-black/60 border border-white/10 relative flex items-center px-2">
                <div className="absolute left-[15%] w-[25%] h-7 rounded bg-[#84cc16]/25 border border-[#84cc16]/50 flex items-center justify-center px-2 text-[9px] text-[#84cc16] font-bold">
                  <span>Cutaway #1</span>
                </div>
                <div className="absolute left-[55%] w-[30%] h-7 rounded bg-[#84cc16]/25 border border-[#84cc16]/50 flex items-center justify-center px-2 text-[9px] text-[#84cc16] font-bold">
                  <span>Cutaway #2</span>
                </div>
              </div>
            </div>

            {/* Track 3: Subtitles Track */}
            <div className="flex items-center gap-3">
              <div className="w-24 shrink-0 flex items-center gap-1.5 text-zinc-400 text-[10px]">
                <span className="px-1.5 py-0.5 rounded bg-[#fbbf24]/15 text-[#fbbf24] font-semibold border border-[#fbbf24]/30">T3:WORDS</span>
              </div>
              <div className="flex-1 h-7 rounded-lg bg-[#fbbf24]/10 border border-[#fbbf24]/20 flex items-center justify-between px-3 text-[10px] text-[#fbbf24]">
                <span>Subtitles Track</span>
                <span className="text-zinc-500 hidden sm:inline">Word-Level Alignment</span>
              </div>
            </div>

          </div>
        </section>

        {/* STUDIO LAUNCH DECK */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
          <div className="p-8 sm:p-10 rounded-2xl bg-[#090b10] border-2 border-[#84cc16]/30 shadow-2xl relative text-left space-y-6">
            
            {/* Header Audio Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Scissors className="w-5 h-5 text-[#84cc16]" />
                <span className="font-kinetic text-sm font-black text-white tracking-wider uppercase">
                  DISSECT NLE STUDIO
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-mono text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-[#84cc16] animate-pulse" />
                <span>PEAK BUS: -6dB</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 space-y-2">
                <h3 className="font-kinetic font-black text-2xl sm:text-3xl text-white">
                  Start Re-Cutting Video
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed">
                  Transform long-form speech into paced vertical reels with synchronized B-roll and kinetic captions.
                </p>
              </div>

              <div className="md:col-span-4 flex justify-start md:justify-end">
                <Link
                  href="/studio"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg text-xs font-heading font-bold text-black bg-[#84cc16] hover:bg-[#a3e635] active:scale-95 transition-all shadow-[0_0_25px_rgba(132,204,22,0.3)] cursor-pointer"
                >
                  <span>Launch Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Footer Metadata */}
            <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between text-[9px] font-mono text-zinc-500">
              <span>ENGINE: WHISPER-V3 + LIVEPEER GPU</span>
              <span>OUTPUT: 9:16 VERTICAL 1080x1920</span>
              <span>RENDERER: 60 FPS CANVAS</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
