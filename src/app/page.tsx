import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return <main className="min-h-screen px-5 py-6 md:px-10">
    <nav className="surface mx-auto flex max-w-6xl items-center justify-between rounded-[24px] px-4 py-3" aria-label="Principal"><span className="flex items-center gap-3 text-lg font-black tracking-[-.03em] text-tinta"><span className="grid h-9 w-9 place-items-center rounded-[14px] bg-tinta text-sm text-crema">MD</span>Mi Despensa</span><Link href="/auth/login"><Button>Entrar</Button></Link></nav>
    <section className="mx-auto grid max-w-6xl gap-10 py-14 md:grid-cols-[1.05fr_.95fr] md:items-center md:py-20">
      <div><p className="eyebrow">Cuaderno de mercado digital</p><h1 className="mt-5 max-w-3xl text-5xl font-black leading-[.92] tracking-[-.075em] text-tinta md:text-7xl">La lista familiar que se siente como revisar el ticket antes de pagar.</h1><p className="mt-6 max-w-xl text-lg text-tinta/65">Pensada para hogares que compran por presupuesto, tienda y costumbre. Entra sin cuenta para guardar localmente o sincroniza tu grupo cuando haga falta.</p><div className="mt-9 flex flex-wrap gap-3"><Link href="/auth/login"><Button size="lg">Abrir mi despensa</Button></Link><Link href="/unirse"><Button variant="secondary" size="lg">Unirme por código</Button></Link></div><div className="market-rule mt-10 grid max-w-lg grid-cols-3 gap-3 pt-5 text-sm"><Stat n="Local" t="en este navegador"/><Stat n="QR" t="para familia"/><Stat n="Q" t="presupuesto visible"/></div></div>
      <div className="surface receipt-edge relative ml-2 overflow-hidden rounded-[30px] p-5"><div className="absolute right-4 top-4 h-28 w-28 rounded-full bg-naranja/25 blur-2xl"/><div className="rounded-[24px] bg-tinta p-6 text-crema"><p className="text-sm text-crema/60">Ticket de compra</p><p className="metric mt-2 text-5xl font-black">Q 842,35</p><div className="market-rule mt-6 pt-4"><p className="text-sm text-crema/70">7 de 12 productos comprados</p></div></div><div className="mt-4 space-y-3"><Item t="Leche deslactosada"/><Item t="Frijol negro"/><Item t="Papel higiénico"/></div></div>
    </section>
  </main>;
}

function Item({ t }: { t: string }) { return <div className="panel flex items-center justify-between rounded-[18px] p-4"><span className="font-semibold">{t}</span><span className="rounded-[10px] bg-naranja px-3 py-1 text-xs font-black text-tinta">Pendiente</span></div>; }
function Stat({ n, t }: { n: string; t: string }) { return <div className="panel rounded-[18px] p-4"><p className="font-black tracking-[-.03em]">{n}</p><p className="text-xs text-tinta/55">{t}</p></div>; }
