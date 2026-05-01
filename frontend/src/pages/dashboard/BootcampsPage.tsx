import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../../app/store';
import { fetchDivisionBootcamps } from '../../store/bootcampSlice';
import { fetchUsers } from '../../store/userSlice';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { FormField } from '../../components/ui/FormField';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Layout, Plus, Calendar, Users, MapPin, Edit2, Trash2 } from 'lucide-react';
import { divisionService, bootcampService } from '../../services/divisions.service';
import { toast } from 'sonner';
import { format } from 'date-fns';

export const BootcampsPage = () => {
  const { divisionId } = useParams<{ divisionId: string }>();
  const { items: bootcamps = [], loading } = useSelector((state: RootState) => state.bootcamps);
  const { user, activeRole } = useSelector((state: RootState) => state.auth);
  const { users = [] } = useSelector((state: RootState) => state.users);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [division, setDivision] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedBootcampId, setSelectedBootcampId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('upcoming');
  const [instructors, setInstructors] = useState<string[]>([]);

  useEffect(() => {
    if (divisionId) {
      dispatch(fetchDivisionBootcamps(divisionId));
      divisionService.getDivision(divisionId).then(res => setDivision(res.data));
    }
    dispatch(fetchUsers({}));
  }, [dispatch, divisionId]);

  const isAdmin = activeRole === 'admin' || activeRole === 'super admin';
  const isManagementRole = isAdmin || activeRole === 'instructor';
  const availableInstructors = users.filter(u => u.role.includes('instructor') || u.role.includes('admin') || u.role.includes('super admin'));

  const openCreateModal = () => {
    setIsEditMode(false);
    setSelectedBootcampId(null);
    setName('');
    setStartDate('');
    setEndDate('');
    setStatus('upcoming');
    setInstructors([]);
    setIsModalOpen(true);
  };

  const openEditModal = (bootcamp: any) => {
    setIsEditMode(true);
    setSelectedBootcampId(bootcamp._id);
    setName(bootcamp.name);
    setStartDate(format(new Date(bootcamp.startDate), 'yyyy-MM-dd'));
    setEndDate(format(new Date(bootcamp.endDate), 'yyyy-MM-dd'));
    setStatus(bootcamp.status);
    setInstructors(bootcamp.instructors.map((i: any) => i._id || i));
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this bootcamp?')) return;
    try {
      await bootcampService.deleteBootcamp(id);
      toast.success('Bootcamp deleted successfully');
      dispatch(fetchDivisionBootcamps(divisionId!));
    } catch (err) {
      toast.error('Failed to delete bootcamp');
    }
  };

  const handleInstructorToggle = (id: string) => {
    setInstructors(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!divisionId) return;
    const payload = { name, startDate, endDate, status, instructors };
    try {
      if (isEditMode && selectedBootcampId) {
        await bootcampService.updateBootcamp(selectedBootcampId, payload);
        toast.success('Bootcamp updated successfully');
      } else {
        await divisionService.createDivisionBootcamp(divisionId, payload);
        toast.success('Bootcamp created successfully');
      }
      setIsModalOpen(false);
      dispatch(fetchDivisionBootcamps(divisionId));
    } catch (error: any) {
      toast.error(isEditMode ? 'Failed to update bootcamp' : 'Failed to create bootcamp');
    }
  };

  const visibleBootcamps = bootcamps;

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black uppercase text-text-muted hover:text-brand-accent cursor-pointer" onClick={() => navigate('/dashboard/divisions')}>Divisions</span>
            <span className="text-[10px] font-black uppercase text-text-muted">/</span>
            <span className="text-[10px] font-black uppercase text-brand-accent">{division?.name}</span>
          </nav>
          <h1 className="text-3xl font-black uppercase tracking-tight text-text-main">
            Bootcamp <span className="text-brand-accent">Programs</span>
          </h1>
          <p className="text-text-muted font-medium mt-1 uppercase text-xs tracking-widest">
            Intensive professional training cycles for {division?.name}.
          </p>
        </div>
        {isAdmin && (
          <Button onClick={openCreateModal} className="gap-2">
            <Plus size={18} />
            New Bootcamp
          </Button>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {visibleBootcamps.map((bootcamp) => (
          <Card key={bootcamp._id} className="overflow-hidden group hover:border-brand-accent transition-all cursor-pointer" onClick={() => navigate(`/dashboard/divisions/${divisionId}/bootcamps/${bootcamp._id}`)}>
            <CardHeader className="p-0 border-b border-brand-border">
              <div className="bg-brand-primary h-32 flex items-center justify-center text-brand-accent group-hover:bg-brand-accent/5 transition-colors">
                <Layout size={48} strokeWidth={1} />
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-4">
                <CardTitle>{bootcamp.name}</CardTitle>
                <Badge variant={bootcamp.status === 'active' ? 'success' : bootcamp.status === 'upcoming' ? 'secondary' : 'outline'}>
                  {bootcamp.status}
                </Badge>
              </div>
              
              <div className="space-y-3 mb-6 flex-1">
                <div className="flex items-center gap-3 text-sm text-text-muted font-medium">
                  <Calendar size={16} className="text-brand-accent" />
                  <span>{format(new Date(bootcamp.startDate), 'MMM d, yyyy')} — {format(new Date(bootcamp.endDate), 'MMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-text-muted font-medium">
                  <Users size={16} className="text-brand-secondary" />
                  <span>{bootcamp.instructors?.length || 0} Instructors Assigned</span>
                </div>
              </div>

              {isAdmin && (
                <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-brand-border opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-lg hover:bg-brand-secondary/10 hover:text-brand-secondary transition-colors" 
                    onClick={(e) => { e.stopPropagation(); openEditModal(bootcamp); }}
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-lg hover:bg-danger/10 hover:text-danger transition-colors" 
                    onClick={(e) => { e.stopPropagation(); handleDelete(bootcamp._id); }}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              )}            </CardContent>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? "Edit Bootcamp" : "Start New Bootcamp"}
        subtitle={isEditMode ? "Update cohort details" : "Schedule a new training cohort"}
        icon={Layout}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField label="Program Name">
            <Input placeholder="e.g., Full Stack 2026 Q1" value={name} onChange={(e) => setName(e.target.value)} required />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Start Date">
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
            </FormField>
            <FormField label="End Date">
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
            </FormField>
          </div>
          <FormField label="Status">
            <select 
              className="w-full h-12 rounded-xl border border-brand-border bg-brand-primary/50 px-4 py-2 text-sm focus:border-brand-accent outline-none font-black uppercase tracking-widest"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="upcoming">Upcoming</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </FormField>
          <FormField label="Assign Instructors">
             <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border border-brand-border rounded-xl bg-brand-primary/20">
               {availableInstructors.length === 0 ? (
                 <p className="text-xs text-text-muted italic">No instructors available.</p>
               ) : availableInstructors.map(inst => (
                 <label key={inst._id} className="flex items-center gap-2 bg-brand-primary p-2 rounded-lg cursor-pointer hover:bg-brand-primary/80 border border-brand-border">
                   <input 
                     type="checkbox"
                     checked={instructors.includes(inst._id)}
                     onChange={() => handleInstructorToggle(inst._id)}
                     className="w-4 h-4 rounded text-brand-accent focus:ring-brand-accent"
                   />
                   <span className="text-xs font-black uppercase tracking-widest">{inst.name}</span>
                 </label>
               ))}
             </div>
          </FormField>
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1">{isEditMode ? "Save Changes" : "Create Bootcamp"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
