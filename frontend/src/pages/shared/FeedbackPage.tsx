import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { MessageCircle, Star, Quote } from 'lucide-react';
import { Button } from '@/src/components/ui';

export default function FeedbackPage() {
  const { feedbacks } = useSelector((state: RootState) => state.feedback);
  const { users } = useSelector((state: RootState) => state.users);
  const { searchTerm } = useSelector((state: RootState) => state.ui);

  const getUserName = (id: string) => users.find(u => u.id === id)?.name || 'Unknown User';

  const filteredFeedbacks = feedbacks.filter((f) => 
    f.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getUserName(f.fromId).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 selection:bg-brand-accent selection:text-white">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-brand-accent uppercase tracking-tighter">Feedback Registry</h1>
          <p className="text-text-muted font-bold text-xs uppercase tracking-[0.2em] mt-2">Quality Metrics & Community Insights</p>
        </div>
        <Button className="px-6 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-brand-accent/20">
          Create Evaluation
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredFeedbacks.map((f) => (
          <div key={f.id} className="geo-card p-10 flex flex-col justify-between group hover:border-brand-accent/40 transition-all relative overflow-hidden">
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
                "{f.message}"
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-brand-border pt-6 mt-10">
              <div className="flex items-center space-x-4">
                 <div className="w-10 h-10 rounded-full bg-brand-primary border border-brand-border flex items-center justify-center text-brand-accent font-black text-xs shadow-sm">
                    {getUserName(f.fromId).charAt(0)}
                 </div>
                 <div>
                    <h4 className="text-text-main text-xs font-black uppercase tracking-widest">{getUserName(f.fromId)}</h4>
                    <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest mt-0.5">Contributor Profile</p>
                 </div>
              </div>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                {new Date(f.timestamp).toLocaleDateString()}
              </span>
            </div>
            
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-accent/5 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    </div>
  );
}
