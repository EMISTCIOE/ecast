import React, { useEffect, useState } from "react";
import { useBlogs } from "@/lib/hooks/blogs";
import { useNotices } from "@/lib/hooks/notices";
import { useProjects } from "@/lib/hooks/projects";
import { useEvents } from "@/lib/hooks/events";

type Props = {
  role: "MEMBER" | "AMBASSADOR" | "ALUMNI" | "ADMIN";
  showTasks?: boolean;
};

export default function MySubmissions({ role, showTasks = true }: Props) {
  const [status, setStatus] = useState<"PENDING" | "APPROVED" | "REJECTED">(
    "PENDING"
  );
  const [blogs, setBlogs] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [taskSubs, setTaskSubs] = useState<any[]>([]);

  const blogsApi = useBlogs();
  const noticesApi = useNotices();
  const projectsApi = useProjects();
  const eventsApi = useEvents();

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
      setTaskSubs([]);
    }
  }, [status, role]);

  const pill = (s: string) => (
    <span
      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
        s === "APPROVED"
          ? "bg-green-900 text-green-200"
          : s === "PENDING"
          ? "bg-yellow-900 text-yellow-200"
          : "bg-red-900 text-red-200"
      }`}
    >
      {s}
    </span>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold">My Submissions</h2>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setStatus("PENDING")}
            className={`px-3 py-1 rounded transition-colors ${
              status === "PENDING"
                ? "bg-yellow-700/40 text-yellow-200 border border-yellow-600"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Pending only
          </button>
          <button
            onClick={() => setStatus("APPROVED")}
            className={`px-3 py-1 rounded transition-colors ${
              status === "APPROVED"
                ? "bg-green-700/40 text-green-200 border border-green-600"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Approved only
          </button>
          <button
            onClick={() => setStatus("REJECTED")}
            className={`px-3 py-1 rounded transition-colors ${
              status === "REJECTED"
                ? "bg-red-700/40 text-red-200 border border-red-600"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Rejected only
          </button>
        </div>
      </div>

      {/* Blogs */}
      <Section title={`Blogs (${blogs.length})`}>
        <List
          items={blogs}
          render={(b: any) => (
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{b.title}</div>
                <div className="text-xs text-gray-400 truncate">
                  {b.description || ""}
                </div>
              </div>
              {pill(b.status)}
            </div>
          )}
        />
      </Section>

      {role !== "ALUMNI" && (
        <>
          <Section title={`Notices (${notices.length})`}>
            <List
              items={notices}
              render={(n: any) => (
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{n.title}</div>
                    <div className="text-xs text-gray-400 truncate">
                      Audience: {n.audience}
                    </div>
                  </div>
                  {pill(n.status)}
                </div>
              )}
            />
          </Section>

          <Section title={`Projects (${projects.length})`}>
            <List
              items={projects}
              render={(p: any) => (
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{p.title}</div>
                    <div className="text-xs text-gray-400 truncate">
                      {p.description || ""}
                    </div>
                  </div>
                  {pill(p.status)}
                </div>
              )}
            />
          </Section>

          <Section title={`Events (${events.length})`}>
            <List
              items={events}
              render={(e: any) => (
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{e.title}</div>
                    <div className="text-xs text-gray-400 truncate">
                      {e.location || ""}
                    </div>
                  </div>
                  {pill(e.status)}
                </div>
              )}
            />
          </Section>

          {showTasks && (
            <Section title={`Task Submissions (${taskSubs.length})`}>
              <List
                items={taskSubs}
                render={(t: any) => (
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {t.task_title || t.task?.title || "Task"}
                      </div>
                      <div className="text-xs text-gray-400 truncate">
                        {new Date(t.created_at).toLocaleString()}
                      </div>
                    </div>
                    {pill(t.status)}
                  </div>
                )}
              />
            </Section>
          )}
        </>
      )}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );
}

function List({
  items,
  render,
}: {
  items: any[];
  render: (it: any) => React.ReactNode;
}) {
  if (!items || items.length === 0)
    return <div className="text-gray-400 text-sm">No items</div>;
  return (
    <div className="space-y-2">
      {items.map((it) => (
        <div
          key={it.id || it.uuid || JSON.stringify(it)}
          className="bg-gray-900/50 border border-gray-700 rounded-lg p-3"
        >
          {render(it)}
        </div>
      ))}
    </div>
  );
}
