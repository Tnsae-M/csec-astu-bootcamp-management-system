import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-brand-primary selection:bg-brand-accent/10">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 no-scrollbar">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
