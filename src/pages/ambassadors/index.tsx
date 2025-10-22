import Link from 'next/link';
import { useEffect, useState } from 'react';
import NavBar from '@/components/nav';
import Footer from '@/components/footar';

type PublicUser = { id: string; username: string; full_name: string; role: string; photo?: string; linkedin_url?: string; github_url?: string };

export default function AmbassadorsIndex() {
  const [items, setItems] = useState<PublicUser[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('/api/app/users/public?role=AMBASSADOR');
        const data = await r.json();
        setItems(Array.isArray(data) ? data : []);
      } catch {}
    })();
  }, []);

  return (
    <>
      <NavBar />
      <div className="bg-black text-white min-h-screen">
        <div className="max-w-5xl mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6">Ambassadors</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(u => (
              <div key={u.id} className="bg-gray-900 p-4 rounded border border-gray-800 hover:border-blue-600 transition">
                <div className="flex items-center gap-3">
                  <img src={u.photo || '/assets/placeholder.png'} alt={u.username} className="w-12 h-12 rounded-full object-cover border border-gray-700" />
                  <div>
                    <div className="text-lg font-semibold">{u.full_name || u.username}</div>
                    <div className="text-xs text-gray-400">Ambassador</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-3 text-sm">
                  {u.linkedin_url && <a href={u.linkedin_url} target="_blank" className="text-blue-400 hover:text-blue-300">LinkedIn</a>}
                  {u.github_url && <a href={u.github_url} target="_blank" className="text-gray-300 hover:text-white">GitHub</a>}
                  <Link href={`/ambassadors/${u.id}`} className="ml-auto text-yellow-400 hover:text-yellow-300">Blogs →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
