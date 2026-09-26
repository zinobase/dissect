"use client";

import Link from "next/link";
import { Cpu, Flame, Layers, Sparkles, ChevronLeft } from "lucide-react";
import { DissectLogoMark } from "./DissectLogoMark";

interface HeaderProps {
  onExport: () => void;
  retentionScore: number;
}

export function Header({ onExport, retentionScore }: HeaderProps) {
  return (
    <header className="h-14 border-b border-white/10 bg-[#090b10]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-xs font-mono pr-2 border-r border-white/10"
          title="Back to Overview"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Overview</span>
        </Link>
        <Link href="/" className="flex items-center gap-3 group">
          <DissectLogoMark className="w-8 h-7 group-hover:scale-105 transition-transform drop-shadow-[0_0_10px_rgba(132,204,22,0.35)]" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-bold text-sm tracking-tight text-white group-hover:text-[#84cc16] transition-colors">
                DISSECT
              </h1>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-[#84cc16]/15 text-[#84cc16] border border-[#84cc16]/30">
                Track 2 · Core Agent Builder
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono block">
              Autonomous B-Roll Synthesis & Re-Cutter
            </span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-4">
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/10 text-[10px] font-mono text-zinc-300">
          <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse" />
          <span>Whisper-v3 Timestamp Engine</span>
        </div>

        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/10 text-[10px] font-mono text-zinc-300">
          <Cpu className="w-3 h-3 text-[#84cc16]" />
          <span>Livepeer Creative MCP</span>
          <span className="text-[#84cc16]">125 Tools</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/30 text-[10px] font-mono text-[#f59e0b]">
          <Flame className="w-3 h-3" />
          <span>{retentionScore}% Viral Score</span>
        </div>

        <button
          onClick={onExport}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold text-white bg-gradient-to-r from-[#f43f5e] to-[#f59e0b] hover:opacity-90 transition-opacity"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Export 9:16 Reel</span>
        </button>
      </div>
    </header>
  );
}
