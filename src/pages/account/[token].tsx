import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import NavBar from '@/components/nav';
import Footer from '@/components/footar';

export default function AccountFirstLogin() {
  const router = useRouter();
  const { token } = router.query as { token?: string };
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    try {
      const raw = atob(token);
      const data = JSON.parse(raw);
      setEmail(data.email || '');
      setName(data.name || '');
      setRole(data.role || '');
    } catch (e) {
      // ignore invalid token
    }
  }, [token]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(''); setError('');
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';
      const r = await fetch(`${base}/api/auth/password/change/`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, current_password: currentPassword, new_password: newPassword })
      });
      if (!r.ok) throw new Error('fail');
      setMessage('Password changed successfully. Please login again.');
    } catch (e) {
      setError('Password change failed. Check your current password.');
    }
  };

  return (
    <>
      <NavBar />
      <div className="bg-black text-white min-h-screen flex items-center justify-center p-4">
        <form onSubmit={submit} className="bg-gray-900 p-8 rounded w-full max-w-md space-y-4">
          <h1 className="text-2xl font-semibold">Update your password</h1>
          <div className="text-sm text-gray-300">{name} • {role}</div>
          {message && <div className="text-green-400">{message}</div>}
          {error && <div className="text-red-400">{error}</div>}
          <input className="w-full p-3 rounded bg-gray-800" placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <input className="w-full p-3 rounded bg-gray-800" placeholder="Current temporary password" type="password" value={currentPassword} onChange={(e)=>setCurrentPassword(e.target.value)} />
          <input className="w-full p-3 rounded bg-gray-800" placeholder="New password" type="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} />
          <button className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded">Change Password</button>
          <a className="text-sm text-blue-400" href="/login">Back to login</a>
        </form>
      </div>
      <Footer />
    </>
  );
}

