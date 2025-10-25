import Link from "next/link";
import { DocumentTextIcon } from "@heroicons/react/24/outline";

interface Blog {
  id: string;
  title: string;
  description: string;
  cover_image?: string;
  created_at: string;
  author_username?: string;
  slug?: string;
}

interface BlogsSectionProps {
  blogs: Blog[];
}

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export default function BlogsSection({ blogs }: BlogsSectionProps) {
  if (!blogs || blogs.length === 0) {
    return null;
  }

  return (
    <section className="py-8 bg-black border-b border-gray-800">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2 text-white">
            <DocumentTextIcon className="w-5 h-5" />
            Latest Blogs
          </h2>
          <Link
            href="/blogs"
            className="text-sm text-blue-400 hover:text-blue-300 font-medium"
          >
            View All
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blogs/${blog.slug || blog.id}`}
              className="block"
            >
              <div className="border border-gray-800 rounded-lg p-3 hover:border-blue-500 hover:bg-gray-900 transition-all bg-gray-900/50">
                <div className="flex gap-3">
                  {/* Left side - Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-sm line-clamp-2 mb-1">
                      {blog.title}
                    </h3>
                    <p className="text-xs text-gray-500 mb-1">
                      by {blog.author_username || "ECAST"}
                    </p>
                    <p className="text-xs text-gray-400 line-clamp-2">
                      {blog.description}
                    </p>
                  </div>

                  {/* Right side - Cover Image */}
                  <div className="flex-shrink-0">
                    {blog.cover_image ? (
                      <img
                        src={`${blog.cover_image}`}
                        alt={blog.title}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-800 rounded-md flex items-center justify-center">
                        <DocumentTextIcon className="w-8 h-8 text-gray-600" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
