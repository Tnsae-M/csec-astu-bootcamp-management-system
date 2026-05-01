import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link, useParams } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { Button, Card } from '@/components/ui';
import { CheckCircle2, XCircle, Loader2, ArrowRight, ShieldCheck, Mail, RefreshCw, KeyRound } from 'lucide-react';
import Logo from '../../components/common/Logo';
import { toast } from 'sonner';

export default function VerifyEmailPage() {
  const { token: tokenFromParams } = useParams();
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || tokenFromParams;
  const emailFromUrl = searchParams.get('email');
  
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'idle'>('idle');
  const [message, setMessage] = useState('');
  const [otp, setOtp] = useState(tokenFromUrl || '');
  const [email, setEmail] = useState(emailFromUrl || '');
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (tokenFromUrl && emailFromUrl) {
      handleVerify(tokenFromUrl);
    }
  }, [tokenFromUrl, emailFromUrl]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleVerify = async (tokenToUse: string) => {
    if (!tokenToUse) {
      toast.error('Please enter a verification code');
      return;
    }

    setStatus('loading');
    try {
      const response = await authService.verifyEmail(tokenToUse);
      setStatus('success');
      setMessage(response.message || 'Account successfully activated!');
      toast.success('Account activated!');
    } catch (error: any) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Verification failed. The code may be expired or invalid.');
      toast.error('Verification failed');
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error('Please enter your email address to resend the code');
      return;
    }

    setIsResending(true);
    try {
      await authService.resendVerification(email);
      toast.success('A new verification code has been sent to your email.');
      setResendTimer(60); // 60s cooldown
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to resend code');
    } finally {
      setIsResending(false);
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

          {(status === 'error' || status === 'idle') && (
            <div className="space-y-6">
              {status === 'error' && (
                <div className="flex justify-center mb-2">
                  <div className="p-4 rounded-full bg-red-50 text-red-600 border border-red-100">
                    <XCircle className="h-10 w-10" />
                  </div>
                </div>
              )}
              
              <div className="text-left space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-accent" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-12 pr-4 py-4 bg-brand-primary/50 border border-brand-border rounded-xl focus:ring-2 focus:ring-brand-accent/20 transition-all outline-none text-sm font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Verification Code (OTP)</label>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-accent" />
                    <input 
                      type="text" 
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      placeholder="6-digit code"
                      className="w-full pl-12 pr-4 py-4 bg-brand-primary/50 border border-brand-border rounded-xl focus:ring-2 focus:ring-brand-accent/20 transition-all outline-none text-center text-xl font-black tracking-[0.5em]"
                    />
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => handleVerify(otp)}
                disabled={otp.length < 6}
                className="w-full py-6 text-xs font-black uppercase tracking-widest shadow-lg shadow-brand-accent/20"
              >
                Activate Account
              </Button>

              <div className="pt-4 border-t border-brand-border/50">
                <button
                  onClick={handleResend}
                  disabled={isResending || resendTimer > 0}
                  className="flex items-center justify-center gap-2 w-full text-[10px] font-black uppercase tracking-widest text-brand-accent hover:text-brand-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResending ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <RefreshCw className="h-3 w-3" />
                  )}
                  {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend Verification Code'}
                </button>
              </div>

              <Link to="/login" className="block text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-text-main transition-colors mt-4">
                Back to Login
              </Link>
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
