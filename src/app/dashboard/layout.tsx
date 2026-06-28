import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/Sidebar";
import { NavbarMobile } from "@/components/layout/NavbarMobile";
import { OnboardingGate } from "@/components/layout/OnboardingGate";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const local = cookies().get("mi_despensa_local")?.value === "1";
  if (!user && !local) redirect("/auth/login");
  if (!user && local) return <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]"><Sidebar user={{ nombre: "Invitado local", avatar_url: null }} /><main className="pb-36 md:pb-0"><div className="mx-auto max-w-6xl p-3 sm:p-4 md:p-8"><OnboardingGate>{children}</OnboardingGate></div></main><NavbarMobile /></div>;
  if (!user) redirect("/auth/login");
  const { data: perfil } = await supabase.from("perfiles").select("nombre, avatar_url, grupo_id").eq("id", user.id).single();
  return <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]"><Sidebar user={{ nombre: perfil?.nombre ?? user.email ?? "Usuario", avatar_url: perfil?.avatar_url }} /><main className="pb-36 md:pb-0"><div className="mx-auto max-w-6xl p-3 sm:p-4 md:p-8"><OnboardingGate>{children}</OnboardingGate></div></main><NavbarMobile /></div>;
}
