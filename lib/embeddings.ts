import OpenAI from "openai";
import { VOCAB as CRAFT_VOCAB } from "./words";
import { COMMON_WORDS } from "./corpus";
import { makeCanonicalizer } from "./canon";

const MODEL = "text-embedding-3-small";

// CORPUS is the dense ranking dictionary: craft words + common English.
// Deduped, lowercased.
const _seen = new Set<string>();
export const CORPUS: string[] = [...CRAFT_VOCAB, ...COMMON_WORDS]
  .map((w) => w.toLowerCase())
  .filter((w) => {
    if (_seen.has(w)) return false;
    _seen.add(w);
    return true;
  });

// Map craft-word → its index in CORPUS (for resolving the secret).
const corpusIndexOf = new Map<string, number>();
CORPUS.forEach((w, i) => corpusIndexOf.set(w, i));

export const canonicalize = makeCanonicalizer(CORPUS);

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

const cache = new Map<string, Float32Array>();
let corpusPromise: Promise<Float32Array[]> | null = null;
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

export async function getCorpusEmbeddings(): Promise<Float32Array[]> {
  if (corpusPromise) return corpusPromise;
  corpusPromise = (async () => {
    const out: Float32Array[] = new Array(CORPUS.length);
    const CHUNK = 512;
    for (let i = 0; i < CORPUS.length; i += CHUNK) {
      const chunk = CORPUS.slice(i, i + CHUNK);
      const vecs = await embedBatch(chunk);
      for (let j = 0; j < chunk.length; j++) {
        out[i + j] = vecs[j];
        cache.set(chunk[j], vecs[j]);
      }
    }
    return out;
  })();
  return corpusPromise;
}

// Returns the secret word's index in CORPUS, given its craft-vocab word.
export function corpusIndexOfWord(word: string): number {
  const idx = corpusIndexOf.get(word.toLowerCase());
  if (idx === undefined) {
    throw new Error(`secret word "${word}" not in corpus`);
  }
  return idx;
}

// Sorted-by-descending-similarity-to-secret indices into CORPUS.
export async function getRanking(secretCorpusIndex: number): Promise<number[]> {
  const cached = rankingsCache.get(secretCorpusIndex);
  if (cached) return cached;
  const corpus = await getCorpusEmbeddings();
  const secret = corpus[secretCorpusIndex];
  const sims = corpus.map((v, i) => ({ i, s: cosine(secret, v) }));
  sims.sort((a, b) => b.s - a.s);
  const ranking = sims.map((x) => x.i);
  rankingsCache.set(secretCorpusIndex, ranking);
  return ranking;
}

export type RankResult = {
  guess: string; // canonical word returned to the client
  raw: string; // exactly what the user typed (cleaned)
  rank: number;
  similarity: number;
  inCorpus: boolean;
  solved: boolean;
};

export async function rankGuess(
  secretWord: string,
  rawGuess: string,
): Promise<RankResult> {
  const raw = rawGuess.toLowerCase().trim();
  const canon = canonicalize(raw);
  const corpus = await getCorpusEmbeddings();
  const secretCorpusIdx = corpusIndexOfWord(secretWord);
  const secretVec = corpus[secretCorpusIdx];

  // If canonical form is in corpus, use its precomputed rank position.
  const corpusIdx = corpusIndexOf.get(canon);
  if (corpusIdx !== undefined) {
    const ranking = await getRanking(secretCorpusIdx);
    const rank = ranking.indexOf(corpusIdx) + 1; // 1-based
    const similarity = cosine(secretVec, corpus[corpusIdx]);
    return {
      guess: canon,
      raw,
      rank,
      similarity,
      inCorpus: true,
      solved: canon === secretWord,
    };
  }

  // Off-corpus: embed and find where it would slot in.
  const guessVec = await embedWord(canon);
  const guessSim = cosine(secretVec, guessVec);
  let higher = 0;
  for (let i = 0; i < corpus.length; i++) {
    if (cosine(secretVec, corpus[i]) > guessSim) higher++;
  }
  return {
    guess: canon,
    raw,
    rank: higher + 1,
    similarity: guessSim,
    inCorpus: false,
    solved: false,
  };
}

export function totalCorpus(): number {
  return CORPUS.length;
}
