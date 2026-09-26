"use client";

import React from "react";
import Link from "next/link";
import { Scissors, ArrowRight } from "lucide-react";

export function LandingHeader() {
  const playClickSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.03);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch {
      // Audio policy safe
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#07090e]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[92rem] items-center justify-between px-5 sm:px-8 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        {/* Brand Lockup */}
        <Link href="/" className="-m-1 flex items-center gap-3 justify-self-start rounded-md p-1 group">
          <div className="w-8 h-8 rounded-lg bg-[#84cc16]/10 border border-[#84cc16]/30 flex items-center justify-center text-[#84cc16] shadow-[0_0_15px_rgba(132,204,22,0.15)] group-hover:border-[#84cc16]/60 transition-colors">
            <Scissors className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center">
              <span className="font-kinetic font-black text-sm tracking-tight text-white group-hover:text-[#84cc16] transition-colors">
                DISSECT
              </span>
            </div>
          </div>
        </Link>

        {/* Center Primary Nav */}
        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {[
            { href: "/studio", label: "Studio" },
            { href: "#demo", label: "9:16 Demo" },
            { href: "#cadence", label: "Cadence Law" },
            { href: "#pipeline", label: "Livepeer Pipeline" },
            { href: "#metrics", label: "Metrics" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => playClickSound()}
              className="text-[0.6875rem] font-medium tracking-[0.14em] text-zinc-400 uppercase transition-colors hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 justify-self-end sm:gap-2.5">
          <Link
            href="/studio"
            onClick={playClickSound}
            className="group inline-flex h-9 items-center gap-1.5 rounded-full bg-[#84cc16] px-4 text-[0.6875rem] font-semibold tracking-[0.12em] text-black uppercase transition-all hover:bg-[#a3e635] shadow-[0_0_20px_rgba(132,204,22,0.25)] active:scale-[0.98] cursor-pointer"
          >
            <span>Launch Studio</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
