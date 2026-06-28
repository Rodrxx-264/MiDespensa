"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

export function Modal({ open, onOpenChange, title, children }: { open: boolean; onOpenChange: (open: boolean) => void; title: string; children: React.ReactNode }) {
  return <Dialog.Root open={open} onOpenChange={onOpenChange}><Dialog.Portal><Dialog.Overlay className="fixed inset-0 z-40 bg-[var(--ink)]/45 backdrop-blur-sm" /><Dialog.Content className="fixed inset-x-0 bottom-0 z-50 max-h-[92dvh] overflow-auto rounded-t-[28px] border border-[var(--line)] bg-[var(--surface)] p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:p-5 md:left-1/2 md:top-1/2 md:bottom-auto md:w-full md:max-w-xl md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[28px]" aria-describedby={undefined}><div className="mb-4 flex items-center justify-between gap-3"><Dialog.Title className="text-lg font-black tracking-[-.03em] sm:text-xl">{title}</Dialog.Title><Dialog.Close className="touch shrink-0 rounded-full bg-[var(--surface)]" aria-label="Cerrar modal"><X aria-hidden="true" /></Dialog.Close></div>{children}</Dialog.Content></Dialog.Portal></Dialog.Root>;
}
