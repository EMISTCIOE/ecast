import Link from "next/link";
import { BellIcon, CalendarIcon } from "@heroicons/react/24/outline";

interface Notice {
  id: string;
  title: string;
  content: string;
  created_at: string;
  attachment?: string;
  slug?: string;
  tags?: string[];
}

interface Event {
  id: string;
  title: string;
  description: string;
  image?: string;
  date: string;
  end_date?: string;
  venue?: string;
  slug?: string;
}

interface NoticesAndEventsSectionProps {
  notices: Notice[];
  events: Event[];
  userCounts: {
    ambassadors: number;
    alumni: number;
  };
}

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export default function NoticesAndEventsSection({
  notices,
  events,
  userCounts,
}: NoticesAndEventsSectionProps) {
  const hasNotices = notices && notices.length > 0;
  const hasEvents = events && events.length > 0;

  if (!hasNotices && !hasEvents) {
    return null;
  }

  // Limit to 1 notice and 2 events
  const displayNotice = hasNotices ? notices.slice(0, 1) : [];
  const displayEvents = hasEvents ? events.slice(0, 2) : [];

  // Get current batch year from env or default to 2082
  const currentBatchYear = process.env.NEXT_PUBLIC_CURRENT_BATCH_YEAR || "2082";

  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Notice + Community Stats */}
          <div className="space-y-8">
            {/* Notice */}
            {hasNotices && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold flex items-center gap-3 text-white">
                    <BellIcon className="w-8 h-8" />
                    Recent Notices
                  </h2>
                  <Link
                    href="/notices"
                    className="text-base text-blue-400 hover:text-blue-300 font-medium"
                  >
                    View All
                  </Link>
                </div>

                {displayNotice.map((notice) => (
                  <Link key={notice.id} href={`/notices`} className="block">
                    <div className="border border-gray-800 rounded-lg p-6 hover:border-blue-500 hover:bg-gray-900 transition-all bg-gray-900/50">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className="font-semibold text-white text-xl flex-1 line-clamp-2">
                          {notice.title}
                        </h3>
                        <span className="text-base text-gray-400 whitespace-nowrap flex items-center gap-1">
                          <svg
                            className="w-5 h-5"
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
                          {new Date(notice.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                      {notice.content && (
                        <p className="text-base text-gray-400 line-clamp-3 mb-3">
                          {notice.content}
                        </p>
                      )}
                      {notice.tags && notice.tags.length > 0 && (
                        <div className="flex gap-2">
                          {notice.tags
                            .slice(0, 2)
                            .map((tag: string, idx: number) => (
                              <span
                                key={idx}
                                className="px-3 py-1.5 bg-blue-900/50 text-blue-300 text-sm rounded"
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
            )}

            {/* Community Stats - Show in left column if there are events */}
            {hasEvents && (
              <div>
                <h2 className="text-3xl font-bold flex items-center gap-3 text-white mb-6">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Our Community
                </h2>
                <div className="space-y-4">
                  {userCounts.alumni > 0 && (
                    <div className="border border-gray-800 rounded-lg p-6 bg-gray-900/50">
                      <div className="flex items-center gap-4">
                        <div className="p-4 bg-purple-900/50 rounded-lg">
                          <svg
                            className="w-8 h-8 text-purple-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 14l9-5-9-5-9 5 9 5z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="text-4xl font-bold text-white">
                            {userCounts.alumni}
                          </div>
                          <div className="text-base text-gray-400">
                            Alumni Members
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {userCounts.ambassadors > 0 && (
                    <div className="border border-gray-800 rounded-lg p-6 bg-gray-900/50">
                      <div className="flex items-center gap-4">
                        <div className="p-4 bg-blue-900/50 rounded-lg">
                          <svg
                            className="w-8 h-8 text-blue-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="text-4xl font-bold text-white">
                            {userCounts.ambassadors}
                          </div>
                          <div className="text-base text-gray-400">
                            Active Ambassadors (Batch {currentBatchYear})
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Events or Community Stats */}
          {hasEvents ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold flex items-center gap-3 text-white">
                  <CalendarIcon className="w-8 h-8" />
                  Events
                </h2>
                <Link
                  href="/ourevents"
                  className="text-base text-blue-400 hover:text-blue-300 font-medium"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-5">
                {displayEvents.map((event) => (
                  <Link
                    key={event.id}
                    href={`/events/${event.slug || event.id}`}
                    className="block"
                  >
                    <div className="border border-gray-800 rounded-lg p-6 hover:border-blue-500 hover:bg-gray-900 transition-all bg-gray-900/50">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className="font-semibold text-white text-xl flex-1 line-clamp-2">
                          {event.title}
                        </h3>
                        <span className="text-base text-gray-400 whitespace-nowrap flex items-center gap-1">
                          <svg
                            className="w-5 h-5"
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
                          {(() => {
                            const startDate = new Date(event.date);
                            const formattedStart = startDate.toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                              }
                            );

                            if (event.end_date) {
                              const endDate = new Date(event.end_date);
                              const formattedEnd = endDate.toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                }
                              );
                              return `${formattedStart} - ${formattedEnd}`;
                            }

                            return formattedStart;
                          })()}
                        </span>
                      </div>
                      {event.description && (
                        <p className="text-base text-gray-400 line-clamp-3 mb-3">
                          {event.description}
                        </p>
                      )}
                      {event.venue && (
                        <div className="flex items-center gap-1 text-base text-gray-500">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {event.venue}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            // No events - Show Community Stats in right column
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-3 text-white mb-6">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Our Community
              </h2>
              <div className="space-y-5">
                {userCounts.alumni > 0 && (
                  <div className="border border-gray-800 rounded-lg p-6 bg-gray-900/50">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-purple-900/50 rounded-lg">
                        <svg
                          className="w-8 h-8 text-purple-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 14l9-5-9-5-9 5 9 5z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="text-4xl font-bold text-white">
                          {userCounts.alumni}
                        </div>
                        <div className="text-base text-gray-400">
                          Alumni Members
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {userCounts.ambassadors > 0 && (
                  <div className="border border-gray-800 rounded-lg p-6 bg-gray-900/50">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-blue-900/50 rounded-lg">
                        <svg
                          className="w-8 h-8 text-blue-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="text-4xl font-bold text-white">
                          {userCounts.ambassadors}
                        </div>
                        <div className="text-base text-gray-400">
                          Active Ambassadors (Batch {currentBatchYear})
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
