import React, { useMemo, useState, useEffect } from "react";
import { Card, Button, Modal } from "@/src/components/ui";
import { Users, Calendar, CheckCircle2, Briefcase } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { usersService } from "@/src/services/users.service";
import { divisionsService } from "@/src/services/divisions.service";
import { sessionsService } from "@/src/services/sessions.service";
import { bootcampsService } from "@/src/services/bootcamps.service";
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [totalBootcamps, setTotalBootcamps] = useState<number | null>(null);
  const [activeSessions, setActiveSessions] = useState<number | null>(null);
  const [avgAttendance, setAvgAttendance] = useState<number>(0);

  const [divisions, setDivisions] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [instructorsList, setInstructorsList] = useState<any[]>([]);
  const [bootcampsPerDivision, setBootcampsPerDivision] = useState<Record<string, number>>({});

  const [activeTab, setActiveTab] = useState("sessions");

  const [showAddBootcamp, setShowAddBootcamp] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ divisionId: "", name: "", startDate: "", endDate: "" });
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const load = async () => {
      try {
        // users and instructors
        const usersRes = await usersService.getUsers();
        const usersPayload = usersRes.data ?? usersRes;
        const usersArray = Array.isArray(usersPayload) ? usersPayload : usersPayload?.data ?? [];
        setUsersList(usersArray);
        setTotalUsers(usersRes.count ?? usersArray.length ?? 0);

        const instructorsRes = await usersService.getUsers('INSTRUCTOR');
        const instructorsPayload = instructorsRes.data ?? instructorsRes;
        const instructorsArray = Array.isArray(instructorsPayload) ? instructorsPayload : instructorsPayload?.data ?? [];
        setInstructorsList(instructorsArray);

        // divisions
        const divRes = await divisionsService.getDivisions();
        const divs = divRes.data ?? divRes;
        const divArray = Array.isArray(divs) ? divs : divs?.data ?? [];
        setDivisions(divArray);

        // sessions
        const sessRes = await sessionsService.getSessions();
        const sessPayload = sessRes.data ?? sessRes;
        const sessArray = Array.isArray(sessPayload) ? sessPayload : sessPayload?.data ?? [];
        setSessions(sessArray);
        setActiveSessions(sessArray.length ?? 0);

        // avg attendance (backend endpoint can be added later)
        setAvgAttendance(92);

        // compute bootcamps per division and total bootcamps
        try {
          const counts = await Promise.all(divArray.map(async (d: any) => {
            const bres = await bootcampsService.getBootcampsByDivision(d._id || d.id);
            const items = bres.data ?? bres;
            const list = Array.isArray(items) ? items : items?.data ?? [];
            return list.length;
          }));
          const sum = counts.reduce((s, n) => s + n, 0);
          setTotalBootcamps(sum);
          const map: Record<string, number> = {};
          divArray.forEach((d: any, i: number) => { map[d.name] = counts[i] ?? 0; });
          setBootcampsPerDivision(map);
        } catch (e) {
          setTotalBootcamps(null);
          setBootcampsPerDivision({});
        }
      } catch (error) {
        console.error(error);
      }
    };
    load();
  }, []);

  const chartData = useMemo(() => {
    // Group everything by division name (sessions, users, instructors, bootcamps)
    const nameMap: Record<string, number> = {};
    // Initialize with known divisions
    divisions.forEach((d) => {
      const name = d.name || 'Unknown';
      nameMap[name] = 0;
    });
    nameMap['Unknown'] = 0;

    const getDivisionNameFromId = (id: any) => {
      if (!id) return null;
      const sid = String(id);
      const found = divisions.find((d) => String(d._id || d.id) === sid);
      return found ? found.name : null;
    };

    if (activeTab === 'sessions') {
      sessions.forEach((s) => {
        let name: string | null = null;
        if (s.bootcamp) {
          const divRef = s.bootcamp.divisionId || s.bootcamp.division || null;
          if (divRef) {
            if (typeof divRef === 'string') name = getDivisionNameFromId(divRef) || divRef;
            else if (divRef._id || divRef.id) name = getDivisionNameFromId(divRef._id || divRef.id);
            else if (divRef.name) name = divRef.name;
          }
        }
        // fallback: session may include division-related fields
        if (!name) {
          name = s.divisionName || s.division || s.divisionId || null;
          if (name) {
            const found = getDivisionNameFromId(name);
            if (found) name = found;
          }
        }
        if (!name) name = 'Unknown';
        nameMap[name] = (nameMap[name] || 0) + 1;
      });
      return Object.keys(nameMap).map((k) => ({ name: k, value: nameMap[k] }));
    }

    if (activeTab === 'bootcamps') {
      // bootcampsPerDivision keys are division names already
      const map: Record<string, number> = { ...nameMap };
      Object.keys(bootcampsPerDivision).forEach((k) => {
        map[k] = bootcampsPerDivision[k] || 0;
      });
      return Object.keys(map).map((k) => ({ name: k, value: map[k] }));
    }

    if (activeTab === 'users') {
      const map = { ...nameMap };
      usersList.forEach((u) => {
        let key = u.divisionName || u.division || u.divisionId || null;
        if (key) {
          const found = getDivisionNameFromId(key);
          if (found) key = found;
        }
        if (!key) key = 'Unknown';
        map[key] = (map[key] || 0) + 1;
      });
      return Object.keys(map).map((k) => ({ name: k, value: map[k] }));
    }

    if (activeTab === 'instructors') {
      const map = { ...nameMap };
      instructorsList.forEach((u) => {
        let key = u.divisionName || u.division || u.divisionId || null;
        if (key) {
          const found = getDivisionNameFromId(key);
          if (found) key = found;
        }
        if (!key) key = 'Unknown';
        map[key] = (map[key] || 0) + 1;
      });
      return Object.keys(map).map((k) => ({ name: k, value: map[k] }));
    }

    return [];
  }, [activeTab, divisions, sessions, usersList, instructorsList, bootcampsPerDivision]);

  const handleCreateBootcamp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.divisionId || !form.name) return;
    setCreating(true);
    try {
      await bootcampsService.createBootcamp(form.divisionId, {
        name: form.name,
        startDate: form.startDate,
        endDate: form.endDate,
      });
      // refresh counts
      const divRes = await divisionsService.getDivisions();
      const divs = divRes.data ?? divRes;
      setDivisions(Array.isArray(divs) ? divs : []);
      // recompute bootcamp totals
      const counts = await Promise.all((Array.isArray(divs) ? divs : []).map(async (d: any) => {
        const bres = await bootcampsService.getBootcampsByDivision(d._id || d.id);
        const items = bres.data ?? bres;
        return Array.isArray(items) ? items.length : 0;
      }));
      setTotalBootcamps(counts.reduce((s, n) => s + n, 0));
      setShowAddBootcamp(false);
      setForm({ divisionId: "", name: "", startDate: "", endDate: "" });
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-text-main">Admin Dashboard</h1>
          <p className="text-text-muted mt-1">Global system health and engagement overview.</p>
        </div>

        <div>
            <div className="flex items-center gap-3">
              {user === 'SUPER ADMIN' && (
                <Button onClick={() => navigate('/dashboard/admin/users?createAdmin=true')} className="shadow-lg bg-indigo-600 text-white px-4 py-2 rounded-full">Add Admin</Button>
              )}
              <Button onClick={() => setShowAddBootcamp(true)} className="shadow-lg bg-brand-accent text-white px-4 py-2 rounded-full">+ Bootcamp</Button>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-md bg-blue-50">
                <Users className="text-blue-600" />
              </div>
              <div>
                <div className="text-[13px] text-text-muted">Total Users</div>
                <div className="text-2xl font-black">{totalUsers ?? '—'}</div>
                <div className="text-xs text-text-muted">Active this month</div>
              </div>
            </div>
            <div className="text-green-600 font-bold">+12%</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-md bg-blue-50">
                <Briefcase className="text-blue-600" />
              </div>
              <div>
                <div className="text-[13px] text-text-muted">Total Bootcamps</div>
                <div className="text-2xl font-black">{totalBootcamps ?? '—'}</div>
                <div className="text-xs text-text-muted">3 Upcoming</div>
              </div>
            </div>
            <div className="text-text-muted font-bold">&nbsp;</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-md bg-blue-50">
                <Calendar className="text-blue-600" />
              </div>
              <div>
                <div className="text-[13px] text-text-muted">Active Sessions</div>
                <div className="text-2xl font-black">{activeSessions ?? '—'}</div>
                <div className="text-xs text-text-muted">Live today</div>
              </div>
            </div>
            <div className="text-text-muted font-bold">&nbsp;</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-md bg-blue-50">
                <CheckCircle2 className="text-blue-600" />
              </div>
              <div>
                <div className="text-[13px] text-text-muted">Avg Attendance</div>
                <div className="text-2xl font-black">{avgAttendance}%</div>
                <div className="text-xs text-text-muted">Across all divisions</div>
              </div>
            </div>
            <div className="text-green-600 font-bold">+4%</div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-black uppercase tracking-wide">Activity Metrics</h3>
          <div className="flex items-center gap-2">
            {['users','instructors','sessions','bootcamps'].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-4 py-2 rounded-full text-sm ${activeTab===t? 'bg-white text-text-main shadow':''} text-text-muted`}
              >
                {t.charAt(0).toUpperCase()+t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
              <YAxis tick={{ fill: '#6b7280' }} />
              <Tooltip />
              <Bar dataKey="value" fill="#1e40af" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Modal isOpen={showAddBootcamp} onClose={() => setShowAddBootcamp(false)} title="Create Bootcamp">
        <form onSubmit={handleCreateBootcamp} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-text-muted">Division</label>
            <select value={form.divisionId} onChange={(e) => setForm({...form, divisionId: e.target.value})} className="w-full mt-2 p-2 bg-transparent border rounded-md">
              <option value="">Select Division</option>
              {divisions.map(d => (
                <option key={d._id || d.id} value={d._id || d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-text-muted">Bootcamp Name</label>
            <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full mt-2 p-2 bg-transparent border rounded-md" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-text-muted">Start Date</label>
              <input type="date" value={form.startDate} onChange={(e) => setForm({...form, startDate: e.target.value})} className="w-full mt-2 p-2 bg-transparent border rounded-md" />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted">End Date</label>
              <input type="date" value={form.endDate} onChange={(e) => setForm({...form, endDate: e.target.value})} className="w-full mt-2 p-2 bg-transparent border rounded-md" />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setShowAddBootcamp(false)}>Cancel</Button>
            <Button type="submit" disabled={creating}>{creating ? 'Creating...' : 'Create Bootcamp'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
