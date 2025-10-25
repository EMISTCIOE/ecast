import Link from "next/link";
import { BellIcon } from "@heroicons/react/24/outline";

interface Notice {
  id: string;
  title: string;
  content: string;
  created_at: string;
  attachment?: string;
  slug?: string;
  tags?: string[];
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
    <section className="py-8 bg-black border-b border-gray-800">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2 text-white">
            <BellIcon className="w-5 h-5" />
            Recent Notices
          </h2>
          <Link
            href="/notices"
            className="text-sm text-blue-400 hover:text-blue-300 font-medium"
          >
            View All
          </Link>
        </div>

        <div className="space-y-3">
          {notices.map((notice) => (
            <Link
              key={notice.id}
              href={`/notices/${notice.slug || notice.id}`}
              className="block"
            >
              <div className="border border-gray-800 rounded-lg p-3 hover:border-blue-500 hover:bg-gray-900 transition-all bg-gray-900/50">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-semibold text-white text-sm flex-1 line-clamp-1">
                    {notice.title}
                  </h3>
                  <span className="text-xs text-gray-400 whitespace-nowrap flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {new Date(notice.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {notice.content && (
                  <p className="text-xs text-gray-400 line-clamp-2 mb-2">
                    {notice.content}
                  </p>
                )}
                {(notice as any).tags && (notice as any).tags.length > 0 && (
                  <div className="flex gap-2">
                    {(notice as any).tags
                      .slice(0, 2)
                      .map((tag: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-blue-900/50 text-blue-300 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
