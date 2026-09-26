import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function fetchTtsChunk(text: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const url =
      "https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=" +
      encodeURIComponent(text);

    fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`TTS fetch error: ${res.status}`);
        }
        const arrayBuf = await res.arrayBuffer();
        resolve(Buffer.from(arrayBuf));
      })
      .catch(reject);
  });
}

function chunkText(text: string, maxLen = 170): string[] {
  if (text.length <= maxLen) return [text];
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
  const chunks: string[] = [];
  let cur = "";

  for (const s of sentences) {
    if ((cur + " " + s).trim().length <= maxLen) {
      cur = (cur + " " + s).trim();
    } else {
      if (cur) chunks.push(cur);
      if (s.length <= maxLen) {
        cur = s.trim();
      } else {
        // Split long sentence by comma or words
        const words = s.split(/\s+/);
        cur = "";
        for (const w of words) {
          if ((cur + " " + w).trim().length <= maxLen) {
            cur = (cur + " " + w).trim();
          } else {
            if (cur) chunks.push(cur);
            cur = w;
          }
        }
      }
    }
  }
  if (cur) chunks.push(cur);
  return chunks;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = (searchParams.get("text") || "").trim();
  const id = searchParams.get("id");

  if (!text && !id) {
    return NextResponse.json({ error: "Missing text query parameter" }, { status: 400 });
  }

  // 1. Check if a pre-cached audio file exists for this keynote id
  if (id) {
    const localFile = path.join(process.cwd(), "public", "audio", `${id}.mp3`);
    if (fs.existsSync(localFile)) {
      const fileBuffer = fs.readFileSync(localFile);
      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": "audio/mpeg",
          "Content-Length": fileBuffer.length.toString(),
          "Cache-Control": "public, max-age=86400, immutable",
        },
      });
    }
  }

  // 2. Synthesize audio on the fly for any monologue or custom transcript text
  try {
    const chunks = chunkText(text);
    const buffers: Buffer[] = [];

    for (const chunk of chunks) {
      if (chunk.trim()) {
        const buf = await fetchTtsChunk(chunk.trim());
        buffers.push(buf);
      }
    }

    const finalBuffer = Buffer.concat(buffers);

    return new NextResponse(finalBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": finalBuffer.length.toString(),
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch (err: any) {
    console.error("TTS generation error:", err);
    return NextResponse.json(
      { error: "Failed to synthesize speech audio" },
      { status: 500 }
    );
  }
}
