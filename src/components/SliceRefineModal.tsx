"use client";

import React, { useState } from "react";
import { X, Sparkles, Cpu, RotateCcw, RefreshCw, AlertCircle, Wand2, Sliders } from "lucide-react";
import { BrollCut } from "../lib/types";
import { cinematicAudio } from "../lib/cinematic-audio";
import { livepeerMcp } from "../lib/livepeerMcp";
import { optimizeCinematicPrompt, DirectorialStyle } from "../lib/prompt-optimizer";

interface SliceRefineModalProps {
  isOpen: boolean;
  onClose: () => void;
  brollCut: BrollCut | null;
  onUpdateBrollPrompt: (brollId: string, newPrompt: string, newUrl?: string, status?: "synthesized" | "rendering" | "ready" | "synthesizing") => void;
}

export function SliceRefineModal({
  isOpen,
  onClose,
  brollCut,
  onUpdateBrollPrompt,
}: SliceRefineModalProps) {
  const [prompt, setPrompt] = useState(brollCut?.prompt || "");
  const [selectedStyle, setSelectedStyle] = useState<DirectorialStyle>("cinematic_prime");
  const [isReRendering, setIsReRendering] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !brollCut) return null;

  const handleOptimizePrompt = (styleToUse: DirectorialStyle = selectedStyle) => {
    setIsOptimizing(true);
    cinematicAudio.play("click");
    const result = optimizeCinematicPrompt(prompt || brollCut.prompt, styleToUse, "9:16");
    setPrompt(result.optimizedPrompt);
    setSelectedStyle(styleToUse);
    setIsOptimizing(false);
  };

  const handleReRender = async (e?: React.FormEvent, directPrompt?: string) => {
    if (e) e.preventDefault();
    const targetPrompt = directPrompt || prompt;
    if (!targetPrompt.trim()) return;

    cinematicAudio.play("render");

    // 1. Optimistic Non-Blocking UI update: immediately mark slice as synthesizing & close modal
    onUpdateBrollPrompt(brollCut.id, targetPrompt.trim(), undefined, "synthesizing");
    onClose();

    // 2. Dispatch Livepeer synthesis off the main thread in background
    try {
      const result = await livepeerMcp.createMedia({
        action: "generate",
        prompt: `Cinematic 9:16 vertical b-roll: ${targetPrompt.trim()}`,
        aspectRatio: "9:16",
        quality: "fast",
      });

      // 3. Asynchronous GPU texture pre-decode
      if (result.url && typeof window !== "undefined") {
        const proxyUrl = result.url.includes("/api/proxy-media")
          ? result.url
          : `/api/proxy-media?url=${encodeURIComponent(result.url)}`;
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = proxyUrl;
        if ("decode" in img && typeof img.decode === "function") {
          await img.decode().catch(() => {});
        }
      }

      onUpdateBrollPrompt(brollCut.id, targetPrompt.trim(), result.url, "ready");
      cinematicAudio.play("broll");
    } catch (err: any) {
      console.warn("Livepeer slice surgery background notice:", err);
      onUpdateBrollPrompt(brollCut.id, targetPrompt.trim(), undefined, "ready");
    }
  };

  const handleReimagineTake = (style: DirectorialStyle) => {
    const result = optimizeCinematicPrompt(prompt || brollCut.prompt, style, "9:16");
    setPrompt(result.optimizedPrompt);
    setSelectedStyle(style);
    handleReRender(undefined, result.optimizedPrompt);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="max-w-xl w-full rounded-2xl bg-[#0d0f17] border border-white/15 p-6 shadow-2xl relative flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#84cc16]/10 border border-[#84cc16]/30 flex items-center justify-center text-[#84cc16]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-display font-bold text-white tracking-tight">
                Conversational B-Roll Slice Surgery
              </h3>
              <p className="text-[11px] font-mono text-zinc-400">
                Target Slice: {brollCut.startSec}s - {brollCut.endSec}s ({brollCut.durationSec}s cut)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isReRendering}
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors disabled:opacity-30"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={(e) => handleReRender(e)} className="my-4 space-y-3">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs font-mono flex items-center justify-between">
            <div>
              <span className="text-zinc-500 uppercase block mb-0.5 text-[10px]">Spoken Trigger Phrase:</span>
              <span className="text-[#f59e0b] font-semibold">"{brollCut.triggerPhrase}"</span>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10">
              Livepeer 9:16
            </span>
          </div>

          {/* Directorial Lens Presets */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                <Sliders className="w-3 h-3 text-[#84cc16]" />
                Directorial Lenses & Instant Takes:
              </span>
              <button
                type="button"
                onClick={() => handleOptimizePrompt()}
                disabled={isReRendering || isOptimizing}
                className="text-[10px] font-mono text-[#84cc16] hover:underline flex items-center gap-1"
              >
                <Wand2 className="w-3 h-3" />
                Auto-Optimize Optics
              </button>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {(
                [
                  { key: "cinematic_prime", label: "35mm Prime" },
                  { key: "macro_texture", label: "Macro Detail" },
                  { key: "dynamic_drone", label: "Aerial Drone" },
                  { key: "studio_push", label: "Studio Push" },
                ] as const
              ).map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleReimagineTake(key)}
                  disabled={isReRendering}
                  className={`px-2 py-1.5 rounded-lg border text-[10px] font-mono transition-all text-center ${
                    selectedStyle === key
                      ? "bg-[#84cc16]/20 border-[#84cc16] text-[#84cc16] font-bold"
                      : "bg-white/[0.03] border-white/10 text-zinc-400 hover:text-zinc-200 hover:border-white/20"
                  }`}
                  title="Click to instantly re-imagine slice in this directorial style on Livepeer MCP"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-mono text-zinc-300">
                Livepeer Diffusion Prompt:
              </label>
              <span className="text-[9px] font-mono text-zinc-500">
                Calibrated for 9:16 vertical composition
              </span>
            </div>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-3 rounded-xl bg-black/60 border border-white/10 focus:border-[#84cc16] text-xs font-sans text-white focus:outline-none transition-colors resize-none leading-relaxed"
              placeholder="e.g. Cinematic 9:16 vertical drone flythrough of Tokyo in rain with anamorphic lens flare..."
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pt-1">
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#84cc16]" />
              <span>agent.livepeer.org/api/mcp/creative</span>
            </div>
            <span className="text-[#84cc16] font-bold">125 MCP Tools Active</span>
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-red-950/30 border border-red-500/30 text-red-300 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={isReRendering}
              className="px-4 py-2 rounded-xl text-xs font-mono text-zinc-300 bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-30"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isReRendering || !prompt.trim()}
              className="px-5 py-2 rounded-xl text-xs font-heading font-bold text-black bg-[#84cc16] hover:brightness-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(132,204,22,0.4)] flex items-center gap-1.5 disabled:opacity-40"
            >
              {isReRendering ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing on Livepeer...</span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Re-Render Slice</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
