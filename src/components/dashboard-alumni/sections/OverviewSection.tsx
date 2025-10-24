import {
  DocumentTextIcon,
  ClockIcon,
  SparklesIcon,
  PlusCircleIcon,
  CheckCircleIcon,
  ChartBarIcon,
  EyeIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import AnalyticsOverview from "@/components/dashboard-member/sections/AnalyticsOverview";

interface OverviewSectionProps {
  blogs: any[];
  onNavigate: (section: string) => void;
}

export default function OverviewSection({
  blogs,
  onNavigate,
}: OverviewSectionProps) {
  // Calculate content stats
  const approvedBlogs = blogs.filter(
    (b: any) => b.status === "APPROVED"
  ).length;
  const pendingBlogs = blogs.filter((b: any) => b.status === "PENDING").length;
  const rejectedBlogs = blogs.filter(
    (b: any) => b.status === "REJECTED"
  ).length;

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
        Alumni Dashboard Overview
      </h1>

      {/* Content Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => onNavigate("blog")}
          className="bg-gradient-to-br from-green-900/30 to-green-600/20 p-4 rounded-lg border border-green-500/20 hover:border-green-500/40 transition cursor-pointer"
        >
          <CheckCircleIcon className="w-8 h-8 mb-2 text-green-400" />
          <h3 className="text-sm font-semibold mb-1">Approved Blogs</h3>
          <p className="text-2xl font-bold text-green-300">{approvedBlogs}</p>
          <p className="text-xs text-gray-400 mt-1">Published & Live</p>
        </div>

        <div
          onClick={() => onNavigate("blog")}
          className="bg-gradient-to-br from-yellow-900/30 to-yellow-600/20 p-4 rounded-lg border border-yellow-500/20 hover:border-yellow-500/40 transition cursor-pointer"
        >
          <ClockIcon className="w-8 h-8 mb-2 text-yellow-400" />
          <h3 className="text-sm font-semibold mb-1">Pending Blogs</h3>
          <p className="text-2xl font-bold text-yellow-300">{pendingBlogs}</p>
          <p className="text-xs text-gray-400 mt-1">Awaiting Approval</p>
        </div>

        <div
          onClick={() => onNavigate("blog")}
          className="bg-gradient-to-br from-pink-900/30 to-pink-600/20 p-4 rounded-lg border border-pink-500/20 hover:border-pink-500/40 transition cursor-pointer"
        >
          <DocumentTextIcon className="w-8 h-8 mb-2 text-pink-400" />
          <h3 className="text-sm font-semibold mb-1">Total Blogs</h3>
          <p className="text-2xl font-bold text-pink-300">{blogs.length}</p>
          <p className="text-xs text-gray-400 mt-1">All submissions</p>
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
                onClick={() => onNavigate("blog")}
                className="w-full bg-gradient-to-r from-pink-600/20 to-orange-600/20 hover:from-pink-600/30 hover:to-orange-600/30 border border-pink-500/30 p-3 rounded-lg transition flex items-center gap-2 text-sm font-medium"
              >
                <PlusCircleIcon className="w-5 h-5" /> Write New Blog
              </button>
              <button
                onClick={() => onNavigate("blog")}
                className="w-full bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 p-2 rounded-lg transition flex items-center gap-2 text-sm"
              >
                <EyeIcon className="w-4 h-4" /> View My Blogs
              </button>
              <button
                onClick={() => onNavigate("submissions")}
                className="w-full bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 p-2 rounded-lg transition flex items-center gap-2 text-sm"
              >
                <ChartBarIcon className="w-4 h-4" /> View Submissions
              </button>
            </div>
          </div>

          {/* Blog Status Overview */}
          <div className="bg-gray-900/50 backdrop-blur p-4 rounded-lg border border-gray-800">
            <h3 className="text-base font-semibold mb-3">Blog Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-gray-300">Approved</span>
                </div>
                <span className="text-lg font-bold text-green-400">
                  {approvedBlogs}
                </span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
                  style={{
                    width: `${
                      blogs.length > 0
                        ? (approvedBlogs / blogs.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm text-gray-300">Pending</span>
                </div>
                <span className="text-lg font-bold text-yellow-400">
                  {pendingBlogs}
                </span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-gradient-to-r from-yellow-500 to-yellow-400 transition-all duration-500"
                  style={{
                    width: `${
                      blogs.length > 0 ? (pendingBlogs / blogs.length) * 100 : 0
                    }%`,
                  }}
                />
              </div>

              {rejectedBlogs > 0 && (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <XCircleIcon className="w-5 h-5 text-red-400" />
                      <span className="text-sm text-gray-300">Rejected</span>
                    </div>
                    <span className="text-lg font-bold text-red-400">
                      {rejectedBlogs}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-gradient-to-r from-red-500 to-red-400 transition-all duration-500"
                      style={{
                        width: `${
                          blogs.length > 0
                            ? (rejectedBlogs / blogs.length) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-900/50 backdrop-blur p-4 rounded-lg border border-gray-800">
            <h3 className="text-base font-semibold mb-3">Recent Activity</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <DocumentTextIcon className="w-4 h-4" />
                <span>{blogs.length} total blogs created</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <CheckCircleIcon className="w-4 h-4 text-green-400" />
                <span>{approvedBlogs} blogs published</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <ClockIcon className="w-4 h-4 text-yellow-400" />
                <span>{pendingBlogs} awaiting review</span>
              </div>
              {rejectedBlogs > 0 && (
                <div className="flex items-center gap-2 text-gray-400">
                  <XCircleIcon className="w-4 h-4 text-red-400" />
                  <span>{rejectedBlogs} needs revision</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Analytics */}
        <div>
          <AnalyticsOverview blogs={blogs} />
        </div>
      </div>

      {/* Recent Blogs */}
      {blogs.length > 0 && (
        <div className="bg-gray-900/50 backdrop-blur p-4 rounded-lg border border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <DocumentTextIcon className="w-5 h-5 text-pink-400" />
              Recent Blogs
            </h3>
            <button
              onClick={() => onNavigate("blog")}
              className="text-xs text-pink-400 hover:text-pink-300 font-medium hover:underline"
            >
              View all →
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {blogs.slice(0, 3).map((blog: any) => (
              <div
                key={blog.id}
                className="group bg-gradient-to-r from-gray-900/60 to-gray-800/60 rounded-lg border border-gray-700/50 hover:border-pink-500/30 transition-all duration-300 overflow-hidden cursor-pointer"
                onClick={() => onNavigate("blog")}
              >
                <div className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        blog.status === "APPROVED"
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : blog.status === "PENDING"
                          ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                          : "bg-red-500/20 text-red-400 border border-red-500/30"
                      }`}
                    >
                      {blog.status}
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm text-white group-hover:text-pink-300 transition-colors mb-1 line-clamp-2">
                    {blog.title}
                  </h4>
                  <p className="text-xs text-gray-400 line-clamp-2 mb-2">
                    {blog.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <ClockIcon className="w-3 h-3" />
                    <span>
                      {new Date(blog.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {blogs.length > 3 && (
            <div className="text-center pt-3">
              <button
                onClick={() => onNavigate("blog")}
                className="text-xs text-gray-400 hover:text-gray-300"
              >
                +{blogs.length - 3} more blogs
              </button>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {blogs.length === 0 && (
        <div className="bg-gray-900/50 backdrop-blur p-8 rounded-lg border border-gray-800 text-center">
          <DocumentTextIcon className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <h3 className="text-xl font-semibold mb-2 text-gray-300">
            No Blogs Yet
          </h3>
          <p className="text-gray-400 mb-4">
            Start sharing your knowledge and experiences with the community!
          </p>
          <button
            onClick={() => onNavigate("blog")}
            className="bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-700 hover:to-orange-700 px-6 py-3 rounded-lg font-semibold shadow-lg transition-all hover:scale-105 inline-flex items-center gap-2"
          >
            <PlusCircleIcon className="w-5 h-5" />
            Write Your First Blog
          </button>
        </div>
      )}
    </div>
  );
}
