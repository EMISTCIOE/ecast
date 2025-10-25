import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import NavBar from "@/components/nav";
import Footer from "@/components/footar";

const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

type Blog = {
  id: string;
  slug: string;
  title: string;
  description: string;
  cover_image?: string;
  author_username: string;
  created_at?: string;
};
type Research = {
  id: string;
  slug: string;
  title: string;
  abstract: string;
  authors: string;
  publication_date?: string;
  journal_name?: string;
  url?: string;
  document?: string;
  created_at?: string;
};
type User = {
  id: string;
  username: string;
  full_name: string;
  email: string;
  photo?: string;
  linkedin_url?: string;
  github_url?: string;
  batch_year_bs?: number;
  role: string;
};

export default function AlumniDetail() {
  const router = useRouter();
  const { username } = router.query as { username?: string };
  const [user, setUser] = useState<User | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [research, setResearch] = useState<Research[]>([]);

  useEffect(() => {
    if (!username) return;

    // Fetch user details
    (async () => {
      try {
        const r = await fetch(`/api/app/users/public?role=ALUMNI`);
        const data = await r.json();
        const foundUser = Array.isArray(data)
          ? data.find((u: any) => u.username === username)
          : null;
        setUser(foundUser);
      } catch {}
    })();

    // Fetch user's blogs
    (async () => {
      try {
        const r = await fetch(`/api/app/blog/by-author?author=${username}`);
        const data = await r.json();
        setBlogs(Array.isArray(data) ? data : []);
      } catch {}
    })();

    // Fetch user's research papers
    (async () => {
      try {
        const r = await fetch(`/api/app/research/by-author?author=${username}`);
        const data = await r.json();
        setResearch(Array.isArray(data) ? data : []);
      } catch {}
    })();
  }, [username]);

  if (!user) {
    return (
      <>
        <NavBar />
        <div className="bg-black text-white min-h-screen flex items-center justify-center">
          <div className="text-gray-400">Loading...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="bg-black text-white min-h-screen">
        <div className="max-w-5xl mx-auto p-6">
          {/* User Profile Section */}
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-8">
            <div className="flex items-start gap-6">
              {user.photo ? (
                <img
                  src={
                    user.photo.startsWith("http")
                      ? user.photo
                      : `${base}${user.photo}`
                  }
                  alt={user.username}
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-700"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    if (target.nextElementSibling) {
                      (target.nextElementSibling as HTMLElement).style.display =
                        "flex";
                    }
                  }}
                />
              ) : null}
              <div
                className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 border-2 border-gray-700 flex items-center justify-center text-white font-bold text-3xl"
                style={{
                  display: user.photo ? "none" : "flex",
                }}
              >
                {(user.full_name || user.username || "?")
                  .charAt(0)
                  .toUpperCase()}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">
                  {user.full_name || user.username}
                </h1>
                <p className="text-gray-400 mb-3">
                  Alumni{" "}
                  {user.batch_year_bs ? `• Batch ${user.batch_year_bs}` : ""}
                </p>
                <div className="flex items-center gap-4">
                  {user.linkedin_url && (
                    <a
                      href={user.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      🔗 LinkedIn
                    </a>
                  )}
                  {user.github_url && (
                    <a
                      href={user.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white text-sm"
                    >
                      💻 GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Blogs Section */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">
              Published Blogs ({blogs.length})
            </h2>
          </div>

          {blogs.length === 0 ? (
            <div className="bg-gray-900 p-8 rounded-lg text-center text-gray-500 mb-8">
              No blogs published yet
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {blogs.map((b) => (
                <Link
                  key={b.slug}
                  href={`/blogs/${b.slug}`}
                  className="block bg-gray-900 rounded-lg border border-gray-800 hover:border-blue-600 overflow-hidden"
                >
                  {b.cover_image && (
                    <img
                      src={b.cover_image}
                      alt={b.title}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                      {b.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-2 line-clamp-3">
                      {b.description}
                    </p>
                    <div className="text-xs text-gray-500">
                      by {b.author_username}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Research Papers Section */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">
              Research Publications ({research.length})
            </h2>
          </div>

          {research.length === 0 ? (
            <div className="bg-gray-900 p-8 rounded-lg text-center text-gray-500">
              No research papers published yet
            </div>
          ) : (
            <div className="space-y-4">
              {research.map((paper) => (
                <Link
                  key={paper.slug}
                  href={`/research/${paper.slug}`}
                  className="block bg-gray-900 rounded-lg border border-gray-800 hover:border-purple-600 p-6 transition-colors"
                >
                  <h3 className="text-xl font-semibold mb-2 text-white hover:text-purple-400">
                    {paper.title}
                  </h3>
                  <div className="text-sm text-gray-400 mb-3 space-y-1">
                    <p>
                      <span className="font-semibold">Authors:</span>{" "}
                      {paper.authors}
                    </p>
                    {paper.journal_name && (
                      <p>
                        <span className="font-semibold">Journal:</span>{" "}
                        {paper.journal_name}
                      </p>
                    )}
                    {paper.publication_date && (
                      <p>
                        <span className="font-semibold">Published:</span>{" "}
                        {new Date(paper.publication_date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                          }
                        )}
                      </p>
                    )}
                  </div>
                  <p className="text-gray-300 line-clamp-2 mb-3">
                    {paper.abstract}
                  </p>
                  <div className="flex gap-3 text-sm">
                    {paper.url && (
                      <span className="text-green-400 inline-flex items-center gap-1">
                        View Paper →
                      </span>
                    )}
                    {paper.document && (
                      <span className="text-purple-400 inline-flex items-center gap-1">
                        Download 📄
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
