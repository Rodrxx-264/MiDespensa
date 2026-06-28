"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

export default function LoginPage() { return <Suspense><Login /></Suspense>; }

function Login() {
  const params = useSearchParams();
  async function google() {
    document.cookie = "mi_despensa_local=; path=/; max-age=0; SameSite=Lax";
    const codigo = params.get("codigo");
    const next = params.get("next") ?? (codigo ? `/unirse?codigo=${codigo}` : "/dashboard");
    await createClient().auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}` } });
  }
  function local() {
    document.cookie = "mi_despensa_local=1; path=/; max-age=31536000; SameSite=Lax";
    location.href = params.get("next") ?? "/dashboard";
  }
  return (
    <main className="flex min-h-dvh flex-col justify-center px-5">
      <section className="mx-auto w-full max-w-sm">
        <h1 className="text-3xl font-black tracking-[-.05em]">Mi Despensa</h1>
        <p className="mt-2 text-[var(--muted)]">Antes de comprar, ordená el ticket.</p>
        <div className="mt-8 flex flex-col gap-2">
          <Button className="w-full" size="lg" onClick={google}>Continuar con Google</Button>
          <Button className="w-full" size="lg" variant="secondary" onClick={local}>Entrar sin cuenta</Button>
        </div>
        <p className="mt-6 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 text-xs text-[var(--muted)]">Podés empezar en local y sincronizar con un grupo más adelante.</p>
      </section>
    </main>
  );
}
