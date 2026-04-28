import * as React from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  labelClassName?: string;
  description?: string;
}

export function FormField({
  label,
  error,
  required,
  children,
  className,
  labelClassName,
  description,
}: FormFieldProps) {
  const id = React.useId();

  return (
    <div className={cn("space-y-1.5 w-full", className)}>
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className={cn(
            "text-xs font-semibold uppercase tracking-wider text-text-muted",
            labelClassName
          )}
        >
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      </div>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { id });
        }
        return child;
      })}
      {description && (
        <p className="text-[11px] text-text-muted/80">{description}</p>
      )}
      {error && (
        <p className="text-[11px] font-medium text-danger animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
}
