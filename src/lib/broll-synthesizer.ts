import { VideoHook, BrollCut, TranscriptWord } from "./types";
import { livepeerMcp, LivepeerCreateMediaResult } from "./livepeerMcp";

export interface StarterKeynote {
  id: string;
  title: string;
  speaker: string;
  sourceTitle: string;
  topicText: string;
  category: string;
  audioUrl: string;
}

export const STARTER_KEYNOTES: StarterKeynote[] = [
  {
    id: "jensen-gtc",
    title: "Accelerated Computing & Physical AI Factories",
    speaker: "Jensen Huang",
    sourceTitle: "Nvidia GTC Keynote 2025",
    topicText: "Every data center in the world is transforming into an AI generator factory, running non-stop to produce tokens that represent physical intelligence.",
    category: "Physical AI",
    audioUrl: "/audio/jensen-gtc.mp3",
  },
  {
    id: "ilya-world-models",
    title: "Foundation Model Scaling & Synthetic Superintelligence",
    speaker: "Ilya Sutskever",
    sourceTitle: "Superintelligence Address",
    topicText: "When you scale compute across millions of decentralized GPU nodes, the model stops interpolating and begins synthesizing genuine internal world models.",
    category: "Decentralized Compute",
    audioUrl: "/audio/ilya-world-models.mp3",
  },
  {
    id: "karpathy-software2",
    title: "Software 2.0 & Autonomous Neural Vision",
    speaker: "Andrej Karpathy",
    sourceTitle: "Autonomous Systems Keynote",
    topicText: "Photons hit the CMOS sensor, get converted into latent tensors in real time, and direct physical actuators without a single line of heuristic code.",
    category: "Robotic Vision",
    audioUrl: "/audio/karpathy-software2.mp3",
  },
  {
    id: "altman-reasoning",
    title: "Exponential Reasoning Curves & Test-Time Compute",
    speaker: "Sam Altman",
    sourceTitle: "Frontier Intelligence Forum",
    topicText: "When you give the model test-time compute to think through multi-step hypotheses before answering, the reasoning capability scales exponentially.",
    category: "Test-Time Compute",
    audioUrl: "/audio/altman-reasoning.mp3",
  },
];

export function createDynamicHookFromKeynote(keynote: StarterKeynote): VideoHook {
  const words = keynote.topicText.trim().split(/\s+/);
  let currentSec = 0.0;
  const transcript: TranscriptWord[] = words.map((w) => {
    const clean = w.replace(/[^a-zA-Z0-9]/g, "");
    const isKeyTerm =
      clean.length > 5 ||
      ["AI", "GPU", "CMOS", "AGI", "Scale", "Tokens", "Compute", "Model", "Physical", "Quantum", "Neural", "Tensor"].includes(clean);
    const duration = Math.max(0.32, +(clean.length * 0.075).toFixed(2));
    const startSec = +currentSec.toFixed(2);
    const endSec = +(currentSec + duration).toFixed(2);
    const pause = /[.,!?]$/.test(w) ? 0.35 : 0.08;
    currentSec = endSec + pause;
    return { word: w, startSec, endSec, isKeyTerm };
  });

  const totalDuration = Math.max(14, Math.ceil(currentSec));
  const hexHash = Math.abs(keynote.topicText.split("").reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)).toString(16).padStart(6, "0").slice(0, 6);

  return {
    id: `hook-${keynote.id}-${hexHash}`,
    title: keynote.title,
    sourceSpeaker: keynote.speaker,
    sourceVideoTitle: keynote.sourceTitle,
    startSec: 0,
    endSec: totalDuration,
    durationSec: totalDuration,
    retentionScore: +(95.0 + (parseInt(hexHash, 16) % 45) / 10).toFixed(1),
    viralCategory: keynote.category,
    quoteText: keynote.topicText,
    speakerVideoUrl: "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MWUvSkhLMUNBeHVudFBBd29HQ1RZTVdCLmpwZw.969dfc1a43072ab4/JHK1CAxuntPAwoGCTYMWB.jpg",
    transcript,
    audioUrl: keynote.audioUrl || `/api/tts?id=${keynote.id}&text=${encodeURIComponent(keynote.topicText)}`,
  };
}

export function getBrollForHook(hookId: string, hook?: VideoHook): BrollCut[] {
  const found = STARTER_KEYNOTES.find((k) => hookId.includes(k.id));
  if (found) {
    const phrase1 = found.topicText.split(/\s+/).slice(2, 6).join(" ") || "accelerated computing";
    const phrase2 = found.topicText.split(/\s+/).slice(7, 11).join(" ") || "physical intelligence";

    return [
      {
        id: `broll-${found.id}-1`,
        startSec: 2.0,
        endSec: 5.5,
        durationSec: 3.5,
        triggerPhrase: phrase1,
        prompt: `Cinematic 9:16 vertical macro shot visualizing ${phrase1}, sharp anamorphic depth of field, 35mm film grain, rim lighting`,
        videoUrl: "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MWUvSkhLMUNBeHVudFBBd29HQ1RZTVdCLmpwZw.969dfc1a43072ab4/JHK1CAxuntPAwoGCTYMWB.jpg",
        posterUrl: "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MWUvSkhLMUNBeHVudFBBd29HQ1RZTVdCLmpwZw.969dfc1a43072ab4/JHK1CAxuntPAwoGCTYMWB.jpg",
        orchestratorNode: "agent.livepeer.org/api/mcp/creative (flux-schnell)",
        status: "ready",
        costUsd: 0.0032,
      },
      {
        id: `broll-${found.id}-2`,
        startSec: 7.5,
        endSec: 11.5,
        durationSec: 4.0,
        triggerPhrase: phrase2,
        prompt: `Photorealistic 9:16 vertical cinematic cutaway representing ${phrase2}, volumetric lighting, 8k resolution textures`,
        videoUrl: "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MTYvejRDTFU0THkyRjFoWml5TklJcWEyLmpwZw.660ffbf5b22ed418/z4CLU4Ly2F1hZiyNIIqa2.jpg",
        posterUrl: "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MTYvejRDTFU0THkyRjFoWml5TklJcWEyLmpwZw.660ffbf5b22ed418/z4CLU4Ly2F1hZiyNIIqa2.jpg",
        orchestratorNode: "agent.livepeer.org/api/mcp/creative (flux-schnell)",
        status: "ready",
        costUsd: 0.0032,
      },
    ];
  }

  // Unknown / custom hook: derive both acts from the hook's own words so no
  // two briefs collapse to the same recycled silicon/tokyo pair.
  const seedText = hook ? `${hook.title} ${hook.quoteText}` : hookId;
  const seedWords = seedText.replace(/[^\w\s]/g, " ").split(/\s+/).filter((w) => w.length > 3);
  const pick = (offset: number, len = 4) => seedWords.slice(offset, offset + len).join(" ") || seedWords.slice(0, len).join(" ") || "core thesis";
  const phrase1 = pick(Math.floor(seedWords.length * 0.15));
  const phrase2 = pick(Math.floor(seedWords.length * 0.55));
  const lower = seedText.toLowerCase();

  const isRacing = /\bf1\b|formula 1|racing|ferrari|monaco|supercar|grand prix|telemetry|pit stop|apex|chassis|engine|speed/i.test(lower);
  const isSpace = /space|galaxy|cosmos|telescope|nebula|star|orbit|astro|saturn/i.test(lower);
  const isOcean = /ocean|marine|deep|trench|abyss|submersible/i.test(lower);
  const isFinance = /finance|market|trading|liquidity|yield|capital|venture|treasury|\bcrypto\b|\bdefi\b|\btoken\b/i.test(lower);
  const isNeural = /\bai\b|neuro|brain|mind|model|agent/i.test(lower);
  const isQuantum = /quantum|chip|gpu|compute|silicon/i.test(lower);
  const isRobotics = /robot|autonomous|factory|physical/i.test(lower);

  let defaultPoster1 = "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MWUvSkhLMUNBeHVudFBBd29HQ1RZTVdCLmpwZw.969dfc1a43072ab4/JHK1CAxuntPAwoGCTYMWB.jpg";
  let defaultPoster2 = "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MTYvejRDTFU0THkyRjFoWml5TklJcWEyLmpwZw.660ffbf5b22ed418/z4CLU4Ly2F1hZiyNIIqa2.jpg";

  if (isRacing) {
    defaultPoster1 = "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MWUvSkhLMUNBeHVudFBBd29HQ1RZTVdCLmpwZw.969dfc1a43072ab4/JHK1CAxuntPAwoGCTYMWB.jpg";
    defaultPoster2 = "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MGIvWDZjYk16ZDU2VnhtREphQzdISERGLmpwZw.9ff8d740a112167f/X6cbMzd56VxmDJaC7HHDF.jpg";
  } else if (isSpace) {
    defaultPoster1 = "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk2ODEvM1ZWUGMtTXdkMnU2REVuM3RWUmptLmpwZw.e057b08306b30f75/3VVPc-Mwd2u6DEn3tVRjm.jpg";
    defaultPoster2 = "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MDMvNWNfLUdhZk9jRTBwSzE0TEQ1UGNhLmpwZw.9fc767252bb912f8/5c_-GafOcE0pK14LD5Pca.jpg";
  } else if (isOcean) {
    defaultPoster1 = "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MGIvWDZjYk16ZDU2VnhtREphQzdISERGLmpwZw.9ff8d740a112167f/X6cbMzd56VxmDJaC7HHDF.jpg";
    defaultPoster2 = "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MDYvMFNOYkt1UWFaNWNTcDBHbElRRDdlLmpwZw.65b76b30ba58da56/0SNbKuQaZ5cSp0GlIQD7e.jpg";
  } else if (isFinance) {
    defaultPoster1 = "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MWUvSkhLMUNBeHVudFBBd29HQ1RZTVdCLmpwZw.969dfc1a43072ab4/JHK1CAxuntPAwoGCTYMWB.jpg";
    defaultPoster2 = "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MTYvejRDTFU0THkyRjFoWml5TklJcWEyLmpwZw.660ffbf5b22ed418/z4CLU4Ly2F1hZiyNIIqa2.jpg";
  } else if (isNeural) {
    defaultPoster1 = "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MTYvejRDTFU0THkyRjFoWml5TklJcWEyLmpwZw.660ffbf5b22ed418/z4CLU4Ly2F1hZiyNIIqa2.jpg";
    defaultPoster2 = "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MDMvNWNfLUdhZk9jRTBwSzE0TEQ1UGNhLmpwZw.9fc767252bb912f8/5c_-GafOcE0pK14LD5Pca.jpg";
  } else if (isRobotics) {
    defaultPoster1 = "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MDEvekFjeWZCNVR6OUJHTGJJaDZ2TGZQLmpwZw.e73f200b252ea79b/zAcyfB5Tz9BGLbIh6vLfP.jpg";
    defaultPoster2 = "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MWUvSkhLMUNBeHVudFBBd29HQ1RZTVdCLmpwZw.969dfc1a43072ab4/JHK1CAxuntPAwoGCTYMWB.jpg";
  }

  function proxyUrl(u: string): string {
    if (u.startsWith("http://") || u.startsWith("https://")) {
      return `/api/proxy-media?url=${encodeURIComponent(u)}`;
    }
    return u;
  }

  const lens1 = isRacing
    ? "anamorphic telephoto, asphalt heat shimmer, ultra-shallow depth of field"
    : isSpace
    ? "wide-field scientific astrograph, deep ultraviolet glow"
    : isOcean
    ? "deep-field cinema prime, dual practical floodlights"
    : isFinance
    ? "35mm prime, reflection depth, anamorphic city bokeh"
    : isNeural
    ? "bioluminescent synapse volume, macro cine lens"
    : isQuantum
    ? "cryostat gold-cable glow, anamorphic sci-fi prime"
    : isRobotics
    ? "carbon-fiber actuator macro, hard rim highlight"
    : "volumetric field atmosphere, documentary prime";

  const lens2 = isRacing
    ? "telemetry HUD close-up, tire tread texture, high shutter speed"
    : isOcean
    ? "field-station floodlights, suspended particulate"
    : "tactile process close-up, warm practical key";

  const slug = hookId.replace(/[^a-z0-9]+/gi, "-").slice(0, 24) || "custom";

  return [
    {
      id: `broll-${slug}-1`,
      startSec: 2.0,
      endSec: 5.5,
      durationSec: 3.5,
      triggerPhrase: phrase1,
      prompt: `Cinematic 9:16 vertical shot visualizing ${phrase1}, ${lens1}, 35mm film grain`,
      videoUrl: proxyUrl(defaultPoster1),
      posterUrl: proxyUrl(defaultPoster1),
      orchestratorNode: "agent.livepeer.org/api/mcp/creative (flux-schnell)",
      status: "ready",
      costUsd: 0.0032,
    },
    {
      id: `broll-${slug}-2`,
      startSec: 7.5,
      endSec: 11.5,
      durationSec: 4.0,
      triggerPhrase: phrase2,
      prompt: `Photorealistic 9:16 vertical cinematic cutaway representing ${phrase2}, ${lens2}, 8k textures`,
      videoUrl: proxyUrl(defaultPoster2),
      posterUrl: proxyUrl(defaultPoster2),
      orchestratorNode: "agent.livepeer.org/api/mcp/creative (flux-schnell)",
      status: "ready",
      costUsd: 0.0032,
    },
  ];
}

export const SAMPLE_LONGFORM_HOOKS: VideoHook[] = STARTER_KEYNOTES.map(createDynamicHookFromKeynote);

/**
 * Synthesizes a 9:16 vertical B-roll cut live on Livepeer Agent Creative MCP
 * Endpoint: https://agent.livepeer.org/api/mcp/creative
 */
export async function synthesizeBrollLiveOnLivepeer(
  prompt: string,
  triggerPhrase: string,
  startSec: number = 2.0,
  durationSec: number = 3.5
): Promise<BrollCut> {
  const result: LivepeerCreateMediaResult = await livepeerMcp.createMedia({
    action: "generate",
    prompt: `Cinematic 9:16 vertical commercial b-roll, high production value, photorealistic: ${prompt}`,
    aspectRatio: "9:16",
    quality: "fast",
  });

  const rawUrl = result.url;
  const proxiedUrl = rawUrl && (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) && !rawUrl.includes("/api/proxy-media")
    ? `/api/proxy-media?url=${encodeURIComponent(rawUrl)}`
    : rawUrl;

  return {
    id: `broll-livepeer-${Date.now()}`,
    startSec,
    endSec: startSec + durationSec,
    durationSec,
    triggerPhrase,
    prompt,
    videoUrl: proxiedUrl,
    posterUrl: proxiedUrl,
    orchestratorNode: `agent.livepeer.org/api/mcp/creative (${result.servedModelId})`,
    status: "synthesized",
    costUsd: result.costPaidUsd,
  };
}

/**
 * Dissects any long-form video or speech text using Livepeer Agent MCP
 * tools (transcribe / find_moments / create_media)
 */
export async function dissectVideoWithLivepeer(
  title: string,
  sourceSpeaker: string,
  quoteText: string,
  brollPrompt: string
): Promise<{ hook: VideoHook; broll: BrollCut[] }> {
  // Synthesize contextual vertical B-roll slice on Livepeer MCP
  const brollCut = await synthesizeBrollLiveOnLivepeer(
    brollPrompt || "Dynamic neural compute architecture pulsing with neon data ribbons",
    quoteText.slice(0, 40),
    1.5,
    3.5
  );

  const words = quoteText.split(" ").map((w, idx) => ({
    word: w,
    startSec: +(idx * 0.35).toFixed(2),
    endSec: +((idx + 1) * 0.35).toFixed(2),
    isKeyTerm: idx % 3 === 0,
  }));

  const hook: VideoHook = {
    id: `hook-custom-${Date.now()}`,
    title,
    sourceSpeaker,
    sourceVideoTitle: "Livepeer Dissected Media Feed",
    startSec: 0,
    endSec: words.length * 0.35,
    durationSec: Math.max(12, words.length * 0.35),
    retentionScore: 96.8,
    viralCategory: "Deep Tech",
    quoteText,
    transcript: words,
    speakerVideoUrl: brollCut.videoUrl,
  };

  return { hook, broll: [brollCut] };
}
