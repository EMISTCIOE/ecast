import Link from "next/link";
import {
  DocumentTextIcon,
  SparklesIcon,
  BeakerIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";

interface Blog {
  id: string;
  title: string;
  description: string;
  cover_image?: string;
  created_at: string;
  author_username?: string;
  slug?: string;
}

interface LatestContent {
  type: "project" | "research";
  data: {
    id: string;
    title: string;
    description: string;
    created_at: string;
    slug?: string;
    github_link?: string;
    document?: string;
    authors?: string;
  };
}

interface BlogsAndContentSectionProps {
  blogs: Blog[];
  content: LatestContent | null;
}

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export default function BlogsAndContentSection({
  blogs,
  content,
}: BlogsAndContentSectionProps) {
  const hasBlogs = blogs && blogs.length > 0;
  const hasContent = content !== null;

  if (!hasBlogs && !hasContent) {
    return null;
  }

  // Limit to 2 blogs
  const displayBlogs = hasBlogs ? blogs.slice(0, 2) : [];

  return (
    <section className="py-10 bg-black">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Blogs Column */}
          {hasBlogs && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
                  <DocumentTextIcon className="w-6 h-6" />
                  Latest Blogs
                </h2>
                <Link
                  href="/blogs"
                  className="text-sm text-blue-400 hover:text-blue-300 font-medium"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-3">
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
          )}

          {/* Latest Content (Research/Project) Column */}
          {hasContent && content && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                  <SparklesIcon className="w-5 h-5" />
                  Latest {content.type === "project" ? "Project" : "Research"}
                </h2>
                <Link
                  href={content.type === "project" ? "/projects" : "/research"}
                  className="text-sm text-blue-400 hover:text-blue-300 font-medium"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-3">
                <Link
                  href={
                    content.type === "project"
                      ? `/projects/${content.data.slug || content.data.id}`
                      : `/research/${content.data.slug || content.data.id}`
                  }
                  className="block"
                >
                  <div className="border border-gray-800 rounded-lg p-3 hover:border-blue-500 hover:bg-gray-900 transition-all bg-gray-900/50">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="p-1.5 bg-blue-900/50 rounded">
                        {content.type === "project" ? (
                          <CodeBracketIcon className="w-4 h-4 text-blue-400" />
                        ) : (
                          <BeakerIcon className="w-4 h-4 text-blue-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white text-sm line-clamp-2 mb-1">
                          {content.data.title}
                        </h3>
                        {content.type === "research" &&
                          content.data.authors && (
                            <p className="text-xs text-gray-500 mb-1">
                              by {content.data.authors}
                            </p>
                          )}
                      </div>
                    </div>

                    <p className="text-xs text-gray-400 line-clamp-3 mb-2">
                      {content.data.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {new Date(content.data.created_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </span>

                      {content.type === "project" &&
                        content.data.github_link && (
                          <a
                            href={content.data.github_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-blue-400 hover:text-blue-300"
                          >
                            GitHub →
                          </a>
                        )}

                      {content.type === "research" && content.data.document && (
                        <a
                          href={
                            content.data.document.startsWith("http")
                              ? content.data.document
                              : `${BASE_URL}${content.data.document}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs text-blue-400 hover:text-blue-300"
                        >
                          Read Paper →
                        </a>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
