import Link from "next/link";
import Image from "next/image";
import { 
  CalendarIcon, 
  ArrowRightIcon,
  MapPinIcon 
} from "@heroicons/react/24/outline";

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
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <CalendarIcon className="w-8 h-8 text-yellow-500" />
            Upcoming Events
          </h2>
          <Link 
            href="/ourevents"
            className="flex items-center gap-2 text-yellow-500 hover:text-yellow-600 transition-colors"
          >
            View All
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {events.map((event) => (
            <div 
              key={event.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
            >
              {event.image && (
                <div className="relative h-48 w-full">
                  <Image
                    src={event.image.startsWith('http') ? event.image : `${BASE_URL}${event.image}`}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {event.title}
                </h3>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" />
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                  {event.venue && (
                    <span className="flex items-center gap-1">
                      <MapPinIcon className="w-4 h-4" />
                      {event.venue}
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {event.description}
                </p>
                
                <Link
                  href={`/ourevents/${event.slug || event.id}`}
                  className="inline-flex items-center text-yellow-500 hover:text-yellow-600 font-medium transition-colors"
                >
                  Learn More
                  <ArrowRightIcon className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
