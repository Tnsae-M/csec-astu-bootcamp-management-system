import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { cn } from '../../lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: 'accent' | 'secondary' | 'success' | 'warning' | 'danger';
}

export const StatCard = ({ label, value, trend, trendUp, color = 'accent' }: StatCardProps) => {
  const trendColorMap = {
    accent: 'bg-blue-100 text-blue-600 font-mono',
    secondary: 'bg-purple-100 text-purple-600',
    success: 'bg-emerald-100 text-emerald-600',
    warning: 'bg-amber-100 text-amber-600',
    danger: 'bg-red-100 text-red-600',
  };

  return (
    <div className="bg-white border border-brand-border rounded-xl p-5 shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-50">{label}</p>
      <p className="text-3xl font-black tracking-tight text-text-main">{value}</p>
      {trend && (
        <div className="mt-4 flex items-center gap-2">
          <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full uppercase", trendColorMap[color])}>
            {trend} {trend.includes('%') ? 'vs last year' : ''}
          </span>
        </div>
      )}
      {!trend && (
        <div className="mt-4 flex items-center gap-1">
          <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
            <div className="bg-brand-secondary h-full w-[60%]"></div>
          </div>
        </div>
      )}
    </div>
  );
};
