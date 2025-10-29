export type Role = "ADMIN" | "MEMBER" | "AMBASSADOR" | "ALUMNI";

export type User = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  date_joined: string;
  full_name: string;
  role: Role;
  is_password_changed: boolean;
  committee_position?: string;
  committee_started_from?: string | null;
  committee_tenure?: number | null;
  committee_member_photo?: string | null;
  linkedin_url?: string;
  github_url?: string;
  is_staff: boolean;
};

export type PublicUser = {
  id: string; // uuid
  username: string;
  full_name: string;
  role: Role;
  committee_position?: string;
  committee_started_from?: string | null;
  committee_member_photo?: string | null;
  linkedin_url?: string;
  github_url?: string;
};

export type Notice = {
  id: string; // uuid
  title: string;
  content: string;
  flyer?: string | null;
  document?: string | null;
  audience: "ALL" | "MEMBERS" | "AMBASSADORS";
  status: "PENDING" | "APPROVED" | "REJECTED";
  pinned: boolean;
  attachment?: string | null;
  published_by: number;
  published_by_username: string;
  created_at: string;
  updated_at: string;
};

export type Blog = {
  id: number;
  slug: string;
  title: string;
  description: string;
  cover_image?: string | null;
  author_username: string;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  created_at?: string;
};

export type Task = {
  id: number;
  title: string;
  description: string;
  assigned_to: number;
  assigned_to_username?: string;
  due_date?: string | null;
  status: string;
  created_at: string;
};

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

export type TaskSubmission = {
  id: number;
  task: number;
  submitted_by: number;
  submitted_by_username?: string;
  content: string;
  attachment?: string | null;
  status: string;
  reviewed_by?: number | null;
  reviewed_at?: string | null;
  created_at: string;
};
