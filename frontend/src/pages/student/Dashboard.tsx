import React, { useEffect, useState } from "react";
import { Button } from "@/src/components/ui";
import { Calendar, Clock, BookOpen, ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useNavigate } from 'react-router-dom';
import api from "../../api/axios";
import fetchWithFallback from "../../lib/fetchWithFallback";

export default function StudentDashboard() {
  const navigate = useNavigate();

  const upcomingMock = [
    { id: 'S1', title: 'React Hooks Deep Dive', time: '10:00 AM', mode: 'Online' },
    { id: 'S2', title: 'Express Middleware', time: '14:00', mode: 'In-Person' },
  ];

  const [upcoming, setUpcoming] = useState(upcomingMock);
  const [attendance, setAttendance] = useState<number>(0);
  const [myGroup, setMyGroup] = useState({ name: '—', lead: '—' });

  useEffect(() => {
    let mounted = true;

    (async () => {
      // Sessions
      const sessionsRes = await fetchWithFallback(() => api.get('/sessions/mine'), upcomingMock);
      if (mounted && sessionsRes?.data) {
        setUpcoming(Array.isArray(sessionsRes.data) ? sessionsRes.data : upcomingMock);
      }

      // Attendance
      const attRes = await fetchWithFallback(() => api.get('/attendance/me'), { percent: 0 });
      if (mounted) setAttendance(attRes?.data?.percent ?? 0);

      // Group
      const grpRes = await fetchWithFallback(() => api.get('/groups/my'), { name: 'Alpha Squad', lead: 'Sarah Connor' });
      if (mounted && grpRes?.data) setMyGroup({ name: grpRes.data.name ?? '—', lead: grpRes.data.lead ?? '—' });
    })();

    return () => { mounted = false; };
  }, []);

  const ongoingTask = { title: 'Custom Hook Lab', due: 'Sep 25, 2024', status: 'PENDING SUBMISSION' };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-extrabold">My Learning Path</h1>
          <p className="text-text-muted">Track your progress and upcoming milestones.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <h3 className="text-xs font-black uppercase text-text-muted mb-4">Ongoing Tasks</h3>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="bg-white p-3 rounded-lg border">
                  <BookOpen />
                </div>
                <div>
                  <div className="font-extrabold">{ongoingTask.title}</div>
                  <div className="text-xs text-text-muted">Due: {ongoingTask.due}</div>
                </div>
              </div>
              <div className="text-xs font-black text-yellow-700">{ongoingTask.status}</div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <h3 className="text-xs font-black uppercase text-text-muted mb-4">Upcoming Sessions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcoming.map((s: any) => (
                <div key={s.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="font-bold">{s.title}</div>
                  <div className="text-xs text-text-muted mt-2"><Clock className="inline mr-2" /> {s.time} • {s.mode}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <div className="text-xs text-text-muted uppercase font-black">Attendance</div>
            <div className="text-3xl font-extrabold mt-3">{attendance}%</div>
            <div className="text-xs text-text-muted mt-2">Top 5% of club</div>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <div className="text-xs text-text-muted uppercase font-black">My Group: {myGroup.name}</div>
            <div className="mt-4 flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-100 mr-3 flex items-center justify-center">S</div>
              <div>
                <div className="font-bold">{myGroup.lead}</div>
                <div className="text-xs text-text-muted">YOU</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
