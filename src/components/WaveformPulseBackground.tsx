"use client";

import React, { useEffect, useRef } from "react";

export function WaveformPulseBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Stream Convergence Particles
    interface StreamParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      targetX: number;
      targetY: number;
      color: string;
      size: number;
      alpha: number;
    }

    const streamParticles: StreamParticle[] = Array.from({ length: 65 }, (_, i) => {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        targetX: width / 2,
        targetY: height * 0.45,
        color: i % 3 === 0 ? "#84cc16" : i % 3 === 1 ? "#06b6d4" : "#f43f5e",
        size: 1 + Math.random() * 2,
        alpha: 0.2 + Math.random() * 0.5,
      };
    });

    let time = 0;

    const render = () => {
      time += 0.02;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Pitch Charcoal Background
      ctx.fillStyle = "#07080d";
      ctx.fillRect(0, 0, width, height);

      const phoneCx = width / 2;
      const phoneCy = height * 0.45;

      // 1. Tideform Phase Field (Harmonic Multi-Octave Ribbons)
      const ribbons = [
        { yRel: 0.32, amp: 45, freq: 0.003, speed: 1.2, color: "rgba(132, 204, 22, 0.12)" },
        { yRel: 0.42, amp: 55, freq: 0.004, speed: -0.9, color: "rgba(6, 182, 212, 0.10)" },
        { yRel: 0.52, amp: 38, freq: 0.005, speed: 1.5, color: "rgba(244, 63, 94, 0.08)" },
        { yRel: 0.62, amp: 60, freq: 0.0025, speed: -1.1, color: "rgba(132, 204, 22, 0.06)" },
      ];

      ribbons.forEach((ribbon) => {
        ctx.beginPath();
        const baseCy = height * ribbon.yRel;

        ctx.moveTo(0, baseCy);
        for (let x = 0; x <= width; x += 15) {
          const mouseDist = Math.hypot(x - mouse.x, baseCy - mouse.y);
          const mouseDisplace = Math.max(0, 1 - mouseDist / 350) * 40;

          const y =
            baseCy +
            Math.sin(x * ribbon.freq + time * ribbon.speed) * ribbon.amp +
            Math.cos(x * ribbon.freq * 1.6 - time * ribbon.speed * 0.8) * (ribbon.amp * 0.4) +
            Math.sin(time * 2) * mouseDisplace;

          ctx.lineTo(x, y);
        }

        ctx.strokeStyle = ribbon.color;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      });

      // 2. Stream Convergence (Particles flowing inward toward mobile focal point)
      streamParticles.forEach((p) => {
        // Gravitational pull toward central viewport
        const dx = phoneCx - p.x;
        const dy = phoneCy - p.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 30) {
          p.x += (dx / dist) * (1.2 + p.size * 0.5) + p.vx;
          p.y += (dy / dist) * (1.2 + p.size * 0.5) + p.vy;
        } else {
          // Reset to edge
          p.x = Math.random() > 0.5 ? (Math.random() > 0.5 ? 0 : width) : Math.random() * width;
          p.y = Math.random() > 0.5 ? (Math.random() > 0.5 ? 0 : height) : Math.random() * height;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // 3. Audio Frequency Spectrum Equilizer at Bottom
      const bars = 44;
      const bw = 3;
      const bgap = 5;
      const totalBw = bars * (bw + bgap);
      const startBx = (width - totalBw) / 2;

      for (let b = 0; b < bars; b++) {
        const bx = startBx + b * (bw + bgap);
        const bh = 6 + Math.abs(Math.sin(time * 2 + b * 0.28)) * 26;
        ctx.fillStyle = b % 2 === 0 ? "rgba(132, 204, 22, 0.25)" : "rgba(6, 182, 212, 0.25)";
        ctx.fillRect(bx, height - 35 - bh, bw, bh);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ contain: "strict" }}
    />
  );
}
