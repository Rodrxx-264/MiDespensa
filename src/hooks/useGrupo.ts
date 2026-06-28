"use client";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { createClient } from "@/lib/supabase/client";
import { isLocalMode, readLocalState, writeLocalState } from "@/lib/local";
import type { Grupo, Perfil } from "@/types";

export function useGrupo() {
  const supabase = createClient();
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [grupo, setGrupo] = useState<Grupo | null>(null);
  const [miembros, setMiembros] = useState<Perfil[]>([]);
  const [loading, setLoading] = useState(true);
  async function cargar() {
    setLoading(true);
    if (isLocalMode()) {
      const state = readLocalState();
      setPerfil(state.perfil); setGrupo(state.grupo); setMiembros(state.grupo ? [state.perfil] : []); setLoading(false); return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return setLoading(false);
    const { data: p } = await supabase.from("perfiles").select("*").eq("id", user.id).single();
    setPerfil(p);
    if (p?.grupo_id) {
      const [{ data: g }, { data: m }] = await Promise.all([supabase.from("grupos").select("*").eq("id", p.grupo_id).single(), supabase.from("perfiles").select("*").eq("grupo_id", p.grupo_id)]);
      setGrupo(g); setMiembros(m ?? []);
    } else { setGrupo(null); setMiembros([]); }
    setLoading(false);
  }
  useEffect(() => { void cargar(); }, []);
  async function crearGrupo(nombre: string) {
    if (isLocalMode()) {
      const state = readLocalState(); const id = uuid();
      state.grupo = { id, nombre, codigo_qr: uuid(), admin_id: state.perfil.id, created_at: new Date().toISOString() };
      state.perfil.grupo_id = id; state.miembros = [state.perfil]; writeLocalState(state); await cargar(); return;
    }
    const { data: { user } } = await supabase.auth.getUser(); if (!user) throw new Error("Sesión requerida");
    const codigo_qr = uuid();
    const { data, error } = await supabase.from("grupos").insert({ nombre, codigo_qr, admin_id: user.id }).select("*").single(); if (error) throw error;
    await supabase.from("perfiles").update({ grupo_id: data.id }).eq("id", user.id); await cargar();
  }
  async function unirse(codigo: string) {
    if (isLocalMode()) throw new Error("El modo local no puede unirse a grupos en la nube.");
    const { data: g, error } = await supabase.from("grupos").select("*").eq("codigo_qr", codigo).single(); if (error) throw error;
    const { data: { user } } = await supabase.auth.getUser(); if (!user) throw new Error("Sesión requerida");
    await supabase.from("perfiles").update({ grupo_id: g.id }).eq("id", user.id); await cargar();
  }
  async function regenerarQR() { if (!grupo) return; if (isLocalMode()) { const state = readLocalState(); if (state.grupo) state.grupo.codigo_qr = uuid(); writeLocalState(state); await cargar(); return; } await supabase.from("grupos").update({ codigo_qr: uuid() }).eq("id", grupo.id); await cargar(); }
  async function salir(id = perfil?.id) { if (!id) return; if (isLocalMode()) { const state = readLocalState(); state.perfil.grupo_id = null; state.grupo = null; state.miembros = []; writeLocalState(state); await cargar(); return; } await supabase.from("perfiles").update({ grupo_id: null }).eq("id", id); await cargar(); }
  return { perfil, grupo, miembros, loading, crearGrupo, unirse, regenerarQR, salir, recargar: cargar };
}
