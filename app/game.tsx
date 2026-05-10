"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Mode = "daily" | "freeplay";

type Guess = {
  guess: string;
  rank: number;
  similarity: number;
  inVocab: boolean;
};

type GameState = {
  token: string;
  mode: Mode;
  vocabSize: number;
  dayKey: string | null;
  guesses: Guess[];
  solved: boolean;
  revealed: string | null;
};

function rankColor(rank: number, vocabSize: number): string {
  if (rank === 1) return "bg-emerald-500 text-white";
  if (rank <= 50) return "bg-emerald-400 text-emerald-950";
  if (rank <= 250) return "bg-amber-300 text-amber-950";
  if (rank <= 1000) return "bg-orange-300 text-orange-950";
  return "bg-rose-300 text-rose-950";
}

function rankLabel(rank: number, vocabSize: number) {
  if (rank > vocabSize) return `>${vocabSize}`;
  return rank.toString();
}

export default function Game() {
  const [game, setGame] = useState<GameState | null>(null);
  const [mode, setMode] = useState<Mode>("daily");
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latest, setLatest] = useState<Guess | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function startGame(nextMode: Mode) {
    setBusy(true);
    setError(null);
    setLatest(null);
    try {
      const res = await fetch("/api/start", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mode: nextMode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "failed to start");
      setGame({
        token: data.token,
        mode: data.mode,
        vocabSize: data.vocabSize,
        dayKey: data.dayKey,
        guesses: [],
        solved: false,
        revealed: null,
      });
      setMode(data.mode);
      setTimeout(() => inputRef.current?.focus(), 50);
    } catch (e) {
      setError(e instanceof Error ? e.message : "error");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    startGame("daily");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submitGuess(e: React.FormEvent) {
    e.preventDefault();
    if (!game || busy || game.solved) return;
    const word = input.trim().toLowerCase();
    if (!word) return;
    if (!/^[a-z][a-z'-]*$/.test(word)) {
      setError("letters only, single word");
      return;
    }
    if (game.guesses.some((g) => g.guess === word)) {
      setError(`already guessed "${word}"`);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/guess", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token: game.token, guess: word }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "guess failed");
      const newGuess: Guess = {
        guess: data.guess,
        rank: data.rank,
        similarity: data.similarity,
        inVocab: data.inVocab,
      };
      setLatest(newGuess);
      setGame((g) =>
        g
          ? {
              ...g,
              guesses: [newGuess, ...g.guesses],
              solved: data.solved,
            }
          : g,
      );
      setInput("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "error");
    } finally {
      setBusy(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  async function giveUp() {
    if (!game) return;
    setBusy(true);
    try {
      const res = await fetch("/api/reveal", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token: game.token }),
      });
      const data = await res.json();
      if (res.ok) {
        setGame((g) => (g ? { ...g, revealed: data.word } : g));
      }
    } finally {
      setBusy(false);
    }
  }

  const sortedGuesses = useMemo(() => {
    if (!game) return [];
    return [...game.guesses].sort((a, b) => a.rank - b.rank);
  }, [game]);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Craftexto
            <span className="ml-2 text-base font-normal text-stone-500">
              guess the craft word
            </span>
          </h1>
          <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
            Lower rank = closer to the secret word. Rank 1 wins.
          </p>
        </header>

        <div className="mb-4 flex gap-2">
          <button
            onClick={() => startGame("daily")}
            disabled={busy}
            className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition ${
              mode === "daily"
                ? "border-emerald-500 bg-emerald-500 text-white"
                : "border-stone-300 bg-white hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-900 dark:hover:bg-stone-800"
            }`}
          >
            Word of the Day
            {game?.dayKey && mode === "daily" && (
              <span className="ml-2 text-xs opacity-80">{game.dayKey}</span>
            )}
          </button>
          <button
            onClick={() => startGame("freeplay")}
            disabled={busy}
            className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition ${
              mode === "freeplay"
                ? "border-emerald-500 bg-emerald-500 text-white"
                : "border-stone-300 bg-white hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-900 dark:hover:bg-stone-800"
            }`}
          >
            Freeplay {mode === "freeplay" && "↻"}
          </button>
        </div>

        <form onSubmit={submitGuess} className="mb-4 flex gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!game || busy || game.solved || !!game.revealed}
            placeholder="type a word…"
            className="flex-1 rounded-lg border border-stone-300 bg-white px-4 py-3 text-base outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 disabled:opacity-50 dark:border-stone-700 dark:bg-stone-900"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          <button
            type="submit"
            disabled={!game || busy || !input.trim() || game?.solved || !!game?.revealed}
            className="rounded-lg bg-emerald-600 px-4 py-3 font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
          >
            {busy ? "…" : "Guess"}
          </button>
        </form>

        {error && (
          <div className="mb-3 rounded-md bg-rose-100 px-3 py-2 text-sm text-rose-800 dark:bg-rose-950 dark:text-rose-200">
            {error}
          </div>
        )}

        {game?.solved && (
          <div className="mb-4 rounded-lg bg-emerald-100 p-4 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
            <div className="text-lg font-bold">You got it! 🎉</div>
            <div className="text-sm">
              {game.guesses.length} guess{game.guesses.length === 1 ? "" : "es"}.{" "}
              <button
                className="underline"
                onClick={() => startGame(mode === "daily" ? "freeplay" : "freeplay")}
              >
                Play freeplay
              </button>
            </div>
          </div>
        )}

        {game?.revealed && !game.solved && (
          <div className="mb-4 rounded-lg bg-stone-200 p-4 dark:bg-stone-800">
            <div className="text-sm">The word was</div>
            <div className="text-2xl font-bold">{game.revealed}</div>
          </div>
        )}

        {game && !game.solved && !game.revealed && game.guesses.length > 0 && (
          <div className="mb-2 flex justify-end">
            <button
              onClick={giveUp}
              className="text-xs text-stone-500 underline hover:text-stone-700 dark:hover:text-stone-300"
            >
              give up
            </button>
          </div>
        )}

        {latest && (
          <div className="mb-3">
            <div className="mb-1 text-xs uppercase tracking-wide text-stone-500">
              latest guess
            </div>
            <GuessRow g={latest} vocabSize={game!.vocabSize} highlight />
          </div>
        )}

        {sortedGuesses.length > 0 && (
          <div>
            <div className="mb-1 flex items-center justify-between text-xs uppercase tracking-wide text-stone-500">
              <span>guesses ({sortedGuesses.length})</span>
              <span>rank · similarity</span>
            </div>
            <ul className="space-y-1">
              {sortedGuesses.map((g) => (
                <li key={g.guess}>
                  <GuessRow g={g} vocabSize={game!.vocabSize} />
                </li>
              ))}
            </ul>
          </div>
        )}

        <footer className="mt-12 text-center text-xs text-stone-500">
          built with Next.js · OpenAI embeddings · {game?.vocabSize ?? "—"} word vocab
        </footer>
      </div>
    </div>
  );
}

function GuessRow({
  g,
  vocabSize,
  highlight = false,
}: {
  g: Guess;
  vocabSize: number;
  highlight?: boolean;
}) {
  const color = rankColor(g.rank, vocabSize);
  // bar width: closer = fuller. Use rank for vocab matches, similarity-derived for off-vocab.
  const pct =
    g.rank <= vocabSize
      ? Math.max(2, 100 - (g.rank / vocabSize) * 100)
      : Math.max(2, Math.min(100, g.similarity * 100));
  return (
    <div
      className={`relative overflow-hidden rounded-md border ${
        highlight
          ? "border-emerald-400 ring-2 ring-emerald-300"
          : "border-stone-200 dark:border-stone-800"
      } bg-white dark:bg-stone-900`}
    >
      <div
        className={`absolute inset-y-0 left-0 ${color} opacity-30`}
        style={{ width: `${pct}%` }}
      />
      <div className="relative flex items-center justify-between px-3 py-2">
        <span className="font-medium">{g.guess}</span>
        <span className="font-mono text-sm tabular-nums">
          {rankLabel(g.rank, vocabSize)}
          <span className="ml-2 text-xs text-stone-500">
            {(g.similarity * 100).toFixed(1)}%
          </span>
        </span>
      </div>
    </div>
  );
}
