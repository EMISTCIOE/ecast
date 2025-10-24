import {
  BellIcon,
  DocumentTextIcon,
  FolderIcon,
  CalendarIcon,
  ClockIcon,
  SparklesIcon,
  ClipboardDocumentCheckIcon,
  PaperAirplaneIcon,
  PhotoIcon,
  PlusCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import AnalyticsOverview from "./AnalyticsOverview";

interface TaskCardProps {
  task: any;
  onSubmit: () => void;
}

function TaskCard({ task, onSubmit }: TaskCardProps) {
  const dueDate = task.due_date ? new Date(task.due_date) : null;
  const isOverdue = dueDate && dueDate < new Date();
  const formattedDate = dueDate
    ? dueDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "No deadline";

  return (
    <div className="group bg-gradient-to-r from-gray-900/60 to-gray-800/60 rounded-lg border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 overflow-hidden">
      <div className="p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h4 className="font-semibold text-sm text-white group-hover:text-blue-300 transition-colors">
                {task.title}
              </h4>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                  task.status === "COMPLETED"
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : task.status === "SUBMITTED"
                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                }`}
              >
                {task.status || "OPEN"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <ClockIcon className="w-3 h-3" />
              <span className={isOverdue ? "text-red-400 font-semibold" : ""}>
                Due: {formattedDate}
                {isOverdue && " (Overdue!)"}
              </span>
            </div>
          </div>
          <button
            onClick={onSubmit}
            className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 rounded-lg text-xs font-medium transition-all duration-300 border border-blue-500/30 whitespace-nowrap"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

interface OverviewSectionProps {
  tasks: any[];
  notices: any[];
  blogs: any[];
  projects: any[];
  events: any[];
  onNavigate: (section: string) => void;
  onTaskSelect: (taskId: string) => void;
}

export default function OverviewSection({
  tasks,
  notices,
  blogs,
  projects,
  events,
  onNavigate,
  onTaskSelect,
}: OverviewSectionProps) {
  const sorted = [...notices].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Calculate content stats
  const approvedBlogs = blogs.filter(
    (b: any) => b.status === "APPROVED"
  ).length;
  const pendingBlogs = blogs.filter((b: any) => b.status === "PENDING").length;
  const approvedNotices = notices.filter(
    (n: any) => n.status === "APPROVED"
  ).length;
  const pendingNotices = notices.filter(
    (n: any) => n.status === "PENDING"
  ).length;
  const approvedEvents = events.filter(
    (e: any) => e.status === "APPROVED"
  ).length;
  const pendingEvents = events.filter(
    (e: any) => e.status === "PENDING"
  ).length;
  const approvedProjects = projects.filter(
    (p: any) => p.status === "APPROVED"
  ).length;
  const pendingProjects = projects.filter(
    (p: any) => p.status === "PENDING"
  ).length;

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
        Dashboard Overview
      </h1>

      {/* Content Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigate("notices")}
          className="bg-gradient-to-br from-purple-900/30 to-purple-600/20 p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition cursor-pointer"
        >
          <BellIcon className="w-8 h-8 mb-2 text-purple-400" />
          <h3 className="text-sm font-semibold mb-1">My Notices</h3>
          <p className="text-1xl font-bold text-purple-300">
            {pendingNotices} Pending
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {approvedNotices} Approved
          </p>
        </div>

        <div
          onClick={() => onNavigate("blog")}
          className="bg-gradient-to-br from-pink-900/30 to-pink-600/20 p-4 rounded-lg border border-pink-500/20 hover:border-pink-500/40 transition cursor-pointer"
        >
          <DocumentTextIcon className="w-8 h-8 mb-2 text-pink-400" />
          <h3 className="text-sm font-semibold mb-1">My Blogs</h3>
          <p className="text-1xl font-bold text-pink-300">
            {pendingBlogs} Pending
          </p>
          <p className="text-xs text-gray-400 mt-1">{approvedBlogs} Approved</p>
        </div>

        <div
          onClick={() => onNavigate("event")}
          className="bg-gradient-to-br from-blue-900/30 to-blue-600/20 p-4 rounded-lg border border-blue-500/20 hover:border-blue-500/40 transition cursor-pointer"
        >
          <CalendarIcon className="w-8 h-8 mb-2 text-blue-400" />
          <h3 className="text-sm font-semibold mb-1">My Events</h3>
          <p className="text-1xl font-bold text-blue-300">
            {pendingEvents} Pending
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {approvedEvents} Approved
          </p>
        </div>

        <div
          onClick={() => onNavigate("project")}
          className="bg-gradient-to-br from-green-900/30 to-green-600/20 p-4 rounded-lg border border-green-500/20 hover:border-green-500/40 transition cursor-pointer"
        >
          <FolderIcon className="w-8 h-8 mb-2 text-green-400" />
          <h3 className="text-sm font-semibold mb-1">My Projects</h3>
          <p className="text-1xl font-bold text-green-300">
            {pendingProjects} Pending
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {approvedProjects} Approved
          </p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="bg-gray-900/50 backdrop-blur p-4 rounded-lg border border-gray-800">
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
              <SparklesIcon className="w-5 h-5 text-yellow-400" />
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => onNavigate("notices")}
                className="w-full bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 p-2 rounded-lg transition flex items-center gap-2 text-sm"
              >
                <PlusCircleIcon className="w-4 h-4" /> Create Notice
              </button>
              <button
                onClick={() => onNavigate("blog")}
                className="w-full bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/30 p-2 rounded-lg transition flex items-center gap-2 text-sm"
              >
                <PlusCircleIcon className="w-4 h-4" /> Write Blog
              </button>
              <button
                onClick={() => onNavigate("project")}
                className="w-full bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 p-2 rounded-lg transition flex items-center gap-2 text-sm"
              >
                <PlusCircleIcon className="w-4 h-4" /> Add Project
              </button>
              <button
                onClick={() => onNavigate("event")}
                className="w-full bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 p-2 rounded-lg transition flex items-center gap-2 text-sm"
              >
                <PlusCircleIcon className="w-4 h-4" /> Create Event
              </button>
              <button
                onClick={() => onNavigate("gallery")}
                className="w-full bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 p-2 rounded-lg transition flex items-center gap-2 text-sm"
              >
                <PlusCircleIcon className="w-4 h-4" /> Upload Gallery
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-900/50 backdrop-blur p-4 rounded-lg border border-gray-800">
            <h3 className="text-base font-semibold mb-3">Recent Activity</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <DocumentTextIcon className="w-4 h-4" />
                <span>{blogs.length} total blogs</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <CheckCircleIcon className="w-4 h-4 text-green-400" />
                <span>{approvedBlogs} blogs approved</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <ClockIcon className="w-4 h-4 text-yellow-400" />
                <span>{pendingBlogs} blogs pending</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <FolderIcon className="w-4 h-4" />
                <span>{projects.length} total projects</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <CalendarIcon className="w-4 h-4" />
                <span>{events.length} total events</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <BellIcon className="w-4 h-4" />
                <span>{notices.length} total notices</span>
              </div>
            </div>
          </div>

          {/* Task Summary */}
          <div className="bg-gray-900/50 backdrop-blur p-4 rounded-lg border border-gray-800">
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
              <ClipboardDocumentCheckIcon className="w-5 h-5 text-blue-400" />
              Task Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Total Assigned</span>
                <span className="font-semibold">{tasks.length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Completed</span>
                <span className="font-semibold text-green-400">
                  {tasks.filter((t: any) => t.status === "COMPLETED").length}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Submitted</span>
                <span className="font-semibold text-yellow-400">
                  {tasks.filter((t: any) => t.status === "SUBMITTED").length}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Pending</span>
                <span className="font-semibold text-blue-400">
                  {
                    tasks.filter((t: any) => !t.status || t.status === "OPEN")
                      .length
                  }
                </span>
              </div>
              <button
                onClick={() => onNavigate("submit")}
                className="w-full mt-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 p-2 rounded-lg transition flex items-center justify-center gap-2 text-sm"
              >
                <PaperAirplaneIcon className="w-4 h-4" /> Submit Task
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Analytics */}
        <div>
          <AnalyticsOverview blogs={blogs} />
        </div>
      </div>

      {/* Tasks Assigned */}
      {tasks.length > 0 && (
        <div className="bg-gray-900/50 backdrop-blur p-4 rounded-lg border border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <ClipboardDocumentCheckIcon className="w-5 h-5 text-blue-400" />
              Tasks Assigned
            </h3>
            <button
              onClick={() => onNavigate("submit")}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium hover:underline"
            >
              View all →
            </button>
          </div>
          <div className="space-y-2">
            {tasks.slice(0, 3).map((t: any) => (
              <TaskCard
                key={t.id}
                task={t}
                onSubmit={() => {
                  onTaskSelect(t.id);
                  onNavigate("submit");
                }}
              />
            ))}
            {tasks.length > 3 && (
              <div className="text-center pt-1">
                <button
                  onClick={() => onNavigate("submit")}
                  className="text-xs text-gray-400 hover:text-gray-300"
                >
                  +{tasks.length - 3} more tasks
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Notices */}
      {sorted.length > 0 && (
        <div className="bg-gray-900/50 backdrop-blur p-4 rounded-lg border border-gray-800">
          <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
            <BellIcon className="w-5 h-5 text-purple-400" />
            Recent Notices
          </h3>
          <div className="space-y-2">
            {sorted.slice(0, 3).map((n) => (
              <div
                key={n.id}
                className="group bg-gradient-to-r from-gray-900/60 to-gray-800/60 p-3 rounded-lg border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300"
              >
                <h4 className="font-semibold text-sm text-purple-300 group-hover:text-purple-200 transition-colors mb-1">
                  {n.title}
                </h4>
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 mb-1">
                  <span className="flex items-center gap-1">
                    <ClockIcon className="w-3 h-3" />
                    {new Date(n.created_at).toLocaleDateString()}
                  </span>
                  <span className="px-1.5 py-0.5 bg-purple-500/20 rounded text-purple-300 font-semibold">
                    {n.audience}
                  </span>
                </div>
                <p className="text-xs text-gray-300 line-clamp-2">
                  {n.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
