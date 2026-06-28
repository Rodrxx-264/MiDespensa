"use client";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { createContext, useContext, useState } from "react";

const ToastContext = createContext<(message: string) => void>(() => undefined);
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState("");
  return <ToastContext.Provider value={setMessage}><ToastPrimitive.Provider swipeDirection="right"><>{children}</><ToastPrimitive.Root open={!!message} onOpenChange={(open) => !open && setMessage("")} className="fixed bottom-28 right-4 z-[70] rounded-2xl bg-[var(--ink)] px-4 py-3 text-sm font-semibold text-white md:bottom-4"><ToastPrimitive.Title aria-live="polite">{message}</ToastPrimitive.Title></ToastPrimitive.Root><ToastPrimitive.Viewport /></ToastPrimitive.Provider></ToastContext.Provider>;
}
export function useToast() { return useContext(ToastContext); }
