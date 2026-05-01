import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Download, Calendar, FileText, CheckCircle, Edit, Trash2 } from 'lucide-react';
import { fetchReports, createReportAsync, updateReportAsync, fetchAnalyticsAsync, deleteReportAsync } from '../../features/reports/reportsSlice';
import { RootState } from '../../app/store';
import { toast } from 'sonner';

const StatCard = ({ icon, title, value, subtitle }: any) => (
  <div className="bg-white rounded-lg p-6 shadow-sm border">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-md bg-blue-50">
          {icon}
        </div>
        <div>
          <div className="text-sm text-gray-500">{title}</div>
          <div className="text-2xl font-bold">{value}</div>
          {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
        </div>
      </div>
    </div>
  </div>
);

const ReportsPage: React.FC = () => {
  const dispatch = useDispatch() as any;
  const { reports, analytics, loading, error } = useSelector((state: RootState) => state.reports);
  const [editingReport, setEditingReport] = useState<any>(null);

  useEffect(() => { 
    dispatch(fetchReports()); 
    dispatch(fetchAnalyticsAsync());
  }, [dispatch]);

  const handleGenerate = async () => {
    try {
      const payload = { title: `Quick Report ${new Date().toLocaleString()}`, content: 'Auto-generated report.' };
      const result = await dispatch(createReportAsync(payload));
      if (createReportAsync.fulfilled.match(result)) {
        toast.success('Report generated successfully');
      } else {
        toast.error((result.payload as string) || 'Failed to generate report');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate report');
    }
  };

  const handleDownload = (report: any) => {
    const element = document.createElement("a");
    const file = new Blob([`${report.title}\n\nGenerated on: ${new Date(report.createdAt).toLocaleString()}\n\n${report.content}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${(report.title || 'report').replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        const result = await dispatch(deleteReportAsync(id));
        if (deleteReportAsync.fulfilled.match(result)) {
          toast.success('Report deleted successfully');
        } else {
          toast.error('Failed to delete report');
        }
      } catch (err) {
        toast.error('Failed to delete report');
      }
    }
  };

  const recentCount = (reports || []).filter(r => {
    try {
      return (new Date(r.createdAt) > new Date(Date.now() - 1000 * 60 * 60 * 24 * 7));
    } catch { return false; }
  }).length;

  return (

    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black">System Reports</h1>
          <p className="text-gray-500 mt-1">Generate and view detailed analytics reports.</p>
        </div>
        <div>
          <button onClick={handleGenerate} className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow"> 
            <span className="inline-flex items-center gap-2"><FileText size={16} /> Generate</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard icon={<CheckCircle className="text-blue-600" />} title="Attendance Stats" value={`${analytics?.attendance || 0} New`} subtitle="Recent week" />
        <StatCard icon={<FileText className="text-blue-600" />} title="Submissions Rate" value={`${analytics?.submissionsRate || 0}%`} subtitle="Overall" />
        <StatCard icon={<Calendar className="text-blue-600" />} title="System Uptime" value={analytics?.uptime || '99.9%'} subtitle="Last 30 days" />
      </div>

      <div className="bg-white border rounded-lg">
        <div className="px-6 py-4 border-b">
          <h3 className="text-sm font-bold uppercase text-gray-500">Recent Generated Reports</h3>
        </div>

        <div className="p-4">
          {loading && <div className="text-gray-500">Loading reports...</div>}
          {error && <div className="text-red-500">{error}</div>}
          {!loading && !error && (
            <ul className="space-y-4">
              {(reports || []).length === 0 && <li className="text-gray-500">No reports have been generated yet.</li>}
              {(reports || []).map((r) => (
                <li key={r._id} className="flex items-center justify-between border rounded p-4">
                  <div>
                    <div className="text-lg font-bold">{r.title || 'Untitled Report'}</div>

                    <div className="text-sm text-gray-500">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''} • {r.author ? `by ${String(r.author).slice(0,8)}` : ''}</div>
                    <p className="mt-2 text-sm text-gray-700">{String(r.content || '').slice(0,240)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setEditingReport(r)} className="text-gray-600 hover:bg-gray-100 p-2 rounded" title="Edit">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(r._id)} className="text-red-600 hover:bg-red-50 p-2 rounded" title="Delete">
                      <Trash2 size={18} />
                    </button>
                    <button onClick={() => handleDownload(r)} className="text-blue-600 hover:bg-blue-50 p-2 rounded" title="Download">
                      <Download size={18} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {editingReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4">Edit Report</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                <input 
                  type="text" 
                  className="w-full border rounded p-2" 
                  value={editingReport.title}
                  onChange={e => setEditingReport({...editingReport, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Content</label>
                <textarea 
                  className="w-full border rounded p-2 h-32"
                  value={editingReport.content}
                  onChange={e => setEditingReport({...editingReport, content: e.target.value})}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setEditingReport(null)} className="px-4 py-2 border rounded font-bold text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={async () => {
                try {
                  await dispatch(updateReportAsync({ id: editingReport._id, payload: { title: editingReport.title, content: editingReport.content } })).unwrap();
                  toast.success("Report updated successfully");
                  setEditingReport(null);
                } catch(e: any) {
                  toast.error("Failed to update report");
                }
              }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded font-bold">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
