import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { progressService } from '../../services/all_others.service';
import { WeeklyProgress } from '../../types';
import { 
  TrendingUp, 
  Plus, 
  FileText, 
  ExternalLink, 
  Clock,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { toast } from 'sonner';
import { format } from 'date-fns';

export const WeeklyProgressPage = () => {
  const { user, activeRole } = useSelector((state: RootState) => state.auth);
  const [reports, setReports] = useState<WeeklyProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    weekNumber: 1
  });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const res = await progressService.getWeeklyProgress('b1');
        setReports(res.data);
      } catch (err) {
        toast.error('Failed to load progress reports');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.description.length < 50) {
      toast.error('Description must be at least 50 characters');
      return;
    }
    try {
      const res = await progressService.submitWeeklyProgress({
        ...formData,
        bootcampId: 'b1',
        groupId: 'g1', // Mocked for simplicity
      });
      setReports([res.data, ...reports]);
      setShowForm(false);
      toast.success('Progress report submitted successfully');
    } catch (err) {
      toast.error('Failed to submit report');
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">Weekly Progress Tracking</h1>
          <p className="text-text-muted font-medium mt-2">Document your group's weekly milestones and technical hurdles.</p>
        </div>
        {activeRole === 'student' && !showForm && (
          <Button size="lg" className="bg-brand-accent hover:bg-brand-accent/90" onClick={() => setShowForm(true)}>
            <Plus className="mr-2" size={18} />
            Submit Report
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="border-brand-accent shadow-2xl shadow-brand-accent/5">
          <CardHeader>
            <CardTitle className="text-xl font-black uppercase tracking-tight">New Weekly Report</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Report Title</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-3 font-bold text-sm focus:outline-none focus:border-brand-accent transition-colors"
                    placeholder="e.g. Week 4: API Integration Complete"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Week Number</label>
                  <input 
                    type="number" 
                    required
                    min={1}
                    className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-3 font-bold text-sm focus:outline-none focus:border-brand-accent transition-colors"
                    value={formData.weekNumber}
                    onChange={e => setFormData({...formData, weekNumber: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted flex justify-between">
                  Detailed Description (Min 50 chars)
                  <span className={formData.description.length >= 50 ? 'text-brand-success' : 'text-brand-danger'}>
                    {formData.description.length}/50
                  </span>
                </label>
                <textarea 
                  required
                  rows={4}
                  className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-3 font-bold text-sm focus:outline-none focus:border-brand-accent transition-colors resize-none"
                  placeholder="Explain what was achieved, roadblocks encountered, and next week's goals..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">External Links (Optional)</label>
                <input 
                  type="url" 
                  className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-3 font-bold text-sm focus:outline-none focus:border-brand-accent transition-colors"
                  placeholder="e.g. Project Demo URL or GitHub Hub repository"
                  value={formData.link}
                  onChange={e => setFormData({...formData, link: e.target.value})}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-brand-border">
                <Button variant="ghost" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit" className="bg-brand-accent font-black uppercase tracking-widest text-[10px] px-8">Submit Progress</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => <div key={i} className="h-40 bg-brand-card animate-pulse border border-brand-border rounded-2xl" />)}
        </div>
      ) : reports.length === 0 ? (
        <Card className="border-dashed border-2 py-16 text-center bg-brand-bg">
          <TrendingUp className="mx-auto text-text-muted mb-4 opacity-10" size={48} />
          <h3 className="text-lg font-bold">No Weekly Reports</h3>
          <p className="text-text-muted text-sm">Documentation is key to project success. Start tracking now.</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {reports.map((report) => (
            <Card key={report._id} className="bg-brand-card hover:border-brand-accent transition-all group">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-48 bg-brand-accent/5 p-6 border-b md:border-b-0 md:border-r border-brand-border flex flex-col justify-center items-center text-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-accent opacity-60">Week</span>
                    <span className="text-5xl font-black text-brand-accent">{report.weekNumber}</span>
                  </div>
                  <div className="flex-1 p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold uppercase tracking-tight">{report.title}</h3>
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-text-muted">
                            <Clock size={12} className="text-brand-accent" />
                            {format(new Date(report.submittedAt), 'PPp')}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-text-muted">
                            <FileText size={12} className="text-brand-accent" />
                            {report.description.length} Characters
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-brand-success/10 text-brand-success border-brand-success/20 uppercase font-black text-[10px]">
                        Submitted
                      </Badge>
                    </div>

                    <p className="text-sm text-text-muted leading-relaxed font-medium">
                      {report.description}
                    </p>

                    {report.link && (
                      <a 
                        href={report.link} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-accent hover:underline bg-brand-accent/5 px-3 py-2 rounded-lg border border-brand-accent/10"
                      >
                        <ExternalLink size={12} />
                        View Resources
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
