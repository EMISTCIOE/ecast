import React, { useState } from "react";
import { FaEnvelope, FaCheckCircle, FaSpinner } from "react-icons/fa";

interface NewsletterSubscribeProps {
  category?:
    | "GENERAL"
    | "EVENTS"
    | "BLOGS"
    | "RESEARCH"
    | "NOTICES"
    | "PROJECTS";
  title?: string;
  description?: string;
  compact?: boolean;
}

const NewsletterSubscribe: React.FC<NewsletterSubscribeProps> = ({
  category = "GENERAL",
  title = "Stay Updated",
  description = "Subscribe to our newsletter for the latest updates",
  compact = false,
}) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/event/newsletter/subscribe/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, category }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setEmail("");
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(data.message || "Failed to subscribe. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
      console.error("Newsletter subscription error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryInfo = () => {
    switch (category) {
      case "EVENTS":
        return { color: "purple", label: "Events" };
      case "BLOGS":
        return { color: "blue", label: "Blogs" };
      case "RESEARCH":
        return { color: "green", label: "Research" };
      case "NOTICES":
        return { color: "yellow", label: "Notices" };
      case "PROJECTS":
        return { color: "pink", label: "Projects" };
      default:
        return { color: "indigo", label: "General Updates" };
    }
  };

  const categoryInfo = getCategoryInfo();

  if (compact) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 my-4">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-2"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isSubmitting || success}
          />
          <button
            type="submit"
            disabled={isSubmitting || success}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>Subscribing...</span>
              </>
            ) : success ? (
              <>
                <FaCheckCircle />
                <span>Subscribed!</span>
              </>
            ) : (
              <>
                <FaEnvelope />
                <span>Subscribe</span>
              </>
            )}
          </button>
        </form>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-xl shadow-xl overflow-hidden my-7 border border-white border-opacity-10">
      <div className="p-6 text-white">
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-1">{title}</h3>
          <p className="text-gray-400 text-sm">
            Subscribe to {categoryInfo.label}
          </p>
        </div>

        <p className="text-gray-300 text-sm mb-5">{description}</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:border-pink-500 focus:outline-none transition-colors disabled:opacity-50"
              disabled={isSubmitting || success}
            />
            <button
              type="submit"
              disabled={isSubmitting || success}
              className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Subscribing...</span>
                </>
              ) : success ? (
                <>
                  <FaCheckCircle />
                  <span>Subscribed!</span>
                </>
              ) : (
                <>
                  <FaEnvelope />
                  <span>Subscribe</span>
                </>
              )}
            </button>
          </div>

          {success && (
            <div className="bg-green-500/20 text-green-200 border border-green-500/30 rounded-lg p-3 text-sm">
              <p className="font-semibold flex items-center gap-2">
                <FaCheckCircle />
                Successfully subscribed! Check your email for confirmation.
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 text-red-200 border border-red-500/30 rounded-lg p-3 text-sm">
              <p>{error}</p>
            </div>
          )}

          <p className="text-xs text-gray-400">
            We respect your privacy. Unsubscribe at any time using the link in
            our emails.
          </p>
        </form>
      </div>
    </div>
  );
};

export default NewsletterSubscribe;
