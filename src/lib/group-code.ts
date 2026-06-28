const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function charVal(c: string) {
  const i = ALPHABET.indexOf(c);
  return i === -1 ? 0 : i;
}

/** Crea un código de 8 caracteres con 2 dígitos de verificación. */
export function createGroupCode() {
  const cryptoApi = globalThis.crypto;
  const bytes = new Uint8Array(6);
  cryptoApi.getRandomValues(bytes);
  const core = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
  const chk1 = ALPHABET[charVal(core[0]) % ALPHABET.length];
  const chk2 = ALPHABET[(charVal(core[1]) * 7 + charVal(core[2]) * 3) % ALPHABET.length];
  return core + chk1 + chk2;
}

/** Valida que un código tenga checksum correcto (sin consultar la BD). */
export function isValidGroupCode(code: string) {
  if (code.length !== 8) return false;
  for (const c of code) if (!ALPHABET.includes(c)) return false;
  const core = code.slice(0, 6);
  const chk1 = ALPHABET[charVal(core[0]) % ALPHABET.length];
  const chk2 = ALPHABET[(charVal(core[1]) * 7 + charVal(core[2]) * 3) % ALPHABET.length];
  return code[6] === chk1 && code[7] === chk2;
}

/** Normaliza un código de invitación de forma consistente con la RPC join_group_by_code. */
export function normalizeGroupCode(value: string) {
  try {
    const fromUrl = new URL(value).searchParams.get("codigo");
    if (fromUrl) return normalizeGroupCode(fromUrl);
  } catch {}
  return value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").replace(/O/g, "0");
}

/** Lanza si el código tiene formato inválido (usar antes de enviar a la BD). */
export function assertValidCode(code: string) {
  const n = normalizeGroupCode(code);
  if (n.length < 6 || n.length > 36) throw new Error("El código debe tener entre 6 y 36 caracteres.");
  if (n.length === 8 && !isValidGroupCode(n)) throw new Error("El código no es válido. Pedí que regeneren el QR.");
}
