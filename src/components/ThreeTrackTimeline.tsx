"use client";

import React, { useRef } from "react";
import { BrollCut, VideoHook } from "../lib/types";
import { Video, Layers, Type, Play, Pause, Scissors, Sparkles } from "lucide-react";
import { cinematicAudio } from "../lib/cinematic-audio";

interface ThreeTrackTimelineProps {
  hook: VideoHook;
  brollCuts: BrollCut[];
  currentTime: number;
  onSeek: (time: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSelectBrollCut: (cut: BrollCut) => void;
  selectedBrollId: string | null;
}

export function ThreeTrackTimeline({
  hook,
  brollCuts,
  currentTime,
  onSeek,
  isPlaying,
  onTogglePlay,
  onSelectBrollCut,
  selectedBrollId,
}: ThreeTrackTimelineProps) {
  const totalDuration = hook.durationSec;
  const progressPct = Math.min(100, (currentTime / totalDuration) * 100);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(+(pct * totalDuration).toFixed(2));
    cinematicAudio.play("click");
  };

  return (
    <div className="bg-[#090b12] border border-white/10 rounded-2xl p-3.5 flex flex-col gap-2.5 shadow-2xl select-none">
      {/* Timeline Header with Timecode Display */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs font-mono">
        <div className="flex items-center gap-3">
          <button
            onClick={onTogglePlay}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
          </button>
          <span className="text-white font-bold text-xs font-mono">
            {currentTime.toFixed(2)}s <span className="text-zinc-500">/ {totalDuration.toFixed(2)}s</span>
          </span>
        </div>

        <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#84cc16]" />
            <span>Livepeer Generative B-Roll</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#06b6d4]" />
            <span>Speaker A</span>
          </span>
        </div>
      </div>

      {/* Interactive Timeline Tracks Container */}
      <div 
        ref={trackRef}
        onClick={handleTrackClick}
        className="relative flex flex-col gap-2 cursor-pointer pt-4"
      >
        {/* Playhead Red Needle */}
        <div
          style={{ left: `${progressPct}%` }}
          className="absolute top-0 bottom-0 w-0.5 bg-[#f43f5e] z-30 pointer-events-none shadow-[0_0_8px_rgba(244,63,94,0.8)]"
        >
          <div className="w-3 h-3 rounded-full bg-[#f43f5e] -translate-x-1.5 -translate-y-1.5 border border-white" />
        </div>

        {/* Ruler Header Ticks */}
        <div className="h-4 w-full flex justify-between text-[8px] font-mono text-zinc-500 pb-1 border-b border-white/5 pointer-events-none">
          <span>00:00</span>
          <span>00:05</span>
          <span>00:10</span>
          <span>00:15</span>
          <span>00:20</span>
          <span>00:25</span>
        </div>

        {/* Track 1: Master Speaker Audio Waveform & Filmstrip */}
        <div className="flex items-center gap-2">
          <div className="w-20 shrink-0 flex items-center gap-1 text-[9px] font-mono text-zinc-400">
            <Video className="w-3 h-3 text-[#06b6d4]" />
            <span>A1: Speaker</span>
          </div>
          <div className="flex-1 h-7 rounded-lg bg-[#06b6d4]/15 border border-[#06b6d4]/30 relative flex items-center px-2 text-[9px] font-mono text-[#06b6d4] overflow-hidden">
            {/* Simulated Audio Waveform Peaks */}
            <div className="absolute inset-0 opacity-25 flex items-center justify-around pointer-events-none">
              {Array.from({ length: 48 }).map((_, i) => (
                <div
                  key={i}
                  style={{ height: `${20 + (i % 7) * 12}%` }}
                  className="w-0.5 bg-[#06b6d4] rounded-full"
                />
              ))}
            </div>
            <span className="relative z-10 font-bold">1080x1920 Smart-Crop Face Track</span>
          </div>
        </div>

        {/* Track 2: AI B-Roll Inserts */}
        <div className="flex items-center gap-2">
          <div className="w-20 shrink-0 flex items-center gap-1 text-[9px] font-mono text-zinc-400">
            <Layers className="w-3 h-3 text-[#84cc16]" />
            <span>V2: B-Roll</span>
          </div>
          <div className="flex-1 h-8 rounded-lg bg-black/60 border border-white/10 relative overflow-hidden">
            {brollCuts.map((cut) => {
              const leftPct = (cut.startSec / totalDuration) * 100;
              const widthPct = (cut.durationSec / totalDuration) * 100;
              const isSelected = selectedBrollId === cut.id;
              const isSynthesizing = cut.status === "synthesizing";
              return (
                <button
                  key={cut.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectBrollCut(cut);
                    cinematicAudio.play("broll");
                  }}
                  style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                  className={`absolute top-0.5 bottom-0.5 rounded-md px-2 text-[9px] font-mono font-bold truncate flex items-center justify-between border transition-all ${
                    isSynthesizing
                      ? "bg-[#f59e0b]/30 text-[#f59e0b] border-[#f59e0b] animate-pulse z-20"
                      : isSelected
                      ? "bg-[#84cc16] text-black border-white shadow-[0_0_15px_rgba(132,204,22,0.8)] z-20"
                      : "bg-[#84cc16]/25 text-[#84cc16] border-[#84cc16]/50 hover:bg-[#84cc16]/40"
                  }`}
                >
                  <span className="truncate flex items-center gap-1">
                    <Sparkles className={`w-2.5 h-2.5 shrink-0 ${isSynthesizing ? "animate-spin" : ""}`} />
                    <span className="truncate">
                      {isSynthesizing
                        ? "Livepeer Synthesizing..."
                        : cut.triggerPhrase && !cut.triggerPhrase.startsWith("http")
                        ? cut.triggerPhrase.slice(0, 22)
                        : "AI B-Roll"}
                    </span>
                  </span>
                  <span className="text-[8px] bg-black/60 text-white px-1 rounded ml-1 shrink-0">
                    {isSynthesizing ? "LIVE" : "$0.04"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Track 3: Kinetic Captions Alignments */}
        <div className="flex items-center gap-2">
          <div className="w-20 shrink-0 flex items-center gap-1 text-[9px] font-mono text-zinc-400">
            <Type className="w-3 h-3 text-[#fbbf24]" />
            <span>T3: Words</span>
          </div>
          <div className="flex-1 h-6 rounded-lg bg-[#fbbf24]/10 border border-[#fbbf24]/20 relative flex items-center px-2 text-[8px] font-mono text-[#fbbf24]">
            <span>Whisper-v3 Kinetic Typography Grid</span>
          </div>
        </div>
      </div>
    </div>
  );
}
