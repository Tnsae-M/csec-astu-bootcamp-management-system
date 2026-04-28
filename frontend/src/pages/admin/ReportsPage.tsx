import React, { useEffect, useState } from 'react';
import { Download, Calendar, FileText, CheckCircle } from 'lucide-react';
import * as reportsService from '../../services/reports.service';

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
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await reportsService.getReports();
      const list = Array.isArray(data) ? data : (data?.data ?? []);
      setReports(list);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Failed to load reports');
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleGenerate = async () => {
    // Placeholder: for now generate a simple report using timestamp
    try {
      setLoading(true);
      setError(null);
      const payload = { title: `Quick Report ${new Date().toLocaleString()}`, content: 'Auto-generated report.' };
      await reportsService.createReport(payload);
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const recentCount = reports.filter(r => {
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
        <StatCard icon={<CheckCircle className="text-blue-600" />} title="Attendance Stats" value={`${recentCount} New`} subtitle="Recent week" />
        <StatCard icon={<FileText className="text-blue-600" />} title="Submissions Rate" value={`92%`} subtitle="Overall" />
        <StatCard icon={<Calendar className="text-blue-600" />} title="System Uptime" value={`99.9%`} subtitle="Last 30 days" />
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
              {reports.length === 0 && <li className="text-gray-500">No reports have been generated yet.</li>}
              {reports.map((r) => (
                <li key={r._id} className="flex items-center justify-between border rounded p-4">
                  <div>
                    <div className="text-lg font-bold">{r.title || 'Untitled Report'}</div>
                    <div className="text-sm text-gray-500">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''} • {r.author ? `by ${String(r.author).slice(0,8)}` : ''}</div>
                    <p className="mt-2 text-sm text-gray-700">{String(r.content || '').slice(0,240)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="text-blue-600 hover:bg-blue-50 p-2 rounded" title="Download">
                      <Download size={18} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
