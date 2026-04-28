import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, subtitle, icon, children }: ModalProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // focus first focusable element inside modal for accessibility
      setTimeout(() => {
        containerRef.current?.querySelector<HTMLElement>('button, [href], input, textarea, select')?.focus();
      }, 50);
    } else {
      document.body.style.overflow = 'unset';
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
    >
      <div
        ref={containerRef}
        className="relative w-full max-w-3xl rounded-2xl shadow-xl bg-white ring-1 ring-black/5 transform transition-all duration-300 ease-out scale-100"
        style={{
          WebkitBackdropFilter: 'blur(8px)'
        }}
      >
        <div className="flex items-center gap-4 px-8 py-6 rounded-t-2xl bg-gradient-to-r from-indigo-700 via-blue-700 to-brand-accent text-white">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-800 flex items-center justify-center text-white shadow-md">
            {icon ? icon : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15 8H9L12 2Z" fill="white" opacity="0.95"/></svg>}
          </div>
          <div>
            <h2 id="modal-title" className="text-2xl font-extrabold tracking-tight">{title}</h2>
            {subtitle && <p className="text-sm text-indigo-100 mt-1">{subtitle}</p>}
          </div>

          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="ml-auto p-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-8 max-h-[72vh] overflow-y-auto text-text-main">
          {children}
        </div>
      </div>
    </div>
  );
}
