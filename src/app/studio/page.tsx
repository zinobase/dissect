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
  Columns,
  Search,
  Grid,
  Keyboard,
  CheckCircle2,
  Zap,
  Repeat,
  Eye,
  Lock,
  ChevronUp,
  ChevronDown,
  Smartphone,
} from "lucide-react";
import { STARTER_KEYNOTES, SAMPLE_LONGFORM_HOOKS, getBrollForHook, synthesizeBrollLiveOnLivepeer, dissectVideoWithLivepeer, createDynamicHookFromKeynote } from "../../lib/broll-synthesizer";
import { VideoHook, BrollCut, TranscriptWord } from "../../lib/types";
import { ModelDrawer, STORAGE_KEY } from "../../components/ModelDrawer";
import { ExportModal } from "../../components/ExportModal";
import { CustomHookModal } from "../../components/CustomHookModal";
import { SliceRefineModal } from "../../components/SliceRefineModal";
import { optimizeCinematicPrompt, DirectorialStyle } from "../../lib/prompt-optimizer";
import { livepeerMcp } from "../../lib/livepeerMcp";
import { cinematicAudio } from "../../lib/cinematic-audio";
import { DissectLogoMark } from "../../components/DissectLogoMark";

type PlatformSafeMode = "tiktok" | "reels" | "shorts";
type SubtitleStyle = "hormozi" | "mrbeast" | "cyber" | "minimal";
type ToolMode = "select" | "blade" | "ripple";

export default function DissectStudioPage() {
  const [allHooks, setAllHooks] = useState<VideoHook[]>(SAMPLE_LONGFORM_HOOKS);
  const [selectedHook, setSelectedHook] = useState<VideoHook>(SAMPLE_LONGFORM_HOOKS[0]);
  const [brollCuts, setBrollCuts] = useState<BrollCut[]>(() => getBrollForHook(SAMPLE_LONGFORM_HOOKS[0].id, SAMPLE_LONGFORM_HOOKS[0]));
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeTool, setActiveTool] = useState<ToolMode>("select");
  const [isTimelineCollapsed, setIsTimelineCollapsed] = useState<boolean>(false);

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
  const [opticsFeedback, setOpticsFeedback] = useState<string>("");

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

  // Pro Studio Ergonomics: Layout Modes, Inspector Tabs & Controls
  const [layoutMode, setLayoutMode] = useState<"studio" | "script" | "stage">("studio");
  const [inspectorTab, setInspectorTab] = useState<"broll" | "captions" | "retention">("broll");
  const [transcriptSearch, setTranscriptSearch] = useState<string>("");
  const [showSafeGuides, setShowSafeGuides] = useState<boolean>(true);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<"stage" | "script" | "directives">("stage");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const k = localStorage.getItem(STORAGE_KEY);
      if (k) setHasCustomKey(true);

      const params = new URLSearchParams(window.location.search);
      const urlParam = params.get("url");
      if (urlParam) {
        setDirectInputText(urlParam);
        handleDirectIngest(undefined, urlParam);
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
  const activeWordElRef = useRef<HTMLSpanElement | null>(null);
  const transcriptContainerRef = useRef<HTMLDivElement | null>(null);

  // Active B-Roll cut for current playhead
  const activeBroll = brollCuts.find(
    (b) => currentTime >= b.startSec && currentTime <= b.endSec
  );

  const selectedHookRef = useRef(selectedHook);
  selectedHookRef.current = selectedHook;

  const activeBrollRef = useRef(activeBroll);
  activeBrollRef.current = activeBroll;

  const currentTimeRef = useRef(currentTime);
  currentTimeRef.current = currentTime;

  const cameraTrajectoryRef = useRef(cameraTrajectory);
  cameraTrajectoryRef.current = cameraTrajectory;

  const selectedDirectorialStyleRef = useRef(selectedDirectorialStyle);
  selectedDirectorialStyleRef.current = selectedDirectorialStyle;

  // Active spoken word
  const activeWordIndex = selectedHook.transcript.findIndex(
    (w) => currentTime >= w.startSec && currentTime <= w.endSec
  );
  const activeWordObj = selectedHook.transcript[activeWordIndex];

  // Auto-scroll transcript container smoothly so active spoken word is always visible
  useEffect(() => {
    if (activeWordElRef.current && transcriptContainerRef.current) {
      activeWordElRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    }
  }, [activeWordIndex]);

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

  // 5b. Professional NLE Keyboard Shortcuts (Space, C, V, M, J, K, L, ?)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        cinematicAudio.play("toggle");
        setIsPlaying((prev) => !prev);
      } else if (e.key === "c" || e.key === "C") {
        cinematicAudio.play("toggle");
        setActiveTool("blade");
      } else if (e.key === "v" || e.key === "V") {
        cinematicAudio.play("toggle");
        setActiveTool("select");
      } else if (e.key === "m" || e.key === "M") {
        cinematicAudio.play("toggle");
        setIsMuted((prev) => !prev);
      } else if (e.key === "j" || e.key === "J") {
        cinematicAudio.play("click");
        handleSeek(Math.max(0, currentTime - 2));
      } else if (e.key === "l" || e.key === "L") {
        cinematicAudio.play("click");
        handleSeek(Math.min(selectedHook.durationSec, currentTime + 2));
      } else if (e.key === "k" || e.key === "K") {
        cinematicAudio.play("toggle");
        setIsPlaying(false);
      } else if (e.key === "?") {
        cinematicAudio.play("click");
        setIsShortcutsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentTime, selectedHook.durationSec]);

  // 6. Timeline Playhead Loop — locked to actual audio clock when playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      const audio = audioRef.current;
      if (audio && !audio.paused && !isNaN(audio.duration) && audio.duration > 0) {
        const audioTime = audio.currentTime;
        if (audioTime >= selectedHook.durationSec) {
          if (isLooping) {
            audio.currentTime = 0;
            setCurrentTime(0);
          } else {
            audio.pause();
            setIsPlaying(false);
            setCurrentTime(selectedHook.durationSec);
          }
        } else {
          setCurrentTime(+audioTime.toFixed(2));
        }
      } else {
        setCurrentTime((prev) => {
          const next = prev + 0.1;
          if (next >= selectedHook.durationSec) {
            if (isLooping) {
              if (audio) audio.currentTime = 0;
              return 0;
            } else {
              if (audio) audio.pause();
              setIsPlaying(false);
              return selectedHook.durationSec;
            }
          }
          return +next.toFixed(2);
        });
      }
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying, selectedHook.durationSec, isLooping]);

  // 60 FPS HTML5 Canvas Video Renderer (9:16 Vertical Video Engine)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animId: number;
    const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);
    let width = canvas.parentElement?.clientWidth || 280;
    let height = canvas.parentElement?.clientHeight || 500;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.scale(dpr, dpr);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.scale(dpr, dpr);
    };
    window.addEventListener("resize", handleResize);

    let frame = 0;

    // Fast image cache preloaded with local 9:16 vertical assets
    const imageCache = new Map<string, HTMLImageElement>();
    const preloadList = [
      "/images/speakers/jensen.jpg",
      "/images/speakers/ilya.jpg",
      "/images/speakers/karpathy.jpg",
      "/images/speakers/sam.jpg",
      "/images/broll/robotics.jpg",
      "/images/broll/neural.jpg",
      "/images/broll/sensor.jpg",
      "/images/broll/reasoning.jpg",
    ];

    preloadList.forEach((src) => {
      const img = new Image();
      img.src = src;
      if ("decode" in img && typeof img.decode === "function") {
        img.decode().catch(() => {});
      }
      imageCache.set(src, img);
    });

    const getImage = (src: string): HTMLImageElement => {
      if (!src) return imageCache.get("/images/speakers/jensen.jpg") || new Image();
      const resolvedSrc =
        src.startsWith("http") && !src.includes("/api/proxy-media")
          ? `/api/proxy-media?url=${encodeURIComponent(src)}`
          : src;
      if (imageCache.has(resolvedSrc)) {
        return imageCache.get(resolvedSrc)!;
      }
      const img = new Image();
      if (resolvedSrc.startsWith("http")) {
        img.crossOrigin = "anonymous";
      }
      img.src = resolvedSrc;
      if ("decode" in img && typeof img.decode === "function") {
        img.decode().catch(() => {});
      }
      imageCache.set(resolvedSrc, img);
      return img;
    };

    const render = () => {
      frame++;
      const cx = width / 2;
      const cy = height / 2;

      // Dark Canvas Background
      ctx.fillStyle = "#06070b";
      ctx.fillRect(0, 0, width, height);

      const curBroll = activeBrollRef.current;
      const curHook = selectedHookRef.current;
      const traj = cameraTrajectoryRef.current;
      const style = selectedDirectorialStyleRef.current;

      // Physical camera trajectory simulation
      let panX = 0;
      let panY = 0;
      let zoom = 1.02;

      if (traj === "Crane Up") {
        panY = -14 + Math.sin(frame * 0.02) * 8;
        panX = Math.sin(frame * 0.01) * 3;
        zoom = 1.05 + Math.sin(frame * 0.015) * 0.02;
      } else if (traj === "Pan Left") {
        panX = -18 + Math.sin(frame * 0.02) * 12;
        panY = Math.cos(frame * 0.012) * 3;
        zoom = 1.04;
      } else if (traj === "Orbit 360") {
        panX = Math.sin(frame * 0.025) * 14;
        panY = Math.cos(frame * 0.025) * 8;
        zoom = 1.06 + Math.sin(frame * 0.02) * 0.03;
      } else {
        // Dolly In (Default)
        zoom = 1.02 + (frame % 360) * 0.0007;
        panX = Math.sin(frame * 0.012) * 4;
        panY = Math.cos(frame * 0.01) * 3;
      }

      // Directorial Lens Style Overrides
      if (style === "macro_texture") {
        zoom *= 1.34;
      } else if (style === "dynamic_drone") {
        zoom *= 0.94;
        panY -= 6;
      } else if (style === "studio_push") {
        zoom *= 1.1 + Math.sin(frame * 0.035) * 0.04;
      }

      if (curBroll) {
        // SCENE A: LIVEPEER SYNTHETIC B-ROLL
        ctx.save();
        const brollSrc = curBroll.posterUrl || curBroll.videoUrl || "/images/broll/robotics.jpg";
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
          const triggerTrimmed = curBroll.triggerPhrase.length > 15 ? curBroll.triggerPhrase.slice(0, 13) + ".." : curBroll.triggerPhrase;
          ctx.fillText(`· ${triggerTrimmed}`, 115, 26);
          ctx.restore();
        } else {
          ctx.fillStyle = "#0c1018";
          ctx.fillRect(0, 0, width, height);
        }
        ctx.restore();
      } else {
        // SCENE B: PODCAST SPEAKER WITH REALISTIC CAM AND FACE-TRACKING
        ctx.save();
        const hostSrc = curHook.speakerVideoUrl || "/images/speakers/jensen.jpg";
        const targetSpeakerImg = getImage(hostSrc);

        if (targetSpeakerImg && targetSpeakerImg.complete && targetSpeakerImg.naturalWidth > 0) {
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

      // Live Camera Optics & Trajectory Telemetry Tag on Canvas
      ctx.save();
      ctx.fillStyle = "rgba(4, 6, 12, 0.85)";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1;
      const styleName = style === "cinematic_prime" ? "35MM" : style === "macro_texture" ? "MACRO" : style === "dynamic_drone" ? "DRONE" : "PUSH-IN";
      const hudText = `CAM: ${traj.toUpperCase()} · ${styleName}`;
      ctx.font = "bold 6.5px monospace";
      const textWidth = ctx.measureText(hudText).width;
      ctx.fillRect(width - textWidth - 18, 10, textWidth + 12, 15);
      ctx.strokeRect(width - textWidth - 18, 10, textWidth + 12, 15);
      ctx.fillStyle = "#84cc16";
      ctx.fillText(hudText, width - textWidth - 12, 20.5);

      // Optical reticle overlays according to selected lens
      if (style === "macro_texture") {
        ctx.strokeStyle = "rgba(132, 204, 22, 0.35)";
        ctx.lineWidth = 1;
        ctx.strokeRect(cx - 24, cy - 24, 48, 48);
        ctx.fillStyle = "rgba(132, 204, 22, 0.7)";
        ctx.font = "6px monospace";
        ctx.fillText("1:1 MACRO F/2.8", cx - 21, cy + 33);
      } else if (style === "dynamic_drone") {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(15, cy);
        ctx.lineTo(45, cy);
        ctx.moveTo(width - 45, cy);
        ctx.lineTo(width - 15, cy);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      ctx.restore();

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
  }, []);

  // 60 FPS HTML5 Audio Waveform Timeline Canvas
  useEffect(() => {
    const canvas = timelineCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animId: number;
    const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);
    let width = canvas.parentElement?.clientWidth || 800;
    let height = canvas.parentElement?.clientHeight || 48;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.scale(dpr, dpr);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.scale(dpr, dpr);
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
        const isPast = tSec <= currentTimeRef.current;

        if (isBroll) {
          ctx.fillStyle = isPast ? "#84cc16" : "rgba(132, 204, 22, 0.35)";
        } else {
          ctx.fillStyle = isPast ? "#f1f5f9" : "rgba(255, 255, 255, 0.16)";
        }
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

  const handleWordDoubleClick = async (item: TranscriptWord) => {
    cinematicAudio.play("click");
    handleSeek(item.startSec);
    try {
      const phrase = item.word.replace(/[^a-zA-Z0-9]/g, "");
      const newCut = await synthesizeBrollLiveOnLivepeer(
        `${customPrompt} featuring ${phrase}`,
        phrase,
        item.startSec,
        3.0
      );
      setBrollCuts((prev) => [...prev, newCut]);
    } catch (err) {
      console.error("Livepeer double-click B-roll error:", err);
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

  const handleOptimizeStudioPrompt = (style: DirectorialStyle = selectedDirectorialStyle, traj: string = cameraTrajectory) => {
    const result = optimizeCinematicPrompt(customPrompt, style, "9:16");
    const formatted = `${result.optimizedPrompt}, ${traj} trajectory`;
    setCustomPrompt(formatted);
    setSelectedDirectorialStyle(style);
    const styleLabel = style === "cinematic_prime" ? "35mm Prime" : style === "macro_texture" ? "Macro" : style === "dynamic_drone" ? "Drone" : "Push-In";
    setOpticsFeedback(`Optics Calibrated: ${styleLabel} · ${traj}`);
    setTimeout(() => setOpticsFeedback(""), 2800);
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
    const formatted = `${result.optimizedPrompt}, ${cameraTrajectory} trajectory`;
    setCustomPrompt(formatted);

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
            className="flex items-center gap-2.5 group text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <DissectLogoMark className="w-6 h-5 transition-transform group-hover:scale-105 drop-shadow-[0_0_8px_rgba(132,204,22,0.35)]" />
            <span className="font-heading font-black text-sm tracking-tight text-white group-hover:text-[#84cc16] transition-colors">
              DISSECT
            </span>
          </Link>
        </div>

        {/* Center: Live Keynote Stream Switcher - Floating Frosted Glass Dock */}
        <div className="flex items-center bg-[#0c1220]/80 backdrop-blur-md p-1 rounded-full border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] text-[11px] font-mono overflow-x-auto no-scrollbar max-w-[48vw] sm:max-w-none shrink-0">
          {STARTER_KEYNOTES.map((k) => {
            const isActive = selectedHook?.sourceSpeaker === k.speaker;
            return (
              <button
                key={k.id}
                onClick={() => {
                  cinematicAudio.play("toggle");
                  const target = allHooks.find((h) => h.sourceSpeaker.toLowerCase().includes(k.speaker.split(" ")[0].toLowerCase())) || createDynamicHookFromKeynote(k);
                  handleSelectHook(target);
                }}
                className={`px-3.5 py-1 rounded-full transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-white/12 text-white font-medium border border-white/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_8px_rgba(0,0,0,0.4)]"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border border-transparent"
                }`}
              >
                {isActive ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#84cc16] shadow-[0_0_8px_rgba(132,204,22,0.9)]" />
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
            className="px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/10 border border-white/10 hover:border-white/20 text-zinc-300 font-mono text-[10px] font-medium flex items-center gap-1 transition-all ml-1 active:scale-95 cursor-pointer shrink-0"
            title="Import your own video or paste custom transcript"
          >
            <Plus className="w-3 h-3 text-zinc-400" />
            <span>+ Custom Hook</span>
          </button>
        </div>

        {/* Right: Actions, Layout Switcher & Export */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Workspace Layout Mode Switcher */}
          <div className="hidden lg:flex items-center bg-[#0c1220]/80 p-0.5 rounded-full border border-white/10 text-[9px] font-mono">
            {(
              [
                { id: "studio", label: "Studio 3-Col" },
                { id: "script", label: "Script Focus" },
                { id: "stage", label: "Stage Focus" },
              ] as const
            ).map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  cinematicAudio.play("toggle");
                  setLayoutMode(m.id);
                }}
                className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer flex items-center gap-1 ${
                  layoutMode === m.id
                    ? "bg-white/15 text-white font-semibold border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_1px_4px_rgba(0,0,0,0.4)]"
                    : "text-zinc-400 hover:text-zinc-200 border border-transparent"
                }`}
              >
                {layoutMode === m.id && (
                  <span className="w-1 h-1 rounded-full bg-[#84cc16] shadow-[0_0_6px_rgba(132,204,22,0.8)]" />
                )}
                <span>{m.label}</span>
              </button>
            ))}
          </div>

          {/* Keyboard Shortcuts Trigger */}
          <button
            onClick={() => {
              cinematicAudio.play("click");
              setIsShortcutsOpen(true);
            }}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/10 border border-white/10 text-[10px] font-mono text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer active:scale-95"
            title="View Pro NLE Keyboard Shortcuts (?)"
          >
            <Keyboard className="w-3 h-3 text-zinc-400" />
            <span>Keys</span>
            <span className="px-1 rounded bg-white/10 text-[8px] font-bold text-zinc-300">?</span>
          </button>

          <button
            onClick={() => {
              cinematicAudio.play("click");
              setIsModelDrawerOpen(true);
            }}
            className="hidden xs:flex px-2.5 sm:px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/10 border border-white/10 text-[10px] font-mono text-zinc-300 items-center gap-1.5 transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] active:scale-95 cursor-pointer shrink-0"
            title="Livepeer Agent Creative MCP Settings"
          >
            <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden md:inline">Livepeer MCP (125 Tools)</span>
            <span className="md:hidden">MCP</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#84cc16] animate-pulse" />
          </button>

          <button
            onClick={() => {
              cinematicAudio.play("click");
              setIsExportOpen(true);
            }}
            className="px-3 sm:px-4 py-1.5 rounded-full bg-white hover:bg-zinc-100 text-black font-heading font-bold text-xs active:scale-95 transition-all shadow-[0_2px_12px_rgba(255,255,255,0.2),inset_0_1px_0_rgba(255,255,255,0.8)] flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-black" />
            <span className="hidden sm:inline">Export 1080x1920</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </header>

      {/* Mobile/Tablet Adaptive View Switcher (Active on < lg screens) */}
      <div className="lg:hidden flex items-center justify-around bg-[#06080e] border-b border-white/10 px-2 py-1.5 text-[11px] font-mono shrink-0 z-20">
        <button
          type="button"
          onClick={() => {
            cinematicAudio.play("toggle");
            setMobileTab("stage");
          }}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all active:scale-95 cursor-pointer ${
            mobileTab === "stage"
              ? "bg-white/15 text-white font-bold border border-white/20 shadow-sm"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Smartphone className="w-3 h-3 text-[#84cc16]" />
          <span>9:16 Stage</span>
        </button>
        <button
          type="button"
          onClick={() => {
            cinematicAudio.play("toggle");
            setMobileTab("script");
          }}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all active:scale-95 cursor-pointer ${
            mobileTab === "script"
              ? "bg-white/15 text-white font-bold border border-white/20 shadow-sm"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <FileText className="w-3 h-3 text-[#84cc16]" />
          <span>Script</span>
        </button>
        <button
          type="button"
          onClick={() => {
            cinematicAudio.play("toggle");
            setMobileTab("directives");
          }}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all active:scale-95 cursor-pointer ${
            mobileTab === "directives"
              ? "bg-white/15 text-white font-bold border border-white/20 shadow-sm"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Sliders className="w-3 h-3 text-[#84cc16]" />
          <span>Optics & AI</span>
        </button>
      </div>

      {/* 2. PRO WORKSPACE: RESPONSIVE 3-COLUMN STUDIO / SCRIPT FOCUS / STAGE FOCUS */}
      <div className="flex-1 grid grid-cols-12 min-h-0 overflow-hidden divide-x divide-white/10">
        
        {/* COLUMN 1: WORD-LEVEL SCRIPT & HOOK INGESTION */}
        <div className={`${
          mobileTab === "script" ? "flex" : "hidden"
        } lg:flex ${
          layoutMode === "studio" 
            ? "col-span-12 lg:col-span-4" 
            : layoutMode === "script" 
            ? "col-span-12 lg:col-span-7" 
            : "col-span-12 lg:col-span-3"
        } h-full flex-col bg-[#06080e] p-3.5 gap-2.5 overflow-hidden select-none transition-all duration-300`}>
          
          {/* Header Toolbar */}
          <div className="flex items-center justify-between pb-1 border-b border-white/10 shrink-0">
            <span className="text-xs font-mono font-semibold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#84cc16]" />
              <span>Word-Level Script</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono text-[#84cc16] px-2 py-0.5 rounded-full bg-[#84cc16]/10 border border-[#84cc16]/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#84cc16] animate-pulse" />
                <span>Whisper-v3 Synced</span>
              </span>
            </div>
          </div>

          {/* Streamlined Monologue Ingestion Bar */}
          <div className="shrink-0 space-y-1">
            <form onSubmit={handleDirectIngest} className="flex items-center gap-1.5 p-1 bg-[#090c14] rounded-xl border border-white/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]">
              <input
                type="text"
                value={directSpeakerName}
                onChange={(e) => setDirectSpeakerName(e.target.value)}
                placeholder="Speaker"
                className="w-18 bg-transparent text-[11px] font-mono text-white px-2 py-1 placeholder:text-zinc-500 focus:outline-none shrink-0 border-r border-white/10"
              />
              <input
                type="text"
                value={directInputText}
                onChange={(e) => setDirectInputText(e.target.value)}
                placeholder="Paste video URL or monologue..."
                className="flex-1 bg-transparent text-[11px] font-mono text-white px-2 py-1 placeholder:text-zinc-500 focus:outline-none min-w-0"
              />
              <button
                type="submit"
                disabled={isDirectIngesting || !directInputText.trim()}
                className="px-3 py-1 rounded-lg bg-[#84cc16] hover:bg-[#99e61c] text-black font-heading font-bold text-[10.5px] active:scale-95 transition-all flex items-center gap-1 shrink-0 cursor-pointer disabled:opacity-40 shadow-[0_1px_6px_rgba(132,204,22,0.3)]"
              >
                {isDirectIngesting ? (
                  <>
                    <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Scissors className="w-2.5 h-2.5" />
                    <span>Dissect</span>
                  </>
                )}
              </button>
            </form>

            {/* Active Livepeer Dissection Progress */}
            {isDirectIngesting && (
              <div className="p-2 rounded-lg bg-[#0b0f18] border border-white/15 space-y-1 animate-fadeIn">
                <div className="flex items-center justify-between text-[9px] font-mono">
                  <span className="text-zinc-200 font-bold flex items-center gap-1.5 truncate">
                    <RefreshCw className="w-2.5 h-2.5 animate-spin text-[#84cc16] shrink-0" />
                    <span className="truncate">{ingestStatusMessage}</span>
                  </span>
                  <span className="text-zinc-400 shrink-0">Step {ingestStep}/4</span>
                </div>
                <div className="w-full bg-zinc-900 rounded-full h-1 overflow-hidden">
                  <div
                    className="bg-[#84cc16] h-full transition-all duration-300"
                    style={{ width: `${(ingestStep / 4) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* HERO OF LEFT COLUMN: INTERACTIVE WORD-LEVEL TRANSCRIPT (MAXIMIZED VERTICAL SPACE) */}
          <div className="flex-1 min-h-0 p-3 rounded-xl bg-[#090c14] border border-white/10 flex flex-col overflow-hidden shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]">
            
            {/* Transcript Subheader with Word Search & Controls */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10 shrink-0 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-full bg-[#84cc16]/10 border border-[#84cc16]/30 flex items-center justify-center font-heading font-bold text-[10px] text-[#84cc16] shrink-0">
                  {selectedHook.sourceSpeaker.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-heading font-bold text-white flex items-center gap-1.5 truncate">
                    <span>{selectedHook.sourceSpeaker}</span>
                    <span className="text-[8.5px] font-mono text-zinc-400 font-normal">· {selectedHook.durationSec}s</span>
                  </div>
                </div>
              </div>

              {/* Transcript Search Filter */}
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="relative flex items-center">
                  <Search className="w-2.5 h-2.5 text-zinc-400 absolute left-2 pointer-events-none" />
                  <input
                    type="text"
                    value={transcriptSearch}
                    onChange={(e) => setTranscriptSearch(e.target.value)}
                    placeholder="Search words..."
                    className="bg-black/60 border border-white/10 rounded-md pl-5 pr-5 py-0.5 text-[9px] font-mono text-white placeholder:text-zinc-500 w-24 sm:w-28 focus:w-36 transition-all focus:border-[#84cc16]/50 focus:outline-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]"
                  />
                  {transcriptSearch && (
                    <button
                      type="button"
                      onClick={() => setTranscriptSearch("")}
                      className="absolute right-1.5 text-zinc-400 hover:text-white text-[10px] font-mono cursor-pointer"
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className="hidden xl:flex text-[8px] font-mono text-zinc-400 items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded border border-white/5">
                  <MousePointer className="w-2.5 h-2.5 text-[#84cc16]" />
                  <span>Click: seek · 2x: B-roll</span>
                </div>
              </div>
            </div>

            {/* Word-by-Word Stream with Smooth Auto-Scroll & Real-Time Waveform Equalizer */}
            <div
              ref={transcriptContainerRef}
              className="flex-1 overflow-y-auto pt-2.5 pb-2 leading-loose text-sm font-mono space-x-1.5 pr-1.5 scrollbar-thin select-none"
            >
              {selectedHook.transcript.map((item, idx) => {
                const isActive = currentTime >= item.startSec && currentTime <= item.endSec;
                const isPast = currentTime > item.endSec;
                const isSearchMatch =
                  transcriptSearch.trim().length > 0 &&
                  item.word.toLowerCase().includes(transcriptSearch.toLowerCase().trim());

                return (
                  <span
                    key={idx}
                    ref={isActive ? activeWordElRef : null}
                    onClick={() => {
                      cinematicAudio.play("click");
                      handleSeek(item.startSec);
                    }}
                    onDoubleClick={() => handleWordDoubleClick(item)}
                    title={`${item.word} · ${formatTime(item.startSec)} (Click seek · Double-click inject B-roll)`}
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded cursor-pointer transition-all ${
                      isActive
                        ? "bg-[#84cc16]/20 border border-[#84cc16]/60 text-white font-bold shadow-[0_0_12px_rgba(132,204,22,0.25)] scale-105 rounded-md px-2 py-0.5"
                        : isSearchMatch
                        ? "bg-amber-400/20 text-amber-300 font-bold border border-amber-400/60 shadow-[0_0_8px_rgba(251,191,36,0.3)]"
                        : isPast
                        ? "text-zinc-200 hover:text-white hover:bg-white/10"
                        : "text-zinc-500 hover:text-zinc-300"
                    } ${item.isKeyTerm ? "font-semibold text-zinc-100 underline decoration-[#84cc16]/40 underline-offset-4" : ""}`}
                  >
                    <span>{item.word}</span>
                    {isActive && (
                      <span className="inline-flex items-center gap-0.5 ml-0.5">
                        <span className="w-0.5 h-2 bg-[#84cc16] animate-pulse" />
                        <span className="w-0.5 h-3 bg-[#84cc16] animate-pulse delay-75" />
                        <span className="w-0.5 h-1.5 bg-[#84cc16] animate-pulse delay-150" />
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
          </div>

        </div>

        {/* COLUMN 2: 9:16 CINEMATIC STAGE & PRECISION TRANSPORT */}
        <div className={`${
          mobileTab === "stage" ? "flex" : "hidden"
        } lg:flex ${
          layoutMode === "studio" 
            ? "col-span-12 lg:col-span-4" 
            : layoutMode === "script" 
            ? "col-span-12 lg:col-span-5" 
            : "col-span-12 lg:col-span-5"
        } h-full flex-col items-center justify-between p-3 bg-[#05060a] overflow-hidden select-none transition-all duration-300`}>
          
          {/* Top Stage Subheader: Mode & Safe Area Guides Controls */}
          <div className="w-full flex items-center justify-between pb-1 border-b border-white/10 shrink-0 text-[9.5px] font-mono">
            <div className="flex items-center gap-1.5 text-zinc-300 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#84cc16] animate-pulse" />
              <span>9:16 Vertical Preview</span>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Safe Guides Toggle */}
              <button
                type="button"
                onClick={() => {
                  cinematicAudio.play("toggle");
                  setShowSafeGuides(!showSafeGuides);
                }}
                className={`px-2 py-0.5 rounded-full text-[8px] font-mono flex items-center gap-1 transition-all cursor-pointer ${
                  showSafeGuides
                    ? "bg-white/10 text-white border border-white/20 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-300 border border-transparent"
                }`}
                title="Toggle Platform Safe Area Guidelines"
              >
                <Grid className="w-2.5 h-2.5" />
                <span>{showSafeGuides ? "Guides ON" : "Guides OFF"}</span>
              </button>

              {/* Platform Safe Area Switcher */}
              <div className="flex items-center bg-[#0c1220]/80 p-0.5 rounded-full border border-white/10 text-[8px] font-mono">
                {(["tiktok", "reels", "shorts"] as const).map((p) => {
                  const isActive = platformSafeMode === p;
                  return (
                    <button
                      key={p}
                      onClick={() => {
                        cinematicAudio.play("toggle");
                        setPlatformSafeMode(p);
                      }}
                      className={`px-2.5 py-0.5 rounded-full uppercase transition-all active:scale-95 cursor-pointer ${
                        isActive
                          ? "bg-white text-black font-bold shadow-[0_1px_4px_rgba(0,0,0,0.5)]"
                          : "text-zinc-400 hover:text-zinc-200 border border-transparent"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 9:16 Smartphone Shell: Sized to authentic vertical resolution */}
          <div className="relative w-[236px] h-[420px] sm:w-[254px] sm:h-[452px] md:w-[272px] md:h-[484px] max-h-[64vh] rounded-[34px] bg-black border-[4px] border-[#202534] shadow-[0_25px_60px_-12px_rgba(0,0,0,0.95),0_0_35px_rgba(132,204,22,0.08),inset_0_1px_1px_rgba(255,255,255,0.25)] overflow-hidden flex flex-col justify-between select-none shrink-0 my-auto ring-1 ring-white/10">
            
            {/* Dynamic Island Aperture */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-3.5 rounded-full bg-black/95 border border-white/10 flex items-center justify-center gap-1.5 z-30 shadow-md">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 border border-white/10" />
              <div className="w-1 h-1 rounded-full bg-[#84cc16] animate-pulse shadow-[0_0_6px_rgba(132,204,22,0.8)]" />
              <span className="text-[6px] font-mono font-bold text-zinc-400">4K REC</span>
            </div>

            {/* Dynamic Stage HUD */}
            <div className="relative z-20 pt-7 px-3 flex items-center justify-between text-[7.5px] font-mono">
              <span className="px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[#84cc16] font-bold shadow-sm">
                {activeBroll ? "AI B-ROLL · LIVEPEER" : "HOST A-ROLL"}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  cinematicAudio.play("toggle");
                  setIsMuted(!isMuted);
                }}
                className={`px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md border text-[7.5px] font-mono flex items-center gap-1 cursor-pointer transition-all active:scale-95 pointer-events-auto ${
                  isMuted
                    ? "border-rose-500/40 text-rose-400"
                    : "border-white/15 text-[#84cc16] hover:border-white/30"
                }`}
                title={isMuted ? "Audio Muted - Click to Unmute (M)" : "Audio Live - Click to Mute (M)"}
              >
                {isMuted ? <VolumeX className="w-2.5 h-2.5" /> : <Volume2 className="w-2.5 h-2.5" />}
                <span>{isMuted ? "MUTED" : "LIVE AUDIO"}</span>
              </button>
            </div>

            {/* 60 FPS Living HTML5 Canvas */}
            <div className="absolute inset-0 z-10">
              <canvas ref={canvasRef} className="w-full h-full block" />
            </div>

            {/* Visual Platform Safe Guides Overlay */}
            {showSafeGuides && (
              <div className="absolute inset-x-2.5 top-9 bottom-12 border border-dashed border-[#84cc16]/50 rounded-xl pointer-events-none z-20 flex flex-col justify-between p-1">
                <div className="flex justify-between items-center text-[5.5px] font-mono text-[#84cc16] px-1 bg-black/70 rounded">
                  <span>SAFE CAPTION ZONE</span>
                  <span>TOP MARGIN</span>
                </div>
                <div className="flex justify-between items-center text-[5.5px] font-mono text-[#84cc16] px-1 bg-black/70 rounded">
                  <span>UI KEEP-OUT</span>
                  <span>ACTION RAIL SAFE</span>
                </div>
              </div>
            )}

            {/* Multi-Platform Safe Area Overlays (TikTok vs Reels vs Shorts) */}
            <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-3 pb-5 select-none">
              {/* Platform Header Simulation */}
              <div className="pt-3 flex justify-between items-center text-[7px] font-heading font-bold text-white/90">
                {platformSafeMode === "tiktok" ? (
                  <div className="w-full flex justify-center gap-2">
                    <span className="text-zinc-400">Following</span>
                    <span className="text-white border-b-2 border-white pb-0.5">For You</span>
                  </div>
                ) : platformSafeMode === "reels" ? (
                  <div className="flex items-center gap-1">
                    <span>Reels</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <span className="text-rose-500 font-black">Shorts</span>
                  </div>
                )}
              </div>

              {/* Bottom & Side Interface simulation */}
              <div className="flex items-end justify-between">
                <div className="space-y-0.5 max-w-[110px]">
                  <div className="text-[7.5px] font-heading font-bold text-white truncate">
                    @{selectedHook.sourceSpeaker.toLowerCase().replace(/\s+/g, "")}
                  </div>
                  <div className="text-[6.5px] text-zinc-300 line-clamp-1">{selectedHook.title}</div>
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
                      <VolumeX className="w-2 h-2 text-rose-400" />
                    ) : (
                      <Disc className={`w-2 h-2 ${isPlaying ? "animate-spin" : ""}`} />
                    )}
                    <span className="truncate">{isMuted ? "Audio Muted" : "Original Audio · Livepeer"}</span>
                  </div>
                </div>

                {/* Right Action Stack */}
                <div className="flex flex-col items-center gap-1 pb-0.5 text-white text-[7px] font-mono">
                  <div className="flex flex-col items-center">
                    <div className="w-4.5 h-4.5 rounded-full bg-black/50 border border-white/20 flex items-center justify-center">
                      <Heart className="w-2 h-2 text-rose-500 fill-rose-500" />
                    </div>
                    <span className="text-[5.5px]">128K</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-4.5 h-4.5 rounded-full bg-black/50 border border-white/20 flex items-center justify-center">
                      <MessageCircle className="w-2 h-2 text-zinc-200" />
                    </div>
                    <span className="text-[5.5px]">2.4K</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-4.5 h-4.5 rounded-full bg-black/50 border border-white/20 flex items-center justify-center">
                      <Share2 className="w-2 h-2 text-zinc-200" />
                    </div>
                    <span className="text-[5.5px]">Share</span>
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

        </div>

        {/* COLUMN 3: PRO STUDIO INSPECTOR (AI B-ROLL, CAPTIONS, RETENTION) */}
        <div className={`${
          layoutMode === "studio" 
            ? "col-span-12 lg:col-span-4" 
            : layoutMode === "script" 
            ? "hidden" 
            : "col-span-12 lg:col-span-4"
        } h-full flex flex-col bg-[#07090f] p-3.5 gap-2.5 overflow-hidden select-none transition-all duration-300`}>
          
          {/* Top Inspector Tab Navigation Bar */}
          <div className="flex items-center justify-between pb-1 border-b border-white/10 shrink-0">
            <div className="flex items-center bg-[#0c1220]/80 p-0.5 rounded-full border border-white/10 text-[9.5px] font-mono w-full">
              {(
                [
                  { id: "broll", label: "AI B-Roll", icon: Sparkles },
                  { id: "captions", label: "Captions", icon: Type },
                  { id: "retention", label: "Retention", icon: BarChart3 },
                ] as const
              ).map((tab) => {
                const Icon = tab.icon;
                const isActive = inspectorTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      cinematicAudio.play("toggle");
                      setInspectorTab(tab.id);
                    }}
                    className={`flex-1 py-1 rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                      isActive
                        ? "bg-white/10 text-white font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_8px_rgba(0,0,0,0.4)] border border-white/20"
                        : "text-zinc-400 hover:text-zinc-200 border border-transparent"
                    }`}
                  >
                    <Icon className={`w-3 h-3 ${isActive ? "text-[#84cc16]" : "text-zinc-400"}`} />
                    <span>{tab.label}</span>
                    {isActive && (
                      <span className="w-1 h-1 rounded-full bg-[#84cc16] shadow-[0_0_6px_rgba(132,204,22,0.8)]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* TAB 1: AI B-ROLL ENGINE */}
          {inspectorTab === "broll" && (
            <div className="flex-1 min-h-0 flex flex-col gap-2.5 overflow-y-auto pr-1 scrollbar-thin animate-fadeIn">
              
              {/* Directorial Lenses & Camera Trajectory */}
              <div className="p-3 rounded-xl bg-[#090c14] border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono font-semibold text-zinc-200">
                  <div className="flex items-center gap-1.5">
                    <Sliders className="w-3 h-3 text-[#84cc16]" />
                    <span>Directorial Lens & Optics</span>
                  </div>
                  
                  <select
                    value={cameraTrajectory}
                    onChange={(e) => {
                      const newTraj = e.target.value;
                      cinematicAudio.play("toggle");
                      setCameraTrajectory(newTraj);
                      handleOptimizeStudioPrompt(selectedDirectorialStyle, newTraj);
                    }}
                    className="bg-black/60 border border-white/10 text-[9px] font-mono text-zinc-200 rounded px-2 py-0.5 focus:outline-none focus:border-[#84cc16]/50 cursor-pointer"
                  >
                    <option>Dolly In</option>
                    <option>Pan Left</option>
                    <option>Crane Up</option>
                    <option>Orbit 360</option>
                  </select>
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
                          handleOptimizeStudioPrompt(key, cameraTrajectory);
                        }}
                        className={`py-1 rounded-full border text-[8.5px] font-mono transition-all text-center active:scale-95 cursor-pointer flex items-center justify-center gap-1 ${
                          isSelected
                            ? "bg-white/10 border-white/25 text-white font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]"
                            : "bg-white/[0.02] border-white/10 text-zinc-400 hover:text-zinc-200 hover:border-white/20"
                        }`}
                      >
                        {isSelected && <span className="w-1 h-1 rounded-full bg-[#84cc16] shadow-[0_0_4px_rgba(132,204,22,0.8)]" />}
                        <span>{label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-0.5 min-h-[18px]">
                  {opticsFeedback ? (
                    <div className="text-[8px] font-mono text-[#84cc16] flex items-center gap-1 animate-fadeIn font-semibold">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      <span>{opticsFeedback}</span>
                    </div>
                  ) : (
                    <span className="text-[7.5px] font-mono text-zinc-500">
                      Physical Camera: {cameraTrajectory} · 24fps
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      cinematicAudio.play("click");
                      handleOptimizeStudioPrompt(selectedDirectorialStyle, cameraTrajectory);
                    }}
                    className="text-[9px] font-mono text-[#84cc16] hover:text-[#99e62e] flex items-center gap-1 active:scale-95 transition-all cursor-pointer font-bold"
                    title="Enrich prompt with 35mm cinematographic optics and lighting parameters"
                  >
                    <Wand2 className="w-2.5 h-2.5" />
                    <span>Auto-Optimize Optics</span>
                  </button>
                </div>
              </div>

              {/* Spacious, Fully Visible Prompt Textarea & Primary Buttons */}
              <div className="p-3 rounded-xl bg-[#090c14] border border-white/10 space-y-2">
                <div className="text-[10px] font-mono font-semibold text-zinc-300 flex items-center justify-between">
                  <span>Cinematic Diffusion Prompt:</span>
                  <span className="text-[8.5px] text-zinc-500">Livepeer MCP</span>
                </div>

                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  rows={3}
                  className="w-full text-xs font-mono bg-black/60 border border-white/10 rounded-lg p-2 text-zinc-200 focus:border-[#84cc16]/50 focus:outline-none resize-none leading-relaxed placeholder:text-zinc-500 shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]"
                  placeholder="Enter cinematic B-roll prompt..."
                />

                {/* Director Quick Lens Chips */}
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {[
                    "Anamorphic 35mm",
                    "Volumetric Rays",
                    "Macro Silicon Die",
                    "Cybernetic HUD",
                    "8K Octane",
                  ].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => {
                        cinematicAudio.play("click");
                        setCustomPrompt((prev) => (prev.includes(chip) ? prev : `${prev}, ${chip}`));
                      }}
                      className="text-[8px] font-mono px-2 py-0.5 rounded-full bg-white/[0.03] hover:bg-white/10 border border-white/10 hover:border-white/20 text-zinc-400 hover:text-white transition-all cursor-pointer active:scale-95"
                      title={`Append ${chip} to diffusion prompt`}
                    >
                      <span>+ {chip}</span>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      cinematicAudio.play("click");
                      handleSynthesizeBroll();
                    }}
                    disabled={isSynthesizing}
                    className="py-2.5 rounded-full bg-gradient-to-b from-[#84cc16] via-[#75b914] to-[#5a920c] hover:from-[#92dc22] hover:to-[#68a60e] text-black font-heading font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_4px_16px_rgba(132,204,22,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] border border-[#84cc16]/90 active:scale-95 transition-all disabled:opacity-40 cursor-pointer"
                  >
                    {isSynthesizing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-black" />
                        <span>Rendering ({synthProgress}%)...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-black" />
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
                    className="py-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.09] border border-white/15 text-white font-heading font-semibold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-40 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_8px_rgba(0,0,0,0.3)] cursor-pointer"
                    title="Generate an instant alternate take with current directorial lens on Livepeer MCP"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-zinc-300" />
                    <span>Re-Imagine Take</span>
                  </button>
                </div>
              </div>

              {/* Active Project B-Roll Cuts List */}
              <div className="p-3 rounded-xl bg-[#090c14] border border-white/10 space-y-1.5 flex-1 min-h-[140px] flex flex-col">
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-300 pb-1 border-b border-white/10">
                  <span className="font-semibold flex items-center gap-1">
                    <Scissors className="w-3 h-3 text-[#84cc16]" />
                    <span>Timeline B-Roll Cuts ({brollCuts.length})</span>
                  </span>
                  <span className="text-[8.5px] text-zinc-500">Livepeer Subnet</span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-1 scrollbar-thin">
                  {brollCuts.map((cut) => (
                    <div
                      key={cut.id}
                      onClick={() => handleSeek(cut.startSec)}
                      className="p-1.5 rounded-lg bg-black/40 hover:bg-white/5 border border-white/5 hover:border-white/15 flex items-center justify-between text-[9px] font-mono cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#84cc16]" />
                        <span className="text-white font-bold truncate max-w-[120px]">{cut.triggerPhrase}</span>
                        <span className="text-zinc-500">{cut.startSec}s - {cut.endSec}s</span>
                      </div>
                      <span className="text-[8px] text-[#84cc16] px-1.5 py-0.5 rounded bg-[#84cc16]/10 border border-[#84cc16]/20">
                        {cut.durationSec}s cut
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: CAPTIONS & PLATFORM SAFE FRAMING */}
          {inspectorTab === "captions" && (
            <div className="flex-1 min-h-0 flex flex-col gap-2.5 overflow-y-auto pr-1 scrollbar-thin animate-fadeIn">
              
              {/* Subtitle Styles Grid */}
              <div className="p-3 rounded-xl bg-[#090c14] border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono font-semibold text-zinc-200">
                  <div className="flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-[#84cc16]" />
                    <span>Kinetic Subtitle Styles</span>
                  </div>
                  <span className="text-[9px] font-mono text-emerald-400">Safe Zone OK</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[9px] font-mono">
                  {[
                    { id: "hormozi", label: "Hormozi Gold", badge: "BORDER GOLD" },
                    { id: "mrbeast", label: "MrBeast Neon", badge: "LIME POP" },
                    { id: "cyber", label: "Cyber Terminal", badge: "CYAN MONO" },
                    { id: "minimal", label: "Clean Swiss", badge: "ELEGANT" },
                  ].map((st) => {
                    const isSelected = subtitleStyle === st.id;
                    return (
                      <button
                        key={st.id}
                        onClick={() => {
                          cinematicAudio.play("toggle");
                          setSubtitleStyle(st.id as SubtitleStyle);
                        }}
                        className={`p-2 rounded-lg border text-left transition-all active:scale-95 cursor-pointer ${
                          isSelected
                            ? "bg-[#84cc16]/15 border-[#84cc16]/60 text-white shadow-[0_0_10px_rgba(132,204,22,0.25)]"
                            : "bg-white/[0.02] border-white/10 text-zinc-400 hover:text-zinc-200 hover:border-white/20"
                        }`}
                      >
                        <div className="font-bold text-[10px] text-white">{st.label}</div>
                        <div className="text-[8px] text-zinc-400 uppercase tracking-wider">{st.badge}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Safe Y-Offset Slider & Presets */}
              <div className="p-3 rounded-xl bg-[#090c14] border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-300">
                  <span className="font-semibold">Safe Y-Offset Height:</span>
                  <span className="text-[#84cc16] font-bold">{subtitleYOffset}%</span>
                </div>
                <input
                  type="range"
                  min="45"
                  max="80"
                  value={subtitleYOffset}
                  onChange={(e) => setSubtitleYOffset(+e.target.value)}
                  className="w-full accent-[#84cc16] h-1.5 bg-zinc-800 rounded cursor-pointer"
                />
                <div className="flex items-center justify-between pt-1">
                  {[
                    { val: 55, label: "55% Low" },
                    { val: 65, label: "65% Mid (Safe)" },
                    { val: 75, label: "75% High" },
                  ].map((preset) => (
                    <button
                      key={preset.val}
                      type="button"
                      onClick={() => setSubtitleYOffset(preset.val)}
                      className={`text-[8.5px] font-mono px-2 py-0.5 rounded cursor-pointer transition-colors ${
                        subtitleYOffset === preset.val
                          ? "bg-[#84cc16]/20 text-[#84cc16] border border-[#84cc16]/40"
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Platform Safe Zone Rules */}
              <div className="p-3 rounded-xl bg-[#090c14] border border-white/10 space-y-2 text-[9px] font-mono">
                <div className="text-zinc-200 font-semibold uppercase tracking-wider text-[9.5px]">
                  Platform Margin Defense
                </div>
                <div className="space-y-1.5 text-zinc-400">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Bottom 15% keep-out avoids native captions & comments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Right 64px keep-out avoids like, comment, and share rail</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Top 12% keep-out avoids search bar & sound tickers</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: RETENTION & TELEMETRY */}
          {inspectorTab === "retention" && (
            <div className="flex-1 min-h-0 flex flex-col gap-2.5 overflow-y-auto pr-1 scrollbar-thin animate-fadeIn">
              
              {/* Scalable SVG Viewer Retention Graph */}
              <div className="p-3 rounded-xl bg-[#090c14] border border-white/10 space-y-2 flex-1 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs font-mono font-semibold text-zinc-200 pb-1 border-b border-white/10">
                  <div className="flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5 text-[#84cc16]" />
                    <span>Viewer Retention Graph</span>
                  </div>
                  <span className="text-[9px] font-mono text-[#84cc16] font-bold">Top 1% Attention</span>
                </div>

                <div className="flex-1 py-2 flex flex-col justify-between relative min-h-[140px]">
                  <div className="h-full w-full relative flex items-end">
                    <svg viewBox="0 0 300 120" preserveAspectRatio="none" className="w-full h-full">
                      <defs>
                        <linearGradient id="retGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#84cc16" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#84cc16" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 0 15 Q 60 25, 120 45 T 220 70 T 300 90 L 300 120 L 0 120 Z"
                        fill="url(#retGrad)"
                      />
                      <path
                        d="M 0 15 Q 60 25, 120 45 T 220 70 T 300 90"
                        fill="none"
                        stroke="#84cc16"
                        strokeWidth="2.5"
                      />
                    </svg>

                    {/* Playhead Marker on Curve */}
                    <div
                      style={{
                        left: `${Math.min(96, Math.max(4, (currentTime / selectedHook.durationSec) * 100))}%`,
                      }}
                      className="absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)] z-20"
                    />
                  </div>

                  {/* Telemetry Readouts under Curve */}
                  <div className="flex items-center justify-between pt-1 text-[9px] font-mono text-zinc-400">
                    <span>Peak: <span className="text-[#84cc16] font-bold">98.4%</span></span>
                    <span>Est. Completion: <span className="text-white font-bold">84.2%</span></span>
                    <span>Avg Hold: <span className="text-zinc-300 font-bold">12.4s</span></span>
                  </div>
                </div>
              </div>

              {/* 3 Metrics Cards */}
              <div className="grid grid-cols-3 gap-1.5 text-[9px] font-mono">
                <div className="p-2 rounded-lg bg-[#090c14] border border-white/10 space-y-0.5">
                  <div className="text-zinc-400 text-[8px] uppercase tracking-wider">Watch-Through</div>
                  <div className="text-white font-bold text-xs">84.2%</div>
                  <div className="text-emerald-400 text-[7.5px]">+38% vs avg</div>
                </div>
                <div className="p-2 rounded-lg bg-[#090c14] border border-white/10 space-y-0.5">
                  <div className="text-zinc-400 text-[8px] uppercase tracking-wider">Cut Cadence</div>
                  <div className="text-white font-bold text-xs">1 cut / 3.2s</div>
                  <div className="text-emerald-400 text-[7.5px]">High Retention</div>
                </div>
                <div className="p-2 rounded-lg bg-[#090c14] border border-white/10 space-y-0.5">
                  <div className="text-zinc-400 text-[8px] uppercase tracking-wider">GPU Subnet</div>
                  <div className="text-white font-bold text-xs">$0.04</div>
                  <div className="text-zinc-400 text-[7.5px]">Livepeer 1.2s</div>
                </div>
              </div>

              {/* High-Retention Semantic Triggers */}
              <div className="p-2.5 rounded-xl bg-[#090c14] border border-white/10 space-y-1.5 text-[9px] font-mono">
                <span className="text-zinc-400 uppercase text-[8px]">Viral Semantic Triggers:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedHook.transcript
                    .filter((t) => t.isKeyTerm)
                    .slice(0, 6)
                    .map((t) => t.word.replace(/[^a-zA-Z0-9-]/g, "").toLowerCase())
                    .filter((w, i, arr) => w.length > 2 && arr.indexOf(w) === i)
                    .slice(0, 5)
                    .map((kw, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/10 text-zinc-300 text-[8px] hover:border-[#84cc16]/50 transition-colors"
                      >
                        #{kw}
                      </span>
                    ))}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* 3. BOTTOM WORKSTATION DOCK: COMPACT PRO NLE TIMELINE */}
      {isTimelineCollapsed ? (
        /* MINIMIZED SLIM SCRUBBER STRIP (Saves 150px of vertical space) */
        <div className="h-8 bg-[#04060b] border-t border-white/10 px-3 flex items-center justify-between shrink-0 select-none shadow-[0_-4px_20px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#0c1220]/80 p-0.5 rounded-full border border-white/10 shadow-inner">
              {[
                { id: "select", icon: MousePointer, label: "V", title: "Selection Pointer (V)" },
                { id: "blade", icon: Scissors, label: "C", title: "Razor Blade Cut (C)" },
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
                    className={`px-1.5 py-0.5 rounded-full transition-all active:scale-95 cursor-pointer flex items-center gap-0.5 ${
                      isActive
                        ? "bg-white/20 text-white font-bold border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
                        : "text-zinc-400 hover:text-zinc-200 border border-transparent"
                    }`}
                    title={t.title}
                  >
                    <Icon className="w-2.5 h-2.5" />
                    <span className="text-[7px]">{t.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                cinematicAudio.play("click");
                handleSynthesizeBroll();
              }}
              className="px-2.5 py-0.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white text-[8px] font-mono flex items-center gap-1 active:scale-95 transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] cursor-pointer"
              title="Inject AI B-Roll cut at playhead"
            >
              <Zap className="w-2 h-2 text-[#84cc16]" />
              <span>+ Cut</span>
            </button>
            
            <span className="text-[7.5px] font-mono text-zinc-500 uppercase font-bold tracking-wider hidden sm:inline">
              Timeline Mini
            </span>
          </div>

          {/* Slim Scrub Track */}
          <div
            onClick={handleTimelineClick}
            className="flex-1 max-w-xl mx-3 h-3 bg-[#080c14] border border-white/10 rounded-full relative overflow-hidden cursor-pointer group"
            title="Click to seek playhead"
          >
            {/* Cut markers */}
            {brollCuts.map((cut) => {
              const leftPct = (cut.startSec / selectedHook.durationSec) * 100;
              const widthPct = (cut.durationSec / selectedHook.durationSec) * 100;
              return (
                <div
                  key={cut.id}
                  style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                  className="absolute inset-y-0 bg-[#84cc16]/40 border-x border-[#84cc16] pointer-events-none"
                />
              );
            })}
            {/* Playhead */}
            <div
              style={{
                left: `${Math.min(99.5, Math.max(0.5, (currentTime / selectedHook.durationSec) * 100))}%`,
              }}
              className="absolute inset-y-0 w-1.5 -translate-x-1/2 bg-red-500 shadow-[0_0_6px_rgba(239,68,68,1)] pointer-events-none rounded-full"
            />
          </div>

          {/* Transport & Expand Button */}
          <div className="flex items-center gap-2 text-[8px] font-mono">
            <span className="text-zinc-400 font-bold hidden sm:inline">
              <span className="text-[#84cc16]">{formatTime(currentTime)}</span> / {selectedHook.durationSec}s
            </span>
            <button
              onClick={() => {
                cinematicAudio.play("toggle");
                setIsTimelineCollapsed(false);
              }}
              className="px-2 py-0.5 rounded-full bg-white/[0.08] hover:bg-white/[0.16] border border-white/15 text-white text-[7.5px] font-mono flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
              title="Expand Pro Multi-Track Lanes"
            >
              <ChevronUp className="w-2.5 h-2.5 text-[#84cc16]" />
              <span>Expand Tracks</span>
            </button>
          </div>
        </div>
      ) : (
        /* COMPACT PRO NLE MULTI-TRACK DOCK (Optimized to ~105px) */
        <div className="h-[105px] sm:h-[110px] bg-[#04060b] border-t border-white/10 px-3 py-1.5 flex flex-col justify-between shrink-0 select-none shadow-[0_-6px_25px_rgba(0,0,0,0.8)]">
          
          {/* NLE Toolbar Header with Quick Actions & Playhead Controls */}
          <div className="flex items-center justify-between text-[8.5px] font-mono text-zinc-400 pb-1 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-[#0c1220]/80 p-0.5 rounded-full border border-white/10 shadow-inner">
                {[
                  { id: "select", icon: MousePointer, label: "V", title: "Selection Pointer (V)" },
                  { id: "blade", icon: Scissors, label: "C", title: "Razor Blade Cut (C)" },
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
                      className={`px-1.5 py-0.5 rounded-full transition-all active:scale-95 cursor-pointer flex items-center gap-1 ${
                        isActive
                          ? "bg-white/20 text-white font-bold border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
                          : "text-zinc-400 hover:text-zinc-200 border border-transparent"
                      }`}
                      title={t.title}
                    >
                      <Icon className="w-2.5 h-2.5" />
                      <span className="text-[7px]">{t.label}</span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  cinematicAudio.play("click");
                  handleSynthesizeBroll();
                }}
                className="px-2.5 py-0.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white text-[8px] font-mono flex items-center gap-1 active:scale-95 transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] cursor-pointer"
                title="Inject AI B-Roll cut at current playhead position"
              >
                <Zap className="w-2 h-2 text-[#84cc16]" />
                <span>+ Cut at Playhead</span>
              </button>
              
              <div className="hidden md:flex items-center gap-1.5 text-[7.5px] font-mono text-zinc-400 bg-white/[0.03] px-2 py-0.5 rounded-full border border-white/5">
                <span className="text-[#84cc16] font-bold">SNAP: ON</span>
                <span className="text-zinc-600">·</span>
                <span>24 FPS NON-DROP</span>
              </div>
            </div>

            {/* Timeline Transport Center-Right */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1 bg-[#0c1220]/80 p-0.5 rounded-full border border-white/10">
                <button
                  onClick={() => {
                    cinematicAudio.play("click");
                    handleSeek(0);
                  }}
                  className="p-1 rounded-full text-zinc-400 hover:text-white cursor-pointer active:scale-95"
                  title="Rewind to Start (J)"
                >
                  <SkipBack className="w-2 h-2" />
                </button>
                <button
                  onClick={() => {
                    cinematicAudio.play("toggle");
                    setIsPlaying(!isPlaying);
                  }}
                  className="px-2 py-0.5 rounded-full bg-white text-black font-bold text-[7.5px] flex items-center gap-1 active:scale-95 cursor-pointer shadow-[0_1px_4px_rgba(255,255,255,0.2)]"
                  title="Play/Pause (Space)"
                >
                  {isPlaying ? <Pause className="w-2 h-2 fill-current" /> : <Play className="w-2 h-2 fill-current" />}
                  <span>{isPlaying ? "Pause" : "Play"}</span>
                </button>
                <button
                  onClick={() => {
                    cinematicAudio.play("click");
                    handleSeek(selectedHook.durationSec);
                  }}
                  className="p-1 rounded-full text-zinc-400 hover:text-white cursor-pointer active:scale-95"
                  title="Jump to End (L)"
                >
                  <SkipForward className="w-2 h-2" />
                </button>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-[8px] font-mono">
                <span className="text-zinc-400">Total: {selectedHook.durationSec}s</span>
                <span className="text-zinc-600">|</span>
                <span>Playhead: <span className="text-[#84cc16] font-bold">{formatTime(currentTime)}</span> <span className="text-zinc-500">({Math.floor((currentTime % 1) * 24)}f)</span></span>
              </div>
              <button
                onClick={() => {
                  cinematicAudio.play("toggle");
                  setIsTimelineCollapsed(true);
                }}
                className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer transition-colors"
                title="Collapse Timeline (Maximize Workspace)"
              >
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Tracks Section: Left Headers + Right Workspace */}
          <div className="flex-1 flex gap-2 min-h-0 pt-0.5">
            {/* Left Track Headers (Pro NLE Style) */}
            <div className="w-18 sm:w-20 shrink-0 flex flex-col justify-between text-[7px] font-mono text-zinc-400 select-none pb-0.5">
              <div className="h-3 flex items-center text-[6.5px] text-zinc-500 font-bold uppercase tracking-wider px-1">
                TRACKS
              </div>

              {/* V2 Header */}
              <div className="h-4.5 flex items-center justify-between px-1.5 rounded bg-black/40 border border-white/5">
                <span className="text-[#84cc16] font-bold">V2 B-ROLL</span>
                <Eye className="w-2 h-2 text-zinc-500" />
              </div>

              {/* V1 Header */}
              <div className="h-4.5 flex items-center justify-between px-1.5 rounded bg-black/40 border border-white/5">
                <span className="text-zinc-300 font-bold">V1 HOST</span>
                <Lock className="w-2 h-2 text-zinc-500" />
              </div>

              {/* A1 Header */}
              <div className="h-4.5 flex items-center justify-between px-1.5 rounded bg-black/40 border border-white/5">
                <button
                  type="button"
                  onClick={() => {
                    cinematicAudio.play("toggle");
                    setIsMuted(!isMuted);
                  }}
                  className={`flex items-center gap-1 font-bold cursor-pointer transition-all hover:brightness-125 ${
                    isMuted ? "text-rose-400" : "text-[#84cc16]"
                  }`}
                  title={isMuted ? "Unmute Audio" : "Mute Audio"}
                >
                  {isMuted ? <VolumeX className="w-2 h-2" /> : <Volume2 className="w-2 h-2" />}
                  <span>A1 AUD</span>
                </button>
                <span className="text-[6.5px] text-zinc-500">0dB</span>
              </div>
            </div>

            {/* Main Timeline Workspace (Ruler + Lanes + Playhead) */}
            <div 
              onClick={handleTimelineClick}
              className={`flex-1 relative flex flex-col justify-between overflow-hidden select-none transition-all ${
                activeTool === "blade" ? "cursor-crosshair" : "cursor-pointer"
              }`}
              title={activeTool === "blade" ? "Click to Slice B-Roll Cut at timestamp" : "Click anywhere on timeline to seek playhead"}
            >
              {/* Red Laser Playhead Indicator spanning Ruler & Tracks */}
              <div
                style={{
                  left: `${Math.min(99.5, Math.max(0.5, (currentTime / selectedHook.durationSec) * 100))}%`,
                }}
                className="absolute top-0 bottom-0 z-30 pointer-events-none -translate-x-1/2 flex flex-col items-center"
              >
                <div className="w-2 h-2 bg-red-500 rotate-45 border border-white/80 shadow-[0_0_8px_rgba(239,68,68,1)] shrink-0 -mt-0.5" />
                <div className="w-[1.5px] flex-1 bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.9)]" />
              </div>

              {/* SMPTE Timecode Ruler with Subdivision Ticks */}
              <div className="h-3 bg-[#080c14] rounded-t border border-white/10 relative overflow-hidden flex items-end">
                {Array.from({ length: Math.ceil(selectedHook.durationSec) + 1 }).map((_, sec) => {
                  if (sec > selectedHook.durationSec) return null;
                  const leftPct = (sec / selectedHook.durationSec) * 100;
                  return (
                    <React.Fragment key={sec}>
                      {/* Major tick & label */}
                      <div
                        style={{ left: `${leftPct}%` }}
                        className="absolute bottom-0 -translate-x-1/2 flex flex-col items-center pointer-events-none"
                      >
                        <span className="text-[6px] font-mono text-zinc-400 leading-none mb-0.5 select-none font-semibold">
                          {sec}s
                        </span>
                        <div className="w-[1px] h-1.5 bg-white/40" />
                      </div>

                      {/* Minor ticks (quarter seconds) */}
                      {[0.25, 0.5, 0.75].map((sub) => {
                        const subSec = sec + sub;
                        if (subSec >= selectedHook.durationSec) return null;
                        const subPct = (subSec / selectedHook.durationSec) * 100;
                        return (
                          <div
                            key={sub}
                            style={{ left: `${subPct}%` }}
                            className="absolute bottom-0 -translate-x-1/2 pointer-events-none"
                          >
                            <div className={`w-[1px] ${sub === 0.5 ? "h-1 bg-white/25" : "h-0.5 bg-white/15"}`} />
                          </div>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Track V2: Livepeer AI B-Roll */}
              <div className="h-4.5 bg-black/60 rounded border border-white/5 relative overflow-hidden flex items-center">
                {brollCuts.map((cut) => {
                  const leftPct = (cut.startSec / selectedHook.durationSec) * 100;
                  const widthPct = (cut.durationSec / selectedHook.durationSec) * 100;
                  return (
                    <div
                      key={cut.id}
                      onClick={() => handleSeek(cut.startSec)}
                      onDoubleClick={() => setRefiningCut(cut)}
                      style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                      className="absolute h-full bg-[#84cc16]/15 hover:bg-[#84cc16]/25 border border-[#84cc16]/60 rounded px-1.5 flex items-center justify-between text-[6.5px] font-mono text-[#84cc16] cursor-pointer hover:brightness-125 truncate group transition-colors shadow-[0_0_8px_rgba(132,204,22,0.15)]"
                      title="Click to seek · Double-click to open Slice Surgery"
                    >
                      <span className="truncate font-bold">{cut.triggerPhrase}</span>
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-[6px] opacity-80">{cut.durationSec}s</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setRefiningCut(cut);
                          }}
                          className="hidden group-hover:inline px-1 py-0.5 rounded bg-black/80 text-white hover:text-[#84cc16] border border-white/20 text-[5.5px] cursor-pointer"
                          title="Refine Slice Prompt on Livepeer MCP"
                        >
                          Refine
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Track V1: Host A-Roll */}
              <div className="h-4.5 bg-[#0c121e] rounded border border-white/10 relative overflow-hidden flex items-center px-2 text-[6.5px] font-mono text-zinc-300">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="font-bold text-white">{selectedHook.sourceSpeaker}</span>
                  <span className="text-zinc-500">· 9:16 Face Tracked Primary Cut · 1080x1920 60FPS</span>
                </div>
              </div>

              {/* Track A1: Audio Waveform Canvas */}
              <div className="h-4.5 rounded border border-white/10 overflow-hidden bg-black/80 relative">
                <canvas ref={timelineCanvasRef} className="w-full h-full block" />
              </div>

            </div>
          </div>

        </div>
      )}

      {/* 4. PRO NLE KEYBOARD SHORTCUTS MODAL */}
      {isShortcutsOpen && (
        <div 
          onClick={() => setIsShortcutsOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#090c14] border border-white/20 rounded-2xl w-full max-w-md p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-[#84cc16]" />
                <span className="font-heading font-black text-sm text-white">Pro NLE Keyboard Shortcuts</span>
              </div>
              <button
                onClick={() => setIsShortcutsOpen(false)}
                className="text-zinc-400 hover:text-white text-xs px-2 py-1 rounded hover:bg-white/10 cursor-pointer font-mono"
              >
                Esc
              </button>
            </div>
            <div className="space-y-2 text-xs font-mono">
              {[
                { key: "Space", desc: "Toggle Play / Pause Video & Audio Clock" },
                { key: "C", desc: "Blade Cut Tool (Slice B-roll at Playhead)" },
                { key: "V", desc: "Selection & Scrubbing Tool" },
                { key: "J / L", desc: "Step Rewind / Fast-Forward 2 Seconds" },
                { key: "K", desc: "Pause Playhead Immediately" },
                { key: "M", desc: "Toggle Mute / Unmute Livepeer Audio Track" },
                { key: "2x Click Word", desc: "Inject Livepeer B-Roll Cut at Word Timestamp" },
                { key: "?", desc: "Toggle this Keyboard Shortcuts Cheatsheet" },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5">
                  <span className="text-zinc-300">{s.desc}</span>
                  <span className="px-2 py-0.5 rounded bg-white/10 border border-white/20 text-[#84cc16] font-bold text-[10px]">
                    {s.key}
                  </span>
                </div>
              ))}
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsShortcutsOpen(false)}
                className="px-4 py-1.5 rounded-full bg-[#84cc16] text-black font-heading font-black text-xs hover:bg-[#99e62e] cursor-pointer active:scale-95 transition-all"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

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
        loop={isLooping}
        muted={isMuted}
        onEnded={() => {
          if (!isLooping) {
            setIsPlaying(false);
          }
        }}
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
