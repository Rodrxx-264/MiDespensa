const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function createGroupCode(length = 6) {
  const cryptoApi = globalThis.crypto;
  const bytes = new Uint8Array(length);
  cryptoApi.getRandomValues(bytes);
  return Array.from(bytes, (byte) => ALPHABET[byte % ALPHABET.length]).join("");
}

export function normalizeGroupCode(value: string) {
  try {
    const fromUrl = new URL(value).searchParams.get("codigo");
    if (fromUrl) return normalizeGroupCode(fromUrl);
  } catch {}
  const raw = value.trim();
  if (raw.includes("-") || raw.length > 12) return raw;
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, "").replace(/O/g, "0").trim();
}
