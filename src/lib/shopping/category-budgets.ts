import type { CategoryBudget, Producto } from "@/types";

export function getCategoryBudgetRows(products: Producto[], budgets: CategoryBudget[]) {
  const categories = Array.from(new Set([...products.map((p) => p.categoria), ...budgets.map((b) => b.category)]));
  return categories.map((category) => {
    const budget = Number(budgets.find((b) => b.category === category)?.budget ?? 0);
    const estimated = products.filter((p) => p.categoria === category).reduce((sum, p) => sum + Number(p.precio_estimado ?? 0) * Number(p.cantidad ?? 1), 0);
    const real = products.filter((p) => p.categoria === category && p.estado === "comprado").reduce((sum, p) => sum + Number(p.precio_real ?? 0) * Number(p.cantidad ?? 1), 0);
    const ratio = budget ? estimated / budget : 0;
    const state = !budget || ratio < 0.8 ? "good" : ratio <= 1 ? "warn" : "over";
    return { category, budget, estimated, real, difference: budget - estimated, state };
  });
}
