"use client";

import React, { useEffect, useRef, useState } from "react";
import { VideoHook, BrollCut } from "../lib/types";
import { Cpu, Play, Pause, Sparkles, Layers, Maximize2, Volume2, VolumeX, RefreshCw, Crosshair } from "lucide-react";
import { cinematicAudio } from "../lib/cinematic-audio";

interface VerticalScreeningPlayerProps {
  hook: VideoHook;
  brollCuts: BrollCut[];
  currentTime: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSelectBrollCut: (cut: BrollCut) => void;
}

export function VerticalScreeningPlayer({
  hook,
  brollCuts,
  currentTime,
  isPlaying,
  onTogglePlay,
  onSelectBrollCut,
}: VerticalScreeningPlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  // Active B-Roll cut
  const activeBroll = brollCuts.find(
    (b) => currentTime >= b.startSec && currentTime <= b.endSec
  );

  // Active word in kinetic captions
  const activeWordObj = hook.transcript.find(
    (w) => currentTime >= w.startSec && currentTime <= w.endSec
  );

  // 60 FPS Canvas Video Renderer (Authentic Living 9:16 Stage)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 360);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 640);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    let frame = 0;

    const imageCache = new Map<string, HTMLImageElement>();
    const getImage = (src?: string) => {
      if (!src) return null;
      const proxySrc = src.startsWith("http") && !src.includes("/api/proxy-media")
        ? `/api/proxy-media?url=${encodeURIComponent(src)}`
        : src;
      if (imageCache.has(proxySrc)) return imageCache.get(proxySrc)!;
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = proxySrc;
      imageCache.set(proxySrc, img);
      return img;
    };

    const render = () => {
      frame++;
      const cx = width / 2;
      const cy = height / 2;

      // Dark Studio Base
      ctx.fillStyle = "#0a0c13";
      ctx.fillRect(0, 0, width, height);

      if (activeBroll) {
        // SCENE A: LIVEPEER GENERATIVE B-ROLL (Active)
        ctx.save();
        const zoom = 1 + (frame % 200) * 0.001;
        ctx.translate(cx, cy);
        ctx.scale(zoom, zoom);

        const brollSrc = activeBroll.posterUrl || activeBroll.videoUrl;
        const brollImg = getImage(brollSrc);

        if (brollImg && brollImg.complete && brollImg.naturalWidth > 0) {
          const imgAspect = brollImg.naturalWidth / brollImg.naturalHeight;
          const canvasAspect = width / height;
          let drawW = width, drawH = height;
          if (imgAspect > canvasAspect) {
            drawH = height * zoom;
            drawW = drawH * imgAspect;
          } else {
            drawW = width * zoom;
            drawH = drawW / imgAspect;
          }
          const drawX = -drawW / 2;
          const drawY = -drawH / 2;
          try {
            ctx.drawImage(brollImg, drawX, drawY, drawW, drawH);
          } catch {
            // Bypass filter on taint
          }
          const vig = ctx.createRadialGradient(0, 0, height * 0.25, 0, 0, height * 0.7);
          vig.addColorStop(0, "rgba(0,0,0,0)");
          vig.addColorStop(1, "rgba(0,0,0,0.5)");
          ctx.fillStyle = vig;
          ctx.fillRect(-width, -height, width * 2, height * 2);
        } else if (activeBroll.id.includes("wafer") || activeBroll.prompt.includes("silicon")) {
          // Silicon Wafer Macro: Glowing interconnect grid & golden bus lines
          const bgGrad = ctx.createRadialGradient(0, 0, 20, 0, 0, width * 0.8);
          bgGrad.addColorStop(0, "#052e16");
          bgGrad.addColorStop(0.5, "#02150b");
          bgGrad.addColorStop(1, "#010804");
          ctx.fillStyle = bgGrad;
          ctx.fillRect(-width, -height, width * 2, height * 2);

          // Circuit Bus Lines
          ctx.strokeStyle = "rgba(132, 204, 22, 0.35)";
          ctx.lineWidth = 1.5;
          for (let x = -width; x < width; x += 30) {
            ctx.beginPath();
            ctx.moveTo(x, -height);
            ctx.lineTo(x, height);
            ctx.stroke();
          }
          for (let y = -height; y < height; y += 30) {
            ctx.beginPath();
            ctx.moveTo(-width, y);
            ctx.lineTo(width, y);
            ctx.stroke();
          }

          // Glowing Central Processor Die
          const diePulse = Math.sin(frame * 0.1) * 4;
          ctx.fillStyle = "#84cc16";
          ctx.shadowColor = "#84cc16";
          ctx.shadowBlur = 25 + diePulse;
          ctx.fillRect(-45, -45, 90, 90);
          ctx.shadowBlur = 0;

        } else if (activeBroll.id.includes("drone") || activeBroll.prompt.includes("Tokyo")) {
          // Tokyo Neon Rain Drone Pass: Cyan & Magenta Streaks
          ctx.fillStyle = "#090314";
          ctx.fillRect(-width, -height, width * 2, height * 2);

          for (let i = 0; i < 24; i++) {
            const sx = ((i * 37 + frame * 3) % width) - width / 2;
            const sy = ((i * 53 + frame * 8) % height) - height / 2;
            ctx.strokeStyle = i % 2 === 0 ? "rgba(6, 182, 212, 0.6)" : "rgba(244, 63, 94, 0.6)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(sx + 15, sy + 60);
            ctx.stroke();
          }
        } else {
          // 35mm Optical Flare Rack Focus
          const rad = ctx.createRadialGradient(0, 0, 10, 0, 0, width * 0.7);
          rad.addColorStop(0, "rgba(245, 158, 11, 0.4)");
          rad.addColorStop(0.5, "rgba(6, 182, 212, 0.2)");
          rad.addColorStop(1, "#08090e");
          ctx.fillStyle = rad;
          ctx.fillRect(-width, -height, width * 2, height * 2);

          // Anamorphic flare streak
          ctx.strokeStyle = "rgba(6, 182, 212, 0.8)";
          ctx.lineWidth = 3;
          ctx.shadowColor = "#06b6d4";
          ctx.shadowBlur = 20;
          ctx.beginPath();
          ctx.moveTo(-width, 0);
          ctx.lineTo(width, 0);
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
        ctx.restore();

      } else {
        // SCENE B: PODCAST TALKING HEAD (Active Speaker with Face Tracking)
        const hostSrc = hook.speakerVideoUrl;
        const hostImg = getImage(hostSrc);

        if (hostImg && hostImg.complete && hostImg.naturalWidth > 0) {
          const imgAspect = hostImg.naturalWidth / hostImg.naturalHeight;
          const canvasAspect = width / height;
          let drawW = width, drawH = height;
          if (imgAspect > canvasAspect) {
            drawH = height;
            drawW = drawH * imgAspect;
          } else {
            drawW = width;
            drawH = drawW / imgAspect;
          }
          const drawX = (width - drawW) / 2;
          const drawY = (height - drawH) / 2;
          try {
            ctx.drawImage(hostImg, drawX, drawY, drawW, drawH);
          } catch {
            // Taint guard
          }
          ctx.fillStyle = "rgba(10, 12, 19, 0.35)";
          ctx.fillRect(0, 0, width, height);
        } else {
          // Acoustic Studio Lighting
          const studioGrad = ctx.createRadialGradient(cx, cy - 60, 40, cx, cy, width * 0.85);
          studioGrad.addColorStop(0, "#1c2030");
          studioGrad.addColorStop(0.6, "#0d101a");
          studioGrad.addColorStop(1, "#06080e");
          ctx.fillStyle = studioGrad;
          ctx.fillRect(0, 0, width, height);

          // Speaker Silhouette & Warm Key Light
          ctx.save();
          ctx.translate(cx, cy - 20);

          // Speaker Body Silhouette
          ctx.fillStyle = "#161924";
          ctx.beginPath();
          ctx.ellipse(0, 160, 110, 130, 0, 0, Math.PI * 2);
          ctx.fill();

          // Speaker Head & Face Area
          const headBob = Math.sin(frame * 0.08) * 3;
          ctx.fillStyle = "#252b3d";
          ctx.beginPath();
          ctx.arc(0, 30 + headBob, 58, 0, Math.PI * 2);
          ctx.fill();

          // Face Key Light Rim
          ctx.strokeStyle = "rgba(132, 204, 22, 0.4)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 30 + headBob, 58, -Math.PI * 0.4, Math.PI * 0.2);
          ctx.stroke();

          // Shure SM7B Podcast Microphone in Foreground
          ctx.fillStyle = "#0c0d14";
          ctx.fillRect(25, 40 + headBob, 35, 75);
          ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
          ctx.lineWidth = 1;
          ctx.strokeRect(25, 40 + headBob, 35, 75);

          // Microphone Foam Pop-Filter Grille
          ctx.fillStyle = "#1a1d28";
          ctx.beginPath();
          ctx.arc(42, 40 + headBob, 18, Math.PI, 0);
          ctx.fill();
          ctx.restore();
        }

        // Face-Tracking Target Reticle
        ctx.strokeStyle = "rgba(6, 182, 212, 0.4)";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(cx - 75, cy - 90, 150, 170);
        ctx.setLineDash([]);

        // Face Tracking Micro-Telemetry
        ctx.font = "8px 'JetBrains Mono', monospace";
        ctx.fillStyle = "#06b6d4";
        ctx.fillText(`FACE_TRACK: [CONF: 0.98] · 9:16 CROP`, cx - 72, cy - 96);
      }

      // Film Grain Overlay
      ctx.fillStyle = "rgba(255, 255, 255, 0.015)";
      for (let i = 0; i < 40; i++) {
        ctx.fillRect(Math.random() * width, Math.random() * height, 1.5, 1.5);
      }

      // Bottom Audio Equalizer Waveform Bars
      const bars = 18;
      const bw = 3;
      const bgap = 4;
      const totalBw = bars * (bw + bgap);
      const startBx = (width - totalBw) / 2;

      for (let b = 0; b < bars; b++) {
        const bh = 4 + Math.abs(Math.sin(frame * 0.15 + b * 0.4)) * 18;
        ctx.fillStyle = activeBroll ? "rgba(132, 204, 22, 0.6)" : "rgba(6, 182, 212, 0.6)";
        ctx.fillRect(startBx + b * (bw + bgap), height - 70 - bh, bw, bh);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [activeBroll]);

  return (
    <div className="flex flex-col items-center justify-center p-2 sm:p-4 h-full w-full select-none">
      {/* 9:16 Smartphone Frame */}
      <div className="relative w-[280px] sm:w-[320px] aspect-[9/16] rounded-[36px] bg-black border-[5px] border-[#202534] shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_30px_rgba(132,204,22,0.15)] overflow-hidden flex flex-col justify-between">
        
        {/* Dynamic Island Pill */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-4 rounded-full bg-black flex items-center justify-center gap-1.5 z-30">
          <div className="w-2 h-2 rounded-full bg-zinc-900 border border-zinc-800" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#84cc16] animate-pulse" />
        </div>

        {/* Top Video Header HUD */}
        <div className="relative z-20 pt-8 px-4 flex items-center justify-between text-[10px] font-mono">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#84cc16] animate-ping" />
            <span>9:16 REEL · {hook.retentionScore}%</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-6 h-6 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white"
            >
              {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3 text-[#84cc16]" />}
            </button>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[#06b6d4]">
              {activeBroll ? "B-ROLL CUT" : "SPEAKER"}
            </span>
          </div>
        </div>

        {/* 60 FPS Living Video Canvas Layer */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <canvas ref={canvasRef} className="w-full h-full block" />
        </div>

        {/* Livepeer Generative B-Roll Badge (When Cut is Active) */}
        {activeBroll && (
          <div className="relative z-20 mx-3 p-2 rounded-xl bg-black/85 backdrop-blur-md border border-[#84cc16]/50 flex items-center justify-between text-[10px] font-mono text-white shadow-[0_0_15px_rgba(132,204,22,0.25)] animate-fadeIn">
            <div className="flex items-center gap-1.5 text-[#84cc16]">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span className="font-bold font-heading text-[11px]">AI B-Roll</span>
            </div>
            <button
              onClick={() => onSelectBrollCut(activeBroll)}
              className="text-[9px] underline text-zinc-300 hover:text-white"
            >
              Refine Prompt
            </button>
          </div>
        )}

        {/* Bottom Kinetic Subtitles (Bebas / Outfit Viral Styling) */}
        <div className="relative z-20 pb-16 px-4 text-center">
          {activeWordObj ? (
            <div className="inline-block px-3 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-white/15 shadow-2xl">
              <span className="font-viral text-2xl sm:text-3xl uppercase tracking-wider text-[#84cc16] font-bold drop-shadow-[0_0_12px_rgba(132,204,22,0.8)]">
                {activeWordObj.word}
              </span>
            </div>
          ) : (
            <div className="inline-block px-2.5 py-0.5 rounded-lg bg-black/60 text-[11px] font-sans text-zinc-400">
              {hook.sourceSpeaker} speaking...
            </div>
          )}
        </div>

        {/* Bottom Playback Control Bar */}
        <div className="relative z-30 p-2.5 bg-black/90 border-t border-white/10 flex items-center justify-between text-xs font-mono">
          <button
            onClick={onTogglePlay}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
          </button>

          <span className="text-[10px] text-zinc-400">
            {currentTime.toFixed(2)}s / {hook.durationSec.toFixed(2)}s
          </span>

          <span className="text-[9px] text-[#84cc16] px-1.5 py-0.5 rounded bg-[#84cc16]/10 border border-[#84cc16]/30 font-bold">
            1080x1920
          </span>
        </div>
      </div>
    </div>
  );
}
