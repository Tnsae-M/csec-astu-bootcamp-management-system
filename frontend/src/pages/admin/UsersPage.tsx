import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../app/store';
import { User, Mail, Shield, Activity, Edit, Plus, Trash2, UserPlus } from 'lucide-react';
import { cn } from '../../lib/utils';
import { usersService } from '../../services/users.service';
import { divisionsService } from '../../services/divisions.service';
import { setUsersStart, setUsersSuccess, setUsersFailure } from '../../features/users/usersSlice';
import { Button, Modal, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui';

export default function UsersPage() {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state: RootState) => state.users);
  const { searchTerm } = useSelector((state: RootState) => state.ui);
  const { user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    // support multiple roles for backend integration (use uppercase role tokens)
    roles: ['STUDENT'],
    division: '',
    status: 'active'
  });
  const [divisions, setDivisions] = useState<any[]>([]);

  const fetchUsers = () => {
    dispatch(setUsersStart());
    usersService.getUsers()
      .then(res => {
        dispatch(setUsersSuccess(res.data || []));
      })
      .catch(err => dispatch(setUsersFailure(err.message)));
  };

  useEffect(() => {
    fetchUsers();
  }, [dispatch]);

  useEffect(() => {
    divisionsService.getDivisions().then(res => {
      const payload = res.data ?? res;
      const list = Array.isArray(payload) ? payload : payload?.data ?? [];
      setDivisions(list);
    }).catch(() => setDivisions([]));
  }, []);

  // Auto-open create admin modal when navigated from dashboard quick action
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('createAdmin') === 'true' && (user?.roles || []).includes('SUPER ADMIN')) {
      setEditingUserId(null);
      setFormData({ name: '', email: '', password: '', roles: ['ADMIN'], division: '', status: 'active' });
      setIsModalOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredUsers = users.filter((u) => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingUserId(null);
    // Super Admins may only create Admin users per requirements
    const defaultRoles = (user?.roles || []).includes('SUPER ADMIN') ? ['ADMIN'] : ['STUDENT'];
    setFormData({ name: '', email: '', password: '', roles: defaultRoles, division: '', status: 'active' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: any) => {
    setEditingUserId(user._id);
    setFormData({ 
      name: user.name, 
      email: user.email, 
      password: '', // Blank when editing
      roles: user.roles || (user.role ? [String(user.role).toUpperCase()] : ['STUDENT']),
      division: user.division || user.divisionId || '',
      status: user.status 
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUserId) {
        const payload: any = { ...formData };
        if (!payload.password) delete payload.password; // Don't submit blank passwords
        await usersService.updateUser(editingUserId, payload);
      } else {
        // Prepare payload for backend: send `roles` array and a primary `role` for compatibility
        // Enforce role creation rules: SUPER ADMIN may only create ADMIN
        const desiredRoles = (user?.role === 'SUPER ADMIN') ? ['ADMIN'] : formData.roles;
        const primaryRole = Array.isArray(desiredRoles) && desiredRoles.length > 0 ? desiredRoles[0] : 'STUDENT';
        const payload: any = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          roles: (user?.roles || []).includes('SUPER ADMIN') ? ['ADMIN'] : formData.roles,
          role: primaryRole,
          division: formData.division || undefined,
          status: formData.status
        };
        await usersService.createUser(payload);
      }
      setIsModalOpen(false);
      fetchUsers(); // Refresh the list
    } catch (err: any) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="space-y-8 selection:bg-brand-accent selection:text-white">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-brand-accent uppercase tracking-tighter">User Directory</h1>
          <p className="text-text-muted font-bold text-xs uppercase tracking-[0.2em] mt-2">Active Directory & Access Control Systems</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="bg-brand-accent text-white px-6 py-3 text-[11px] font-black uppercase tracking-widest rounded-xl flex items-center hover:bg-brand-accent/90 transition-all shadow-lg shadow-brand-accent/20 active:translate-y-[1px]"
        >
          <Plus size={14} className="mr-2" /> Provision New User
        </button>
      </div>

      {loading ? (
         <div className="text-center text-text-muted font-bold uppercase py-10">Loading Users...</div>
      ) : (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Division</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((u) => (
            <TableRow key={u._id}>
              <TableCell className="font-bold">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-primary border border-brand-border flex items-center justify-center text-brand-accent shadow-sm">
                    <User size={14} />
                  </div>
                  <span className="uppercase tracking-tight">{u.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-text-muted">{u.email}</TableCell>
              <TableCell>
                 <span className="flex items-center text-[10px] font-black uppercase tracking-widest text-brand-accent">
                    <Shield size={10} className="mr-2" /> {u.role}
                 </span>
              </TableCell>
              <TableCell className="uppercase text-[10px] font-black tracking-widest text-text-muted">
                 {u.division || 'Unassigned'}
              </TableCell>
              <TableCell>
                <div className={cn(
                  "inline-flex px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] shadow-sm",
                  u.status?.toLowerCase() === 'active' ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"
                )}>
                  {u.status}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <button 
                  onClick={() => handleOpenEdit(u)}
                  className="p-2 bg-brand-primary border border-brand-border rounded-lg text-text-muted hover:text-brand-accent hover:border-brand-accent/50 transition-colors"
                >
                  <Edit size={14} />
                </button>
              </TableCell>
            </TableRow>
          ))}
          {filteredUsers.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-text-muted uppercase tracking-widest text-[10px] font-black">
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      )}

      {/* CREATE / EDIT MODAL */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingUserId ? "Edit User Profiling" : "Provision New Identity"}
        subtitle={editingUserId ? "Update the user's profile and access rights." : "Create a new system identity with appropriate role and status."}
        icon={<UserPlus />}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-2">Full Name</label>
            <input 
              required 
              type="text" 
              value={formData.name} 
              onChange={e => setFormData(prev => ({...prev, name: e.target.value}))}
              className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm font-medium focus:border-brand-accent outline-none transition-colors" 
              placeholder="e.g. John Doe" 
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-2">Educational Email</label>
            <input 
              required 
              type="email" 
              value={formData.email} 
              onChange={e => setFormData(prev => ({...prev, email: e.target.value}))}
              className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm font-medium focus:border-brand-accent outline-none transition-colors" 
              placeholder="e.g. j.doe@scholar.astu" 
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-2">
              Identity Key {editingUserId && <span className="text-brand-accent lowercase normal-case text-[9px]">(Leave blank to keep unchanged)</span>}
            </label>
            <input 
              type="password" 
              required={!editingUserId} // Only required for new users
              value={formData.password} 
              onChange={e => setFormData(prev => ({...prev, password: e.target.value}))}
              className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm font-medium focus:border-brand-accent outline-none transition-colors" 
              placeholder="••••••••" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-2">Role Assignment</label>
              {user?.role === 'SUPER ADMIN' ? (
                <div className="flex items-center gap-2">
                  <div className="px-3 py-2 rounded-lg bg-brand-primary/30 text-sm font-black uppercase tracking-wider">Administrator</div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={formData.roles.includes('STUDENT')} onChange={() => {
                      setFormData(prev => {
                        const has = prev.roles.includes('STUDENT');
                        return {...prev, roles: has ? prev.roles.filter((r:any) => r !== 'STUDENT') : [...prev.roles, 'STUDENT']};
                      });
                    }} />
                    <span className="text-xs font-bold">Student</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={formData.roles.includes('INSTRUCTOR')} onChange={() => {
                      setFormData(prev => {
                        const has = prev.roles.includes('INSTRUCTOR');
                        return {...prev, roles: has ? prev.roles.filter((r:any) => r !== 'INSTRUCTOR') : [...prev.roles, 'INSTRUCTOR']};
                      });
                    }} />
                    <span className="text-xs font-bold">Instructor</span>
                  </label>
                </div>
              )}

              <div className="mt-3">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-2">Assign Division</label>
                <select value={formData.division} onChange={e => setFormData(prev => ({...prev, division: e.target.value}))} className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm font-medium outline-none focus:border-brand-accent">
                  <option value="">Unassigned</option>
                  {divisions.map(d => (<option key={d._id || d.id} value={d._id || d.id}>{d.name}</option>))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-2">Account Status</label>
              <select 
                value={formData.status} 
                onChange={e => setFormData(prev => ({...prev, status: e.target.value}))}
                className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm font-medium uppercase outline-none focus:border-brand-accent transition-colors"
               >
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="graduated">Graduated</option>
              </select>
            </div>
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
              className="px-6 py-3 shadow-lg shadow-brand-accent/20"
            >
              {editingUserId ? "Commit Changes" : "Deploy User"}
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
