import React, { useState } from 'react';
import api from '@/api/axios';
import { Button } from '@/components/ui';
import { useDispatch } from 'react-redux';
import { submitFeedbackAsync } from '../../features/feedback/feedbackSlice';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

type Props = {
  open: boolean;
  onClose: () => void;
  sessionId?: string | number;
  instructorId?: string;
  bootcampId?: string;
};

export default function FeedbackForm({ open, onClose, sessionId, instructorId, bootcampId }: Props) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch() as any;

  if (!open) return null;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        sessionId,
        instructorId,
        bootcampId,
        rating,
        comment,
        isAnonymous,
      };
      
      const result = await dispatch(submitFeedbackAsync(payload));
      
      if (submitFeedbackAsync.fulfilled.match(result)) {
        toast.success('Feedback submitted successfully');
        setComment('');
        setRating(5);
        setIsAnonymous(true);
        onClose();
      } else {
        toast.error((result.payload as string) || 'Failed to submit feedback');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="bg-white rounded-xl p-6 z-10 w-full max-w-md shadow-lg">
        <h3 className="text-lg font-bold mb-4">Submit Feedback</h3>

        <div className="space-y-3">
          <label className="block text-sm font-semibold">Rating</label>
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full border px-3 py-2 rounded-md">
            {[5,4,3,2,1].map((r) => (<option key={r} value={r}>{r} Star{r>1?'s':''}</option>))}
          </select>

          <label className="block text-sm font-semibold">Comment</label>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="w-full border px-3 py-2 rounded-md" rows={4} />

          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={isAnonymous} onChange={(e)=>setIsAnonymous(e.target.checked)} />
            <span className="text-sm">Submit anonymously</span>
          </label>
        </div>

        <div className="flex justify-end mt-4 space-x-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</Button>
        </div>
      </div>
    </div>
  );
}
