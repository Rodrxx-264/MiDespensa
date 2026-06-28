"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";
import { exportLocalData } from "@/lib/export-data";
import { isLocalMode } from "@/lib/local";
import { usePreferences } from "@/contexts/PreferencesContext";
import type { ThemePreference } from "@/types";

export default function AjustesPage() {
  const router = useRouter();
  const { preferences, setPreferences, local } = usePreferences();
  const modoLocal = local || isLocalMode();

  async function cerrarSesion() {
    document.cookie = "mi_despensa_local=; path=/; max-age=0; SameSite=Lax";
    await createClient().auth.signOut();
    router.push("/auth/login");
  }

  function borrarLocal() {
    if (!confirm("Esto borrará tus datos locales. No se puede deshacer.")) return;
    localStorage.removeItem("mi_despensa_local_data");
    document.cookie = "mi_despensa_local=; path=/; max-age=0; SameSite=Lax";
    router.push("/auth/login");
  }

  async function salirDeGrupos() {
    if (prompt("Escribí BORRAR para confirmar") !== "BORRAR") return;
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("perfiles").update({ grupo_id: null }).eq("id", user.id);
    await supabase.from("user_preferences").delete().eq("user_id", user.id);
    await cerrarSesion();
  }

  return (
    <div className="space-y-4">
      <div><p className="eyebrow">Control personal</p><h1 className="mt-1 text-2xl font-black">Ajustes</h1></div>

      <Card title="Cuenta">
        <p className="text-sm">Modo: <b>{modoLocal ? "Local" : "Cuenta Google"}</b></p>
        <div className="mt-3 grid gap-2">
          <Button variant="secondary" onClick={cerrarSesion}>Cerrar sesión</Button>
          {modoLocal && <Button onClick={() => router.push("/auth/login")}>Entrar con Google</Button>}
        </div>
      </Card>

      <Card title="Apariencia">
        <Select value={preferences.theme} onChange={(e) => setPreferences({ theme: e.target.value as ThemePreference })}>
          <option value="system">Tema del sistema</option>
          <option value="light">Claro</option>
          <option value="dark">Oscuro</option>
        </Select>
      </Card>

      <Card title="Preferencias">
        <label className="grid gap-1 text-sm font-medium text-[var(--muted)]">Presupuesto base por defecto
          <Input type="number" value={preferences.defaultBudgetAmount ?? ""} onChange={(e) => setPreferences({ defaultBudgetAmount: Number(e.target.value) })} />
        </label>
        <label className="mt-3 grid gap-1 text-sm font-medium text-[var(--muted)]">Frecuencia de compra
          <Select value={preferences.shoppingFrequency ?? ""} onChange={(e) => setPreferences({ shoppingFrequency: e.target.value as any })}>
            <option value="">Sin definir</option>
            <option value="daily">Diario</option>
            <option value="weekly">Semanal</option>
            <option value="biweekly">Quincenal</option>
            <option value="monthly">Mensual</option>
            <option value="as_needed">Cuando se necesita</option>
          </Select>
        </label>
      </Card>

      <Card title="Datos">
        <p className="text-sm text-[var(--muted)]">No vendemos datos. No usamos publicidad. Tus datos se usan solo para la app.</p>
        <div className="mt-3 grid gap-2">
          <Button variant="secondary" onClick={exportLocalData}>Exportar datos</Button>
          {modoLocal ? (
            <Button variant="danger" onClick={borrarLocal}>Borrar datos locales</Button>
          ) : (
            <Button variant="danger" onClick={salirDeGrupos}>Eliminar datos y salir de grupos</Button>
          )}
        </div>
      </Card>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
      <h2 className="text-base font-bold">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}
