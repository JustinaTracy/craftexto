import crypto from "node:crypto";

function getKey(): Buffer {
  const secret = process.env.OPENAI_API_KEY || "craftexto-dev-secret";
  return crypto.createHash("sha256").update(secret).digest();
}

export type GameMode = "daily" | "freeplay";

export function encodeGame(mode: GameMode, wordIndex: number): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getKey(), iv);
  const payload = Buffer.from(`${mode}:${wordIndex}`, "utf8");
  const enc = Buffer.concat([cipher.update(payload), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString("base64url");
}

export function decodeGame(token: string): { mode: GameMode; wordIndex: number } {
  const buf = Buffer.from(token, "base64url");
  if (buf.length < 28) throw new Error("invalid token");
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const enc = buf.subarray(28);
  const decipher = crypto.createDecipheriv("aes-256-gcm", getKey(), iv);
  decipher.setAuthTag(tag);
  const data = Buffer.concat([decipher.update(enc), decipher.final()]).toString("utf8");
  const [mode, idxStr] = data.split(":");
  if (mode !== "daily" && mode !== "freeplay") throw new Error("invalid mode");
  const wordIndex = Number.parseInt(idxStr, 10);
  if (!Number.isFinite(wordIndex)) throw new Error("invalid index");
  return { mode: mode as GameMode, wordIndex };
}
