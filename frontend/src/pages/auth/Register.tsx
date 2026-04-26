// import React from 'react';
// import { Button } from '@/src/components/ui';
// import { Link } from 'react-router-dom';
// import Logo from '../../components/common/Logo';

// export default function Register() {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-brand-primary px-4 selection:bg-brand-accent selection:text-brand-primary overflow-y-auto">
//       <div className="max-w-md w-full text-center">
//         <div className="mb-10">
//           <Link to="/" className="inline-block mb-3">
//             <Logo size="lg" className="mx-auto" />
//           </Link>
//           <h1 className="text-3xl font-black text-text-main tracking-tighter uppercase">
//             CSEC Portal
//           </h1>
//           <p className="text-text-muted mt-2 font-bold uppercase tracking-widest text-xs">Division Learning Platform</p>
//         </div>

//         <div className="geo-card p-10">
//           <h2 className="text-2xl font-black text-text-main uppercase tracking-tighter mb-4">Registration Locked</h2>
//           <p className="mb-8 text-text-muted font-bold text-xs uppercase tracking-widest leading-relaxed">
//             Direct registration is currently restricted. Please contact your Division Head or Administrator to receive your unique Education ID and Identity Key.
//           </p>
//           <Link to="/login" className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] hover:text-brand-accent transition-colors">
//             ← Back to Login
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }


// import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { useNavigate, Link } from 'react-router-dom';
// import { Button } from '@/src/components/ui';
// import Logo from '../../components/common/Logo';
// import { authService } from '../../services/auth.service';

// export default function Register() {
//   const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'STUDENT' });
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleRegister = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await authService.register(formData);
//       alert("Registration successful! Please check your email to verify your account.");
//       navigate('/login');
//     } catch (err: any) {
//       alert(err.response?.data?.message || "Registration failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-brand-primary px-4">
//       <div className="max-w-md w-full">
//         <div className="text-center mb-10">
//           <h1 className="text-3xl font-black text-text-main tracking-tighter uppercase">Create Account</h1>
//         </div>
//         <div className="geo-card p-10">
//           <form onSubmit={handleRegister} className="space-y-6">
//             <input type="text" placeholder="Full Name" className="w-full px-4 py-3 rounded-lg bg-brand-primary/50 border border-brand-border" onChange={(e) => setFormData({...formData, name: e.target.value})} required />
//             <input type="email" placeholder="Email" className="w-full px-4 py-3 rounded-lg bg-brand-primary/50 border border-brand-border" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
//             <input type="password" placeholder="Password" className="w-full px-4 py-3 rounded-lg bg-brand-primary/50 border border-brand-border" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
//             <Button type="submit" isLoading={loading} className="w-full">Register</Button>
//           </form>
//           <p className="mt-6 text-center text-xs text-text-muted">
//             Already have an account? <Link to="/login" className="text-brand-accent">Login</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }


// import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { useNavigate, Link } from 'react-router-dom';
// import { Button } from '@/src/components/ui';
// import Logo from '../../components/common/Logo';
// import { authService } from '../../services/auth.service';

// export default function Register() {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleRegister = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     try {
//       await authService.register({ name, email, password, role: 'STUDENT' });
//       alert("Registration successful. Please verify your email.");
//       navigate('/login');
//     } catch (err: any) {
//       setError(err.response?.data?.message || "Registration failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-brand-primary px-4 selection:bg-brand-accent selection:text-brand-primary overflow-y-auto">
//       <div className="max-w-md w-full">
//         <div className="text-center mb-10">
//           <Link to="/" className="inline-block mb-3">
//             <Logo size="lg" className="mx-auto" />
//           </Link>
//           <h1 className="text-3xl font-black text-text-main tracking-tighter uppercase">CSEC Portal</h1>
//           <p className="text-text-muted mt-2 font-bold uppercase tracking-widest text-xs">Create New Account</p>
//         </div>

//         <div className="geo-card p-10">
//           <form onSubmit={handleRegister} className="space-y-6">
//             <div>
//               <label className="block text-xs font-black text-text-muted mb-2 uppercase tracking-[0.2em]">Full Name</label>
//               <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-3 rounded-lg bg-brand-primary/50 border border-brand-border text-text-main focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 outline-none transition-all font-medium text-sm" />
//             </div>
//             <div>
//               <label className="block text-xs font-black text-text-muted mb-2 uppercase tracking-[0.2em]">Educational Email</label>
//               <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-lg bg-brand-primary/50 border border-brand-border text-text-main focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 outline-none transition-all font-medium text-sm" />
//             </div>
//             <div>
//               <label className="block text-xs font-black text-text-muted mb-2 uppercase tracking-[0.2em]">Identity Key</label>
//               <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 rounded-lg bg-brand-primary/50 border border-brand-border text-text-main focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 outline-none transition-all font-medium text-sm" />
//             </div>
//             <Button type="submit" isLoading={loading} className="w-full py-4 text-sm font-black uppercase tracking-widest shadow-lg shadow-brand-accent/20">Register</Button>
//           </form>

//           {error && <p className="text-red-600 text-xs mt-4 text-center font-bold uppercase tracking-wider">{error}</p>}

//           <div className="mt-8 pt-6 border-t border-brand-border space-y-4 text-center">
//             <p className="text-[11px] text-text-muted font-bold uppercase tracking-widest">
//               Already have an account? <Link to="/login" className="text-brand-accent hover:underline decoration-2 underline-offset-4">Login here</Link>
//             </p>
//             <div>
//               <Link to="/" className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] hover:text-brand-accent transition-colors">
//                 ← Back to Portal
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/src/components/ui';
import Logo from '../../components/common/Logo';
import { authService } from '../../services/auth.service';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.register({ name, email, password, });
      alert("Registration successful. Please verify your email.");
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-primary px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <Link to="/" className="inline-block mb-3"><Logo size="lg" className="mx-auto" /></Link>
          <h1 className="text-3xl font-black text-text-main tracking-tighter uppercase">CSEC Portal</h1>
          <p className="text-text-muted mt-2 font-bold uppercase tracking-widest text-xs">Create New Account</p>
        </div>

        <div className="geo-card p-10">
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-text-muted mb-2 uppercase tracking-[0.2em]">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-3 rounded-lg bg-brand-primary/50 border border-brand-border text-text-main focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 outline-none transition-all font-medium text-sm" />
            </div>
            <div>
              <label className="block text-xs font-black text-text-muted mb-2 uppercase tracking-[0.2em]">Educational Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-lg bg-brand-primary/50 border border-brand-border text-text-main focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 outline-none transition-all font-medium text-sm" />
            </div>
            <div>
              <label className="block text-xs font-black text-text-muted mb-2 uppercase tracking-[0.2em]">Identity Key</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 rounded-lg bg-brand-primary/50 border border-brand-border text-text-main focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 outline-none transition-all font-medium text-sm" />
            </div>
            <Button type="submit" isLoading={loading} className="w-full py-4 text-sm font-black uppercase tracking-widest shadow-lg shadow-brand-accent/20">Register</Button>
          </form>

          {error && <p className="text-red-600 text-xs mt-4 text-center font-bold uppercase tracking-wider">{error}</p>}

          <div className="mt-8 pt-6 border-t border-brand-border space-y-4 text-center">
            <p className="text-[11px] text-text-muted font-bold uppercase tracking-widest">
              Already have an account? <Link to="/login" className="text-brand-accent hover:underline decoration-2 underline-offset-4">Login here</Link>
            </p>
          </div>
          <div className="mt-8 pt-6 border-t border-brand-border text-center">
              <Link to="/" className="text-[11px] font-black text-text-muted uppercase tracking-widest hover:text-brand-accent transition-colors">← Back to Home</Link>
            </div>
        </div>
      </div>
    </div>
  );
}