import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import NavBar from '@/components/nav';
import Footer from '@/components/footar';

type GI = { id: string; title?: string; description?: string; image: string; created_at: string };

export default function GalleryPage() {
  const [rows, setRows] = useState<GI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('/api/app/gallery/list');
        const data = await r.json();
        setRows(Array.isArray(data) ? data : []);
      } catch {}
      setLoading(false);
    })();
  }, []);

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-6xl mx-auto pt-28 px-4">
          <h1 className="text-3xl font-bold mb-6">Gallery</h1>
          {loading ? (
            <div className="text-gray-400">Loading...</div>
          ) : (
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-3">
              {rows.length === 0 ? (
                <div className="text-gray-400">No images yet.</div>
              ) : (
                rows.map((g) => (
                  <div key={g.id} className="mb-3 break-inside-avoid">
                    <Image src={g.image} alt={g.title || 'Gallery'} width={800} height={600} className="w-full rounded-lg" />
                    {g.title && <div className="mt-1 text-sm text-gray-300">{g.title}</div>}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
