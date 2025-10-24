/**
 * Events Dashboard Component
 * Display and analyze custom events with filtering and drill-down
 */

import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Download,
  TrendingUp,
  MousePointer,
} from "lucide-react";
import {
  useEvents,
  useEventSeries,
  useEventDataEvents,
} from "@/hooks/useAnalytics";
import { AnalyticsFilters } from "@/types/analytics";
import { format } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

interface EventsDashboardProps {
  websiteId: string;
  startAt: number;
  endAt: number;
  timezone?: string;
  filters?: AnalyticsFilters;
}

export const EventsDashboard: React.FC<EventsDashboardProps> = ({
  websiteId,
  startAt,
  endAt,
  timezone,
  filters,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<string | undefined>();
  const pageSize = 20;

  // Fetch events list
  const {
    data: eventsData,
    loading: eventsLoading,
    refresh,
  } = useEvents({
    websiteId,
    startAt,
    endAt,
    search: searchTerm,
    page,
    pageSize,
    filters,
  });

  // Fetch event time series
  const { data: eventSeries } = useEventSeries({
    websiteId,
    startAt,
    endAt,
    unit: "day",
    timezone,
    filters,
  });

  // Fetch event data events (names and properties)
  const { data: eventDataEvents } = useEventDataEvents({
    websiteId,
    startAt,
    endAt,
    event: selectedEvent,
    filters,
  });

  // Process time series data for chart
  const seriesChartData = useMemo(() => {
    if (!eventSeries || !Array.isArray(eventSeries)) return [];

    // Group by timestamp
    const grouped = new Map<string, Map<string, number>>();

    eventSeries.forEach((item) => {
      const date = format(new Date(item.t), "MMM dd");
      if (!grouped.has(date)) {
        grouped.set(date, new Map());
      }
      const eventMap = grouped.get(date)!;
      eventMap.set(item.x, (eventMap.get(item.x) || 0) + item.y);
    });

    return Array.from(grouped.entries()).map(([date, events]) => {
      const obj: any = { date };
      events.forEach((count, name) => {
        obj[name] = count;
      });
      return obj;
    });
  }, [eventSeries]);

  // Get unique event names for legend
  const eventNames = useMemo(() => {
    if (!eventSeries || !Array.isArray(eventSeries)) return [];
    return Array.from(new Set(eventSeries.map((e) => e.x))).slice(0, 5);
  }, [eventSeries]);

  // Event name summary
  const eventSummary = useMemo(() => {
    if (!eventSeries || !Array.isArray(eventSeries)) return [];

    const summary = new Map<string, number>();
    eventSeries.forEach((item) => {
      summary.set(item.x, (summary.get(item.x) || 0) + item.y);
    });

    return Array.from(summary.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [eventSeries]);

  const totalPages = eventsData ? Math.ceil(eventsData.count / pageSize) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <MousePointer className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Events</h2>
            <p className="text-sm text-gray-500">
              {eventsData?.count || 0} total events recorded
            </p>
          </div>
        </div>
        <button
          onClick={() => refresh()}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="px-4 py-2 border border-slate-600 bg-slate-700 rounded-lg hover:bg-slate-600 text-white flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Event Summary Cards */}
      {eventDataEvents && eventDataEvents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {eventDataEvents.slice(0, 3).map((event, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700 p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-white truncate">
                  {event.eventName}
                </h3>
                <span className="text-xs text-gray-500">Property</span>
              </div>
              <p className="text-sm text-gray-300 truncate mb-1">
                {event.propertyName}
              </p>
              <p className="text-2xl font-bold text-purple-600">
                {event.total.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Event Trends Chart */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Event Trends
          </h3>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={seriesChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              {eventNames.slice(0, 5).map((name, i) => (
                <Line
                  key={name}
                  type="monotone"
                  dataKey={name}
                  stroke={CHART_COLORS[i % CHART_COLORS.length]}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Events */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Events</h3>
          <div className="space-y-3">
            {eventSummary.map((event, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedEvent === event.name
                    ? "bg-purple-50 border border-purple-200"
                    : "bg-slate-700/50 hover:bg-slate-700"
                }`}
                onClick={() => setSelectedEvent(event.name)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white truncate">
                    {event.name}
                  </span>
                  <span className="ml-2 px-2 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded">
                    {event.count.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Events List */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Recent Events
          </h3>

          {eventsLoading ? (
            <div className="text-center py-8 text-gray-500">
              Loading events...
            </div>
          ) : eventsData && eventsData.data && eventsData.data.length > 0 ? (
            <>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {eventsData.data.map((event) => (
                  <div
                    key={event.id}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {event.eventName && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded">
                              {event.eventName}
                            </span>
                          )}
                          <span
                            className={`px-2 py-0.5 text-xs font-medium rounded ${
                              event.eventType === 1
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {event.eventType === 1 ? "Pageview" : "Event"}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-white truncate mb-1">
                          {event.urlPath}
                        </p>
                        {event.pageTitle && (
                          <p className="text-sm text-gray-300 truncate mb-2">
                            {event.pageTitle}
                          </p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>🌐 {event.country || "Unknown"}</span>
                          <span>•</span>
                          <span>{event.device}</span>
                          <span>•</span>
                          <span>{event.browser}</span>
                          <span>•</span>
                          <span>{event.os}</span>
                        </div>
                      </div>
                      <span className="ml-4 text-xs text-gray-500 whitespace-nowrap">
                        {format(new Date(event.createdAt), "MMM dd, HH:mm")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-300">
                    Showing {(page - 1) * pageSize + 1} to{" "}
                    {Math.min(page * pageSize, eventsData.count)} of{" "}
                    {eventsData.count} events
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-300">
                      Page {page} of {totalPages}
                    </span>
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
              No events found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CHART_COLORS = [
  "#8b5cf6",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#06b6d4",
];
