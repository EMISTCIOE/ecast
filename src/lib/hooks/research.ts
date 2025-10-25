import { useCallback } from "react";
import { authedFetch } from "../apiClient";

export function useResearch() {
  const list = useCallback(async (params?: Record<string, any>) => {
    const query = params ? `?${new URLSearchParams(params as any)}` : "";
    const res = await authedFetch(`/api/app/research/list${query}`);
    if (!res.ok) throw new Error("list research failed");
    return res.json();
  }, []);

  const detail = useCallback(async (slug: string) => {
    const res = await authedFetch(`/api/app/research/detail?slug=${slug}`);
    if (!res.ok) throw new Error("get research detail failed");
    return res.json();
  }, []);

  const byAuthor = useCallback(async (author: string) => {
    const res = await authedFetch(
      `/api/app/research/by-author?author=${author}`
    );
    if (!res.ok) throw new Error("get research by author failed");
    return res.json();
  }, []);

  const approve = useCallback(async (slug: string) => {
    const res = await authedFetch(
      `/api/app/research/approve?slug=${encodeURIComponent(slug)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (!res.ok) throw new Error("approve research failed");
    return res.json();
  }, []);

  const reject = useCallback(async (slug: string, reason?: string) => {
    const res = await authedFetch(
      `/api/app/research/reject?slug=${encodeURIComponent(slug)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      }
    );
    if (!res.ok) throw new Error("reject research failed");
    return res.json();
  }, []);

  const create = useCallback(
    async (payload: FormData | Record<string, any>) => {
      const isForm =
        typeof FormData !== "undefined" && payload instanceof FormData;

      const options: RequestInit = {
        method: "POST",
        body: isForm ? (payload as any) : JSON.stringify(payload),
      };

      // Only set Content-Type for JSON, let browser set it for FormData
      if (!isForm) {
        options.headers = { "Content-Type": "application/json" };
      }

      const res = await authedFetch("/api/app/research/create", options as any);
      if (!res.ok) throw new Error("create research failed");
      return res.json();
    },
    []
  );

  const update = useCallback(
    async (slug: string, payload: FormData | Record<string, any>) => {
      const isForm =
        typeof FormData !== "undefined" && payload instanceof FormData;

      const options: RequestInit = {
        method: "PATCH",
        body: isForm ? (payload as any) : JSON.stringify(payload),
      };

      // Only set Content-Type for JSON, let browser set it for FormData
      if (!isForm) {
        options.headers = { "Content-Type": "application/json" };
      }

      const res = await authedFetch(
        `/api/app/research/update?slug=${encodeURIComponent(slug)}`,
        options as any
      );
      if (!res.ok) throw new Error("update research failed");
      return res.json();
    },
    []
  );

  const remove = useCallback(async (slug: string) => {
    const res = await authedFetch(
      `/api/app/research/delete?slug=${encodeURIComponent(slug)}`,
      {
        method: "DELETE",
      }
    );
    if (!res.ok) throw new Error("delete research failed");
    return true;
  }, []);

  return { list, detail, byAuthor, approve, reject, create, update, remove };
}
