"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { usePreferences } from "@/contexts/PreferencesContext";

export function OnboardingGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { preferences, loading } = usePreferences();
  useEffect(() => {
    if (!loading && !preferences.onboardingCompleted && !pathname.includes("/bienvenida") && !pathname.includes("/ajustes"))
      router.replace("/dashboard/bienvenida");
  }, [loading, preferences.onboardingCompleted, pathname, router]);
  return <>{children}</>;
}
