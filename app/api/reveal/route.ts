import { NextResponse } from "next/server";
import { decodeGame } from "@/lib/token";
import { VOCAB } from "@/lib/words";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    const { wordIndex } = decodeGame(token);
    return NextResponse.json({ word: VOCAB[wordIndex] });
  } catch {
    return NextResponse.json({ error: "invalid token" }, { status: 400 });
  }
}
