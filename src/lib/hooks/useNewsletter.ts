import { useState } from "react";

interface NewsletterResponse {
  success: boolean;
  message: string;
  data?: {
    email: string;
  };
}

export const useNewsletter = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const subscribe = async (email: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate email
      if (!email || !email.includes("@")) {
        setError("Please enter a valid email address");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"
        }/api/event/newsletter/subscribe/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data: NewsletterResponse = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to subscribe to newsletter");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setError(null);
      setLoading(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      setLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    subscribe,
    loading,
    error,
    success,
    reset,
  };
};
