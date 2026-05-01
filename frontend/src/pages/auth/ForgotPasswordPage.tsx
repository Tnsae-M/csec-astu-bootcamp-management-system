import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { FormField } from '../../components/ui/FormField';
import { Logo } from '../../components/common/Logo';
import { ArrowRight, Mail } from 'lucide-react';
import { toast } from 'sonner';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSubmitted(true);
      toast.success('Password reset link sent to your email.');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send reset link');
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
          <h2 className="text-3xl font-black uppercase tracking-tight text-text-main">Reset Password</h2>
          <p className="text-text-muted mt-2 font-medium">We will send you instructions to reset it.</p>
        </div>

        {!submitted ? (
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

            <Button type="submit" className="w-full h-12 text-sm font-black uppercase tracking-widest group" disabled={loading}>
              {loading ? 'Sending...' : (
                <>
                  Send Reset Link
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
            
            <p className="text-center text-sm font-medium text-text-muted mt-4">
              Remembered your password?{' '}
              <Link to="/login" className="text-brand-accent font-black uppercase hover:underline">
                Log In
              </Link>
            </p>
          </form>
        ) : (
          <div className="bg-brand-card p-8 rounded-2xl border border-brand-border shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto">
              <Mail size={32} />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase">Check your email</h3>
              <p className="text-text-muted text-sm mt-2">
                We sent a password reset link to <span className="font-bold text-text-main">{email}</span>.
              </p>
            </div>
            <Link to="/login">
              <Button variant="outline" className="w-full mt-6 text-sm font-black uppercase tracking-widest">
                Return to Login
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
