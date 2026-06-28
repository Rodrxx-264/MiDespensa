"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isLocalMode, readLocalState, writeLocalState } from "@/lib/local";
import type { CategoryBudget } from "@/types";

export function useCategoryBudgets(listId?: string | null) {
  const [budgets, setBudgets] = useState<CategoryBudget[]>([]); const supabase = createClient(); const [local, setLocal] = useState(false);
  async function cargar() { if (!listId) return; const { data: { user } } = await supabase.auth.getUser(); const useLocal = !user && isLocalMode(); setLocal(useLocal); if (useLocal) { setBudgets(readLocalState().categoryBudgets.filter((b) => b.list_id === listId)); return; } const { data } = await supabase.from("category_budgets").select("*").eq("list_id", listId); setBudgets(data ?? []); }
  useEffect(() => { void cargar(); }, [listId]);
  async function setBudget(category: string, budget: number) { if (!listId) return; if (local) { const state = readLocalState(); const existing = state.categoryBudgets.find((b) => b.list_id === listId && b.category === category); const now = new Date().toISOString(); if (existing) Object.assign(existing, { budget, updated_at: now }); else state.categoryBudgets.push({ id: crypto.randomUUID(), list_id: listId, category, budget, created_at: now, updated_at: now }); writeLocalState(state); await cargar(); return; } await supabase.from("category_budgets").upsert({ list_id: listId, category, budget }, { onConflict: "list_id,category" }); await cargar(); }
  return { budgets, setBudget, recargar: cargar };
}
