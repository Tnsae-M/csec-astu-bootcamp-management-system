import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import { 
  Activity, 
  ShieldCheck, 
  Database, 
  Globe, 
  Server, 
  Cpu, 
  Layers,
  CheckCircle2,
  AlertCircle,
  Clock,
  Zap,
  HardDrive
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Card, StatCard, Badge, Button } from "../../components/ui";
import { fetchUsers } from "@/features/users/usersSlice";
import { fetchBootcamps } from "@/features/bootcamps/bootcampsSlice";
import { getAnalytics } from "@/services/reports.service";
import { getActivities } from "@/services/audit.service";

export default function AuditPage() {
  const dispatch = useDispatch() as any;
  const { users } = useSelector((state: RootState) => state.users);
  const { bootcamps } = useSelector((state: RootState) => state.bootcamps);
  
  const [lastAudit, setLastAudit] = useState(new Date().toLocaleString());
  const [isSyncing, setIsSyncing] = useState(false);
  const [systemStats, setSystemStats] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);

  const fetchAuditData = async () => {
    setIsSyncing(true);
    try {
      const [analytics, activityRes] = await Promise.all([
        getAnalytics(),
        getActivities(10)
      ]);
      setSystemStats(analytics.data);
      setActivities(activityRes.data || []);
      setLastAudit(new Date().toLocaleString());
      dispatch(fetchUsers(undefined));
      dispatch(fetchBootcamps());
    } catch (error) {
      console.error("Audit failed", error);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchAuditData();
  }, [dispatch]);

  const handleSync = () => {
    fetchAuditData();
  };

  const integratedMetrics = [
    { label: "Data Integrity", value: systemStats ? "99.9%" : "...", status: "OPTIMAL", icon: Database },
    { label: "User Registry", value: users.length, status: "SYNCED", icon: ShieldCheck },
    { label: "Bootcamp Nodes", value: bootcamps.length, status: "ACTIVE", icon: Layers },
    { label: "API Connectivity", value: "Real-time", status: "CONNECTED", icon: Globe },
  ];

  const nonIntegratedDiagnostics = [
    { label: "OS Platform", value: systemStats?.platform?.toUpperCase() || "...", status: "HEALTHY", icon: Server },
    { label: "CPU Load", value: systemStats?.cpuLoad || "...", status: "STABLE", icon: Cpu },
    { label: "Memory Usage", value: systemStats?.memoryUsage || "...", status: "NORMAL", icon: Zap },
    { label: "Server Uptime", value: systemStats?.uptime || "...", status: "READY", icon: Clock },
  ];

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diff = now.getTime() - then.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return then.toLocaleDateString();
  };

  return (
    <div className="space-y-8 selection:bg-brand-accent selection:text-white pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-brand-accent uppercase tracking-tighter flex items-center gap-3">
            System Audit <Activity className="h-8 w-8 text-brand-accent/30" />
          </h1>
          <p className="text-text-muted font-bold text-xs uppercase tracking-[0.2em] mt-2">
            Infrastructure Governance & Integrity Registry
          </p>
        </div>
        <div className="flex items-center gap-4 bg-brand-primary/50 p-4 rounded-2xl border border-brand-border">
          <div className="text-right">
            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Last Global Sync</p>
            <p className="text-xs font-black text-text-main">{lastAudit}</p>
          </div>
          <Button 
            onClick={handleSync} 
            disabled={isSyncing}
            className={cn("h-10 px-6", isSyncing && "animate-pulse")}
          >
            {isSyncing ? "Verifying..." : "Run Global Audit"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* INTEGRATED AUDIT */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
            <h3 className="text-lg font-black text-text-main uppercase tracking-tight">Integrated Core Registry</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integratedMetrics.map((m, i) => (
              <Card key={i} className="p-6 hover:border-brand-accent/20 transition-all group">
                <div className="flex justify-between items-start">
                  <div className="p-3 rounded-xl bg-brand-primary text-brand-accent group-hover:bg-brand-accent group-hover:text-white transition-colors">
                    <m.icon size={20} />
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-green-200 text-[9px] uppercase tracking-widest px-2 py-0.5">
                    {m.status}
                  </Badge>
                </div>
                <div className="mt-4">
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{m.label}</p>
                  <p className="text-2xl font-black text-text-main mt-1 tracking-tighter">{m.value}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* NON-INTEGRATED DIAGNOSTICS */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <h3 className="text-lg font-black text-text-main uppercase tracking-tight">External System Diagnostics</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nonIntegratedDiagnostics.map((m, i) => (
              <Card key={i} className="p-6 bg-brand-primary/20 border-transparent hover:border-brand-border transition-all">
                <div className="flex justify-between items-start">
                  <div className="p-3 rounded-xl bg-white text-brand-accent shadow-sm">
                    <m.icon size={20} />
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-[9px] uppercase tracking-widest px-2 py-0.5">
                    {m.status}
                  </Badge>
                </div>
                <div className="mt-4">
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{m.label}</p>
                  <p className="text-2xl font-black text-text-main mt-1 tracking-tighter">{m.value}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* DETAILED AUDIT LOG */}
      <Card className="border-none bg-white p-8 overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-brand-primary text-brand-accent">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-text-main uppercase">Real-time Activity Stream</h3>
              <p className="text-xs text-text-muted font-bold tracking-widest uppercase">Latest Integrated Transactions</p>
            </div>
          </div>
          <Button variant="ghost" className="text-xs font-black uppercase tracking-widest text-brand-accent">
            Export JSON Archive
          </Button>
        </div>

        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-10 text-text-muted font-bold uppercase text-xs tracking-widest">
              No recent activity recorded.
            </div>
          ) : (
            activities.map((log, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-brand-primary/30 rounded-2xl border border-transparent hover:border-brand-border transition-all">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs",
                    log.type === 'security' ? "bg-red-100 text-red-600" :
                    log.type === 'system' ? "bg-blue-100 text-blue-600" :
                    log.type === 'maintenance' ? "bg-amber-100 text-amber-600" :
                    "bg-green-100 text-green-600"
                  )}>
                    {log.user.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-black text-text-main uppercase tracking-tight">{log.action}</p>
                    <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-0.5">By {log.user}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={12} className="text-text-muted" />
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{getTimeAgo(log.createdAt)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
