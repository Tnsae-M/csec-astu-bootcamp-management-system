import * as React from "react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon = <Inbox />,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-500",
        className
      )}
    >
      <div className="rounded-full bg-brand-primary p-6 mb-6 shadow-inner">
        <div className="text-brand-accent h-10 w-10 flex items-center justify-center">
          {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement, { size: 40 }) : icon}
        </div>
      </div>
      <h3 className="text-xl font-black text-text-main uppercase tracking-tight mb-2">{title}</h3>
      <p className="text-sm text-text-muted font-medium max-w-sm mb-8 italic">{description}</p>
      {action && (
        <Button onClick={action.onClick} className="shadow-lg shadow-brand-accent/20 px-8">
          {action.label}
        </Button>
      )}
    </div>
  );
}
