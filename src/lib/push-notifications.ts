"use client";
import { hasPushPlugin, isNativeApp } from "@/lib/native";

type PushState = {
  supported: boolean;
  granted: boolean;
  token: string | null;
};

let cachedState: PushState = { supported: false, granted: false, token: null };

export function getPushState(): PushState {
  return cachedState;
}

export const isPushSupported = hasPushPlugin;

export async function requestPushPermission(): Promise<boolean> {
  if (!isNativeApp() || !hasPushPlugin()) return false;
  try {
    const { PushNotifications } = await import("@capacitor/push-notifications");
    const result = await PushNotifications.requestPermissions();
    cachedState.granted = result.receive === "granted";
    return cachedState.granted;
  } catch {
    return false;
  }
}

export async function registerPushNotifications(): Promise<string | null> {
  if (!isNativeApp() || !hasPushPlugin()) return null;
  try {
    const { PushNotifications } = await import("@capacitor/push-notifications");
    await PushNotifications.register();
    return new Promise((resolve) => {
      PushNotifications.addListener("registration", (token) => {
        cachedState.token = token.value;
        resolve(token.value);
      });
      PushNotifications.addListener("registrationError", () => resolve(null));
    });
  } catch {
    return null;
  }
}
