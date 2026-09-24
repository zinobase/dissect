"use client";

import React, { useState, useEffect } from "react";
import { X, Download, Film, CheckCircle2, RefreshCw, AlertCircle } from "lucide-react";
import { livepeerMcp } from "../lib/livepeerMcp";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  hookTitle: string;
  speaker: string;
  durationSec: number;
  previewVideoUrl?: string;
}

export function ExportModal({
  isOpen,
  onClose,
  hookTitle,
  speaker,
  durationSec,
  previewVideoUrl,
}: ExportModalProps) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<"rendering" | "encoding" | "ready">("rendering");
  const [downloaded, setDownloaded] = useState(false);
  const [exportedUrl, setExportedUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setStage("rendering");
      setDownloaded(false);
      setExportedUrl(null);
      setErrorMsg(null);
      return;
    }

    let isMounted = true;
    setProgress(20);

    const runExport = async () => {
      try {
        if (!isMounted) return;
        setProgress(50);
        setStage("rendering");

        // Dispatches to Livepeer Agent MCP director_export
        const exportRes = await livepeerMcp.compileDirectorCut(
          `Dissect: ${hookTitle} (${speaker})`,
          "mp4"
        );

        if (!isMounted) return;
        setProgress(90);
        setStage("encoding");

        if (!isMounted) return;
        setProgress(100);
        setStage("ready");
        setExportedUrl(exportRes.masterVideoUrl || previewVideoUrl || null);
      } catch (err: any) {
        if (!isMounted) return;
        setErrorMsg(err.message || "Livepeer MCP export failed");
        setProgress(100);
        setStage("ready");
        setExportedUrl(previewVideoUrl || null);
      }
    };

    runExport();

    return () => {
      isMounted = false;
    };
  }, [isOpen, hookTitle, speaker, previewVideoUrl]);

  if (!isOpen) return null;

  const handleDownload = () => {
    const targetUrl = exportedUrl || previewVideoUrl;
    if (!targetUrl) return;

    const a = document.createElement("a");
    a.href = targetUrl;
    a.target = "_blank";
    a.download = `dissect-${speaker.toLowerCase().replace(/\s+/g, "-")}-1080x1920.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setDownloaded(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#07090e] border border-white/15 rounded-2xl shadow-2xl p-6 text-zinc-100 font-sans space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#84cc16]/15 border border-[#84cc16]/30 flex items-center justify-center text-[#84cc16]">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm text-white">
                Export 9:16 Vertical Video
              </h3>
              <p className="text-[10px] text-zinc-400 font-mono">
                Livepeer Agent Creative MCP · director_export
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Preview Card */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-black/50 border border-white/10">
          <div className="w-14 h-20 rounded-lg overflow-hidden bg-black shrink-0 border border-white/15 relative">
            <img
              src={exportedUrl || previewVideoUrl || "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjcyNTcvSDZ3T2hiX01iNkg2N04xNFhpVF9hLmpwZw.207085ee06b7dd4d/H6wOhb_Mb6H67N14XiT_a.jpg"}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <span className="absolute bottom-1 left-1 text-[7px] font-mono text-[#84cc16] font-bold">
              9:16
            </span>
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <div className="text-xs font-heading font-bold text-white truncate">
              {hookTitle}
            </div>
            <div className="text-[10px] font-mono text-zinc-400">
              Host: {speaker}
            </div>
            <div className="text-[10px] font-mono text-[#84cc16]">
              Duration: {durationSec}s · Livepeer Agent MCP
            </div>
          </div>
        </div>

        {/* A/B Hook Variant Selector */}
        <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2 text-[10px] font-mono">
          <div className="flex items-center justify-between text-zinc-300">
            <span className="font-bold text-[#84cc16] uppercase text-[9px] tracking-wider">
              A/B Viral Hook Split-Testing
            </span>
            <span className="text-zinc-500 text-[8px]">TikTok / Reels Batch</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-center">
            {[
              { id: "variant-a", label: "Hook A: Macro", desc: "Pattern Interrupt" },
              { id: "variant-b", label: "Hook B: Drone", desc: "Kinetic Reveal" },
              { id: "variant-c", label: "Hook C: A-Roll", desc: "Subtitled Strobe" },
            ].map((v, idx) => (
              <div
                key={v.id}
                className={`p-1.5 rounded-lg border text-[9px] transition-all cursor-pointer ${
                  idx === 0
                    ? "bg-[#84cc16]/15 border-[#84cc16] text-[#84cc16] font-bold"
                    : "bg-white/[0.02] border-white/10 text-zinc-400 hover:text-white"
                }`}
              >
                <div className="font-bold">{v.label}</div>
                <div className="text-[7.5px] text-zinc-500">{v.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Render Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400 flex items-center gap-1.5">
              {stage !== "ready" && <RefreshCw className="w-3 h-3 animate-spin text-[#84cc16]" />}
              {stage === "rendering" ? "Compositing 60 FPS B-roll via Livepeer MCP..." : stage === "encoding" ? "Encoding H.264 Master via Livepeer..." : "Ready for Distribution"}
            </span>
            <span className="text-[#84cc16] font-bold">{progress}%</span>
          </div>

          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              style={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-[#84cc16] to-[#06b6d4] transition-all duration-300 shadow-[0_0_12px_rgba(132,204,22,0.6)]"
            />
          </div>
        </div>

        {errorMsg && (
          <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300 transition-colors"
          >
            Close
          </button>

          <button
            onClick={handleDownload}
            disabled={stage !== "ready" || (!exportedUrl && !previewVideoUrl)}
            className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#84cc16] to-[#06b6d4] text-black font-heading font-bold text-xs hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(132,204,22,0.4)] flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none"
          >
            {downloaded ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Export Dispatched</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Open Master 9:16 Video</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
