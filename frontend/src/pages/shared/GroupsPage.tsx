import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../app/store';
import { Users2, BadgeCheck, BookOpen, UserPlus, Trash2 } from 'lucide-react';
import { groupsService } from '../../services/groups.service';
import { bootcampsService } from '../../services/bootcamps.service';
import { usersService } from '../../services/users.service';
import { 
  fetchGroupsByBootcamp, 
  createGroupAsync, 
  deleteGroupAsync 
} from '../../features/groups/groupsSlice';
import { toast } from 'sonner';
import { Modal, Button } from '../../components/ui';


export default function GroupsPage() {
  const dispatch = useDispatch() as any;
  const { groups, loading } = useSelector((state: RootState) => state.groups);
  const { user } = useSelector((state: RootState) => state.auth);
  const { searchTerm } = useSelector((state: RootState) => state.ui);

  const [bootcamps, setBootcamps] = useState<any[]>([]);
  const [selectedBootcampId, setSelectedBootcampId] = useState('');
  const [instructors, setInstructors] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  const [formData, setFormData] = useState({ name: '', mentor: '', members: [] as string[] });
  const [activeGroupId, setActiveGroupId] = useState('');
  const [newMemberId, setNewMemberId] = useState('');

  const userRoles = (user?.roles || (user?.role ? [user.role] : [])).map(r => r.toUpperCase());
  const isAdminOrInst = userRoles.some((r: string) => ['ADMIN', 'INSTRUCTOR'].includes(r));

  useEffect(() => {
    bootcampsService.getBootcamps().then(res => {
      const data = res.data || [];
      setBootcamps(data);
      if (data.length > 0) setSelectedBootcampId(data[0]._id);
    });

    usersService.getUsers().then(res => {
      const all = res.data || [];
      setInstructors(all.filter((u: any) => {
          const uRoles = (u.roles || [u.role]).map((r: string) => r.toUpperCase());
          return uRoles.includes('ADMIN') || uRoles.includes('INSTRUCTOR') || uRoles.includes('SUPER ADMIN');
      }));
      setStudents(all.filter((u: any) => (u.roles || [u.role]).map((s: string) => s.toUpperCase()).includes('STUDENT')));
    });
  }, []);

  const fetchGroupsList = () => {
    if (!selectedBootcampId) return;
    dispatch(fetchGroupsByBootcamp(selectedBootcampId));
  };

  useEffect(() => {
    fetchGroupsList();
  }, [selectedBootcampId]);


  const filteredInstructors = instructors.filter((inst: any) => {
    if (!selectedBootcampId) return true;
    const instBootcamps = (inst.bootcamps || []).map((bc: any) => bc.bootcampId?._id || bc.bootcampId || bc);
    return instBootcamps.includes(selectedBootcampId);
  });

  const filteredStudents = students.filter((s: any) => {
    if (!selectedBootcampId) return true;
    const sBootcamps = (s.bootcamps || []).map((bc: any) => bc.bootcampId?._id || bc.bootcampId || bc);
    return sBootcamps.includes(selectedBootcampId);
  });

  const filteredGroups = groups.filter(g =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateGroup = async (e: any) => {
    e.preventDefault();
    try {
        const result = await dispatch(createGroupAsync({ ...formData, bootcampId: selectedBootcampId }));
        if (createGroupAsync.fulfilled.match(result)) {
            setIsModalOpen(false);
            setFormData({ name: '', mentor: '', members: [] });
            toast.success('Group initialized successfully');
            fetchGroupsList();
        } else {
            toast.error((result.payload as string) || 'Failed to create group');
        }
    } catch (err: any) {
        toast.error(err.response?.data?.message || err.message);
    }
  };

  const handleAddMember = async (e: any) => {
    e.preventDefault();
    try {
        await groupsService.addMember(activeGroupId, { userId: newMemberId, bootcampId: selectedBootcampId });
        setIsMemberModalOpen(false);
        toast.success('Member added successfully');
        fetchGroupsList();
    } catch (err: any) {
        toast.error(err.response?.data?.message || err.message);
    }
  };


  const handleRemoveMember = async (gid: string, sid: string) => {
    if(window.confirm('Remove student from group?')) {
        try {
            await groupsService.removeMember(gid, sid);
            toast.success('Member removed');
            fetchGroupsList();
        } catch (err: any) {
            toast.error(err.response?.data?.message || err.message);
        }
    }
  };

  const handleDeleteGroup = async (gid: string) => {
    if(window.confirm('Delete this group entirely?')) {
        try {
            const result = await dispatch(deleteGroupAsync(gid));
            if (deleteGroupAsync.fulfilled.match(result)) {
                toast.success('Group terminated');
            } else {
                toast.error((result.payload as string) || 'Delete failed');
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || err.message);
        }
    }
  };


  const toggleMemberSelection = (id: string) => {
    setFormData(prev => ({
        ...prev,
        members: prev.members.includes(id) 
            ? prev.members.filter(m => m !== id)
            : [...prev.members, id]
    }));
  };

  return (
    <div className="space-y-8 selection:bg-brand-accent selection:text-white">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-brand-accent uppercase tracking-tighter">Synergy Groups</h1>
          <p className="text-text-muted font-bold text-xs uppercase tracking-[0.2em] mt-2">Collaborative squads & mentorship units</p>
        </div>
        <div className="flex gap-4">
            <select 
                className="bg-brand-primary border border-brand-border text-text-main text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg outline-none focus:border-brand-accent"
                value={selectedBootcampId}
                onChange={e => setSelectedBootcampId(e.target.value)}
            >
                {bootcamps.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
            {isAdminOrInst && (
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-brand-accent text-white px-6 py-2 rounded-lg font-black uppercase tracking-widest text-[10px] flex items-center hover:bg-brand-accent/90 transition-colors shadow-lg shadow-brand-accent/20"
                >
                    <UserPlus size={14} className="mr-2" /> New Group
                </button>
            )}
        </div>
      </div>

      {loading ? (
           <div className="text-center py-20 font-black uppercase text-brand-accent animate-pulse tracking-widest">Initalizing Group Data...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGroups.map(g => (
            <div key={g._id} className="geo-card p-8 group hover:border-brand-accent/30 transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-6">
                    <div className="w-10 h-10 bg-white border border-brand-border rounded-xl flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-white transition-all">
                        <Users2 size={20} />
                    </div>
                    {isAdminOrInst && (
                        <button onClick={() => handleDeleteGroup(g._id)} className="text-text-muted hover:text-red-500 transition-colors p-1">
                            <Trash2 size={14} />
                        </button>
                    )}
                </div>
                <h3 className="text-xl font-black text-text-main uppercase tracking-tight mb-1">{g.name}</h3>
                <p className="text-[10px] font-bold text-brand-accent uppercase tracking-[0.2em] mb-6 flex items-center">
                    <BadgeCheck size={12} className="mr-1" /> Mentor: {g.mentor?.name || 'Unassigned'}
                </p>
                
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {g.members?.map((m: any) => (
                        <div key={m._id} className="flex justify-between items-center bg-brand-primary/40 border border-brand-border/50 p-3 rounded-xl group/item">
                            <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 rounded-full bg-white border border-brand-border flex items-center justify-center text-[8px] font-black text-brand-accent uppercase">
                                    {m.name.charAt(0)}
                                </div>
                                <span className="text-[10px] font-bold text-text-main uppercase">{m.name}</span>
                            </div>
                            {isAdminOrInst && (
                                <button onClick={() => handleRemoveMember(g._id, m._id)} className="text-text-muted hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                    <Trash2 size={10} />
                                </button>
                            )}
                        </div>
                    ))}
                    {(!g.members || g.members.length === 0) && (
                        <p className="text-[9px] font-bold text-text-muted uppercase italic py-4 text-center">No operatives assigned yet</p>
                    )}
                </div>
              </div>

              {isAdminOrInst && (
                <button 
                    onClick={() => { setActiveGroupId(g._id); setIsMemberModalOpen(true); }}
                    className="mt-8 w-full border border-brand-border text-text-muted hover:text-brand-accent hover:border-brand-accent py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all bg-transparent"
                >
                    Reinforce Group
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* CREATE GROUP MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Initialize Synergy Group">
        <form onSubmit={handleCreateGroup} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Group Designation</label>
            <input
                required
                className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm font-medium focus:border-brand-accent outline-none transition-colors"
                placeholder="e.g. Alpha Squad"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Primary Mentor</label>
            <select
                required
                className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm font-medium outline-none focus:border-brand-accent transition-colors"
                value={formData.mentor}
                onChange={e => setFormData({ ...formData, mentor: e.target.value })}
            >
                <option value="">Select Mentor</option>
                {filteredInstructors.map(i => <option key={i._id} value={i._id}>{i.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Assign Operatives ({formData.members.length})</label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border border-brand-border rounded-xl bg-brand-primary/30 custom-scrollbar">
                {filteredStudents.map(s => (
                    <div 
                        key={s._id} 
                        onClick={() => toggleMemberSelection(s._id)}
                        className={`p-2 rounded-lg text-[9px] font-bold uppercase cursor-pointer transition-all border ${
                            formData.members.includes(s._id) 
                            ? 'bg-brand-accent text-white border-brand-accent' 
                            : 'bg-white text-text-main border-brand-border hover:border-brand-accent'
                        }`}
                    >
                        {s.name}
                    </div>
                ))}
            </div>
          </div>

          <div className="pt-4 border-t border-brand-border flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Abort</Button>
              <Button type="submit">Deploy Group</Button>
          </div>
        </form>
      </Modal>

      {/* ADD MEMBER MODAL */}
      <Modal isOpen={isMemberModalOpen} onClose={() => setIsMemberModalOpen(false)} title="Add Group Member">
        <form onSubmit={handleAddMember} className="space-y-6">
          <select 
            className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm font-medium outline-none focus:border-brand-accent transition-colors"
            onChange={e => setNewMemberId(e.target.value)}
          >
            <option value="">Select Student</option>
            {filteredStudents.map(s => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
          <div className="flex justify-end">
            <Button type="submit">Confirm Addition</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

