import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import TasksPage from '../tasks/TasksPage';
import SubmissionsPage from '../instructor/SubmissionsPage';
import AttendancePage from '../shared/AttendancePage';
import ResourcesPage from '../shared/ResourcesPage';

type TabType = 'tasks' | 'submissions' | 'attendance' | 'resources';

export default function SessionDetailPage() {
  const { sessionId, bootcampId } = useParams<{ sessionId: string, bootcampId: string }>();
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
        {activeTab === 'tasks' && <TasksPage sessionId={sessionId} />}
        {activeTab === 'submissions' && <SubmissionsPage sessionId={sessionId} />}
        {activeTab === 'attendance' && <AttendancePage sessionId={sessionId} bootcampId={bootcampId} />}
        {activeTab === 'resources' && <ResourcesPage sessionId={sessionId} />}
      </div>
    </div>
  );
}
