import { useCallback } from "react";
import { authedFetch } from "../apiClient";

export function useAdmin() {
  const listUsers = useCallback(async (role: string) => {
    const query = `?${new URLSearchParams({ role })}`;
    const res = await authedFetch(`/api/app/users${query}`);
    if (!res.ok) throw new Error("users failed");
    return res.json();
  }, []);

  const createCommitteeMember = useCallback(async (payload: any) => {
    const res = await authedFetch("/api/app/auth/committee/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("committee failed");
    return res.json();
  }, []);

  const createUser = useCallback(async (payload: any) => {
    const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
    const isForm =
      typeof FormData !== "undefined" && payload instanceof FormData;
    const res = await authedFetch(`/api/app/users/unified`, {
      method: "POST",
      headers: isForm ? {} : { "Content-Type": "application/json" },
      body: isForm ? (payload as any) : JSON.stringify(payload),
    } as any);
    if (!res.ok) throw new Error("user create failed");
    return res.json();
  }, []);

  const pendingSubmissions = useCallback(async () => {
    const res = await authedFetch("/api/app/tasks/submissions?status=PENDING");
    if (!res.ok) throw new Error("pending submissions failed");
    return res.json();
  }, []);

  const reviewSubmission = useCallback(
    async (id: string, decision: "approve" | "reject") => {
      const res = await authedFetch("/api/app/tasks/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, decision }),
      });
      if (!res.ok) throw new Error("review failed");
      return res.json();
    },
    []
  );

  const createTask = useCallback(
    async (payload: {
      title: string;
      description: string;
      assigned_to: string;
      due_date?: string;
    }) => {
      const res = await authedFetch("/api/app/tasks/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("task create failed");
      return res.json();
    },
    []
  );

  return {
    listUsers,
    createCommitteeMember,
    createUser,
    pendingSubmissions,
    reviewSubmission,
    createTask,
  };
}
