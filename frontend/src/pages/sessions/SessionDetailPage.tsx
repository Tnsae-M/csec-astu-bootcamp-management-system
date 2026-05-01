import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import TasksPage from '../tasks/TasksPage';
import SubmissionsPage from '../instructor/SubmissionsPage';
import AttendancePage from '../shared/AttendancePage';
import ResourcesPage from '../shared/ResourcesPage';
import FeedbackPage from '../shared/FeedbackPage';
import FeedbackForm from '../../components/feedback/FeedbackForm';
import { RootState } from '@/app/store';
import { useSelector } from 'react-redux';

type TabType = 'tasks' | 'submissions' | 'attendance' | 'resources' | 'feedback';

export default function SessionDetailPage() {
  const { sessionId, bootcampId: pathBootcampId } = useParams<{ sessionId: string, bootcampId: string }>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const bootcampId = pathBootcampId || queryParams.get('bootcampId') || undefined;

  const [activeTab, setActiveTab] = useState<TabType>('tasks');
  const { feedbacks } = useSelector((state: RootState) => state.feedback);
  const { user, activeRole } = useSelector((state: RootState) => state.auth);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (queryParams.get('openFeedback')) setModalOpen(true);
  }, [location.search]);

  const userRoles = (user?.roles || (user?.role ? [user.role] : [])).map(r => r.toUpperCase());
  const currentRole = (activeRole || userRoles[0] || 'STUDENT').toUpperCase();
  const isFaculty = ['ADMIN', 'SUPER ADMIN', 'INSTRUCTOR'].includes(currentRole);

  const tabs: { id: TabType, label: string }[] = [
    { id: 'attendance', label: 'Attendance' },
    { id: 'tasks', label: 'Tasks' },
  ];

  if (isFaculty) {
    tabs.push({ id: 'submissions', label: 'Submissions' });
    tabs.push({ id: 'feedback', label: 'Feedback' });
  }

  tabs.push({ id: 'resources', label: 'Resources' });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center pr-4">
        <div>
          <h1 className="text-4xl font-black text-brand-accent uppercase tracking-tighter">Session Hub</h1>
          <p className="text-text-muted font-bold text-xs uppercase tracking-[0.2em] mt-2">ID: {sessionId}</p>
        </div>
        
        {!isFaculty && (
          <button 
            onClick={() => setModalOpen(true)}
            className="bg-brand-accent text-white px-6 py-2 rounded-lg font-black uppercase text-xs tracking-widest hover:bg-brand-accent/90 transition-all shadow-lg"
          >
            Give Feedback
          </button>
        )}
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
        {activeTab === 'tasks' && <TasksPage sessionId={sessionId} bootcampId={bootcampId} />}
        {activeTab === 'submissions' && isFaculty && <SubmissionsPage sessionId={sessionId} bootcampId={bootcampId} />}
        {activeTab === 'attendance' && <AttendancePage sessionId={sessionId} bootcampId={bootcampId} />}
        {activeTab === 'resources' && <ResourcesPage sessionId={sessionId} />}
        {activeTab === 'feedback' && isFaculty && (
          <div className="space-y-6">
            <FeedbackPage sessionId={sessionId} />
          </div>
        )}
      </div>

      {/* Modals */}
      {modalOpen && (
        <FeedbackForm 
          open={modalOpen} 
          onClose={() => setModalOpen(false)} 
          sessionId={sessionId}
          bootcampId={bootcampId}
        />
      )}
    </div>
  );
}
