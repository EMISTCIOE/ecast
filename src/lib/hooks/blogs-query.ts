import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authedFetch } from "../apiClient";

// Query Keys
export const blogKeys = {
  all: ["blogs"] as const,
  lists: () => [...blogKeys.all, "list"] as const,
  list: (params?: Record<string, any>) =>
    [...blogKeys.lists(), params] as const,
  detail: (slug: string) => [...blogKeys.all, "detail", slug] as const,
};

// API Functions
const blogsApi = {
  list: async (params?: Record<string, any>) => {
    const query = params ? `?${new URLSearchParams(params as any)}` : "";
    const res = await authedFetch(`/api/app/blog/list${query}`);
    if (!res.ok) throw new Error("list blogs failed");
    return res.json();
  },

  approve: async (slug: string) => {
    const res = await authedFetch("/api/app/blog/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    if (!res.ok) throw new Error("approve failed");
    return res.json();
  },

  reject: async (slug: string) => {
    const res = await authedFetch("/api/app/blog/reject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    if (!res.ok) throw new Error("reject failed");
    return res.json();
  },

  create: async (form: FormData) => {
    const res = await authedFetch("/api/app/blog/create", {
      method: "POST",
      body: form,
    } as any);
    if (!res.ok) throw new Error("create failed");
    return res.json();
  },

  update: async ({
    slug,
    payload,
  }: {
    slug: string;
    payload: FormData | Record<string, any>;
  }) => {
    const isForm =
      typeof FormData !== "undefined" && payload instanceof FormData;
    const res = await authedFetch("/api/app/blog/update", {
      method: "PATCH",
      headers: isForm
        ? { "x-blog-slug": slug }
        : { "Content-Type": "application/json", "x-blog-slug": slug },
      body: isForm ? (payload as any) : JSON.stringify(payload),
    } as any);
    if (!res.ok) throw new Error("update blog failed");
    return res.json();
  },

  remove: async (slug: string) => {
    const res = await authedFetch("/api/app/blog/delete", {
      method: "DELETE",
      headers: { "x-blog-slug": slug },
    });
    if (!res.ok) throw new Error("delete blog failed");
    return true;
  },
};

// Hooks
export function useBlogsList(params?: Record<string, any>) {
  return useQuery({
    queryKey: blogKeys.list(params),
    queryFn: () => blogsApi.list(params),
  });
}

export function useBlogDetail(slug: string) {
  return useQuery({
    queryKey: blogKeys.detail(slug),
    queryFn: () => blogsApi.list({ slug }),
    enabled: !!slug,
  });
}

export function useApproveBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blogsApi.approve,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
    },
  });
}

export function useRejectBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blogsApi.reject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
    },
  });
}

export function useCreateBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blogsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
    },
  });
}

export function useUpdateBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blogsApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
    },
  });
}

export function useDeleteBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blogsApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
    },
  });
}

// Legacy hook for backward compatibility
export function useBlogs() {
  return {
    list: blogsApi.list,
    approve: blogsApi.approve,
    reject: blogsApi.reject,
    create: blogsApi.create,
    update: (slug: string, payload: FormData | Record<string, any>) =>
      blogsApi.update({ slug, payload }),
    remove: blogsApi.remove,
  };
}
