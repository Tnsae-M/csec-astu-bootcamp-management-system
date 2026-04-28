import * as React from "react";
import { animate } from "framer-motion";
import { Card, CardContent } from "./card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  prefix?: string;
  suffix?: string;
  className?: string;
  iconClassName?: string;
}

export function StatCard({
  label,
  value,
  icon,
  description,
  trend,
  prefix = "",
  suffix = "",
  className,
  iconClassName,
}: StatCardProps) {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.5,
      onUpdate: (latest) => setCount(Math.floor(latest)),
      ease: "easeOut",
    });
    return () => controls.stop();
  }, [value]);

  return (
    <Card className={cn("overflow-hidden border-none shadow-md", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
              {label}
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black tracking-tight text-text-main">
                {prefix}{count.toLocaleString()}{suffix}
              </span>
            </div>
            {description && (
              <p className="text-xs text-text-muted">{description}</p>
            )}
          </div>
          <div className={cn("rounded-2xl p-3 bg-brand-primary text-brand-accent shadow-sm", iconClassName)}>
            {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement, { size: 24 }) : icon}
          </div>
        </div>
        {trend && (
          <div className="mt-4 flex items-center gap-2">
            <span
              className={cn(
                "text-[10px] font-black uppercase px-2 py-0.5 rounded-md",
                trend.isPositive
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                  : "bg-red-50 text-red-600 border border-red-100"
              )}
            >
              {trend.isPositive ? "+" : "-"}{trend.value}%
            </span>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
