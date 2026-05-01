import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "../../lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const variants = {
      default: "bg-brand-accent text-white shadow-lg shadow-brand-accent/30 hover:bg-brand-accent/90 active:scale-95 uppercase tracking-wider font-bold",
      destructive: "bg-danger text-white hover:bg-danger/90 active:scale-95",
      outline: "border border-brand-border bg-transparent hover:bg-brand-primary text-text-main active:scale-95",
      secondary: "bg-brand-secondary text-white hover:bg-brand-secondary/90 active:scale-95",
      ghost: "hover:bg-black/5 text-text-main active:scale-95",
      link: "text-brand-accent underline-offset-4 hover:underline",
    }
    const sizes = {
      default: "h-11 px-6 py-2.5",
      sm: "h-9 rounded-lg px-4 text-xs",
      lg: "h-12 rounded-xl px-10 text-base",
      icon: "h-10 w-10",
    }

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
