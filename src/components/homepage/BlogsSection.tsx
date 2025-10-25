import Link from "next/link";
import Image from "next/image";
import { 
  DocumentTextIcon, 
  ArrowRightIcon 
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

interface BlogsSectionProps {
  blogs: Blog[];
}

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export default function BlogsSection({ blogs }: BlogsSectionProps) {
  if (!blogs || blogs.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <DocumentTextIcon className="w-8 h-8 text-yellow-500" />
            Latest Blogs
          </h2>
          <Link 
            href="/blogs"
            className="flex items-center gap-2 text-yellow-500 hover:text-yellow-600 transition-colors"
          >
            View All
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {blogs.map((blog) => (
            <div 
              key={blog.id}
              className="bg-gray-50 rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
            >
              {blog.cover_image && (
                <div className="relative h-48 w-full">
                  <Image
                    src={blog.cover_image.startsWith('http') ? blog.cover_image : `${BASE_URL}${blog.cover_image}`}
                    alt={blog.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {blog.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {blog.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    by {blog.author_username || 'ECAST'}
                  </span>
                  <Link
                    href={`/blogs/${blog.slug || blog.id}`}
                    className="inline-flex items-center text-yellow-500 hover:text-yellow-600 font-medium transition-colors"
                  >
                    Read More
                    <ArrowRightIcon className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
