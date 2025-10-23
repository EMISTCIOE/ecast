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

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    image: File | null;
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
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      await onSubmit({ title, description, date, time, location, image });
      setMessage("Event submitted successfully!");
      setTimeout(() => {
        setTitle("");
        setDescription("");
        setDate("");
        setTime("");
        setLocation("");
        setImage(null);
        setMessage("");
        onClose();
      }, 1500);
    } catch (error) {
      setMessage("Failed to submit event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setTitle("");
      setDescription("");
      setDate("");
      setTime("");
      setLocation("");
      setImage(null);
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
            className="w-full p-4 bg-gray-900/80 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 hover:border-emerald-500/50 font-medium text-lg text-white"
            placeholder="Enter event name..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-300 flex items-center gap-2">
            <DocumentTextIcon className="w-5 h-5 text-emerald-400" />
            Description
          </label>
          <textarea
            className="w-full p-4 bg-gray-900/80 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 hover:border-emerald-500/50 resize-none font-medium text-white"
            placeholder="Describe what attendees can expect..."
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-emerald-400" />
              Date
            </label>
            <input
              className="w-full p-4 bg-gray-900/80 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 hover:border-emerald-500/50 font-medium text-white"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300 flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-emerald-400" />
              Time
            </label>
            <input
              className="w-full p-4 bg-gray-900/80 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 hover:border-emerald-500/50 font-medium text-white"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-300 flex items-center gap-2">
            <MapPinIcon className="w-5 h-5 text-emerald-400" />
            Location
          </label>
          <input
            className="w-full p-4 bg-gray-900/80 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 hover:border-emerald-500/50 font-medium text-white"
            placeholder="Where will the event take place?"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
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
            className="w-full p-4 bg-gray-900/80 border-2 border-dashed border-gray-700 rounded-xl hover:border-emerald-500/50 transition-all duration-300 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-emerald-600 file:to-green-600 file:text-white file:font-semibold hover:file:from-emerald-700 hover:file:to-green-700 file:shadow-lg file:transition-all cursor-pointer text-white"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
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
