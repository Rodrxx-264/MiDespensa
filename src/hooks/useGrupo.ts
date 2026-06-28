"use client";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { createClient } from "@/lib/supabase/client";
import { isLocalMode, readLocalState, writeLocalState } from "@/lib/local";
import { createGroupCode, normalizeGroupCode } from "@/lib/group-code";
import type { Grupo, Perfil } from "@/types";

export function useGrupo() {
  const supabase = createClient();
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [grupo, setGrupo] = useState<Grupo | null>(null);
  const [miembros, setMiembros] = useState<Perfil[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function cargar() {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user && isLocalMode()) {
        const state = readLocalState();
        setPerfil(state.perfil);
        setGrupo(state.grupo);
        setMiembros(state.grupo ? [state.perfil] : []);
        setLoading(false);
        return;
      }
      if (!user) { setLoading(false); return; }
      const { data: p } = await supabase.from("perfiles").select("*").eq("id", user.id).single();
      setPerfil(p);
      if (p?.grupo_id) {
        const [{ data: g }, { data: m }] = await Promise.all([
          supabase.from("grupos").select("*").eq("id", p.grupo_id).single(),
          supabase.from("perfiles").select("*").eq("grupo_id", p.grupo_id),
        ]);
        setGrupo(g);
        setMiembros(m ?? []);
      } else {
        setGrupo(null);
        setMiembros([]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar grupo");
    }
    setLoading(false);
  }

  useEffect(() => { void cargar(); }, []);

  async function crearGrupo(nombre: string) {
    setError(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user && isLocalMode()) {
      const state = readLocalState();
      const id = uuid();
      state.grupo = { id, nombre, codigo_qr: createGroupCode(), admin_id: state.perfil.id, created_at: new Date().toISOString() };
      state.perfil.grupo_id = id;
      state.miembros = [state.perfil];
      writeLocalState(state);
      await cargar();
      return;
    }
    if (!user) { setError("Necesitás iniciar sesión para crear un grupo en la nube"); return; }
    try {
      const codigo_qr = createGroupCode();
      const { data, error: err } = await supabase.from("grupos").insert({ nombre, codigo_qr, admin_id: user.id }).select("*").single();
      if (err) throw err;
      await supabase.from("perfiles").update({ grupo_id: data.id }).eq("id", user.id);
      await cargar();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al crear grupo. Verificá que Supabase esté configurado.");
    }
  }

  async function unirse(codigo: string) {
    setError(null);
    if (isLocalMode()) { setError("El modo local no puede unirse a grupos en la nube."); return; }
    try {
      const { data: g, error: err } = await supabase.from("grupos").select("*").eq("codigo_qr", normalizeGroupCode(codigo)).single();
      if (err) throw err;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setError("Sesión requerida"); return; }
      await supabase.from("perfiles").update({ grupo_id: g.id }).eq("id", user.id);
      await cargar();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al unirse al grupo");
    }
  }

  async function regenerarQR() {
    if (!grupo) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user && isLocalMode()) {
        const state = readLocalState();
        if (state.grupo) state.grupo.codigo_qr = createGroupCode();
        writeLocalState(state);
        await cargar();
        return;
      }
      await supabase.from("grupos").update({ codigo_qr: createGroupCode() }).eq("id", grupo.id);
      await cargar();
    } catch {}
  }

  async function salir(id = perfil?.id) {
    if (!id) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user && isLocalMode()) {
        const state = readLocalState();
        state.perfil.grupo_id = null;
        state.grupo = null;
        state.miembros = [];
        writeLocalState(state);
        await cargar();
        return;
      }
      await supabase.from("perfiles").update({ grupo_id: null }).eq("id", id);
      await cargar();
    } catch {}
  }

  return { perfil, grupo, miembros, loading, error, crearGrupo, unirse, regenerarQR, salir, recargar: cargar };
}
