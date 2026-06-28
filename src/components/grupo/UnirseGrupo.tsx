"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";
import type { Grupo, Perfil } from "@/types";

export function UnirseGrupo() {
  const params = useSearchParams(); const router = useRouter(); const [codigo, setCodigo] = useState(params.get("codigo") ?? ""); const [grupo, setGrupo] = useState<Grupo | null>(null); const [perfil, setPerfil] = useState<Perfil | null>(null); const [scanOpen, setScanOpen] = useState(false); const [scanError, setScanError] = useState(""); const videoRef = useRef<HTMLVideoElement>(null); const streamRef = useRef<MediaStream | null>(null); const supabase = createClient();
  useEffect(() => { void inicializar(); }, []);
  useEffect(() => { if (codigo) void buscarGrupo(codigo); }, []);
  useEffect(() => { if (!scanOpen) return; void iniciarCamara(); return detenerCamara; }, [scanOpen]);
  async function inicializar() { const { data: { user } } = await supabase.auth.getUser(); if (!user) return router.push(`/auth/login?codigo=${codigo}`); const { data: p } = await supabase.from("perfiles").select("*").eq("id", user.id).single(); setPerfil(p); }
  async function buscarGrupo(valor = codigo) { const limpio = extraerCodigo(valor); setCodigo(limpio); if (!limpio) return; const { data: g } = await supabase.from("grupos").select("*").eq("codigo_qr", limpio).single(); setGrupo(g); }
  async function unirse() { if (!grupo || !perfil || perfil.grupo_id) return; await supabase.from("perfiles").update({ grupo_id: grupo.id }).eq("id", perfil.id); router.push("/dashboard"); }
  async function iniciarCamara() {
    try {
      setScanError("");
      const Detector = (window as unknown as { BarcodeDetector?: new (options: { formats: string[] }) => { detect: (source: HTMLVideoElement) => Promise<{ rawValue: string }[]> } }).BarcodeDetector;
      if (!Detector) { setScanError("Tu navegador no permite escanear QR desde la cámara. Ingresa el código manualmente."); return; }
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      const detector = new Detector({ formats: ["qr_code"] });
      const scan = async () => {
        if (!scanOpen || !videoRef.current) return;
        const codes = await detector.detect(videoRef.current).catch(() => []);
        const raw = codes[0]?.rawValue;
        if (raw) { detenerCamara(); setScanOpen(false); await buscarGrupo(raw); return; }
        requestAnimationFrame(scan);
      };
      requestAnimationFrame(scan);
    } catch { setScanError("No se pudo acceder a la cámara. Revisa permisos o ingresa el código manualmente."); }
  }
  function detenerCamara() { streamRef.current?.getTracks().forEach((track) => track.stop()); streamRef.current = null; }
  return <section className="surface mx-auto max-w-lg rounded-[32px] p-6"><p className="eyebrow">Invitación</p><h1 className="mt-2 text-4xl font-black tracking-[-.06em]">Unirse a un grupo</h1><p className="mt-2 text-sm text-tinta/60">Escanea el QR con la cámara o pega el código único que te compartieron.</p><div className="mt-5 grid gap-2"><Button onClick={() => setScanOpen((v) => !v)}>{scanOpen ? "Cerrar cámara" : "Escanear QR"}</Button>{scanOpen && <div className="overflow-hidden rounded-[24px] bg-tinta"><video ref={videoRef} autoPlay playsInline muted className="aspect-square w-full object-cover" aria-label="Vista de cámara para escanear QR"/></div>}{scanError && <p className="rounded-[18px] bg-white/65 p-3 text-sm text-[#8b3f2f]">{scanError}</p>}<div className="flex flex-col gap-2 sm:flex-row"><Input value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="Código único o enlace"/><Button variant="secondary" onClick={() => buscarGrupo()}>Buscar</Button></div></div>{grupo && <div className="mt-5 rounded-2xl bg-white/55 p-4"><p className="text-sm text-tinta/60">Grupo encontrado:</p><h2 className="text-xl font-black tracking-[-.04em]">{grupo.nombre}</h2>{perfil?.grupo_id ? <p className="mt-2 text-red-700">Ya perteneces a un grupo. Debes salir primero.</p> : <Button className="mt-3" onClick={unirse}>Unirme</Button>}</div>}</section>;
}

function extraerCodigo(valor: string) {
  try { return new URL(valor).searchParams.get("codigo")?.trim() || valor.trim(); } catch { return valor.trim(); }
}
