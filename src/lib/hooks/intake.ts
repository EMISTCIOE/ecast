import { useCallback } from "react";
import { authedFetch } from "../apiClient";

export interface Batch {
  code: string;
  label: string;
}

export interface Department {
  code: string;
  label: string;
}

export interface IntakeInfo {
  batches: Batch[];
  departments: Department[];
}

export interface IntakeStatus {
  is_open: boolean;
  message: string;
  start_date?: string;
  end_date?: string;
  available_batches?: string[];
}

export interface IntakeFormData {
  name: string;
  campus_roll: string;
  email: string;
  phone: string;
  department: string;
  batch: string;
  about: string;
  reason_to_join: string;
  interests: string;
  post: string;
  resume?: File;
  github_link: string;
  facebook_link: string;
  linkedin_link: string;
}

export function useIntake() {
  const fetchStatus = useCallback(async (): Promise<IntakeStatus> => {
    const res = await fetch("/api/intake/status");
    if (!res.ok) throw new Error("Failed to fetch intake status");
    return res.json();
  }, []);

  const fetchInfo = useCallback(async (): Promise<IntakeInfo> => {
    const res = await fetch("/api/intake/info");
    if (!res.ok) throw new Error("Failed to fetch intake info");
    return res.json();
  }, []);

  const submitForm = useCallback(async (formData: FormData): Promise<void> => {
    const res = await fetch("/api/intake/submit", {
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
      const res = await authedFetch("/api/intake/update-status", {
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

  return {
    fetchStatus,
    fetchInfo,
    submitForm,
    updateStatus,
  };
}
