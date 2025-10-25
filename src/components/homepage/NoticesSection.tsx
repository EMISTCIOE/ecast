import Link from "next/link";
import Image from "next/image";
import { 
  BellIcon, 
  ArrowRightIcon 
} from "@heroicons/react/24/outline";

interface Notice {
  id: string;
  title: string;
  content: string;
  created_at: string;
  attachment?: string;
  slug?: string;
}

interface NoticesSectionProps {
  notices: Notice[];
}

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export default function NoticesSection({ notices }: NoticesSectionProps) {
  if (!notices || notices.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <BellIcon className="w-8 h-8 text-yellow-500" />
            Recent Notices
          </h2>
          <Link 
            href="/notices"
            className="flex items-center gap-2 text-yellow-500 hover:text-yellow-600 transition-colors"
          >
            View All
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {notices.map((notice) => (
            <div 
              key={notice.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-semibold text-gray-800 flex-1">
                  {notice.title}
                </h3>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                  {new Date(notice.created_at).toLocaleDateString()}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-3">
                {notice.content.replace(/<[^>]*>/g, '')}
              </p>
              
              <Link
                href={`/notices/${notice.slug || notice.id}`}
                className="inline-flex items-center text-yellow-500 hover:text-yellow-600 font-medium transition-colors"
              >
                Read More
                <ArrowRightIcon className="w-4 h-4 ml-1" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
