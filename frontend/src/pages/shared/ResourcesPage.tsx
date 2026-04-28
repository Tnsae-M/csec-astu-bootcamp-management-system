import React, { useEffect, useState } from 'react';
import { BookOpen, FileText, Download, Plus } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { Button, Modal } from '../../components/ui';
import { resourcesService } from '../../services/resources.service';

interface ResourcesPageProps {
  sessionId?: string;
}

export default function ResourcesPage({ sessionId }: ResourcesPageProps) {
  const { searchTerm } = useSelector((state: RootState) => state.ui);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchResources = async () => {
    if (!sessionId) return;
    setLoading(true);
    try {
      const res = await resourcesService.getResourcesBySession(sessionId);
      const payload = res.data ?? res;
      const list = Array.isArray(payload) ? payload : payload?.data ?? [];
      setResources(list);
    } catch (e) {
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResources(); }, [sessionId]);

  const roles = (user?.roles || []).map((r: string) => String(r).toUpperCase());
  const canUpload = roles.includes('INSTRUCTOR') || String(user?.role || '').toUpperCase() === 'INSTRUCTOR';
  const [success, setSuccess] = useState('');

  const filteredResources = resources.filter((r) => 
    r.title?.toLowerCase().includes((searchTerm || '').toLowerCase()) ||
    r.type?.toLowerCase().includes((searchTerm || '').toLowerCase()) ||
    r.division?.toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  const handleUpload = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!sessionId) return alert('Session context missing');
    if (!file) return alert('Please select a PDF file');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('title', title);
      fd.append('description', description);
      const res = await resourcesService.uploadResource(sessionId, fd);
      // After upload, refresh list
      await fetchResources();
      setShowAdd(false);
      setTitle(''); setDescription(''); setFile(null);
      setSuccess('Resource uploaded successfully');
      setTimeout(() => setSuccess(''), 3500);
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (r: any) => {
    if (!r || !r._id) return;
    try {
      const blob = await resourcesService.downloadResource(r._id);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const a = document.createElement('a');
      a.href = url;
      a.download = r.filename || `${r.title || 'resource'}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      // fallback: open fileUrl if provided
      if (r.fileUrl) window.open(r.fileUrl, '_blank');
      else alert('Download failed');
    }
  };

  return (
    <div className="space-y-8 selection:bg-brand-accent selection:text-white">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-brand-accent uppercase tracking-tighter">Digital Library</h1>
          <p className="text-text-muted font-bold text-xs uppercase tracking-[0.2em] mt-2">Session Resources</p>
        </div>
        <div className="flex flex-col items-end">
          {canUpload ? (
            <Button onClick={() => setShowAdd(true)} className="bg-brand-accent text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
              <Plus /> Add Resource
            </Button>
          ) : (
            <div className="flex items-center space-x-3">
              <button title={isAuthenticated ? 'Only instructors can upload resources' : 'Login as an instructor to upload resources'} disabled className="p-2 px-4 rounded-full bg-brand-primary/30 border border-dashed border-brand-border text-text-muted flex items-center gap-2 cursor-not-allowed">
                <Plus /> Add Resource
              </button>
            </div>
          )}
          {(!isAuthenticated || user?.role !== 'INSTRUCTOR') && (
            <div className="text-[11px] text-text-muted mt-2 text-right">
              {!isAuthenticated ? (
                <span className="font-bold uppercase">Login to download. </span>
              ) : null}
              <span className="ml-1">Only instructors can upload session resources.</span>
            </div>
          )}
          {success && <div className="text-sm text-green-600 mt-2">{success}</div>}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">Loading resources...</div>
      ) : filteredResources.length === 0 ? (
        <div className="text-center py-20 bg-brand-primary/50 border border-dashed border-brand-border rounded-2xl">
          <p className="text-text-muted font-black uppercase tracking-widest text-xs">No resources yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredResources.map((r) => (
            <div key={r._id || r.id} className="geo-card p-6 flex items-center justify-between group hover:border-brand-accent/50 transition-all">
               <div className="flex items-center space-x-6">
                  <div className="w-14 h-14 bg-brand-primary border border-brand-border rounded-xl flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-white transition-all shadow-sm">
                     <FileText size={24} />
                  </div>
                  <div>
                     <h3 className="text-text-main font-bold uppercase tracking-tight group-hover:text-brand-accent transition-colors">{r.title}</h3>
                     <div className="flex items-center space-x-3 mt-1">
                        <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">PDF</span>
                        <span className="text-[9px] text-brand-border opacity-50">•</span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-brand-accent">{r.uploaderName || r.author || 'Unknown'}</span>
                     </div>
                     {r.description && <p className="text-sm text-text-muted mt-2 line-clamp-2">{r.description}</p>}
                  </div>
               </div>
               
               <div className="flex items-center gap-2">
                  {isAuthenticated && ['INSTRUCTOR','STUDENT','ADMIN','SUPER ADMIN'].includes(user?.role) ? (
                    <button onClick={() => handleDownload(r)} className="p-3 rounded-lg bg-brand-primary border border-brand-border text-brand-accent hover:bg-brand-accent hover:text-white transition-all shadow-sm flex items-center gap-2">
                      <Download size={18} /> <span className="text-[12px] font-bold">Download</span>
                    </button>
                  ) : (
                    <button disabled title={isAuthenticated ? 'Only students and instructors can download resources' : 'Login to download'} className="p-3 rounded-lg bg-brand-primary/30 border border-brand-border text-text-muted transition-all shadow-sm flex items-center gap-2 cursor-not-allowed">
                      <Download size={18} /> <span className="text-[12px] font-bold">Download</span>
                    </button>
                  )}
               </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Resource" subtitle="Upload a PDF for this session" icon={<BookOpen />}>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase text-text-muted mb-2">Title</label>
            <input required value={title} onChange={e=>setTitle(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm focus:border-brand-accent outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-text-muted mb-2">Description (optional)</label>
            <textarea value={description} onChange={e=>setDescription(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm focus:border-brand-accent outline-none resize-none" rows={4} />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-text-muted mb-2">File (PDF)</label>
            <input accept="application/pdf" onChange={e => setFile(e.target.files?.[0] ?? null)} type="file" className="w-full" />
            {file && <div className="text-sm mt-2 text-text-muted">Selected: {file.name}</div>}
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button type="submit" disabled={uploading}>{uploading ? 'Uploading...' : 'Upload Resource'}</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
