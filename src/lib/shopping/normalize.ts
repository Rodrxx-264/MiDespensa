const GENERIC_PREFIXES = [/^\d+(\.\d+)?\s+/, /^(bolsa|paquete|caja|botella|lata|libra|unidad)\s+de\s+/i];

export function normalizeProductName(name: string) {
  let value = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  for (const prefix of GENERIC_PREFIXES) value = value.replace(prefix, "");
  return value.split(" ").map((word) => singularize(word)).join(" ").trim();
}

export function normalizeStoreName(store: string) {
  return store.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim();
}

function singularize(word: string) {
  if (word.length > 5 && word.endsWith("es")) return word.slice(0, -2);
  if (word.length > 4 && word.endsWith("s")) return word.slice(0, -1);
  return word;
}
