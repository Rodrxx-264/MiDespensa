"use client";
import { useMemo } from "react";
import { useHistorial } from "./useHistorial";

export function useEstadisticas(grupoId?: string | null) {
  const historial = useHistorial(grupoId);
  const gasto = historial.listas.map((l) => ({ fecha: new Date(l.completada_at ?? l.created_at).toLocaleDateString("es-GT"), total: Number(l.total_real || l.total_estimado || 0) })).reverse();
  const comparativa = useMemo(() => { const [actual, anterior] = historial.listas; const a = Number(actual?.total_real ?? 0), b = Number(anterior?.total_real ?? 0); return { diferencia: a - b, porcentaje: b ? ((a - b) / b) * 100 : 0 }; }, [historial.listas]);
  return { ...historial, gasto, comparativa };
}
