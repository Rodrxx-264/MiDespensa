import type { PriceHistoryEntry } from "@/types";

export type PriceInsight = { status: "high" | "good" | "normal" | "none"; message: string; average?: number; min?: number; max?: number; last?: number; count: number };

export function calculatePriceInsight(history: PriceHistoryEntry[], currentPrice: number): PriceInsight {
  const prices = history.map((h) => Number(h.price)).filter((p) => p > 0);
  if (prices.length < 3 || !currentPrice) return { status: "none", message: "Todavía no hay suficiente historial.", count: prices.length };
  const average = prices.reduce((a, b) => a + b, 0) / prices.length;
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const last = prices[prices.length - 1];
  if (currentPrice > average * 1.15) return { status: "high", message: "Está más caro de lo normal.", average, min, max, last, count: prices.length };
  if (currentPrice < average * 0.9) return { status: "good", message: "Buen precio según tu historial.", average, min, max, last, count: prices.length };
  return { status: "normal", message: "Precio dentro de lo normal.", average, min, max, last, count: prices.length };
}
