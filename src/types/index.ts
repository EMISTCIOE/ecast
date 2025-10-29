// Common types used across the application

export interface Blog {
  id: number | string;
  slug: string;
  title: string;
  description?: string;
  content?: string;
  cover_image?: string;
  author?: string;
  published_by_username?: string;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  created_at?: string;
  updated_at?: string;
}

export interface Research {
  id: string;
  slug: string;
  title: string;
  abstract: string;
  authors: string;
  publication_date?: string;
  journal_name?: string;
  doi?: string;
  url?: string;
  document?: string;
  keywords?: string;
  created_by?: {
    id: number;
    username: string;
    first_name?: string;
    last_name?: string;
    full_name?: string;
  };
  co_authors?: Array<{
    id: number;
    username: string;
    first_name?: string;
    last_name?: string;
    full_name?: string;
  }>;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  created_at?: string;
  updated_at?: string;
}

export interface Notice {
  id: number | string;
  title: string;
  content: string;
  flyer?: string | null;
  document?: string | null;
  audience?: string;
  pinned?: boolean;
  published_by?: number;
  published_by_username?: string;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  created_at?: string;
  updated_at?: string;
}

export interface Event {
  id: number | string;
  slug: string;
  title: string;
  description?: string;
  date?: string;
  end_date?: string | null;
  time?: string | null;
  location?: string;
  image?: string;
  registration_required?: boolean;
  registration_deadline?: string | null;
  max_attendees?: number | null;
  contact_email?: string;
  featured?: boolean;
  coming_soon?: boolean;
  form_link?: string | null;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  event_status?: "upcoming" | "running" | "past";
  created_at?: string;
  updated_at?: string;
}

export interface ProjectType {
  id: number | string;
  slug: string;
  title: string;
  description?: string;
  thumbnail?: string;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  github_link?: string;
  demo_link?: string;
  created_at?: string;
  updated_at?: string;
}

export interface GalleryImage {
  id: number | string;
  image: string;
  title?: string;
  description?: string;
  uploaded_by?: string;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  created_at?: string;
}

export interface TaskSubmission {
  id: number | string;
  task_id: number;
  task_title?: string;
  submitted_by?: string;
  submission_text?: string;
  attachment?: string | null;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  submitted_at?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  profile_picture?: string;
  bio?: string;
  github?: string;
  linkedin?: string;
  portfolio?: string;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: T[];
}
