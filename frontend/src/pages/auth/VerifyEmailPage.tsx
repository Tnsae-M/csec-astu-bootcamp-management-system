import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { Button, Card } from '@/components/ui';
import { CheckCircle2, XCircle, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import Logo from '../../components/common/Logo';

export default function VerifyEmailPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link.');
        return;
      }

      try {
        const response = await authService.verifyEmail(token);
        setStatus('success');
        setMessage(response.message || 'Account successfully activated!');
      } catch (error: any) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Verification failed. The link may be expired or invalid.');
      }
    };

    verify();
  }, [token]);

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
            Account Activation
          </h1>
          <p className="text-[10px] text-text-muted mt-3 font-black uppercase tracking-[0.3em] italic">
            Security & Access Verification
          </p>
        </div>

        <Card className="p-8 md:p-10 border-none bg-white/80 backdrop-blur-md shadow-2xl shadow-brand-accent/5">
          {status === 'loading' && (
            <div className="flex flex-col items-center py-10">
              <Loader2 className="h-12 w-12 text-brand-accent animate-spin mb-6" />
              <p className="text-sm font-black uppercase tracking-widest text-text-muted">Verifying Identity...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
              </div>
              <h2 className="text-xl font-black text-text-main uppercase tracking-tight">Activation Successful</h2>
              <p className="text-sm text-text-muted font-medium leading-relaxed italic">
                {message} You can now access your dashboard using your security credentials.
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

          {status === 'error' && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-red-50 text-red-600 border border-red-100">
                  <XCircle className="h-10 w-10" />
                </div>
              </div>
              <h2 className="text-xl font-black text-text-main uppercase tracking-tight">Activation Failed</h2>
              <p className="text-sm text-text-muted font-medium leading-relaxed italic">
                {message}
              </p>
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={() => navigate('/login')}
                  variant="outline"
                  className="w-full py-6 text-xs font-black uppercase tracking-widest border-brand-border text-text-muted hover:text-text-main"
                >
                  Return to Login
                </Button>
              </div>
            </div>
          )}
        </Card>

        <div className="mt-10 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-brand-border/50 text-[9px] font-black uppercase tracking-[0.2em] text-text-muted shadow-sm">
            <ShieldCheck className="h-3 w-3 text-emerald-500" />
            Verified via CSEC Auth Protocol
          </div>
        </div>
      </div>
    </div>
  );
}
