import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./dialog";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, subtitle, icon, children, className }: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={cn("sm:max-w-[600px] p-0 overflow-hidden border-none", className)}>
        <DialogHeader className="px-8 pt-8 pb-4 flex flex-col items-start gap-4 space-y-0">
          {icon && (
            <div className="rounded-xl p-2.5 bg-brand-primary text-brand-accent">
              {React.isValidElement(icon) ? (
                React.cloneElement(icon as React.ReactElement<any>, { className: "h-6 w-6" })
              ) : (
                icon
              )}
            </div>
          )}
          <div className="flex flex-col gap-1.5 text-left">
            <DialogTitle className="text-2xl font-bold tracking-tight text-text-main">
              {title}
            </DialogTitle>
            {subtitle && (
              <DialogDescription className="text-sm text-text-muted leading-relaxed">
                {subtitle}
              </DialogDescription>
            )}
          </div>
        </DialogHeader>
        <div className="px-8 pb-8 pt-2 max-h-[75vh] overflow-y-auto">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
