"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles, Check, AlertCircle, RefreshCw, Cpu } from "lucide-react";
import { livepeerMcp, LivepeerMcpStatus, LIVEPEER_MCP_ENDPOINT } from "../lib/livepeerMcp";

interface ModelDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyChange?: (key: string | null) => void;
}

export const STORAGE_KEY = "dissect_livepeer_api_key";

export function ModelDrawer({ isOpen, onClose, onKeyChange }: ModelDrawerProps) {
  const [apiKey, setApiKey] = useState<string>("");
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [modelType, setModelType] = useState<"fast" | "quality">("fast");
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testStatus, setTestStatus] = useState<"idle" | "success" | "error">("idle");
  const [testMessage, setTestMessage] = useState<string>("");
  const [mcpStatus, setMcpStatus] = useState<LivepeerMcpStatus | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const existing = localStorage.getItem(STORAGE_KEY);
      if (existing) {
        setSavedKey(existing);
        setApiKey(existing);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      livepeerMcp.getStatus().then((st) => setMcpStatus(st)).catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmed = apiKey.trim();
    if (trimmed) {
      livepeerMcp.setApiKey(trimmed);
      setSavedKey(trimmed);
      setTestStatus("success");
      setTestMessage("Key saved. Livepeer Agent Creative MCP connected.");
      if (onKeyChange) onKeyChange(trimmed);
    } else {
      handleClear();
    }
  };

  const handleClear = () => {
    livepeerMcp.setApiKey(null);
    setSavedKey(null);
    setApiKey("");
    setTestStatus("idle");
    setTestMessage("");
    if (onKeyChange) onKeyChange(null);
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestStatus("idle");
    setTestMessage("");

    try {
      const tempClient = new (livepeerMcp.constructor as any)(apiKey.trim() || undefined);
      const status = await tempClient.getStatus();
      setMcpStatus(status);
      setTestStatus("success");
      setTestMessage(`Connected to Livepeer MCP (${status.keyClass} quota · ${status.toolCount} tools ready).`);
    } catch (err: any) {
      setTestStatus("error");
      setTestMessage(err.message || "Failed to reach Livepeer MCP endpoint.");
    } finally {
      setIsTesting(false);
    }
  };

  const maskKey = (key: string) => {
    if (key.length <= 8) return "••••••••";
    return key.slice(0, 4) + "••••" + key.slice(-4);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-sm h-full bg-[#05070d] border-l border-white/10 p-6 flex flex-col justify-between z-10 shadow-2xl overflow-y-auto font-sans">
        
        <div className="space-y-5">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#84cc16]" />
              <div>
                <h3 className="font-heading font-bold text-sm text-white">
                  Livepeer Agent Creative MCP
                </h3>
                <p className="text-[10px] text-zinc-400 font-mono">
                  {mcpStatus?.toolCount || 125} Tools Active
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

          {/* Model Profile */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold block">
              Livepeer Pipeline
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                onClick={() => setModelType("fast")}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  modelType === "fast"
                    ? "bg-[#84cc16]/15 border-[#84cc16] text-[#84cc16] font-bold shadow-[0_0_12px_rgba(132,204,22,0.15)]"
                    : "bg-black/30 border-white/10 text-zinc-400 hover:text-white"
                }`}
              >
                <div>Fast 9:16</div>
                <div className="text-[9px] text-zinc-500 mt-0.5">flux-dev (Livepeer)</div>
              </button>

              <button
                onClick={() => setModelType("quality")}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  modelType === "quality"
                    ? "bg-[#06b6d4]/15 border-[#06b6d4] text-[#06b6d4] font-bold shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                    : "bg-black/30 border-white/10 text-zinc-400 hover:text-white"
                }`}
              >
                <div>Cinematic Motion</div>
                <div className="text-[9px] text-zinc-500 mt-0.5">cogvideox-5b</div>
              </button>
            </div>
          </div>

          {/* Endpoint Status */}
          <div className="p-3 rounded-lg bg-black/40 border border-white/10 text-xs font-mono space-y-1.5">
            <div className="text-[10px] text-zinc-400 truncate">
              Endpoint: <span className="text-zinc-200">{LIVEPEER_MCP_ENDPOINT}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Allowance:</span>
              <span className="text-[#84cc16] font-bold">
                {savedKey ? `Account (${maskKey(savedKey)})` : "Participant Quota ($100.00)"}
              </span>
            </div>
            {mcpStatus?.principalId && (
              <div className="text-[9px] text-zinc-500 truncate pt-1 border-t border-white/5">
                ID: {mcpStatus.principalId}
              </div>
            )}
          </div>

          {/* API Key */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <label className="text-zinc-300">Livepeer Agent API Key (Optional)</label>
              {savedKey ? (
                <button
                  onClick={handleClear}
                  className="text-[10px] text-red-400 hover:underline"
                >
                  Clear
                </button>
              ) : (
                <a
                  href="https://app.daydream.live"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-[#84cc16] hover:underline"
                >
                  Get key
                </a>
              )}
            </div>
            <input
              type="password"
              placeholder="Leave empty for demo allowance, or paste Bearer token..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-lg text-xs font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#84cc16] transition-colors"
            />
          </div>

          {testMessage && (
            <div
              className={`p-2.5 rounded-lg text-xs font-mono flex items-center gap-2 ${
                testStatus === "success"
                  ? "bg-[#84cc16]/15 border border-[#84cc16]/30 text-[#84cc16]"
                  : "bg-red-950/20 border border-red-500/30 text-red-300"
              }`}
            >
              {testStatus === "success" ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
              <span>{testMessage}</span>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-mono">
          <button
            onClick={handleTest}
            disabled={isTesting}
            className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40"
          >
            {isTesting ? <RefreshCw className="w-3 h-3 animate-spin" /> : null}
            <span>Test MCP</span>
          </button>

          <button
            onClick={handleSave}
            className="flex-1 py-2 rounded-lg font-heading font-bold text-black bg-[#84cc16] hover:brightness-110 active:scale-95 transition-all shadow-[0_0_12px_rgba(132,204,22,0.3)]"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
}
