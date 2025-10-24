/**
 * Sessions Viewer Component
 * Display and analyze user sessions with detailed drill-down
 */

import React, { useState } from "react";
import {
  Users,
  Clock,
  Eye,
  Activity,
  Search,
  ExternalLink,
} from "lucide-react";
import {
  useSessions,
  useSessionStats,
  useSessionDetails,
  useSessionActivity,
} from "@/hooks/useAnalytics";
import { AnalyticsFilters } from "@/types/analytics";
import { format } from "date-fns";

interface SessionsViewerProps {
  websiteId: string;
  startAt: number;
  endAt: number;
  filters?: AnalyticsFilters;
}

export const SessionsViewer: React.FC<SessionsViewerProps> = ({
  websiteId,
  startAt,
  endAt,
  filters,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );
  const pageSize = 20;

  // Fetch sessions list
  const { data: sessionsData, loading: sessionsLoading } = useSessions({
    websiteId,
    startAt,
    endAt,
    search: searchTerm,
    page,
    pageSize,
    filters,
  });

  // Fetch session stats
  const { data: stats } = useSessionStats({
    websiteId,
    startAt,
    endAt,
    filters,
  });

  // Fetch selected session details
  const { data: sessionDetails } = useSessionDetails(
    websiteId,
    selectedSessionId || "",
    { enabled: !!selectedSessionId }
  );

  // Fetch session activity
  const { data: sessionActivity } = useSessionActivity(
    websiteId,
    selectedSessionId || "",
    startAt,
    endAt,
    { enabled: !!selectedSessionId }
  );

  const totalPages = sessionsData
    ? Math.ceil(sessionsData.count / pageSize)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Sessions</h2>
            <p className="text-sm text-gray-500">
              {sessionsData?.count?.toLocaleString() || 0} sessions recorded
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <StatCard
            icon={<Eye className="w-5 h-5" />}
            label="Pageviews"
            value={stats.pageviews?.value || 0}
            color="blue"
          />
          <StatCard
            icon={<Users className="w-5 h-5" />}
            label="Visitors"
            value={stats.visitors?.value || 0}
            color="green"
          />
          <StatCard
            icon={<Activity className="w-5 h-5" />}
            label="Visits"
            value={stats.visits?.value || 0}
            color="purple"
          />
          <StatCard
            icon={<Activity className="w-5 h-5" />}
            label="Countries"
            value={stats.countries?.value || 0}
            color="orange"
          />
          <StatCard
            icon={<Activity className="w-5 h-5" />}
            label="Events"
            value={stats.events?.value || 0}
            color="red"
          />
        </div>
      )}

      {/* Search */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search sessions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sessions List */}
        <div
          className={`${
            selectedSessionId ? "lg:col-span-2" : "lg:col-span-3"
          } bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700 p-6`}
        >
          <h3 className="text-lg font-semibold text-white mb-4">
            Sessions List
          </h3>

          {sessionsLoading ? (
            <div className="text-center py-8 text-gray-500">
              Loading sessions...
            </div>
          ) : sessionsData &&
            sessionsData.data &&
            sessionsData.data.length > 0 ? (
            <>
              <div className="space-y-3 max-h-[800px] overflow-y-auto">
                {sessionsData.data.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => setSelectedSessionId(session.id)}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedSessionId === session.id
                        ? "bg-blue-50 border-2 border-blue-300"
                        : "bg-slate-700/50 hover:bg-slate-700 border border-transparent"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-gray-500">
                            {session.id.slice(0, 8)}...
                          </span>
                          <span className="px-2 py-0.5 text-xs font-medium bg-gray-200 text-gray-700 rounded">
                            {session.device}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {session.views} views
                          </span>
                          <span className="flex items-center gap-1">
                            <Activity className="w-4 h-4" />
                            {session.visits} visits
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSessionId(session.id);
                        }}
                        className="ml-2 p-1 hover:bg-blue-100 rounded"
                      >
                        <ExternalLink className="w-4 h-4 text-blue-600" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
                      <div>
                        <span className="font-medium">Location:</span>{" "}
                        {session.city}, {session.country}
                      </div>
                      <div>
                        <span className="font-medium">Browser:</span>{" "}
                        {session.browser}
                      </div>
                      <div>
                        <span className="font-medium">OS:</span> {session.os}
                      </div>
                      <div>
                        <span className="font-medium">Screen:</span>{" "}
                        {session.screen}
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium">Time:</span>{" "}
                        {format(
                          new Date(session.firstAt),
                          "MMM dd, yyyy HH:mm"
                        )}{" "}
                        - {format(new Date(session.lastAt), "HH:mm")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-300">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                      className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No sessions found
            </div>
          )}
        </div>

        {/* Session Details */}
        {selectedSessionId && sessionDetails && (
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Session Details
              </h3>
              <button
                onClick={() => setSelectedSessionId(null)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>

            <div className="space-y-4">
              {/* Overview Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-gray-300 mb-1">Views</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {sessionDetails.views}
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-gray-300 mb-1">Events</p>
                  <p className="text-2xl font-bold text-green-600">
                    {sessionDetails.events}
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-xs text-gray-300 mb-1">Visits</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {sessionDetails.visits}
                  </p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="text-xs text-gray-300 mb-1">Duration</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {Math.round(sessionDetails.totaltime / 1000)}s
                  </p>
                </div>
              </div>

              {/* Device Info */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-300">Device</span>
                  <span className="font-medium">{sessionDetails.device}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-300">Browser</span>
                  <span className="font-medium">{sessionDetails.browser}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-300">OS</span>
                  <span className="font-medium">{sessionDetails.os}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-300">Screen</span>
                  <span className="font-medium">{sessionDetails.screen}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-300">Language</span>
                  <span className="font-medium">{sessionDetails.language}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-300">Location</span>
                  <span className="font-medium">
                    {sessionDetails.city}, {sessionDetails.region},{" "}
                    {sessionDetails.country}
                  </span>
                </div>
              </div>

              {/* Session Activity */}
              {sessionActivity && sessionActivity.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-white mb-2">
                    Activity Timeline
                  </h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {sessionActivity.map((activity, i) => (
                      <div key={i} className="p-2 bg-gray-50 rounded text-xs">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                              activity.eventType === 1
                                ? "bg-blue-100 text-blue-700"
                                : "bg-purple-100 text-purple-700"
                            }`}
                          >
                            {activity.eventType === 1 ? "View" : "Event"}
                          </span>
                          {activity.eventName && (
                            <span className="font-medium">
                              {activity.eventName}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-300 truncate">
                          {activity.urlPath}
                        </p>
                        <p className="text-gray-500 mt-1">
                          {format(new Date(activity.createdAt), "HH:mm:ss")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Stat Card Component
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: "blue" | "green" | "purple" | "orange" | "red";
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700 p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>{icon}</div>
        <div>
          <p className="text-sm text-gray-300">{label}</p>
          <p className="text-2xl font-bold text-white">
            {value.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};
