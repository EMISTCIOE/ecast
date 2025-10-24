/**
 * Realtime Analytics Monitor
 * Displays live website activity with auto-refresh
 */

import React, { useMemo } from "react";
import {
  Activity,
  Users,
  Globe2,
  MousePointer,
  Clock,
  Eye,
} from "lucide-react";
import { useRealtime, useActiveUsers } from "@/hooks/useAnalytics";
import { format } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RealtimeMonitorProps {
  websiteId: string;
  timezone?: string;
  refreshInterval?: number;
}

export const RealtimeMonitor: React.FC<RealtimeMonitorProps> = ({
  websiteId,
  timezone,
  refreshInterval = 5000,
}) => {
  const { data: realtimeData, loading } = useRealtime(websiteId, timezone, {
    refreshInterval,
  });

  const { data: activeData } = useActiveUsers(websiteId, {
    refreshInterval: 30000,
  });

  // Format series data for chart
  const chartData = useMemo(() => {
    if (!realtimeData?.series) return [];

    const timestamps = realtimeData.series.views.map((v) => v.x);
    return timestamps.map((timestamp, i) => ({
      time: format(new Date(timestamp), "HH:mm"),
      views: realtimeData.series.views[i]?.y || 0,
      visitors: realtimeData.series.visitors[i]?.y || 0,
    }));
  }, [realtimeData]);

  // Top countries
  const topCountries = useMemo(() => {
    if (!realtimeData?.countries) return [];
    return Object.entries(realtimeData.countries)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  }, [realtimeData]);

  // Top pages
  const topPages = useMemo(() => {
    if (!realtimeData?.urls) return [];
    return Object.entries(realtimeData.urls)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);
  }, [realtimeData]);

  // Top referrers
  const topReferrers = useMemo(() => {
    if (!realtimeData?.referrers) return [];
    return Object.entries(realtimeData.referrers)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  }, [realtimeData]);

  if (loading && !realtimeData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-gray-500">
          Loading realtime data...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Activity className="w-6 h-6 text-green-600 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Realtime Activity
            </h2>
            <p className="text-sm text-gray-500">
              Last 30 minutes • Updates every {refreshInterval / 1000}s
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-green-700">Live</span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Eye className="w-5 h-5" />}
          label="Current Views"
          value={realtimeData?.totals?.views || 0}
          color="blue"
        />
        <StatCard
          icon={<Users className="w-5 h-5" />}
          label="Active Visitors"
          value={activeData?.visitors || realtimeData?.totals?.visitors || 0}
          color="green"
        />
        <StatCard
          icon={<MousePointer className="w-5 h-5" />}
          label="Events"
          value={realtimeData?.totals?.events || 0}
          color="purple"
        />
        <StatCard
          icon={<Globe2 className="w-5 h-5" />}
          label="Countries"
          value={realtimeData?.totals?.countries || 0}
          color="orange"
        />
      </div>

      {/* Activity Chart */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Activity Trend
        </h3>
        <div className="h-64 bg-slate-900/50 rounded-lg p-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                opacity={0.5}
              />
              <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "2px solid #8B5CF6",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Line
                type="monotone"
                dataKey="views"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                name="Views"
              />
              <Line
                type="monotone"
                dataKey="visitors"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                name="Visitors"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Pages */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Active Pages
          </h3>
          <div className="space-y-3">
            {topPages.length > 0 ? (
              topPages.map(([url, count], i) => (
                <div
                  key={i}
                  className="flex items-center justify-between hover:bg-slate-700/50 p-2 rounded-lg transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-200 truncate">
                      {url}
                    </p>
                  </div>
                  <span className="ml-2 px-2 py-1 text-xs font-semibold text-blue-300 bg-blue-500/20 border border-blue-500/30 rounded">
                    {count}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No active pages
              </p>
            )}
          </div>
        </div>

        {/* Top Countries */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Top Countries
          </h3>
          <div className="space-y-3">
            {topCountries.length > 0 ? (
              topCountries.map(([country, count], i) => (
                <div
                  key={i}
                  className="flex items-center justify-between hover:bg-slate-700/50 p-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getCountryFlag(country)}</span>
                    <span className="text-sm font-medium text-gray-200">
                      {country}
                    </span>
                  </div>
                  <span className="px-2 py-1 text-xs font-semibold text-green-300 bg-green-500/20 border border-green-500/30 rounded">
                    {count}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">
                No active countries
              </p>
            )}
          </div>
        </div>

        {/* Top Referrers */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Top Referrers
          </h3>
          <div className="space-y-3">
            {topReferrers.length > 0 ? (
              topReferrers.map(([referrer, count], i) => (
                <div
                  key={i}
                  className="flex items-center justify-between hover:bg-slate-700/50 p-2 rounded-lg transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-200 truncate">
                      {referrer}
                    </p>
                  </div>
                  <span className="ml-2 px-2 py-1 text-xs font-semibold text-purple-300 bg-purple-500/20 border border-purple-500/30 rounded">
                    {count}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">
                No referrers
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" />
          Recent Events
        </h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {realtimeData?.events && realtimeData.events.length > 0 ? (
            realtimeData.events.slice(0, 20).map((event, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded ${
                        event.__type === "pageview"
                          ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      }`}
                    >
                      {event.__type}
                    </span>
                    {event.eventName && (
                      <span className="text-sm font-medium text-gray-200">
                        {event.eventName}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 truncate mt-1">
                    {event.urlPath}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span>
                      {getCountryFlag(event.country)} {event.country}
                    </span>
                    <span>•</span>
                    <span>{event.device}</span>
                    <span>•</span>
                    <span>{event.browser}</span>
                  </div>
                </div>
                <span className="ml-4 text-xs text-gray-400">
                  {format(new Date(event.createdAt), "HH:mm:ss")}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">
              No recent events
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: "blue" | "green" | "purple" | "orange";
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => {
  const colorClasses = {
    blue: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    green: "bg-green-500/20 text-green-300 border-green-500/30",
    purple: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    orange: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700 p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg border ${colorClasses[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-400">{label}</p>
          <p className="text-2xl font-bold text-white">
            {value.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

// Helper function to get country flag emoji
function getCountryFlag(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return "🌐";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
