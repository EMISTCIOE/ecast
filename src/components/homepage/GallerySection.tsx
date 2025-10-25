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
    <section className="py-8 bg-black">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2 text-white">
            <PhotoIcon className="w-5 h-5" />
            Gallery
          </h2>
          <Link
            href="/gallery"
            className="text-sm text-blue-400 hover:text-blue-300 font-medium"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {images.slice(0, 6).map((img) => (
            <div
              key={img.id}
              className="relative aspect-square rounded overflow-hidden hover:opacity-90 transition-opacity cursor-pointer group border border-gray-800"
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
