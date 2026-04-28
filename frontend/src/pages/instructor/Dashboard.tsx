import React, { useEffect, useState } from "react";
import { Card, Button, Modal } from "@/src/components/ui";
import {
  Users,
  Calendar,
  CheckCircle2,
  Plus,
  BookOpen,
  ArrowRight,
  Activity,
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { sessionsService } from '../../services/sessions.service';
import { bootcampsService } from '../../services/bootcamps.service';

export default function InstructorDashboard() {
  const navigate = useNavigate();

  const [totalSessions, setTotalSessions] = useState<number | null>(null);
  const [totalStudents, setTotalStudents] = useState<number | null>(null);
  const [engagementScore, setEngagementScore] = useState<number | null>(null);
  const [todaysSessions, setTodaysSessions] = useState<any[]>([]);

  const [showCreate, setShowCreate] = useState(false);
  const [bootcamps, setBootcamps] = useState<any[]>([]);
  const [form, setForm] = useState({ title: '', bootcampId: '', date: '', time: '' });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await sessionsService.getSessions();
        const payload = res.data ?? res;
        const list = Array.isArray(payload) ? payload : payload?.data ?? [];
        setTotalSessions(list.length ?? 0);
        // set todays sample sessions as first few upcoming
        setTodaysSessions(list.slice(0, 3));

        const bc = await bootcampsService.getBootcamps();
        const bcList = bc.data ?? bc;
        const bcArr = Array.isArray(bcList) ? bcList : bcList?.data ?? [];
        setBootcamps(bcArr);
      } catch (e) {
        setTotalSessions(null);
        setTodaysSessions([]);
        setBootcamps([]);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-8 selection:bg-brand-accent selection:text-white">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-extrabold text-text-main">Instructor Portal</h1>
          <p className="text-text-muted mt-1">Manage your teaching schedule and student performance.</p>
        </div>
        <div>
          <Button onClick={() => setShowCreate(true)} className="bg-indigo-700 text-white px-5 py-3 rounded-lg shadow-lg">
            <Plus className="inline mr-2" /> Add Session
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-lg border border-gray-100 shadow-sm">
          <div className="text-xs text-text-muted uppercase font-black">Total Sessions</div>
          <div className="text-3xl font-extrabold mt-3">{totalSessions}</div>
          <div className="text-xs text-text-muted mt-2">Scheduled this month</div>
        </div>

        <div className="p-6 bg-white rounded-lg border border-gray-100 shadow-sm">
          <div className="text-xs text-text-muted uppercase font-black">Total Students</div>
          <div className="text-3xl font-extrabold mt-3">{totalStudents}</div>
          <div className="text-xs text-text-muted mt-2">Active across batches</div>
        </div>

        <div className="p-6 bg-white rounded-lg border border-gray-100 shadow-sm">
          <div className="text-xs text-text-muted uppercase font-black">Engagement Score</div>
          <div className="text-3xl font-extrabold mt-3">{engagementScore}%</div>
          <div className="text-xs text-text-muted mt-2">Avg across sessions</div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-100 p-6">
        <h3 className="text-sm font-black uppercase text-text-muted mb-4">Today's Sessions</h3>
        <div className="space-y-4">
          {todaysSessions.map(s => (
            <div key={s.id} className="flex items-center justify-between bg-white p-4 border border-gray-100 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="text-xs text-text-muted bg-gray-50 border rounded-md px-3 py-2">{s.date}</div>
                <div>
                  <div className="font-extrabold">{s.title}</div>
                  <div className="text-xs text-text-muted mt-1">{s.time}</div>
                </div>
              </div>
              <div>
                <button onClick={() => navigate(`/dashboard/instructor/sessions`)} className="px-6 py-2 bg-white border border-gray-100 rounded-full text-xs font-black text-brand-accent">View Session Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Session">
        <form onSubmit={async (e) => {
          e.preventDefault();
          try {
            const payload = {
              title: form.title,
              bootcampId: form.bootcampId,
              date: form.date,
              time: form.time
            };
            await sessionsService.createSession(payload);
            setShowCreate(false);
            // optional: refresh counts
            const res = await sessionsService.getSessions();
            const payloadList = res.data ?? res;
            const list = Array.isArray(payloadList) ? payloadList : payloadList?.data ?? [];
            setTotalSessions(list.length ?? 0);
            setTodaysSessions(list.slice(0,3));
          } catch (err: any) {
            alert(err.response?.data?.message || err.message || 'Failed to create session');
          }
        }} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase text-text-muted mb-2">Title</label>
            <input required value={form.title} onChange={e=>setForm({...form, title: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm focus:border-brand-accent outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-text-muted mb-2">Bootcamp</label>
            <select required value={form.bootcampId} onChange={e=>setForm({...form, bootcampId: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm focus:border-brand-accent outline-none">
              <option value="">Select Bootcamp</option>
              {bootcamps.map(b=>(<option key={b._id||b.id} value={b._id||b.id}>{b.title||b.name}</option>))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase text-text-muted mb-2">Date</label>
              <input required type="date" value={form.date} onChange={e=>setForm({...form, date: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm focus:border-brand-accent outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-text-muted mb-2">Time</label>
              <input required type="time" value={form.time} onChange={e=>setForm({...form, time: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-brand-primary/50 border border-brand-border text-text-main text-sm focus:border-brand-accent outline-none" />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={()=>setShowCreate(false)}>Cancel</Button>
            <Button type="submit">Create Session</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
