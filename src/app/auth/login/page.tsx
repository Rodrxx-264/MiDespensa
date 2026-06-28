"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

export default function LoginPage() { return <Suspense><Login /></Suspense>; }
function Login() {
  const params = useSearchParams();
  async function login() {
    document.cookie = "mi_despensa_local=; path=/; max-age=0; SameSite=Lax";
    const supabase = createClient();
    const codigo = params.get("codigo");
    const next = params.get("next") ?? (codigo ? `/unirse?codigo=${codigo}` : "/dashboard");
    await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}` } });
  }
  function entrarLocal() {
    document.cookie = "mi_despensa_local=1; path=/; max-age=31536000; SameSite=Lax";
    location.href = params.get("next") ?? "/dashboard";
  }
  return <main className="grid min-h-screen place-items-center p-5"><section className="surface grid w-full max-w-5xl overflow-hidden rounded-[30px] md:grid-cols-[1fr_.9fr]"><div className="receipt-edge hidden bg-tinta p-10 text-crema md:block"><p className="text-sm font-black uppercase tracking-[.22em] text-crema/50">Mi Despensa</p><h1 className="mt-10 text-5xl font-black leading-[.92] tracking-[-.065em]">Antes de comprar, ordena el ticket.</h1><p className="mt-5 text-crema/65">Un espacio familiar para decidir qué falta, cuánto cuesta y dónde conviene comprarlo.</p><div className="market-rule mt-10 grid gap-3 pt-5 text-sm"><span className="rounded-[18px] bg-crema/10 p-4">Modo local privado sin crear cuenta.</span><span className="rounded-[18px] bg-crema/10 p-4">Cuenta Google para grupos sincronizados.</span></div></div><div className="p-7 md:p-10"><p className="eyebrow">Acceso</p><h2 className="mt-3 text-3xl font-black tracking-[-.055em]">Elige cómo quieres guardar tus compras</h2><p className="mt-3 text-tinta/60">Google sincroniza con Supabase. El modo local guarda todo únicamente en este dispositivo.</p><Button className="mt-8 w-full" size="lg" onClick={login} aria-label="Continuar con Google">Continuar con Google</Button><Button className="mt-3 w-full" size="lg" variant="secondary" onClick={entrarLocal} aria-label="Entrar en modo local">Entrar sin cuenta</Button><p className="mt-5 rounded-[18px] bg-[#fafbf6]/65 p-4 text-xs text-tinta/55">Puedes empezar en local y más adelante usar cuenta para grupos familiares en la nube.</p></div></section></main>;
}
