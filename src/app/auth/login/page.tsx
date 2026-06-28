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
  function entrarLocal() {
    document.cookie = "mi_despensa_local=1; path=/; max-age=31536000; SameSite=Lax";
    location.href = params.get("next") ?? "/dashboard";
  }
  return <main className="grid min-h-screen place-items-center bg-crema p-5"><section className="w-full max-w-md rounded-[24px] bg-white p-8 text-center shadow-suave"><p className="text-sm font-bold uppercase tracking-[.25em] text-bosque">Mi Despensa</p><h1 className="mt-3 text-3xl font-black">Organiza la compra de tu hogar</h1><p className="mt-3 text-tinta/70">Usa Google para sincronizar en la nube o entra en modo local para guardar los datos solo en este navegador.</p><Button className="mt-8 w-full" size="lg" onClick={login} aria-label="Continuar con Google">Continuar con Google</Button><Button className="mt-3 w-full" size="lg" variant="secondary" onClick={entrarLocal} aria-label="Entrar en modo local">Entrar sin cuenta</Button><p className="mt-4 text-xs text-tinta/60">Modo local: no comparte datos entre dispositivos y no usa Supabase.</p></section></main>;
}
