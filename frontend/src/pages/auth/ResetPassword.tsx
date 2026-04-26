// import React, { useState } from 'react';
// import { useNavigate, useSearchParams, Link } from 'react-router-dom';
// import { Button } from '@/src/components/ui';
// import Logo from '../../components/common/Logo';
// import { authService } from '../../services/auth.service';

// export default function ResetPassword() {
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [searchParams] = useSearchParams();
//   const token = searchParams.get('token');
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (password !== confirmPassword) return setError("Passwords do not match");
//     if (!token) return setError("Invalid or missing reset token");
    
//     setLoading(true);
//     try {
//       await authService.resetPassword({ token, password });
//       alert("Password updated successfully. You can now login.");
//       navigate('/login');
//     } catch (err: any) {
//       setError(err.response?.data?.message || "Failed to reset password");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-brand-primary px-4">
//       <div className="max-w-md w-full">
//         <div className="text-center mb-10">
//           <Link to="/" className="inline-block mb-3"><Logo size="lg" className="mx-auto" /></Link>
//           <h1 className="text-3xl font-black text-text-main tracking-tighter uppercase">New Key</h1>
//         </div>

//         <div className="geo-card p-10">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label className="block text-xs font-black text-text-muted mb-2 uppercase tracking-[0.2em]">New Password</label>
//               <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 rounded-lg bg-brand-primary/50 border border-brand-border text-text-main focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 outline-none transition-all font-medium text-sm" />
//             </div>
//             <div>
//               <label className="block text-xs font-black text-text-muted mb-2 uppercase tracking-[0.2em]">Confirm New Password</label>
//               <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full px-4 py-3 rounded-lg bg-brand-primary/50 border border-brand-border text-text-main focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 outline-none transition-all font-medium text-sm" />
//             </div>
//             <Button type="submit" isLoading={loading} className="w-full py-4 text-sm font-black uppercase tracking-widest shadow-lg shadow-brand-accent/20">Update Password</Button>
//           </form>
//           {error && <p className="text-red-600 text-xs mt-4 text-center font-bold uppercase tracking-wider">{error}</p>}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button } from '@/src/components/ui';
import Logo from '../../components/common/Logo';
import { authService } from '../../services/auth.service';

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>(); // Capture the token
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError("Passwords do not match");
    if (!token) return setError("Invalid session");
    
    setLoading(true);
    try {
      // Pass the token and password to your service
      await authService.resetPassword({ token, password });
      alert("Password reset successful.");
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-primary px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <Link to="/" className="inline-block mb-3"><Logo size="lg" className="mx-auto" /></Link>
          <h1 className="text-3xl font-black text-text-main tracking-tighter uppercase">New Key</h1>
        </div>

        <div className="geo-card p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-text-muted mb-2 uppercase tracking-[0.2em]">New Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 rounded-lg bg-brand-primary/50 border border-brand-border text-text-main focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 outline-none transition-all font-medium text-sm" />
            </div>
            <div>
              <label className="block text-xs font-black text-text-muted mb-2 uppercase tracking-[0.2em]">Confirm New Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full px-4 py-3 rounded-lg bg-brand-primary/50 border border-brand-border text-text-main focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 outline-none transition-all font-medium text-sm" />
            </div>
            <Button type="submit" isLoading={loading} className="w-full py-4 text-sm font-black uppercase tracking-widest shadow-lg shadow-brand-accent/20">Update Password</Button>
          </form>
          {error && <p className="text-red-600 text-xs mt-4 text-center font-bold uppercase tracking-wider">{error}</p>}
        </div>
      </div>
    </div>
  );
}