import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

type TabType = 'tasks' | 'submissions' | 'attendance' | 'resources';

export default function SessionDetailPage() {
  const { sessionId } = useParams();
  const [activeTab, setActiveTab] = useState<TabType>('tasks');

  const tabs: { id: TabType, label: string }[] = [
    { id: 'tasks', label: 'Tasks' },
    { id: 'submissions', label: 'Submissions' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'resources', label: 'Resources' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center pr-4">
        <div>
          <h1 className="text-4xl font-black text-brand-accent uppercase tracking-tighter">Session Hub</h1>
          <p className="text-text-muted font-bold text-xs uppercase tracking-[0.2em] mt-2">ID: {sessionId}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-brand-border space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 text-xs font-black uppercase tracking-widest transition-colors ${
              activeTab === tab.id ? 'border-b-2 border-brand-accent text-brand-accent' : 'text-text-muted hover:text-text-main'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="pt-6">
        <div className="text-text-muted font-bold uppercase text-xs">
          [{tabs.find(t => t.id === activeTab)?.label} Placeholder - Integrated content will appear here]
        </div>
      </div>
    </div>
  );
}
