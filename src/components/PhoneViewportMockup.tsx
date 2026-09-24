"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RefreshCw, Scissors, Sparkles, Volume2, VolumeX, CheckCircle2 } from "lucide-react";

interface Scenario {
  id: string;
  creator: string;
  topic: string;
  retention: string;
  hookTime: string;
  rawCaption: string[];
  dissectCaption: { text: string; highlight?: boolean }[];
  brollLabel: string;
  brollPrompt: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: "tech",
    creator: "Alex H. · Tech Founder",
    topic: "Why 90% of AI Video Looks Like Slop",
    retention: "94%",
    hookTime: "0.0s - 3.2s",
    rawCaption: ["Most", "people", "generate", "AI", "video", "and", "it", "feels", "cheap", "and", "plastic..."],
    dissectCaption: [
      { text: "MOST" },
      { text: "AI VIDEO", highlight: true },
      { text: "LOOKS LIKE" },
      { text: "CHEAP PLASTIC", highlight: true },
      { text: "BECAUSE OF ZERO B-ROLL" }
    ],
    brollLabel: "Subnet 104 · Silicon Wafer Macro",
    brollPrompt: "Extreme macro 4k push-in on glowing silicon die with gold interconnects, clean anamorphic depth."
  },
  {
    id: "cinema",
    creator: "Elena R. · Cinema Director",
    topic: "The 3-Second Kinetic Pacing Law",
    retention: "92%",
    hookTime: "0.0s - 2.8s",
    rawCaption: ["If", "you", "hold", "one", "static", "talking", "head", "shot", "past", "three", "seconds", "they", "swipe..."],
    dissectCaption: [
      { text: "HOLD ONE SHOT" },
      { text: "PAST 3 SECONDS,", highlight: true },
      { text: "AND THEY" },
      { text: "SWIPE AWAY.", highlight: true }
    ],
    brollLabel: "AI B-Roll · 35mm Anamorphic Rack",
    brollPrompt: "Cinematic 35mm rack focus from clapperboard to director eye reflection, 24fps motion blur."
  },
  {
    id: "growth",
    creator: "Marcus B. · Growth Strategist",
    topic: "The Dopamine Loop Pattern Interrupt",
    retention: "89%",
    hookTime: "0.0s - 3.5s",
    rawCaption: ["The", "algorithm", "rewards", "visual", "velocity", "more", "than", "any", "hashtag", "trick..."],
    dissectCaption: [
      { text: "THE ALGORITHM" },
      { text: "REWARDS VELOCITY,", highlight: true },
      { text: "NOT" },
      { text: "HASHTAG TRICKS.", highlight: true }
    ],
    brollLabel: "Livepeer · Tokyo Drone Hyperlapse",
    brollPrompt: "FPV drone descending through Tokyo neon rain reflection at 60fps, high dynamic range."
  }
];

export function PhoneViewportMockup() {
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showBroll, setShowBroll] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(42);

  const scenario = SCENARIOS[selectedScenarioIdx];

  // Simulated 60 FPS scrubber loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 120);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="flex flex-col items-center">
      {/* Scenario Selector Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
        {SCENARIOS.map((sc, idx) => (
          <button
            key={sc.id}
            onClick={() => {
              setSelectedScenarioIdx(idx);
              setProgress(15);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-heading font-medium transition-all ${
              selectedScenarioIdx === idx
                ? "bg-[#84cc16] text-black font-bold shadow-[0_0_15px_rgba(132,204,22,0.4)]"
                : "bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08] border border-white/10"
            }`}
          >
            {sc.creator}
          </button>
        ))}
      </div>

      {/* 9:16 Phone Shell */}
      <div className="relative w-[300px] sm:w-[330px] h-[580px] sm:h-[620px] rounded-[42px] bg-[#0c0e15] border-[6px] border-[#222736] shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_30px_rgba(132,204,22,0.15)] overflow-hidden flex flex-col justify-between p-4">
        
        {/* Phone Dynamic Island */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-5 rounded-full bg-black flex items-center justify-center gap-2 z-30">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-800" />
          <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
        </div>

        {/* Video Canvas Stage */}
        <div className="absolute inset-0 z-10 bg-black flex flex-col justify-between overflow-hidden">
          {/* Simulated Video Layer with Real Cinematic Visuals */}
          <div className="absolute inset-0 overflow-hidden">
            {showBroll && progress > 30 && progress < 85 ? (
              // Livepeer Generative B-Roll Cut
              <div className="relative w-full h-full animate-fadeIn">
                <img
                  src={scenario.id === "growth" ? "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MTYvejRDTFU0THkyRjFoWml5TklJcWEyLmpwZw.660ffbf5b22ed418/z4CLU4Ly2F1hZiyNIIqa2.jpg" : "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MWUvSkhLMUNBeHVudFBBd29HQ1RZTVdCLmpwZw.969dfc1a43072ab4/JHK1CAxuntPAwoGCTYMWB.jpg"}
                  alt="Livepeer AI B-Roll"
                  className="w-full h-full object-cover scale-105 animate-pulse transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
                <div className="absolute top-12 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-black/70 border border-[#84cc16]/40 text-[#84cc16] font-bold">
                    LIVEPEER AI B-ROLL
                  </span>
                </div>
              </div>
            ) : (
              // Talking Head Master Shot
              <div className="relative w-full h-full">
                <img
                  src="https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MDEvekFjeWZCNVR6OUJHTGJJaDZ2TGZQLmpwZw.e73f200b252ea79b/zAcyfB5Tz9BGLbIh6vLfP.jpg"
                  alt={scenario.creator}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
                {/* Face-Tracking Reticle */}
                <div className="absolute top-28 left-1/2 -translate-x-1/2 w-28 h-36 border border-[#84cc16]/60 border-dashed rounded-lg pointer-events-none flex flex-col justify-between p-1">
                  <span className="text-[7px] font-mono text-[#84cc16]">TRACK: 0.99</span>
                </div>
              </div>
            )}
          </div>

          {/* Top Video Overlays */}
          <div className="relative z-20 pt-8 px-2 flex items-center justify-between">
            <div className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-[#84cc16] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#84cc16] animate-ping" />
              <span>{scenario.retention} Retained</span>
            </div>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#84cc16]" />}
            </button>
          </div>

          {/* Kinetic Captions Stage (Bottom Center) */}
          <div className="relative z-20 pb-16 px-4 text-center">
            {showBroll ? (
              <div className="flex flex-wrap items-center justify-center gap-1.5 animate-pulse">
                {scenario.dissectCaption.map((word, wIdx) => (
                  <span
                    key={wIdx}
                    className={`font-viral text-xl sm:text-2xl uppercase tracking-wide px-1.5 py-0.5 rounded ${
                      word.highlight
                        ? "bg-[#84cc16] text-black font-extrabold shadow-[0_0_15px_rgba(132,204,22,0.6)]"
                        : "bg-black/70 text-white border border-white/10"
                    }`}
                  >
                    {word.text}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs font-sans text-zinc-400 bg-black/60 px-3 py-2 rounded-lg">
                {scenario.rawCaption.join(" ")}
              </p>
            )}
          </div>

          {/* Scrubber Progress Bar */}
          <div className="relative z-20 px-4 pb-4">
            <div className="w-full h-1 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#84cc16] to-[#06b6d4] transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400 mt-1">
              <span>00:0{Math.floor(progress / 20)}</span>
              <span>Hook Window: {scenario.hookTime}</span>
              <span>00:05</span>
            </div>
          </div>
        </div>

        {/* Floating Toggle Controls */}
        <div className="relative z-30 flex items-center justify-between mt-auto pt-2 border-t border-white/10 bg-black/80 backdrop-blur-md px-2 py-1.5 rounded-2xl">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setShowBroll(!showBroll)}
            className={`px-3 py-1 rounded-lg text-[10px] font-heading font-semibold transition-all ${
              showBroll
                ? "bg-[#84cc16]/20 text-[#84cc16] border border-[#84cc16]/40"
                : "bg-white/5 text-zinc-400 border border-white/10"
            }`}
          >
            {showBroll ? "Dissect AI Cut (91%)" : "Raw Video (14%)"}
          </button>

          <button
            onClick={() => setProgress(0)}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-zinc-300"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
