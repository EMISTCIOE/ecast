import Link from 'next/link';
import { useEffect, useState } from 'react';
import NavBar from '@/components/nav';
import Footer from '@/components/footar';

type PublicUser = { id: string; username: string; full_name: string; role: string };

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
              <Link key={u.id} href={`/ambassadors/${u.id}`} className="block bg-gray-900 p-4 rounded border border-gray-800 hover:border-blue-600">
                <div className="text-lg font-semibold">{u.full_name || u.username}</div>
                <div className="text-sm text-gray-400">View approved blog posts</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
