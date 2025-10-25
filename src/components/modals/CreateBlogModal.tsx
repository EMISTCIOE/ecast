import { useState } from "react";
import Modal from "../Modal";
import RichTextEditor from "../RichTextEditor";
import {
  DocumentTextIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  XCircleIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import {
  validateBlogForm,
  parseBackendErrors,
  scrollToFirstError,
  type ValidationErrors,
} from "@/lib/validation";

interface CreateBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    content: string;
    coverImage: File | null;
  }) => Promise<void>;
}

export default function CreateBlogModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateBlogModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    // Client-side validation
    const validationErrors = validateBlogForm({
      title,
      description,
      content,
      coverImage,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      scrollToFirstError();
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({ title, description, content, coverImage });
      setMessage("Blog submitted successfully!");
      setTimeout(() => {
        setTitle("");
        setDescription("");
        setContent("");
        setCoverImage(null);
        setMessage("");
        setErrors({});
        onClose();
      }, 1500);
    } catch (error: any) {
      // Parse backend validation errors
      if (error?.response?.data) {
        const backendErrors = parseBackendErrors(error.response.data);
        setErrors(backendErrors);
        scrollToFirstError();
      } else {
        setMessage("Failed to submit blog");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setTitle("");
      setDescription("");
      setContent("");
      setCoverImage(null);
      setMessage("");
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="✍️ Create Blog Post"
      size="full"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {message && (
          <div
            className={`p-5 rounded-2xl font-medium flex items-center gap-3 ${
              message.includes("Failed")
                ? "bg-red-900/30 border border-red-500/50 text-red-300"
                : "bg-green-900/30 border border-green-500/50 text-green-300"
            }`}
          >
            {message.includes("Failed") ? (
              <XCircleIcon className="w-6 h-6" />
            ) : (
              <CheckCircleIcon className="w-6 h-6" />
            )}
            {message}
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-300 flex items-center gap-2">
            <DocumentTextIcon className="w-5 h-5 text-purple-400" />
            Blog Title
          </label>
          <input
            className={`w-full p-4 bg-gray-900/80 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-500/50 font-medium text-lg text-white ${
              errors.title ? "border-red-500" : "border-gray-700"
            }`}
            placeholder="Enter an engaging blog title..."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) {
                const newErrors = { ...errors };
                delete newErrors.title;
                setErrors(newErrors);
              }
            }}
            required
          />
          {errors.title && (
            <p className="error-message text-red-400 text-sm mt-1 flex items-center gap-1">
              <XCircleIcon className="w-4 h-4" />
              {errors.title}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-300 flex items-center gap-2">
            <DocumentTextIcon className="w-5 h-5 text-purple-400" />
            Short Description
          </label>
          <textarea
            className={`w-full p-4 bg-gray-900/80 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-500/50 resize-none font-medium text-white ${
              errors.description ? "border-red-500" : "border-gray-700"
            }`}
            placeholder="Brief summary of your blog post..."
            rows={3}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) {
                const newErrors = { ...errors };
                delete newErrors.description;
                setErrors(newErrors);
              }
            }}
            required
          />
          {errors.description && (
            <p className="error-message text-red-400 text-sm mt-1 flex items-center gap-1">
              <XCircleIcon className="w-4 h-4" />
              {errors.description}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-300 flex items-center gap-2">
            <PhotoIcon className="w-5 h-5 text-purple-400" />
            Cover Image{" "}
            {coverImage && (
              <span className="text-green-400 text-xs">
                ({coverImage.name})
              </span>
            )}
          </label>
          <input
            type="file"
            accept="image/*"
            className={`w-full p-4 bg-gray-900/80 border-2 border-dashed rounded-xl hover:border-purple-500/50 transition-all duration-300 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-purple-600 file:to-pink-600 file:text-white file:font-semibold hover:file:from-purple-700 hover:file:to-pink-700 file:shadow-lg file:transition-all cursor-pointer text-white ${
              errors.cover_image ? "border-red-500" : "border-gray-700"
            }`}
            onChange={(e) => {
              setCoverImage(e.target.files?.[0] || null);
              if (errors.cover_image) {
                const newErrors = { ...errors };
                delete newErrors.cover_image;
                setErrors(newErrors);
              }
            }}
            required
          />
          {coverImage && (
            <div className="mt-3">
              <img
                src={URL.createObjectURL(coverImage)}
                alt="Cover preview"
                className="max-h-64 rounded-lg border border-purple-500/30"
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

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-300 flex items-center gap-2">
            <DocumentTextIcon className="w-5 h-5 text-purple-400" />
            Blog Content
          </label>
          <RichTextEditor value={content} onChange={setContent} />
          {errors.content && (
            <p className="error-message text-red-400 text-sm mt-1 flex items-center gap-1">
              <XCircleIcon className="w-4 h-4" />
              {errors.content}
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1 bg-gray-700 hover:bg-gray-600 p-4 rounded-xl font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 hover:from-purple-700 hover:via-purple-800 hover:to-pink-700 p-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSubmitting ? (
              <>
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                Submitting...
              </>
            ) : (
              <>
                <PaperAirplaneIcon className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                Submit Blog
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
