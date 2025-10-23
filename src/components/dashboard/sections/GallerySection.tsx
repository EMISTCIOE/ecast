import { useState } from "react";
import {
  PhotoIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  XMarkIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

interface GallerySectionProps {
  myGallery: any[];
  onCreateClick: () => void;
  onDelete: (id: string) => Promise<void>;
  onRefresh: () => void;
}

export default function GallerySection({
  myGallery,
  onCreateClick,
  onDelete,
  onRefresh,
}: GallerySectionProps) {
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold border border-green-500/30">
            <CheckCircleIcon className="w-4 h-4" />
            Approved
          </span>
        );
      case "REJECTED":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-semibold border border-red-500/30">
            <XCircleIcon className="w-4 h-4" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-semibold border border-yellow-500/30">
            <ClockIcon className="w-4 h-4" />
            Pending Review
          </span>
        );
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await onDelete(id);
      setDeleteConfirm(null);
      onRefresh();
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <PhotoIcon className="w-7 h-7 text-white" />
            </div>
            My Gallery
          </h1>
          <p className="text-gray-400 text-lg">Manage your uploaded images</p>
        </div>
        <button
          onClick={onCreateClick}
          className="group px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 flex items-center gap-2 hover:scale-105"
        >
          <PlusIcon className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          Upload Image
        </button>
      </div>

      {/* Gallery Grid */}
      <div className="bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl p-8 rounded-2xl border border-gray-700/50 shadow-2xl">
        {myGallery.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-800/50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <PhotoIcon className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              No images uploaded yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start sharing your memories by uploading your first image
            </p>
            <button
              onClick={onCreateClick}
              className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-xl font-semibold shadow-lg transition-all hover:scale-105 inline-flex items-center gap-2"
            >
              <CloudArrowUpIcon className="w-5 h-5" />
              Upload Your First Image
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myGallery.map((item) => (
              <div
                key={item.id}
                className="group relative bg-gray-900/50 rounded-xl border border-gray-700/50 hover:border-cyan-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10"
              >
                {/* Image */}
                <div className="relative aspect-square bg-gray-800">
                  <img
                    src={item.image}
                    alt={item.title || "Gallery image"}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      onClick={() => setSelectedImage(item)}
                      className="p-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors"
                      title="View"
                    >
                      <EyeIcon className="w-5 h-5 text-white" />
                    </button>
                    {item.status !== "APPROVED" && (
                      <button
                        onClick={() => setDeleteConfirm(item.id)}
                        className="p-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <TrashIcon className="w-5 h-5 text-white" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-white line-clamp-1">
                      {item.title || "Untitled"}
                    </h3>
                    {getStatusBadge(item.status)}
                  </div>
                  {item.description && (
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    {new Date(item.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 md:top-4 md:right-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2 transition-colors z-10"
            >
              <XMarkIcon className="w-6 h-6 text-white" />
            </button>
            <img
              src={selectedImage.image}
              alt={selectedImage.title || "Gallery"}
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl mx-auto"
              onClick={(e) => e.stopPropagation()}
            />
            {(selectedImage.title || selectedImage.description) && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 rounded-b-xl">
                {selectedImage.title && (
                  <h2 className="text-white text-2xl font-bold mb-2">
                    {selectedImage.title}
                  </h2>
                )}
                {selectedImage.description && (
                  <p className="text-gray-300">{selectedImage.description}</p>
                )}
                <div className="mt-3">
                  {getStatusBadge(selectedImage.status)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl max-w-md w-full border border-gray-700 shadow-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Delete Image?</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete this image? This action cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <TrashIcon className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
