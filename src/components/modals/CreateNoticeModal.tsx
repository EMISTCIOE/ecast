import { useState } from "react";
import Modal from "../Modal";
import {
  DocumentTextIcon,
  BellIcon,
  ArrowUpTrayIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import {
  validateNoticeForm,
  parseBackendErrors,
  scrollToFirstError,
  type ValidationErrors,
} from "@/lib/validation";

interface CreateNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    content: string;
    audience: string;
    file: File | null;
  }) => Promise<void>;
}

export default function CreateNoticeModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateNoticeModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [audience, setAudience] = useState("ALL");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

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

    setIsSubmitting(true);

    try {
      await onSubmit({ title, content, audience, file });
      setMessage("Notice submitted successfully!");
      // Reset form
      setTimeout(() => {
        setTitle("");
        setContent("");
        setAudience("ALL");
        setFile(null);
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
        setMessage("Failed to submit notice");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setTitle("");
      setContent("");
      setAudience("ALL");
      setFile(null);
      setMessage("");
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="📢 Create Notice"
      size="2xl"
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
            Notice Title
          </label>
          <input
            className={`w-full p-4 bg-gray-900/80 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-500/50 font-medium text-lg text-white ${
              errors.title ? "border-red-500" : "border-gray-700"
            }`}
            placeholder="Enter a clear and concise title..."
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
            Notice Content
          </label>
          <textarea
            className={`w-full p-4 bg-gray-900/80 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-500/50 resize-none font-medium text-white ${
              errors.content ? "border-red-500" : "border-gray-700"
            }`}
            placeholder="Write your notice content here. Be clear and informative..."
            rows={6}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (errors.content) {
                const newErrors = { ...errors };
                delete newErrors.content;
                setErrors(newErrors);
              }
            }}
            required
          />
          {errors.content && (
            <p className="error-message text-red-400 text-sm mt-1 flex items-center gap-1">
              <XCircleIcon className="w-4 h-4" />
              {errors.content}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-300 flex items-center gap-2">
            <BellIcon className="w-5 h-5 text-purple-400" />
            Target Audience
          </label>
          <select
            className="w-full p-4 bg-gray-900/80 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-500/50 font-medium text-white"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
          >
            <option value="ALL">All Members</option>
            <option value="MEMBERS">Members Only</option>
            <option value="AMBASSADORS">Ambassadors Only</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-300 flex items-center gap-2">
            <ArrowUpTrayIcon className="w-5 h-5 text-purple-400" />
            Attachment (Optional){" "}
            {file && (
              <span className="text-green-400 text-xs">({file.name})</span>
            )}
          </label>
          <input
            key={file ? "has-file" : "no-file"}
            type="file"
            accept="application/pdf,image/*"
            className={`w-full p-4 bg-gray-900/80 border-2 border-dashed rounded-xl hover:border-purple-500/50 transition-all duration-300 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-purple-600 file:to-pink-600 file:text-white file:font-semibold hover:file:from-purple-700 hover:file:to-pink-700 file:shadow-lg file:transition-all cursor-pointer text-white ${
              errors.attachment ? "border-red-500" : "border-gray-700"
            }`}
            onChange={(e) => {
              setFile(e.target.files?.[0] || null);
              if (errors.attachment) {
                const newErrors = { ...errors };
                delete newErrors.attachment;
                setErrors(newErrors);
              }
            }}
          />
          {file && file.type?.startsWith("image/") && (
            <div className="mt-3">
              <img
                src={URL.createObjectURL(file)}
                alt="Attachment preview"
                className="max-h-48 rounded-lg border border-purple-500/30"
              />
            </div>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Supported: PDF, JPG, PNG (Max 10MB)
          </p>
          {errors.attachment && (
            <p className="error-message text-red-400 text-sm mt-1 flex items-center gap-1">
              <XCircleIcon className="w-4 h-4" />
              {errors.attachment}
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
                Submit Notice
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
