import { useEffect, useState } from 'react';
import NavBar from '@/components/nav';
import Footer from '@/components/footar';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const fetchMe = async () => {
      const r = await fetch('/api/app/auth/profile', { headers: { 'Authorization': `Bearer ${localStorage.getItem('access')}` } });
      if (r.ok) {
        const u = await r.json();
        setUser(u);
        setFirst(u.first_name || '');
        setLast(u.last_name || '');
        setLinkedin(u.linkedin_url || '');
        setGithub(u.github_url || '');
      }
    };
    fetchMe();
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    const form = new FormData();
    form.append('first_name', first);
    form.append('last_name', last);
    form.append('linkedin_url', linkedin);
    form.append('github_url', github);
    if (photo) form.append('photo', photo);
    const r = await fetch('/api/app/auth/profile', { method: 'PATCH', headers: { 'Authorization': `Bearer ${localStorage.getItem('access')}` }, body: form as any } as any);
    if (r.ok) {
      const u = await r.json();
      setUser(u);
      localStorage.setItem('user', JSON.stringify(u));
      setMsg('Profile updated');
    } else setMsg('Update failed');
  };

  return (
    <>
      <NavBar />
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white min-h-screen p-6">
        <div className="max-w-2xl mx-auto bg-gray-900/60 border border-gray-800 rounded-xl p-6 mt-20">
          <h1 className="text-2xl font-semibold mb-4">My Profile</h1>
          {msg && <div className="mb-3 text-sm text-gray-300">{msg}</div>}
          <form onSubmit={save} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm mb-1">First name</label>
                <input className="w-full p-3 bg-gray-800 rounded" value={first} onChange={e=>setFirst(e.target.value)} />
              </div>
              <div className="flex-1">
                <label className="block text-sm mb-1">Last name</label>
                <input className="w-full p-3 bg-gray-800 rounded" value={last} onChange={e=>setLast(e.target.value)} />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm mb-1">LinkedIn</label>
                <input className="w-full p-3 bg-gray-800 rounded" value={linkedin} onChange={e=>setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." />
              </div>
              <div className="flex-1">
                <label className="block text-sm mb-1">GitHub</label>
                <input className="w-full p-3 bg-gray-800 rounded" value={github} onChange={e=>setGithub(e.target.value)} placeholder="https://github.com/username" />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">Profile photo</label>
              <input type="file" accept="image/*" className="w-full p-3 bg-gray-800 rounded" onChange={e=>setPhoto(e.target.files?.[0] || null)} />
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">Save</button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
