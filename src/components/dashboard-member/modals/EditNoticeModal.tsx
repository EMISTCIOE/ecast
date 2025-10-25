import { useState, useEffect } from "react";
import {
  ArrowUpTrayIcon,
  XMarkIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import {
  validateNoticeForm,
  parseBackendErrors,
  scrollToFirstError,
  type ValidationErrors,
} from "@/lib/validation";

interface EditNoticeModalProps {
  notice: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FormData) => Promise<void>;
  isSubmitting?: boolean;
}

export default function EditNoticeModal({
  notice,
  isOpen,
  onClose,
  onSave,
  isSubmitting = false,
}: EditNoticeModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [audience, setAudience] = useState("ALL");
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (notice) {
      setTitle(notice.title || "");
      setContent(notice.content || "");
      setAudience(notice.audience || "ALL");
      setFile(null);
      setErrors({});
    }
  }, [notice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    const validationErrors = validateNoticeForm({
      title,
      content,
      attachment: file,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      scrollToFirstError();
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("audience", audience);
      if (file) {
        formData.append("attachment", file);
      }
      await onSave(formData);
    } catch (error: any) {
      if (error.response?.data) {
        const backendErrors = parseBackendErrors(error.response.data);
        setErrors(backendErrors);
        scrollToFirstError();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-purple-500/30 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 p-6 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white">Edit Notice</h2>
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
              Notice Title
            </label>
            <input
              type="text"
              required
              className={`w-full bg-gray-900/90 p-3 rounded-xl border ${
                errors.title ? "border-red-500" : "border-purple-500/50"
              } focus:ring-2 focus:ring-purple-500 focus:border-transparent font-semibold text-lg text-white transition-all`}
              placeholder="Enter notice title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) {
                  const { title, ...rest } = errors;
                  setErrors(rest);
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

          {/* Content */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">
              Content
            </label>
            <textarea
              required
              className={`w-full bg-gray-900/90 p-3 rounded-xl border ${
                errors.content ? "border-red-500" : "border-purple-500/50"
              } focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-white transition-all`}
              placeholder="Enter notice content"
              rows={6}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (errors.content) {
                  const { content, ...rest } = errors;
                  setErrors(rest);
                }
              }}
            />
            {errors.content && (
              <p className="error-message text-red-400 text-sm mt-1 flex items-center gap-1">
                <XCircleIcon className="w-4 h-4" />
                {errors.content}
              </p>
            )}
          </div>

          {/* Audience */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">
              Target Audience
            </label>
            <select
              className="w-full bg-gray-900/90 p-3 rounded-xl border border-purple-500/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white transition-all"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
            >
              <option value="ALL">All Members</option>
              <option value="MEMBERS">Members Only</option>
              <option value="AMBASSADORS">Ambassadors Only</option>
            </select>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300 flex items-center gap-2">
              <ArrowUpTrayIcon className="w-4 h-4 text-purple-400" />
              Update Attachment{" "}
              {file && (
                <span className="text-green-400 text-xs">({file.name})</span>
              )}
              {notice?.attachment && !file && (
                <span className="text-gray-500 text-xs">
                  (Current: {notice.attachment.split("/").pop()})
                </span>
              )}
            </label>
            <input
              type="file"
              accept="application/pdf,image/*"
              className="w-full p-3 bg-gray-900/90 border-2 border-dashed border-purple-500/30 rounded-xl hover:border-purple-500/50 transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600/20 file:text-purple-300 hover:file:bg-purple-600/30 file:transition-all cursor-pointer text-sm text-white"
              onChange={(e) => {
                setFile(e.target.files?.[0] || null);
                if (errors.attachment) {
                  const { attachment, ...rest } = errors;
                  setErrors(rest);
                }
              }}
            />
            {errors.attachment && (
              <p className="error-message text-red-400 text-sm mt-1 flex items-center gap-1">
                <XCircleIcon className="w-4 h-4" />
                {errors.attachment}
              </p>
            )}
            {file && file.type?.startsWith("image/") && (
              <div className="mt-3">
                <img
                  src={URL.createObjectURL(file)}
                  alt="New attachment preview"
                  className="max-h-48 rounded-lg border border-purple-500/30"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 p-3 rounded-xl font-bold text-white shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
