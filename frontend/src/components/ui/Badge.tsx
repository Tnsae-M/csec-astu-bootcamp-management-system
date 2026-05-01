import * as React from "react"
import { cn } from "../../lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'
  children?: React.ReactNode
  className?: string
}

function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const variants = {
    default: "bg-brand-accent text-white border-transparent",
    secondary: "bg-brand-secondary/10 text-brand-secondary border-transparent",
    destructive: "bg-danger/10 text-danger border-transparent",
    outline: "border-brand-border text-text-muted hover:bg-brand-primary",
    success: "bg-emerald-100 text-emerald-600 border-transparent",
    warning: "bg-warning/10 text-warning border-transparent",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-black uppercase tracking-widest transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 font-mono",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Badge }
