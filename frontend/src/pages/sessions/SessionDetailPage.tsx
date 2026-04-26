import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import FeedbackForm from '@/src/components/feedback/FeedbackForm';

type TabType = 'tasks' | 'submissions' | 'attendance' | 'resources' | 'feedback';

export default function SessionDetailPage() {
  const { sessionId } = useParams();
  const [activeTab, setActiveTab] = useState<TabType>('tasks');
  const { feedbacks } = useSelector((state: RootState) => state.feedback);
  const { user } = useSelector((state: RootState) => state.auth);
  const [modalOpen, setModalOpen] = useState(false);

  const tabs: { id: TabType, label: string }[] = [
    { id: 'tasks', label: 'Tasks' },
    { id: 'submissions', label: 'Submissions' },
    { id: 'attendance', label: 'Attendance' },
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
        {activeTab !== 'feedback' && (
          <div className="text-text-muted font-bold uppercase text-xs">[{tabs.find(t => t.id === activeTab)?.label} Placeholder - Integrated content will appear here]</div>
        )}

        {activeTab === 'feedback' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="text-sm font-black uppercase text-text-muted">Session Feedback</div>
              {user?.role === 'STUDENT' && (
                <button onClick={() => setModalOpen(true)} className="btn">Give Feedback</button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4">
              {feedbacks.filter(f => String(f.sessionId) === String(sessionId)).map(f => (
                <div key={f.id} className="geo-card p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-sm font-black">{f.message}</div>
                      <div className="text-xs text-text-muted mt-2">Rating: {f.rating} — {new Date(f.timestamp).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))}
              {feedbacks.filter(f => String(f.sessionId) === String(sessionId)).length === 0 && (
                <div className="text-text-muted">No feedback submitted yet for this session.</div>
              )}
            </div>

            <FeedbackForm open={modalOpen} onClose={() => setModalOpen(false)} sessionId={sessionId} />
          </div>
        )}
      </div>
    </div>
  );
}
