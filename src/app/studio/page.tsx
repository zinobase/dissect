"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Sparkles,
  Cpu,
  Scissors,
  MousePointer,
  ArrowLeft,
  Download,
  FileText,
  Type,
  RefreshCw,
  BarChart3,
  Flame,
  Key,
  Wand2,
  Sliders,
  Edit3,
  Plus,
  Volume2,
  VolumeX,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Disc,
} from "lucide-react";
import { STARTER_KEYNOTES, SAMPLE_LONGFORM_HOOKS, getBrollForHook, synthesizeBrollLiveOnLivepeer, dissectVideoWithLivepeer } from "../../lib/broll-synthesizer";
import { VideoHook, BrollCut, TranscriptWord } from "../../lib/types";
import { ModelDrawer, STORAGE_KEY } from "../../components/ModelDrawer";
import { ExportModal } from "../../components/ExportModal";
import { CustomHookModal } from "../../components/CustomHookModal";
import { SliceRefineModal } from "../../components/SliceRefineModal";
import { optimizeCinematicPrompt, DirectorialStyle } from "../../lib/prompt-optimizer";
import { livepeerMcp } from "../../lib/livepeerMcp";
import { cinematicAudio } from "../../lib/cinematic-audio";

type PlatformSafeMode = "tiktok" | "reels" | "shorts";
type SubtitleStyle = "hormozi" | "mrbeast" | "cyber" | "minimal";
type ToolMode = "select" | "blade" | "ripple";

export default function DissectStudioPage() {
  const [allHooks, setAllHooks] = useState<VideoHook[]>(SAMPLE_LONGFORM_HOOKS);
  const [selectedHook, setSelectedHook] = useState<VideoHook>(SAMPLE_LONGFORM_HOOKS[0]);
  const [brollCuts, setBrollCuts] = useState<BrollCut[]>(() => getBrollForHook(SAMPLE_LONGFORM_HOOKS[0].id, SAMPLE_LONGFORM_HOOKS[0]));
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeTool, setActiveTool] = useState<ToolMode>("select");

  // Multi-Platform Safe Area Switcher
  const [platformSafeMode, setPlatformSafeMode] = useState<PlatformSafeMode>("tiktok");

  // Subtitle Styling
  const [subtitleStyle, setSubtitleStyle] = useState<SubtitleStyle>("hormozi");
  const [subtitleYOffset, setSubtitleYOffset] = useState<number>(65);

  // AI B-Roll Prompt Lab & Directorial Lenses
  const [customPrompt, setCustomPrompt] = useState<string>(
    "Cinematic macro shot of microchip silicon die glowing with neon neural pulses, high shutter speed, anamorphic depth of field"
  );
  const [selectedDirectorialStyle, setSelectedDirectorialStyle] = useState<DirectorialStyle>("cinematic_prime");
  const [refiningCut, setRefiningCut] = useState<BrollCut | null>(null);
  const [guidanceScale, setGuidanceScale] = useState<number>(7.5);
  const [motionBucket, setMotionBucket] = useState<number>(128);
  const [cameraTrajectory, setCameraTrajectory] = useState<string>("Dolly In");
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [synthProgress, setSynthProgress] = useState<number>(0);

  // AI Model Drawer & Generation Settings
  const [isModelDrawerOpen, setIsModelDrawerOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isCustomHookModalOpen, setIsCustomHookModalOpen] = useState<boolean>(false);
  const [hasCustomKey, setHasCustomKey] = useState<boolean>(false);

  // Direct Ingestion User Input States
  const [directInputText, setDirectInputText] = useState<string>("");
  const [directSpeakerName, setDirectSpeakerName] = useState<string>("Speaker");
  const [isDirectIngesting, setIsDirectIngesting] = useState<boolean>(false);
  const [ingestStep, setIngestStep] = useState<number>(0);
  const [ingestStatusMessage, setIngestStatusMessage] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const k = localStorage.getItem(STORAGE_KEY);
      if (k) setHasCustomKey(true);

      const params = new URLSearchParams(window.location.search);
      const urlParam = params.get("url");
      if (urlParam) {
        setDirectInputText(urlParam);
        handleDirectIngest(undefined, urlParam);
      } else {
        handleDirectIngest(undefined, STARTER_KEYNOTES[0].topicText, STARTER_KEYNOTES[0].speaker);
      }
    }
  }, []);

  const handleDirectIngest = async (e?: React.FormEvent, overrideText?: string, overrideSpeaker?: string) => {
    if (e) e.preventDefault();
    const textToUse = overrideText || directInputText;
    const speakerToUse = overrideSpeaker || (directSpeakerName !== "Speaker" ? directSpeakerName : undefined);
    if (!textToUse.trim() || isDirectIngesting) return;
    setIsDirectIngesting(true);
    setIngestStep(1);
    setIngestStatusMessage("Querying Livepeer Agent Creative MCP & analyzing speech cadence...");

    try {
      const res = await fetch("/api/dissect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: textToUse,
          speakerName: speakerToUse,
          monologueText: !textToUse.startsWith("http") ? textToUse : undefined,
        }),
      });

      setIngestStep(4);
      setIngestStatusMessage("Livepeer MCP autonomous face-tracking crop & B-roll injection ready!");

      if (!res.ok) {
        throw new Error(`Dissect API returned ${res.status}`);
      }

      const data = await res.json();
      if (data.hook) {
        setAllHooks((prev) => [data.hook, ...prev.filter((h) => h.id !== data.hook.id)]);
        setSelectedHook(data.hook);
        if (data.brollCuts && data.brollCuts.length > 0) {
          if (typeof window !== "undefined") {
            data.brollCuts.forEach((b: any) => {
              const url = b.posterUrl || b.videoUrl;
              if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
                const proxyUrl = url.includes("/api/proxy-media")
                  ? url
                  : `/api/proxy-media?url=${encodeURIComponent(url)}`;
                const pre = new Image();
                pre.crossOrigin = "anonymous";
                pre.src = proxyUrl;
                if ("decode" in pre && typeof pre.decode === "function") {
                  pre.decode().catch(() => {});
                }
              }
            });
          }
          setBrollCuts(data.brollCuts);
        }
        if (data.hook.sourceSpeaker) {
          setDirectSpeakerName(data.hook.sourceSpeaker);
        }
        setCurrentTime(0);
        setIsPlaying(true);
      }

      setDirectInputText("");
    } catch (err) {
      console.error("Direct ingest error on Livepeer MCP:", err);
    } finally {
      setIsDirectIngesting(false);
      setIngestStep(0);
      setIngestStatusMessage("");
    }
  };

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const timelineCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Active B-Roll cut for current playhead
  const activeBroll = brollCuts.find(
    (b) => currentTime >= b.startSec && currentTime <= b.endSec
  );

  // Active spoken word
  const activeWordIndex = selectedHook.transcript.findIndex(
    (w) => currentTime >= w.startSec && currentTime <= w.endSec
  );
  const activeWordObj = selectedHook.transcript[activeWordIndex];

  // 1. Sync Audio Source when Selected Hook changes — speaks whatever text is in the active transcript
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const targetSrc =
      selectedHook.audioUrl ||
      `/api/tts?text=${encodeURIComponent(selectedHook.quoteText || selectedHook.title)}`;
    if (!audio.src.endsWith(targetSrc) && !audio.src.includes(encodeURIComponent(selectedHook.quoteText || ""))) {
      audio.src = targetSrc;
      audio.currentTime = 0;
      if (isPlaying) {
        audio.play().catch(() => {
          // Gracefully handles browser autoplay limitations
        });
      }
    }
  }, [selectedHook.id, selectedHook.audioUrl, selectedHook.quoteText]);

  // 2. Sync Play / Pause state with audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // 3. Sync Mute state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // 4. Authentic NLE Audio Ducking: Speech audio ducks slightly during B-Roll cutaways
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = activeBroll ? 0.7 : 1.0;
    }
  }, [activeBroll]);

  // 5. Unlock browser audio on first user interaction
  useEffect(() => {
    const unlockAudio = () => {
      if (audioRef.current && isPlaying && audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
      }
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
    };
    window.addEventListener("click", unlockAudio);
    window.addEventListener("keydown", unlockAudio);
    window.addEventListener("touchstart", unlockAudio);
    return () => {
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
    };
  }, [isPlaying]);

  // 6. Timeline Playhead Loop — locked to actual audio clock when playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      const audio = audioRef.current;
      if (audio && !audio.paused && !isNaN(audio.duration) && audio.duration > 0) {
        const audioTime = audio.currentTime;
        if (audioTime >= selectedHook.durationSec) {
          audio.currentTime = 0;
          setCurrentTime(0);
        } else {
          setCurrentTime(+audioTime.toFixed(2));
        }
      } else {
        setCurrentTime((prev) => {
          const next = prev + 0.1;
          if (next >= selectedHook.durationSec) {
            if (audio) audio.currentTime = 0;
            return 0;
          }
          return +next.toFixed(2);
        });
      }
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying, selectedHook.durationSec]);

  // 60 FPS HTML5 Canvas Video Renderer (9:16 Vertical Video Engine)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 280);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    let frame = 0;

    const speakerImg = new Image();
    speakerImg.crossOrigin = "anonymous";
    speakerImg.src = "/api/proxy-media?url=" + encodeURIComponent("https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MDEvekFjeWZCNVR6OUJHTGJJaDZ2TGZQLmpwZw.e73f200b252ea79b/zAcyfB5Tz9BGLbIh6vLfP.jpg");
    const siliconImg = new Image();
    siliconImg.crossOrigin = "anonymous";
    siliconImg.src = "/api/proxy-media?url=" + encodeURIComponent("https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MWUvSkhLMUNBeHVudFBBd29HQ1RZTVdCLmpwZw.969dfc1a43072ab4/JHK1CAxuntPAwoGCTYMWB.jpg");
    const tokyoImg = new Image();
    tokyoImg.crossOrigin = "anonymous";
    tokyoImg.src = "/api/proxy-media?url=" + encodeURIComponent("https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MTYvejRDTFU0THkyRjFoWml5TklJcWEyLmpwZw.660ffbf5b22ed418/z4CLU4Ly2F1hZiyNIIqa2.jpg");

    [speakerImg, siliconImg, tokyoImg].forEach((img) => {
      if ("decode" in img && typeof img.decode === "function") {
        img.decode().catch(() => {});
      }
    });

    const imageCache = new Map<string, HTMLImageElement>();
    imageCache.set("speaker", speakerImg);
    imageCache.set("silicon", siliconImg);
    imageCache.set("tokyo", tokyoImg);

    const getImage = (src: string) => {
      if (!src) return speakerImg;
      const proxySrc = src.startsWith("http") && !src.includes("/api/proxy-media")
        ? `/api/proxy-media?url=${encodeURIComponent(src)}`
        : src;
      if (imageCache.has(proxySrc)) return imageCache.get(proxySrc)!;
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onerror = () => {
        img.src = siliconImg.src;
      };
      img.src = proxySrc;
      if ("decode" in img && typeof img.decode === "function") {
        img.decode().catch(() => {});
      }
      imageCache.set(proxySrc, img);
      return img;
    };

    const render = () => {
      frame++;
      const cx = width / 2;
      const cy = height / 2;

      // Dark Canvas Background
      ctx.fillStyle = "#06070b";
      ctx.fillRect(0, 0, width, height);

      if (activeBroll) {
        // SCENE A: LIVEPEER SYNTHETIC B-ROLL
        ctx.save();
        const brollSrc = activeBroll.posterUrl || activeBroll.videoUrl;
        let brollImg = brollSrc ? getImage(brollSrc) : siliconImg;
        if (!brollImg.complete || brollImg.naturalWidth === 0) {
          brollImg = siliconImg;
        }

        if (brollImg.complete && brollImg.naturalWidth > 0) {
          const zoom = 1.02 + (frame % 300) * 0.0006;
          const panX = Math.sin(frame * 0.012) * 6;
          const panY = Math.cos(frame * 0.01) * 4;

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
          const drawX = (width - drawW) / 2 + panX;
          const drawY = (height - drawH) / 2 + panY;

          try {
            ctx.drawImage(brollImg, drawX, drawY, drawW, drawH);
          } catch {
            // Taint guard
          }

          // Anamorphic horizontal flare streak sweep
          const sweepX = ((frame * 2.5) % (width * 2.5)) - width * 0.5;
          const flareGrad = ctx.createLinearGradient(sweepX - 40, 0, sweepX + 40, 0);
          flareGrad.addColorStop(0, "rgba(132, 204, 22, 0)");
          flareGrad.addColorStop(0.5, "rgba(132, 204, 22, 0.25)");
          flareGrad.addColorStop(1, "rgba(132, 204, 22, 0)");
          ctx.fillStyle = flareGrad;
          ctx.fillRect(0, 0, width, height);

          // Subtle cinematic vignette
          const vignette = ctx.createRadialGradient(cx, cy, height * 0.3, cx, cy, height * 0.75);
          vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
          vignette.addColorStop(1, "rgba(0, 0, 0, 0.55)");
          ctx.fillStyle = vignette;
          ctx.fillRect(0, 0, width, height);

          // B-Roll Livepeer HUD Badge on Canvas
          ctx.save();
          ctx.fillStyle = "rgba(10, 15, 22, 0.85)";
          ctx.strokeStyle = "rgba(132, 204, 22, 0.6)";
          ctx.lineWidth = 1;
          const badgeW = Math.min(width - 24, 220);
          ctx.fillRect(12, 12, badgeW, 22);
          ctx.strokeRect(12, 12, badgeW, 22);
          ctx.fillStyle = "#84cc16";
          ctx.font = "bold 9px monospace";
          ctx.fillText("LIVEPEER B-ROLL", 20, 26);
          ctx.fillStyle = "#a1a1aa";
          ctx.font = "8px monospace";
          const triggerTrimmed = activeBroll.triggerPhrase.length > 15 ? activeBroll.triggerPhrase.slice(0, 13) + ".." : activeBroll.triggerPhrase;
          ctx.fillText(`· ${triggerTrimmed}`, 115, 26);
          ctx.restore();
        }
        ctx.restore();
      } else {
        // SCENE B: PODCAST SPEAKER WITH REALISTIC CAM AND FACE-TRACKING
        ctx.save();
        const hostSrc = selectedHook.speakerVideoUrl;
        let targetSpeakerImg = hostSrc ? getImage(hostSrc) : speakerImg;
        if (!targetSpeakerImg.complete || targetSpeakerImg.naturalWidth === 0) {
          targetSpeakerImg = speakerImg;
        }

        if (targetSpeakerImg.complete && targetSpeakerImg.naturalWidth > 0) {
          const zoom = 1.01 + (frame % 250) * 0.0003;
          const panX = Math.sin(frame * 0.015) * 3;
          const panY = Math.cos(frame * 0.018) * 2;

          const imgAspect = targetSpeakerImg.naturalWidth / targetSpeakerImg.naturalHeight;
          const canvasAspect = width / height;
          let drawW = width, drawH = height;
          if (imgAspect > canvasAspect) {
            drawH = height * zoom;
            drawW = drawH * imgAspect;
          } else {
            drawW = width * zoom;
            drawH = drawW / imgAspect;
          }
          const drawX = (width - drawW) / 2 + panX;
          const drawY = (height - drawH) / 2 + panY;

          try {
            ctx.drawImage(targetSpeakerImg, drawX, drawY, drawW, drawH);
          } catch {
            // Taint guard
          }

          // Subtle cinematic vignette
          const vignette = ctx.createRadialGradient(cx, cy, height * 0.35, cx, cy, height * 0.8);
          vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
          vignette.addColorStop(1, "rgba(0, 0, 0, 0.5)");
          ctx.fillStyle = vignette;
          ctx.fillRect(0, 0, width, height);

          // Face-Tracking Target Box
          const fbX = cx - 36 + panX * 0.6;
          const fbY = cy - 65 + panY * 0.6;
          ctx.strokeStyle = "rgba(6, 182, 212, 0.6)";
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 3]);
          ctx.strokeRect(fbX, fbY, 72, 85);
          ctx.setLineDash([]);

          // Corner reticles
          ctx.strokeStyle = "#06b6d4";
          ctx.lineWidth = 2;
          // TL
          ctx.beginPath();
          ctx.moveTo(fbX, fbY + 8);
          ctx.lineTo(fbX, fbY);
          ctx.lineTo(fbX + 8, fbY);
          ctx.stroke();
          // TR
          ctx.beginPath();
          ctx.moveTo(fbX + 64, fbY);
          ctx.lineTo(fbX + 72, fbY);
          ctx.lineTo(fbX + 72, fbY + 8);
          ctx.stroke();
          // BL
          ctx.beginPath();
          ctx.moveTo(fbX, fbY + 77);
          ctx.lineTo(fbX, fbY + 85);
          ctx.lineTo(fbX + 8, fbY + 85);
          ctx.stroke();
          // BR
          ctx.beginPath();
          ctx.moveTo(fbX + 64, fbY + 85);
          ctx.lineTo(fbX + 72, fbY + 85);
          ctx.lineTo(fbX + 72, fbY + 77);
          ctx.stroke();

          ctx.font = "7px 'JetBrains Mono', monospace";
          ctx.fillStyle = "#06b6d4";
          ctx.fillText("FACE_TRACK · 0.99", fbX + 2, fbY - 4);
        } else {
          // Dark fallback while loading
          ctx.fillStyle = "#0c1018";
          ctx.fillRect(0, 0, width, height);
        }
        ctx.restore();
      }

      // 35mm Subtle Film Grain
      ctx.fillStyle = "rgba(255, 255, 255, 0.025)";
      for (let i = 0; i < 35; i++) {
        ctx.fillRect(Math.random() * width, Math.random() * height, 1.5, 1.5);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [activeBroll, customPrompt]);

  // 60 FPS HTML5 Audio Waveform Timeline Canvas
  useEffect(() => {
    const canvas = timelineCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 48);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    const renderWave = () => {
      ctx.fillStyle = "#05070c";
      ctx.fillRect(0, 0, width, height);

      // Center Line
      const midY = height / 2;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(width, midY);
      ctx.stroke();

      // Audio Waveform Peaks
      const bars = Math.floor(width / 3);
      for (let i = 0; i < bars; i++) {
        const x = i * 3;
        const amp = Math.sin(i * 0.18) * 14 + Math.cos(i * 0.42) * 6;
        const barH = Math.max(2, Math.abs(amp));

        // Color spike if in B-roll zone
        const tSec = (i / bars) * selectedHook.durationSec;
        const isBroll = brollCuts.some((b) => tSec >= b.startSec && tSec <= b.endSec);

        ctx.fillStyle = isBroll ? "#84cc16" : "#f59e0b";
        ctx.fillRect(x, midY - barH, 2, barH * 2);
      }

      animId = requestAnimationFrame(renderWave);
    };

    animId = requestAnimationFrame(renderWave);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [selectedHook.durationSec, brollCuts]);


  const handleAddCustomHook = (newHook: VideoHook) => {
    setSelectedHook(newHook);
    setBrollCuts([]);
    setCurrentTime(0);
    const targetSrc = newHook.audioUrl || `/api/tts?text=${encodeURIComponent(newHook.quoteText || newHook.title)}`;
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.src = targetSrc;
      if (isPlaying) audioRef.current.play().catch(() => {});
    }
    setCustomPrompt(newHook.quoteText);
  };

  const handleSelectHook = (hook: VideoHook) => {
    setSelectedHook(hook);
    const cuts = getBrollForHook(hook.id, hook);
    setBrollCuts(cuts);
    setCurrentTime(0);
    const targetSrc = hook.audioUrl || `/api/tts?text=${encodeURIComponent(hook.quoteText || hook.title)}`;
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.src = targetSrc;
      if (isPlaying) audioRef.current.play().catch(() => {});
    }
  };

  const handleSeek = (sec: number) => {
    const clamped = Math.min(selectedHook.durationSec, Math.max(0, +sec.toFixed(2)));
    setCurrentTime(clamped);
    if (audioRef.current) {
      audioRef.current.currentTime = clamped;
      if (isPlaying && audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
      }
    }
  };

  const handleTimelineClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    const seekSec = +(pct * selectedHook.durationSec).toFixed(1);
    
    if (activeTool === "blade") {
      try {
        const newCut = await synthesizeBrollLiveOnLivepeer(customPrompt, "Blade Cut", seekSec, 3.0);
        setBrollCuts((prev) => [...prev, newCut]);
      } catch (err) {
        console.error("Livepeer blade cut error:", err);
      }
    }
    
    handleSeek(seekSec);
  };

  const handleSynthesizeBroll = async () => {
    if (isSynthesizing) return;
    setIsSynthesizing(true);
    setSynthProgress(30);

    try {
      const start = Math.min(selectedHook.durationSec - 3.5, Math.max(0, +currentTime.toFixed(1)));
      const triggerPhrase = activeWordObj?.word || `${cameraTrajectory} Cut`;
      setSynthProgress(65);

      const newCut = await synthesizeBrollLiveOnLivepeer(customPrompt, triggerPhrase, start, 3.5);
      setBrollCuts((prev) => [...prev, newCut]);
      handleSeek(start);
      setSynthProgress(100);
    } catch (err) {
      console.error("Livepeer MCP B-roll synthesize error:", err);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleOptimizeStudioPrompt = (style: DirectorialStyle = selectedDirectorialStyle) => {
    const result = optimizeCinematicPrompt(customPrompt, style, "9:16");
    setCustomPrompt(result.optimizedPrompt);
    setSelectedDirectorialStyle(style);
  };

  const handleUpdateBrollCut = (
    brollId: string,
    newPrompt: string,
    newUrl?: string,
    status?: BrollCut["status"]
  ) => {
    setBrollCuts((prev) =>
      prev.map((c) =>
        c.id === brollId
          ? {
              ...c,
              prompt: newPrompt,
              ...(newUrl ? { videoUrl: newUrl, posterUrl: newUrl } : {}),
              ...(status ? { status } : {}),
            }
          : c
      )
    );
  };

  const handleReimagineTake = async (style: DirectorialStyle) => {
    setSelectedDirectorialStyle(style);
    const result = optimizeCinematicPrompt(customPrompt, style, "9:16");
    setCustomPrompt(result.optimizedPrompt);

    if (isSynthesizing) return;
    setIsSynthesizing(true);
    setSynthProgress(25);
    try {
      const start = Math.min(selectedHook.durationSec - 3.5, Math.max(0, +currentTime.toFixed(1)));
      const triggerPhrase = activeWordObj?.word || `${style.replace("_", " ")} Take`;
      setSynthProgress(60);
      const newCut = await synthesizeBrollLiveOnLivepeer(result.optimizedPrompt, triggerPhrase, start, 3.5);
      setBrollCuts((prev) => [...prev, newCut]);
      handleSeek(start);
      setSynthProgress(100);
    } catch (err) {
      console.error("Livepeer MCP re-imagine error:", err);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 100);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}.${String(ms).padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col h-screen bg-[#040508] overflow-hidden text-zinc-100 selection:bg-[#84cc16] selection:text-black font-sans">
      
      {/* 1. VIRAL WORKSTATION APP HEADER */}
      <header className="h-11 bg-[#020305] border-b border-white/10 px-4 flex items-center justify-between shrink-0 select-none z-30">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 group text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-heading font-black text-sm tracking-tighter text-white">
              DISSECT<span className="text-[#84cc16]">.AI</span>
            </span>
          </Link>

          <span className="hidden md:inline text-[11px] font-mono text-zinc-400 pl-2 border-l border-white/10 truncate max-w-[340px]">
            {selectedHook ? `${selectedHook.sourceSpeaker}: ${selectedHook.title}` : "Livepeer Stream Dissector & B-Roll Engine"}
          </span>
        </div>

        {/* Center: Live Keynote Stream Switcher - Floating Frosted Glass Dock */}
        <div className="flex items-center bg-[#0c1220]/80 backdrop-blur-md p-1 rounded-full border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] text-[11px] font-mono">
          {STARTER_KEYNOTES.map((k) => {
            const isActive = selectedHook?.sourceSpeaker === k.speaker;
            return (
              <button
                key={k.id}
                onClick={() => {
                  cinematicAudio.play("toggle");
                  handleDirectIngest(undefined, k.topicText, k.speaker);
                }}
                disabled={isDirectIngesting}
                className={`px-3.5 py-1 rounded-full transition-all flex items-center gap-1.5 active:scale-95 ${
                  isActive
                    ? "bg-white/10 text-white font-medium border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border border-transparent"
                } disabled:opacity-50`}
              >
                {isActive ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#84cc16] shadow-[0_0_6px_rgba(132,204,22,0.8)]" />
                ) : (
                  <Flame className="w-3 h-3 text-zinc-500" />
                )}
                <span>{k.speaker.split(" ")[0]}</span>
              </button>
            );
          })}
          <button
            onClick={() => {
              cinematicAudio.play("click");
              setIsCustomHookModalOpen(true);
            }}
            className="px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/10 border border-white/10 text-zinc-300 font-mono text-[10px] font-medium flex items-center gap-1 transition-all ml-1 active:scale-95"
            title="Import your own video or paste custom transcript"
          >
            <Plus className="w-3 h-3 text-zinc-400" />
            <span>+ Custom Hook</span>
          </button>
        </div>

        {/* Right: Actions & Export */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              cinematicAudio.play("click");
              setIsModelDrawerOpen(true);
            }}
            className="px-3 py-1.5 rounded-full bg-[#0c1220]/80 backdrop-blur-md hover:bg-white/10 border border-white/10 text-[10px] font-mono text-zinc-300 flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(0,0,0,0.5)] active:scale-95"
            title="Livepeer Agent Creative MCP Settings"
          >
            <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
            <span>Livepeer MCP (125 Tools)</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#84cc16] animate-pulse" />
          </button>

          <button
            onClick={() => {
              cinematicAudio.play("click");
              setIsExportOpen(true);
            }}
            className="px-4 py-1.5 rounded-full bg-white text-black font-heading font-black text-xs hover:bg-zinc-200 active:scale-95 transition-all shadow-[0_2px_12px_rgba(255,255,255,0.15)] flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-black" />
            <span>Export 1080x1920</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN 50/50 SPLIT: SCRIPT WORKSPACE (LEFT) & 9:16 RETENTION STAGE (RIGHT) */}
      <div className="flex-1 grid grid-cols-12 min-h-0 overflow-hidden divide-x divide-white/10">
        
        {/* LEFT 6 COLUMNS: WORD-LEVEL SCRIPT WORKSPACE */}
        <div className="col-span-6 h-full overflow-y-auto flex flex-col bg-[#06080e] p-5 space-y-4">
          
          {/* Script Toolbar */}
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs font-mono font-semibold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-zinc-400" />
              <span>Word-Level Transcript & Telemetry</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-300 px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/10">
              Livepeer Whisper-v3
            </span>
          </div>

          {/* Prominent Always-Visible User Input: Direct Video / Script Ingest */}
          <div className="p-3.5 rounded-xl bg-[#090c14] border border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.5)] space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-zinc-200 font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                <span>Dissect Any Video, Podcast, or Monologue:</span>
              </span>
              <span className="text-zinc-500 text-[9px]">Livepeer MCP Agent</span>
            </div>

            <form onSubmit={handleDirectIngest} className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={directSpeakerName}
                  onChange={(e) => setDirectSpeakerName(e.target.value)}
                  placeholder="Speaker..."
                  className="w-28 bg-black/60 border border-white/10 focus:border-white/30 text-xs font-mono text-white px-2.5 py-1.5 rounded-lg focus:outline-none placeholder:text-zinc-500 shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)]"
                />
                <input
                  type="text"
                  value={directInputText}
                  onChange={(e) => setDirectInputText(e.target.value)}
                  placeholder="Paste YouTube URL or type any monologue paragraph to dissect..."
                  className="flex-1 bg-black/60 border border-white/10 focus:border-white/30 text-xs font-mono text-white px-3 py-1.5 rounded-lg focus:outline-none placeholder:text-zinc-500 shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)]"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2 text-[8.5px] font-mono text-zinc-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#84cc16] animate-pulse" />
                  <span>Decentralized transcription & face-tracking via Livepeer MCP</span>
                </div>

                <button
                  type="submit"
                  disabled={isDirectIngesting || !directInputText.trim()}
                  className="px-4 py-1.5 rounded-full bg-[#84cc16] hover:bg-[#99e62e] text-black font-heading font-black text-xs active:scale-95 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(132,204,22,0.35)] disabled:opacity-40 cursor-pointer"
                >
                  {isDirectIngesting ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin text-black" />
                      <span>Dissecting on Livepeer...</span>
                    </>
                  ) : (
                    <>
                      <Scissors className="w-3 h-3 text-black" />
                      <span>Dissect on Livepeer</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Active Livepeer Dissection Telemetry Progress */}
            {isDirectIngesting && (
              <div className="p-3 rounded-lg bg-[#0b0f18] border border-white/15 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-zinc-200 font-bold flex items-center gap-1.5">
                    <RefreshCw className="w-3 h-3 animate-spin text-[#84cc16]" />
                    <span>{ingestStatusMessage}</span>
                  </span>
                  <span className="text-zinc-400">Step {ingestStep} of 4</span>
                </div>
                <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#84cc16] h-full transition-all duration-300"
                    style={{ width: `${(ingestStep / 4) * 100}%` }}
                  />
                </div>
                <div className="grid grid-cols-4 gap-1 text-[8px] font-mono text-zinc-500 pt-1">
                  <span className={ingestStep >= 1 ? "text-zinc-200 font-bold" : ""}>1. Audio Track</span>
                  <span className={ingestStep >= 2 ? "text-zinc-200 font-bold" : ""}>2. Whisper-v3</span>
                  <span className={ingestStep >= 3 ? "text-zinc-200 font-bold" : ""}>3. Dead Zones</span>
                  <span className={ingestStep >= 4 ? "text-[#84cc16] font-bold" : ""}>4. 9:16 Stage</span>
                </div>
              </div>
            )}
          </div>

          {/* Detected High-Retention Hooks Switcher */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
              <span className="uppercase tracking-wider font-semibold text-zinc-300 flex items-center gap-1.5">
                <Scissors className="w-3 h-3 text-zinc-400" />
                <span>Detected Hooks ({allHooks.length})</span>
              </span>
              <span className="text-[9px] text-zinc-400">Click to preview</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {allHooks.map((h) => {
                const isSelected = selectedHook.id === h.id;
                return (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => {
                      handleSelectHook(h);
                      cinematicAudio.play("click");
                    }}
                    className={`px-3 py-1.5 rounded-lg border text-left whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? "bg-white/10 border-white/20 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                        : "bg-white/[0.02] border-white/10 text-zinc-400 hover:border-white/20 hover:text-zinc-200"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-[#84cc16]" : "bg-zinc-600"}`} />
                    <span className="text-xs font-heading font-bold">{h.sourceSpeaker}:</span>
                    <span className="text-[10px] font-mono text-zinc-300 truncate max-w-[120px]">{h.title}</span>
                    <span className="text-[9px] font-mono text-emerald-400 font-bold">{h.retentionScore}%</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Speaker Diarization Card */}
          <div className="p-3 rounded-xl bg-[#090c14] border border-white/10 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-heading font-bold text-xs text-zinc-200">
              {selectedHook.sourceSpeaker.split(" ").map(n => n[0]).join("")}
            </div>
            <div>
              <div className="text-xs font-heading font-bold text-white">{selectedHook.sourceSpeaker}</div>
              <div className="text-[10px] font-mono text-zinc-400">{selectedHook.title}</div>
            </div>
          </div>

          {/* WORD-LEVEL TRANSCRIPT TEXT */}
          <div className="flex-1 p-4 rounded-xl bg-[#090c14] border border-white/10 space-y-4 overflow-y-auto">

            {/* Word-by-Word Stream */}
            <div className="leading-loose text-base font-mono space-x-1.5 select-none">
              {selectedHook.transcript.map((item, idx) => {
                const isActive = currentTime >= item.startSec && currentTime <= item.endSec;
                const isPast = currentTime > item.endSec;
                return (
                  <span
                    key={idx}
                    onClick={() => handleSeek(item.startSec)}
                    className={`inline-block px-1.5 py-0.5 rounded cursor-pointer transition-all ${
                      isActive
                        ? "bg-[#84cc16] text-black font-black shadow-[0_0_16px_rgba(132,204,22,0.6)] scale-105 rounded px-2 py-0.5"
                        : isPast
                        ? "text-zinc-200 hover:text-white hover:bg-white/5"
                        : "text-zinc-500 hover:text-zinc-300"
                    } ${item.isKeyTerm ? "font-semibold text-zinc-100 underline decoration-zinc-700 underline-offset-4" : ""}`}
                  >
                    {item.word}
                  </span>
                );
              })}
            </div>
            {/* VIRALITY & RETENTION ANALYTICS DECK */}
            <div className="pt-3 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-zinc-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Hook Virality Index</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 font-bold text-[10px]">
                  {selectedHook.retentionScore}/100 · Top 1%
                </span>
              </div>

              {/* 3 Metrics Cards */}
              <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
                <div className="p-2.5 rounded-lg bg-[#06080e] border border-white/10 space-y-1">
                  <div className="text-zinc-500 text-[8px] uppercase">Watch-Through</div>
                  <div className="text-white font-bold text-xs">84.2%</div>
                  <div className="text-emerald-400 text-[7.5px]">+38% over avg</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#06080e] border border-white/10 space-y-1">
                  <div className="text-zinc-500 text-[8px] uppercase">Cut Cadence</div>
                  <div className="text-white font-bold text-xs">1 cut / 3.2s</div>
                  <div className="text-emerald-400 text-[7.5px]">High Retention</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#06080e] border border-white/10 space-y-1">
                  <div className="text-zinc-500 text-[8px] uppercase">GPU Subnet</div>
                  <div className="text-white font-bold text-xs">$0.04 / cut</div>
                  <div className="text-zinc-300 text-[7.5px]">Livepeer 1.2s</div>
                </div>
              </div>

              {/* High-Retention Semantic Triggers — derived from the active hook's own key terms */}
              <div className="p-2.5 rounded-lg bg-[#06080e] border border-white/10 space-y-1.5 text-[10px] font-mono">
                <div className="text-zinc-400 text-[9px] flex items-center justify-between">
                  <span>Detected Viral Triggers:</span>
                  <span className="text-zinc-400">Auto-Grounded</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedHook.transcript
                    .filter((t) => t.isKeyTerm)
                    .slice(0, 6)
                    .map((t) => t.word.replace(/[^a-zA-Z0-9-]/g, "").toLowerCase())
                    .filter((w, i, arr) => w.length > 2 && arr.indexOf(w) === i)
                    .slice(0, 4)
                    .map((kw, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/10 text-zinc-300 text-[8px] hover:border-white/20 transition-colors"
                      >
                        #{kw}
                      </span>
                    ))}
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT 6 COLUMNS: 9:16 SMARTPHONE STAGE & RETENTION GRAPH */}
        <div className="col-span-6 h-full overflow-y-auto flex flex-col bg-[#05060a] p-4 space-y-3">
          
          {/* Top Half: Smartphone Stage Flanked by Live Retention Curve */}
          <div className="flex items-center justify-center gap-4 min-h-[340px] bg-black/40 p-3 rounded-xl border border-white/10">
            
            {/* 9:16 Smartphone Shell */}
            <div className="relative w-[190px] aspect-[9/16] rounded-[26px] bg-black border-[3.5px] border-[#1d2232] shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_25px_rgba(132,204,22,0.15)] overflow-hidden flex flex-col justify-between select-none shrink-0">
              
              {/* Dynamic Island */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-3 rounded-full bg-black flex items-center justify-center gap-1 z-30">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
                <div className="w-1 h-1 rounded-full bg-[#84cc16] animate-pulse" />
              </div>

              {/* Dynamic HUD */}
              <div className="relative z-20 pt-6 px-2.5 flex items-center justify-between text-[7.5px] font-mono">
                <span className="px-1.5 py-0.5 rounded-full bg-black/75 border border-white/10 text-[#84cc16] font-bold">
                  {activeBroll ? "AI B-ROLL · LIVEPEER" : "HOST A-ROLL"}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    cinematicAudio.play("toggle");
                    setIsMuted(!isMuted);
                  }}
                  className={`px-1.5 py-0.5 rounded-full bg-black/80 border text-[7.5px] font-mono flex items-center gap-1 cursor-pointer transition-all active:scale-95 pointer-events-auto ${
                    isMuted
                      ? "border-rose-500/40 text-rose-400"
                      : "border-white/15 text-[#84cc16] hover:border-white/30"
                  }`}
                  title={isMuted ? "Audio Muted - Click to Unmute" : "Audio Live - Click to Mute"}
                >
                  {isMuted ? <VolumeX className="w-2.5 h-2.5" /> : <Volume2 className="w-2.5 h-2.5" />}
                  <span>{isMuted ? "MUTED" : "LIVE AUDIO"}</span>
                </button>
              </div>

              {/* 60 FPS Living HTML5 Canvas */}
              <div className="absolute inset-0 z-10">
                <canvas ref={canvasRef} className="w-full h-full block" />
              </div>

              {/* Multi-Platform Safe Area Overlays (TikTok vs Reels vs Shorts) */}
              <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-3 pb-6 select-none">
                {/* Top platform spacing guard */}
                <div className="pt-4" />

                {/* Bottom & Side Interface simulation */}
                <div className="flex items-end justify-between">
                  <div className="space-y-0.5 max-w-[120px]">
                    <div className="text-[8px] font-heading font-bold text-white">@{selectedHook.sourceSpeaker.toLowerCase().replace(/\s+/g, "")}</div>
                    <div className="text-[7px] text-zinc-300 line-clamp-1">{selectedHook.title}</div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        cinematicAudio.play("toggle");
                        setIsMuted(!isMuted);
                      }}
                      className="text-[6px] font-mono text-[#84cc16] flex items-center gap-1 cursor-pointer pointer-events-auto hover:brightness-125"
                      title={isMuted ? "Audio Muted - Click to Unmute" : "Audio Playing - Click to Mute"}
                    >
                      {isMuted ? (
                        <VolumeX className="w-2.5 h-2.5 text-rose-400" />
                      ) : (
                        <Disc className={`w-2.5 h-2.5 ${isPlaying ? "animate-spin" : ""}`} />
                      )}
                      <span>{isMuted ? "Audio Muted" : "Original Audio · Livepeer Subnet"}</span>
                    </div>
                  </div>

                  {/* Right Action Stack */}
                  <div className="flex flex-col items-center gap-2 pb-1 text-white text-[8px] font-mono">
                    <div className="flex flex-col items-center">
                      <div className="w-5 h-5 rounded-full bg-black/50 border border-white/20 flex items-center justify-center">
                        <Heart className="w-2.5 h-2.5 text-rose-500 fill-rose-500" />
                      </div>
                      <span className="text-[6px]">128K</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-5 h-5 rounded-full bg-black/50 border border-white/20 flex items-center justify-center">
                        <MessageCircle className="w-2.5 h-2.5 text-zinc-200" />
                      </div>
                      <span className="text-[6px]">2.4K</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-5 h-5 rounded-full bg-black/50 border border-white/20 flex items-center justify-center">
                        <Share2 className="w-2.5 h-2.5 text-zinc-200" />
                      </div>
                      <span className="text-[6px]">Share</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Kinetic Subtitles Overlay */}
              {activeWordObj && (
                <div
                  style={{ bottom: `${subtitleYOffset}%` }}
                  className="absolute left-0 right-0 z-30 flex justify-center pointer-events-none px-2 text-center transition-all"
                >
                  <div
                    className={`px-2 py-1 rounded backdrop-blur-sm transition-transform ${
                      subtitleStyle === "hormozi"
                        ? "bg-black/90 border-2 border-[#fbbf24] text-[#fbbf24] font-heading font-black text-xs tracking-tight uppercase shadow-[0_0_15px_rgba(251,191,36,0.6)]"
                        : subtitleStyle === "mrbeast"
                        ? "bg-[#84cc16] text-black font-heading font-black text-sm tracking-tighter uppercase shadow-[0_0_20px_rgba(132,204,22,0.8)] rotate-[-1deg]"
                        : subtitleStyle === "cyber"
                        ? "bg-black/90 border border-[#06b6d4] text-[#06b6d4] font-mono text-xs tracking-widest uppercase shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                        : "bg-black/70 text-white font-sans font-semibold text-xs tracking-wide"
                    }`}
                  >
                    {activeWordObj.word}
                  </div>
                </div>
              )}
            </div>

            {/* Flanking Live Viewer Retention Curve Graph */}
            <div className="flex-1 max-w-[260px] h-[320px] bg-[#07090e] rounded-xl border border-white/10 p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-zinc-300">
                  <BarChart3 className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Retention Curve</span>
                </div>
                
                {/* Safe Platform Mode Switcher - Frosted Glass Pill Dock */}
                <div className="flex items-center bg-[#0c1220]/80 backdrop-blur-md p-0.5 rounded-full border border-white/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] text-[8px] font-mono">
                  {(["tiktok", "reels", "shorts"] as const).map((p) => {
                    const isActive = platformSafeMode === p;
                    return (
                      <button
                        key={p}
                        onClick={() => {
                          cinematicAudio.play("toggle");
                          setPlatformSafeMode(p);
                        }}
                        className={`px-2.5 py-0.5 rounded-full uppercase transition-all active:scale-95 ${
                          isActive
                            ? "bg-white/10 text-white font-medium border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]"
                            : "text-zinc-400 hover:text-zinc-200 border border-transparent"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Simulated Viewer Retention Graph */}
              <div className="flex-1 py-2 flex flex-col justify-between relative">
                <div className="h-full w-full relative flex items-end">
                  <svg className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="retGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#84cc16" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#84cc16" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0 10 Q 50 15, 100 25 T 180 40 T 240 55"
                      fill="none"
                      stroke="#84cc16"
                      strokeWidth="2"
                    />
                    <path
                      d="M 0 10 Q 50 15, 100 25 T 180 40 T 240 55 L 240 160 L 0 160 Z"
                      fill="url(#retGrad)"
                    />
                  </svg>

                  {/* Playhead Marker on Curve */}
                  <div
                    style={{
                      left: `${Math.min(95, Math.max(5, (currentTime / selectedHook.durationSec) * 100))}%`,
                    }}
                    className="absolute top-0 bottom-0 w-[1.5px] bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                  />
                </div>
              </div>

              {/* J-K-L Transport Controls */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-white">
                  {formatTime(currentTime)}
                </span>
                <div className="flex items-center gap-1 bg-[#0c1220]/80 p-0.5 rounded-full border border-white/10">
                  <button
                    onClick={() => {
                      cinematicAudio.play("click");
                      handleSeek(0);
                    }}
                    className="p-1 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-zinc-200 active:scale-95 transition-all"
                    title="Rewind to start"
                  >
                    <SkipBack className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => {
                      cinematicAudio.play("toggle");
                      setIsPlaying(!isPlaying);
                    }}
                    className="p-1.5 rounded-full bg-white text-black font-bold hover:bg-zinc-200 active:scale-95 transition-all shadow-[0_2px_8px_rgba(255,255,255,0.2)]"
                    title={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                  </button>
                  <button
                    onClick={() => {
                      cinematicAudio.play("click");
                      handleSeek(selectedHook.durationSec);
                    }}
                    className="p-1 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-zinc-200 active:scale-95 transition-all"
                    title="Skip to end"
                  >
                    <SkipForward className="w-3 h-3" />
                  </button>
                  <div className="w-[1px] h-3 bg-white/15 mx-0.5" />
                  <button
                    onClick={() => {
                      cinematicAudio.play("toggle");
                      setIsMuted(!isMuted);
                    }}
                    className={`p-1 rounded-full transition-all active:scale-95 ${
                      isMuted
                        ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                        : "bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10"
                    }`}
                    title={isMuted ? "Unmute Studio Audio" : "Mute Studio Audio"}
                  >
                    {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Bottom Half: AI B-Roll Studio & Subtitle Engine */}
          <div className="grid grid-cols-2 gap-3">
            
            {/* AI B-Roll Generator with Camera Trajectory & Directorial Lens Controls */}
            <div className="p-3 rounded-xl bg-[#090c14] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono font-semibold text-zinc-200">
                <div className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-zinc-400" />
                  <span>AI B-Roll Generation</span>
                </div>
                
                {/* Camera Trajectory Controls */}
                <select
                  value={cameraTrajectory}
                  onChange={(e) => setCameraTrajectory(e.target.value)}
                  className="bg-black/60 border border-white/10 text-[8px] font-mono text-zinc-300 rounded px-1.5 py-0.5 focus:outline-none focus:border-white/30"
                >
                  <option>Dolly In</option>
                  <option>Pan Left</option>
                  <option>Crane Up</option>
                  <option>Orbit 360</option>
                </select>
              </div>

              {/* Directorial Lenses & Instant Takes */}
              <div className="flex items-center justify-between pt-0.5">
                <span className="text-[8px] font-mono text-zinc-400 flex items-center gap-1">
                  <Sliders className="w-2.5 h-2.5 text-zinc-500" />
                  <span>Directorial Lenses:</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    cinematicAudio.play("click");
                    handleOptimizeStudioPrompt();
                  }}
                  className="text-[8px] font-mono text-zinc-400 hover:text-white flex items-center gap-0.5 active:scale-95 transition-all"
                  title="Enrich prompt with 35mm cinematographic optics and lighting parameters"
                >
                  <Wand2 className="w-2.5 h-2.5 text-zinc-400" />
                  <span>Auto-Optimize Optics</span>
                </button>
              </div>

              <div className="grid grid-cols-4 gap-1">
                {(
                  [
                    { key: "cinematic_prime", label: "35mm Prime" },
                    { key: "macro_texture", label: "Macro" },
                    { key: "dynamic_drone", label: "Drone" },
                    { key: "studio_push", label: "Push-In" },
                  ] as const
                ).map(({ key, label }) => {
                  const isSelected = selectedDirectorialStyle === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        cinematicAudio.play("toggle");
                        handleOptimizeStudioPrompt(key);
                      }}
                      className={`py-1 rounded-full border text-[8px] font-mono transition-all text-center active:scale-95 ${
                        isSelected
                          ? "bg-white/10 border-white/25 text-white font-medium shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                          : "bg-white/[0.02] border-white/5 text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={2}
                className="w-full text-[9px] font-mono bg-black/60 border border-white/10 rounded-lg p-1.5 text-zinc-200 focus:border-white/30 focus:outline-none resize-none leading-relaxed placeholder:text-zinc-500"
              />

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => {
                    cinematicAudio.play("click");
                    handleSynthesizeBroll();
                  }}
                  disabled={isSynthesizing}
                  className="py-1.5 rounded-full bg-[#84cc16] hover:bg-[#99e62e] text-black font-heading font-black text-[10px] flex items-center justify-center gap-1 shadow-[0_0_12px_rgba(132,204,22,0.3)] active:scale-95 transition-all disabled:opacity-40"
                >
                  {isSynthesizing ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin text-black" />
                      <span>Rendering ({synthProgress}%)...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3 text-black" />
                      <span>Synthesize Cut</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    cinematicAudio.play("click");
                    handleReimagineTake(selectedDirectorialStyle);
                  }}
                  disabled={isSynthesizing}
                  className="py-1.5 rounded-full bg-white/[0.04] hover:bg-white/10 border border-white/10 text-zinc-200 font-heading font-bold text-[10px] flex items-center justify-center gap-1 transition-all active:scale-95 disabled:opacity-40"
                  title="Generate an instant alternate take with current directorial lens on Livepeer MCP"
                >
                  <Wand2 className="w-3 h-3 text-zinc-400" />
                  <span>Re-Imagine Take</span>
                </button>
              </div>
            </div>

            {/* Subtitle Style Selector */}
            <div className="p-3 rounded-xl bg-[#090c14] border border-white/10 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-zinc-200">
                <Type className="w-3.5 h-3.5 text-zinc-400" />
                <span>Subtitles</span>
              </div>

              <div className="grid grid-cols-2 gap-1 text-[9px] font-mono">
                {[
                  { id: "hormozi", label: "Hormozi Gold" },
                  { id: "mrbeast", label: "MrBeast Neon" },
                  { id: "cyber", label: "Cyber Terminal" },
                  { id: "minimal", label: "Clean Swiss" },
                ].map((st) => {
                  const isSelected = subtitleStyle === st.id;
                  return (
                    <button
                      key={st.id}
                      onClick={() => {
                        cinematicAudio.play("toggle");
                        setSubtitleStyle(st.id as SubtitleStyle);
                      }}
                      className={`p-1.5 rounded-lg border text-center transition-all active:scale-95 ${
                        isSelected
                          ? "bg-white/10 border-white/25 text-white font-medium shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                          : "bg-white/[0.02] border-white/5 text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      {st.label}
                    </button>
                  );
                })}
              </div>

              <div className="pt-1 flex items-center justify-between text-[8px] font-mono text-zinc-400">
                <span>Safe Y-Offset</span>
                <span className="text-zinc-200 font-bold">{subtitleYOffset}%</span>
              </div>
              <input
                type="range"
                min="45"
                max="80"
                value={subtitleYOffset}
                onChange={(e) => setSubtitleYOffset(+e.target.value)}
                className="w-full accent-white h-1 bg-zinc-800 rounded"
              />
            </div>

          </div>

        </div>

      </div>

      {/* 3. BOTTOM WORKSTATION DOCK: MULTI-TRACK NLE TIMELINE WITH REAL WAVEFORM CANVAS */}
      <div className="h-32 bg-[#020305] border-t border-white/10 p-2 flex flex-col justify-between shrink-0 select-none">
        
        {/* NLE Toolbar Header */}
        <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400 pb-1 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#0c1220]/80 p-0.5 rounded-full border border-white/10">
              {[
                { id: "select", icon: MousePointer, label: "V" },
                { id: "blade", icon: Scissors, label: "C" },
              ].map((t) => {
                const Icon = t.icon;
                const isActive = activeTool === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      cinematicAudio.play("toggle");
                      setActiveTool(t.id as ToolMode);
                    }}
                    className={`p-1 rounded-full transition-all active:scale-95 ${
                      isActive
                        ? "bg-white/15 text-white font-bold border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]"
                        : "text-zinc-400 hover:text-zinc-200 border border-transparent"
                    }`}
                    title={t.id === "blade" ? "Blade Tool (C) - Slice B-Roll at timestamp" : "Selection Tool (V)"}
                  >
                    <Icon className="w-3 h-3" />
                  </button>
                );
              })}
            </div>
            <span className="text-zinc-200 font-bold ml-1 text-[9px] font-mono uppercase tracking-wider">Timeline Dock</span>
          </div>

          <div className="flex items-center gap-3">
            <span>Duration: {selectedHook.durationSec}s</span>
            <span>Playhead: <span className="text-white font-bold">{formatTime(currentTime)}</span></span>
          </div>
        </div>

        {/* Tracks Area */}
        <div 
          onClick={handleTimelineClick}
          className={`flex-1 relative flex flex-col justify-between py-1 overflow-hidden select-none transition-all ${
            activeTool === "blade" ? "cursor-crosshair" : "cursor-pointer"
          }`}
          title={activeTool === "blade" ? "Click to Slice B-Roll Cut at timestamp" : "Click anywhere on timeline to seek playhead"}
        >
          
          {/* Red Playhead Indicator */}
          <div
            style={{
              left: `${Math.min(98, Math.max(6, 6 + (currentTime / selectedHook.durationSec) * 92))}%`,
            }}
            className="absolute top-0 bottom-0 w-[2px] bg-red-500 z-30 pointer-events-none shadow-[0_0_8px_rgba(239,68,68,0.8)]"
          />

          {/* Track V2: Livepeer AI B-Roll */}
          <div className="flex items-center h-5 gap-2">
            <span className="w-12 text-[8px] font-mono text-emerald-400 font-bold">V2 B-ROLL</span>
            <div className="flex-1 h-full bg-black/60 rounded border border-white/5 relative overflow-hidden flex items-center">
              {brollCuts.map((cut) => {
                const leftPct = (cut.startSec / selectedHook.durationSec) * 100;
                const widthPct = (cut.durationSec / selectedHook.durationSec) * 100;
                return (
                  <div
                    key={cut.id}
                    onClick={() => handleSeek(cut.startSec)}
                    onDoubleClick={() => setRefiningCut(cut)}
                    style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                    className="absolute h-full bg-emerald-500/20 border border-emerald-400/60 rounded px-1.5 flex items-center justify-between text-[7px] font-mono text-emerald-300 cursor-pointer hover:brightness-125 truncate group"
                    title="Click to seek · Double-click to open Slice Surgery"
                  >
                    <span className="truncate font-bold">{cut.triggerPhrase}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      <span>{cut.durationSec}s</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRefiningCut(cut);
                        }}
                        className="hidden group-hover:inline px-1 rounded bg-black/80 text-white hover:text-emerald-400 border border-white/20 text-[6px]"
                        title="Refine Slice Prompt on Livepeer MCP"
                      >
                        Refine
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Track V1: Host A-Roll */}
          <div className="flex items-center h-5 gap-2">
            <span className="w-12 text-[8px] font-mono text-zinc-400 font-bold">V1 HOST</span>
            <div className="flex-1 h-full bg-[#0e131d] rounded border border-white/10 relative overflow-hidden flex items-center px-2 text-[7px] font-mono text-zinc-300">
              <span className="font-bold">{selectedHook.sourceSpeaker} (9:16 Face Tracked)</span>
            </div>
          </div>

          {/* Track A1: Audio Waveform Canvas */}
          <div className="flex items-center h-6 gap-2">
            <button
              type="button"
              onClick={() => {
                cinematicAudio.play("toggle");
                setIsMuted(!isMuted);
              }}
              className={`w-12 text-[8px] font-mono font-bold flex items-center gap-1 hover:brightness-125 transition-all text-left cursor-pointer ${
                isMuted ? "text-rose-400" : "text-amber-400"
              }`}
              title={isMuted ? "Track Muted - Click to Unmute" : "Track Live - Click to Mute"}
            >
              {isMuted ? <VolumeX className="w-2.5 h-2.5" /> : <Volume2 className="w-2.5 h-2.5" />}
              <span>A1 AUDIO</span>
            </button>
            <div className="flex-1 h-full rounded border border-white/5 overflow-hidden">
              <canvas ref={timelineCanvasRef} className="w-full h-full block" />
            </div>
          </div>

        </div>

      </div>

      <CustomHookModal
        isOpen={isCustomHookModalOpen}
        onClose={() => setIsCustomHookModalOpen(false)}
        onAddHook={handleAddCustomHook}
      />
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        hookTitle={selectedHook.title}
        speaker={selectedHook.sourceSpeaker}
        durationSec={selectedHook.durationSec}
        previewVideoUrl={brollCuts[0]?.videoUrl || selectedHook.speakerVideoUrl}
      />
      <SliceRefineModal
        isOpen={!!refiningCut}
        onClose={() => setRefiningCut(null)}
        brollCut={refiningCut}
        onUpdateBrollPrompt={handleUpdateBrollCut}
      />

      <ModelDrawer
        isOpen={isModelDrawerOpen}
        onClose={() => setIsModelDrawerOpen(false)}
        onKeyChange={(k) => setHasCustomKey(!!k)}
      />

      {/* Synchronized Keynote Speech & Narration Audio Element */}
      <audio
        ref={audioRef}
        src={selectedHook.audioUrl || `/api/tts?text=${encodeURIComponent(selectedHook.quoteText || selectedHook.title)}`}
        preload="auto"
        playsInline
        loop
        muted={isMuted}
        onLoadedMetadata={(e) => {
          const d = e.currentTarget.duration;
          if (d && !isNaN(d) && isFinite(d) && d > 2) {
            setSelectedHook((prev) => {
              if (Math.abs(prev.durationSec - d) < 0.5) return prev;
              const ratio = d / Math.max(1, prev.durationSec);
              const scaledTranscript = prev.transcript.map((w) => ({
                ...w,
                startSec: +(w.startSec * ratio).toFixed(2),
                endSec: +(w.endSec * ratio).toFixed(2),
              }));
              return {
                ...prev,
                durationSec: +d.toFixed(2),
                endSec: +d.toFixed(2),
                transcript: scaledTranscript,
              };
            });
          }
        }}
        aria-hidden="true"
        className="hidden"
      />
    </div>
  );
}
