import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { StatCard } from '../../components/common/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { cn } from '../../lib/utils';
import { 
  Trophy, 
  Target, 
  Calendar, 
  Award, 
  TrendingUp,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { enrollmentService, progressService } from '../../services/all_others.service';


export const ProgressPage = () => {
  const { user, activeRole } = useSelector((state: RootState) => state.auth);
  const [progress, setProgress] = useState<any>(null);

  useEffect(() => {
    enrollmentService.getMyEnrollments().then(res => {
      const enrolls = Array.isArray(res) ? res : (res as any).data || [];
      if (enrolls.length > 0) {
        progressService.getMyProgress(enrolls[0].bootcampId || enrolls[0].bootcamp).then(prog => {
          setProgress(prog.data || prog);
        }).catch(console.error);
      }
    }).catch(console.error);
  }, []);

  return (
    <div className="space-y-8">
      <section className="flex items-end justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-text-muted">
            Performance Summary
          </p>
          <h1 className="text-3xl font-black tracking-tight uppercase text-text-main">
            My <span className="text-brand-accent">Progress</span>
          </h1>
        </div>
        <div className="flex gap-2">
           <Badge variant="outline" className="px-4 py-2 border-dashed">
                Rank: #14 in ASTU
           </Badge>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          label="Overall Grade" 
          value={`${progress?.avgScore ?? 0}%`} 
          trend="Score" 
          trendUp={true} 
          color="success"
        />
        <StatCard 
          label="Attendance Rate" 
          value={`${progress?.attendanceRate ?? 0}%`} 
          trend="Presence" 
          trendUp={true} 
          color="warning"
        />
        <StatCard 
          label="Tasks Completed" 
          value={`${progress?.taskCompletionRate ?? 0}%`} 
          trend="Finished" 
          trendUp={true} 
          color="accent"
        />
      </div>

    </div>
  );
};
