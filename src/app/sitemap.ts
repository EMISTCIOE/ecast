import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

async function fetchData(endpoint: string) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data) ? data : data.results || [];
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all dynamic content
  const [blogs, events, projects, notices] = await Promise.all([
    fetchData("/api/blog/"),
    fetchData("/api/event/"),
    fetchData("/api/project/"),
    fetchData("/api/notice/"),
  ]);

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blogs`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/ourevents`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/committee`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact-us`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/research`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Dynamic blog pages
  const blogPages: MetadataRoute.Sitemap = blogs
    .filter((blog: any) => blog.status === "APPROVED")
    .map((blog: any) => ({
      url: `${BASE_URL}/blogs/${blog.slug || blog.id}`,
      lastModified: new Date(blog.updated_at || blog.created_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  // Dynamic event pages
  const eventPages: MetadataRoute.Sitemap = events
    .filter((event: any) => event.status === "APPROVED")
    .map((event: any) => ({
      url: `${BASE_URL}/ourevents/${event.slug || event.id}`,
      lastModified: new Date(event.updated_at || event.created_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  // Dynamic project pages
  const projectPages: MetadataRoute.Sitemap = projects
    .filter((project: any) => project.status === "APPROVED")
    .map((project: any) => ({
      url: `${BASE_URL}/projects/${project.slug || project.id}`,
      lastModified: new Date(project.updated_at || project.created_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  // Dynamic notice pages
  const noticePages: MetadataRoute.Sitemap = notices
    .filter((notice: any) => notice.status === "APPROVED")
    .map((notice: any) => ({
      url: `${BASE_URL}/notices/${notice.slug || notice.id}`,
      lastModified: new Date(notice.updated_at || notice.created_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  return [
    ...staticPages,
    ...blogPages,
    ...eventPages,
    ...projectPages,
    ...noticePages,
  ];
}
