import { Shield } from 'lucide-react';

export const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-brand-accent flex items-center justify-center text-white shadow-lg shadow-brand-accent/20">
        <Shield size={24} fill="currentColor" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-black tracking-tighter uppercase leading-none text-text-main">CSEC-ASTU</span>
        <span className="text-[10px] font-black tracking-widest uppercase leading-none text-brand-accent">Bootcamp MS</span>
      </div>
    </div>
  );
};
