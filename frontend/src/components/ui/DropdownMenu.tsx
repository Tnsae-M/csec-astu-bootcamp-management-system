import * as React from "react"
import { cn } from "../../lib/utils"
import { motion, AnimatePresence } from "motion/react"

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
}

export const DropdownMenu = ({ trigger, children, align = 'right' }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }}
            className={cn(
              "absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-xl border border-brand-border bg-brand-card p-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
              align === 'right' ? 'right-0' : 'left-0'
            )}
          >
            <div className="py-1" onClick={() => setIsOpen(false)}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const DropdownMenuItem = ({ 
  children, 
  onClick, 
  className,
  variant = 'default' 
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  className?: string;
  variant?: 'default' | 'destructive'
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex w-full items-center px-3 py-2 text-sm transition-colors rounded-lg text-left",
      variant === 'default' ? "text-text-main hover:bg-brand-primary" : "text-danger hover:bg-danger/10",
      className
    )}
  >
    {children}
  </button>
);
