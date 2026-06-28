import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return <main className="min-h-screen px-5 py-6 md:px-10">
    <nav className="surface mx-auto flex max-w-6xl items-center justify-between rounded-full px-4 py-3" aria-label="Principal"><span className="flex items-center gap-3 text-lg font-black tracking-[-.03em] text-tinta"><span className="grid h-9 w-9 place-items-center rounded-full bg-tinta text-sm text-white">MD</span>Mi Despensa</span><Link href="/auth/login"><Button>Entrar</Button></Link></nav>
    <section className="mx-auto grid max-w-6xl gap-10 py-14 md:grid-cols-[1.05fr_.95fr] md:items-center md:py-20">
      <div><p className="eyebrow">Gestión doméstica precisa</p><h1 className="mt-5 max-w-3xl text-5xl font-black leading-[.95] tracking-[-.07em] text-tinta md:text-7xl">Una despensa familiar con orden de producto digital.</h1><p className="mt-6 max-w-xl text-lg text-tinta/65">Administra compras, presupuesto e historial con una experiencia limpia. Sin ruido visual, con modo local y sincronización familiar cuando la necesites.</p><div className="mt-9 flex flex-wrap gap-3"><Link href="/auth/login"><Button size="lg">Comenzar ahora</Button></Link><Link href="/unirse"><Button variant="secondary" size="lg">Unirme por código</Button></Link></div><div className="mt-10 grid max-w-lg grid-cols-3 gap-3 text-sm"><Stat n="Local" t="sin cuenta"/><Stat n="QR" t="grupo familiar"/><Stat n="Tiempo real" t="con Supabase"/></div></div>
      <div className="surface relative overflow-hidden rounded-[36px] p-5"><div className="absolute right-4 top-4 h-28 w-28 rounded-full bg-menta/30 blur-2xl"/><div className="rounded-[28px] bg-tinta p-6 text-white"><p className="text-sm text-white/60">Presupuesto familiar</p><p className="metric mt-2 text-5xl font-black">Q 842,35</p><div className="mt-6 h-2 rounded-full bg-white/15"><div className="h-full w-7/12 rounded-full bg-naranja"/></div><p className="mt-3 text-sm text-white/70">7 de 12 productos comprados</p></div><div className="mt-4 space-y-3"><Item t="Leche deslactosada"/><Item t="Frijol negro"/><Item t="Papel higiénico"/></div></div>
    </section>
  </main>;
}

function Item({ t }: { t: string }) { return <div className="panel flex items-center justify-between rounded-2xl p-4"><span className="font-semibold">{t}</span><span className="rounded-full bg-tinta px-3 py-1 text-xs font-bold text-white">Pendiente</span></div>; }
function Stat({ n, t }: { n: string; t: string }) { return <div className="panel rounded-2xl p-4"><p className="font-black tracking-[-.03em]">{n}</p><p className="text-xs text-tinta/55">{t}</p></div>; }
