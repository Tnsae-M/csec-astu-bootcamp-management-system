import React from "react";
import { Card, Button } from "@/src/components/ui";
import {
  Users,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Settings,
  ShieldCheck,
  Briefcase,
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

export default function AdminDashboard() {
  const { users } = useSelector((state: RootState) => state.users);
  const { divisions } = useSelector((state: RootState) => state.divisions);
  const { items: sessionItems } = useSelector(
    (state: RootState) => state.sessions,
  );
  const { searchTerm } = useSelector((state: RootState) => state.ui);

  const filteredSessions = sessionItems.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.division.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.instructor.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredDivisions = divisions.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.head.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const stats = [
    { label: "Total Enrolled", value: users.length },
    { label: "Active Divisions", value: divisions.length },
    { label: "Registry Sessions", value: sessionItems.length },
  ];

  return (
    <div className="space-y-10 selection:bg-accent-blue selection:text-white">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="geo-card p-6 group hover:border-brand-accent transition-all"
          >
            <div className="text-[32px] font-black text-brand-accent mb-1 leading-none transition-transform group-hover:scale-105 origin-left">
              {stat.value}
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-text-muted font-black">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 geo-card p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-black text-text-main uppercase tracking-tighter">
                System Registry
              </h3>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">
                Live Session Logs
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="text-[10px] uppercase tracking-widest px-4 py-2"
            >
              Full Logs
            </Button>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-brand-border">
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-text-muted">
                  Entity / Unit
                </th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-text-muted">
                  Instructor
                </th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-text-muted">
                  Status
                </th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-text-muted">
                  Registry Code
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.slice(0, 4).map((row) => (
                <tr
                  key={row.id}
                  className="group hover:bg-brand-primary transition-colors border-b border-brand-border last:border-0 grow"
                >
                  <td className="py-4">
                    <div className="font-bold text-sm text-text-main uppercase tracking-tight">
                      {row.title}
                    </div>
                    <div className="text-[10px] text-text-muted uppercase font-bold tracking-widest">
                      {row.division}
                    </div>
                  </td>
                  <td className="py-4 text-xs font-bold text-text-muted uppercase tracking-widest">
                    {row.instructor}
                  </td>
                  <td className="py-4">
                    <span
                      className={cn(
                        "px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider",
                        row.status === "LIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700",
                      )}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="py-4 font-mono text-[10px] text-text-muted uppercase opacity-60">
                    CS-{row.id}-HUB
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
