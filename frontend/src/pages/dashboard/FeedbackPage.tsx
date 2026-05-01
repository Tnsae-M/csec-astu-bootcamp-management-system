import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Textarea } from '../../components/ui/Textarea';
import { FormField } from '../../components/ui/FormField';
import { 
  MessageSquare, 
  Send, 
  Star, 
  ThumbsUp, 
  Flag,
  Lightbulb,
  Bug
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

export const FeedbackPage = () => {
  const [category, setCategory] = useState<string>('compliment');
  const [rating, setRating] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('System feedback sent to CSEC-ASTU administrators. Thank you!');
  };

  return (
    <div className="space-y-8">
      <section>
        <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-text-muted">
          Continuous Improvement
        </p>
        <h1 className="text-3xl font-black tracking-tight uppercase text-text-main">
          System <span className="text-brand-accent">Feedback</span>
        </h1>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Global System Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { id: 'bug', label: 'Report Bug', icon: Bug, color: 'text-danger' },
                    { id: 'idea', label: 'New Idea', icon: Lightbulb, color: 'text-warning' },
                    { id: 'compliment', label: 'Compliment', icon: ThumbsUp, color: 'text-success' },
                    { id: 'other', label: 'Flag Content', icon: Flag, color: 'text-text-muted' },
                  ].map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2",
                        category === cat.id 
                          ? "border-brand-accent bg-brand-accent/5" 
                          : "border-brand-border hover:bg-brand-primary"
                      )}
                    >
                      <cat.icon size={24} className={category === cat.id ? 'text-brand-accent' : cat.color} />
                      <span className="text-[10px] font-black uppercase tracking-tight">{cat.label}</span>
                    </button>
                  ))}
                </div>

                <FormField label="How would you rate your overall experience with the platform?">
                  <div className="flex gap-4">
                    {[1,2,3,4,5].map(s => (
                      <button 
                        key={s} 
                        type="button"
                        onClick={() => setRating(s)}
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center transition-all border border-brand-border",
                          rating >= s ? "bg-warning/10 text-warning border-warning/20 shadow-sm" : "bg-brand-primary text-text-muted opacity-40"
                        )}
                      >
                        <Star size={24} fill={rating >= s ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                </FormField>

                <FormField label="Your Message">
                  <Textarea 
                    placeholder="We'd love to hear your thoughts on the LMS..." 
                    className="h-40"
                    required
                  />
                </FormField>

                <Button type="submit" className="w-full gap-2 h-12 font-black uppercase tracking-widest text-[10px]">
                  <Send size={18} />
                  Transmit Feedback
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
           <Card className="bg-brand-sidebar text-white">
              <CardHeader>
                 <CardTitle className="text-brand-accent">Why we listen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs font-medium text-white/70 leading-relaxed">
                 <p>CSEC-ASTU is built on the principle of peer learning. Your feedback directly influences the features we prioritize.</p>
                 <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="font-black text-white uppercase tracking-widest text-[10px] mb-2 flex items-center gap-2">
                       <Lightbulb size={14} className="text-brand-accent" />
                       Recent Updates from Feedback
                    </p>
                    <ul className="space-y-2 list-disc list-inside">
                       <li>Added Dark High-Density theme</li>
                       <li>Implemented real-time notifications</li>
                       <li>Improved task submission workflow</li>
                    </ul>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
};
