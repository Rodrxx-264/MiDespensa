"use client";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { hoyLista } from "@/lib/utils";
import type { Lista, Producto } from "@/types";
import { useToast } from "@/components/ui/Toast";

export function useListaActiva(grupoId?: string | null) {
  const supabase = createClient();
  const toast = useToast();
  const [lista, setLista] = useState<Lista | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  async function cargar() {
    if (!grupoId) return setLoading(false);
    setLoading(true);
    let { data: l } = await supabase.from("listas").select("*").eq("grupo_id", grupoId).eq("estado", "activa").maybeSingle();
    if (!l) { const r = await supabase.from("listas").insert({ grupo_id: grupoId, nombre: hoyLista() }).select("*").single(); l = r.data; }
    setLista(l as Lista);
    const { data: ps } = await supabase.from("productos").select("*").eq("lista_id", l!.id).order("created_at");
    setProductos(ps ?? []); setLoading(false);
  }
  useEffect(() => { void cargar(); }, [grupoId]);
  useEffect(() => {
    if (!lista?.id) return;
    const ch = supabase.channel(`lista-activa-${lista.id}`).on("postgres_changes", { event: "*", schema: "public", table: "productos", filter: `lista_id=eq.${lista.id}` }, (payload) => {
      void cargar();
      const nuevo = payload.new as Partial<Producto>;
      if (payload.eventType === "INSERT") toast(`${nuevo.agregado_por_nombre ?? "Alguien"} agregó ${nuevo.nombre}`);
      if (payload.eventType === "UPDATE") toast(`${nuevo.nombre ?? "Producto"} fue actualizado`);
    }).subscribe();
    return () => { void supabase.removeChannel(ch); };
  }, [lista?.id]);
  const agrupados = useMemo(() => productos.reduce<Record<string, Producto[]>>((acc, p) => { (acc[p.categoria] ??= []).push(p); return acc; }, {}), [productos]);
  async function agregar(data: Partial<Producto>) {
    const { data: { user } } = await supabase.auth.getUser(); if (!lista || !user) return;
    const { data: perfil } = await supabase.from("perfiles").select("nombre").eq("id", user.id).single();
    await supabase.from("productos").insert({ ...data, lista_id: lista.id, agregado_por: user.id, agregado_por_nombre: perfil?.nombre ?? user.email }); await cargar();
  }
  async function actualizar(id: string, data: Partial<Producto>) { await supabase.from("productos").update(data).eq("id", id); await cargar(); }
  async function eliminar(id: string) { await supabase.from("productos").delete().eq("id", id); await cargar(); }
  async function cerrar(nombre: string) { if (!lista) return; const { data: { user } } = await supabase.auth.getUser(); await supabase.from("listas").update({ estado: "completada", nombre, cerrada_por: user?.id, completada_at: new Date().toISOString() }).eq("id", lista.id); setLista(null); await cargar(); }
  return { lista, productos, agrupados, loading, agregar, actualizar, eliminar, cerrar, recargar: cargar };
}
