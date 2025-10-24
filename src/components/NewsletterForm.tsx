import { useState, useEffect } from "react";
import { useNewsletter } from "@/lib/hooks/useNewsletter";

interface NewsletterFormProps {
  className?: string;
}

export const NewsletterForm: React.FC<NewsletterFormProps> = ({
  className = "",
}) => {
  const [email, setEmail] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const { subscribe, loading, error, success, reset } = useNewsletter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      return;
    }

    await subscribe(email);
    setShowMessage(true);
  };

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
        if (success) {
          setEmail("");
          reset();
        }
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showMessage, success, reset]);

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold text-white mb-4 gradient-text">
        Subscribe to our Newsletter
      </h3>

      <p className="text-gray-300 text-sm mb-4">
        Get updates about our latest events, blogs, and announcements.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={loading || success}
            className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:border-pink-500 focus:outline-none transition-colors disabled:opacity-50"
            required
          />
          <button
            type="submit"
            disabled={loading || !email.trim() || (success && showMessage)}
            className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {loading
              ? "Subscribing..."
              : success && showMessage
              ? "✓ Subscribed"
              : "Subscribe"}
          </button>
        </div>

        {showMessage && (
          <div
            className={`text-sm p-3 rounded-lg transition-all duration-300 ${
              success
                ? "bg-green-500/20 text-green-200 border border-green-500/30"
                : "bg-red-500/20 text-red-200 border border-red-500/30"
            }`}
          >
            {error || (success && "Thank you for subscribing!")}
          </div>
        )}
      </form>

      <p className="text-gray-400 text-xs mt-3">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </div>
  );
};
