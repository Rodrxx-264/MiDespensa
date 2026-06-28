"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isLocalMode, readLocalState, writeLocalState } from "@/lib/local";
import { normalizeProductName } from "@/lib/shopping/normalize";
import type { PantryItem } from "@/types";

export function usePantry(groupId?: string | null) {
  const [items, setItems] = useState<PantryItem[]>([]); const [local, setLocal] = useState(false); const supabase = createClient();
  async function cargar() { if (!groupId) return; const { data: { user } } = await supabase.auth.getUser(); const useLocal = !user && isLocalMode(); setLocal(useLocal); if (useLocal) { setItems(readLocalState().pantryItems.filter((i) => i.group_id === groupId)); return; } const { data } = await supabase.from("pantry_items").select("*").eq("group_id", groupId).order("created_at", { ascending: false }); setItems(data ?? []); }
  useEffect(() => { void cargar(); }, [groupId]);
  async function addItem(data: Partial<PantryItem>) { if (!groupId || !data.name) return; const now = new Date().toISOString(); if (local) { const state = readLocalState(); state.pantryItems.push({ id: crypto.randomUUID(), group_id: groupId, name: data.name, normalized_name: normalizeProductName(data.name), quantity: Number(data.quantity ?? 1), unit: data.unit ?? "unidad", category: data.category ?? "Otros", expires_at: data.expires_at ?? null, low_stock: Boolean(data.low_stock), created_by: state.perfil.id, created_at: now, updated_at: now }); writeLocalState(state); await cargar(); return; } const { data: { user } } = await supabase.auth.getUser(); await supabase.from("pantry_items").insert({ group_id: groupId, name: data.name, normalized_name: normalizeProductName(data.name), quantity: data.quantity ?? 1, unit: data.unit ?? "unidad", category: data.category ?? "Otros", expires_at: data.expires_at, low_stock: data.low_stock ?? false, created_by: user?.id }); await cargar(); }
  async function updateItem(id: string, data: Partial<PantryItem>) { if (local) { const state = readLocalState(); const item = state.pantryItems.find((i) => i.id === id); if (item) Object.assign(item, data, { normalized_name: normalizeProductName(data.name ?? item.name), updated_at: new Date().toISOString() }); writeLocalState(state); await cargar(); return; } await supabase.from("pantry_items").update(data.name ? { ...data, normalized_name: normalizeProductName(data.name) } : data).eq("id", id); await cargar(); }
  async function deleteItem(id: string) { if (local) { const state = readLocalState(); state.pantryItems = state.pantryItems.filter((i) => i.id !== id); writeLocalState(state); await cargar(); return; } await supabase.from("pantry_items").delete().eq("id", id); await cargar(); }
  return { items, addItem, updateItem, deleteItem, recargar: cargar };
}
