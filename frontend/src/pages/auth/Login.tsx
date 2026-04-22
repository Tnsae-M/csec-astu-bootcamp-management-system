import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginStart, loginSuccess, loginFailure, UserRole } from '../../features/auth/authSlice';
import { Button, Card } from '@/src/components/ui';
import { RootState } from '../../app/store';
import Logo from '../../components/common/Logo';
import { authService } from '../../services/auth.service';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const response = await authService.login({ email, password });
      
      const backendResponse = response.data || response; // Gets { success: true, data: { accessToken, user } }
      const actualData = backendResponse.data || backendResponse; // Extracts { accessToken, user }
      
      const user = actualData.user;
      const token = actualData.accessToken || actualData.token || 'fake-token';
      
      const role: UserRole = user?.role ? user.role.toUpperCase() : 'STUDENT';

      dispatch(loginSuccess({
        user: {
          id: user._id || user.id,
          name: user.name,
          email: user.email,
          role: role,
        },
        token: token
      }));
      navigate('/dashboard');
    } catch (err: any) {
      dispatch(loginFailure(err.response?.data?.message || err.message || 'Login failed'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-primary px-4 selection:bg-brand-accent selection:text-brand-primary overflow-y-auto">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <Link to="/" className="inline-block mb-3">
            <Logo size="lg" className="mx-auto" />
          </Link>
          <h1 className="text-3xl font-black text-text-main tracking-tighter uppercase">
            CSEC Portal
          </h1>
          <p className="text-text-muted mt-2 font-bold uppercase tracking-widest text-xs">Division Learning Platform</p>
        </div>

        <div className="geo-card p-10">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-text-muted mb-2 uppercase tracking-[0.2em]">
                Educational Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-brand-primary/50 border border-brand-border text-text-main focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 outline-none transition-all font-medium text-sm"
                placeholder="student@scholar.astu"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-text-muted mb-2 uppercase tracking-[0.2em]">
                Identity Key
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-brand-primary/50 border border-brand-border text-text-main focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 outline-none transition-all font-medium text-sm"
                placeholder="••••••••"
                minLength={8}
              />
            </div>

            <Button
              type="submit"
              isLoading={loading}
              className="w-full py-4 text-sm font-black uppercase tracking-widest shadow-lg shadow-brand-accent/20"
            >
              Sign In to Dashboard
            </Button>
          </form>

          {error && <p className="text-red-600 text-xs mt-4 text-center font-bold uppercase tracking-wider">{error}</p>}

          <div className="mt-8 pt-6 border-t border-brand-border space-y-4 text-center">
            <p className="text-[11px] text-text-muted font-bold uppercase tracking-widest">
              New Researcher? <Link to="/register" className="text-brand-accent hover:underline decoration-2 underline-offset-4">Register here</Link>
            </p>
            <div>
              <Link to="/" className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] hover:text-brand-accent transition-colors">
                ← Back to Portal
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 text-center">
          <div className="flex justify-center space-x-2 text-[9px] font-bold uppercase tracking-[0.3em] text-text-muted/40">
            <span>ADMIN</span> | <span>INSTRUCTOR</span> | <span>STUDENT</span>
          </div>
        </div>
      </div>
    </div>
  );
}
