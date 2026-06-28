"use client";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/Button";
import type { Grupo } from "@/types";

export function QRGrupo({ grupo, onRegenerar }: { grupo: Grupo; onRegenerar: () => Promise<void> }) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/unirse?codigo=${grupo.codigo_qr}`;
  return <section className="rounded-card bg-white p-5 text-center shadow-suave"><h2 className="text-xl font-black">QR del grupo</h2><div className="mx-auto my-5 w-fit rounded-card bg-white p-4"><QRCode value={url} size={220} /></div><p className="break-all text-sm text-tinta/70">{url}</p><Button className="mt-4" variant="secondary" onClick={onRegenerar}>Regenerar QR</Button></section>;
}
