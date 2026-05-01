import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../app/store';
import { authService } from '../../services/auth.service';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { FormField } from '../../components/ui/FormField';
import { Logo } from '../../components/common/Logo';
import { ArrowRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'instructor'>('student');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.register({ name, email, password, role });
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-brand-sidebar text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-24 opacity-5 pointer-events-none">
            <Sparkles size={400} />
        </div>
        <div className="relative z-10">
          <Logo />
        </div>
        <div className="relative z-10">
          <h1 className="text-5xl font-black tracking-tight uppercase leading-[0.9] mb-6">
            Build the <span className="text-brand-accent italic">Future</span> <br />With ASTU.
          </h1>
          <p className="text-lg text-white/60 font-medium max-w-md">
            The CSEC-ASTU ecosystem is more than just a bootcamp—it's a launchpad for the next generation of Ethiopian tech leaders.
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-4 py-6 border-t border-white/10">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Official CSEC-ASTU Platform</p>
        </div>
      </div>

      <div className="flex items-center justify-center p-8 bg-brand-primary">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-black uppercase tracking-tight text-text-main">Create Account</h2>
            <p className="text-text-muted mt-2 font-medium">Join the software engineering excellence community.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 bg-brand-card p-8 rounded-2xl border border-brand-border shadow-2xl shadow-brand-accent/5">
            <FormField label="Full Name">
              <Input 
                placeholder="Abebe Bikila" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </FormField>
            <FormField label="Astu Email">
              <Input 
                type="email" 
                placeholder="name@astu.edu.et" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormField>
            <FormField label="Password">
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FormField>
            <FormField label="I am a...">
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => setRole('student')}
                  className={`py-3 rounded-xl border-2 transition-all font-black uppercase text-[10px] tracking-widest ${
                    role === 'student' ? 'border-brand-accent bg-brand-accent/5 text-brand-accent shadow-sm' : 'border-brand-border text-text-muted hover:border-brand-accent/50'
                  }`}
                >
                  Student
                </button>
                <button 
                  type="button"
                  onClick={() => setRole('instructor')}
                  className={`py-3 rounded-xl border-2 transition-all font-black uppercase text-[10px] tracking-widest ${
                    role === 'instructor' ? 'border-brand-accent bg-brand-accent/5 text-brand-accent shadow-sm' : 'border-brand-border text-text-muted hover:border-brand-accent/50'
                  }`}
                >
                  Instructor
                </button>
              </div>
            </FormField>

            <Button type="submit" className="w-full h-12 text-sm font-black uppercase tracking-widest group mt-4" disabled={loading}>
              {loading ? 'Creating Account...' : (
                <>
                  Register Now
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm font-medium text-text-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-accent font-black uppercase hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
