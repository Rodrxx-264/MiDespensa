"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";
import type { Grupo, Perfil } from "@/types";

export function UnirseGrupo() {
  const params = useSearchParams(); const router = useRouter(); const [codigo, setCodigo] = useState(params.get("codigo") ?? ""); const [grupo, setGrupo] = useState<Grupo | null>(null); const [perfil, setPerfil] = useState<Perfil | null>(null); const supabase = createClient();
  useEffect(() => { void (async () => { const { data: { user } } = await supabase.auth.getUser(); if (!user) return router.push(`/auth/login?codigo=${codigo}`); const { data: p } = await supabase.from("perfiles").select("*").eq("id", user.id).single(); setPerfil(p); if (codigo) { const { data: g } = await supabase.from("grupos").select("*").eq("codigo_qr", codigo).single(); setGrupo(g); } })(); }, [codigo]);
  async function unirse() { if (!grupo || !perfil || perfil.grupo_id) return; await supabase.from("perfiles").update({ grupo_id: grupo.id }).eq("id", perfil.id); router.push("/dashboard"); }
  return <section className="mx-auto max-w-lg rounded-[24px] bg-white p-6 shadow-suave"><h1 className="text-3xl font-black">Unirse a un grupo</h1><div className="mt-4 flex gap-2"><Input value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="Código QR"/><Button onClick={() => setCodigo(codigo)}>Buscar</Button></div>{grupo && <div className="mt-5 rounded-card bg-crema p-4"><p>Grupo encontrado:</p><h2 className="text-xl font-black">{grupo.nombre}</h2>{perfil?.grupo_id ? <p className="mt-2 text-red-700">Ya perteneces a un grupo. Debes salir primero.</p> : <Button className="mt-3" onClick={unirse}>Unirme</Button>}</div>}</section>;
}
