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

// Plum-wine gradient: deep (close) → light (far).
function rankColor(rank: number): {
  bar: string;
  pill: string;
} {
  if (rank === 1)
    return {
      bar: "bg-plum-wine-900",
      pill: "bg-plum-wine-900 text-white",
    };
  if (rank <= 50)
    return {
      bar: "bg-plum-wine-700",
      pill: "bg-plum-wine-700 text-white",
    };
  if (rank <= 250)
    return {
      bar: "bg-plum-wine-500",
      pill: "bg-plum-wine-100 text-plum-wine-800",
    };
  if (rank <= 1000)
    return {
      bar: "bg-plum-wine-300",
      pill: "bg-plum-wine-50 text-plum-wine-700",
    };
  return {
    bar: "bg-plum-wine-100",
    pill: "bg-plum-wine-50 text-plum-wine-500",
  };
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
    <div className="min-h-screen bg-pearl-white-50 text-plum-wine-900">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
        <header className="mb-8 text-center sm:text-left">
          <h1 className="font-heading text-[40px] leading-tight font-normal text-plum-wine-900 sm:text-[56px]">
            Craftexto
          </h1>
          <p className="mt-2 font-body text-base leading-relaxed text-plum-wine-700">
            Guess the secret craft word. Lower rank means closer — rank 1 wins.
          </p>
        </header>

        {/* Mode toggle */}
        <div className="mb-5 inline-flex rounded-full border border-neutral-300 bg-white p-1 shadow-sm">
          <button
            onClick={() => startGame("daily")}
            disabled={busy}
            className={`rounded-full px-5 py-2 font-body text-sm font-semibold transition ${
              mode === "daily"
                ? "bg-plum-wine-700 text-white"
                : "text-plum-wine-700 hover:bg-plum-wine-50"
            }`}
          >
            Word of the Day
            {game?.dayKey && mode === "daily" && (
              <span className="ml-2 text-xs font-normal opacity-80">
                {game.dayKey}
              </span>
            )}
          </button>
          <button
            onClick={() => startGame("freeplay")}
            disabled={busy}
            className={`rounded-full px-5 py-2 font-body text-sm font-semibold transition ${
              mode === "freeplay"
                ? "bg-plum-wine-700 text-white"
                : "text-plum-wine-700 hover:bg-plum-wine-50"
            }`}
          >
            Freeplay {mode === "freeplay" && "↻"}
          </button>
        </div>

        {/* Guess input */}
        <form onSubmit={submitGuess} className="mb-4 flex gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!game || busy || game.solved || !!game.revealed}
            placeholder="type a word…"
            className="flex-1 rounded-full border border-neutral-300 bg-white px-5 py-3 font-body text-base text-plum-wine-900 placeholder:text-neutral-400 outline-none transition focus:border-plum-wine-500 focus:ring-2 focus:ring-plum-wine-200 disabled:opacity-50"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          <button
            type="submit"
            disabled={
              !game || busy || !input.trim() || game?.solved || !!game?.revealed
            }
            className="rounded-full bg-plum-wine-700 px-6 py-2.5 font-body text-base font-semibold text-white transition hover:bg-plum-wine-800 disabled:bg-neutral-200 disabled:text-neutral-400"
          >
            {busy ? "…" : "Guess"}
          </button>
        </form>

        {error && (
          <div className="mb-3 rounded-2xl border border-sunset-red-100 bg-sunset-red-50 px-4 py-3 font-body text-sm text-sunset-red-700">
            {error}
          </div>
        )}

        {/* Solved state */}
        {game?.solved && (
          <div className="mb-5 rounded-2xl border border-sage-gray-100 bg-alabaster-white-50 p-6 shadow-sm">
            <h2 className="font-heading text-2xl leading-snug font-normal text-plum-wine-900">
              You got it!
            </h2>
            <p className="mt-1 font-body text-sm text-plum-wine-700">
              Solved in {game.guesses.length} guess
              {game.guesses.length === 1 ? "" : "es"}.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => startGame("freeplay")}
                className="rounded-full bg-plum-wine-700 px-6 py-2.5 font-body text-base font-semibold text-white transition hover:bg-plum-wine-800"
              >
                Play another (Freeplay)
              </button>
              {mode === "freeplay" && (
                <button
                  onClick={() => startGame("daily")}
                  className="rounded-full border border-plum-wine-700 px-6 py-2.5 font-body text-base font-semibold text-plum-wine-700 transition hover:bg-plum-wine-50"
                >
                  Today's word
                </button>
              )}
            </div>
          </div>
        )}

        {/* Reveal state */}
        {game?.revealed && !game.solved && (
          <div className="mb-5 rounded-2xl border border-neutral-200 bg-alabaster-white-50 p-6 shadow-sm">
            <p className="font-body text-sm text-plum-wine-700">
              The word was
            </p>
            <p className="mt-1 font-heading text-[40px] leading-snug text-plum-wine-900">
              {game.revealed}
            </p>
            <button
              onClick={() => startGame(mode)}
              className="mt-4 rounded-full bg-plum-wine-700 px-6 py-2.5 font-body text-base font-semibold text-white transition hover:bg-plum-wine-800"
            >
              Try again
            </button>
          </div>
        )}

        {/* Give up */}
        {game && !game.solved && !game.revealed && game.guesses.length > 0 && (
          <div className="mb-3 flex justify-end">
            <button
              onClick={giveUp}
              className="font-body text-xs font-medium text-plum-wine-500 underline-offset-2 hover:text-plum-wine-700 hover:underline"
            >
              give up
            </button>
          </div>
        )}

        {/* Latest guess */}
        {latest && (
          <div className="mb-4">
            <p className="mb-1 font-body text-xs font-medium uppercase tracking-wide text-neutral-500">
              latest guess
            </p>
            <GuessRow g={latest} vocabSize={game!.vocabSize} highlight />
          </div>
        )}

        {/* Sorted guesses */}
        {sortedGuesses.length > 0 && (
          <div>
            <div className="mb-2 flex items-center justify-between font-body text-xs font-medium uppercase tracking-wide text-neutral-500">
              <span>guesses ({sortedGuesses.length})</span>
              <span>rank · similarity</span>
            </div>
            <ul className="space-y-2">
              {sortedGuesses.map((g) => (
                <li key={g.guess}>
                  <GuessRow g={g} vocabSize={game!.vocabSize} />
                </li>
              ))}
            </ul>
          </div>
        )}

        <footer className="mt-16 text-center font-body text-xs text-neutral-500">
          Built with Next.js · OpenAI embeddings ·{" "}
          {game?.vocabSize ?? "—"}-word craft vocabulary
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
  const c = rankColor(g.rank);
  const pct =
    g.rank <= vocabSize
      ? Math.max(2, 100 - (g.rank / vocabSize) * 100)
      : Math.max(2, Math.min(100, g.similarity * 100));
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-white shadow-sm transition ${
        highlight
          ? "border-plum-wine-500 ring-2 ring-plum-wine-200"
          : "border-neutral-200"
      }`}
    >
      <div
        className={`absolute inset-y-0 left-0 ${c.bar} opacity-40`}
        style={{ width: `${pct}%` }}
      />
      <div className="relative flex items-center justify-between px-4 py-3">
        <span className="font-body text-base font-medium text-plum-wine-900">
          {g.guess}
        </span>
        <span className="flex items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 font-body text-xs font-medium tabular-nums ${c.pill}`}
          >
            #{rankLabel(g.rank, vocabSize)}
          </span>
          <span className="font-body text-xs text-neutral-500 tabular-nums">
            {(g.similarity * 100).toFixed(1)}%
          </span>
        </span>
      </div>
    </div>
  );
}
