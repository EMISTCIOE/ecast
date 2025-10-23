import React, { useEffect, useState } from "react";
import Image from "next/image";
import NavBar from "@/components/nav";
import Footer from "@/components/footar";

type GI = {
  id: string;
  title?: string;
  description?: string;
  image: string;
  created_at: string;
};

export default function GalleryPage() {
  const [rows, setRows] = useState<GI[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GI | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/app/gallery/list");
        const data = await r.json();
        setRows(Array.isArray(data) ? data : []);
      } catch {}
      setLoading(false);
    })();
  }, []);

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-7xl mx-auto pt-28 px-4 pb-16">
          <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Gallery
          </h1>
          {loading ? (
            <div className="text-center text-gray-400 py-20">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {rows.length === 0 ? (
                <div className="col-span-full text-center text-gray-400 py-20">
                  No images yet.
                </div>
              ) : (
                rows.map((g) => (
                  <div
                    key={g.id}
                    className="group relative overflow-hidden rounded-xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50"
                    onClick={() => setSelectedImage(g)}
                  >
                    {/* Image Container with fixed aspect ratio */}
                    <div className="relative aspect-square bg-gray-900">
                      <Image
                        src={g.image}
                        alt={g.title || "Gallery"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />

                      {/* Overlay with gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {/* Click to enlarge indicator */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                            <svg
                              className="w-8 h-8 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                              />
                            </svg>
                          </div>
                        </div>

                        {/* Title and Description at bottom */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          {g.title && (
                            <h3 className="text-white font-semibold text-lg mb-1 line-clamp-1">
                              {g.title}
                            </h3>
                          )}
                          {g.description && (
                            <p className="text-gray-200 text-sm line-clamp-2">
                              {g.description}
                            </p>
                          )}
                          {!g.title && !g.description && (
                            <p className="text-gray-300 text-sm">
                              Click to enlarge
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Title badge (always visible) */}
                      {g.title && (
                        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full group-hover:opacity-0 transition-opacity">
                          <span className="text-white text-sm font-medium truncate max-w-[200px] block">
                            {g.title}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Full-screen image modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-7xl max-h-[90vh] w-full">
            {/* Close button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 md:top-4 md:right-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2 transition-colors z-10"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Image */}
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={selectedImage.image}
                alt={selectedImage.title || "Gallery"}
                className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Image details */}
            {(selectedImage.title || selectedImage.description) && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 rounded-b-xl">
                {selectedImage.title && (
                  <h2 className="text-white text-2xl font-bold mb-2">
                    {selectedImage.title}
                  </h2>
                )}
                {selectedImage.description && (
                  <p className="text-gray-300 text-base">
                    {selectedImage.description}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
