/**
 * API utilities for homepage data fetching
 */

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

/**
 * Fetch recent notices (approved only)
 */
export async function fetchRecentNotices(limit: number = 2) {
  try {
    const res = await fetch(
      `${BASE_URL}/api/notice/notices/?status=APPROVED&ordering=-created_at&limit=${limit}`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data?.results || [];
  } catch (error) {
    console.error("Error fetching notices:", error);
    return [];
  }
}

/**
 * Fetch recent blogs (approved only)
 */
export async function fetchRecentBlogs(limit: number = 2) {
  try {
    const res = await fetch(
      `${BASE_URL}/api/blog/posts/?status=APPROVED&ordering=-created_at&limit=${limit}`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data?.results || [];
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

/**
 * Fetch recent events (approved only, upcoming/ongoing)
 */
export async function fetchRecentEvents(limit: number = 2) {
  try {
    const res = await fetch(
      `${BASE_URL}/api/event/events/?status=APPROVED&ordering=date`
    );
    if (!res.ok) return [];
    const data = await res.json();
    const events = Array.isArray(data) ? data : data?.results || [];

    // Filter out past events on the frontend
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset to start of day for accurate comparison

    const upcomingOrOngoingEvents = events.filter((event: any) => {
      const eventEndDate = event.end_date
        ? new Date(event.end_date)
        : new Date(event.date);
      eventEndDate.setHours(0, 0, 0, 0);

      // Show event if end_date (or date if no end_date) is today or in the future
      return eventEndDate >= today;
    });

    return upcomingOrOngoingEvents.slice(0, limit);
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

/**
 * Fetch gallery images (approved only)
 */
export async function fetchGalleryImages(limit: number = 10) {
  try {
    const res = await fetch(
      `${BASE_URL}/api/event/gallery/?status=APPROVED&limit=${limit}`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data?.results || [];
  } catch (error) {
    console.error("Error fetching gallery:", error);
    return [];
  }
}

/**
 * Fetch latest project or research (whichever is most recent)
 */
export async function fetchLatestContent() {
  try {
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
    if (!latestProject) return { type: "research", data: latestResearch };
    if (!latestResearch) return { type: "project", data: latestProject };

    // Compare dates
    const projectDate = new Date(latestProject.created_at);
    const researchDate = new Date(latestResearch.created_at);

    return projectDate > researchDate
      ? { type: "project", data: latestProject }
      : { type: "research", data: latestResearch };
  } catch (error) {
    console.error("Error fetching latest content:", error);
    return null;
  }
}

/**
 * Fetch user counts (ambassadors for current batch and alumni)
 */
export async function fetchUserCounts() {
  try {
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
      ambassadors: Array.isArray(ambassadors) ? ambassadors.length : 0,
      alumni: Array.isArray(alumni) ? alumni.length : 0,
    };
  } catch (error) {
    console.error("Error fetching user counts:", error);
    return { ambassadors: 0, alumni: 0 };
  }
}

/**
 * Fetch all homepage data at once
 */
export async function fetchHomepageData() {
  const [notices, blogs, events, gallery, latestContent, userCounts] =
    await Promise.all([
      fetchRecentNotices(2),
      fetchRecentBlogs(2),
      fetchRecentEvents(2),
      fetchGalleryImages(10),
      fetchLatestContent(),
      fetchUserCounts(),
    ]);

  return {
    notices,
    blogs,
    events,
    gallery,
    latestContent,
    userCounts,
  };
}
