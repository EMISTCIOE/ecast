import { useState, useEffect } from "react";
import {
  ArrowUpTrayIcon,
  XMarkIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import RichTextEditor from "@/components/RichTextEditor";
import {
  validateBlogForm,
  parseBackendErrors,
  scrollToFirstError,
  type ValidationErrors,
} from "@/lib/validation";

interface EditBlogModalProps {
  blog: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FormData) => Promise<void>;
  isSubmitting?: boolean;
}

export default function EditBlogModal({
  blog,
  isOpen,
  onClose,
  onSave,
  isSubmitting = false,
}: EditBlogModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (blog) {
      setTitle(blog.title || "");
      setDescription(blog.description || "");
      setContent(blog.content || "");
      setCoverImage(null);
      setErrors({}); // Clear errors when blog changes
    }
  }, [blog]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Client-side validation with isUpdate flag
    const validationErrors = validateBlogForm({
      title,
      description,
      content,
      coverImage,
      isUpdate: true, // This makes cover image optional
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      scrollToFirstError();
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("content", content);
      if (coverImage) {
        formData.append("cover_image", coverImage);
      }
      await onSave(formData);
    } catch (error: any) {
      // Parse backend validation errors
      if (error?.response?.data) {
        const backendErrors = parseBackendErrors(error.response.data);
        setErrors(backendErrors);
        scrollToFirstError();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-pink-500/30 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="sticky top-0 bg-gradient-to-r from-pink-600 to-purple-600 p-6 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-2xl font-bold text-white">Edit Blog Post</h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">
              Blog Title
            </label>
            <input
              type="text"
              required
              className={`w-full bg-gray-900/90 p-3 rounded-xl border focus:ring-2 focus:ring-pink-500 focus:border-transparent font-semibold text-lg text-white transition-all ${
                errors.title ? "border-red-500" : "border-pink-500/50"
              }`}
              placeholder="Enter blog title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) {
                  const newErrors = { ...errors };
                  delete newErrors.title;
                  setErrors(newErrors);
                }
              }}
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
              Short Description
            </label>
            <input
              type="text"
              required
              className={`w-full bg-gray-900/90 p-3 rounded-xl border focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white transition-all ${
                errors.description ? "border-red-500" : "border-pink-500/50"
              }`}
              placeholder="Brief description for the blog preview"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) {
                  const newErrors = { ...errors };
                  delete newErrors.description;
                  setErrors(newErrors);
                }
              }}
            />
            {errors.description && (
              <p className="error-message text-red-400 text-sm mt-1 flex items-center gap-1">
                <XCircleIcon className="w-4 h-4" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">
              Blog Content
            </label>
            <div
              className={`bg-gray-900/90 rounded-xl border overflow-hidden ${
                errors.content ? "border-red-500" : "border-pink-500/50"
              }`}
            >
              <RichTextEditor
                value={content}
                onChange={(newContent) => {
                  setContent(newContent);
                  if (errors.content) {
                    const newErrors = { ...errors };
                    delete newErrors.content;
                    setErrors(newErrors);
                  }
                }}
                className="min-h-[350px]"
              />
            </div>
            {errors.content && (
              <p className="error-message text-red-400 text-sm mt-1 flex items-center gap-1">
                <XCircleIcon className="w-4 h-4" />
                {errors.content}
              </p>
            )}
          </div>

          {/* Cover Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300 flex items-center gap-2">
              <ArrowUpTrayIcon className="w-4 h-4 text-pink-400" />
              Update Cover Image{" "}
              {coverImage && (
                <span className="text-green-400 text-xs">
                  ({coverImage.name})
                </span>
              )}
              {blog?.cover_image && !coverImage && (
                <span className="text-gray-500 text-xs">
                  (Current cover set)
                </span>
              )}
            </label>
            <input
              type="file"
              accept="image/*"
              className={`w-full p-3 bg-gray-900/90 border-2 border-dashed rounded-xl hover:border-pink-500/50 transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-pink-600/20 file:text-pink-300 hover:file:bg-pink-600/30 file:transition-all cursor-pointer text-sm text-white ${
                errors.cover_image ? "border-red-500" : "border-pink-500/30"
              }`}
              onChange={(e) => {
                setCoverImage(e.target.files?.[0] || null);
                if (errors.cover_image) {
                  const newErrors = { ...errors };
                  delete newErrors.cover_image;
                  setErrors(newErrors);
                }
              }}
            />
            {coverImage && coverImage.type?.startsWith("image/") && (
              <div className="mt-3">
                <img
                  src={URL.createObjectURL(coverImage)}
                  alt="New cover preview"
                  className="max-h-48 w-full object-cover rounded-lg border border-pink-500/30"
                />
              </div>
            )}
            {!coverImage && blog?.cover_image && (
              <div className="mt-3">
                <img
                  src={blog.cover_image}
                  alt="Current cover preview"
                  className="max-h-48 w-full object-cover rounded-lg border border-pink-500/30"
                />
              </div>
            )}
            {errors.cover_image && (
              <p className="error-message text-red-400 text-sm mt-1 flex items-center gap-1">
                <XCircleIcon className="w-4 h-4" />
                {errors.cover_image}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 p-3 rounded-xl font-bold text-white shadow-lg hover:shadow-pink-500/30 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </div>
              ) : (
                "Save Changes"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-3 bg-gray-700/50 hover:bg-gray-700/70 text-gray-300 hover:text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
