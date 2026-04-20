import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  children, 
  ...props 
}: ButtonProps) {
  const variants = {
    primary: 'bg-brand-accent text-white hover:bg-brand-accent/90 shadow-sm active:scale-[0.98]',
    secondary: 'bg-brand-sidebar border border-brand-border text-text-main hover:bg-brand-border/30 active:scale-[0.98]',
    outline: 'bg-transparent border-2 border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white active:scale-[0.98]',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm active:scale-[0.98]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-[10px] font-black uppercase tracking-widest',
    md: 'px-5 py-2.5 text-[11px] font-black uppercase tracking-widest',
    lg: 'px-8 py-3.5 text-xs font-black uppercase tracking-widest',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:translate-y-[1px]',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
}
