import { useCallback } from "react";
import { authedFetch } from "../apiClient";
import type { IntakeInfo, IntakeStatus } from "./intake";

export function useAmbassadorIntake() {
  const fetchStatus = useCallback(async (): Promise<IntakeStatus> => {
    const res = await fetch("/api/ambassador-intake/status");
    if (!res.ok) throw new Error("Failed to fetch ambassador intake status");
    return res.json();
  }, []);

  // Reuse same info endpoint (batches/departments)
  const fetchInfo = useCallback(async (): Promise<IntakeInfo> => {
    const res = await fetch("/api/intake/info");
    if (!res.ok) throw new Error("Failed to fetch intake info");
    return res.json();
  }, []);

  const submitForm = useCallback(async (formData: FormData): Promise<void> => {
    const res = await fetch("/api/ambassador-intake/submit", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      const errorData = await res
        .json()
        .catch(() => ({ error: "Failed to submit form" }));
      throw new Error(errorData.error || "Failed to submit form");
    }
    return res.json();
  }, []);

  const updateStatus = useCallback(
    async (
      isOpen: boolean,
      params?: {
        start_datetime?: string;
        end_datetime?: string;
        create_new_batch?: boolean;
        available_batches?: string[];
      }
    ): Promise<IntakeStatus> => {
      const res = await authedFetch("/api/ambassador-intake/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_open: isOpen, ...params }),
      });
      if (!res.ok) throw new Error("Failed to update intake status");
      return res.json();
    },
    []
  );

  return { fetchStatus, fetchInfo, submitForm, updateStatus };
}

