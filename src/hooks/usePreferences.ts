"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { defaultPreferences, isLocalMode, readLocalState, writeLocalState } from "@/lib/local";
import type { ThemePreference, UserPreferences } from "@/types";

type PreferenceRow = { onboarding_completed: boolean; usage_type: UserPreferences["usageType"] | null; shopping_frequency: UserPreferences["shoppingFrequency"] | null; default_budget_range: string | null; default_budget_amount: number | null; preferred_store_types: string[] | null; main_goals: string[] | null; theme: ThemePreference; currency: "GTQ"; privacy_mode: boolean };

export function usePreferences() {
  const [preferences, setPreferencesState] = useState<UserPreferences>(defaultPreferences());
  const [loading, setLoading] = useState(true);
  const [local, setLocal] = useState(false);
  const supabase = createClient();
  async function cargar() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    const useLocal = !user && isLocalMode();
    setLocal(useLocal);
    if (useLocal) { const prefs = readLocalState().userPreferences; setPreferencesState(prefs); applyTheme(prefs.theme); setLoading(false); return; }
    if (!user) { setLoading(false); return; }
    const { data } = await supabase.from("user_preferences").select("*").eq("user_id", user.id).maybeSingle();
    if (!data) {
      await supabase.from("user_preferences").insert({ user_id: user.id });
      setPreferencesState(defaultPreferences()); applyTheme("system"); setLoading(false); return;
    }
    const prefs = fromRow(data as PreferenceRow); setPreferencesState(prefs); applyTheme(prefs.theme); setLoading(false);
  }
  useEffect(() => { void cargar(); }, []);
  async function setPreferences(next: Partial<UserPreferences>) {
    const merged = { ...preferences, ...next };
    setPreferencesState(merged); applyTheme(merged.theme);
    if (local) { const state = readLocalState(); state.userPreferences = merged; writeLocalState(state); return; }
    const { data: { user } } = await supabase.auth.getUser(); if (!user) return;
    await supabase.from("user_preferences").upsert(toRow(user.id, merged), { onConflict: "user_id" });
  }
  return { preferences, loading, local, setPreferences, recargar: cargar };
}

export function applyTheme(theme: ThemePreference) {
  const root = document.documentElement;
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = theme === "system" ? (systemDark ? "dark" : "light") : theme;
}

function fromRow(row: PreferenceRow): UserPreferences { return { onboardingCompleted: row.onboarding_completed, usageType: row.usage_type ?? undefined, shoppingFrequency: row.shopping_frequency ?? undefined, defaultBudgetRange: row.default_budget_range ?? undefined, defaultBudgetAmount: row.default_budget_amount ?? undefined, preferredStoreTypes: row.preferred_store_types ?? [], mainGoals: row.main_goals ?? [], theme: row.theme ?? "system", currency: row.currency ?? "GTQ", privacyMode: row.privacy_mode ?? true }; }
function toRow(userId: string, prefs: UserPreferences) { return { user_id: userId, onboarding_completed: prefs.onboardingCompleted, usage_type: prefs.usageType, shopping_frequency: prefs.shoppingFrequency, default_budget_range: prefs.defaultBudgetRange, default_budget_amount: prefs.defaultBudgetAmount, preferred_store_types: prefs.preferredStoreTypes, main_goals: prefs.mainGoals, theme: prefs.theme, currency: prefs.currency, privacy_mode: prefs.privacyMode }; }
