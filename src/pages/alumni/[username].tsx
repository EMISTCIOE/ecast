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
  alumni_workplace?: string;
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
                {user.alumni_workplace && (
                  <div className="mb-3 flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-blue-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    <span className="text-sm text-blue-300">
                      {user.alumni_workplace}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-4">
                  {user.linkedin_url && (
                    <a
                      href={user.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      LinkedIn
                    </a>
                  )}
                  {user.github_url && (
                    <a
                      href={user.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white text-sm flex items-center gap-1"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      GitHub
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
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                        View Paper
                      </span>
                    )}
                    {paper.document && (
                      <span className="text-purple-400 inline-flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Download
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
