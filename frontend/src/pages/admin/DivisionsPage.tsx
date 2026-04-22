import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../app/store';
import { Building2, Activity, Plus, Edit, Trash2 } from 'lucide-react';
import { divisionsService } from '../../services/divisions.service';
import { setDivisionsStart, setDivisionsSuccess, setDivisionsFailure } from '../../features/divisions/divisionsSlice';
import { Modal, Button } from '../../components/ui';

export default function DivisionsPage() {
  const dispatch = useDispatch();
  const { divisions, loading } = useSelector((state: RootState) => state.divisions);
  const { searchTerm } = useSelector((state: RootState) => state.ui);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const fetchDivisions = () => {
    dispatch(setDivisionsStart());
    divisionsService.getDivisions()
      .then(res => dispatch(setDivisionsSuccess(res.data || [])))
      .catch(err => dispatch(setDivisionsFailure(err.message)));
  };

  useEffect(() => {
    fetchDivisions();
  }, [dispatch]);

  const filteredDivisions = divisions.filter((d) => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.description && d.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({ name: '', description: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (division: any) => {
    setEditingId(division._id);
    setFormData({ name: division.name, description: division.description || '' });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the division: ${name}?`)) {
      try {
        await divisionsService.deleteDivision(id);
        fetchDivisions();
      } catch (err: any) {
        alert(err.response?.data?.message || err.message);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await divisionsService.updateDivision(editingId, formData);
      } else {
        await divisionsService.createDivision(formData);
      }
      setIsModalOpen(false);
      fetchDivisions();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="space-y-8 selection:bg-brand-accent selection:text-white">
      <div className="flex justify-between items-center pr-4">
        <div>
          <h1 className="text-4xl font-black text-brand-accent uppercase tracking-tighter">Academic Divisions</h1>
          <p className="text-text-muted font-bold text-xs uppercase tracking-[0.2em] mt-2">Departmental Framework & Oversight</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="bg-brand-accent text-white px-6 py-3 rounded-lg font-black uppercase tracking-widest text-xs flex items-center hover:bg-brand-accent/90 transition-colors shadow-lg shadow-brand-accent/20"
        >
          <Plus size={16} className="mr-2" /> Add Division
        </button>
      </div>

      {loading ? (
        <div className="text-center text-text-muted font-bold uppercase py-10">Loading Divisions...</div>
      ) : (

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDivisions.map((d) => (
          <div key={d._id} className="geo-card p-8 group hover:border-brand-accent/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-10">
                <div className="w-14 h-14 rounded-2xl bg-brand-accent text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Building2 size={28} />
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleDelete(d._id, d.name)}
                    className="p-2 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                    title="Delete Division"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="flex items-center space-x-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-green-200">
                    <Activity size={10} /> ACTIVE
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-black text-text-main uppercase tracking-tighter mb-2 group-hover:text-brand-accent transition-colors">{d.name}</h3>
              <div className="space-y-4 mb-8 min-h-[40px]">
                <p className="text-xs text-text-muted">{d.description || 'No description available for this division.'}</p>
              </div>
            </div>

            <div className="pt-6 border-t border-brand-border flex gap-3 mt-auto">
              <button 
                onClick={() => alert('Bootcamps page not connected yet.')}
                className="flex-1 bg-brand-primary border border-brand-border text-brand-accent hover:bg-brand-accent hover:text-white transition-all py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm"
              >
                View Bootcamps
              </button>
              <button 
                onClick={() => handleOpenEdit(d)}
                className="flex-1 bg-brand-primary border border-brand-border text-text-main hover:bg-brand-primary/50 transition-all py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center justify-center group-hover:border-brand-accent/50"
              >
                <Edit size={12} className="mr-2" /> Manage Unit
              </button>
            </div>
          </div>
        ))}
        {filteredDivisions.length === 0 && (
          <div className="col-span-2 text-center py-10 text-text-muted font-black uppercase tracking-widest text-xs">
            No divisions found.
          </div>
        )}
      </div>
      )}

      {/* CREATE / EDIT MODAL */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingId ? "Modify Academic Division" : "Establish New Division"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-2">Division Name</label>
            <input 
              required 
              type="text" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm font-medium focus:border-brand-accent outline-none transition-colors" 
              placeholder="e.g. Software Development" 
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-2">Framework Description</label>
            <textarea 
              rows={4}
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm font-medium focus:border-brand-accent outline-none transition-colors resize-none" 
              placeholder="Describe the department's core focus and activities..." 
            />
          </div>
          
          <div className="pt-6 mt-6 border-t border-brand-border flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-3 rounded-xl border border-brand-border text-text-muted text-[10px] font-black uppercase tracking-widest hover:text-text-main hover:bg-brand-primary/80 transition-colors"
            >
              Cancel
            </button>
            <Button 
              type="submit"
              className="px-6 py-3 shadow-lg shadow-brand-accent/20 flex items-center"
            >
              {editingId ? "Commit Changes" : "Establish Unit"}
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
