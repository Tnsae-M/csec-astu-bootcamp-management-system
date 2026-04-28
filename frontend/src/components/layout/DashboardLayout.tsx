import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Breadcrumbs from '../common/Breadcrumbs';

export default function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-brand-primary selection:bg-brand-accent/10">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 no-scrollbar">
          <div className="max-w-7xl mx-auto w-full">
            <Breadcrumbs />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
