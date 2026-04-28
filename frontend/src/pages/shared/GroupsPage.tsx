import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../app/store';
import { Users2, BadgeCheck, BookOpen, UserPlus, Trash2 } from 'lucide-react';
import { groupsService } from '../../services/groups.service';
import { bootcampsService } from '../../services/bootcamps.service';
import { usersService } from '../../services/users.service';
import { setGroupsStart, setGroupsSuccess, setGroupsFailure } from '../../features/groups/groupsSlice';
import { Modal, Button } from '../../components/ui';

export default function GroupsPage() {
  const dispatch = useDispatch();
  const { groups, loading } = useSelector((state: RootState) => state.groups);
  const { user } = useSelector((state: RootState) => state.auth);
  const { searchTerm } = useSelector((state: RootState) => state.ui);

  const [bootcamps, setBootcamps] = useState<any[]>([]);
  const [selectedBootcampId, setSelectedBootcampId] = useState('');
  const [instructors, setInstructors] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  const [formData, setFormData] = useState({ name: '', mentorId: '' });
  const [activeGroupId, setActiveGroupId] = useState('');
  const [newMemberId, setNewMemberId] = useState('');

  const isAdminOrInst = user?.role === 'ADMIN' || user?.role === 'INSTRUCTOR';

  useEffect(() => {
    bootcampsService.getBootcamps().then(res => {
      const data = res.data || [];
      setBootcamps(data);
      if (data.length > 0) setSelectedBootcampId(data[0]._id);
    });

    usersService.getUsers().then(res => {
      const all = res.data || [];
      setInstructors(all.filter((u: any) => ['admin', 'instructor'].includes(u.role?.toLowerCase())));
      setStudents(all.filter((u: any) => u.role?.toLowerCase() === 'student'));
    });
  }, []);

  const fetchGroups = () => {
    if (!selectedBootcampId) return;
    dispatch(setGroupsStart());
    groupsService.getGroupsByBootcamp(selectedBootcampId)
      .then(res => dispatch(setGroupsSuccess(res.data || [])))
      .catch(err => dispatch(setGroupsFailure(err.message)));
  };

  useEffect(() => {
    fetchGroups();
  }, [selectedBootcampId]);

  const filteredGroups = groups.filter(g =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateGroup = async (e: any) => {
    e.preventDefault();
    await groupsService.createGroup({ ...formData, bootcampId: selectedBootcampId });
    setIsModalOpen(false);
    fetchGroups();
  };

  const handleAddMember = async (e: any) => {
    e.preventDefault();
    await groupsService.addMember(activeGroupId, newMemberId, selectedBootcampId);
    setIsMemberModalOpen(false);
    fetchGroups();
  };

  const handleRemoveMember = async (gid: string, sid: string) => {
    await groupsService.removeMember(gid, sid);
    fetchGroups();
  };

  const handleDeleteGroup = async (gid: string) => {
    await groupsService.deleteGroup(gid);
    fetchGroups();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Groups</h1>

      {isAdminOrInst && (
        <button onClick={() => setIsModalOpen(true)}>+ Create Group</button>
      )}

      {loading ? "Loading..." : (
        <div className="grid grid-cols-3 gap-4">
          {filteredGroups.map(g => (
            <div key={g._id} className="border p-4 rounded">
              <h3>{g.name}</h3>
              <p>Members: {g.members?.length || 0}</p>

              {isAdminOrInst && (
                <>
                  <button onClick={() => {
                    setActiveGroupId(g._id);
                    setIsMemberModalOpen(true);
                  }}>Add Member</button>

                  <button onClick={() => handleDeleteGroup(g._id)}>Delete</button>
                </>
              )}

              {g.members?.map((m: any) => (
                <div key={m._id} className="flex justify-between">
                  <span>{m.name}</span>
                  <button onClick={() => handleRemoveMember(g._id, m._id)}>x</button>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* CREATE GROUP */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Group">
        <form onSubmit={handleCreateGroup}>
          <input
            placeholder="Group name"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
          <Button type="submit">Create</Button>
        </form>
      </Modal>

      {/* ADD MEMBER */}
      <Modal isOpen={isMemberModalOpen} onClose={() => setIsMemberModalOpen(false)} title="Add Member">
        <form onSubmit={handleAddMember}>
          <select onChange={e => setNewMemberId(e.target.value)}>
            {students.map(s => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
          <Button type="submit">Add</Button>
        </form>
      </Modal>
    </div>
  );
}
