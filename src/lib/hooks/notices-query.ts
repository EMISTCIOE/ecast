import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authedFetch } from "../apiClient";

// Query Keys
export const noticeKeys = {
  all: ["notices"] as const,
  lists: () => [...noticeKeys.all, "list"] as const,
  list: (params?: Record<string, any>) =>
    [...noticeKeys.lists(), params] as const,
  detail: (id: string) => [...noticeKeys.all, "detail", id] as const,
};

// API Functions
const noticesApi = {
  list: async (params?: Record<string, any>) => {
    const query = params ? `?${new URLSearchParams(params as any)}` : "";
    const res = await authedFetch(`/api/app/notice/list${query}`);
    if (!res.ok) throw new Error("list notices failed");
    return res.json();
  },

  approve: async (id: string) => {
    const res = await authedFetch("/api/app/notice/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) throw new Error("approve failed");
    return res.json();
  },

  reject: async (id: string) => {
    const res = await authedFetch("/api/app/notice/reject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) throw new Error("reject failed");
    return res.json();
  },

  create: async (form: FormData) => {
    const res = await authedFetch("/api/app/notice/create", {
      method: "POST",
      body: form,
    } as any);
    if (!res.ok) throw new Error("create failed");
    return res.json();
  },

  update: async ({
    id,
    payload,
  }: {
    id: string;
    payload: FormData | Record<string, any>;
  }) => {
    const isForm =
      typeof FormData !== "undefined" && payload instanceof FormData;
    const res = await authedFetch("/api/app/notice/update", {
      method: "PATCH",
      headers: isForm
        ? { "x-notice-id": id }
        : { "Content-Type": "application/json", "x-notice-id": id },
      body: isForm ? (payload as any) : JSON.stringify(payload),
    } as any);
    if (!res.ok) throw new Error("update notice failed");
    return res.json();
  },

  remove: async (id: string) => {
    const res = await authedFetch("/api/app/notice/delete", {
      method: "DELETE",
      headers: { "x-notice-id": id },
    });
    if (!res.ok) throw new Error("delete notice failed");
    return true;
  },
};

// Hooks
export function useNoticesList(params?: Record<string, any>) {
  return useQuery({
    queryKey: noticeKeys.list(params),
    queryFn: () => noticesApi.list(params),
  });
}

export function useNoticeDetail(id: string) {
  return useQuery({
    queryKey: noticeKeys.detail(id),
    queryFn: () => noticesApi.list({ id }),
    enabled: !!id,
  });
}

export function useApproveNotice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: noticesApi.approve,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.lists() });
    },
  });
}

export function useRejectNotice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: noticesApi.reject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.lists() });
    },
  });
}

export function useCreateNotice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: noticesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.lists() });
    },
  });
}

export function useUpdateNotice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: noticesApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.lists() });
    },
  });
}

export function useDeleteNotice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: noticesApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.lists() });
    },
  });
}

// Legacy hook for backward compatibility
export function useNotices() {
  return {
    list: noticesApi.list,
    approve: noticesApi.approve,
    reject: noticesApi.reject,
    create: noticesApi.create,
    update: (id: string, payload: FormData | Record<string, any>) =>
      noticesApi.update({ id, payload }),
    remove: noticesApi.remove,
  };
}
