import { useEffect } from "react";
import { validateTokenRole } from "../apiClient";

/**
 * Hook to periodically validate that the user's token role matches their current role
 * This helps catch cases where permissions changed but the user hasn't made any API requests
 */
export function useTokenValidation(intervalMs: number = 60000) {
  useEffect(() => {
    // Validate immediately on mount
    validateTokenRole();

    // Then validate periodically
    const interval = setInterval(() => {
      validateTokenRole();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);
}

/**
 * Hook to validate token on focus/visibility change
 * Checks if user's permissions changed while they were away
 */
export function useTokenValidationOnFocus() {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        validateTokenRole();
      }
    };

    const handleFocus = () => {
      validateTokenRole();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);
}
