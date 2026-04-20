import React from 'react';
import { Button } from '@/src/components/ui';
import { Link } from 'react-router-dom';
import Logo from '../../components/common/Logo';

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-primary px-4 selection:bg-brand-accent selection:text-brand-primary">
      <div className="max-w-md w-full text-center">
        <div className="mb-10">
          <Link to="/" className="inline-block mb-3">
            <Logo size="lg" className="mx-auto" />
          </Link>
          <h1 className="text-3xl font-black text-text-main tracking-tighter uppercase">
            CSEC Portal
          </h1>
          <p className="text-text-muted mt-2 font-bold uppercase tracking-widest text-xs">Division Learning Platform</p>
        </div>

        <div className="geo-card p-10">
          <h2 className="text-2xl font-black text-text-main uppercase tracking-tighter mb-4">Registration Locked</h2>
          <p className="mb-8 text-text-muted font-bold text-xs uppercase tracking-widest leading-relaxed">
            Direct registration is currently restricted. Please contact your Division Head or Administrator to receive your unique Education ID and Identity Key.
          </p>
          <Link to="/login" className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] hover:text-brand-accent transition-colors">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
