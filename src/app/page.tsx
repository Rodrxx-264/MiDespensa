import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col px-5">
      <nav className="flex items-center justify-between py-4" aria-label="Principal">
        <span className="flex items-center gap-2 text-lg font-bold">Mi Despensa</span>
        <Link href="/auth/login" className="touch inline-flex h-10 items-center rounded-xl bg-[var(--ink)] px-4 text-sm font-semibold text-[var(--bg)]">Entrar</Link>
      </nav>
      <section className="flex flex-1 flex-col justify-center gap-8">
        <div>
          <p className="eyebrow">Cuaderno de mercado digital</p>
          <h1 className="mt-3 text-4xl font-black leading-[0.95] tracking-[-.06em]">La lista que se siente como revisar el ticket antes de pagar.</h1>
          <p className="mt-4 text-[var(--muted)]">Comprá mejor, gastá menos. Sin cuenta, sin anuncios, sin tracking.</p>
          <div className="mt-8 flex flex-col gap-2">
            <Link href="/auth/login" className="touch flex h-12 items-center justify-center rounded-xl bg-[var(--ink)] font-semibold text-[var(--bg)]">Abrir mi despensa</Link>
            <Link href="/unirse" className="touch flex h-12 items-center justify-center rounded-xl border border-[var(--line)] font-semibold">Unirme por código</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
