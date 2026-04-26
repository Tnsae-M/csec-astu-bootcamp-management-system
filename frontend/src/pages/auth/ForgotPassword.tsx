import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/src/components/ui';
import Logo from '../../components/common/Logo';
import { authService } from '../../services/auth.service';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await authService.forgotPassword({ email });
      setMessage("If this email exists in our system, a reset link has been sent.");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send reset request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-primary px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <Link to="/" className="inline-block mb-3"><Logo size="lg" className="mx-auto" /></Link>
          <h1 className="text-3xl font-black text-text-main tracking-tighter uppercase">Recover Access</h1>
          <p className="text-text-muted mt-2 font-bold uppercase tracking-widest text-xs">Reset your identity key</p>
        </div>

        <div className="geo-card p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-text-muted mb-2 uppercase tracking-[0.2em]">Educational Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="w-full px-4 py-3 rounded-lg bg-brand-primary/50 border border-brand-border text-text-main focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 outline-none transition-all font-medium text-sm" 
                placeholder="student@scholar.astu" 
              />
            </div>
            <Button type="submit" isLoading={loading} className="w-full py-4 text-sm font-black uppercase tracking-widest shadow-lg shadow-brand-accent/20">Send Reset Link</Button>
          </form>

          {message && <p className="text-green-500 text-xs mt-4 text-center font-bold uppercase tracking-wider">{message}</p>}
          {error && <p className="text-red-600 text-xs mt-4 text-center font-bold uppercase tracking-wider">{error}</p>}

          <div className="mt-8 pt-6 border-t border-brand-border text-center">
            <Link to="/login" className="text-[11px] font-black text-text-muted uppercase tracking-widest hover:text-brand-accent transition-colors">← Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}