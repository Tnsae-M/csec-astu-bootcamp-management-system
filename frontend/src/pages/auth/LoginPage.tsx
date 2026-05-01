import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../store/authSlice';
import { AppDispatch, RootState } from '../../app/store';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { FormField } from '../../components/ui/FormField';
import { Logo } from '../../components/common/Logo';
import { Shield, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    } else {
      const errorMsg = result.payload as string;
      toast.error(errorMsg || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-brand-sidebar text-white">
        <div>
          <Logo />
        </div>
        <div>
          <h1 className="text-5xl font-black tracking-tight uppercase leading-[0.9] mb-6">
            Empowering <span className="text-brand-accent italic">Tomorrow's</span> Engineers.
          </h1>
          <p className="text-lg text-white/60 font-medium max-w-md">
            Join the elite community of ASTU developers and master the arts of software engineering through our intensive bootcamp programs.
          </p>
        </div>
        <div className="flex items-center gap-4 py-6 border-t border-white/10">
          <div className="flex -space-x-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-brand-sidebar bg-brand-accent flex items-center justify-center font-bold text-xs">
                {String.fromCharCode(64 + i)}
              </div>
            ))}
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-white/40">Trusted by 500+ ASTU Students</p>
        </div>
      </div>

      <div className="flex items-center justify-center p-8 bg-brand-primary">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-black uppercase tracking-tight text-text-main">Login to Dashboard</h2>
            <p className="text-text-muted mt-2 font-medium">Enter your credentials to access your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-brand-card p-8 rounded-2xl border border-brand-border shadow-2xl shadow-brand-accent/5">
            <FormField label="Email Address">
              <Input 
                type="email" 
                placeholder="name@astu.edu.et" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormField>
            <div>
              <FormField label="Password">
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </FormField>
              <div className="flex justify-end mt-1">
                <Link to="/forgot-password" className="text-[10px] font-bold text-brand-accent uppercase tracking-wider hover:underline">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-sm font-black uppercase tracking-widest group" disabled={loading}>
              {loading ? 'Authenticating...' : (
                <>
                  Enter Dashboard
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
            <p className="text-center text-sm font-medium text-text-muted mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-brand-accent font-black uppercase hover:underline">
                Sign Up
              </Link>
            </p>
          </form>


        </div>
      </div>
    </div>
  );
};
