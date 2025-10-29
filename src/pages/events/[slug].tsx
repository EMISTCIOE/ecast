import { GetServerSideProps } from "next";
import NavBar from "@/components/nav";
import Footer from "@/components/footar";
import SEO from "@/components/SEO";
import { generateEventJsonLd } from "@/lib/seo";
import React, { useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Mail,
  ExternalLink,
} from "lucide-react";

interface EventProps {
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    end_date?: string;
    time: string;
    location: string;
    image: string;
    registration_required: boolean;
    registration_deadline?: string;
    max_attendees?: number;
    contact_email: string;
    featured: boolean;
    form_link?: string;
    event_status?: string;
    slug?: string;
  };
}

const EventDetail: React.FC<EventProps> = ({ event }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = () => {
    if (event.event_status === "running") {
      return (
        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-green-600 text-white shadow-lg">
          🔴 LIVE NOW
        </span>
      );
    } else if (event.event_status === "upcoming") {
      return (
        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold bg-red-600 text-white shadow-lg">
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
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          UPCOMING
        </span>
      );
    }
    return null;
  };

  const jsonLd = generateEventJsonLd({
    name: event.title,
    description: event.description,
    image: event.image,
    startDate: event.date,
    endDate: event.end_date,
    location: event.location,
    url: `/events/${event.slug || event.id}`,
  });

  return (
    <>
      <SEO
        title={event.title}
        description={event.description}
        image={event.image}
        url={`/events/${event.slug || event.id}`}
        type="article"
        section="Events"
        tags={[
          "ECAST",
          "Event",
          "Workshop",
          "Technology",
          "Education",
          "TCIOE",
          "IOE",
          "thapathali",
        ]}
        jsonLd={jsonLd}
      />
      <NavBar />
      <div className="bg-black min-h-screen py-8">
        {/* Content Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
            {/* Hero Image */}
            <div className="relative w-full h-[300px] md:h-[400px]">
              <img
                src={event.image}
                alt={event.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />

              {/* Status Badge */}
              <div className="absolute top-6 right-6">{getStatusBadge()}</div>
            </div>

            {/* Title Section */}
            <div className="p-6 md:p-10">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 leading-tight">
                {event.title}
              </h1>

              {/* Event Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {/* Date */}
                <div className="flex items-start gap-3 bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                  <Calendar className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-400 text-xs font-medium mb-1">
                      Date
                    </p>
                    <p className="text-white font-semibold text-sm">
                      {formatDate(event.date)}
                      {event.end_date && event.end_date !== event.date && (
                        <> - {formatDate(event.end_date)}</>
                      )}
                    </p>
                  </div>
                </div>

                {/* Time */}
                <div className="flex items-start gap-3 bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                  <Clock className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-400 text-xs font-medium mb-1">
                      Time
                    </p>
                    <p className="text-white font-semibold text-sm">
                      {event.time}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3 bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                  <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-400 text-xs font-medium mb-1">
                      Location
                    </p>
                    <p className="text-white font-semibold text-sm">
                      {event.location}
                    </p>
                  </div>
                </div>

                {/* Contact */}
                <div className="flex items-start gap-3 bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                  <Mail className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-400 text-xs font-medium mb-1">
                      Contact
                    </p>
                    <a
                      href={`mailto:${event.contact_email}`}
                      className="text-white font-semibold text-sm hover:text-purple-400 transition-colors break-all"
                    >
                      {event.contact_email}
                    </a>
                  </div>
                </div>

                {/* Max Attendees */}
                {event.max_attendees && (
                  <div className="flex items-start gap-3 bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                    <Users className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-gray-400 text-xs font-medium mb-1">
                        Max Attendees
                      </p>
                      <p className="text-white font-semibold text-sm">
                        {event.max_attendees} participants
                      </p>
                    </div>
                  </div>
                )}

                {/* Registration Deadline */}
                {event.registration_deadline && (
                  <div className="flex items-start gap-3 bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                    <Calendar className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-gray-400 text-xs font-medium mb-1">
                        Registration Deadline
                      </p>
                      <p className="text-white font-semibold text-sm">
                        {formatDate(event.registration_deadline)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-8"></div>

              {/* Description Section */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="w-1 h-7 bg-gradient-to-b from-red-600 to-purple-600 rounded-full"></span>
                  About This Event
                </h2>

                {/* Description Text */}
                <div className="prose prose-invert prose-lg max-w-none">
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line text-base">
                    {event.description}
                  </p>
                </div>
              </div>

              {/* Registration Button */}
              {event.form_link && (
                <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center">
                  <a
                    href={event.form_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-red-500/50 transform hover:-translate-y-0.5 w-full sm:w-auto"
                  >
                    <span>Register Now</span>
                    <ExternalLink className="w-5 h-5" />
                  </a>
                  {event.registration_required && (
                    <div className="flex items-center gap-2 text-yellow-400 text-sm">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Registration Required</span>
                    </div>
                  )}
                </div>
              )}

              {/* Featured Badge */}
              {event.featured && (
                <div className="mt-6">
                  <div className="bg-gradient-to-r from-purple-600/20 to-red-600/20 border border-purple-500/50 rounded-xl p-3">
                    <p className="text-center text-purple-300 font-semibold text-sm">
                      ⭐ Featured Event
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-8 mb-8 text-center">
            <a
              href="/ourevents"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 font-medium"
            >
              <span>←</span>
              <span>Back to All Events</span>
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
}) => {
  const { slug } = params as { slug: string };
  const host = req?.headers?.host || "localhost:3000";
  const protocol =
    host.startsWith("localhost") || host.startsWith("127.0.0.1")
      ? "http"
      : "https";

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || `${protocol}://${host}`;

  try {
    const res = await fetch(
      `${protocol}://${host}/api/app/event/detail?slug=${encodeURIComponent(
        slug
      )}`
    );

    if (!res.ok) throw new Error("Event not found");

    const eventData = await res.json();

    const event = {
      id: eventData.id,
      title: eventData.title,
      description: eventData.description,
      date: eventData.date,
      end_date: eventData.end_date,
      time: eventData.time,
      location: eventData.location,
      image: eventData.image?.startsWith("http")
        ? eventData.image
        : `${backendUrl}${eventData.image}`,
      registration_required: eventData.registration_required || false,
      registration_deadline: eventData.registration_deadline,
      max_attendees: eventData.max_attendees,
      contact_email: eventData.contact_email,
      featured: eventData.featured || false,
      form_link: eventData.form_link,
      event_status: eventData.event_status,
    };

    return { props: { event } };
  } catch (error) {
    return { notFound: true };
  }
};

export default EventDetail;
