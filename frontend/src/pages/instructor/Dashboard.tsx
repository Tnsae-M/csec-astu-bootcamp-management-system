import React from "react";
import { Card, Button } from "@/src/components/ui";
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

export default function InstructorDashboard() {
  const navigate = useNavigate();

  // Snapshot data for the dashboard cards and today's sessions (static placeholder matching screenshot)
  const totalSessions = 7;
  const totalStudents = 85;
  const engagementScore = 88;

  const todaysSessions = [
    { id: 'S-101', title: 'React Hooks Deep Dive', time: '2:00 PM - 4:00 PM', status: 'UPCOMING', date: 'Sep 20' },
  ];

  return (
    <div className="space-y-8 selection:bg-brand-accent selection:text-white">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-extrabold text-text-main">Instructor Portal</h1>
          <p className="text-text-muted mt-1">Manage your teaching schedule and student performance.</p>
        </div>
        <div>
          <Button onClick={() => navigate('/dashboard/instructor/sessions')} className="bg-indigo-700 text-white px-5 py-3 rounded-lg shadow-lg">
            <Plus className="inline mr-2" /> Session
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
    </div>
  );
}
