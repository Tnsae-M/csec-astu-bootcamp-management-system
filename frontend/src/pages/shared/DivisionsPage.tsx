import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../app/store';
import { Building2, Activity, Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { divisionsService } from '../../services/divisions.service';
import { setDivisionsStart, setDivisionsSuccess, setDivisionsFailure } from '../../features/divisions/divisionsSlice';
import { Modal, Button } from '../../components/ui';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/card';

export default function DivisionsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { divisions, loading } = useSelector((state: RootState) => state.divisions);
  const { searchTerm } = useSelector((state: RootState) => state.ui);
  const { user } = useSelector((state: RootState) => state.auth);
  const roles = user?.roles || [];
  const isAdmin = roles.includes('ADMIN') || roles.includes('SUPER ADMIN');
  const rolePath = roles.includes('INSTRUCTOR') ? 'instructor' : 'student';

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
      const errorMsg = err.response?.data?.message || err.message;
      if (errorMsg.toLowerCase().includes('exist') || errorMsg.toLowerCase().includes('duplicate')) {
        toast.error('Division already exists', {
          icon: <AlertCircle className="w-4 h-4" />
        });
      } else {
        toast.error(errorMsg);
      }
    }
  };

  return (
    <div className="space-y-8 selection:bg-brand-accent selection:text-white">
      <div className="flex justify-between items-center pr-4">
        <div>
          <h1 className="text-4xl font-black text-brand-accent uppercase tracking-tighter">Academic Divisions</h1>
          <p className="text-text-muted font-bold text-xs uppercase tracking-[0.2em] mt-2">Departmental Framework & Oversight</p>
        </div>
        {isAdmin && (
          <button 
            onClick={handleOpenCreate}
            className="bg-brand-accent text-white px-6 py-3 rounded-lg font-black uppercase tracking-widest text-xs flex items-center hover:bg-brand-accent/90 transition-colors shadow-lg shadow-brand-accent/20"
          >
            <Plus size={16} className="mr-2" /> Add Division
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center text-text-muted font-bold uppercase py-10">Loading Divisions...</div>
      ) : (

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDivisions.map((d) => (
          <Card key={d._id} className="flex flex-col h-full hover:border-brand-accent transition-colors shadow-sm">
            <CardHeader className="flex flex-col space-y-1.5 pb-4">
              <div className="flex justify-between items-start mb-2">
                <div className="w-10 h-10 rounded-lg bg-brand-accent/10 text-brand-accent flex items-center justify-center">
                  <Building2 size={20} />
                </div>
                <div className="flex items-center space-x-1 bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                  <Activity size={10} /> <span>ACTIVE</span>
                </div>
              </div>
              <CardTitle className="text-xl font-bold">
                {d.name}
              </CardTitle>
              <CardDescription className="line-clamp-2 text-sm text-text-muted mt-1">
                {d.description || 'No description available for this division.'}
              </CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto pt-4 flex gap-2">
              <Button 
                variant="outline"
                className="flex-1 text-xs h-9 bg-transparent border-brand-border text-brand-accent hover:bg-brand-accent hover:text-white"
                onClick={() => navigate(`/dashboard/${rolePath}/divisions/${d._id}/bootcamps`)}
              >
                View Bootcamps
              </Button>
              {isAdmin && (
                <>
                  <Button 
                    variant="outline"
                    className="w-10 h-9 p-0 flex-shrink-0 bg-transparent border-brand-border hover:bg-brand-primary/50 text-text-main"
                    onClick={() => handleOpenEdit(d)}
                  >
                    <Edit size={14} />
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-10 h-9 p-0 flex-shrink-0 bg-transparent border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() => handleDelete(d._id, d.name)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
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
