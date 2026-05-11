// Canonicalize a guess to a known reference form so that plurals,
// verb-tense variants, and 1-letter misspellings all map to a single
// entry. Returns the canonical word if found, else the cleaned input.

function levenshtein1(a: string, b: string): boolean {
  // Returns true iff edit distance is exactly 0 or 1.
  if (a === b) return true;
  const la = a.length;
  const lb = b.length;
  if (Math.abs(la - lb) > 1) return false;
  if (la === lb) {
    let diff = 0;
    for (let i = 0; i < la; i++) {
      if (a[i] !== b[i]) {
        diff++;
        if (diff > 1) return false;
      }
    }
    return diff === 1;
  }
  // One insertion/deletion
  const [s, l] = la < lb ? [a, b] : [b, a];
  let i = 0;
  let j = 0;
  let diff = 0;
  while (i < s.length && j < l.length) {
    if (s[i] !== l[j]) {
      diff++;
      if (diff > 1) return false;
      j++;
    } else {
      i++;
      j++;
    }
  }
  return true;
}

export function makeCanonicalizer(knownWords: string[]) {
  const set = new Set(knownWords.map((w) => w.toLowerCase()));
  // index by length for fast Levenshtein narrowing
  const byLen = new Map<number, string[]>();
  for (const w of set) {
    const arr = byLen.get(w.length);
    if (arr) arr.push(w);
    else byLen.set(w.length, [w]);
  }

  return function canon(raw: string): string {
    const w = raw.toLowerCase().trim().replace(/^[^a-z]+|[^a-z]+$/g, "");
    if (!w) return raw.toLowerCase().trim();
    if (set.has(w)) return w;

    // Lemmatization rules — try simple suffix strips and check the set.
    const tries: string[] = [];
    // plural -s
    if (w.endsWith("s") && w.length > 2) tries.push(w.slice(0, -1));
    // plural -es
    if (w.endsWith("es") && w.length > 3) tries.push(w.slice(0, -2));
    // -ies -> -y
    if (w.endsWith("ies") && w.length > 4) tries.push(w.slice(0, -3) + "y");
    // -ing  (knitting -> knit if doubled, weaving -> weave, painting -> paint)
    if (w.endsWith("ing") && w.length > 4) {
      const base = w.slice(0, -3);
      tries.push(base);
      tries.push(base + "e");
      // doubled-consonant form (knitting -> knit)
      if (base.length >= 2 && base[base.length - 1] === base[base.length - 2]) {
        tries.push(base.slice(0, -1));
      }
    }
    // -ed  (painted -> paint, baked -> bake, knitted -> knit)
    if (w.endsWith("ed") && w.length > 3) {
      const base = w.slice(0, -2);
      tries.push(base);
      tries.push(base + "e");
      if (base.length >= 2 && base[base.length - 1] === base[base.length - 2]) {
        tries.push(base.slice(0, -1));
      }
    }
    // -er  (painter -> paint, knitter -> knit) — but only if base is in set
    // and the original is long enough to avoid mangling words like "paper"
    if (w.endsWith("er") && w.length > 4) {
      const base = w.slice(0, -2);
      tries.push(base);
      tries.push(base + "e");
      if (base.length >= 2 && base[base.length - 1] === base[base.length - 2]) {
        tries.push(base.slice(0, -1));
      }
    }
    // -ly (often adjective form, rarely matches; check anyway)
    if (w.endsWith("ly") && w.length > 4) tries.push(w.slice(0, -2));

    for (const t of tries) {
      if (set.has(t)) return t;
    }

    // Fuzzy: try edit distance 1 against same-length-ish words.
    // Only for words length ≥ 4 to avoid over-matching short tokens.
    if (w.length >= 4) {
      const candidates = [
        ...(byLen.get(w.length) ?? []),
        ...(byLen.get(w.length - 1) ?? []),
        ...(byLen.get(w.length + 1) ?? []),
      ];
      for (const c of candidates) {
        if (levenshtein1(w, c)) return c;
      }
    }

    return w;
  };
}
