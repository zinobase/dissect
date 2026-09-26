"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Scissors, 
  ArrowRight, 
  Play, 
  Pause, 
  Cpu, 
  Activity, 
  TrendingUp,
  Zap,
  ExternalLink,
  Layers,
  Sparkles
} from "lucide-react";
import { LandingHeader } from "@/components/LandingHeader";
import { PhoneViewportMockup } from "@/components/PhoneViewportMockup";
import { DissectLogoMark } from "@/components/DissectLogoMark";

// --- PROCEDURAL WEB AUDIO FEEDBACK ---
function playProceduralSound(freq = 1200, type: OscillatorType = "sine", duration = 0.035) {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.4, ctx.currentTime + duration);
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Audio policy safe
  }
}

// --- DATA DEFINITIONS TAILORED FOR DISSECT ---
const PIPELINE_STAGES = [
  { 
    x: 180, 
    step: "01", 
    label: "PHONETIC PARSER", 
    engine: "Whisper-v3 + Phonemes",
    node: "edge.livepeer.org/whisper",
    value: "Maps word boundaries, syllable velocity & natural pauses" 
  },
  { 
    x: 476, 
    step: "02", 
    label: "DEAD-ZONE DETECTOR", 
    engine: "Attention Classifier",
    node: "edge.livepeer.org/heuristic",
    value: "Flags visual stagnancy past 3.0s & triggers cutaway" 
  },
  { 
    x: 772, 
    step: "03", 
    label: "LIVEPEER MCP", 
    engine: "flux-schnell (9:16 Vertical)",
    node: "agent.livepeer.org/api/mcp/creative",
    value: "Synthesizes cinematic contextual B-roll on decentralized GPUs" 
  },
  { 
    x: 1020, 
    step: "04", 
    label: "60 FPS COMPOSITOR", 
    engine: "Hardware GPU Canvas",
    node: "browser.compositor/canvas",
    value: "Multiplies host speaker, B-roll & kinetic words seamlessly" 
  },
];

const DIAL_SOCKETS = [
  { label: "0.0s Hook Window", bearing: 0, anchor: "start" as const, answer: "94.8% Retained" },
  { label: "3.0s Cadence Reset", bearing: 90, anchor: "middle" as const, answer: "Cutaway Triggered" },
  { label: "6.5s Livepeer B-Roll", bearing: 180, anchor: "end" as const, answer: "GPU Diffusion Injected" },
  { label: "24.0s Seamless Loop", bearing: 270, anchor: "middle" as const, answer: "35% Repeat Watch" },
];

const PROOF_METRICS = [
  { value: "3.0s", label: "cadence threshold before pattern interrupt", icon: Zap },
  { value: "91.4%", label: "average 30s vertical completion rate", icon: TrendingUp },
  { value: "100%", label: "Livepeer decentralized GPU powered", icon: Cpu },
  { value: "60 FPS", label: "hardware-composited zero jank playback", icon: Activity },
];

export default function DissectLandingPage() {
  // Pipeline Rail Simulation State
  const [pipelineIdx, setPipelineIdx] = useState(2);
  const [pipelineIsPlaying, setPipelineIsPlaying] = useState(true);

  // Dial Simulation State
  const [activeDialIdx, setActiveDialIdx] = useState(1);
  const [dialIsPlaying, setDialIsPlaying] = useState(true);

  // Pipeline animation ticker
  useEffect(() => {
    if (!pipelineIsPlaying) return;
    const interval = setInterval(() => {
      setPipelineIdx((prev) => (prev + 1) % PIPELINE_STAGES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [pipelineIsPlaying]);

  // Dial rotation socket ticker
  useEffect(() => {
    if (!dialIsPlaying) return;
    const interval = setInterval(() => {
      setActiveDialIdx((prev) => (prev + 1) % DIAL_SOCKETS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [dialIsPlaying]);

  const activeStage = PIPELINE_STAGES[pipelineIdx];

  return (
    <div className="relative min-h-screen bg-[#07090e] text-zinc-100 overflow-x-hidden selection:bg-[#84cc16]/30 selection:text-white">
      {/* Top Navigation */}
      <LandingHeader />

      <main>
        {/* ========================================================================= */}
        {/* SECTION 1: THE SPLIT HERO / SPLASH STAGE                                 */}
        {/* ========================================================================= */}
        <section 
          id="splash"
          className="relative isolate overflow-hidden border-b border-white/[0.08] bg-[#07090e] min-h-[calc(100svh-4rem)] flex flex-col justify-between"
        >
          {/* Split Background Grounds (Left Linear Grid, Right Radial Matrix) */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 flex">
            {/* Left Half: Linear Grid with Inward Gradient Mask */}
            <div 
              className="relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,#000_0%,transparent_88%)]"
            >
              <div 
                className="absolute inset-y-0 -inset-x-12 opacity-35"
                style={{
                  backgroundImage: `repeating-linear-gradient(to right, rgba(132, 204, 22, 0.08) 0 1px, transparent 1px 44px), repeating-linear-gradient(to bottom, rgba(132, 204, 22, 0.08) 0 1px, transparent 1px 44px)`
                }}
              />
            </div>
            {/* Right Half: Radial Matrix with Outward Gradient Mask */}
            <div 
              className="relative flex-1 overflow-hidden [mask-image:linear-gradient(to_left,#000_0%,transparent_88%)]"
            >
              <div 
                className="absolute inset-y-0 -inset-x-12 opacity-45"
                style={{
                  backgroundImage: `radial-gradient(circle at center, rgba(132, 204, 22, 0.15) 1px, transparent 1.5px)`,
                  backgroundSize: `44px 44px`
                }}
              />
            </div>
          </div>

          {/* Center Horizontal Volumetric Beam with Animated Light Packet */}
          <div aria-hidden="true" className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[clamp(5rem,9vw,9rem)] w-screen -translate-x-1/2 -translate-y-1/2 [mask-image:linear-gradient(to_right,#000_0%,transparent_18%,transparent_82%,#000_100%)]">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(132,204,22,0.03)_50%,transparent_100%)]" />
              <div className="absolute inset-x-0 top-1/2 h-[clamp(1.75rem,3.5vw,3.5rem)] -translate-y-1/2 bg-[linear-gradient(to_bottom,transparent_0%,rgba(132,204,22,0.08)_50%,transparent_100%)]" />
              <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[rgba(132,204,22,0.25)] shadow-[0_0_16px_2px_rgba(132,204,22,0.2)]" />
              {/* Traveling Beam Packet */}
              <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center">
                <div className="relative h-5 w-72 animate-beam-packet opacity-60">
                  <div className="absolute inset-0 bg-radial from-[#84cc16]/30 to-transparent blur-sm" />
                  <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[linear-gradient(to_right,transparent,rgb(132,204,22)_50%,transparent)] shadow-[0_0_10px_#84cc16]" />
                </div>
              </div>
            </div>
          </div>

          {/* Volumetric Radial Spotlight Halo */}
          <div className="radial-halo absolute top-0 inset-x-0 h-[500px] pointer-events-none -z-10" />

          {/* Hero Content Stage */}
          <div className="relative mx-auto flex flex-1 max-w-[92rem] flex-col items-center justify-center px-5 pt-16 pb-20 text-center sm:px-8">
            
            {/* Geometric Mark Lockup */}
            <div className="relative isolate inline-flex items-center justify-center gap-4 mb-6">
              <DissectLogoMark className="h-12 sm:h-16 w-auto shrink-0 drop-shadow-[0_0_24px_rgba(132,204,22,0.35)]" />

              <div className="flex flex-col text-left">
                <span className="font-kinetic font-black text-2xl sm:text-3xl text-white tracking-tight leading-none">
                  DISSECT
                </span>
                <span className="font-mono text-[10px] text-zinc-400 tracking-widest uppercase mt-0.5">
                  LIVEPEER CADENCE NLE
                </span>
              </div>
            </div>

            {/* Technical Eyebrow Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full bg-black/60 border border-white/15 text-[10px] font-mono text-[#84cc16] tracking-wider uppercase mb-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#84cc16] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#84cc16]" />
              </span>
              <span className="text-zinc-200">Autonomous B-Roll Re-Cutter</span>
              <span className="text-zinc-600">·</span>
              <span className="text-[#84cc16]">Livepeer Subnet</span>
            </div>

            {/* Monumental Dual-Statement Headline */}
            <div className="max-w-4xl space-y-1 sm:space-y-2 mb-6">
              <h1 className="font-kinetic font-black text-[clamp(2.4rem,6vw,5.2rem)] leading-[0.94] tracking-tight text-zinc-300 text-balance">
                Speeches anyone can record.
              </h1>
              <h1 className="font-kinetic font-black text-[clamp(2.4rem,6vw,5.2rem)] leading-[0.94] tracking-tight text-white text-balance">
                Retention only <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#84cc16] via-[#a3e635] to-[#d9f99d] drop-shadow-[0_0_25px_rgba(132,204,22,0.25)]">cadence can hold.</span>
              </h1>
            </div>

            {/* Concise Subtitle */}
            <p className="max-w-2xl text-sm sm:text-base text-zinc-400 font-sans leading-relaxed text-balance mb-8">
              Dissect ingests spoken cadence, detects visual dead zones past 3 seconds, and cuts in contextually synchronized 9:16 cinematic B-roll generated on decentralized Livepeer GPU nodes.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-sm sm:max-w-none">
              <Link
                href="/studio"
                onClick={() => playProceduralSound(1400)}
                className="action-sheen group inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#84cc16] via-[#74b815] to-[#598f0e] px-8 text-xs font-heading font-semibold tracking-[0.12em] text-black uppercase transition-all hover:brightness-110 hover:shadow-[0_0_30px_rgba(132,204,22,0.45)] shadow-[0_3px_16px_rgba(132,204,22,0.3),inset_0_1px_0_rgba(255,255,255,0.45)] border border-[#84cc16]/90 active:scale-[0.98] cursor-pointer"
              >
                <span>Launch Studio</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <a
                href="#demo"
                onClick={() => playProceduralSound(950)}
                className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-white/[0.14] bg-white/[0.03] px-7 text-xs font-mono font-medium tracking-[0.12em] text-zinc-300 uppercase transition-all hover:border-white/30 hover:text-white hover:bg-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] cursor-pointer"
              >
                <span>Watch 9:16 Demo ↓</span>
              </a>
            </div>

          </div>

          {/* Bottom Telemetry Strip */}
          <div className="border-t border-white/[0.08] py-4 px-5 sm:px-8">
            <div className="mx-auto max-w-[92rem] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-400 uppercase tracking-widest">
              <div className="flex items-center gap-2 text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-[#84cc16]" />
                <span>3.0s Cadence Reset</span>
              </div>
              <span className="hidden sm:inline text-zinc-700">|</span>
              <div className="flex items-center gap-2 text-[#84cc16]">
                <Activity className="w-3.5 h-3.5" />
                <span>91.4% Retention Hold</span>
              </div>
              <span className="hidden sm:inline text-zinc-700">|</span>
              <div className="flex items-center gap-2 text-zinc-400">
                <Cpu className="w-3.5 h-3.5 text-[#06b6d4]" />
                <span>Livepeer Creative MCP</span>
              </div>
              <span className="hidden sm:inline text-zinc-700">|</span>
              <div className="flex items-center gap-2 text-zinc-500">
                <span>60 FPS Direct Compositor</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: THE RETENTION DUALITY & LIVE 9:16 VIEWPORT                     */}
        {/* ========================================================================= */}
        <section id="demo" className="border-b border-white/[0.08] bg-[#0b0e15]">
          <div className="mx-auto max-w-[92rem] px-5 py-20 sm:px-8 md:py-28">
            <div className="grid gap-14 lg:grid-cols-[1fr_0.95fr] lg:items-center lg:gap-20">
              
              {/* Left Column: Retention Telemetry */}
              <div className="text-left space-y-6">
                <div>
                  <p className="text-[0.6875rem] font-medium tracking-[0.14em] text-zinc-500 uppercase">
                    RETENTION TELEMETRY
                  </p>
                  <h2 className="mt-4 font-kinetic font-black text-3xl sm:text-5xl text-white tracking-tight text-balance">
                    Static Monologue vs Autonomous Re-Cut
                  </h2>
                  <p className="mt-4 text-base sm:text-lg text-zinc-400 font-sans leading-relaxed">
                    Human visual attention decays past 3.0 seconds without camera movement or visual variation. Dissect detects visual stagnation and injects contextually aligned B-roll generated on Livepeer GPU nodes.
                  </p>
                </div>

                {/* Comparative Telemetry Card */}
                <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#07090e] shadow-xl">
                  <div className="flex items-center justify-between border-b border-white/[0.08] bg-black/40 px-5 py-3 font-mono text-xs">
                    <span className="text-white font-bold uppercase tracking-wider">Audience Retention Profile</span>
                    <span className="text-[#84cc16] uppercase text-[10px] font-semibold">Live Benchmark</span>
                  </div>

                  <div className="divide-y divide-white/[0.06] font-mono text-xs px-5">
                    {[
                      { metric: "Hook Survival (0s - 3s)", raw: "24.0%", dissect: "94.8%", delta: "+70.8%" },
                      { metric: "Mid-Point Retention (15s)", raw: "14.2%", dissect: "91.4%", delta: "+77.2%" },
                      { metric: "Dead-Zone Camera Hold", raw: "12.4s (fatigue)", dissect: "3.0s (reset)", delta: "Protected" },
                      { metric: "Livepeer GPU Latency", raw: "N/A", dissect: "2.18s", delta: "Sub-Second" },
                    ].map((row) => (
                      <div key={row.metric} className="py-3.5 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-zinc-300 font-medium">{row.metric}</span>
                          <span className="text-[#84cc16] font-bold">{row.delta}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-[10px]">
                          <div className="p-2 rounded bg-red-500/10 border border-red-500/20 text-red-300 flex justify-between">
                            <span>Raw Monologue:</span>
                            <span className="font-bold">{row.raw}</span>
                          </div>
                          <div className="p-2 rounded bg-[#84cc16]/10 border border-[#84cc16]/25 text-[#84cc16] flex justify-between">
                            <span>Dissect Re-Cut:</span>
                            <span className="font-bold">{row.dissect}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-white/[0.08] bg-black/40 px-5 py-3 text-[10px] font-mono text-zinc-400 flex items-center justify-between">
                    <span>CADENCE INTERRUPTS PREVENT AUDIENCE SWIPES</span>
                    <span className="text-[#84cc16] font-semibold">LIVEPEER 9:16 ENGINE</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Phone Viewport Mockup */}
              <div className="w-full flex justify-center lg:justify-end">
                <PhoneViewportMockup />
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: THE 3-SECOND ROTARY CADENCE DIAL                               */}
        {/* ========================================================================= */}
        <section id="cadence" className="border-b border-white/[0.08] bg-[#07090e]">
          <div className="mx-auto max-w-[92rem] px-5 py-20 sm:px-8 md:py-28">
            <div className="grid gap-14 lg:grid-cols-[1fr_0.95fr] lg:items-center lg:gap-20">
              
              {/* Left Column: Architectural Principles */}
              <div className="text-left space-y-8">
                <div>
                  <p className="text-[0.6875rem] font-medium tracking-[0.14em] text-zinc-500 uppercase font-mono">
                    CADENCE LAW
                  </p>
                  <h2 className="mt-4 font-kinetic font-black text-3xl sm:text-5xl text-white tracking-tight text-balance">
                    What the 3-second rule commands.
                  </h2>
                  <p className="mt-4 text-base sm:text-lg text-zinc-400 font-sans leading-relaxed">
                    Algorithmic feeds heavily penalize motionless talking heads. Dissect’s rotary cadence loop ensures no static frame survives past 3.0 seconds.
                  </p>
                </div>

                <div className="space-y-6 pt-2">
                  {[
                    {
                      icon: Zap,
                      title: "Continuous Dead-Zone Detection",
                      desc: "The phonetic attention engine constantly measures camera hold time, flagging visual stagnancy before viewer cognitive fatigue sets in."
                    },
                    {
                      icon: Cpu,
                      title: "Livepeer Creative MCP Diffusion",
                      desc: "Zero centralized media servers. Contextually generated 9:16 vertical B-roll synthesizes directly on decentralized Livepeer GPU nodes via agent.livepeer.org/api/mcp/creative."
                    },
                    {
                      icon: Activity,
                      title: "60 FPS Direct Hardware Compositing",
                      desc: "Zero high-frequency React state churn. The multi-track timeline, kinetic words, and video cutaways render directly on the GPU compositor canvas."
                    }
                  ].map((feat) => (
                    <div key={feat.title} className="border-l-2 border-white/10 pl-6 hover:border-[#84cc16]/50 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <feat.icon className="w-4 h-4 text-[#84cc16] shrink-0" />
                        <h3 className="font-heading font-semibold text-lg text-white">
                          {feat.title}
                        </h3>
                      </div>
                      <p className="mt-1.5 text-sm text-zinc-400 font-sans leading-relaxed">
                        {feat.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: The Rotary Cadence Dial Stage */}
              <div className="w-full max-w-xl justify-self-center lg:justify-self-end">
                <div className="rounded-2xl border border-white/[0.08] bg-[#0a0d15] p-6 sm:p-8 shadow-2xl text-center">
                  
                  {/* Top Loop Readout */}
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08] font-mono text-xs">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <span className="size-2 rounded-full bg-[#84cc16] animate-pulse" />
                      <span className="uppercase text-white font-bold">CADENCE ROTARY DIAL</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        playProceduralSound(dialIsPlaying ? 800 : 1200);
                        setDialIsPlaying(!dialIsPlaying);
                      }}
                      className="text-zinc-500 hover:text-white transition-colors"
                    >
                      {dialIsPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* SVG Dial Stage */}
                  <div className="relative aspect-square w-full max-w-[420px] mx-auto">
                    <svg 
                      viewBox="0 0 480 452" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="w-full h-full select-none"
                    >
                      {/* Inner Dashed Ring */}
                      <circle cx="240" cy="226" r="118" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="4 6" />
                      
                      {/* Outer Solid Ring */}
                      <circle cx="240" cy="226" r="148" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

                      {/* 36 Minor Ticks */}
                      {Array.from({ length: 36 }).map((_, i) => {
                        const deg = i * 10;
                        const rad = (deg * Math.PI) / 180;
                        const x1 = 240 + 142 * Math.cos(rad);
                        const y1 = 226 + 142 * Math.sin(rad);
                        const x2 = 240 + 148 * Math.cos(rad);
                        const y2 = 226 + 148 * Math.sin(rad);
                        return (
                          <line 
                            key={i} 
                            x1={x1} 
                            y1={y1} 
                            x2={x2} 
                            y2={y2} 
                            stroke="rgba(255,255,255,0.2)" 
                            strokeWidth="1" 
                          />
                        );
                      })}

                      {/* 4 Major Ticks */}
                      {[0, 90, 180, 270].map((deg) => {
                        const rad = (deg * Math.PI) / 180;
                        const x1 = 240 + 134 * Math.cos(rad);
                        const y1 = 226 + 134 * Math.sin(rad);
                        const x2 = 240 + 148 * Math.cos(rad);
                        const y2 = 226 + 148 * Math.sin(rad);
                        return (
                          <line 
                            key={deg} 
                            x1={x1} 
                            y1={y1} 
                            x2={x2} 
                            y2={y2} 
                            stroke="#84cc16" 
                            strokeWidth="2" 
                          />
                        );
                      })}

                      {/* Continuous Rotating Dial Index */}
                      <g className={dialIsPlaying ? "animate-dial-rotate" : ""}>
                        <line x1="240" y1="226" x2="395" y2="226" stroke="#84cc16" strokeWidth="2.5" />
                        <path d="M 391 226 L 400 221 L 400 231 Z" fill="#84cc16" />
                      </g>

                      {/* Center Core Display */}
                      <circle cx="240" cy="226" r="64" fill="#07090e" stroke="rgba(255,255,255,0.14)" strokeWidth="2" />
                      <circle cx="240" cy="226" r="54" fill="rgba(132,204,22,0.06)" />
                      <text 
                        x="240" 
                        y="222" 
                        fill="#84cc16" 
                        fontSize="18" 
                        fontWeight="bold" 
                        textAnchor="middle"
                        fontFamily="var(--font-kinetic)"
                      >
                        3.0s
                      </text>
                      <text 
                        x="240" 
                        y="240" 
                        fill="#a1a1aa" 
                        fontSize="9" 
                        letterSpacing="1"
                        textAnchor="middle"
                        fontFamily="var(--font-mono)"
                      >
                        CADENCE HOLD
                      </text>

                      {/* Sockets Around The Dial */}
                      {DIAL_SOCKETS.map((soc, sIdx) => {
                        const rad = (soc.bearing * Math.PI) / 180;
                        const sx = 240 + 133 * Math.cos(rad);
                        const sy = 226 + 133 * Math.sin(rad);
                        const lx = 240 + 185 * Math.cos(rad);
                        const ly = 226 + 185 * Math.sin(rad);
                        const isCurrent = activeDialIdx === sIdx;

                        return (
                          <g 
                            key={soc.label}
                            onClick={() => {
                              playProceduralSound(1200 + sIdx * 100);
                              setActiveDialIdx(sIdx);
                            }}
                            className="cursor-pointer"
                          >
                            <rect 
                              x={sx - 7} 
                              y={sy - 7} 
                              width="14" 
                              height="14" 
                              rx="2" 
                              fill={isCurrent ? "#84cc16" : "#07090e"} 
                              stroke={isCurrent ? "#84cc16" : "rgba(255,255,255,0.4)"} 
                              strokeWidth="1.5"
                            />
                            <text 
                              x={lx} 
                              y={ly} 
                              fill={isCurrent ? "#ffffff" : "#a1a1aa"} 
                              fontSize="11" 
                              textAnchor={soc.anchor}
                              fontFamily="var(--font-mono)"
                              fontWeight={isCurrent ? "bold" : "normal"}
                            >
                              {soc.label}
                            </text>
                            <text 
                              x={lx} 
                              y={ly + 14} 
                              fill={isCurrent ? "#84cc16" : "#71717a"} 
                              fontSize="9.5" 
                              textAnchor={soc.anchor}
                              fontFamily="var(--font-mono)"
                            >
                              {soc.answer}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  <p className="mt-4 text-xs font-mono text-zinc-500 uppercase tracking-widest">
                    Automated 3.0s Cadence Sweep · Livepeer GPU Subnet
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: THE 4-STAGE AUTONOMOUS PIPELINE                                */}
        {/* ========================================================================= */}
        <section id="pipeline" className="border-b border-white/[0.08] bg-[#0b0e15]">
          <div className="mx-auto max-w-[92rem] px-5 py-20 sm:px-8 md:py-28">
            
            {/* Section Header */}
            <div className="max-w-3xl text-left mb-14">
              <p className="text-[0.6875rem] font-medium tracking-[0.14em] text-zinc-500 uppercase font-mono">
                DECENTRALIZED WORKFLOW
              </p>
              <h2 className="mt-4 font-kinetic font-black text-3xl sm:text-5xl text-white tracking-tight text-balance">
                Four steps. Zero unrendered frames.
              </h2>
              <p className="mt-4 text-base sm:text-lg text-zinc-400 font-sans leading-relaxed">
                From raw speech to a synchronized 60 FPS vertical master via four deterministic AI stages.
              </p>
            </div>

            {/* Interactive Pipeline Rail Terminal */}
            <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#07090e] shadow-2xl">
              
              {/* Chrome Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 border-b border-white/[0.08] bg-black/40 px-5 sm:px-7 py-3 font-mono text-[0.6875rem]">
                <div className="flex shrink-0 items-center gap-3">
                  <span className="size-2 rounded-full bg-[#84cc16] animate-pulse" />
                  <span className="text-white uppercase font-bold tracking-[0.14em]">
                    AUTONOMOUS NLE PIPELINE
                  </span>
                  <span className="hidden h-px w-10 bg-white/20 sm:block" />
                  <span className="hidden text-zinc-500 uppercase sm:block">
                    LIVEPEER CREATIVE MCP
                  </span>
                </div>

                <div className="flex items-center gap-2.5 text-zinc-400 uppercase tracking-[0.12em]">
                  <button
                    type="button"
                    onClick={() => {
                      playProceduralSound(pipelineIsPlaying ? 800 : 1200);
                      setPipelineIsPlaying(!pipelineIsPlaying);
                    }}
                    className="grid size-8 shrink-0 place-items-center rounded-lg border border-white/10 text-zinc-400 transition-colors hover:border-white/30 hover:text-white cursor-pointer"
                    aria-label={pipelineIsPlaying ? "Pause pipeline" : "Play pipeline"}
                  >
                    {pipelineIsPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                  <span className="text-[#84cc16] font-semibold">
                    {activeStage.label}
                  </span>
                  <span className="text-zinc-600">/</span>
                  <span className="text-zinc-300">
                    {activeStage.engine}
                  </span>
                </div>
              </div>

              {/* Interactive SVG Rail Graphic */}
              <div className="p-6 sm:p-10 overflow-x-auto">
                <div className="min-w-[62rem]">
                  <svg 
                    viewBox="0 0 1200 240" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="w-full select-none"
                  >
                    {/* Rail Base Line */}
                    <line x1="108" y1="126" x2="1092" y2="126" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
                    
                    {/* Rail End Caps */}
                    <line x1="108" y1="115" x2="108" y2="137" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                    <line x1="1092" y1="115" x2="1092" y2="137" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />

                    {/* Rail Ticks */}
                    {Array.from({ length: 36 }).map((_, i) => {
                      const x = 108 + i * 28;
                      return (
                        <line 
                          key={i} 
                          x1={x} 
                          y1="121" 
                          x2={x} 
                          y2="131" 
                          stroke="rgba(255,255,255,0.06)" 
                          strokeWidth="1" 
                        />
                      );
                    })}

                    {/* Progress Fill Line */}
                    <line 
                      x1="108" 
                      y1="126" 
                      x2={activeStage.x} 
                      y2="126" 
                      stroke="#84cc16" 
                      strokeWidth="3" 
                      className="transition-all duration-700 ease-in-out"
                    />

                    {/* Traveling Indicator Packet */}
                    <circle 
                      cx={activeStage.x} 
                      cy="126" 
                      r="8" 
                      fill="#84cc16" 
                      className="transition-all duration-700 ease-in-out shadow-[0_0_15px_#84cc16]"
                    />
                    <circle 
                      cx={activeStage.x} 
                      cy="126" 
                      r="16" 
                      stroke="#84cc16" 
                      strokeWidth="1.5" 
                      strokeDasharray="3 3"
                      className="transition-all duration-700 ease-in-out animate-spin"
                    />

                    {/* Four Stages */}
                    {PIPELINE_STAGES.map((st, idx) => {
                      const isActive = pipelineIdx === idx;
                      return (
                        <g 
                          key={st.step} 
                          onClick={() => {
                            playProceduralSound(1000 + idx * 200);
                            setPipelineIdx(idx);
                          }}
                          className="cursor-pointer group"
                        >
                          {/* Stage Step Label */}
                          <text 
                            x={st.x} 
                            y="68" 
                            fill={isActive ? "#84cc16" : "rgba(255,255,255,0.6)"} 
                            fontSize="12" 
                            textAnchor="middle" 
                            letterSpacing="1.8"
                            fontFamily="var(--font-mono)"
                            fontWeight={isActive ? "bold" : "normal"}
                            className="transition-colors"
                          >
                            {st.step} {st.label}
                          </text>

                          {/* Outer Stage Circle */}
                          <circle 
                            cx={st.x} 
                            cy="126" 
                            r="32" 
                            fill="#07090e" 
                            stroke={isActive ? "#84cc16" : "rgba(255,255,255,0.15)"} 
                            strokeWidth={isActive ? "2" : "1.5"}
                            className="transition-all duration-300 group-hover:stroke-white/40"
                          />

                          {/* Station Active Glow Ring */}
                          {isActive && (
                            <circle 
                              cx={st.x} 
                              cy="126" 
                              r="38" 
                              stroke="#84cc16" 
                              strokeWidth="1.5" 
                              strokeDasharray="4 4"
                              opacity="0.8"
                              className="animate-spin"
                            />
                          )}

                          {/* Inner Icon / Disc */}
                          <circle 
                            cx={st.x} 
                            cy="126" 
                            r="12" 
                            fill={isActive ? "#84cc16" : "rgba(255,255,255,0.08)"} 
                            className="transition-all duration-300"
                          />

                          {/* Description Text Underneath */}
                          <text 
                            x={st.x} 
                            y="185" 
                            fill={isActive ? "#ffffff" : "rgba(255,255,255,0.4)"} 
                            fontSize="11.5" 
                            textAnchor="middle"
                            fontFamily="var(--font-mono)"
                            className="transition-colors"
                          >
                            {st.value}
                          </text>

                          {/* Node Address */}
                          <text 
                            x={st.x} 
                            y="204" 
                            fill={isActive ? "#84cc16" : "rgba(255,255,255,0.25)"} 
                            fontSize="9.5" 
                            textAnchor="middle"
                            fontFamily="var(--font-mono)"
                          >
                            {st.node}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Mobile Fallback Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-5 border-t border-white/[0.08] xl:hidden font-mono text-xs">
                {PIPELINE_STAGES.map((st, idx) => (
                  <div 
                    key={st.step}
                    onClick={() => {
                      playProceduralSound(1000 + idx * 200);
                      setPipelineIdx(idx);
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      pipelineIdx === idx 
                        ? "bg-[#84cc16]/10 border-[#84cc16]/40 text-white" 
                        : "bg-black/30 border-white/5 text-zinc-400"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[#84cc16] font-bold">{st.step} · {st.label}</span>
                      {pipelineIdx === idx && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#84cc16] animate-pulse" />
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-300">{st.value}</p>
                    <span className="text-[9px] text-zinc-500 block mt-2">{st.node}</span>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5: PROOF METRICS (EMPIRICAL BENCHMARKS)                           */}
        {/* ========================================================================= */}
        <section id="metrics" className="border-b border-white/[0.08] bg-[#07090e]">
          <div className="mx-auto max-w-[92rem] px-5 py-16 sm:px-8">
            <dl className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {PROOF_METRICS.map((m) => (
                <div key={m.label} className="border-t border-white/20 pt-5 text-left group">
                  <m.icon className="w-5 h-5 text-zinc-500 group-hover:text-[#84cc16] transition-colors" />
                  <dt className="mt-4 font-kinetic font-black text-4xl sm:text-5xl text-white tracking-tight tabular-nums">
                    {m.value}
                  </dt>
                  <dd className="mt-2 text-[0.6875rem] font-mono text-zinc-400 uppercase tracking-widest">
                    {m.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 6: CTA (RE-CUT SPEECHES INTO VERTICAL RETENTION)                  */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden bg-[#0b0e15] border-b border-white/[0.08]">
          {/* Concentric Glow Rings Background */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center -z-10">
            <svg viewBox="0 0 700 520" fill="none" className="h-full w-auto opacity-35">
              <circle cx="350" cy="260" r="180" stroke="rgba(132,204,22,0.2)" strokeWidth="2" />
              <circle cx="350" cy="260" r="260" stroke="rgba(132,204,22,0.08)" strokeWidth="1.5" />
            </svg>
          </div>

          <div className="relative mx-auto max-w-[92rem] px-5 py-24 text-center sm:px-8 md:py-32">
            <div className="max-w-3xl mx-auto space-y-6">
              <p className="text-[0.6875rem] font-medium tracking-[0.14em] text-[#84cc16] uppercase font-mono">
                AUTONOMOUS NLE PIPELINE
              </p>

              <h2 className="font-kinetic font-black text-4xl sm:text-6xl text-white tracking-tight leading-[0.96]">
                Re-cut long speeches into vertical retention.
              </h2>

              <p className="text-base sm:text-lg text-zinc-400 font-sans max-w-xl mx-auto leading-relaxed">
                Transform unedited speeches, keynotes, and podcasts into retention-optimized 9:16 vertical reels with synchronized Livepeer B-roll and kinetic captions.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/studio"
                  onClick={() => playProceduralSound(1600)}
                  className="action-sheen group inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#84cc16] via-[#74b815] to-[#598f0e] px-8 text-xs font-heading font-semibold tracking-[0.12em] text-black uppercase transition-all hover:brightness-110 hover:shadow-[0_0_30px_rgba(132,204,22,0.45)] shadow-[0_3px_16px_rgba(132,204,22,0.3),inset_0_1px_0_rgba(255,255,255,0.45)] border border-[#84cc16]/90 active:scale-[0.98] cursor-pointer"
                >
                  <span>Launch NLE Studio</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>

                <a
                  href="https://agent.livepeer.org/api/mcp/creative"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => playProceduralSound(950)}
                  className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-white/[0.14] bg-white/[0.03] px-7 text-xs font-mono font-medium tracking-[0.12em] text-zinc-300 uppercase transition-all hover:border-white/30 hover:text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] cursor-pointer"
                >
                  <span>Livepeer Creative MCP ↗</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 7: MINIMALIST TECHNICAL FOOTER                                    */}
        {/* ========================================================================= */}
        <footer className="border-t border-white/[0.08] bg-[#07090e]">
          <div className="mx-auto max-w-[92rem] px-5 py-14 sm:px-8">
            <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
              
              {/* Brand and Summary */}
              <div className="max-w-xs space-y-3 text-left">
                <div className="flex items-center gap-2.5">
                  <DissectLogoMark className="w-8 h-7 drop-shadow-[0_0_12px_rgba(132,204,22,0.35)]" />
                  <span className="font-kinetic font-black text-lg text-white tracking-tight">
                    DISSECT
                  </span>
                </div>
                <p className="text-xs leading-6 text-zinc-400 font-sans">
                  Autonomous B-roll synthesis and vertical 9:16 video re-cutter powered by decentralized Livepeer GPU orchestrator nodes.
                </p>
              </div>

              {/* Navigation Columns */}
              <div className="flex flex-wrap gap-x-16 gap-y-6 text-xs font-mono tracking-[0.12em] text-zinc-400 uppercase text-left">
                <div className="space-y-3">
                  <p className="text-white font-bold">Studio</p>
                  <Link href="/studio" className="block transition-colors hover:text-white">
                    Launch Studio
                  </Link>
                  <a href="#demo" className="block transition-colors hover:text-white">
                    9:16 Demo
                  </a>
                  <a href="#cadence" className="block transition-colors hover:text-white">
                    Cadence Law
                  </a>
                  <a href="#pipeline" className="block transition-colors hover:text-white">
                    Livepeer Pipeline
                  </a>
                </div>

                <div className="space-y-3">
                  <p className="text-white font-bold">Livepeer Network</p>
                  <a 
                    href="https://agent.livepeer.org/api/mcp/creative" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center gap-1 transition-colors hover:text-white"
                  >
                    <span>Creative MCP</span>
                    <ExternalLink className="w-3 h-3 text-[#84cc16]" />
                  </a>
                  <a 
                    href="https://livepeer.org" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="block transition-colors hover:text-white"
                  >
                    Livepeer GPU Subnet
                  </a>
                  <a 
                    href="https://docs.livepeer.org" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="block transition-colors hover:text-white"
                  >
                    Node Documentation
                  </a>
                </div>
              </div>

            </div>

            {/* Bottom Row */}
            <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.06] pt-6 font-mono text-xs text-zinc-500">
              <p>© 2026 Dissect · Apache-2.0 · Livepeer Subnet</p>
              <div className="flex items-center gap-3">
                <span className="text-[#84cc16]">● 60 FPS Compositor Active</span>
                <span className="text-zinc-700">|</span>
                <span>Subnet Latency: 2.18s</span>
              </div>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}
