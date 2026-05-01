import * as React from "react"
import { cn } from "../../lib/utils"

interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField = ({ label, error, children, className }: FormFieldProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-danger font-medium px-1">{error}</p>}
    </div>
  );
};
