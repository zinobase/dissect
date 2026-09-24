"use client";

import React from "react";
import { VideoHook, BrollCut } from "../lib/types";
import { SAMPLE_LONGFORM_HOOKS } from "../lib/broll-synthesizer";
import { Flame, Play, Clock, Sparkles, TrendingUp, Scissors, FileText } from "lucide-react";
import { cinematicAudio } from "../lib/cinematic-audio";

interface HookScorerPanelProps {
  selectedHookId: string;
  onSelectHook: (hook: VideoHook) => void;
  brollCuts: BrollCut[];
  currentTime: number;
  hooks?: VideoHook[];
  onSeek?: (seconds: number) => void;
}

export function HookScorerPanel({
  selectedHookId,
  onSelectHook,
  brollCuts,
  currentTime,
  hooks,
  onSeek,
}: HookScorerPanelProps) {
  const hookList = hooks && hooks.length > 0 ? hooks : SAMPLE_LONGFORM_HOOKS;
  const currentHook = hookList.find((h) => h.id === selectedHookId) || hookList[0];

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-5 h-full overflow-y-auto">
      {/* 1. Hook Leaderboard Matrix */}
      <div className="bg-[#090b12] border border-white/10 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#84cc16]/15 border border-[#84cc16]/30 flex items-center justify-center text-[#84cc16]">
              <Scissors className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-heading font-bold uppercase tracking-tight text-white">
              Detected High-Retention Hooks
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#84cc16] bg-[#84cc16]/10 px-2 py-0.5 rounded border border-[#84cc16]/20">
            Whisper Semantic Scanner
          </span>
        </div>

        <div className="space-y-2">
          {hookList.map((hook) => {
            const isSelected = selectedHookId === hook.id;
            return (
              <button
                key={hook.id}
                onClick={() => {
                  onSelectHook(hook);
                  cinematicAudio.play("click");
                }}
                className={`w-full p-3 rounded-xl text-left border transition-all ${
                  isSelected
                    ? "bg-[#84cc16]/15 border-[#84cc16] shadow-[0_0_20px_rgba(132,204,22,0.2)]"
                    : "bg-white/[0.02] border-white/5 hover:border-white/15 hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 font-semibold">
                    {hook.viralCategory}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-[#84cc16] font-bold">
                    <Flame className="w-3 h-3 text-[#f59e0b]" />
                    <span>{hook.retentionScore}% Viral Score</span>
                  </div>
                </div>
                <h4 className="text-xs font-heading font-bold text-white truncate">
                  {hook.title}
                </h4>
                <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 mt-1">
                  <span>{hook.sourceSpeaker}</span>
                  <span>•</span>
                  <span>{hook.durationSec}s cut</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Interactive Script Workspace */}
      <div className="bg-[#090b12] border border-white/10 rounded-2xl p-4 shadow-lg flex flex-col gap-3 flex-1 min-h-[220px]">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-[#06b6d4]" />
            <span className="text-xs font-heading font-bold uppercase text-white">
              Whisper-v3 Word-Level Speech Canvas
            </span>
          </div>
          <span className="text-[10px] font-mono text-zinc-400">
            Playback: <span className="text-white font-bold">{currentTime.toFixed(2)}s</span>
          </span>
        </div>

        {/* Continuous Paragraph Flow with Fluid Highlight */}
        <div className="p-4 rounded-xl bg-black/60 border border-white/5 font-sans text-sm leading-relaxed overflow-y-auto max-h-[190px]">
          <p className="text-zinc-300">
            {currentHook.transcript.map((w, idx) => {
              const isActive = currentTime >= w.startSec && currentTime <= w.endSec;
              const isPast = currentTime > w.endSec;
              return (
                <span
                  key={idx}
                  onClick={() => onSeek && onSeek(w.startSec)}
                  className={`inline-block mr-1.5 my-0.5 px-1 py-0.5 rounded cursor-pointer transition-all duration-100 ${
                    isActive
                      ? "bg-[#84cc16] text-black font-extrabold shadow-[0_0_12px_rgba(132,204,22,0.6)] scale-105"
                      : isPast
                      ? "text-zinc-200 hover:text-white"
                      : w.isKeyTerm
                      ? "text-[#f59e0b] font-semibold border-b border-[#f59e0b]/40 hover:text-white"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {w.word}
                </span>
              );
            })}
          </p>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-1">
          <span>Active Speaker: <span className="text-[#06b6d4]">{currentHook.sourceSpeaker}</span></span>
          <span className="text-[#84cc16]">{brollCuts.length} Livepeer B-Roll Inserts Active</span>
        </div>
      </div>
    </div>
  );
}
