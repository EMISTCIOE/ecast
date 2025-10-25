import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, ArrowRight } from "lucide-react";

interface IPROPS {
  image: string;
  topic: string;
  date?: string;
  endDate?: string;
  location?: string;
  description?: string;
}

const PastEventComp: React.FC<IPROPS> = ({
  image,
  topic,
  date,
  endDate,
  location,
  description,
}) => {
  return (
    <div className="group relative w-[340px] h-full mx-auto">
      <div className="relative h-full w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 border border-gray-800 hover:border-purple-500/50 flex flex-col">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Image Section - Reduced Height */}
        <div className="relative w-full h-44 flex-shrink-0 overflow-hidden">
          <Image
            src={image}
            alt={topic}
            width={400}
            height={300}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />

          {/* Past Event Badge */}
          <div className="absolute top-4 right-4">
            <span className="px-4 py-1.5 bg-gray-700 text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-sm">
              PAST EVENT
            </span>
          </div>
        </div>

        {/* Content Section - Flexible with min height */}
        <div className="relative p-5 space-y-3 flex-grow flex flex-col">
          {/* Title - Fixed Height */}
          <h3 className="text-lg font-bold text-white leading-tight h-12 flex items-center group-hover:text-purple-300 transition-colors duration-300 line-clamp-2">
            {topic}
          </h3>

          {/* Event Details */}
          <div className="space-y-2">
            {date && (
              <div className="flex items-center gap-3 text-gray-300 group-hover:text-purple-200 transition-colors">
                <Calendar className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span className="text-sm font-medium">
                  {new Date(date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  {endDate && endDate !== date && (
                    <>
                      {" "}
                      -{" "}
                      {new Date(endDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </>
                  )}
                </span>
              </div>
            )}
            {location && (
              <div className="flex items-center gap-3 text-gray-300 group-hover:text-purple-200 transition-colors">
                <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span className="text-sm font-medium line-clamp-1">
                  {location}
                </span>
              </div>
            )}
          </div>

          {/* Description - Fixed Height */}
          <div className="h-12 flex-shrink-0">
            {description && (
              <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 group-hover:text-gray-300 transition-colors">
                {description}
              </p>
            )}
          </div>

          {/* Read More Button */}
          <div className="pt-1 mt-auto">
            <Link
              href="/blogs"
              className="group/btn flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-2.5 px-6 rounded-xl text-center transition-all duration-300 shadow-lg hover:shadow-purple-500/50 transform hover:-translate-y-0.5"
            >
              <span>Read More</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>

        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </div>
  );
};

export default PastEventComp;
