import {
  DocumentTextIcon,
  ClockIcon,
  SparklesIcon,
  PlusCircleIcon,
  CheckCircleIcon,
  ChartBarIcon,
  EyeIcon,
  XCircleIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import AnalyticsOverview from "@/components/dashboard-member/sections/AnalyticsOverview";

interface OverviewSectionProps {
  blogs: any[];
  research?: any[];
  onNavigate: (section: string) => void;
}

export default function OverviewSection({
  blogs,
  research = [],
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

  const approvedResearch = research.filter(
    (r: any) => r.status === "APPROVED"
  ).length;
  const pendingResearch = research.filter(
    (r: any) => r.status === "PENDING"
  ).length;
  const rejectedResearch = research.filter(
    (r: any) => r.status === "REJECTED"
  ).length;

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
        Alumni Dashboard Overview
      </h1>

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
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onNavigate("blog")}
                className="bg-gradient-to-r from-pink-600/20 to-orange-600/20 hover:from-pink-600/30 hover:to-orange-600/30 border border-pink-500/30 p-2.5 rounded-lg transition flex items-center gap-2 text-xs font-medium"
              >
                <PlusCircleIcon className="w-4 h-4" /> Write Blog
              </button>
              <button
                onClick={() => onNavigate("research")}
                className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 hover:from-amber-600/30 hover:to-orange-600/30 border border-amber-500/30 p-2.5 rounded-lg transition flex items-center gap-2 text-xs font-medium"
              >
                <PlusCircleIcon className="w-4 h-4" /> Submit Research
              </button>
            </div>
          </div>

          {/* Stats Overview - 2 columns */}
          <div className="grid md:grid-cols-2 gap-3">
            {/* Blog Status Overview */}
            <div className="bg-gray-900/50 backdrop-blur p-3 rounded-lg border border-gray-800">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <DocumentTextIcon className="w-4 h-4 text-pink-400" />
                Blog Status
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-gray-300">Approved</span>
                  </div>
                  <span className="text-sm font-bold text-green-400">
                    {approvedBlogs}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-1.5 bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
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
                    <ClockIcon className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs text-gray-300">Pending</span>
                  </div>
                  <span className="text-sm font-bold text-yellow-400">
                    {pendingBlogs}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-1.5 bg-gradient-to-r from-yellow-500 to-yellow-400 transition-all duration-500"
                    style={{
                      width: `${
                        blogs.length > 0
                          ? (pendingBlogs / blogs.length) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>

                {rejectedBlogs > 0 && (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <XCircleIcon className="w-4 h-4 text-red-400" />
                        <span className="text-xs text-gray-300">Rejected</span>
                      </div>
                      <span className="text-sm font-bold text-red-400">
                        {rejectedBlogs}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-1.5 bg-gradient-to-r from-red-500 to-red-400 transition-all duration-500"
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

            {/* Research Status Overview */}
            <div className="bg-gray-900/50 backdrop-blur p-3 rounded-lg border border-gray-800">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <AcademicCapIcon className="w-4 h-4 text-amber-400" />
                Research Status
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-gray-300">Approved</span>
                  </div>
                  <span className="text-sm font-bold text-green-400">
                    {approvedResearch}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-1.5 bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
                    style={{
                      width: `${
                        research.length > 0
                          ? (approvedResearch / research.length) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs text-gray-300">Pending</span>
                  </div>
                  <span className="text-sm font-bold text-yellow-400">
                    {pendingResearch}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-1.5 bg-gradient-to-r from-yellow-500 to-yellow-400 transition-all duration-500"
                    style={{
                      width: `${
                        research.length > 0
                          ? (pendingResearch / research.length) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>

                {rejectedResearch > 0 && (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <XCircleIcon className="w-4 h-4 text-red-400" />
                        <span className="text-xs text-gray-300">Rejected</span>
                      </div>
                      <span className="text-sm font-bold text-red-400">
                        {rejectedResearch}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-1.5 bg-gradient-to-r from-red-500 to-red-400 transition-all duration-500"
                        style={{
                          width: `${
                            research.length > 0
                              ? (rejectedResearch / research.length) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-900/50 backdrop-blur p-3 rounded-lg border border-gray-800">
            <h3 className="text-sm font-semibold mb-2">Recent Activity</h3>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2 text-gray-400">
                <DocumentTextIcon className="w-3.5 h-3.5" />
                <span>{blogs.length} total blogs created</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <CheckCircleIcon className="w-3.5 h-3.5 text-green-400" />
                <span>{approvedBlogs} blogs published</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <ClockIcon className="w-3.5 h-3.5 text-yellow-400" />
                <span>{pendingBlogs} blogs awaiting review</span>
              </div>
              <hr className="border-gray-700 my-1.5" />
              <div className="flex items-center gap-2 text-gray-400">
                <AcademicCapIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>{research.length} research papers submitted</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <CheckCircleIcon className="w-3.5 h-3.5 text-green-400" />
                <span>{approvedResearch} research approved</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <ClockIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>{pendingResearch} research pending</span>
              </div>
              {rejectedBlogs > 0 && (
                <div className="flex items-center gap-2 text-gray-400">
                  <XCircleIcon className="w-3.5 h-3.5 text-red-400" />
                  <span>{rejectedBlogs} blogs needs revision</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Analytics */}
        <div className="lg:col-span-1">
          <AnalyticsOverview blogs={blogs} />
        </div>
      </div>

      {/* Recent Blogs */}
      {blogs.length > 0 && (
        <div className="bg-gray-900/50 backdrop-blur p-3 rounded-lg border border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <DocumentTextIcon className="w-4 h-4 text-pink-400" />
              Recent Blogs
            </h3>
            <button
              onClick={() => onNavigate("blog")}
              className="text-xs text-pink-400 hover:text-pink-300 font-medium hover:underline"
            >
              View all →
            </button>
          </div>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {blogs.slice(0, 3).map((blog: any) => (
              <div
                key={blog.id}
                className="group bg-gradient-to-r from-gray-900/60 to-gray-800/60 rounded-lg border border-gray-700/50 hover:border-pink-500/30 transition-all duration-300 overflow-hidden cursor-pointer"
                onClick={() => onNavigate("blog")}
              >
                <div className="p-2">
                  <div className="flex items-center gap-2 mb-1">
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
                  <h4 className="font-semibold text-xs text-white group-hover:text-pink-300 transition-colors mb-1 line-clamp-2">
                    {blog.title}
                  </h4>
                  <p className="text-xs text-gray-400 line-clamp-1 mb-1">
                    {blog.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <ClockIcon className="w-2.5 h-2.5" />
                    <span>
                      {new Date(blog.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {blogs.length > 3 && (
            <div className="text-center pt-2">
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

      {/* Recent Research Papers */}
      {research.length > 0 && (
        <div className="bg-gray-900/50 backdrop-blur p-3 rounded-lg border border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <AcademicCapIcon className="w-4 h-4 text-amber-400" />
              Recent Research
            </h3>
            <button
              onClick={() => onNavigate("research")}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium hover:underline"
            >
              View all →
            </button>
          </div>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {research.slice(0, 3).map((paper: any) => (
              <div
                key={paper.id}
                className="group bg-gradient-to-r from-gray-900/60 to-gray-800/60 rounded-lg border border-gray-700/50 hover:border-amber-500/30 transition-all duration-300 overflow-hidden cursor-pointer"
                onClick={() => onNavigate("research")}
              >
                <div className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        paper.status === "APPROVED"
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : paper.status === "PENDING"
                          ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                          : "bg-red-500/20 text-red-400 border border-red-500/30"
                      }`}
                    >
                      {paper.status}
                    </span>
                  </div>
                  <h4 className="font-semibold text-xs text-white group-hover:text-amber-300 transition-colors mb-1 line-clamp-2">
                    {paper.title}
                  </h4>
                  <p className="text-xs text-gray-400 line-clamp-1 mb-1">
                    {paper.domain || "Research Paper"}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <ClockIcon className="w-2.5 h-2.5" />
                    <span>
                      {new Date(paper.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {research.length > 3 && (
            <div className="text-center pt-2">
              <button
                onClick={() => onNavigate("research")}
                className="text-xs text-gray-400 hover:text-gray-300"
              >
                +{research.length - 3} more papers
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
