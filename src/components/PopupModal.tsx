import React, { useEffect, useState } from "react";
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
        className={`relative max-w-4xl w-full max-h-[90vh] bg-gray-900 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 border border-gray-800 ${
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 bg-gray-800/90 hover:bg-gray-700 rounded-full shadow-lg transition-all hover:scale-110"
          aria-label="Close popup"
        >
          <X className="w-5 h-5 text-gray-300" />
        </button>

        {/* Content Container */}
        <div className="flex flex-col">
          {/* Image Section */}
          <div className="relative w-full bg-gray-800">
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <img
                  src={imageUrl}
                  alt={title}
                  className="absolute inset-0 w-full h-full object-contain"
                />
              </div>
          </div>

          {/* Info Section */}
          <div className="p-6 bg-gradient-to-b from-gray-900 to-gray-950">
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  type === "event"
                    ? "bg-blue-900/50 text-blue-300 border border-blue-700"
                    : "bg-purple-900/50 text-purple-300 border border-purple-700"
                }`}
              >
                {type === "event" ? (
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
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
                    Event
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Pinned Notice
                  </span>
                )}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-100 mb-2">{title}</h2>
            {description && (
              <p className="text-gray-400 leading-relaxed">{description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
