export interface TranscriptWord {
  word: string;
  startSec: number;
  endSec: number;
  isKeyTerm?: boolean;
}

export interface VideoHook {
  id: string;
  title: string;
  sourceSpeaker: string;
  sourceVideoTitle: string;
  startSec: number;
  endSec: number;
  durationSec: number;
  retentionScore: number;
  viralCategory: string;
  quoteText: string;
  transcript: TranscriptWord[];
  speakerVideoUrl: string;
}

export interface BrollCut {
  id: string;
  startSec: number;
  endSec: number;
  durationSec: number;
  triggerPhrase: string;
  prompt: string;
  videoUrl: string;
  posterUrl: string;
  orchestratorNode: string;
  status: "synthesized" | "rendering" | "ready" | "synthesizing";
  costUsd: number;
}

export interface ActiveSpeakerFrame {
  timestampSec: number;
  xPct: number;
  yPct: number;
  zoom: number;
}
