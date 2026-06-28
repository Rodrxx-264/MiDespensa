"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isLocalMode, readLocalState } from "@/lib/local";
import type { PriceHistoryEntry } from "@/types";

export function usePriceHistory(groupId?: string | null) {
  const [history, setHistory] = useState<PriceHistoryEntry[]>([]); const supabase = createClient();
  async function cargar() { if (!groupId) return; const { data: { user } } = await supabase.auth.getUser(); if (!user && isLocalMode()) { setHistory(readLocalState().priceHistory.filter((h) => h.group_id === groupId)); return; } const { data } = await supabase.from("historial_precios").select("id, grupo_id, list_id, producto_nombre, normalized_product_name, tienda, store, precio, quantity, unit, purchased_at, fecha_consulta").eq("grupo_id", groupId); setHistory((data ?? []).map((h: any) => ({ id: h.id, group_id: h.grupo_id, list_id: h.list_id, product_name: h.producto_nombre, normalized_product_name: h.normalized_product_name, store: h.store ?? h.tienda, price: h.precio, quantity: h.quantity ?? 1, unit: h.unit, purchased_at: h.purchased_at ?? h.fecha_consulta }))); }
  useEffect(() => { void cargar(); }, [groupId]);
  return { history, recargar: cargar };
}
