import React from "react";
import { Card, Button } from "@/src/components/ui";
import {
  BookOpen,
  Calendar,
  Star,
  Clock,
  Terminal,
  Award,
  ArrowRight,
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

export default function StudentDashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { items: sessionItems } = useSelector(
    (state: RootState) => state.sessions,
  );
  const { progress } = useSelector((state: RootState) => state);
  const { searchTerm } = useSelector((state: RootState) => state.ui);

  const studentReports = progress.reports.filter(
    (r) => r.studentId === user?.id,
  );
  const latestGrade = studentReports[studentReports.length - 1];

  const filteredSessions = sessionItems.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.division.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.instructor.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const ongoingTask = {
    title: "Advanced System Architecture",
    deadline: "28 April, 2026",
    progress: 72,
  };

  return (
    <div className="space-y-10 selection:bg-brand-accent selection:text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-black text-brand-accent tracking-tighter uppercase leading-none mb-2">
            Student Profile
          </h1>
          <p className="text-text-muted text-[11px] font-bold uppercase tracking-widest leading-none">
            Operational Division: {user?.division || "CSEC General"}
          </p>
        </div>
        {/* <Button size="md" className="text-[10px] font-black uppercase tracking-widest px-6">Submit Feedback</Button> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* <div className="geo-card p-10 relative overflow-hidden group">
             <div className="relative z-10">
               <span className="px-3 py-1 bg-brand-accent text-white text-[9px] font-black uppercase tracking-widest rounded mb-6 inline-block shadow-lg shadow-brand-accent/20">Active Enrollment</span>
               <h2 className="text-5xl font-black text-text-main tracking-tighter uppercase mb-4 leading-none">{ongoingTask.title}</h2>
               <div className="flex items-center text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-10">
                 <Clock size={14} className="mr-2 text-brand-accent" />
                 Time Remaining: 04 Days 12 Hours
               </div>
               
               <div className="max-w-md">
                 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-text-muted mb-3">
                   <span>Completion Vector</span>
                   <span className="text-text-main">{ongoingTask.progress}%</span>
                 </div>
                 <div className="h-2 bg-brand-primary rounded-full overflow-hidden border border-brand-border shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${ongoingTask.progress}%` }}
                      className="h-full bg-brand-accent" 
                    />
                 </div>
               </div>
               
               <Button className="mt-10 px-10 text-[10px] font-black uppercase tracking-widest italic group">
                 Initialization Task 
                 <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
               </Button>
             </div>
  
             <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-brand-accent/5 to-transparent pointer-events-none opacity-50" />
             <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-accent-blue opacity-[0.02] rounded-full blur-3xl pointer-events-none group-hover:opacity-[0.05] transition-opacity" />
          </div> */}

          {/* <div className="geo-card p-8">
            <h3 className="text-xl font-black text-text-main uppercase tracking-tighter mb-8">Curriculum Spectrum</h3>
            <div className="space-y-4">
              {filteredSessions.slice(0, 3).map((session) => (
                <div key={session.id} className="flex items-center justify-between p-5 bg-brand-primary/30 border border-brand-border rounded-xl hover:bg-white hover:shadow-md hover:border-brand-accent/50 transition-all cursor-pointer group">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-white border border-brand-border text-brand-accent rounded-lg flex items-center justify-center font-bold mr-6 group-hover:bg-brand-accent group-hover:text-white transition-all shadow-sm">
                       <Calendar size={20} />
                    </div>
                    <div>
                       <p className="font-black text-sm text-text-main uppercase tracking-tight group-hover:text-brand-accent transition-colors">{session.title}</p>
                       <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest leading-none mt-1.5">{session.instructor} · {session.time}</p>
                    </div>
                  </div>
                  <ArrowRight className="text-brand-accent opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" size={18} />
                </div>
              ))}
            </div>
          </div> */}
        </div>

        {/* <div className="space-y-6">
           <div className="geo-card p-8 relative overflow-hidden">
              <h3 className="text-sm font-black text-text-muted uppercase tracking-[0.3em] mb-10">Performance Metrics</h3>
              <div className="space-y-8">
                 {studentReports.map((report) => (
                   <div key={report.id} className="flex justify-between items-center group cursor-default border-b border-brand-border pb-4 last:border-0 grow">
                     <div>
                       <div className="font-black text-[11px] text-text-main group-hover:text-brand-accent transition-colors uppercase tracking-widest">Phase {report.week} Evaluation</div>
                       <div className="text-[9px] text-text-muted uppercase font-bold tracking-widest mt-1">Status: {report.status}</div>
                     </div>
                     <div className="text-2xl font-black text-brand-accent tracking-tighter">{report.score}<span className="text-[10px] opacity-20 ml-1 font-bold">%</span></div>
                   </div>
                 ))}
              </div>
              <div className="mt-12 pt-8 border-t border-brand-border flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Cumulative GPA</span>
                <span className="text-4xl font-black text-brand-accent tracking-tighter drop-shadow-sm">3.92</span>
              </div>
              <div className="absolute top-0 right-0 w-1.5 h-full bg-brand-accent" />
           </div>

           <div className="geo-card p-8 bg-brand-accent/5 border-brand-accent/10">
              <h4 className="text-[11px] font-black uppercase text-brand-accent mb-8 tracking-[0.2em] inline-block border-b-2 border-brand-accent pb-1">Resources & Assets</h4>
              <div className="flex flex-col gap-4">
                 {[
                   { icon: BookOpen, label: 'Central Library' },
                   { icon: Terminal, label: 'Execution Shell' },
                   { icon: Award, label: 'Badge Registry' },
                 ].map((link) => (
                   <button key={link.label} className="flex items-center p-4 rounded-xl bg-white border border-brand-border hover:border-brand-accent hover:text-brand-accent transition-all text-left font-black text-[10px] uppercase tracking-widest group shadow-sm">
                      <link.icon size={16} className="mr-4 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all" /> 
                      {link.label}
                   </button>
                 ))}
              </div>
           </div>
        </div> */}
      </div>
    </div>
  );
}
