import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { Star, Quote } from 'lucide-react';
import { feedbackService } from '../../services/feedback.service';

interface FeedbackPageProps {
  sessionId?: string;
}

export default function FeedbackPage({ sessionId }: FeedbackPageProps) {
  const { users } = useSelector((state: RootState) => state.users);
  const { searchTerm } = useSelector((state: RootState) => state.ui);
  const [feedbacks, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;
    setLoading(true);
    feedbackService.getFeedbacksBySession(sessionId)
      .then(res => setSubmissions(res.data || []))
      .catch(err => console.error("Failed to fetch feedback", err))
      .finally(() => setLoading(false));
  }, [sessionId]);

  const getUserName = (id: string) => users.find(u => u._id === id)?.name || 'Unknown User';

  const filteredFeedbacks = feedbacks.filter((f: any) => {
    const comment = f.comment || f.message || '';
    const studentName = f.studentId?.name || getUserName(f.studentId);
    
    return comment.toLowerCase().includes((searchTerm || '').toLowerCase()) ||
           studentName.toLowerCase().includes((searchTerm || '').toLowerCase());
  });

  if (loading) {
    return <div className="text-center py-10 font-black uppercase text-brand-accent animate-pulse tracking-[0.2em]">Retrieving Evaluations...</div>;
  }

  return (
    <div className="space-y-8 selection:bg-brand-accent selection:text-white">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-brand-accent uppercase tracking-tighter">Feedback Registry</h1>
          <p className="text-text-muted font-bold text-xs uppercase tracking-[0.2em] mt-2">Quality Metrics & Community Insights</p>
        </div>
      </div>

      {filteredFeedbacks.length === 0 ? (
        <div className="text-center py-20 bg-brand-primary/50 border border-dashed border-brand-border rounded-2xl">
          <p className="text-text-muted font-black uppercase tracking-widest text-xs">No feedback recorded for this session.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredFeedbacks.map((f) => (
            <div key={f._id} className="geo-card p-10 flex flex-col justify-between group hover:border-brand-accent/40 transition-all relative overflow-hidden">
              <div>
                <div className="flex justify-between items-start mb-10">
                  <Quote className="text-brand-accent/10 w-12 h-12" />
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < f.rating ? "text-brand-accent fill-brand-accent" : "text-brand-border"} />
                    ))}
                  </div>
                </div>
                <p className="text-text-main text-lg font-medium italic leading-relaxed mb-10">
                  "{f.comment || f.message}"
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-brand-border pt-6 mt-10">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-brand-primary border border-brand-border flex items-center justify-center text-brand-accent font-black text-xs shadow-sm">
                    {(f.studentId?.name || getUserName(f.studentId)).charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-text-main text-xs font-black uppercase tracking-widest">
                      {f.studentId?.name || getUserName(f.studentId)}
                    </h4>
                    <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest mt-0.5">Contributor Profile</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                  {new Date(f.createdAt || f.timestamp).toLocaleDateString()}
                </span>
              </div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-accent/5 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
