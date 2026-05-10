import OpenAI from "openai";
import { VOCAB } from "./words";

const MODEL = "text-embedding-3-small";

let client: OpenAI | null = null;
function openai() {
  if (!client) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not set");
    }
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
}

// Module-level caches. On Vercel these persist across warm invocations.
const cache = new Map<string, Float32Array>();
let vocabPromise: Promise<Float32Array[]> | null = null;
// rankings[i] is the sorted list (by cosine sim, desc) of vocab indices,
// computed against secret-word index i.
const rankingsCache = new Map<number, number[]>();

function dot(a: Float32Array, b: Float32Array): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

function norm(a: Float32Array): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * a[i];
  return Math.sqrt(s);
}

function cosine(a: Float32Array, b: Float32Array): number {
  const d = dot(a, b);
  const n = norm(a) * norm(b);
  return n === 0 ? 0 : d / n;
}

async function embedBatch(texts: string[]): Promise<Float32Array[]> {
  const res = await openai().embeddings.create({
    model: MODEL,
    input: texts,
  });
  return res.data.map((d) => Float32Array.from(d.embedding));
}

export async function embedWord(word: string): Promise<Float32Array> {
  const key = word.toLowerCase().trim();
  const hit = cache.get(key);
  if (hit) return hit;
  const [vec] = await embedBatch([key]);
  cache.set(key, vec);
  return vec;
}

export async function getVocabEmbeddings(): Promise<Float32Array[]> {
  if (vocabPromise) return vocabPromise;
  vocabPromise = (async () => {
    // Batch in chunks to stay well under any limits.
    const out: Float32Array[] = new Array(VOCAB.length);
    const CHUNK = 256;
    for (let i = 0; i < VOCAB.length; i += CHUNK) {
      const chunk = VOCAB.slice(i, i + CHUNK);
      const vecs = await embedBatch(chunk);
      for (let j = 0; j < chunk.length; j++) {
        out[i + j] = vecs[j];
        cache.set(chunk[j].toLowerCase(), vecs[j]);
      }
    }
    return out;
  })();
  return vocabPromise;
}

// Returns array of vocab indices sorted by descending cosine similarity to secret.
export async function getRanking(secretIndex: number): Promise<number[]> {
  const cached = rankingsCache.get(secretIndex);
  if (cached) return cached;
  const vocab = await getVocabEmbeddings();
  const secret = vocab[secretIndex];
  const sims = vocab.map((v, i) => ({ i, s: cosine(secret, v) }));
  sims.sort((a, b) => b.s - a.s);
  const ranking = sims.map((x) => x.i);
  rankingsCache.set(secretIndex, ranking);
  return ranking;
}

export async function rankGuess(
  secretIndex: number,
  guess: string,
): Promise<{ rank: number; similarity: number; inVocab: boolean; guess: string }> {
  const word = guess.toLowerCase().trim();
  const ranking = await getRanking(secretIndex);
  const vocab = await getVocabEmbeddings();
  const secretVec = vocab[secretIndex];

  // Is the guess in the vocab? Use ranking position if so.
  const vocabIdx = VOCAB.indexOf(word);
  if (vocabIdx >= 0) {
    const rank = ranking.indexOf(vocabIdx) + 1; // 1-based; #1 is the secret
    const similarity = cosine(secretVec, vocab[vocabIdx]);
    return { rank, similarity, inVocab: true, guess: word };
  }

  // Not in vocab: embed the guess and find where it would rank.
  const guessVec = await embedWord(word);
  const guessSim = cosine(secretVec, guessVec);
  // rank = (count of vocab words with strictly higher similarity) + 1
  // ranking is sorted desc by similarity; binary search for guessSim.
  let higher = 0;
  for (const idx of ranking) {
    const s = cosine(secretVec, vocab[idx]);
    if (s > guessSim) higher++;
    else break;
  }
  return { rank: higher + 1, similarity: guessSim, inVocab: false, guess: word };
}

export function totalVocab(): number {
  return VOCAB.length;
}
