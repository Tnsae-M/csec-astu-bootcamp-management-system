import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export function Card({ children, className, title, subtitle }: CardProps) {
  return (
    <div className={cn(
      "geo-card p-6 overflow-hidden",
      className
    )}>
      {(title || subtitle) && (
        <div className="mb-6 flex justify-between items-center">
          <div>
            {title && <h3 className="text-lg font-bold text-text-main">{title}</h3>}
            {subtitle && <p className="text-xs text-text-muted mt-1 uppercase tracking-[0.1em] font-medium">{subtitle}</p>}
          </div>
        </div>
      )}
      <div className="text-text-main">
        {children}
      </div>
    </div>
  );
}
