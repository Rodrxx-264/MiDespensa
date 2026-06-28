"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isLocalMode, readLocalState } from "@/lib/local";
import type { Lista, Producto } from "@/types";

export function useHistorial(grupoId?: string | null) {
  const [listas, setListas] = useState<Lista[]>([]); const [productos, setProductos] = useState<Record<string, Producto[]>>({}); const supabase = createClient();
  async function cargar() { if (!grupoId) return; if (isLocalMode()) { const state = readLocalState(); setListas(state.listas.filter((l) => l.grupo_id === grupoId && l.estado === "completada").sort((a, b) => String(b.completada_at).localeCompare(String(a.completada_at)))); return; } const { data } = await supabase.from("listas").select("*").eq("grupo_id", grupoId).eq("estado", "completada").order("completada_at", { ascending: false }); setListas(data ?? []); }
  async function detalle(listaId: string) { if (isLocalMode()) { const state = readLocalState(); setProductos((p) => ({ ...p, [listaId]: state.productos.filter((x) => x.lista_id === listaId) })); return; } const { data } = await supabase.from("productos").select("*").eq("lista_id", listaId); setProductos((p) => ({ ...p, [listaId]: data ?? [] })); }
  useEffect(() => { void cargar(); }, [grupoId]);
  return { listas, productos, cargar, detalle };
}
