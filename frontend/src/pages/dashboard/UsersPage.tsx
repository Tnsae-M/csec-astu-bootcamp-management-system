import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import { fetchUsers } from '../../store/userSlice';
import { fetchBootcamps } from '../../store/bootcampSlice';
import { fetchDivisions } from '../../store/divisionSlice';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { FormField } from '../../components/ui/FormField';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { 
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell 
} from '../../components/ui/Table';
import { userService } from '../../services/auth.service';
import { enrollmentService } from '../../services/all_others.service';
import { cn } from '../../lib/utils';
import { Users, Plus, Shield, Mail, Edit2, UserX } from 'lucide-react';
import { toast } from 'sonner';

export const UsersPage = () => {
  const { users = [], loading } = useSelector((state: RootState) => state.users);
  const { items: bootcamps = [] } = useSelector((state: RootState) => state.bootcamps);
  const { items: divisions = [] } = useSelector((state: RootState) => state.divisions);
  const dispatch = useDispatch<AppDispatch>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: ['student'],
    password: 'Password123!', // Default password for manually created users
    bootcampId: '',
    divisionId: ''
  });

  const handleRoleToggle = (r: string) => {
    setFormData(prev => ({
      ...prev,
      role: prev.role.includes(r) 
        ? prev.role.filter(role => role !== r)
        : [...prev.role, r]
    }));
  };

  useEffect(() => {
    dispatch(fetchUsers({}));
    dispatch(fetchBootcamps());
    dispatch(fetchDivisions());
  }, [dispatch]);

  const handleCreateUser = async () => {
    try {
      const res = await userService.createUser(formData);
      if (formData.bootcampId) {
        await enrollmentService.enrollUser({ userId: res.data._id, bootcampId: formData.bootcampId });
      }
      toast.success('User created successfully. Default password: Password123! — inform the user to change it.', { duration: 8000 });
      setIsModalOpen(false);
      dispatch(fetchUsers({}));
      setFormData({ name: '', email: '', role: ['student'], password: 'Password123!', bootcampId: '', divisionId: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create user');
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-text-main">
            Manage <span className="text-brand-accent">Users</span>
          </h1>
          <p className="text-text-muted font-medium mt-1 uppercase text-xs tracking-widest">
            Complete database of CSEC-ASTU students and instructors.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus size={18} />
          Create User
        </Button>
      </header>

      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User Identification</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Email Verification</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center text-brand-accent font-black uppercase">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black uppercase text-sm tracking-tight">{user.name}</p>
                      <p className="text-[10px] font-medium text-text-muted">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      user.role.includes('super admin') || user.role.includes('admin') ? "bg-brand-accent" : 
                      user.role.includes('instructor') ? "bg-brand-secondary" : "bg-success"
                    )} />
                    <span className="text-xs font-black uppercase tracking-widest text-text-main">{user.role.join(', ')}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={user.status === 'active' ? 'success' : 'destructive'}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                   <div className="flex items-center gap-2">
                      <Mail size={14} className={user.isEmailVerified ? "text-success" : "text-text-muted"} />
                      <span className="text-[10px] font-bold uppercase">{user.isEmailVerified ? 'Verified' : 'Pending'}</span>
                   </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8 hover:border-brand-accent hover:text-brand-accent">
                      <Edit2 size={14} />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 hover:border-danger hover:text-danger">
                      <UserX size={14} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New User"
        subtitle="Manually add a student or staff member"
        icon={Plus}
      >
        <div className="space-y-6">
           <FormField label="Full Name">
             <Input 
                placeholder="Abebe Bikila" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </FormField>
           <FormField label="Email Address">
             <Input 
                placeholder="abebe@astu.edu.et" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </FormField>
           <FormField label="Roles">
             <div className="flex flex-wrap gap-2">
               {['student', 'instructor', 'admin', 'super admin'].map(r => (
                 <label key={r} className="flex items-center gap-2 bg-brand-primary p-2 rounded-lg cursor-pointer hover:bg-brand-primary/80 border border-brand-border">
                   <input 
                     type="checkbox"
                     checked={formData.role.includes(r)}
                     onChange={() => handleRoleToggle(r)}
                     className="w-4 h-4 rounded text-brand-accent focus:ring-brand-accent"
                   />
                   <span className="text-xs font-black uppercase tracking-widest">{r}</span>
                 </label>
               ))}
             </div>
           </FormField>
           <FormField label="Assign to Division (Optional)">
              <select 
                className="w-full h-12 rounded-xl border border-brand-border bg-brand-primary/50 px-4 py-2 text-sm focus:border-brand-accent outline-none font-black uppercase tracking-widest"
                value={formData.divisionId}
                onChange={(e) => setFormData({ ...formData, divisionId: e.target.value })}
              >
                <option value="">-- None --</option>
                {divisions.map((d: any) => (
                  <option key={d._id} value={d._id}>{d.name}</option>
                ))}
              </select>
           </FormField>
           {formData.role.includes('student') && (
             <FormField label="Enroll in Bootcamp (Optional)">
                <select 
                  className="w-full h-12 rounded-xl border border-brand-border bg-brand-primary/50 px-4 py-2 text-sm focus:border-brand-accent outline-none font-black uppercase tracking-widest"
                  value={formData.bootcampId}
                  onChange={(e) => setFormData({ ...formData, bootcampId: e.target.value })}
                >
                  <option value="">-- None --</option>
                  {bootcamps.map(b => (
                    <option key={b._id} value={b._id}>{b.name}</option>
                  ))}
                </select>
             </FormField>
           )}
           <div className="flex gap-4 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleCreateUser}>Create User</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
