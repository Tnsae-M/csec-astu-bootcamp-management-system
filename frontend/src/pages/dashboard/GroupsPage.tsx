import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import { groupService } from '../../services/all_others.service';
import { Group, User } from '../../types';
import { 
  Users, 
  UserPlus, 
  Shield, 
  IdCard, 
  MoreVertical,
  Plus,
  Edit2,
  Trash2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { toast } from 'sonner';
import { fetchBootcamps } from '../../store/bootcampSlice';
import { fetchUsers } from '../../store/userSlice';
import { Modal } from '../../components/ui/Modal';
import { FormField } from '../../components/ui/FormField';
import { Input } from '../../components/ui/Input';

export const GroupsPage = () => {
  const { user, activeRole } = useSelector((state: RootState) => state.auth);
  const { items: bootcamps = [] } = useSelector((state: RootState) => state.bootcamps);
  const { users = [] } = useSelector((state: RootState) => state.users);
  const dispatch = useDispatch<AppDispatch>();

  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBootcampId, setSelectedBootcampId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    bootcampId: '',
    mentor: '',
    members: [] as string[]
  });
  useEffect(() => {
    dispatch(fetchBootcamps());
    dispatch(fetchUsers({}));
  }, [dispatch]);

  useEffect(() => {
    const fetchGroups = async () => {
      if (!selectedBootcampId && bootcamps.length > 0) {
        setSelectedBootcampId(bootcamps[0]._id);
        return;
      }
      if (!selectedBootcampId) return;
      try {
        setLoading(true);
        const res = await groupService.getBootcampGroups(selectedBootcampId);
        setGroups(res.data);
      } catch (err) {
        toast.error('Failed to load groups');
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, [selectedBootcampId, bootcamps]);

  const handleMemberToggle = (id: string) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.includes(id) 
        ? prev.members.filter(m => m !== id)
        : [...prev.members, id]
    }));
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await groupService.updateGroup(selectedGroupId, formData);
        toast.success('Group updated successfully');
      } else {
        await groupService.createGroup(formData);
        toast.success('Group created successfully');
      }
      setIsModalOpen(false);
      setFormData({ name: '', bootcampId: '', mentor: '', members: [] });
      if (selectedBootcampId === formData.bootcampId) {
        const res = await groupService.getBootcampGroups(selectedBootcampId);
        setGroups(res.data);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save group');
    }
  };

  const handleDeleteGroup = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this group?')) return;
    try {
      await groupService.deleteGroup(id);
      toast.success('Group deleted successfully');
      setGroups(groups.filter(g => g._id !== id));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete group');
    }
  };

  const openCreateModal = () => {
    setIsEditMode(false);
    setSelectedGroupId('');
    setFormData({ name: '', bootcampId: selectedBootcampId || '', mentor: '', members: [] });
    setIsModalOpen(true);
  };

  const openEditModal = (group: any) => {
    setIsEditMode(true);
    setSelectedGroupId(group._id);
    setFormData({
      name: group.name,
      bootcampId: group.bootcampId || selectedBootcampId,
      mentor: group.mentor?._id || group.mentor || '',
      members: group.members.map((m: any) => m._id || m)
    });
    setIsModalOpen(true);
  };

  const availableMentors = users.filter(u => u.role.includes('instructor') || u.role.includes('admin') || u.role.includes('super admin'));
  const availableStudents = users.filter(u => u.role.includes('student'));

  const isAdmin = activeRole === 'admin' || activeRole === 'super admin';
  const isManagementRole = isAdmin || activeRole === 'instructor';

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">Group Management</h1>
          <p className="text-text-muted font-medium mt-2">Manage collaborative squads and mentoring assignments.</p>
        </div>
        {isManagementRole && (
          <Button size="lg" className="bg-brand-accent hover:bg-brand-accent/90" onClick={openCreateModal}>
            <Plus className="mr-2" size={18} />
            Create Group
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4 border-b border-brand-border pb-4">
        <span className="text-xs font-black uppercase text-text-muted">Filter by Bootcamp:</span>
        <select 
          className="bg-brand-primary border border-brand-border rounded-xl px-4 py-2 text-sm focus:border-brand-accent outline-none font-black uppercase tracking-widest"
          value={selectedBootcampId}
          onChange={(e) => setSelectedBootcampId(e.target.value)}
        >
          {bootcamps.map(b => (
            <option key={b._id} value={b._id}>{b.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-brand-card border border-brand-border rounded-2xl" />
          ))}
        </div>
      ) : groups.length === 0 ? (
        <Card className="border-dashed border-2 py-20 text-center">
          <Users className="mx-auto text-text-muted mb-4 opacity-20" size={64} />
          <h3 className="text-xl font-bold">No Groups Found</h3>
          <p className="text-text-muted">No collaborative groups have been established yet.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map(group => (
            <Card key={group._id} className="overflow-hidden bg-brand-card hover:border-brand-accent transition-all group">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                    <Shield size={24} />
                  </div>
                  {isManagementRole && (
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0 hover:text-brand-accent hover:border-brand-accent" onClick={() => openEditModal(group)}>
                        <Edit2 size={14} />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0 hover:text-brand-danger hover:border-brand-danger" onClick={() => handleDeleteGroup(group._id)}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  )}
                </div>
                <CardTitle className="mt-4 text-2xl font-black uppercase tracking-tight">{group.name}</CardTitle>
                <p className="text-xs font-black uppercase tracking-widest text-text-muted">Group Squad</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Mentor</p>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-brand-bg border border-brand-border">
                    <div className="w-8 h-8 rounded-lg bg-brand-accent/20 flex items-center justify-center text-brand-accent">
                      <IdCard size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-bold truncate">{group.mentor?.name || 'No Mentor Assigned'}</p>
                      <p className="text-[10px] text-text-muted font-medium uppercase tracking-widest">Assigned Mentor</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Members ({group.members.length})</p>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">2–8 Required</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.members.map((member: any) => (
                      <div key={member._id} className="group relative">
                        <div className="w-10 h-10 rounded-full bg-brand-accent/10 border-2 border-brand-card flex items-center justify-center text-brand-accent font-black text-xs ring-1 ring-brand-border cursor-help">
                          {member.name?.charAt(0) || '?'}
                        </div>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-brand-sidebar text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 font-bold">
                          {member.name}
                        </div>
                      </div>
                    ))}
                    {isAdmin && (
                      <button className="w-10 h-10 rounded-full border-2 border-dashed border-brand-border flex items-center justify-center text-text-muted hover:border-brand-accent hover:text-brand-accent transition-colors">
                        <UserPlus size={16} />
                      </button>
                    )}
                  </div>
                  <div className="mt-4 pt-4 border-t border-brand-border grid grid-cols-2 gap-2">
                     {group.members.map((m: any) => (
                       <span key={m._id} className="text-[10px] font-bold text-text-muted truncate">• {m.name}</span>
                     ))}
                  </div>
                </div>


              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? "Edit Group" : "Create New Group"}
        subtitle={isEditMode ? "Update group details" : "Form a new collaborative squad"}
        icon={Users}
      >
        <form onSubmit={handleCreateGroup} className="space-y-6">
          <FormField label="Group Name">
            <Input 
              placeholder="e.g. Alpha Squad" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </FormField>
          
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Bootcamp">
              <select 
                className="w-full h-12 rounded-xl border border-brand-border bg-brand-primary/50 px-4 py-2 text-sm focus:border-brand-accent outline-none font-black uppercase tracking-widest"
                value={formData.bootcampId}
                onChange={(e) => setFormData({ ...formData, bootcampId: e.target.value })}
                required
              >
                <option value="">-- Select Bootcamp --</option>
                {bootcamps.map(b => (
                  <option key={b._id} value={b._id}>{b.name}</option>
                ))}
              </select>
            </FormField>
            
            <FormField label="Assign Mentor">
              <select 
                className="w-full h-12 rounded-xl border border-brand-border bg-brand-primary/50 px-4 py-2 text-sm focus:border-brand-accent outline-none font-black uppercase tracking-widest"
                value={formData.mentor}
                onChange={(e) => setFormData({ ...formData, mentor: e.target.value })}
              >
                <option value="">-- Select Mentor --</option>
                {availableMentors.map(m => (
                  <option key={m._id} value={m._id}>{m.name}</option>
                ))}
              </select>
            </FormField>
          </div>

          <FormField label="Assign Members (Students)">
             <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border border-brand-border rounded-xl bg-brand-primary/20">
               {availableStudents.length === 0 ? (
                 <p className="text-xs text-text-muted italic">No students available.</p>
               ) : availableStudents.map(student => (
                 <label key={student._id} className="flex items-center gap-2 bg-brand-primary p-2 rounded-lg cursor-pointer hover:bg-brand-primary/80 border border-brand-border">
                   <input 
                     type="checkbox"
                     checked={formData.members.includes(student._id)}
                     onChange={() => handleMemberToggle(student._id)}
                     className="w-4 h-4 rounded text-brand-accent focus:ring-brand-accent"
                   />
                   <span className="text-xs font-black uppercase tracking-widest">{student.name}</span>
                 </label>
               ))}
             </div>
          </FormField>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1">Create Group</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};