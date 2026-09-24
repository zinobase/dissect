"use client";

import React, { useState } from "react";
import { X, Youtube, ArrowRight, Wand2, RefreshCw, AlertCircle } from "lucide-react";
import { VideoHook, TranscriptWord } from "../lib/types";
import { livepeerMcp } from "../lib/livepeerMcp";

interface CustomHookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHook: (hook: VideoHook) => void;
}

export function CustomHookModal({ isOpen, onClose, onAddHook }: CustomHookModalProps) {
  const [speaker, setSpeaker] = useState("Jensen Huang");
  const [title, setTitle] = useState("NVIDIA Keynote: The Physical AI Revolution");
  const [sourceVideo, setSourceVideo] = useState("https://youtube.com/watch?v=GTC2026-Keynote");
  const [rawText, setRawText] = useState(
    "The next wave of artificial intelligence is physical AI. Autonomous robots powered by massive GPU clusters understanding the laws of physics and operating in our real physical world."
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [processError, setProcessError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleProcess = async () => {
    if (!rawText.trim() || isProcessing) return;

    setIsProcessing(true);
    setProcessError(null);

    try {
      // Dispatches to Livepeer Agent Creative MCP for 9:16 vertical stage media
      const mediaResult = await livepeerMcp.createMedia({
        action: "generate",
        prompt: `Cinematic 9:16 vertical shot of keynote speaker ${speaker} on high tech auditorium stage delivering talk on ${title}, anamorphic stage lighting`,
        aspectRatio: "9:16",
        quality: "fast",
      });

      const words = rawText.trim().split(/\s+/);
      let currentSec = 0.0;
      const briefTerms = new Set(
        rawText.replace(/[^\w\s]/g, " ").split(/\s+/).filter((w) => w.length > 4).map((w) => w.toLowerCase())
      );

      const transcript: TranscriptWord[] = words.map((w) => {
        const cleanW = w.toLowerCase().replace(/[^a-z0-9]/g, "");
        const isKey = briefTerms.has(cleanW) || w.length > 7;
        const duration = Math.max(0.35, +(w.length * 0.09).toFixed(2));
        const startSec = +currentSec.toFixed(2);
        const endSec = +(currentSec + duration).toFixed(2);
        currentSec = endSec + 0.08;
        return {
          word: w,
          startSec,
          endSec,
          isKeyTerm: isKey,
        };
      });

      const totalDuration = Math.ceil(currentSec);

      const newHook: VideoHook = {
        id: `custom-hook-${Date.now()}`,
        title: title || "Custom Keynote Cut",
        sourceSpeaker: speaker || "Keynote Speaker",
        sourceVideoTitle: sourceVideo || "Livepeer Agent MCP Dissect Stream",
        startSec: 0,
        endSec: totalDuration,
        durationSec: totalDuration,
        retentionScore: 97.6,
        viralCategory: "Deep Tech",
        quoteText: rawText,
        speakerVideoUrl: mediaResult.url,
        transcript,
      };

      onAddHook(newHook);
      onClose();
    } catch (err: any) {
      setProcessError(err.message || "Failed to process on Livepeer Agent Creative MCP");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#07090f] border border-white/15 rounded-2xl shadow-2xl p-6 sm:p-7 text-zinc-100 font-sans space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#84cc16]/15 border border-[#84cc16]/30 flex items-center justify-center text-[#84cc16]">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm text-white">
                Import Your Own Video or Transcript
              </h3>
              <p className="text-[10px] text-zinc-400 font-mono">
                Dissect with Livepeer Agent Creative MCP (agent.livepeer.org)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1 text-zinc-400 hover:text-white transition-colors disabled:opacity-30"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-3 text-[11px] font-mono">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-zinc-400 block text-[9px] uppercase mb-1">Speaker Name</label>
              <input
                type="text"
                value={speaker}
                onChange={(e) => setSpeaker(e.target.value)}
                placeholder="e.g. Jensen Huang"
                className="w-full bg-black/60 border border-white/15 rounded-lg px-2.5 py-1.5 text-white focus:border-[#84cc16] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-zinc-400 block text-[9px] uppercase mb-1">Talk / Episode Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. GTC Keynote"
                className="w-full bg-black/60 border border-white/15 rounded-lg px-2.5 py-1.5 text-white focus:border-[#84cc16] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-zinc-400 block text-[9px] uppercase mb-1">YouTube / Podcast URL (Optional)</label>
            <div className="relative flex items-center">
              <Youtube className="w-3.5 h-3.5 text-red-500 absolute left-2.5 pointer-events-none" />
              <input
                type="text"
                value={sourceVideo}
                onChange={(e) => setSourceVideo(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full bg-black/60 border border-white/15 rounded-lg pl-8 pr-2.5 py-1.5 text-white focus:border-[#84cc16] focus:outline-none text-[10px]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-zinc-400 text-[9px] uppercase">
                Spoken Transcript / Monologue Text
              </label>
              <span className="text-[9px] text-[#84cc16]">agent.livepeer.org/api/mcp/creative</span>
            </div>
            <textarea
              rows={4}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste or type any paragraph here..."
              className="w-full bg-black/60 border border-white/15 rounded-lg p-2.5 text-white focus:border-[#84cc16] focus:outline-none leading-relaxed text-[11px]"
            />
          </div>
        </div>

        {/* Quick Samples */}
        <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-[9px] font-mono flex items-center justify-between">
          <span className="text-zinc-400">Quick Fill Templates:</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setSpeaker("Jensen Huang");
                setTitle("NVIDIA Keynote: The Physical AI Revolution");
                setRawText("The next wave of artificial intelligence is physical AI. Autonomous robots powered by massive GPU clusters understanding physics and operating in our real physical world.");
              }}
              className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-zinc-300"
            >
              Jensen (Physical AI)
            </button>
            <button
              onClick={() => {
                setSpeaker("Sam Altman");
                setTitle("OpenAI DevDay: Autonomous Agents");
                setRawText("We believe agents will change how software gets built. Instead of clicking buttons, you describe high level outcomes and decentralized AI infrastructure executes every step.");
              }}
              className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-zinc-300"
            >
              Sam (AI Agents)
            </button>
          </div>
        </div>

        {processError && (
          <div className="p-2.5 rounded-lg bg-red-950/30 border border-red-500/30 text-red-300 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span>{processError}</span>
          </div>
        )}

        {/* Actions */}
        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300 transition-colors disabled:opacity-30"
          >
            Cancel
          </button>

          <button
            onClick={handleProcess}
            disabled={isProcessing || !rawText.trim()}
            className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#84cc16] to-[#06b6d4] text-black font-heading font-bold text-xs hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(132,204,22,0.3)] flex items-center justify-center gap-1.5 disabled:opacity-40"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Dissecting on Livepeer MCP...</span>
              </>
            ) : (
              <>
                <span>Auto-Dissect Hook</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
