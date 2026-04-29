import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { Button, Card, FormField, Input } from '@/components/ui';
import { Mail, ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';
import Logo from '../../components/common/Logo';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSubmitted(true);
      toast.success('Reset link sent to your email.');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-primary px-4 relative overflow-hidden">
      {/* BACKGROUND DECORATION */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-accent blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-accent blur-[120px]" />
      </div>

      <div className="max-w-md w-full relative z-10 text-center">
        <div className="mb-10">
          <div className="inline-flex p-4 rounded-3xl bg-white shadow-xl shadow-brand-accent/10 mb-6 border border-brand-border/50">
            <Logo size="lg" />
          </div>
          <h1 className="text-3xl font-black text-text-main tracking-tight uppercase leading-none">
            Credential Recovery
          </h1>
          <p className="text-[10px] text-text-muted mt-3 font-black uppercase tracking-[0.3em] italic">
            Restore Account Synchronization
          </p>
        </div>

        <Card className="p-8 md:p-10 border-none bg-white/80 backdrop-blur-md shadow-2xl shadow-brand-accent/5">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-sm text-text-muted font-medium leading-relaxed italic text-left">
                Enter your scholastic email address. We will transmit a secure synchronization key to reset your credentials.
              </p>
              
              <FormField label="Educational Email" required>
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

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-6 text-xs font-black uppercase tracking-widest shadow-lg shadow-brand-accent/20 group"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Transmit Reset Link
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>

              <Link to="/login" className="inline-flex items-center text-[10px] font-black text-text-muted uppercase tracking-[0.2em] hover:text-brand-accent transition-colors group">
                <ArrowLeft className="mr-2 h-3 w-3 group-hover:-translate-x-1 transition-transform" />
                Return to Portal
              </Link>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
              </div>
              <h2 className="text-xl font-black text-text-main uppercase tracking-tight">Transmission Complete</h2>
              <p className="text-sm text-text-muted font-medium leading-relaxed italic">
                If an account exists for <span className="text-brand-accent font-black">{email}</span>, you will receive reset instructions shortly. Please check your inbox and spam folder.
              </p>
              <Button 
                onClick={() => navigate('/login')}
                variant="outline"
                className="w-full py-6 text-xs font-black uppercase tracking-widest border-brand-border text-text-muted hover:text-text-main"
              >
                Return to Login
              </Button>
            </div>
          )}
        </Card>

        <div className="mt-10 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-brand-border/50 text-[9px] font-black uppercase tracking-[0.2em] text-text-muted shadow-sm">
            <ShieldCheck className="h-3 w-3 text-emerald-500" />
            Recovery Protocol Active
          </div>
        </div>
      </div>
    </div>
  );
}
