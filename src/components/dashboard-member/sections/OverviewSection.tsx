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
  AcademicCapIcon,
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
  research?: any[];
  onNavigate: (section: string) => void;
  onTaskSelect: (taskId: string) => void;
}

export default function OverviewSection({
  tasks,
  notices,
  blogs,
  projects,
  events,
  research = [],
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
  const approvedResearch = research.filter(
    (r: any) => r.status === "APPROVED"
  ).length;
  const pendingResearch = research.filter(
    (r: any) => r.status === "PENDING"
  ).length;

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
        Dashboard Overview
      </h1>

      {/* Content Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        <div
          onClick={() => onNavigate("notices")}
          className="bg-gradient-to-br from-purple-900/30 to-purple-600/20 p-3 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition cursor-pointer group"
        >
          <BellIcon className="w-7 h-7 mb-1.5 text-purple-400 group-hover:scale-110 transition-transform" />
          <h3 className="text-xs font-semibold mb-0.5">My Notices</h3>
          <p className="text-lg font-bold text-purple-300">{pendingNotices}</p>
          <p className="text-xs text-gray-400">{approvedNotices} approved</p>
        </div>

        <div
          onClick={() => onNavigate("blog")}
          className="bg-gradient-to-br from-pink-900/30 to-pink-600/20 p-3 rounded-lg border border-pink-500/20 hover:border-pink-500/40 transition cursor-pointer group"
        >
          <DocumentTextIcon className="w-7 h-7 mb-1.5 text-pink-400 group-hover:scale-110 transition-transform" />
          <h3 className="text-xs font-semibold mb-0.5">My Blogs</h3>
          <p className="text-lg font-bold text-pink-300">{pendingBlogs}</p>
          <p className="text-xs text-gray-400">{approvedBlogs} approved</p>
        </div>

        <div
          onClick={() => onNavigate("event")}
          className="bg-gradient-to-br from-blue-900/30 to-blue-600/20 p-3 rounded-lg border border-blue-500/20 hover:border-blue-500/40 transition cursor-pointer group"
        >
          <CalendarIcon className="w-7 h-7 mb-1.5 text-blue-400 group-hover:scale-110 transition-transform" />
          <h3 className="text-xs font-semibold mb-0.5">My Events</h3>
          <p className="text-lg font-bold text-blue-300">{pendingEvents}</p>
          <p className="text-xs text-gray-400">{approvedEvents} approved</p>
        </div>

        <div
          onClick={() => onNavigate("project")}
          className="bg-gradient-to-br from-green-900/30 to-green-600/20 p-3 rounded-lg border border-green-500/20 hover:border-green-500/40 transition cursor-pointer group"
        >
          <FolderIcon className="w-7 h-7 mb-1.5 text-green-400 group-hover:scale-110 transition-transform" />
          <h3 className="text-xs font-semibold mb-0.5">My Projects</h3>
          <p className="text-lg font-bold text-green-300">{pendingProjects}</p>
          <p className="text-xs text-gray-400">{approvedProjects} approved</p>
        </div>

        <div
          onClick={() => onNavigate("research")}
          className="bg-gradient-to-br from-amber-900/30 to-amber-600/20 p-3 rounded-lg border border-amber-500/20 hover:border-amber-500/40 transition cursor-pointer group"
        >
          <AcademicCapIcon className="w-7 h-7 mb-1.5 text-amber-400 group-hover:scale-110 transition-transform" />
          <h3 className="text-xs font-semibold mb-0.5">My Research</h3>
          <p className="text-lg font-bold text-amber-300">{pendingResearch}</p>
          <p className="text-xs text-gray-400">{approvedResearch} approved</p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Left Column - 2 cols on desktop */}
        <div className="lg:col-span-2 space-y-3">
          {/* Quick Actions */}
          <div className="bg-gray-900/50 backdrop-blur p-3 rounded-lg border border-gray-800">
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <SparklesIcon className="w-4 h-4 text-yellow-400" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
              <button
                onClick={() => onNavigate("notices")}
                className="bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 p-2 rounded-lg transition flex items-center gap-1.5 text-xs font-medium"
              >
                <PlusCircleIcon className="w-3.5 h-3.5" /> Notice
              </button>
              <button
                onClick={() => onNavigate("blog")}
                className="bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/30 p-2 rounded-lg transition flex items-center gap-1.5 text-xs font-medium"
              >
                <PlusCircleIcon className="w-3.5 h-3.5" /> Blog
              </button>
              <button
                onClick={() => onNavigate("project")}
                className="bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 p-2 rounded-lg transition flex items-center gap-1.5 text-xs font-medium"
              >
                <PlusCircleIcon className="w-3.5 h-3.5" /> Project
              </button>
              <button
                onClick={() => onNavigate("event")}
                className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 p-2 rounded-lg transition flex items-center gap-1.5 text-xs font-medium"
              >
                <PlusCircleIcon className="w-3.5 h-3.5" /> Event
              </button>
              <button
                onClick={() => onNavigate("gallery")}
                className="bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 p-2 rounded-lg transition flex items-center gap-1.5 text-xs font-medium"
              >
                <PlusCircleIcon className="w-3.5 h-3.5" /> Gallery
              </button>
              <button
                onClick={() => onNavigate("research")}
                className="bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 p-2 rounded-lg transition flex items-center gap-1.5 text-xs font-medium"
              >
                <PlusCircleIcon className="w-3.5 h-3.5" /> Research
              </button>
            </div>
          </div>

          {/* Two-Panel Recent Activity and Task Summary */}
          <div className="grid lg:grid-cols-2 gap-3">
            {/* Recent Activity */}
            <div className="bg-gray-900/50 backdrop-blur p-3 rounded-lg border border-gray-800">
              <h3 className="text-sm font-semibold mb-2">Recent Activity</h3>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-gray-400">
                  <DocumentTextIcon className="w-3.5 h-3.5" />
                  <span>{blogs.length} blogs</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <CheckCircleIcon className="w-3.5 h-3.5 text-green-400" />
                  <span>{approvedBlogs} approved</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <ClockIcon className="w-3.5 h-3.5 text-yellow-400" />
                  <span>{pendingBlogs} pending</span>
                </div>
                <hr className="border-gray-700 my-1.5" />
                <div className="flex items-center gap-2 text-gray-400">
                  <FolderIcon className="w-3.5 h-3.5" />
                  <span>{projects.length} projects</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>{events.length} events</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <BellIcon className="w-3.5 h-3.5" />
                  <span>{notices.length} notices</span>
                </div>
                <hr className="border-gray-700 my-1.5" />
                <div className="flex items-center gap-2 text-gray-400">
                  <AcademicCapIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span>{research.length} research</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <CheckCircleIcon className="w-3.5 h-3.5 text-green-400" />
                  <span>{approvedResearch} approved</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <ClockIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span>{pendingResearch} pending</span>
                </div>
              </div>
            </div>

            {/* Task Summary */}
            <div className="bg-gray-900/50 backdrop-blur p-3 rounded-lg border border-gray-800">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <ClipboardDocumentCheckIcon className="w-4 h-4 text-blue-400" />
                Task Summary
              </h3>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total</span>
                  <span className="font-semibold">{tasks.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Completed</span>
                  <span className="font-semibold text-green-400">
                    {tasks.filter((t: any) => t.status === "COMPLETED").length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Submitted</span>
                  <span className="font-semibold text-yellow-400">
                    {tasks.filter((t: any) => t.status === "SUBMITTED").length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
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
                  className="w-full mt-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 p-1.5 rounded-lg transition flex items-center justify-center gap-2 text-xs font-medium"
                >
                  <PaperAirplaneIcon className="w-3 h-3" /> Submit Task
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Analytics */}
        <div className="lg:col-span-1">
          <AnalyticsOverview blogs={blogs} />
        </div>
      </div>

      {/* Tasks Assigned */}
      {tasks.length > 0 && (
        <div className="bg-gray-900/50 backdrop-blur p-3 rounded-lg border border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <ClipboardDocumentCheckIcon className="w-4 h-4 text-blue-400" />
              Tasks Assigned
            </h3>
            <button
              onClick={() => onNavigate("submit")}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium hover:underline"
            >
              View all →
            </button>
          </div>
          <div className="space-y-1.5">
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
        <div className="bg-gray-900/50 backdrop-blur p-3 rounded-lg border border-gray-800">
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <BellIcon className="w-4 h-4 text-purple-400" />
            Recent Notices
          </h3>
          <div className="space-y-1.5">
            {sorted.slice(0, 3).map((n) => (
              <div
                key={n.id}
                className="group bg-gradient-to-r from-gray-900/60 to-gray-800/60 p-2 rounded-lg border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300"
              >
                <h4 className="font-semibold text-xs text-purple-300 group-hover:text-purple-200 transition-colors mb-0.5 line-clamp-1">
                  {n.title}
                </h4>
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 mb-0.5">
                  <span className="flex items-center gap-1">
                    <ClockIcon className="w-2.5 h-2.5" />
                    {new Date(n.created_at).toLocaleDateString()}
                  </span>
                  <span className="px-1 py-0.5 bg-purple-500/20 rounded text-purple-300 text-xs font-semibold">
                    {n.audience}
                  </span>
                </div>
                <p className="text-xs text-gray-400 line-clamp-1">
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
