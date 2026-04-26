// import { useSearchParams, Link } from 'react-router-dom';
// import { authService } from '../../services/auth.service';
// import Logo from '../../components/common/Logo';

// export default function VerifyEmail() {
//   const [searchParams] = useSearchParams();
//   const token = searchParams.get('token');
//   const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

//   useEffect(() => {
//     if (token) {
//       authService.verifyEmail(token)
//         .then(() => setStatus('success'))
//         .catch(() => setStatus('error'));
//     } else {
//       setStatus('error');
//     }
//   }, [token]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-brand-primary px-4">
//       <div className="max-w-md w-full text-center">
//         <Logo size="lg" className="mx-auto mb-6" />
//         <div className="geo-card p-10">
//           {status === 'loading' && <h2 className="text-xl font-black text-text-main uppercase tracking-widest">Verifying...</h2>}
//           {status === 'success' && (
//             <>
//               <h2 className="text-2xl font-black text-green-500 mb-4 uppercase">Verified</h2>
//               <p className="text-text-muted mb-6 font-bold uppercase text-xs">Your account is now active.</p>
//               <Link to="/login" className="text-brand-accent font-black uppercase tracking-widest hover:underline">Proceed to Login</Link>
//             </>
//           )}
//           {status === 'error' && (
//             <>
//               <h2 className="text-2xl font-black text-red-500 mb-4 uppercase">Verification Failed</h2>
//               <p className="text-text-muted mb-6 font-bold uppercase text-xs">The link may be expired or invalid.</p>
//               <Link to="/register" className="text-brand-accent font-black uppercase tracking-widest hover:underline">Back to Register</Link>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


// import React, { useEffect, useState } from 'react';
// import { useParams, Link, useNavigate } from 'react-router-dom';
// import { authService } from '../../services/auth.service';
// import Logo from '../../components/common/Logo';

// export default function VerifyEmail() {
//   const { token } = useParams<{ token: string }>();
//   const navigate = useNavigate(); // 1. Initialize the navigate hook
//   const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

//   useEffect(() => {
//     if (token) {
//       authService.verifyEmail(token)
//         .then(() => setStatus('success'))
//         .catch(() => setStatus('error'));
//     } else {
//       setStatus('error');
//     }
//   }, [token]);

//   // 2. Add this Effect to handle the redirection
//   useEffect(() => {
//     if (status === 'success') {
//       const timer = setTimeout(() => {
//         navigate('/login');
//       }, 3000); // Redirects after 3 seconds
      
//       return () => clearTimeout(timer); // Cleanup timer if component unmounts
//     }
//   }, [status, navigate]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-brand-primary px-4">
//       <div className="max-w-md w-full text-center">
//         <Logo size="lg" className="mx-auto mb-6" />
//         <div className="geo-card p-10">
//           {status === 'loading' && (
//              <h2 className="text-xl font-black text-text-main">Verifying...</h2>
//           )}
          
//           {status === 'success' && (
//             <>
//               <h2 className="text-2xl font-black text-green-500 mb-4 uppercase">Verified!</h2>
//               <p className="text-text-muted mb-6">Your account is ready. Redirecting you to login in 3 seconds...</p>
//               <Link to="/login" className="text-brand-accent font-black uppercase underline">Click here if not redirected</Link>
//             </>
//           )}
          
//           {status === 'error' && (
//             <>
//               <h2 className="text-2xl font-black text-red-500 mb-4 uppercase">Verification Failed</h2>
//               <p className="text-text-muted mb-6">The link is invalid or expired.</p>
//               <Link to="/register" className="text-brand-accent font-black uppercase underline">Back to Register</Link>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import Logo from '../../components/common/Logo';

export default function VerifyEmail() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
  if (!token) {
    setStatus('error');
    return;
  }

  authService.verifyEmail(token)
    .then(() => {
      setStatus('success');
    })
    .catch((err) => {
      //  KEY FIX: treat already-used token as success
      if (err.response?.data?.message?.includes("already")) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    });
}, [token]);


  // 2. Watch for status change and redirect
  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        navigate('/login'); // This redirects the user after 3 seconds
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [status, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-primary px-4">
      <div className="max-w-md w-full text-center">
        <Logo size="lg" className="mx-auto mb-6" />
        <div className="geo-card p-10">
          {status === 'loading' && <h2 className="text-xl font-black text-text-main">Verifying...</h2>}
          
          {status === 'success' && (
            <>
              <h2 className="text-2xl font-black text-green-500 mb-4 uppercase">Verified!</h2>
              <p className="text-text-muted mb-6">Your account is ready. Redirecting to login...</p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <h2 className="text-2xl font-black text-red-500 mb-4 uppercase">Verification Failed</h2>
              <p className="text-text-muted mb-6">The link is invalid or already used.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}