import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/dashboard";
  if (code) await createClient().auth.exchangeCodeForSession(code);
  const response = NextResponse.redirect(new URL(next, url.origin));
  response.cookies.set("mi_despensa_local", "", { path: "/", maxAge: 0 });
  return response;
}
