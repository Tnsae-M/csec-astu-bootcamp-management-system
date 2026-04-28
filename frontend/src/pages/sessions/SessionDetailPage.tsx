import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import TasksPage from '../tasks/TasksPage';
import SubmissionsPage from '../instructor/SubmissionsPage';
import AttendancePage from '../shared/AttendancePage';
import ResourcesPage from '../shared/ResourcesPage';
import FeedbackPage from '../shared/FeedbackPage';
import FeedbackForm from '../../components/feedback/FeedbackForm';
import { RootState } from '@/src/app/store';
import { useSelector } from 'react-redux';

type TabType = 'tasks' | 'submissions' | 'attendance' | 'resources' | 'feedback';

export default function SessionDetailPage() {
  const { sessionId, bootcampId } = useParams<{ sessionId: string, bootcampId: string }>();
  const [activeTab, setActiveTab] = useState<TabType>('tasks');
  const { feedbacks } = useSelector((state: RootState) => state.feedback);
  const { user } = useSelector((state: RootState) => state.auth);
  const [modalOpen, setModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('openFeedback')) setModalOpen(true);
  }, [location.search]);

  const tabs: { id: TabType, label: string }[] = [
    { id: 'attendance', label: 'Attendance' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'submissions', label: 'Submissions' },
    { id: 'resources', label: 'Resources' },
    { id: 'feedback', label: 'Feedback' }
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
        {activeTab === 'tasks' && <TasksPage sessionId={sessionId} bootcampId={bootcampId} />}
        {activeTab === 'submissions' && <SubmissionsPage sessionId={sessionId} bootcampId={bootcampId} />}
        {activeTab === 'attendance' && <AttendancePage sessionId={sessionId} bootcampId={bootcampId} />}
        {activeTab === 'resources' && <ResourcesPage sessionId={sessionId} />}
        {activeTab === 'feedback' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              {user?.role === 'STUDENT' && (
                <button 
                  onClick={() => setModalOpen(true)}
                  className="bg-brand-accent text-white px-6 py-2 rounded-lg font-black uppercase text-xs tracking-widest hover:bg-brand-accent/90 transition-all shadow-lg"
                >
                  Give Feedback
                </button>
              )}
            </div>
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
