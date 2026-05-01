import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import { fetchDivisions } from '../../store/divisionSlice';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { FormField } from '../../components/ui/FormField';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Layers, Plus, ExternalLink, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { divisionService } from '../../services/divisions.service';
import { toast } from 'sonner';

export const DivisionsPage = () => {
  const { items: divisions = [], loading } = useSelector((state: RootState) => state.divisions);
  const { user, activeRole } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedDivisionId, setSelectedDivisionId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const openCreateModal = () => {
    setIsEditMode(false);
    setSelectedDivisionId(null);
    setName('');
    setDescription('');
    setIsModalOpen(true);
  };

  const openEditModal = (division: any) => {
    setIsEditMode(true);
    setSelectedDivisionId(division._id);
    setName(division.name);
    setDescription(division.description);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this division?')) return;
    try {
      await divisionService.deleteDivision(id);
      toast.success('Division deleted successfully');
      dispatch(fetchDivisions());
    } catch (err) {
      toast.error('Failed to delete division');
    }
  };

  useEffect(() => {
    dispatch(fetchDivisions());
  }, [dispatch]);

  const isSuperAdmin = activeRole === 'super admin';
  const isAdmin = activeRole === 'admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && selectedDivisionId) {
        await divisionService.updateDivision(selectedDivisionId, { name, description });
        toast.success('Division updated successfully');
      } else {
        await divisionService.createDivision({ name, description });
        toast.success('Division created successfully');
      }
      setIsModalOpen(false);
      dispatch(fetchDivisions());
      setName('');
      setDescription('');
    } catch (error: any) {
      toast.error(isEditMode ? 'Failed to update division' : 'Failed to create division');
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-text-main">
            Our <span className="text-brand-accent">Divisions</span>
          </h1>
          <p className="text-text-muted font-medium mt-1 uppercase text-xs tracking-widest text-shadow-sm">
            Primary organizational units for specialized software training.
          </p>
        </div>
        {isSuperAdmin && (
          <Button onClick={openCreateModal} className="gap-2 shrink-0">
            <Plus size={18} />
            Create Division
          </Button>
        )}
        {isAdmin && (
          <Button onClick={() => toast.info('Please select a division below to create a bootcamp in it.')} className="gap-2 shrink-0">
            <Plus size={18} />
            Create Bootcamp
          </Button>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {divisions.map((division) => (
          <Card key={division._id} onClick={() => navigate(`/dashboard/divisions/${division._id}/bootcamps`)} className="group hover:border-brand-accent transition-all hover:shadow-xl hover:shadow-brand-accent/5 flex flex-col h-full cursor-pointer">
            <CardHeader className="p-8">
              <div className="w-12 h-12 rounded-2xl bg-brand-primary flex items-center justify-center text-brand-accent mb-6 group-hover:bg-brand-accent group-hover:text-white transition-colors">
                <Layers size={24} />
              </div>
              <CardTitle className="mb-2 group-hover:text-brand-accent transition-colors">{division.name}</CardTitle>
              <p className="text-sm text-text-muted font-medium line-clamp-3 leading-relaxed">
                {division.description}
              </p>
            </CardHeader>
            <CardContent className="px-8 pb-8 mt-auto pt-0">
              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                {isSuperAdmin && (
                  <>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-lg hover:bg-brand-secondary/10 hover:text-brand-secondary transition-colors" 
                      onClick={(e) => { e.stopPropagation(); openEditModal(division); }}
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-lg hover:bg-danger/10 hover:text-danger transition-colors" 
                      onClick={(e) => { e.stopPropagation(); handleDelete(division._id); }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? "Edit Division" : "Create New Division"}
        subtitle={isEditMode ? "Update division details" : "Define a new specialized training division"}
        icon={isEditMode ? Edit2 : Plus}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField label="Division Name">
            <Input 
              placeholder="e.g., Web Development Excellence" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </FormField>
          <FormField label="Description">
            <Textarea 
              className="h-32"
              placeholder="What does this division specialize in?" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </FormField>
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1">{isEditMode ? "Save Changes" : "Create Division"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
