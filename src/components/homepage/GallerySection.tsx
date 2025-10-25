import Image from "next/image";
import Link from "next/link";
import { PhotoIcon } from "@heroicons/react/24/outline";

interface GalleryImage {
  id: string;
  image: string;
  caption?: string;
  uploaded_by_username?: string;
}

interface GallerySectionProps {
  images: GalleryImage[];
}

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export default function GallerySection({ images }: GallerySectionProps) {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold flex items-center gap-3 text-white">
            <PhotoIcon className="w-8 h-8" />
            Our Gallery
          </h2>
          <Link
            href="/gallery"
            className="text-base text-blue-400 hover:text-blue-300 font-medium"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {images.slice(0, 9).map((img) => (
            <div
              key={img.id}
              className="relative aspect-square rounded-lg overflow-hidden hover:opacity-90 transition-opacity cursor-pointer group border border-gray-800"
            >
              <Image
                src={
                  img.image.startsWith("http")
                    ? img.image
                    : `${BASE_URL}${img.image}`
                }
                alt={img.caption || "Gallery image"}
                fill
                className="object-cover"
              />
              {img.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform">
                  <p className="text-white text-sm line-clamp-2">
                    {img.caption}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
