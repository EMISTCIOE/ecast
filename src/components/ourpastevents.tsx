import { useEffect, useState } from "react";
import PastEventComp from "./pasteventcomp";

type EventItem = {
  slug: string;
  title: string;
  image: string;
  coming_soon: boolean;
  status: string;
  event_status?: string;
  date?: string;
  end_date?: string;
  location?: string;
  description?: string;
};
const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

const OurPastEvents = () => {
  const [items, setItems] = useState<EventItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/app/event/list?status=APPROVED");
        const data = await r.json();
        const mapped: EventItem[] = (data || [])
          .filter((e: any) => e.event_status === "past")
          .map((e: any) => ({
            slug: e.slug,
            title: e.title,
            image: e.image?.startsWith("http") ? e.image : `${base}${e.image}`,
            coming_soon: e.coming_soon,
            status: e.status,
            event_status: e.event_status,
            date: e.date,
            end_date: e.end_date,
            location: e.location,
            description: e.description,
          }));
        setItems(mapped);
      } catch {}
    })();
  }, []);

  return (
    <section className="bg-black py-16 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            OUR PAST EVENTS
          </h2>
          <div className="flex items-center justify-center">
            <div className="h-1 w-24 bg-gradient-to-r from-red-600 to-purple-600 rounded-full"></div>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explore the highlights from our previous events
          </p>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto">
        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr justify-items-center">
            {items.map((ev) => (
              <PastEventComp
                key={ev.slug}
                image={ev.image}
                topic={ev.title}
                date={ev.date}
                endDate={ev.end_date}
                location={ev.location}
                description={ev.description}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <svg
              className="w-24 h-24 mx-auto mb-4 text-gray-600"
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
            <p className="text-gray-400 text-xl">No past events to display</p>
            <p className="text-gray-500 text-sm mt-2">
              Stay tuned for upcoming events!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default OurPastEvents;
