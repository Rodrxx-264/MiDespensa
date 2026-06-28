"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ResultadoPrecios } from "./ResultadoPrecios";
import type { Producto, ResultadoGemini } from "@/types";

export function BuscarPrecios({ producto, lista, onUsar }: { producto?: string; lista?: Producto[]; onUsar?: (precio: number, tienda: string) => void }) {
  const [open, setOpen] = useState(false); const [loading, setLoading] = useState(false); const [resultado, setResultado] = useState<ResultadoGemini | null>(null); const [error, setError] = useState("");
  async function buscar() {
    setOpen(true); setLoading(true); setError(""); setResultado(null);
    try {
      const res = await fetch("/api/gemini", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ producto, lista_completa: lista }) });
      const text = await res.text();
      const data = text ? JSON.parse(text) : null;
      if (!res.ok) throw new Error(data?.error ?? `Error ${res.status} al consultar Gemini`);
      setResultado(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo consultar Gemini.");
    } finally {
      setLoading(false);
    }
  }
  return <><Button type="button" variant="secondary" onClick={buscar}>{lista ? "Buscar precios de toda la lista" : "Buscar precio con IA"}</Button><Modal open={open} onOpenChange={setOpen} title="Precios con Gemini">{loading && <p className="rounded-card bg-crema p-4" aria-live="polite">Buscando precios actuales en Guatemala...</p>}{error && <p className="rounded-card bg-red-50 p-4 font-semibold text-red-700" role="alert">{error}</p>}{resultado && <ResultadoPrecios resultado={resultado} onUsar={onUsar}/>}</Modal></>;
}
