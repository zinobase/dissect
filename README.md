# Dissect: Autonomous Short-Form Video Re-Cutter & Generative B-Roll Studio

> **Transform long-form talking-head streams, keynotes, and podcasts into high-retention 9:16 vertical video reels powered by the Livepeer Agent Creative MCP.**

---

## The Retention Problem

Long-form podcasts and technical presentations consistently fail on short-form platforms (TikTok, Instagram Reels, YouTube Shorts) due to **talking-head fatigue**. 

When a video remains on a static shot of a speaker for more than 3 seconds without visual variety, viewer drop-off spikes by over 60%. Manual re-cutting requires editors to:
1. Scrub through hours of transcripts to locate viral hooks.
2. Manually search stock websites (Pexels, Storyblocks) for generic, unrelated footage.
3. Manually keyframe vertical 9:16 reframing, cutaways, and subtitle animations.

**Dissect automates this entire editing pipeline** through an intelligent agent loop backed by decentralized Livepeer AI inference.

---

## How Dissect Works

```mermaid
flowchart LR
    A["Raw Video / Audio"] --> B["Transcript & Hook Extraction\n(Livepeer MCP: transcribe)"]
    B --> C["Dead-Zone Scanner\n(Static talking head >3s)"]
    C --> D["Contextual Prompt Generator\n(Extracts spoken metaphors)"]
    D --> E["Vertical 9:16 B-Roll Synthesis\n(Livepeer MCP: create_media)"]
    E --> F["Interactive 3-Track NLE\n(Speaker + B-Roll + Subtitles)"]
    F --> G["Multi-Platform Export\n(TikTok / Reels / Shorts Safe)"]
```

### 1. Retention Hook & Dead-Zone Detection
Dissect uses the Livepeer Agent MCP `transcribe` and `find_moments` tools with word-level precision to:
- Generate a dynamic retention score curve across the speech.
- Scan for **visual dead-zones**—unbroken talking-head segments longer than 3 seconds.
- Automatically position B-roll cutaway entry and exit points to maintain pacing cadence.

### 2. Context-Aware 9:16 B-Roll Synthesis
Rather than inserting generic stock videos of office buildings or keyboards, Dissect extracts the speaker's conceptual points (e.g. quantum computing, liquidity pools, telemetry telemetry) and issues structured 9:16 vertical generation calls to `agent.livepeer.org/api/mcp/creative` using the `create_media` tool.

### 3. Interactive 3-Track NLE
Dissect provides an in-browser non-linear editing stage with three parallel media tracks:
- **Track 1 (Speaker Base)**: 9:16 face-tracked re-framing of the original long-form video.
- **Track 2 (Generative B-Roll)**: Dynamic AI-generated visual cutaways positioned over dead zones.
- **Track 3 (Kinetic Captions)**: Word-level animated typography aligned with speech cadence.

### 4. Conversational Slice Surgery
Editors are never locked into an AI generation. Clicking any individual slice on Track 2 opens the Slice Refinement drawer, allowing the creator to adjust prompts, directorial lenses, camera motion vectors, or re-render that specific cut in seconds without touching the rest of the timeline.

---

## Editor Features & Tooling

### NLE Editing Tools
- **Select Mode (`V`)**: Scrub, position playhead, and inspect segment properties.
- **Blade Tool (`B`)**: Split B-roll segments at exact word boundaries.
- **Ripple Tool (`R`)**: Adjust cutaway duration with automatic downstream timeline ripple.

### Kinetic Subtitle Engine
Dissect includes built-in viral typography presets with word-level highlight animation:
- **Hormozi Punch**: Bold yellow/green accent emphasis on active spoken keywords.
- **MrBeast Kinetic**: High-contrast block styling with kinetic scale pops.
- **Cyber Glitch**: Monospace typography with chromatic cyan/magenta shifts.
- **Minimal Clean**: Subdued editorial typography for technical or documentary content.

### Social Platform Safe-Area HUDs
Toggleable in-player viewport guides ensure critical text and visual focal points avoid UI elements across target destinations:
- **TikTok**: Accounts for right-side action buttons, bottom caption bar, and top search header.
- **Instagram Reels**: Accounts for bottom audio ticker, right engagement icons, and username tags.
- **YouTube Shorts**: Accounts for bottom title bar and subscribe overlay.

---

## Livepeer MCP Technical Integration

Dissect connects directly to the **Livepeer Agent Creative MCP** (`https://agent.livepeer.org/api/mcp/creative`) over JSON-RPC 2.0:

- **Endpoint**: `https://agent.livepeer.org/api/mcp/creative`
- **Supported Tools**:
  - `transcribe`: Produces word-level timestamps and phonetic text representation.
  - `find_moments`: Evaluates emotional inflection, pace transitions, and topical shifts to rank viral clips.
  - `create_media`: Dispatches 9:16 vertical image and video diffusion tasks to decentralized GPU orchestrator nodes.
  - `me`: Verifies hacker credit quota and authenticated principal status.
- **Participant Compute Model**: Operates out of the box using keyless hackathon participant allowance ($100 daily quota), or via personal Bearer key supplied in the Developer Settings drawer.
- **Canvas Streaming Proxy**: Leverages a local `/api/proxy-media` server route to stream external media assets with permissive CORS headers, preventing HTML5 canvas tainting during real-time timeline playback.

---

## Quickstart & Local Setup

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x

### 1. Clone the Repository
```bash
git clone https://github.com/zinobase/dissect.git
cd dissect
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration (Optional)
```bash
cp .env.example .env.local
```
*(Leave empty to connect keyless using your hackathon participant allowance, or enter your Livepeer Agent Bearer key)*

### 4. Start the Studio
```bash
npm run dev
```
Open [http://localhost:3003](http://localhost:3003) to launch the Dissect editing workstation.

---

## Technology Stack

- **Framework**: Next.js 14 (App Router), React 18, TypeScript
- **AI Infrastructure**: Livepeer Agent Creative MCP (`agent.livepeer.org`)
- **Compositor Engine**: 60 FPS HTML5 Canvas with letterbox re-framing
- **Audio Feedback**: Procedural Web Audio API sound feedback
- **Styling**: Tailwind CSS, Lucide Icons

---

## Author & Submission Details

- **Author**: zinobase
- **GitHub**: [@zinobase](https://github.com/zinobase)
- **Email**: zinobase15@gmail.com
- **Track**: Track 2 — Core Livepeer Agent Builder Track ($1,000)
- **License**: MIT
