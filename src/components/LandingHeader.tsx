"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Scissors, ArrowRight, Play, Sliders } from "lucide-react";

export function LandingHeader() {
  const [timecode, setTimecode] = useState("00:14:28:12");

  useEffect(() => {
    let frame = 12;
    const interval = setInterval(() => {
      frame = (frame + 1) % 30;
      const fStr = frame.toString().padStart(2, "0");
      setTimecode(`00:14:28:${fStr}`);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 h-16 border-b border-[#84cc16]/20 bg-[#07080d]/90 backdrop-blur-xl z-50 px-4 sm:px-8 flex items-center justify-between">
      {/* Brand Lockup */}
      <Link href="/" className="flex items-center gap-3 group">
        <div className="w-8 h-8 rounded-lg bg-[#84cc16]/10 border border-[#84cc16]/40 flex items-center justify-center text-[#84cc16] shadow-[0_0_15px_rgba(132,204,22,0.2)] group-hover:border-[#84cc16] transition-colors">
          <Scissors className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-kinetic font-black text-sm tracking-tight text-white group-hover:text-[#84cc16] transition-colors">
              DISSECT
            </span>
            <span className="px-1.5 py-0.5 rounded text-[8px] font-mono uppercase bg-[#84cc16]/15 text-[#84cc16] border border-[#84cc16]/30">
              NLE 9:16
            </span>
          </div>
          <span className="text-[10px] text-zinc-400 font-mono block">
            Autonomous B-Roll Re-Cutter
          </span>
        </div>
      </Link>

      {/* Center Studio Timecode & NLE Track Status */}
      <div className="hidden lg:flex items-center gap-3 px-3 py-1 rounded-lg bg-black/60 border border-white/10 font-mono text-xs">
        <div className="flex items-center gap-1.5 text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-[#f43f5e] animate-pulse" />
          <span className="text-zinc-500 uppercase text-[10px]">TC:</span>
          <span className="text-white font-bold">{timecode}</span>
        </div>
        <span className="text-zinc-600">|</span>
        <div className="flex items-center gap-1.5 text-[10px]">
          <span className="px-1.5 py-0.5 rounded bg-[#06b6d4]/15 text-[#06b6d4] font-semibold border border-[#06b6d4]/30">A1:HOST</span>
          <span className="px-1.5 py-0.5 rounded bg-[#84cc16]/15 text-[#84cc16] font-semibold border border-[#84cc16]/30">V2:B-ROLL</span>
          <span className="px-1.5 py-0.5 rounded bg-[#fbbf24]/15 text-[#fbbf24] font-semibold border border-[#fbbf24]/30">T3:WORDS</span>
        </div>
        <span className="text-zinc-600">|</span>
        <div className="flex items-center gap-1 text-[10px] text-[#84cc16]">
          <span>LIVEPEER GPU</span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        <Link
          href="/studio"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-heading font-bold text-black bg-[#84cc16] hover:bg-[#a3e635] active:scale-95 transition-all shadow-[0_0_20px_rgba(132,204,22,0.3)] cursor-pointer"
        >
          <span>Open NLE Studio</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </header>
  );
}
