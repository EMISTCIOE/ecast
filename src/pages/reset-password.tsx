import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NavBar from '@/components/nav';
import Footer from '@/components/footar';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { uid, token } = router.query as { uid?: string; token?: string };
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

  const requestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(''); setError('');
    const res = await fetch(`${base}/api/auth/password-reset/request-jwt/`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, base_url: window.location.origin })
    });
    if (res.ok) setMessage('If the email exists, a reset link has been sent.');
    else setError('Failed to request reset');
  };

  const confirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(''); setError('');
    const res = await fetch(`${base}/api/auth/password-reset/confirm/`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, token, new_password: newPassword })
    });
    if (res.ok) { setMessage('Password reset successful. You can now login.'); }
    else setError('Invalid or expired reset link');
  };

  const hasToken = !!uid && !!token;

  return (
    <>
      <NavBar />
      <div className="bg-black text-white min-h-screen flex items-center justify-center p-4">
        <div className="bg-gray-900 p-8 rounded w-full max-w-md space-y-4">
          {!hasToken ? (
            <>
              <h1 className="text-2xl font-semibold">Request password reset</h1>
              {message && <div className="text-green-400">{message}</div>}
              {error && <div className="text-red-400">{error}</div>}
              <form onSubmit={requestReset} className="space-y-3">
                <input className="w-full p-3 rounded bg-gray-800" placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
                <button className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded">Send reset link</button>
              </form>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold">Set a new password</h1>
              {message && <div className="text-green-400">{message}</div>}
              {error && <div className="text-red-400">{error}</div>}
              <form onSubmit={confirmReset} className="space-y-3">
                <input className="w-full p-3 rounded bg-gray-800" placeholder="New password" type="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} />
                <button className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded">Reset Password</button>
              </form>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
