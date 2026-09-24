"use client";

import React from "react";
import Link from "next/link";
import { Scissors, Sparkles, ArrowRight, Zap } from "lucide-react";

export function LandingHeader() {
  return (
    <header className="fixed top-0 inset-x-0 h-16 border-b border-white/10 bg-[#08090e]/85 backdrop-blur-xl z-50 px-4 sm:px-8 flex items-center justify-between">
      {/* Brand Lockup */}
      <Link href="/" className="flex items-center gap-3 group">
        <div className="w-9 h-9 rounded-xl bg-[#84cc16]/10 border border-[#84cc16]/30 flex items-center justify-center text-[#84cc16] shadow-[0_0_20px_rgba(132,204,22,0.25)] group-hover:scale-105 transition-transform">
          <Scissors className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-kinetic font-black text-sm tracking-tight text-white group-hover:text-[#84cc16] transition-colors">
              DISSECT
            </span>
          </div>
          <span className="text-[10px] text-zinc-400 font-mono block">
            Autonomous B-Roll Synthesis & Re-Cutter
          </span>
        </div>
      </Link>

      {/* Center Engine Indicator */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-xs font-mono text-zinc-300 shadow-inner">
        <span className="w-2 h-2 rounded-full bg-[#84cc16] animate-pulse" />
        <span>Whisper-v3 + Livepeer Video Engine</span>
        <span className="text-zinc-600">|</span>
        <span className="text-[#84cc16]">91.4% Retention</span>
      </div>

      {/* Right Action: Launch Studio Action */}
      <div className="flex items-center gap-3">
        <Link
          href="/studio"
          className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-heading font-bold text-black bg-gradient-to-r from-[#84cc16] via-[#06b6d4] to-[#f43f5e] hover:brightness-110 transition-all shadow-[0_0_25px_rgba(132,204,22,0.35)] group overflow-hidden"
        >
          <span className="absolute inset-0 w-1/2 h-full bg-white/25 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-700" />
          <span className="relative z-10">Launch Studio</span>
          <ArrowRight className="w-3.5 h-3.5 relative z-10 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </header>
  );
}
