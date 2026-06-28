"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { defaultPreferences, isLocalMode, readLocalState, writeLocalState } from "@/lib/local";
import type { ThemePreference, UserPreferences } from "@/types";

type Ctx = {
  preferences: UserPreferences;
  loading: boolean;
  local: boolean;
  setPreferences: (next: Partial<UserPreferences>) => Promise<void>;
};

const PreferencesCtx = createContext<Ctx>(null!);

export function usePreferences() { return useContext(PreferencesCtx); }

export function applyTheme(theme: ThemePreference) {
  if (typeof window === "undefined") return;
  const root = document.documentElement;
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = theme === "system" ? (systemDark ? "dark" : "light") : theme;
}

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferencesState] = useState<UserPreferences>(() => {
    if (typeof window === "undefined") return defaultPreferences();
    try {
      const raw = localStorage.getItem("mi_despensa_local_data");
      if (!raw) return defaultPreferences();
      const parsed = JSON.parse(raw);
      return { ...defaultPreferences(), ...(parsed.userPreferences ?? {}) };
    } catch { return defaultPreferences(); }
  });
  const [loading, setLoading] = useState(true);
  const [local, setLocal] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    applyTheme(preferences.theme);
    const handler = (e: MediaQueryListEvent) => {
      if (preferences.theme === "system") applyTheme("system");
    };
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", handler);
    void cargar();
    return () => mq.removeEventListener("change", handler);
  }, []);

  async function cargar() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const useLocal = !user && isLocalMode();
      setLocal(useLocal);
      if (useLocal) {
        const prefs = readLocalState().userPreferences;
        setPreferencesState(prefs);
        setLoading(false);
        return;
      }
      if (!user) { setLoading(false); return; }
      const { data } = await supabase.from("user_preferences").select("*").eq("user_id", user.id).maybeSingle();
      if (!data) {
        await supabase.from("user_preferences").insert({ user_id: user.id });
        setPreferencesState(defaultPreferences());
        setLoading(false);
        return;
      }
      setPreferencesState(fromRow(data));
    } catch {
      setLocal(true);
      const prefs = readLocalState().userPreferences;
      setPreferencesState(prefs);
    }
    setLoading(false);
  }

  const setPreferences = useCallback(async (next: Partial<UserPreferences>) => {
    const merged = { ...preferences, ...next };
    setPreferencesState(merged);
    applyTheme(merged.theme);
    if (local) {
      const state = readLocalState();
      state.userPreferences = merged;
      writeLocalState(state);
      return;
    }
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from("user_preferences").upsert(toRow(user.id, merged), { onConflict: "user_id" });
    } catch {}
  }, [preferences, local, supabase]);

  return <PreferencesCtx.Provider value={{ preferences, loading, local, setPreferences }}>{children}</PreferencesCtx.Provider>;
}

function fromRow(row: any): UserPreferences {
  return {
    onboardingCompleted: row.onboarding_completed ?? false,
    usageType: row.usage_type ?? undefined,
    shoppingFrequency: row.shopping_frequency ?? undefined,
    defaultBudgetRange: row.default_budget_range ?? undefined,
    defaultBudgetAmount: row.default_budget_amount ?? undefined,
    preferredStoreTypes: row.preferred_store_types ?? [],
    mainGoals: row.main_goals ?? [],
    theme: row.theme ?? "system",
    currency: row.currency ?? "GTQ",
    privacyMode: row.privacy_mode ?? true,
  };
}

function toRow(userId: string, prefs: UserPreferences) {
  return {
    user_id: userId,
    onboarding_completed: prefs.onboardingCompleted,
    usage_type: prefs.usageType,
    shopping_frequency: prefs.shoppingFrequency,
    default_budget_range: prefs.defaultBudgetRange,
    default_budget_amount: prefs.defaultBudgetAmount,
    preferred_store_types: prefs.preferredStoreTypes,
    main_goals: prefs.mainGoals,
    theme: prefs.theme,
    currency: prefs.currency,
    privacy_mode: prefs.privacyMode,
  };
}
