import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../app/store';
import { Building2, Activity, Plus, Edit, Trash2, AlertCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { divisionsService } from '@/services/divisions.service';
import { setDivisionsStart, setDivisionsSuccess, setDivisionsFailure } from '@/features/divisions/divisionsSlice';
import { 
  Modal, 
  Button, 
  Card, 
  Badge, 
  EmptyState, 
  FormField, 
  Input, 
  Textarea, 
  Skeleton 
} from '@/components/ui';

export default function DivisionsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { divisions, loading } = useSelector((state: RootState) => state.divisions);
  const { searchTerm } = useSelector((state: RootState) => state.ui);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const roles = user?.roles || [];
  const isSuperAdmin = roles.includes('SUPER ADMIN');
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
        toast.success('Division deleted successfully');
      } catch (err: any) {
        toast.error(err.response?.data?.message || err.message);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await divisionsService.updateDivision(editingId, formData);
        toast.success('Division updated successfully');
      } else {
        await divisionsService.createDivision(formData);
        toast.success('Division created successfully');
      }
      setIsModalOpen(false);
      fetchDivisions();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message;
      toast.error(errorMsg);
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-text-main uppercase tracking-tight">Academic Divisions</h1>
          <p className="text-sm text-text-muted mt-1 font-medium italic">High-level departmental grouping for bootcamp management</p>
        </div>

        {isSuperAdmin && (
          <Button onClick={handleOpenCreate} className="shadow-lg shadow-brand-accent/20">
            <Plus className="mr-2 h-4 w-4" /> Add Division
          </Button>
        )}
      </div>

      {/* CONTENT GRID */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 rounded-2xl" />)}
        </div>
      ) : filteredDivisions.length === 0 ? (
        <EmptyState 
          title="No Divisions Found" 
          description="There are no academic divisions matching your search. Create one to organize your learning units."
          icon={<Building2 />}
          action={isSuperAdmin ? { label: "Create First Division", onClick: handleOpenCreate } : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDivisions.map((d) => (
            <Card key={d._id} className="group h-full overflow-visible border-none bg-white">
              <div className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 rounded-xl bg-brand-primary text-brand-accent shadow-sm group-hover:bg-brand-accent group-hover:text-white transition-colors duration-300">
                    <Building2 size={24} />
                  </div>
                  
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {isSuperAdmin && (
                      <>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-text-muted hover:text-brand-accent" onClick={() => handleOpenEdit(d)}>
                          <Edit size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-text-muted hover:text-red-500" onClick={() => handleDelete(d._id, d.name)}>
                          <Trash2 size={14} />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-text-main group-hover:text-brand-accent transition-colors leading-tight mb-2">
                  {d.name}
                </h3>
                
                <p className="text-sm text-text-muted line-clamp-2 mb-6">
                  {d.description || 'Dedicated academic division for specialized technical training and mentorship.'}
                </p>

                <div className="mt-auto pt-4 border-t border-brand-border flex items-center justify-between">
                  <Button 
                    className="w-full justify-between group/btn"
                    onClick={() => navigate(`/dashboard/${rolePath}/divisions/${d._id}/bootcamps`)}
                  >
                    View Bootcamps
                    <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingId ? "Edit Division" : "New Division"}
        subtitle="Organize your curriculum under a specific departmental unit."
        icon={<Building2 />}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <FormField label="Division Name" required>
            <Input 
              required 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Frontend Engineering" 
            />
          </FormField>

          <FormField label="Description">
            <Textarea 
              rows={4}
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Describe the department's core focus..." 
            />
          </FormField>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {editingId ? "Save Changes" : "Create Division"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
