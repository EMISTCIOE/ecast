import React, { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface PopupModalProps {
  imageUrl: string;
  title: string;
  description?: string;
  onClose: () => void;
  type: "notice" | "event";
}

export const PopupModal: React.FC<PopupModalProps> = ({
  imageUrl,
  title,
  description,
  onClose,
  type,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    setTimeout(() => setIsVisible(true), 100);

    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal Content */}
      <div
        className={`relative max-w-4xl w-full max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ${
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110"
          aria-label="Close popup"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        {/* Content Container */}
        <div className="flex flex-col">
          {/* Image Section */}
          <div className="relative w-full bg-gray-100">
            <div
              className="relative w-full"
              style={{ paddingBottom: "56.25%" }}
            >
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              />
            </div>
          </div>

          {/* Info Section */}
          <div className="p-6 bg-gradient-to-b from-white to-gray-50">
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  type === "event"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-purple-100 text-purple-700"
                }`}
              >
                {type === "event" ? "📅 Event" : "📌 Pinned Notice"}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
            {description && (
              <p className="text-gray-600 leading-relaxed">{description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
