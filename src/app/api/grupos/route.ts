import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createGroupCode } from "@/lib/group-code";

export async function POST(request: Request) {
  const { nombre } = await request.json(); const supabase = createClient(); const { data: { user } } = await supabase.auth.getUser();
  if (!user || !nombre?.trim()) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  const { data, error } = await supabase.from("grupos").insert({ nombre, codigo_qr: createGroupCode(), admin_id: user.id }).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  await supabase.from("perfiles").update({ grupo_id: data.id }).eq("id", user.id);
  return NextResponse.json(data);
}
