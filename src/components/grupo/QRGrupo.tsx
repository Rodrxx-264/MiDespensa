"use client";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/Button";
import type { Grupo } from "@/types";

export function QRGrupo({ grupo, onRegenerar }: { grupo: Grupo; onRegenerar: () => Promise<void> }) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/unirse?codigo=${grupo.codigo_qr}`;
  async function copiar(texto: string) { await navigator.clipboard.writeText(texto); }
  const codigoCorto = grupo.codigo_qr.length <= 8;
  return <section className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5 text-center"><p className="eyebrow">Invitación</p><h2 className="mt-2 text-2xl font-black tracking-[-.05em]">QR y código del grupo</h2><p className="mt-2 text-sm text-[var(--muted)]">Escanea el QR o comparte el código único para que otros se unan.</p><div className="mx-auto my-5 w-fit rounded-[28px] bg-[var(--surface)] p-4 shadow-sm"><QRCode value={url} size={220} /></div><div className="rounded-2xl bg-[var(--surface)] p-3 text-left"><p className="text-xs font-black uppercase tracking-[.18em] text-[var(--muted)]">Código único</p><p className="mt-1 break-all font-mono text-lg font-black tracking-[.18em] text-[var(--ink)]">{grupo.codigo_qr}</p>{!codigoCorto && <p className="mt-2 text-xs text-[var(--muted)]">Este grupo usa un código antiguo. Regenera el QR para obtener un código corto fácil de escribir.</p>}<div className="mt-3 grid grid-cols-2 gap-2"><Button variant="secondary" onClick={() => copiar(grupo.codigo_qr)}>Copiar código</Button><Button variant="secondary" onClick={() => copiar(url)}>Copiar enlace</Button></div></div><Button className="mt-4" variant="secondary" onClick={onRegenerar}>Regenerar QR</Button></section>;
}
