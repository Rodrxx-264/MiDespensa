"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

export function Modal({ open, onOpenChange, title, children }: { open: boolean; onOpenChange: (open: boolean) => void; title: string; children: React.ReactNode }) {
  return <Dialog.Root open={open} onOpenChange={onOpenChange}><Dialog.Portal><Dialog.Overlay className="fixed inset-0 z-40 bg-black/35" /><Dialog.Content className="fixed inset-x-0 bottom-0 z-50 max-h-[90vh] overflow-auto rounded-t-[24px] bg-white p-5 shadow-suave md:left-1/2 md:top-1/2 md:bottom-auto md:w-full md:max-w-xl md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[24px]" aria-describedby={undefined}><div className="mb-4 flex items-center justify-between"><Dialog.Title className="text-xl font-black">{title}</Dialog.Title><Dialog.Close className="touch rounded-full" aria-label="Cerrar modal"><X aria-hidden="true" /></Dialog.Close></div>{children}</Dialog.Content></Dialog.Portal></Dialog.Root>;
}
