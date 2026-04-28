import React, { useState } from 'react';
import logoImg from '@/assets/images/logo.jpg';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'auto';
  showText?: boolean;
  inverse?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className, size = 'md', showText = false, inverse = false }) => {
  const [error, setError] = useState(false);

  const sizeStyles = {
    sm: 'h-8 w-auto',
    md: 'h-10 w-auto',
    lg: 'h-16 w-auto',
    xl: 'h-24 w-auto',
    auto: 'h-full w-full',
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn("relative flex items-center justify-center shrink-0 overflow-hidden rounded-xl", sizeStyles[size])}>
        {!error ? (
          <img
            src={logoImg}
            alt="CSEC ASTU"
            className="h-full w-full object-contain"
            onError={() => setError(true)}
          />
        ) : (
          <div className="h-full px-3 bg-brand-accent text-white flex items-center justify-center font-black text-xs uppercase tracking-tighter shadow-inner">
            CSEC
          </div>
        )}
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={cn(
            "font-black tracking-tighter uppercase text-xl block leading-[0.8] mb-0.5",
            inverse ? "text-white" : "text-text-main"
          )}>
            CSEC ASTU
          </span>
          <span className={cn(
            "text-[9px] font-black uppercase tracking-[0.3em] leading-none block opacity-70",
            inverse ? "text-white" : "text-brand-accent"
          )}>
            Engineering Hub
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
