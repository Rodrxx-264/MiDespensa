import type { PriceHistoryEntry, ProductPriority } from "@/types";
import { normalizeProductName } from "./normalize";

export type SuggestedProduct = { name: string; normalizedName: string; category: string; suggestedQuantity: number; estimatedPrice: number; priority: ProductPriority; reason: string };

export function suggestRecurringProducts(history: PriceHistoryEntry[]): SuggestedProduct[] {
  const grouped = new Map<string, PriceHistoryEntry[]>();
  history.forEach((entry) => grouped.set(entry.normalized_product_name || normalizeProductName(entry.product_name), [...(grouped.get(entry.normalized_product_name) ?? []), entry]));
  return Array.from(grouped.entries()).filter(([, items]) => items.length >= 2).slice(0, 12).map(([normalizedName, items]) => {
    const last = items[items.length - 1];
    const avgQty = items.reduce((s, i) => s + Number(i.quantity || 1), 0) / items.length;
    const avgPrice = items.reduce((s, i) => s + Number(i.price || 0), 0) / items.length;
    return { name: last.product_name, normalizedName, category: "Otros", suggestedQuantity: Math.max(1, Math.round(avgQty)), estimatedPrice: Number(avgPrice.toFixed(2)), priority: "important", reason: `Aparece en ${items.length} compras anteriores` };
  });
}
