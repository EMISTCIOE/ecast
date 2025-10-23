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
} from "@heroicons/react/24/outline";

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
    <div className="group bg-gradient-to-r from-gray-900/60 to-gray-800/60 rounded-xl border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h4 className="font-semibold text-lg text-white group-hover:text-blue-300 transition-colors">
                {task.title}
              </h4>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
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
            <div className="flex items-center gap-3 text-sm text-gray-400 mb-3">
              <div className="flex items-center gap-1.5">
                <ClockIcon className="w-4 h-4" />
                <span className={isOverdue ? "text-red-400 font-semibold" : ""}>
                  Due: {formattedDate}
                  {isOverdue && " (Overdue!)"}
                </span>
              </div>
            </div>
            {task.description && (
              <div className="mt-2">
                <p className="text-sm text-gray-300 leading-relaxed line-clamp-2">
                  {task.description}
                </p>
              </div>
            )}
          </div>
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 rounded-lg font-medium transition-all duration-300 hover:scale-105 border border-blue-500/30 whitespace-nowrap flex items-center gap-1.5"
          >
            Submit <span className="text-lg leading-none">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

interface OverviewSectionProps {
  tasks: any[];
  notices: any[];
  onNavigate: (section: string) => void;
  onTaskSelect: (taskId: string) => void;
}

export default function OverviewSection({
  tasks,
  notices,
  onNavigate,
  onTaskSelect,
}: OverviewSectionProps) {
  const sorted = [...notices].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Welcome Header */}
      <div className="text-center">
        <div>
          <h1 className="text-5xl font-extrabold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Welcome Back! 👋
          </h1>
          <p className="text-gray-400 text-lg">Let's make today productive</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <SparklesIcon className="w-7 h-7 text-yellow-400" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <button
            onClick={() => onNavigate("notices")}
            className="group relative overflow-hidden bg-gradient-to-br from-purple-900/40 via-purple-800/20 to-purple-600/10 p-8 rounded-2xl border border-purple-500/30 hover:border-purple-400/60 shadow-xl hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 hover:scale-105 hover:-translate-y-2"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 via-purple-500/0 to-purple-400/0 group-hover:from-purple-600/10 group-hover:via-purple-500/5 group-hover:to-purple-400/10 transition-all duration-500"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                <BellIcon className="w-7 h-7 text-purple-400 group-hover:text-purple-300" />
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-purple-300 transition-colors">
                Create Notice
              </h3>
              <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                Post important announcements
              </p>
            </div>
          </button>

          <button
            onClick={() => onNavigate("blog")}
            className="group relative overflow-hidden bg-gradient-to-br from-pink-900/40 via-pink-800/20 to-pink-600/10 p-8 rounded-2xl border border-pink-500/30 hover:border-pink-400/60 shadow-xl hover:shadow-2xl hover:shadow-pink-500/30 transition-all duration-500 hover:scale-105 hover:-translate-y-2"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-600/0 via-pink-500/0 to-pink-400/0 group-hover:from-pink-600/10 group-hover:via-pink-500/5 group-hover:to-pink-400/10 transition-all duration-500"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-pink-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-pink-500/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                <DocumentTextIcon className="w-7 h-7 text-pink-400 group-hover:text-pink-300" />
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-pink-300 transition-colors">
                Write Blog
              </h3>
              <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                Share your thoughts & ideas
              </p>
            </div>
          </button>

          <button
            onClick={() => onNavigate("project")}
            className="group relative overflow-hidden bg-gradient-to-br from-blue-900/40 via-blue-800/20 to-blue-600/10 p-8 rounded-2xl border border-blue-500/30 hover:border-blue-400/60 shadow-xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 hover:scale-105 hover:-translate-y-2"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 via-blue-500/0 to-blue-400/0 group-hover:from-blue-600/10 group-hover:via-blue-500/5 group-hover:to-blue-400/10 transition-all duration-500"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                <FolderIcon className="w-7 h-7 text-blue-400 group-hover:text-blue-300" />
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-300 transition-colors">
                Add Project
              </h3>
              <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                Showcase your amazing work
              </p>
            </div>
          </button>

          <button
            onClick={() => onNavigate("event")}
            className="group relative overflow-hidden bg-gradient-to-br from-emerald-900/40 via-emerald-800/20 to-emerald-600/10 p-8 rounded-2xl border border-emerald-500/30 hover:border-emerald-400/60 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-500 hover:scale-105 hover:-translate-y-2"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/0 via-emerald-500/0 to-emerald-400/0 group-hover:from-emerald-600/10 group-hover:via-emerald-500/5 group-hover:to-emerald-400/10 transition-all duration-500"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-emerald-500/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                <CalendarIcon className="w-7 h-7 text-emerald-400 group-hover:text-emerald-300" />
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-300 transition-colors">
                Create Event
              </h3>
              <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                Organize exciting activities
              </p>
            </div>
          </button>

          <button
            onClick={() => onNavigate("gallery")}
            className="group relative overflow-hidden bg-gradient-to-br from-cyan-900/40 via-cyan-800/20 to-cyan-600/10 p-8 rounded-2xl border border-cyan-500/30 hover:border-cyan-400/60 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-500 hover:scale-105 hover:-translate-y-2"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/0 via-cyan-500/0 to-cyan-400/0 group-hover:from-cyan-600/10 group-hover:via-cyan-500/5 group-hover:to-cyan-400/10 transition-all duration-500"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-cyan-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-cyan-500/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                <PhotoIcon className="w-7 h-7 text-cyan-400 group-hover:text-cyan-300" />
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-300 transition-colors">
                Upload Gallery
              </h3>
              <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                Share photos & memories
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Tasks Assigned Summary */}
      <div className="bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl p-8 rounded-2xl border border-gray-700/50 shadow-2xl hover:border-gray-600/50 transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <ClipboardDocumentCheckIcon className="w-6 h-6 text-blue-400" />
            </div>
            Tasks Assigned
          </h3>
          <button
            onClick={() => onNavigate("submit")}
            className="group px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 flex items-center gap-2 hover:scale-105"
          >
            <PaperAirplaneIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            Submit Task
          </button>
        </div>
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <ClockIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No tasks assigned yet.</p>
            <p className="text-gray-500 text-sm mt-2">
              Check back later for new assignments
            </p>
          </div>
        ) : (
          <div className="space-y-4">
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
              <div className="text-center pt-2">
                <button
                  onClick={() => onNavigate("submit")}
                  className="text-sm text-blue-400 hover:text-blue-300 font-medium hover:underline"
                >
                  +{tasks.length - 3} more tasks • View all →
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recent Notices */}
      <div className="bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 backdrop-blur-xl p-8 rounded-2xl border border-gray-700/50 shadow-2xl hover:border-gray-600/50 transition-all duration-300">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
            <BellIcon className="w-6 h-6 text-purple-400" />
          </div>
          Recent Notices
        </h3>
        {sorted.length === 0 ? (
          <div className="text-center py-12">
            <BellIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No notices yet</p>
            <p className="text-gray-500 text-sm mt-2">
              Stay tuned for important announcements
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sorted.slice(0, 5).map((n) => (
              <div
                key={n.id}
                className="group bg-gradient-to-r from-gray-900/60 to-gray-800/60 p-6 rounded-xl border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-purple-300 group-hover:text-purple-200 transition-colors mb-2">
                      {n.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        {new Date(n.created_at).toLocaleDateString()}
                      </span>
                      <span className="px-2 py-1 bg-purple-500/20 rounded-md text-purple-300 text-xs font-semibold">
                        {n.audience}
                      </span>
                      <span>by {n.published_by_username}</span>
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">
                      {n.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
