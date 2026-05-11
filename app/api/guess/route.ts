import { NextResponse } from "next/server";
import { decodeGame } from "@/lib/token";
import { rankGuess, totalCorpus } from "@/lib/embeddings";
import { VOCAB } from "@/lib/words";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  let body: { token?: string; guess?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const token = body?.token;
  const guess = (body?.guess || "").toString().toLowerCase().trim();
  if (!token || !guess) {
    return NextResponse.json({ error: "missing token or guess" }, { status: 400 });
  }
  if (!/^[a-z][a-z'-]*$/.test(guess)) {
    return NextResponse.json({ error: "letters only, single word" }, { status: 400 });
  }

  let game;
  try {
    game = decodeGame(token);
  } catch {
    return NextResponse.json({ error: "invalid token" }, { status: 400 });
  }

  try {
    const secretWord = VOCAB[game.wordIndex];
    const result = await rankGuess(secretWord, guess);
    return NextResponse.json({
      ...result,
      vocabSize: totalCorpus(),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "embedding error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
