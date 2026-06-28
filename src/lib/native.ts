"use client";

export function isNativeApp(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return !!(window as any).Capacitor?.isNativePlatform();
  } catch {
    return false;
  }
}

export function hasPushPlugin(): boolean {
  try {
    return !!(window as any).Capacitor?.isPluginAvailable?.("PushNotifications");
  } catch {
    return false;
  }
}

export function getAuthRedirectUrl(): string {
  if (isNativeApp()) return "com.midespensa.app://auth/callback";
  return `${window.location.origin}/auth/callback`;
}
