# Dissect: Autonomous Generative B-Roll & Social Clip Re-Cutter

> **Livepeer Agent Hackathon Submission**
> **Track**: Track 2 — Core Livepeer Agent Builder Track ($1,000)
> **Author**: Kaito Tanaka ([@kaitotanaka-dev](https://github.com/kaitotanaka-dev) · kaito.tanaka.vibe@gmail.com)
> **Livepeer Creative MCP Endpoint**: `https://agent.livepeer.org/api/mcp/creative` (125 tools)
> **Participant Compute Model**: Hacker Packet $100 on connect (auto-reups every 24h)

---

## Executive Summary

**Dissect** transforms raw long-form videos (podcasts, keynotes, technical streams) into high-retention 9:16 vertical short-form reels.

Unlike conventional repurposing apps that pull unrelated stock photography from Storyblocks or Pexels, Dissect:
1. **Scans & Segments**: Uses Livepeer MCP `transcribe` and `find_moments` with word-level timestamps to detect high-retention narrative hooks and identify "visual dead zones" (>3s of static talking head).
2. **Generates Contextual B-Roll**: Automatically dispatches prompts to the **Livepeer Agent Creative MCP** (`https://agent.livepeer.org/api/mcp/creative`) via the `create_media` tool to synthesize cinematic 9:16 vertical B-roll cutaways matching the speaker's conceptual points.
3. **Interactive 3-Track NLE**: Exposes an interactive 3-track timeline (Reframed Speaker, Generative B-roll, Word-Level Kinetic Captions).
4. **Conversational Slice Surgery**: Allows creators to scrub to any individual B-roll segment and refine the prompt, re-rendering in seconds directly on Livepeer decentralized nodes without touching the rest of the cut.

---

## Livepeer Hacker Packet & MCP Integration

Dissect is engineered strictly around the official Livepeer Agent Hackathon participant framework:

- **Official MCP Endpoint**: Direct JSON-RPC 2.0 integration with `https://agent.livepeer.org/api/mcp/creative` using `Accept: application/json, text/event-stream`.
- **$100 Daily Hacker Allowance**: Adheres to the official hackathon rule: each hacker receives their own $100 credit on connect, automatically re-upping every 24 hours. Dissect measures exact B-roll synthesis drawdowns (`~$0.02 - $0.04/cut`).
- **Keyless or Bearer Token**: Connects instantly in keyless demo/participant mode, or attaches the participant's Livepeer Agent Bearer key from the in-app Model Drawer.
- **Zero-CORS Streaming Media Proxy**: Uses an integrated server-side streaming proxy (`/api/proxy-media`) with `Access-Control-Allow-Origin: *`, resolving upstream 302 redirects and preventing HTML5 canvas tainting.
- **60 FPS Vertical Smartphone Simulator**: The 9:16 viewport player runs directly on an HTML5 canvas with procedural scanlines, face-tracking crop reticles, and audio waveforms with zero React re-render overhead.

---

## System Architecture

```
[ Long-Form Video / Stream URL ]
                 │
                 ▼
┌──────────────────────────────────────────────────────────┐
│ Livepeer Agent Creative MCP (agent.livepeer.org)         │
│ • Tool: transcribe (word-level timestamps & transcript)  │
│ • Tool: find_moments (retention spike & hook detection)  │
└──────────────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│     Visual Dead Zone Detector   │ ──> Identifies static talking-head moments >3s
└─────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────────┐
│ Livepeer Agent Creative MCP (agent.livepeer.org)         │
│ • Tool: create_media (9:16 vertical cinematic B-roll)    │
│ • Tool: director_export (3-track master compilation)     │
└──────────────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│   Interactive 3-Track Director  │
│ Track A: ActiveSpeaker 9:16     │
│ Track B: Generative B-Roll Cut  │
│ Track C: Word Kinetic Subtitles │
└─────────────────────────────────┘
```

---

## Core Capabilities

### 1. Multimodal Hook Scoring & Dead-Zone Detection
- Evaluates video transcripts to generate viral retention curves (0-100%).
- Flags static visual dead-zones where audience drop-off spikes.

### 2. Livepeer Contextual 9:16 B-Roll Synthesis
- Automatically maps spoken phrases to vertical camera directives (Grand Prix Engineering, Cosmic Frontier, Abyssal Systems, Quantitative Capital, Neural Architecture).
- Dispatches parallel diffusion jobs directly across Livepeer GPU orchestrator nodes.

### 3. Surgical Slice Refinement
- Interactive scrubber allows clicking any generated B-roll cut to modify directorial lenses, camera trajectory (dolly in, pan, orbit), or guidance scale.

### 4. Export & Multi-Platform Safe Area HUD
- Toggleable overlay templates for TikTok, Instagram Reels, and YouTube Shorts safe zones.
- Export modal for finalized 9:16 master reels with word-level burned kinetic captions.

---

## Quickstart & Local Setup

### 1. Installation
```bash
git clone https://github.com/kaitotanaka-dev/dissect.git
cd dissect
npm install
```

### 2. Environment (Optional)
```bash
cp .env.example .env.local
```
*(Leave empty to connect keyless using your hackathon participant allowance, or add your Livepeer Agent Bearer key)*

### 3. Launch Studio
```bash
npm run dev
```
Open [http://localhost:3003](http://localhost:3003) in your browser.

---

## Technology Stack

- **Framework**: Next.js 14 (App Router), React 18, TypeScript
- **Decentralized AI Compute**: Livepeer Agent Creative MCP (`https://agent.livepeer.org/api/mcp/creative`)
- **Styling & Aesthetics**: Tailwind CSS, Lucide Icons, 60 FPS HTML5 Canvas Compositor
- **Procedural Sound**: In-browser Web Audio API sound cue engine

---

## Author & Submission Details

- **Author**: Kaito Tanaka
- **GitHub**: [@kaitotanaka-dev](https://github.com/kaitotanaka-dev)
- **Track**: Track 2 — Core Livepeer Agent Builder Track
- **License**: MIT
