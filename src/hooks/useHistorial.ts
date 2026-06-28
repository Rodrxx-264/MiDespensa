"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Lista, Producto } from "@/types";

export function useHistorial(grupoId?: string | null) {
  const [listas, setListas] = useState<Lista[]>([]); const [productos, setProductos] = useState<Record<string, Producto[]>>({}); const supabase = createClient();
  async function cargar() { if (!grupoId) return; const { data } = await supabase.from("listas").select("*").eq("grupo_id", grupoId).eq("estado", "completada").order("completada_at", { ascending: false }); setListas(data ?? []); }
  async function detalle(listaId: string) { const { data } = await supabase.from("productos").select("*").eq("lista_id", listaId); setProductos((p) => ({ ...p, [listaId]: data ?? [] })); }
  useEffect(() => { void cargar(); }, [grupoId]);
  return { listas, productos, cargar, detalle };
}
