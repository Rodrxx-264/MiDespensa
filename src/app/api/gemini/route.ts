import { NextResponse } from "next/server";
import { buscarPreciosGemini } from "@/lib/gemini";
import { createClient } from "@/lib/supabase/server";

const buckets = new Map<string, number[]>();
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    const { data: perfil } = await supabase.from("perfiles").select("grupo_id").eq("id", user.id).single();
    const key = perfil?.grupo_id ?? user.id; const now = Date.now(); const recent = (buckets.get(key) ?? []).filter((t) => now - t < 60_000);
    if (recent.length >= 10) return NextResponse.json({ error: "Máximo 10 búsquedas por minuto" }, { status: 429 });
    buckets.set(key, [...recent, now]);
    const resultado = await buscarPreciosGemini(body.producto, body.lista_completa);
    if (perfil?.grupo_id && resultado.precios?.length) await supabase.from("historial_precios").insert(resultado.precios.map((p) => ({ grupo_id: perfil.grupo_id, producto_nombre: body.producto ?? "Lista completa", tienda: p.tienda, precio: p.precio, presentacion: p.presentacion })));
    return NextResponse.json(resultado);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido al consultar Gemini";
    console.error("/api/gemini", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
