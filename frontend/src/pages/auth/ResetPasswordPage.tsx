import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { FormField } from '../../components/ui/FormField';
import { Logo } from '../../components/common/Logo';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export const ResetPasswordPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (!token) {
      toast.error('Invalid or missing token');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(token, password);
      setSuccess(true);
      toast.success('Password has been reset successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reset password. The link might be expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-brand-primary">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tight text-text-main">Create New Password</h2>
          <p className="text-text-muted mt-2 font-medium">Your new password must be different from previously used passwords.</p>
        </div>

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-6 bg-brand-card p-8 rounded-2xl border border-brand-border shadow-2xl shadow-brand-accent/5">
            <FormField label="New Password">
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </FormField>
            <FormField label="Confirm New Password">
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </FormField>

            <Button type="submit" className="w-full h-12 text-sm font-black uppercase tracking-widest group" disabled={loading}>
              {loading ? 'Resetting...' : (
                <>
                  Reset Password
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>
        ) : (
          <div className="bg-brand-card p-8 rounded-2xl border border-brand-border shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase">Password Reset!</h3>
              <p className="text-text-muted text-sm mt-2">
                Your password has been successfully reset. You can now log in with your new password.
              </p>
            </div>
            <Link to="/login">
              <Button className="w-full mt-6 text-sm font-black uppercase tracking-widest">
                Log In Now
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
