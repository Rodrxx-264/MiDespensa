import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { NavbarMobile } from "@/components/layout/NavbarMobile";
import { OnboardingGate } from "@/components/layout/OnboardingGate";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const local = cookies().get("mi_despensa_local")?.value === "1";
  if (!user && !local) redirect("/auth/login");
  return (
    <>
      <main className="pb-24">
        <div className="mx-auto max-w-lg p-4">
          <OnboardingGate>{children}</OnboardingGate>
        </div>
      </main>
      <NavbarMobile />
    </>
  );
}
