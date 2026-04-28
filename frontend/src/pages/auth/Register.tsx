import React from 'react';
import { Button, Card } from '@/components/ui';
import { Link } from 'react-router-dom';
import Logo from '../../components/common/Logo';
import { ShieldAlert, ArrowLeft, Headphones, MessageSquare } from 'lucide-react';

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-primary px-4 relative overflow-hidden">
      {/* BACKGROUND DECORATION */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-accent blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-accent blur-[120px]" />
      </div>

      <div className="max-w-md w-full relative z-10 text-center">
        <div className="mb-10">
          <div className="inline-flex p-4 rounded-3xl bg-white shadow-xl shadow-brand-accent/10 mb-6 border border-brand-border/50">
            <Logo size="lg" />
          </div>
          <h1 className="text-3xl font-black text-text-main tracking-tight uppercase leading-none">
            Secure Enrollment
          </h1>
          <p className="text-[10px] text-text-muted mt-3 font-black uppercase tracking-[0.3em] italic">
            Entry Protocol & Access Management
          </p>
        </div>

        <Card className="p-8 md:p-10 border-none bg-white/80 backdrop-blur-md shadow-2xl shadow-brand-accent/5">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 animate-pulse">
              <ShieldAlert className="h-8 w-8" />
            </div>
          </div>
          
          <h2 className="text-xl font-black text-text-main uppercase tracking-tight mb-4">Registration Locked</h2>
          
          <p className="mb-8 text-text-muted font-medium text-sm leading-relaxed italic">
            Direct public registration is restricted for security and academic tracking. Please coordinate with your <span className="text-brand-accent font-black">Division Head</span> or System Administrator to receive your unique credentials.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="p-4 rounded-xl bg-brand-primary/50 border border-brand-border/30 flex flex-col items-center gap-2 group cursor-pointer hover:bg-brand-primary transition-colors">
              <Headphones className="h-4 w-4 text-brand-accent" />
              <span className="text-[9px] font-black uppercase tracking-widest text-text-muted group-hover:text-text-main">Help Desk</span>
            </div>
            <div className="p-4 rounded-xl bg-brand-primary/50 border border-brand-border/30 flex flex-col items-center gap-2 group cursor-pointer hover:bg-brand-primary transition-colors">
              <MessageSquare className="h-4 w-4 text-brand-accent" />
              <span className="text-[9px] font-black uppercase tracking-widest text-text-muted group-hover:text-text-main">Request ID</span>
            </div>
          </div>
          
          <Link to="/login" className="inline-flex items-center text-[10px] font-black text-text-muted uppercase tracking-[0.2em] hover:text-brand-accent transition-colors group">
            <ArrowLeft className="mr-2 h-3 w-3 group-hover:-translate-x-1 transition-transform" />
            Back to Identification
          </Link>
        </Card>

        <div className="mt-10 p-4 text-center">
          <div className="flex justify-center space-x-2 text-[9px] font-bold uppercase tracking-[0.3em] text-text-muted/40">
            <span>ADMIN</span> | <span>INSTRUCTOR</span> | <span>STUDENT</span>
          </div>
        </div>
      </div>
    </div>
  );
}
