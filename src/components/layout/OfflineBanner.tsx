"use client";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

export function OfflineBanner() {
  const online = useOnlineStatus();
  if (online) return null;
  return (
    <div className="fixed bottom-20 inset-x-0 z-50 flex items-center justify-center px-4 pointer-events-none">
      <div className="rounded-xl bg-[var(--ink)] px-4 py-2 text-sm font-medium text-[var(--bg)] shadow-lg">
        Sin conexión — los cambios se guardan localmente
      </div>
    </div>
  );
}
