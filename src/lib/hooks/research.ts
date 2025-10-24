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
    const res = await authedFetch("/api/app/research/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    if (!res.ok) throw new Error("approve research failed");
    return res.json();
  }, []);

  const reject = useCallback(async (slug: string, reason?: string) => {
    const res = await authedFetch("/api/app/research/reject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, reason }),
    });
    if (!res.ok) throw new Error("reject research failed");
    return res.json();
  }, []);

  const create = useCallback(
    async (payload: FormData | Record<string, any>) => {
      const isForm =
        typeof FormData !== "undefined" && payload instanceof FormData;
      const res = await authedFetch("/api/app/research/create", {
        method: "POST",
        headers: isForm ? {} : { "Content-Type": "application/json" },
        body: isForm ? (payload as any) : JSON.stringify(payload),
      } as any);
      if (!res.ok) throw new Error("create research failed");
      return res.json();
    },
    []
  );

  const update = useCallback(
    async (slug: string, payload: FormData | Record<string, any>) => {
      const isForm =
        typeof FormData !== "undefined" && payload instanceof FormData;
      const res = await authedFetch("/api/app/research/update", {
        method: "PATCH",
        headers: isForm
          ? { "x-research-slug": slug }
          : { "Content-Type": "application/json", "x-research-slug": slug },
        body: isForm ? (payload as any) : JSON.stringify(payload),
      } as any);
      if (!res.ok) throw new Error("update research failed");
      return res.json();
    },
    []
  );

  const remove = useCallback(async (slug: string) => {
    const res = await authedFetch("/api/app/research/delete", {
      method: "DELETE",
      headers: { "x-research-slug": slug },
    });
    if (!res.ok) throw new Error("delete research failed");
    return true;
  }, []);

  return { list, detail, byAuthor, approve, reject, create, update, remove };
}
