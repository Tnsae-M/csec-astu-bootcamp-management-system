import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { Button, Card, FormField, Input } from '@/components/ui';
import { Lock, ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2, Loader2, Key } from 'lucide-react';
import Logo from '../../components/common/Logo';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (!token) {
      toast.error('Invalid or missing reset token.');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(token, password);
      setSuccess(true);
      toast.success('Security key updated successfully.');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update credentials.');
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
            Credential Reset
          </h1>
          <p className="text-[10px] text-text-muted mt-3 font-black uppercase tracking-[0.3em] italic">
            Establish New Security Parameters
          </p>
        </div>

        <Card className="p-8 md:p-10 border-none bg-white/80 backdrop-blur-md shadow-2xl shadow-brand-accent/5">
          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              <p className="text-sm text-text-muted font-medium leading-relaxed italic">
                Define your new security key. Ensure it meets the required complexity standards for account protection.
              </p>
              
              <FormField label="New Security Key" required>
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

              <FormField label="Confirm Security Key" required>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="pl-12"
                    placeholder="••••••••"
                    minLength={8}
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
                    Apply New Credentials
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
              </div>
              <h2 className="text-xl font-black text-text-main uppercase tracking-tight">Security Updated</h2>
              <p className="text-sm text-text-muted font-medium leading-relaxed italic">
                Your credentials have been successfully re-synchronized. You may now proceed to the identification portal.
              </p>
              <Button 
                onClick={() => navigate('/login')}
                className="w-full py-6 text-xs font-black uppercase tracking-widest shadow-lg shadow-brand-accent/20 group"
              >
                Proceed to Login
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          )}
        </Card>

        <div className="mt-10 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-brand-border/50 text-[9px] font-black uppercase tracking-[0.2em] text-text-muted shadow-sm">
            <ShieldCheck className="h-3 w-3 text-emerald-500" />
            End-to-End Encrypted Handshake
          </div>
        </div>
      </div>
    </div>
  );
}
