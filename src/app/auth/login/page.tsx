"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

export default function LoginPage() { return <Suspense><Login /></Suspense>; }
function Login() {
  const params = useSearchParams();
  async function login() {
    const supabase = createClient();
    const codigo = params.get("codigo");
    const next = params.get("next") ?? (codigo ? `/unirse?codigo=${codigo}` : "/dashboard");
    await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}` } });
  }
  return <main className="grid min-h-screen place-items-center bg-crema p-5"><section className="w-full max-w-md rounded-[24px] bg-white p-8 text-center shadow-suave"><p className="text-sm font-bold uppercase tracking-[.25em] text-bosque">Mi Despensa</p><h1 className="mt-3 text-3xl font-black">Organiza la compra de tu hogar</h1><p className="mt-3 text-tinta/70">Inicia sesión para sincronizar tu grupo familiar, historial y precios en la nube.</p><Button className="mt-8 w-full" size="lg" onClick={login} aria-label="Continuar con Google">Continuar con Google</Button></section></main>;
}
