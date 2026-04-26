import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';

export default function BootcampDetailPage() {
  const { role, divisionId, bootcampId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'groups' | 'sessions'>('sessions');
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center pr-4">
        <div>
          <h1 className="text-4xl font-black text-brand-accent uppercase tracking-tighter">Bootcamp Dashboard</h1>
          <p className="text-text-muted font-bold text-xs uppercase tracking-[0.2em] mt-2">ID: {bootcampId}</p>
        </div>
        {/* Creation controls removed from bootcamp detail — create actions live on Sessions and Groups pages */}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-brand-border space-x-8">
        <button
          onClick={() => setActiveTab('groups')}
          className={`pb-4 text-xs font-black uppercase tracking-widest transition-colors ${
            activeTab === 'groups' ? 'border-b-2 border-brand-accent text-brand-accent' : 'text-text-muted hover:text-text-main'
          }`}
        >
          Groups
        </button>
        <button
          onClick={() => setActiveTab('sessions')}
          className={`pb-4 text-xs font-black uppercase tracking-widest transition-colors ${
            activeTab === 'sessions' ? 'border-b-2 border-brand-accent text-brand-accent' : 'text-text-muted hover:text-text-main'
          }`}
        >
          Sessions
        </button>
      </div>

      {/* Tab Content */}
      <div className="pt-6">
        {activeTab === 'groups' && (
          <div className="text-text-muted font-bold uppercase text-xs">
            [Groups Placeholder - List of groups will appear here]
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="geo-card p-8 group hover:border-brand-accent/40 transition-all flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-black text-text-main uppercase tracking-tighter mb-2 group-hover:text-brand-accent transition-colors">Mock Session 1</h3>
                <p className="text-xs text-text-muted mb-8">This is a scaffolded placeholder session.</p>
              </div>
              <div className="pt-6 border-t border-brand-border flex gap-3 mt-auto">
                <button 
                  onClick={() => navigate(`/dashboard/${role}/divisions/${divisionId}/bootcamps/${bootcampId}/sessions/mock-session-id`)}
                  className="flex-1 bg-brand-primary border border-brand-border text-brand-accent hover:bg-brand-accent hover:text-white transition-all py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm"
                >
                  View Session Details
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
