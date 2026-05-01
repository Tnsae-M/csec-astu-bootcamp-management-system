import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, clearError } from '../../features/auth/authSlice';
import { 
  Button, 
  Card, 
  FormField, 
  Input 
} from '@/components/ui';
import { RootState } from '../../app/store';
import Logo from '../../components/common/Logo';
import { ShieldCheck, ArrowRight, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loading, error, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch() as any;
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      const roles = (user as any)?.roles || ((user as any)?.role ? [(user as any).role] : []);
      if (roles.length > 0) {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));
    
    if (login.fulfilled.match(result)) {
      const rawPayload = result.payload;
      const data = rawPayload.data || {};
      const userData = rawPayload.user || data.user;
      
      if (userData) {
        toast.success(`Welcome back, ${userData.name}!`);
      }
      
      // Immediate navigation for better responsiveness
      navigate('/dashboard');
    } else if (login.rejected.match(result)) {
      const errorMessage = result.payload as string || 'Authentication failed';
      if (errorMessage.toLowerCase().includes('verify your email')) {
        toast.error('Account not verified. Redirecting to verification page...');
        setTimeout(() => {
          navigate(`/verify-email?email=${encodeURIComponent(email)}`);
        }, 2000);
      } else {
        toast.error(errorMessage);
      }
    }
  };




  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-primary px-4 relative overflow-hidden">
      {/* BACKGROUND DECORATION */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-accent blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-accent blur-[120px]" />
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex p-4 rounded-3xl bg-white shadow-xl shadow-brand-accent/10 mb-6 border border-brand-border/50">
            <Logo size="lg" />
          </div>
          <h1 className="text-3xl font-black text-text-main tracking-tight uppercase leading-none">
            Digital Identity Portal
          </h1>
          <p className="text-[10px] text-text-muted mt-3 font-black uppercase tracking-[0.3em] italic">
            CSEC-ASTU Bootcamp Management System
          </p>
        </div>

        <Card className="p-8 md:p-10 border-none bg-white/80 backdrop-blur-md shadow-2xl shadow-brand-accent/5">
          <form onSubmit={handleLogin} className="space-y-5">
            <FormField label="Scholastic Email" required>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-12"
                  placeholder="name@astu.edu.et"
                />
              </div>
            </FormField>

            <FormField label="Security Key" required>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-12"
                  placeholder="••••••••"
                  minLength={8}
                />
              </div>
            </FormField>

            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest px-1">
              <label className="flex items-center gap-2 cursor-pointer text-text-muted hover:text-text-main transition-colors">
                <input type="checkbox" className="rounded border-brand-border text-brand-accent focus:ring-brand-accent" />
                Stay Synchronized
              </label>
              <Link to="/forgot-password" className="text-brand-accent hover:underline decoration-2 underline-offset-4">
                Lost Key?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-6 text-sm font-black uppercase tracking-widest shadow-xl shadow-brand-accent/20 group"
            >
              {loading ? "Authenticating..." : (
                <>
                  Establish Connection
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-brand-border text-center">
            <p className="text-[11px] text-text-muted font-bold uppercase tracking-widest">
              New Researcher? <Link to="/register" className="text-brand-accent font-black hover:underline decoration-2 underline-offset-4">Register here</Link>
            </p>
          </div>
        </Card>

        <div className="mt-10 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-brand-border/50 text-[9px] font-black uppercase tracking-[0.2em] text-text-muted shadow-sm">
            <ShieldCheck className="h-3 w-3 text-emerald-500" />
            Secured via CSEC Protocol v2.4
          </div>
        </div>
      </div>
    </div>
  );
}
