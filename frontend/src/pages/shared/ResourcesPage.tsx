import React from 'react';
import { BookOpen, FileCode, Download } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';

export default function ResourcesPage() {
  const { searchTerm } = useSelector((state: RootState) => state.ui);
  const resources = [
    { id: 1, title: 'BMS Technical Documentation', type: 'PDF', size: '2.4MB', division: 'General' },
    { id: 2, title: 'React Hooks Deep Dive', type: 'VIDEO', size: '450MB', division: 'Software Development' },
    { id: 3, title: 'Pentesting 101: Legal Basics', type: 'DOC', size: '1.1MB', division: 'Cybersecurity' },
    { id: 4, title: 'Data Cleaning with Python', type: 'CODE', size: '15KB', division: 'Data Science' },
  ];

  const filteredResources = resources.filter((r) => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.division.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 selection:bg-brand-accent selection:text-white">
      <div>
        <h1 className="text-4xl font-black text-brand-accent uppercase tracking-tighter">Digital Library</h1>
        <p className="text-text-muted font-bold text-xs uppercase tracking-[0.2em] mt-2">Curated Knowledge Assets & Research Data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredResources.map((r) => (
          <div key={r.id} className="geo-card p-6 flex items-center justify-between group hover:border-brand-accent/50 transition-all">
             <div className="flex items-center space-x-6">
                <div className="w-14 h-14 bg-brand-primary border border-brand-border rounded-xl flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-white transition-all shadow-sm">
                   {r.type === 'CODE' ? <FileCode size={24} /> : < BookOpen size={24} />}
                </div>
                <div>
                   <h3 className="text-text-main font-bold uppercase tracking-tight group-hover:text-brand-accent transition-colors">{r.title}</h3>
                   <div className="flex items-center space-x-3 mt-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">{r.type}</span>
                      <span className="text-[9px] text-brand-border opacity-50">•</span>
                      <span className="text-[9px] font-black uppercase tracking-widest text-brand-accent">{r.division}</span>
                   </div>
                </div>
             </div>
             
             <button className="p-3 rounded-lg bg-brand-primary border border-brand-border text-brand-accent hover:bg-brand-accent hover:text-white transition-all shadow-sm">
                <Download size={18} />
             </button>
          </div>
        ))}
      </div>
    </div>
  );
}
