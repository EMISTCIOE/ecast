import { useCallback } from "react";
import { authedFetch } from "../apiClient";

export function useProjects() {
  const list = useCallback(async (params?: Record<string, any>) => {
    const query = params ? `?${new URLSearchParams(params as any)}` : "";
    const res = await authedFetch(`/api/app/project/list${query}`);
    if (!res.ok) throw new Error("list projects failed");
    return res.json();
  }, []);

  const approve = useCallback(async (id: string) => {
    const res = await authedFetch("/api/app/project/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) throw new Error("approve project failed");
    return res.json();
  }, []);
  const reject = useCallback(async (id: string) => {
    const res = await authedFetch("/api/app/project/reject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) throw new Error("reject project failed");
    return res.json();
  }, []);

  const create = useCallback(async (form: FormData) => {
    const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
    const res = await authedFetch(`${base}/api/project/projects/`, {
      method: "POST",
      body: form,
    } as any);
    if (!res.ok) {
      const errorData = await res
        .json()
        .catch(() => ({ detail: "Unknown error" }));
      console.error("Project creation failed:", errorData);
      // Create an error object with response data
      const error: any = new Error("Project creation failed");
      error.response = { data: errorData };
      throw error;
    }
    return res.json();
  }, []);

  const update = useCallback(async (slug: string, form: FormData) => {
    const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
    const res = await authedFetch(`${base}/api/project/projects/${slug}/`, {
      method: "PATCH",
      body: form,
    } as any);
    if (!res.ok) {
      const errorData = await res
        .json()
        .catch(() => ({ detail: "Unknown error" }));
      console.error("Project update failed:", errorData);
      const error: any = new Error("Project update failed");
      error.response = { data: errorData };
      throw error;
    }
    return res.json();
  }, []);

  const remove = useCallback(async (slug: string) => {
    const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
    const res = await authedFetch(`${base}/api/project/projects/${slug}/`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("delete project failed");
    // DELETE returns 204 No Content with no body, don't try to parse
    if (res.status === 204 || res.status === 200) {
      // Check if there's actually content to parse
      const text = await res.text();
      if (!text || text.trim() === "") {
        return { success: true };
      }
      try {
        return JSON.parse(text);
      } catch {
        return { success: true };
      }
    }
    return res.json();
  }, []);

  return { list, approve, reject, create, update, remove };
}
