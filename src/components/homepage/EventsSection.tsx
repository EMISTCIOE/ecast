import Link from "next/link";
import { CalendarIcon } from "@heroicons/react/24/outline";

interface Event {
  id: string;
  title: string;
  description: string;
  image?: string;
  date: string;
  venue?: string;
  slug?: string;
}

interface EventsSectionProps {
  events: Event[];
}

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export default function EventsSection({ events }: EventsSectionProps) {
  if (!events || events.length === 0) {
    return null;
  }

  return (
    <section className="py-8 bg-black border-b border-gray-800">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2 text-white">
            <CalendarIcon className="w-5 h-5" />
            Events
          </h2>
          <Link
            href="/ourevents"
            className="text-sm text-blue-400 hover:text-blue-300 font-medium"
          >
            View All
          </Link>
        </div>

        <div className="space-y-3">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.slug || event.id}`}
              className="block"
            >
              <div className="border border-gray-800 rounded-lg p-3 hover:border-blue-500 hover:bg-gray-900 transition-all bg-gray-900/50">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-semibold text-white text-sm flex-1 line-clamp-1">
                    {event.title}
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
                    {new Date(event.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {event.description && (
                  <p className="text-xs text-gray-400 line-clamp-2 mb-2">
                    {event.description}
                  </p>
                )}
                {event.venue && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
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
    </section>
  );
}
