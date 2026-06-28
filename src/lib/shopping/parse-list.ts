import type { ParsedProduct, ProductPriority } from "@/types";

const FILLER = /\b(compra|comprar|necesito|agregar|porfa|por favor)\b/gi;
const UNITS = ["bolsa", "paquete", "caja", "botella", "lata", "libra", "kg", "litro", "unidad"];

export function parseShoppingText(input: string): ParsedProduct[] {
  return input.split(/\n|,/).map(parseLine).filter((p): p is ParsedProduct => Boolean(p?.name));
}

function parseLine(line: string): ParsedProduct | null {
  let text = line.replace(FILLER, "").replace(/\s+/g, " ").trim();
  if (!text) return null;
  let quantity = 1;
  let unit: string | undefined;
  const qty = text.match(/^(\d+(?:\.\d+)?)\s+(.+)$/);
  if (qty) { quantity = Number(qty[1]); text = qty[2].trim(); }
  const unitMatch = text.match(new RegExp(`^(${UNITS.join("|")})\\s+(?:de\\s+)?(.+)$`, "i"));
  if (unitMatch) { unit = unitMatch[1].toLowerCase(); text = unitMatch[2].trim(); }
  const name = normalizeDisplayName(text);
  const category = detectCategory(name);
  return { name, quantity, unit, category, priority: suggestPriority(category, name) };
}

function normalizeDisplayName(value: string) {
  return value.trim().replace(/\s+/g, " ").replace(/^./, (c) => c.toUpperCase());
}

function detectCategory(name: string) {
  const n = name.toLowerCase();
  if (/huevo|pollo|arroz|frijol|pasta|pan|azucar|aceite|tomate|carne|verdura|fruta/.test(n)) return "Comida";
  if (/jabon|cloro|detergente|suavizante|desinfectante/.test(n)) return "Limpieza";
  if (/shampoo|pasta dental|desodorante|papel higienico|higiene/.test(n)) return "Higiene";
  if (/gaseosa|jugo|leche|agua|bebida/.test(n)) return "Bebidas";
  if (/galleta|cereal|snack|dulce|papalina/.test(n)) return "Snacks";
  if (/perro|gato|mascota|concentrado/.test(n)) return "Mascotas";
  return "Otros";
}

function suggestPriority(category: string, name: string): ProductPriority {
  if (category === "Comida" && !/gaseosa|galleta|snack|dulce|cereal/.test(name.toLowerCase())) return "essential";
  if (category === "Snacks") return "optional";
  if (category === "Bebidas" && /gaseosa|jugo/.test(name.toLowerCase())) return "optional";
  return "important";
}
