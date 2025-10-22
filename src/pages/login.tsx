import { useState } from 'react';
import Router from 'next/router';
import NavBar from '@/components/nav';
import Footer from '@/components/footar';
import { useAuth } from '@/lib/hooks/auth';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login } = useAuth();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(username, password);
      // First-login password change enforcement
      const role = user?.role || 'MEMBER';
      const isChanged = !!user?.is_password_changed;
      if (!isChanged) {
        const payload = {
          email: user?.email,
          name: user?.first_name || user?.username,
          role,
        };
        const token = typeof window !== 'undefined' ? btoa(JSON.stringify(payload)) : '';
        Router.push(`/account/${token}`);
        return;
      }
      if (role === 'ADMIN') Router.push('/dashboard/admin');
      else if (role === 'AMBASSADOR') Router.push('/dashboard/ambassador');
      else if (role === 'ALUMNI') Router.push('/dashboard/alumni');
      else Router.push('/dashboard/member');
    } catch (e) {
      setError('Login failed');
    }
  };

  return (
    <>
      <NavBar />
      <div className="bg-black text-white min-h-screen flex items-center justify-center p-4">
        <form onSubmit={submit} className="bg-gray-900 p-8 rounded w-full max-w-md space-y-4">
          <h1 className="text-2xl font-semibold">Login</h1>
          {error && <div className="text-red-400">{error}</div>}
          <input className="w-full p-3 rounded bg-gray-800" placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)} />
          <input className="w-full p-3 rounded bg-gray-800" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
          <button className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded">Login</button>
          <a className="text-sm text-blue-400" href="/reset-password">Forgot password?</a>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default LoginPage;
