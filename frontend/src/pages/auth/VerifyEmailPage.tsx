import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { Button } from '../../components/ui/Button';
import { Logo } from '../../components/common/Logo';
import { CheckCircle2, XCircle } from 'lucide-react';

export const VerifyEmailPage = () => {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setErrorMsg('Invalid or missing verification token.');
        setLoading(false);
        return;
      }
      try {
        await authService.verifyEmail(token);
        setSuccess(true);
      } catch (error: any) {
        setErrorMsg(error.response?.data?.message || 'Verification failed. The link might be expired or invalid.');
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-brand-primary">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>
        
        <div className="bg-brand-card p-8 rounded-2xl border border-brand-border shadow-2xl space-y-6">
          {loading ? (
            <div className="py-8">
              <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-xl font-black uppercase">Verifying Email...</h3>
              <p className="text-text-muted text-sm mt-2">Please wait while we verify your email address.</p>
            </div>
          ) : success ? (
            <>
              <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase">Email Verified!</h3>
                <p className="text-text-muted text-sm mt-2">
                  Your email has been successfully verified. You can now access your dashboard.
                </p>
              </div>
              <Link to="/login">
                <Button className="w-full mt-6 text-sm font-black uppercase tracking-widest">
                  Log In Now
                </Button>
              </Link>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-danger/10 text-danger rounded-full flex items-center justify-center mx-auto">
                <XCircle size={32} />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase">Verification Failed</h3>
                <p className="text-text-muted text-sm mt-2">
                  {errorMsg}
                </p>
              </div>
              <Link to="/login">
                <Button variant="outline" className="w-full mt-6 text-sm font-black uppercase tracking-widest">
                  Return to Login
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
