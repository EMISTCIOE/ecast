import React, { useEffect, useState } from "react";
import { useBlogs } from "@/lib/hooks/blogs";
import { useNotices } from "@/lib/hooks/notices";
import { useProjects } from "@/lib/hooks/projects";
import { useEvents } from "@/lib/hooks/events";
import { useResearch } from "@/lib/hooks/research";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  DocumentTextIcon,
  BellIcon,
  FolderIcon,
  CalendarIcon,
  ClipboardDocumentCheckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  LinkIcon,
  PaperClipIcon,
} from "@heroicons/react/24/outline";

type Props = {
  role: "MEMBER" | "AMBASSADOR" | "ALUMNI" | "ADMIN";
  showTasks?: boolean;
};

const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export default function MySubmissions({ role, showTasks = true }: Props) {
  const [status, setStatus] = useState<"PENDING" | "APPROVED" | "REJECTED">(
    "PENDING"
  );
  const [blogs, setBlogs] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [research, setResearch] = useState<any[]>([]);
  const [taskSubs, setTaskSubs] = useState<any[]>([]);

  const blogsApi = useBlogs();
  const noticesApi = useNotices();
  const projectsApi = useProjects();
  const eventsApi = useEvents();
  const researchApi = useResearch();

  useEffect(() => {
    blogsApi
      .list({ mine: "1", status })
      .then((data) => {
        // Handle both array and paginated response
        if (Array.isArray(data)) {
          setBlogs(data);
        } else if (data?.results && Array.isArray(data.results)) {
          setBlogs(data.results);
        } else {
          setBlogs([]);
        }
      })
      .catch(() => setBlogs([]));
    if (role !== "ALUMNI") {
      noticesApi
        .list({ mine: "1", status })
        .then((data) => {
          if (Array.isArray(data)) {
            setNotices(data);
          } else if (data?.results && Array.isArray(data.results)) {
            setNotices(data.results);
          } else {
            setNotices([]);
          }
        })
        .catch(() => setNotices([]));
      projectsApi
        .list({ mine: "1", status })
        .then((data) => {
          if (Array.isArray(data)) {
            setProjects(data);
          } else if (data?.results && Array.isArray(data.results)) {
            setProjects(data.results);
          } else {
            setProjects([]);
          }
        })
        .catch(() => setProjects([]));
      eventsApi
        .list({ mine: "1", status })
        .then((data) => {
          if (Array.isArray(data)) {
            setEvents(data);
          } else if (data?.results && Array.isArray(data.results)) {
            setEvents(data.results);
          } else {
            setEvents([]);
          }
        })
        .catch(() => setEvents([]));
      researchApi
        .list({ mine: "1", status })
        .then((data) => {
          if (Array.isArray(data)) {
            setResearch(data);
          } else if (data?.results && Array.isArray(data.results)) {
            setResearch(data.results);
          } else {
            setResearch([]);
          }
        })
        .catch(() => setResearch([]));
      if (showTasks) {
        fetch(`/api/app/tasks/submissions?status=${status}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access") || ""}`,
          },
        })
          .then((r) => r.json())
          .then((data) => {
            if (Array.isArray(data)) {
              setTaskSubs(data);
            } else if (data?.results && Array.isArray(data.results)) {
              setTaskSubs(data.results);
            } else {
              setTaskSubs([]);
            }
          })
          .catch(() => setTaskSubs([]));
      }
    } else {
      setNotices([]);
      setProjects([]);
      setEvents([]);
      setResearch([]);
      setTaskSubs([]);
    }
  }, [status, role]);

  const totalSubmissions =
    blogs.length +
    notices.length +
    projects.length +
    events.length +
    research.length +
    taskSubs.length;

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl p-6 rounded-2xl border border-gray-700/50 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">
              My Submissions
            </h2>
            <p className="text-xs text-gray-400">
              Total: {totalSubmissions} submission
              {totalSubmissions !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-400 mr-1">Filter:</span>
            <button
              onClick={() => setStatus("PENDING")}
              className={`px-4 py-2 rounded-xl transition-all duration-300 font-semibold text-xs ${
                status === "PENDING"
                  ? "bg-yellow-600/30 text-yellow-200 border-2 border-yellow-500/50 shadow-lg"
                  : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700"
              }`}
            >
              <ClockIcon className="w-4 h-4 inline mr-1.5" />
              Pending
            </button>
            <button
              onClick={() => setStatus("APPROVED")}
              className={`px-4 py-2 rounded-xl transition-all duration-300 font-semibold text-xs ${
                status === "APPROVED"
                  ? "bg-green-600/30 text-green-200 border-2 border-green-500/50 shadow-lg"
                  : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700"
              }`}
            >
              <CheckCircleIcon className="w-4 h-4 inline mr-1.5" />
              Approved
            </button>
            <button
              onClick={() => setStatus("REJECTED")}
              className={`px-4 py-2 rounded-xl transition-all duration-300 font-semibold text-xs ${
                status === "REJECTED"
                  ? "bg-red-600/30 text-red-200 border-2 border-red-500/50 shadow-lg"
                  : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700"
              }`}
            >
              <XCircleIcon className="w-4 h-4 inline mr-1.5" />
              Rejected
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {totalSubmissions === 0 && (
        <div className="bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl p-12 rounded-2xl border border-gray-700/50 text-center">
          <div className="w-20 h-20 bg-gray-700/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <DocumentTextIcon className="w-10 h-10 text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-300 mb-2">
            No {status.toLowerCase()} submissions yet
          </h3>
          <p className="text-xs text-gray-500">
            Your {status.toLowerCase()} submissions will appear here
          </p>
        </div>
      )}

      {/* Submissions Grid */}
      <div className="grid gap-5">
        {/* Blogs Section */}
        {blogs.length > 0 && (
          <Section
            title="Blogs"
            count={blogs.length}
            icon={DocumentTextIcon}
            color="pink"
          >
            {blogs.map((b: any) => (
              <SubmissionCard
                key={b.id}
                title={b.title}
                description={b.description}
                status={b.status}
                createdAt={b.created_at}
                color="pink"
              />
            ))}
          </Section>
        )}

        {role !== "ALUMNI" && (
          <>
            {/* Notices Section */}
            {notices.length > 0 && (
              <Section
                title="Notices"
                count={notices.length}
                icon={BellIcon}
                color="purple"
              >
                {notices.map((n: any) => (
                  <SubmissionCard
                    key={n.id}
                    title={n.title}
                    description={`Audience: ${n.audience}`}
                    status={n.status}
                    createdAt={n.created_at}
                    attachment={n.attachment}
                    color="purple"
                  />
                ))}
              </Section>
            )}

            {/* Projects Section */}
            {projects.length > 0 && (
              <Section
                title="Projects"
                count={projects.length}
                icon={FolderIcon}
                color="green"
              >
                {projects.map((p: any) => (
                  <SubmissionCard
                    key={p.id}
                    title={p.title}
                    description={p.description}
                    status={p.status}
                    createdAt={p.created_at}
                    links={[
                      p.repo_link && { label: "Repository", url: p.repo_link },
                      p.live_link && { label: "Live Demo", url: p.live_link },
                    ].filter(Boolean)}
                    color="green"
                  />
                ))}
              </Section>
            )}

            {/* Events Section */}
            {events.length > 0 && (
              <Section
                title="Events"
                count={events.length}
                icon={CalendarIcon}
                color="blue"
              >
                {events.map((e: any) => (
                  <SubmissionCard
                    key={e.id}
                    title={e.title}
                    description={e.description}
                    status={e.status}
                    createdAt={e.created_at}
                    metadata={[
                      e.event_date && {
                        label: "Date",
                        value: new Date(e.event_date).toLocaleDateString(),
                      },
                      e.location && { label: "Location", value: e.location },
                    ].filter(Boolean)}
                    color="blue"
                  />
                ))}
              </Section>
            )}

            {/* Research Section */}
            {research.length > 0 && (
              <Section
                title="Research Papers"
                count={research.length}
                icon={DocumentTextIcon}
                color="cyan"
              >
                {research.map((r: any) => (
                  <SubmissionCard
                    key={r.id}
                    title={r.title}
                    description={r.abstract}
                    status={r.status}
                    createdAt={r.created_at}
                    metadata={[
                      r.authors && { label: "Authors", value: r.authors },
                      r.journal_name && {
                        label: "Journal",
                        value: r.journal_name,
                      },
                      r.publication_date && {
                        label: "Published",
                        value: new Date(
                          r.publication_date
                        ).toLocaleDateString(),
                      },
                      r.keywords && { label: "Keywords", value: r.keywords },
                    ].filter(Boolean)}
                    links={
                      r.doi_link
                        ? [{ label: "DOI", url: r.doi_link }]
                        : undefined
                    }
                    color="cyan"
                  />
                ))}
              </Section>
            )}

            {/* Task Submissions Section */}
            {showTasks && taskSubs.length > 0 && (
              <Section
                title="Task Submissions"
                count={taskSubs.length}
                icon={ClipboardDocumentCheckIcon}
                color="yellow"
              >
                {taskSubs.map((t: any) => (
                  <SubmissionCard
                    key={t.id}
                    title={t.task_title || t.task?.title || "Task Submission"}
                    description={t.content}
                    status={t.status}
                    createdAt={t.created_at}
                    attachment={t.attachment}
                    color="yellow"
                  />
                ))}
              </Section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Section Component
function Section({
  title,
  count,
  icon: Icon,
  color,
  children,
}: {
  title: string;
  count: number;
  icon: any;
  color: "pink" | "purple" | "green" | "blue" | "yellow" | "cyan";
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  const colorClasses = {
    pink: "from-pink-900/30 to-pink-600/20 border-pink-500/20 hover:border-pink-500/40",
    purple:
      "from-purple-900/30 to-purple-600/20 border-purple-500/20 hover:border-purple-500/40",
    green:
      "from-green-900/30 to-green-600/20 border-green-500/20 hover:border-green-500/40",
    blue: "from-blue-900/30 to-blue-600/20 border-blue-500/20 hover:border-blue-500/40",
    yellow:
      "from-yellow-900/30 to-yellow-600/20 border-yellow-500/20 hover:border-yellow-500/40",
    cyan: "from-cyan-900/30 to-cyan-600/20 border-cyan-500/20 hover:border-cyan-500/40",
  };

  const iconColorClasses = {
    pink: "text-pink-400",
    purple: "text-purple-400",
    green: "text-green-400",
    blue: "text-blue-400",
    yellow: "text-yellow-400",
    cyan: "text-cyan-400",
  };

  return (
    <div
      className={`bg-gradient-to-br ${colorClasses[color]} backdrop-blur-xl rounded-2xl border transition-all duration-300 overflow-hidden`}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center`}
          >
            <Icon className={`w-6 h-6 ${iconColorClasses[color]}`} />
          </div>
          <h3 className="text-lg font-bold text-white">
            {title}{" "}
            <span className="text-xs font-normal text-gray-400">({count})</span>
          </h3>
        </div>
        {collapsed ? (
          <ChevronDownIcon className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronUpIcon className="w-5 h-5 text-gray-400" />
        )}
      </button>
      {!collapsed && <div className="p-5 pt-0 space-y-3">{children}</div>}
    </div>
  );
}

// Submission Card Component
function SubmissionCard({
  title,
  description,
  status,
  createdAt,
  attachment,
  links,
  metadata,
  color,
}: {
  title: string;
  description?: string;
  status: string;
  createdAt: string;
  attachment?: string;
  links?: Array<{ label: string; url: string }>;
  metadata?: Array<{ label: string; value: string }>;
  color: "pink" | "purple" | "green" | "blue" | "yellow" | "cyan";
}) {
  const [expanded, setExpanded] = useState(false);

  const statusColors = {
    APPROVED: "bg-green-500/20 text-green-400 border border-green-500/30",
    PENDING: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    REJECTED: "bg-red-500/20 text-red-400 border border-red-500/30",
  };

  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-5 hover:border-gray-600/50 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-base text-white mb-1.5 truncate">
            {title}
          </h4>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <ClockIcon className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>
        </div>
        <span
          className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
            statusColors[status as keyof typeof statusColors] ||
            statusColors.PENDING
          }`}
        >
          {status}
        </span>
      </div>

      {description && (
        <div className="mb-3">
          <p
            className={`text-xs text-gray-300 leading-relaxed ${
              expanded ? "" : "line-clamp-2"
            }`}
          >
            {description}
          </p>
          {description.length > 100 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-blue-400 hover:text-blue-300 mt-1 font-medium"
            >
              {expanded ? "Show less ↑" : "Read more ↓"}
            </button>
          )}
        </div>
      )}

      {metadata && metadata.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-3">
          {metadata.map((m: any, i: number) => (
            <div
              key={i}
              className="text-xs bg-gray-800/50 px-2.5 py-1.5 rounded-lg"
            >
              <span className="text-gray-500">{m.label}:</span>{" "}
              <span className="text-gray-300 font-medium">{m.value}</span>
            </div>
          ))}
        </div>
      )}

      {attachment && (
        <div className="mb-3">
          <a
            href={
              attachment.startsWith("http")
                ? attachment
                : `${base}${attachment}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-medium bg-blue-500/10 px-3 py-1.5 rounded-lg hover:bg-blue-500/20 transition-all"
          >
            <PaperClipIcon className="w-4 h-4" />
            View Attachment
          </a>
        </div>
      )}

      {links && links.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {links.map((link: any, i: number) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium bg-blue-500/10 px-2.5 py-1.5 rounded-lg hover:bg-blue-500/20 transition-all"
            >
              <LinkIcon className="w-3.5 h-3.5" />
              {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
