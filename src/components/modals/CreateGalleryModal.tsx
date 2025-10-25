import { useState, useRef } from "react";
import {
  XMarkIcon,
  PhotoIcon,
  CloudArrowUpIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import {
  validateGalleryForm,
  parseBackendErrors,
  scrollToFirstError,
  type ValidationErrors,
} from "@/lib/validation";

interface CreateGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
}

export default function CreateGalleryModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateGalleryModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError("");
      // Clear image error if exists
      if (errors.image) {
        const newErrors = { ...errors };
        delete newErrors.image;
        setErrors(newErrors);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setError("");

    // Client-side validation
    const validationErrors = validateGalleryForm({
      title,
      image,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      scrollToFirstError();
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("image", image!);
      if (title.trim()) formData.append("title", title.trim());
      if (description.trim())
        formData.append("description", description.trim());

      await onSubmit(formData);

      // Reset form
      setTitle("");
      setDescription("");
      setImage(null);
      setImagePreview("");
      setErrors({});
      onClose();
    } catch (err: any) {
      // Parse backend validation errors
      if (err?.response?.data) {
        const backendErrors = parseBackendErrors(err.response.data);
        setErrors(backendErrors);
        scrollToFirstError();
      } else {
        setError(err.message || "Failed to upload image");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setTitle("");
      setDescription("");
      setImage(null);
      setImagePreview("");
      setError("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar border border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center">
              <PhotoIcon className="w-6 h-6 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Upload Gallery Image
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
          >
            <XMarkIcon className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-900/30 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Image Upload */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-300">
              Image <span className="text-red-400">*</span>
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all group ${
                errors.image
                  ? "border-red-500"
                  : "border-gray-600 hover:border-cyan-500/50"
              }`}
            >
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-64 mx-auto rounded-lg object-contain"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <p className="text-white font-medium">
                      Click to change image
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <CloudArrowUpIcon className="w-16 h-16 text-gray-500 mx-auto mb-4 group-hover:text-cyan-400 transition-colors" />
                  <p className="text-gray-400 mb-2">Click to upload an image</p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, WEBP up to 10MB
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={isSubmitting}
              />
            </div>
            {errors.image && (
              <p className="error-message text-red-400 text-sm mt-1 flex items-center gap-1">
                <XCircleIcon className="w-4 h-4" />
                {errors.image}
              </p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) {
                  const newErrors = { ...errors };
                  delete newErrors.title;
                  setErrors(newErrors);
                }
              }}
              placeholder="e.g., Tech Fest 2025"
              className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-white placeholder-gray-500 ${
                errors.title ? "border-red-500" : "border-gray-700"
              }`}
              disabled={isSubmitting}
              maxLength={150}
            />
            {errors.title && (
              <p className="error-message text-red-400 text-sm mt-1 flex items-center gap-1">
                <XCircleIcon className="w-4 h-4" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">
              Description <span className="text-gray-500">(Optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description for this image..."
              rows={4}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-white placeholder-gray-500 resize-none"
              disabled={isSubmitting}
            />
          </div>

          {/* Info Box */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <p className="text-sm text-blue-300">
              <strong>Note:</strong> Your submission will be reviewed by admins
              before appearing in the gallery.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !image}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <PhotoIcon className="w-5 h-5" />
                  Upload Image
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
