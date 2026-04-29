import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../app/store';
import { User, Mail, Shield, Activity, Edit, Plus, Trash2, UserPlus, Search, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usersService } from '@/services/users.service';
import { divisionsService } from '@/services/divisions.service';
import { fetchUsers, createUser, updateUser } from '@/features/users/usersSlice';

import { 
  Button, 
  Modal, 
  Card,
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell,
  Badge,
  Avatar,
  AvatarFallback,
  AvatarImage,
  FormField,
  Input,
  Skeleton,
  EmptyState
} from '@/components/ui';
import { toast } from 'sonner';

export default function UsersPage() {
  const dispatch = useDispatch() as any;
  const { users, loading } = useSelector((state: RootState) => state.users);
  const { searchTerm } = useSelector((state: RootState) => state.ui);
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roles: ['STUDENT'],
    division: '',
    status: 'active'
  });
  const [divisions, setDivisions] = useState<any[]>([]);

  const fetchUsersList = () => {
    dispatch(fetchUsers(undefined));
  };


  useEffect(() => {
    fetchUsersList();
    divisionsService.getDivisions().then(res => {
      const payload = res.data ?? res;
      setDivisions(Array.isArray(payload) ? payload : payload?.data ?? []);
    }).catch(() => setDivisions([]));
  }, [dispatch]);


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('createAdmin') === 'true' && (currentUser?.roles || []).includes('SUPER ADMIN')) {
      handleOpenCreate('ADMIN');
    }
  }, [location, currentUser]);

  const filteredUsers = (users || []).filter((u) => 
    (u.name || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
    (u.email || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
    (u.role || '').toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  const handleOpenCreate = (forcedRole?: string) => {
    setEditingUserId(null);
    const defaultRoles = forcedRole ? [forcedRole] : ((currentUser?.roles || []).includes('SUPER ADMIN') ? ['ADMIN'] : ['STUDENT']);
    setFormData({ name: '', email: '', password: '', roles: defaultRoles, division: '', status: 'active' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: any) => {
    setEditingUserId(user._id);
    setFormData({ 
      name: user.name, 
      email: user.email, 
      password: '', 
      roles: user.roles || (user.role ? [String(user.role).toUpperCase()] : ['STUDENT']),
      division: user.division || user.divisionId || '',
      status: user.status || 'active'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUserId) {
        const payload = { ...formData };
        if (!payload.password) delete (payload as any).password;
        const result = await dispatch(updateUser({ id: editingUserId, data: payload }));
        if (updateUser.fulfilled.match(result)) {
            toast.success('User updated successfully');
            setIsModalOpen(false);
        } else {
            toast.error(result.payload as string || 'Update failed');
        }
      } else {
        const primaryRole = formData.roles[0] || 'STUDENT';
        const payload = { ...formData, role: primaryRole };
        const result = await dispatch(createUser(payload));
        if (createUser.fulfilled.match(result)) {
            toast.success('User provisioned successfully');
            setIsModalOpen(false);
        } else {
            toast.error(result.payload as string || 'Provisioning failed');
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message);
    }
  };


  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return <Badge variant="success" className="bg-emerald-50 text-emerald-600 border-emerald-100 uppercase text-[9px] tracking-widest px-2">Active</Badge>;
      case 'suspended': return <Badge variant="destructive" className="uppercase text-[9px] tracking-widest px-2">Suspended</Badge>;
      default: return <Badge variant="secondary" className="uppercase text-[9px] tracking-widest px-2">{status || 'Pending'}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    const r = (role || 'Student').toUpperCase();
    if (r === 'ADMIN' || r === 'SUPER ADMIN') return <span className="text-[10px] font-black text-brand-accent tracking-widest">{r}</span>;
    if (r === 'INSTRUCTOR') return <span className="text-[10px] font-black text-violet-600 tracking-widest">{r}</span>;
    return <span className="text-[10px] font-bold text-text-muted tracking-widest">{r}</span>;
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-text-main uppercase tracking-tight">User Directory</h1>
          <p className="text-sm text-text-muted mt-1 font-medium italic">Identity provisioning and access control systems</p>
        </div>

        <Button onClick={() => handleOpenCreate()} className="shadow-lg shadow-brand-accent/20">
          <Plus className="mr-2 h-4 w-4" /> Provision New User
        </Button>
      </div>

      {/* TABLE SECTION */}
      <Card className="overflow-hidden border-none shadow-sm bg-white">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
          </div>
        ) : filteredUsers.length === 0 ? (
          <EmptyState 
            title="No Users Found" 
            description="Your search criteria did not match any users in the directory."
            icon={<User />}
          />
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <Table>
              <TableHeader className="bg-brand-primary/30">
                <TableRow>
                  <TableHead className="w-[300px]">Profile Identity</TableHead>
                  <TableHead>System Access</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((u) => (
                  <TableRow key={u._id} className="hover:bg-brand-primary/10 transition-colors group">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-brand-border">
                          <AvatarFallback className="bg-brand-primary text-brand-accent font-bold text-xs uppercase">
                            {u.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-bold text-text-main text-sm tracking-tight">{u.name}</span>
                          <span className="text-[11px] text-text-muted">{u.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(u.role)}</TableCell>
                    <TableCell>
                      <span className="text-xs font-semibold text-text-muted uppercase tracking-tight">
                        {u.division || 'Unassigned'}
                      </span>
                    </TableCell>
                    <TableCell>{getStatusBadge(u.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-text-muted hover:text-brand-accent" onClick={() => handleOpenEdit(u)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* USER MODAL */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingUserId ? "Modify Identity" : "Provision Identity"}
        subtitle="Manage user access rights, roles, and departmental assignments."
        icon={<UserPlus />}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Legal Name" required>
            <Input 
              required 
              value={formData.name} 
              onChange={e => setFormData(prev => ({...prev, name: e.target.value}))}
              placeholder="e.g. John Doe" 
            />
          </FormField>
          
          <FormField label="Educational Email" required>
            <Input 
              required 
              type="email" 
              value={formData.email} 
              onChange={e => setFormData(prev => ({...prev, email: e.target.value}))}
              placeholder="j.doe@scholar.astu" 
            />
          </FormField>

          <FormField label={editingUserId ? "New Identity Key (Optional)" : "Identity Key"} required={!editingUserId}>
            <Input 
              type="password" 
              value={formData.password} 
              onChange={e => setFormData(prev => ({...prev, password: e.target.value}))}
              placeholder="••••••••" 
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Role Path">
              <div className="flex flex-col gap-2 pt-1">
                {['STUDENT', 'INSTRUCTOR', 'ADMIN'].map((r) => (
                  <label key={r} className="inline-flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="rounded border-brand-border text-brand-accent focus:ring-brand-accent"
                      checked={formData.roles.includes(r)} 
                      onChange={() => {
                        setFormData(prev => {
                          const has = prev.roles.includes(r);
                          return {...prev, roles: has ? prev.roles.filter(role => role !== r) : [...prev.roles, r]};
                        });
                      }} 
                    />
                    <span className="text-xs font-bold text-text-main uppercase tracking-widest">{r}</span>
                  </label>
                ))}
              </div>
            </FormField>

            <div className="space-y-4">
              <FormField label="Division Unit">
                <select 
                  value={formData.division} 
                  onChange={e => setFormData(prev => ({...prev, division: e.target.value}))} 
                  className="w-full px-3 py-2 rounded-lg bg-brand-primary/40 border border-transparent text-sm font-medium outline-none focus:border-brand-accent transition-all appearance-none"
                >
                  <option value="">Unassigned</option>
                  {divisions.map(d => (<option key={d._id || d.id} value={d._id || d.id}>{d.name}</option>))}
                </select>
              </FormField>

              <FormField label="Lifecycle Status">
                <select 
                  value={formData.status} 
                  onChange={e => setFormData(prev => ({...prev, status: e.target.value}))}
                  className="w-full px-3 py-2 rounded-lg bg-brand-primary/40 border border-transparent text-sm font-medium outline-none focus:border-brand-accent transition-all appearance-none"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="graduated">Graduated</option>
                </select>
              </FormField>
            </div>
          </div>
          
          <div className="flex gap-3 pt-6 border-t border-brand-border mt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 shadow-lg shadow-brand-accent/20">
              {editingUserId ? "Update Identity" : "Deploy Provisioning"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
