import type { Producto, ProductPriority } from "@/types";

export type BudgetRescueSuggestion = { product: Producto; savings: number; reason: string };
const RANK: Record<ProductPriority, number> = { optional: 0, important: 1, essential: 2 };

export function getBudgetRescueSuggestions({ products, maxBudget }: { products: Producto[]; maxBudget: number | null | undefined }) {
  const totalEstimated = products.reduce((sum, p) => sum + subtotal(p), 0);
  const excess = maxBudget ? Math.max(0, totalEstimated - maxBudget) : 0;
  if (!maxBudget || excess <= 0) return { totalEstimated, excess: 0, suggestions: [] as BudgetRescueSuggestion[], projectedTotal: totalEstimated };
  let covered = 0;
  const suggestions = products
    .filter((p) => (p.status ?? "pending") !== "not_found" && p.estado !== "comprado")
    .sort((a, b) => (RANK[(a.priority ?? "important") as ProductPriority] - RANK[(b.priority ?? "important") as ProductPriority]) || subtotal(b) - subtotal(a))
    .filter((p) => {
      if (covered >= excess) return false;
      covered += subtotal(p);
      return true;
    })
    .map((product) => ({ product, savings: subtotal(product), reason: reasonFor(product.priority ?? "important") }));
  return { totalEstimated, excess, suggestions, projectedTotal: Math.max(0, totalEstimated - covered) };
}

function subtotal(product: Producto) { return Number(product.precio_estimado ?? 0) * Number(product.cantidad ?? 1); }
function reasonFor(priority: ProductPriority) { return priority === "optional" ? "Es opcional" : priority === "important" ? "Puede ajustarse" : "Solo si es necesario"; }
