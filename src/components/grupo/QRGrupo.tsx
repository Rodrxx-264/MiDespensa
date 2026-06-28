"use client";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/Button";
import type { Grupo } from "@/types";

export function QRGrupo({ grupo, onRegenerar }: { grupo: Grupo; onRegenerar: () => Promise<void> }) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/unirse?codigo=${grupo.codigo_qr}`;
  return <section className="surface rounded-[32px] p-5 text-center"><p className="eyebrow">Invitación</p><h2 className="mt-2 text-2xl font-black tracking-[-.05em]">QR del grupo</h2><div className="mx-auto my-5 w-fit rounded-[28px] bg-white p-4 shadow-sm"><QRCode value={url} size={220} /></div><p className="break-all rounded-2xl bg-white/55 p-3 text-xs text-tinta/60">{url}</p><Button className="mt-4" variant="secondary" onClick={onRegenerar}>Regenerar QR</Button></section>;
}
