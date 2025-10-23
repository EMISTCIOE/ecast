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
    const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
    const res = await authedFetch(`${base}/api/project/projects/`, {
      method: "POST",
      body: form,
    } as any);
    if (!res.ok) throw new Error("create project failed");
    return res.json();
  }, []);

  const update = useCallback(async (slug: string, form: FormData) => {
    const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
    const res = await authedFetch(`${base}/api/project/projects/${slug}/`, {
      method: "PATCH",
      body: form,
    } as any);
    if (!res.ok) throw new Error("update project failed");
    return res.json();
  }, []);

  const remove = useCallback(async (slug: string) => {
    const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
    const res = await authedFetch(`${base}/api/project/projects/${slug}/`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("delete project failed");
    return res.json();
  }, []);

  return { list, approve, reject, create, update, remove };
}
