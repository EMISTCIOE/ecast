import React from "react";
import Image from "next/image";

interface IPROPS {
  image: string;
  topic: string;
  eventId: string;
  formLink?: string | null;
  date?: string;
  time?: string;
  location?: string;
  description?: string;
}

const Events: React.FC<IPROPS> = ({
  image,
  topic,
  eventId,
  formLink,
  date,
  time,
  location,
  description,
}) => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-purple-600 rounded-2xl overflow-hidden shadow-2xl hover:shadow-purple-600/50 transition-all duration-300 hover:scale-105 w-[400px]">
        {/* Image Section */}
        <div className="relative w-full h-[300px] overflow-hidden">
          <Image
            src={image}
            alt={topic}
            width={400}
            height={300}
            className="object-cover w-full h-full"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-4">
          {/* Title */}
          <h3 className="text-2xl font-bold text-white uppercase tracking-wide">
            {topic}
          </h3>

          {/* Event Details */}
          <div className="space-y-2 text-gray-300">
            {date && (
              <div className="flex items-center gap-2">
                <span className="text-red-500">📅</span>
                <span className="text-sm">
                  {new Date(date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            )}
            {time && (
              <div className="flex items-center gap-2">
                <span className="text-red-500">🕐</span>
                <span className="text-sm">{time}</span>
              </div>
            )}
            {location && (
              <div className="flex items-center gap-2">
                <span className="text-red-500">📍</span>
                <span className="text-sm">{location}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {description && (
            <p className="text-gray-400 text-sm line-clamp-3">{description}</p>
          )}

          {/* Button Section - Only show "See More" if form link exists */}
          {formLink && (
            <div className="pt-4">
              <a
                href={formLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors duration-200"
              >
                See More
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
