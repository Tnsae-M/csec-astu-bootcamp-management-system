import React from 'react';
import { Card } from '@/src/components/ui';
import { MessageSquare } from 'lucide-react';

export default function ChatPage() {
  return (
    <div className="h-full flex flex-col space-y-10 selection:bg-brand-accent selection:text-white">
      <div>
        <h1 className="text-3xl font-black text-brand-accent tracking-tighter uppercase leading-none mb-2">
          Knowledge Base
        </h1>
        <p className="text-text-muted text-[13px] font-bold uppercase tracking-widest">Powered by Scholar Assistant Engine</p>
      </div>

      <div className="flex-1 min-h-[500px] geo-card flex items-center justify-center text-center p-12 relative overflow-hidden">
        <div className="max-w-md space-y-8 relative z-10">
          <div className="w-24 h-24 bg-brand-accent text-white rounded-full flex items-center justify-center mx-auto shadow-xl">
            <MessageSquare size={48} />
          </div>
          <div>
            <h2 className="text-4xl font-black text-text-main uppercase tracking-tighter mb-4">AI Scholar Support</h2>
            <p className="text-text-muted font-medium text-sm leading-relaxed">
              Connect with the CSEC Portal knowledge engine for instant research assistance and documentation support.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted border-y border-brand-border py-2 px-6">
              Status: Systems Online
            </p>
            <div className="flex gap-2">
              {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />)}
            </div>
          </div>
        </div>

        {/* Decorative flair */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-[100px] -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-[100px] -ml-32 -mb-32" />
      </div>
    </div>
  );
}
