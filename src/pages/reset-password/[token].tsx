import { useRouter } from 'next/router';
import { useState } from 'react';
import NavBar from '@/components/nav';
import Footer from '@/components/footar';

export default function ResetPasswordJWTPage() {
  const router = useRouter();
  const { token } = router.query as { token?: string };
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(''); setError('');
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';
      const r = await fetch(`${base}/api/auth/password-reset/confirm-jwt/`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: newPassword })
      });
      if (!r.ok) throw new Error('fail');
      setMessage('Password reset successful. You can now login.');
    } catch (e) {
      setError('Invalid or expired reset link');
    }
  };

  return (
    <>
      <NavBar />
      <div className="bg-black text-white min-h-screen flex items-center justify-center p-4">
        <form onSubmit={submit} className="bg-gray-900 p-8 rounded w-full max-w-md space-y-4">
          <h1 className="text-2xl font-semibold">Set a new password</h1>
          {message && <div className="text-green-400">{message}</div>}
          {error && <div className="text-red-400">{error}</div>}
          <input className="w-full p-3 rounded bg-gray-800" placeholder="New password" type="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} />
          <button className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded">Reset Password</button>
        </form>
      </div>
      <Footer />
    </>
  );
}

