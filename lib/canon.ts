// Canonicalize a guess to a known reference form so that plurals and
// verb-tense variants map to a single entry. Returns the canonical word
// if found, else the cleaned input.
//
// NOTE: deliberately no Levenshtein/fuzzy typo correction. With our
// modestly-sized corpus, edit-distance-1 false positives ("folder" →
// "solder", "knot" → "knit") are far worse than the wins. The embedding
// model handles minor misspellings well enough on the off-corpus path.
export function makeCanonicalizer(knownWords: string[]) {
  const set = new Set(knownWords.map((w) => w.toLowerCase()));

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

    return w;
  };
}
