import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return <main className="min-h-screen bg-crema px-5 py-8 md:px-10">
    <nav className="mx-auto flex max-w-6xl items-center justify-between" aria-label="Principal"><span className="text-xl font-black text-bosque">Mi Despensa</span><Link href="/auth/login"><Button>Entrar</Button></Link></nav>
    <section className="mx-auto grid max-w-6xl gap-10 py-16 md:grid-cols-[1.1fr_.9fr] md:items-center">
      <div><p className="font-semibold uppercase tracking-[.25em] text-bosque">Compras familiares en Guatemala</p><h1 className="mt-4 text-4xl font-black tracking-tight text-tinta md:text-6xl">Tu lista familiar, sincronizada y ordenada por presupuesto.</h1><p className="mt-5 text-lg text-tinta/75">Crea grupos por QR, compra en tiempo real o usa el modo local para guardar tus datos solo en este navegador.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/auth/login"><Button size="lg">Entrar</Button></Link><Link href="/unirse"><Button variant="secondary" size="lg">Unirme por código</Button></Link></div></div>
      <div className="rounded-[28px] bg-white p-5 shadow-suave"><div className="rounded-card bg-bosque p-5 text-white"><p className="text-sm opacity-80">Presupuesto familiar</p><p className="mt-2 text-4xl font-black">Q 842,35</p><p className="mt-4 rounded-control bg-white/15 p-3">7 de 12 productos comprados en tiempo real</p></div><div className="mt-4 space-y-3"><Item t="Leche deslactosada"/><Item t="Frijol negro"/><Item t="Papel higiénico"/></div></div>
    </section>
  </main>;
}

function Item({ t }: { t: string }) { return <div className="flex items-center justify-between rounded-card border border-tinta/10 bg-white p-4"><span>{t}</span><span className="rounded-full bg-menta/30 px-3 py-1 text-sm text-bosque">Pendiente</span></div>; }
