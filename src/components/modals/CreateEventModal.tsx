import { useState } from "react";
import Modal from "../Modal";
import {
  DocumentTextIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  ArrowUpTrayIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import {
  validateEventForm,
  parseBackendErrors,
  scrollToFirstError,
  type ValidationErrors,
} from "@/lib/validation";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    date: string;
    end_date?: string;
    time?: string;
    location: string;
    image: File | null;
    contact_email: string;
    coming_soon: boolean;
    form_link?: string;
  }) => Promise<void>;
}

export default function CreateEventModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateEventModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [contactEmail, setContactEmail] = useState("");
  const [comingSoon, setComingSoon] = useState(false);
  const [formLink, setFormLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    // Client-side validation
    const validationErrors = validateEventForm({
      title,
      description,
      date,
      time,
      location,
      contactEmail,
      formLink,
      image,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      scrollToFirstError();
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        title,
        description,
        date,
        end_date: endDate.trim() || undefined,
        time: time.trim() || undefined,
        location,
        image,
        contact_email: contactEmail,
        coming_soon: comingSoon,
        form_link: formLink.trim() || undefined,
      });
      setMessage("Event submitted successfully!");
      setTimeout(() => {
        setTitle("");
        setDescription("");
        setDate("");
        setEndDate("");
        setTime("");
        setLocation("");
        setImage(null);
        setContactEmail("");
        setComingSoon(false);
        setFormLink("");
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
        setMessage("Failed to submit event");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setTitle("");
      setDescription("");
      setDate("");
      setEndDate("");
      setTime("");
      setLocation("");
      setImage(null);
      setContactEmail("");
      setComingSoon(false);
      setFormLink("");
      setMessage("");
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="📅 Create Event"
      size="lg"
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
            <CalendarIcon className="w-5 h-5 text-emerald-400" />
            Event Title
          </label>
          <input
            className={`w-full p-4 bg-gray-900/80 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 hover:border-emerald-500/50 font-medium text-lg text-white ${
              errors.title ? "border-red-500" : "border-gray-700"
            }`}
            placeholder="Enter event name..."
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
            <DocumentTextIcon className="w-5 h-5 text-emerald-400" />
            Description
          </label>
          <textarea
            className={`w-full p-4 bg-gray-900/80 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 hover:border-emerald-500/50 resize-none font-medium text-white ${
              errors.description ? "border-red-500" : "border-gray-700"
            }`}
            placeholder="Describe what attendees can expect..."
            rows={4}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-emerald-400" />
              Start Date *
            </label>
            <input
              className={`w-full p-4 bg-gray-900/80 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 hover:border-emerald-500/50 font-medium text-white ${
                errors.date ? "border-red-500" : "border-gray-700"
              }`}
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                if (errors.date) {
                  const newErrors = { ...errors };
                  delete newErrors.date;
                  setErrors(newErrors);
                }
              }}
              required
            />
            {errors.date && (
              <p className="error-message text-red-400 text-sm mt-1 flex items-center gap-1">
                <XCircleIcon className="w-4 h-4" />
                {errors.date}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-purple-400" />
              End Date (Optional)
            </label>
            <input
              className={`w-full p-4 bg-gray-900/80 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-500/50 font-medium text-white ${
                errors.end_date ? "border-red-500" : "border-gray-700"
              }`}
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                if (errors.end_date) {
                  const newErrors = { ...errors };
                  delete newErrors.end_date;
                  setErrors(newErrors);
                }
              }}
            />
            {errors.end_date && (
              <p className="error-message text-red-400 text-sm mt-1 flex items-center gap-1">
                <XCircleIcon className="w-4 h-4" />
                {errors.end_date}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-300 flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-emerald-400" />
            Time (Optional)
          </label>
          <input
            className={`w-full p-4 bg-gray-900/80 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 hover:border-emerald-500/50 font-medium text-white ${
              errors.time ? "border-red-500" : "border-gray-700"
            }`}
            type="time"
            value={time}
            onChange={(e) => {
              setTime(e.target.value);
              if (errors.time) {
                const newErrors = { ...errors };
                delete newErrors.time;
                setErrors(newErrors);
              }
            }}
          />
          {errors.time && (
            <p className="error-message text-red-400 text-sm mt-1 flex items-center gap-1">
              <XCircleIcon className="w-4 h-4" />
              {errors.time}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-300 flex items-center gap-2">
            <MapPinIcon className="w-5 h-5 text-emerald-400" />
            Location
          </label>
          <input
            className={`w-full p-4 bg-gray-900/80 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 hover:border-emerald-500/50 font-medium text-white ${
              errors.location ? "border-red-500" : "border-gray-700"
            }`}
            placeholder="Where will the event take place?"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              if (errors.location) {
                const newErrors = { ...errors };
                delete newErrors.location;
                setErrors(newErrors);
              }
            }}
            required
          />
          {errors.location && (
            <p className="error-message text-red-400 text-sm mt-1 flex items-center gap-1">
              <XCircleIcon className="w-4 h-4" />
              {errors.location}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-300 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-emerald-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
              />
            </svg>
            Contact Email
          </label>
          <input
            type="email"
            className={`w-full p-4 bg-gray-900/80 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 hover:border-emerald-500/50 font-medium text-white ${
              errors.contact_email ? "border-red-500" : "border-gray-700"
            }`}
            placeholder="Contact email for inquiries"
            value={contactEmail}
            onChange={(e) => {
              setContactEmail(e.target.value);
              if (errors.contact_email) {
                const newErrors = { ...errors };
                delete newErrors.contact_email;
                setErrors(newErrors);
              }
            }}
            required
          />
          {errors.contact_email && (
            <p className="error-message text-red-400 text-sm mt-1 flex items-center gap-1">
              <XCircleIcon className="w-4 h-4" />
              {errors.contact_email}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-300 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-emerald-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
              />
            </svg>
            Registration/Form Link
            <span className="text-xs text-gray-500 font-normal">
              (Optional)
            </span>
          </label>
          <input
            type="url"
            className={`w-full p-4 bg-gray-900/80 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 hover:border-emerald-500/50 font-medium text-white ${
              errors.form_link ? "border-red-500" : "border-gray-700"
            }`}
            placeholder="Google Forms, registration link, etc."
            value={formLink}
            onChange={(e) => {
              setFormLink(e.target.value);
              if (errors.form_link) {
                const newErrors = { ...errors };
                delete newErrors.form_link;
                setErrors(newErrors);
              }
            }}
          />
          <p className="text-xs text-gray-500 mt-1">
            Add a link for registration forms or event details (e.g., Google
            Forms)
          </p>
          {errors.form_link && (
            <p className="error-message text-red-400 text-sm mt-1 flex items-center gap-1">
              <XCircleIcon className="w-4 h-4" />
              {errors.form_link}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={comingSoon}
              onChange={(e) => setComingSoon(e.target.checked)}
              className="w-5 h-5 rounded border-gray-700 bg-gray-900/80 text-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-300 group-hover:text-emerald-400 transition-colors">
              Mark as "Coming Soon"
            </span>
          </label>
          <p className="text-xs text-gray-500 ml-8">
            Enable this if the event date is not finalized yet
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-300 flex items-center gap-2">
            <ArrowUpTrayIcon className="w-5 h-5 text-emerald-400" />
            Event Image{" "}
            {image && (
              <span className="text-green-400 text-xs">({image.name})</span>
            )}
          </label>
          <input
            type="file"
            accept="image/*"
            className={`w-full p-4 bg-gray-900/80 border-2 border-dashed rounded-xl hover:border-emerald-500/50 transition-all duration-300 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-emerald-600 file:to-green-600 file:text-white file:font-semibold hover:file:from-emerald-700 hover:file:to-green-700 file:shadow-lg file:transition-all cursor-pointer text-white ${
              errors.image ? "border-red-500" : "border-gray-700"
            }`}
            onChange={(e) => {
              setImage(e.target.files?.[0] || null);
              if (errors.image) {
                const newErrors = { ...errors };
                delete newErrors.image;
                setErrors(newErrors);
              }
            }}
          />
          {image && (
            <div className="mt-3">
              <img
                src={URL.createObjectURL(image)}
                alt="Event preview"
                className="max-h-64 rounded-lg border border-emerald-500/30"
              />
            </div>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Supported: JPG, PNG, GIF (Max 5MB)
          </p>
          {errors.image && (
            <p className="error-message text-red-400 text-sm mt-1 flex items-center gap-1">
              <XCircleIcon className="w-4 h-4" />
              {errors.image}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-emerald-600 via-green-700 to-emerald-600 hover:from-emerald-700 hover:via-green-800 hover:to-emerald-700 p-5 rounded-xl font-bold text-lg shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isSubmitting ? (
            <>
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              Submitting...
            </>
          ) : (
            <>
              <PaperAirplaneIcon className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              Submit Event for Review
            </>
          )}
        </button>
      </form>
    </Modal>
  );
}
