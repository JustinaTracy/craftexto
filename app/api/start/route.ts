import { NextResponse } from "next/server";
import { dailyIndex, dailyKey, randomIndex } from "@/lib/words";
import { encodeGame } from "@/lib/token";
import { totalCorpus } from "@/lib/embeddings";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let mode: "daily" | "freeplay" = "daily";
  try {
    const body = await req.json();
    if (body?.mode === "freeplay") mode = "freeplay";
  } catch {}

  const idx = mode === "daily" ? dailyIndex() : randomIndex();
  const token = encodeGame(mode, idx);
  return NextResponse.json({
    token,
    mode,
    vocabSize: totalCorpus(),
    dayKey: mode === "daily" ? dailyKey() : null,
  });
}
