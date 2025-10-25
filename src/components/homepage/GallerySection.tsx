import Image from "next/image";
import Link from "next/link";
import { 
  PhotoIcon, 
  ArrowRightIcon 
} from "@heroicons/react/24/outline";

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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <PhotoIcon className="w-8 h-8 text-yellow-500" />
            Gallery Highlights
          </h2>
          <Link 
            href="/gallery"
            className="flex items-center gap-2 text-yellow-500 hover:text-yellow-600 transition-colors"
          >
            View All
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.slice(0, 6).map((img) => (
            <div 
              key={img.id}
              className="relative aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow group cursor-pointer"
            >
              <Image
                src={img.image.startsWith('http') ? img.image : `${BASE_URL}${img.image}`}
                alt={img.caption || 'Gallery image'}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              {img.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  {img.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
