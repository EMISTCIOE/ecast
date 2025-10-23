import { useState, useEffect } from "react";
import {
  ArrowUpTrayIcon,
  XMarkIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

interface EditEventModalProps {
  event: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FormData) => Promise<void>;
  isSubmitting?: boolean;
}

export default function EditEventModal({
  event,
  isOpen,
  onClose,
  onSave,
  isSubmitting = false,
}: EditEventModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [formLink, setFormLink] = useState("");
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    if (event) {
      setTitle(event.title || "");
      setDescription(event.description || "");
      setDate(event.date || "");
      setTime(event.time || "");
      setLocation(event.location || "");
      setContactEmail(event.contact_email || "");
      setFormLink(event.form_link || "");
      setImage(null);
    }
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("date", date);
    formData.append("time", time);
    formData.append("location", location);
    formData.append("contact_email", contactEmail);
    if (formLink.trim()) formData.append("form_link", formLink.trim());
    // Don't send featured/coming_soon - let backend/admins control these
    if (image) {
      formData.append("image", image);
    }
    await onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-emerald-500/30 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-green-600 p-6 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-2xl font-bold text-white">Edit Event</h2>
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
              Event Title
            </label>
            <input
              type="text"
              required
              className="w-full bg-gray-900/90 p-3 rounded-xl border border-emerald-500/50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-semibold text-lg text-white transition-all"
              placeholder="Enter event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">
              Description
            </label>
            <textarea
              required
              className="w-full bg-gray-900/90 p-3 rounded-xl border border-emerald-500/50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none text-white transition-all"
              placeholder="Describe your event"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-emerald-400" />
                Date
              </label>
              <input
                type="date"
                required
                className="w-full bg-gray-900/90 p-3 rounded-xl border border-emerald-500/50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white transition-all"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300 flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-emerald-400" />
                Time
              </label>
              <input
                type="time"
                required
                className="w-full bg-gray-900/90 p-3 rounded-xl border border-emerald-500/50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white transition-all"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300 flex items-center gap-2">
              <MapPinIcon className="w-4 h-4 text-emerald-400" />
              Location
            </label>
            <input
              type="text"
              required
              className="w-full bg-gray-900/90 p-3 rounded-xl border border-emerald-500/50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white transition-all"
              placeholder="Event location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Contact Email */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 text-emerald-400"
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
              required
              className="w-full bg-gray-900/90 p-3 rounded-xl border border-emerald-500/50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white transition-all"
              placeholder="Contact email for inquiries"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
          </div>

          {/* Form Link */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 text-emerald-400"
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
              className="w-full bg-gray-900/90 p-3 rounded-xl border border-emerald-500/50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white transition-all"
              placeholder="Google Forms, registration link, etc."
              value={formLink}
              onChange={(e) => setFormLink(e.target.value)}
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300 flex items-center gap-2">
              <ArrowUpTrayIcon className="w-4 h-4 text-emerald-400" />
              Update Event Image{" "}
              {image && (
                <span className="text-green-400 text-xs">({image.name})</span>
              )}
              {event?.image && !image && (
                <span className="text-gray-500 text-xs">
                  (Current image set)
                </span>
              )}
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full p-3 bg-gray-900/90 border-2 border-dashed border-emerald-500/30 rounded-xl hover:border-emerald-500/50 transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-600/20 file:text-emerald-300 hover:file:bg-emerald-600/30 file:transition-all cursor-pointer text-sm text-white"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
            {image && image.type?.startsWith("image/") && (
              <div className="mt-3">
                <img
                  src={URL.createObjectURL(image)}
                  alt="New image preview"
                  className="max-h-48 w-full object-cover rounded-lg border border-emerald-500/30"
                />
              </div>
            )}
            {!image && event?.image && (
              <div className="mt-3">
                <img
                  src={event.image}
                  alt="Current image preview"
                  className="max-h-48 w-full object-cover rounded-lg border border-emerald-500/30"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 p-3 rounded-xl font-bold text-white shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
