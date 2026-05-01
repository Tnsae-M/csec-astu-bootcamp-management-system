import * as React from "react"
import { cn } from "../../lib/utils"
import { Button } from "./Button"
import { X, LucideIcon } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, subtitle, icon: Icon, children }: ModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-sidebar/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-brand-card rounded-2xl shadow-2xl overflow-hidden border border-brand-border"
          >
            <div className="p-6 border-b border-brand-border flex items-center justify-between">
              <div className="flex items-center gap-4">
                {Icon && (
                  <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                    <Icon size={20} />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-text-main">{title}</h3>
                  {subtitle && <p className="text-xs text-text-muted font-medium">{subtitle}</p>}
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                <X size={18} />
              </Button>
            </div>
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
