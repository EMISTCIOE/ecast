import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import NavBar from '@/components/nav';
import Footer from '@/components/footar';

type Blog = { id: string; slug: string; title: string; description: string; cover_image?: string; author_username: string };

export default function AmbassadorDetail() {
  const router = useRouter();
  const { id } = router.query as { id?: string };
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const r = await fetch(`/api/app/blog/by-author?author=${id}`);
        const data = await r.json();
        setBlogs(Array.isArray(data) ? data : []);
      } catch {}
    })();
  }, [id]);

  return (
    <>
      <NavBar />
      <div className="bg-black text-white min-h-screen">
        <div className="max-w-5xl mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6">Blogs by Ambassador</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {blogs.map(b => (
              <Link key={b.slug} href={`/blogs/${b.slug}`} className="block bg-gray-900 p-4 rounded border border-gray-800 hover:border-blue-600">
                <div className="text-lg font-semibold">{b.title}</div>
                <div className="text-sm text-gray-400">{b.author_username}</div>
                <div className="text-xs text-gray-500 mt-1">{b.description?.slice(0, 120)}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

