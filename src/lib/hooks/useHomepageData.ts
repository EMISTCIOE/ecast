/**
 * TanStack Query hooks for homepage data fetching
 */

import { useQuery } from "@tanstack/react-query";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

/**
 * Fetch recent notices (approved only)
 */
export function useRecentNotices(limit: number = 2) {
  return useQuery({
    queryKey: ["notices", "recent", limit],
    queryFn: async () => {
      const res = await fetch(
        `${BASE_URL}/api/notice/notices/?status=APPROVED&ordering=-created_at&limit=${limit}`
      );
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : data?.results || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Fetch recent blogs (approved only)
 */
export function useRecentBlogs(limit: number = 2) {
  return useQuery({
    queryKey: ["blogs", "recent", limit],
    queryFn: async () => {
      const res = await fetch(
        `${BASE_URL}/api/blog/posts/?status=APPROVED&ordering=-created_at&limit=${limit}`
      );
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : data?.results || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Fetch recent events (approved only, upcoming/ongoing)
 */
export function useRecentEvents(limit: number = 2) {
  return useQuery({
    queryKey: ["events", "recent", limit],
    queryFn: async () => {
      const res = await fetch(
        `${BASE_URL}/api/event/events/?status=APPROVED&ordering=date`
      );
      if (!res.ok) return [];
      const data = await res.json();
      const events = Array.isArray(data) ? data : data?.results || [];

      // Filter out past events on the frontend
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const upcomingOrOngoingEvents = events.filter((event: any) => {
        const eventEndDate = event.end_date
          ? new Date(event.end_date)
          : new Date(event.date);
        eventEndDate.setHours(0, 0, 0, 0);
        return eventEndDate >= today;
      });

      return upcomingOrOngoingEvents.slice(0, limit);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Fetch gallery images (approved only)
 */
export function useGalleryImages(limit: number = 9) {
  return useQuery({
    queryKey: ["gallery", "images", limit],
    queryFn: async () => {
      const res = await fetch(
        `${BASE_URL}/api/event/gallery/?status=APPROVED&ordering=-created_at&limit=${limit}`
      );
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : data?.results || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch latest project or research (whichever is most recent)
 */
export function useLatestContent() {
  return useQuery({
    queryKey: ["content", "latest"],
    queryFn: async (): Promise<{
      type: "project" | "research";
      data: any;
    } | null> => {
      const [projectsRes, researchRes] = await Promise.all([
        fetch(
          `${BASE_URL}/api/project/projects/?status=APPROVED&ordering=-created_at&limit=1`
        ),
        fetch(
          `${BASE_URL}/api/research/?status=APPROVED&ordering=-created_at&limit=1`
        ),
      ]);

      const projectsData = projectsRes.ok ? await projectsRes.json() : null;
      const researchData = researchRes.ok ? await researchRes.json() : null;

      const projects = Array.isArray(projectsData)
        ? projectsData
        : projectsData?.results || [];
      const research = Array.isArray(researchData)
        ? researchData
        : researchData?.results || [];

      const latestProject = projects[0];
      const latestResearch = research[0];

      if (!latestProject && !latestResearch) return null;
      if (!latestProject)
        return { type: "research" as const, data: latestResearch };
      if (!latestResearch)
        return { type: "project" as const, data: latestProject };

      const projectDate = new Date(latestProject.created_at);
      const researchDate = new Date(latestResearch.created_at);

      return projectDate > researchDate
        ? { type: "project" as const, data: latestProject }
        : { type: "research" as const, data: latestResearch };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch user counts (ambassadors for current batch and alumni)
 */
export function useUserCounts() {
  return useQuery({
    queryKey: ["users", "counts"],
    queryFn: async () => {
      const currentBatchYear =
        process.env.NEXT_PUBLIC_CURRENT_BATCH_YEAR || "2082";

      const [ambassadorsRes, alumniRes] = await Promise.all([
        fetch(
          `${BASE_URL}/api/auth/public/users/?role=AMBASSADOR&batch_year=${currentBatchYear}`
        ),
        fetch(`${BASE_URL}/api/auth/public/users/?role=ALUMNI`),
      ]);

      const ambassadors = ambassadorsRes.ok ? await ambassadorsRes.json() : [];
      const alumni = alumniRes.ok ? await alumniRes.json() : [];

      return {
        ambassadors: Array.isArray(ambassadors)
          ? ambassadors.length
          : ambassadors?.count || 0,
        alumni: Array.isArray(alumni) ? alumni.length : alumni?.count || 0,
      };
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Combined hook to fetch all homepage data at once
 */
export function useHomepageData() {
  const notices = useRecentNotices(2);
  const blogs = useRecentBlogs(2);
  const events = useRecentEvents(2);
  const gallery = useGalleryImages(9);
  const latestContent = useLatestContent();
  const userCounts = useUserCounts();

  const isLoading =
    notices.isLoading ||
    blogs.isLoading ||
    events.isLoading ||
    gallery.isLoading ||
    latestContent.isLoading ||
    userCounts.isLoading;

  const isError =
    notices.isError ||
    blogs.isError ||
    events.isError ||
    gallery.isError ||
    latestContent.isError ||
    userCounts.isError;

  return {
    data: {
      notices: notices.data || [],
      blogs: blogs.data || [],
      events: events.data || [],
      gallery: gallery.data || [],
      latestContent: latestContent.data || null,
      userCounts: userCounts.data || { ambassadors: 0, alumni: 0 },
    },
    isLoading,
    isError,
    refetch: () => {
      notices.refetch();
      blogs.refetch();
      events.refetch();
      gallery.refetch();
      latestContent.refetch();
      userCounts.refetch();
    },
  };
}
