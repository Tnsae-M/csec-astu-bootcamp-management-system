import React from 'react';
import { Settings, Shield, Bell, Database, Globe, Lock, Cpu, Save } from 'lucide-react';
import { Button } from '@/components/ui';

export default function SettingsPage() {
  const sections = [
    {
      title: 'Academy Identity',
      icon: Globe,
      description: 'Manage institutional branding and public portal visibility settings.',
      fields: [
        { label: 'Platform Display Name', value: 'CSEC Portal' },
        { label: 'Institutional Domain', value: 'scholar.astu.edu.et' }
      ]
    },
    {
      title: 'Security Governance',
      icon: Shield,
      description: 'Configure authentication protocols and system access levels.',
      fields: [
        { label: 'Multi-Factor Auth', value: 'Enforced' },
        { label: 'Session Expiry', value: '24 Hours' }
      ]
    },
    {
      title: 'Data Infrastructure',
      icon: Database,
      description: 'Registry backups and persistence layer control systems.',
      fields: [
        { label: 'Backup Frequency', value: 'Hourly' },
        { label: 'Resource Quota', value: '100 GB / Division' }
      ]
    }
  ];

  return (
    <div className="space-y-10 selection:bg-brand-accent selection:text-white">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-brand-accent uppercase tracking-tighter">System settings</h1>
          <p className="text-text-muted font-bold text-xs uppercase tracking-[0.2em] mt-2">Platform Governance & Infrastructure control</p>
        </div>
        <Button className="px-10 py-5 text-[11px] font-black uppercase tracking-[0.3em] shadow-xl shadow-brand-accent/20">
          <Save size={16} className="mr-3" /> Commit Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {sections.map((section, i) => (
          <div key={i} className="geo-card p-10 flex flex-col justify-between group hover:border-brand-accent/30 transition-all">
            <div className="space-y-6">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-brand-primary border border-brand-border text-brand-accent rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-brand-accent group-hover:text-white transition-all">
                  <section.icon size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-text-main uppercase tracking-tight group-hover:text-brand-accent transition-colors">{section.title}</h3>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">Infrastructure Segment</p>
                </div>
              </div>
              <p className="text-xs font-medium text-text-muted leading-relaxed">
                {section.description}
              </p>

              <div className="space-y-4 pt-6 border-t border-brand-border">
                {section.fields.map((field, j) => (
                  <div key={j} className="flex justify-between items-center py-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">{field.label}</span>
                    <span className="text-xs font-black text-brand-accent uppercase tracking-tighter bg-brand-primary px-3 py-1 rounded-lg border border-brand-border">{field.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Button variant="outline" size="sm" className="text-[10px] font-black uppercase tracking-widest border-brand-border text-text-muted hover:text-brand-accent hover:border-brand-accent transition-all px-6">Configure</Button>
            </div>
          </div>
        ))}

        <div className="p-10 geo-card bg-brand-accent text-white shadow-xl shadow-brand-accent/20 relative overflow-hidden group flex flex-col justify-center">
          <div className="relative z-10 space-y-6 text-center max-w-sm mx-auto">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
              <Lock size={40} />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tighter">Maintenance Mode</h3>
            <p className="text-[11px] font-bold uppercase tracking-widest opacity-80 leading-relaxed">
              Platform-wide operational lockdown for structural database integrity checks and framework migration.
            </p>
            <Button variant="secondary" className="w-full bg-white text-brand-accent font-black uppercase tracking-widest text-[11px] hover:bg-brand-primary">Initiate Protocol</Button>
          </div>
          <div className="absolute -left-10 -bottom-10 opacity-10 group-hover:scale-125 transition-all duration-1000">
            <Cpu size={240} />
          </div>
        </div>
      </div>
    </div>
  );
}
