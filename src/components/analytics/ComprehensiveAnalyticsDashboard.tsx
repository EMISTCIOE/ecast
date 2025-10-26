/**
 * Comprehensive Analytics Dashboard
 * Main dashboard with tabs for different analytics views
 */

import React, { useState } from "react";
import { subDays } from "date-fns";
import {
  BarChart3,
  Activity,
  Users,
  MousePointer,
  Download,
  RefreshCw,
  Calendar,
  Filter as FilterIcon,
} from "lucide-react";
import {
  useComprehensiveAnalytics,
  useDateRange,
  useAnalyticsFilters,
} from "@/hooks/useAnalytics";
import { StatsOverview } from "./StatCard";
import { DateRangeSelector } from "./DateRangeSelector";
import { ChartCard, TopList } from "./Charts";
import { CountryMap } from "./CountryMap";
import { RealtimeMonitor } from "./RealtimeMonitor";
import { EventsDashboard } from "./EventsDashboard";
import { SessionsViewer } from "./SessionsViewer";
import { FiltersPanel, ActiveFilters } from "./FiltersPanel";
import {
  downloadJSON,
  exportStatsToCSV,
  exportMetricsToCSV,
  generateMarkdownReport,
  downloadMarkdownReport,
} from "@/lib/analytics-export";

interface ComprehensiveAnalyticsDashboardProps {
  websiteId: string;
}

type DashboardTab = "overview" | "realtime" | "events" | "sessions";

export const ComprehensiveAnalyticsDashboard: React.FC<
  ComprehensiveAnalyticsDashboardProps
> = ({ websiteId }) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Date range management
  const { startDate, endDate, startAt, endAt, setRange, setPreset } =
    useDateRange(subDays(new Date(), 30), new Date());

  // Filters management
  const { filters, updateFilter, clearFilters, hasActiveFilters } =
    useAnalyticsFilters();

  // Fetch comprehensive analytics data
  const { data, loading, error, refresh } = useComprehensiveAnalytics({
    websiteId,
    startAt,
    endAt,
    filters,
    enabled: activeTab === "overview",
  });

  const handleExportJSON = () => {
    if (!data) return;
    downloadJSON(
      {
        dateRange: { start: startDate, end: endDate },
        ...data,
      },
      `analytics-${Date.now()}`
    );
    setShowExportMenu(false);
  };

  const handleExportCSV = () => {
    if (!data) return;
    exportStatsToCSV(data.stats, `analytics-stats-${Date.now()}`);
    if (data.pages)
      exportMetricsToCSV(data.pages, "pages", `top-pages-${Date.now()}`);
    if (data.countries)
      exportMetricsToCSV(
        data.countries,
        "countries",
        `top-countries-${Date.now()}`
      );
    setShowExportMenu(false);
  };

  const handleExportMarkdown = () => {
    if (!data) return;
    const report = generateMarkdownReport({
      title: "Analytics Report",
      dateRange: { start: startDate, end: endDate },
      stats: data.stats,
      topPages: data.pages,
      topCountries: data.countries,
    });
    downloadMarkdownReport(report, `analytics-report-${Date.now()}`);
    setShowExportMenu(false);
  };

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: BarChart3 },
    { id: "realtime" as const, label: "Realtime", icon: Activity },
    { id: "events" as const, label: "Events", icon: MousePointer },
    { id: "sessions" as const, label: "Sessions", icon: Users },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-1 text-sm">
              Comprehensive website analytics and insights
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={refresh}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-white/50 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm font-medium text-gray-700"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>

            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                Export
              </button>

              {showExportMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowExportMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                    <button
                      onClick={handleExportJSON}
                      className="w-full px-4 py-2 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 text-sm font-medium text-gray-700 flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Export as JSON
                    </button>
                    <button
                      onClick={handleExportCSV}
                      className="w-full px-4 py-2 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 text-sm font-medium text-gray-700 flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                      Export as CSV
                    </button>
                    <button
                      onClick={handleExportMarkdown}
                      className="w-full px-4 py-2 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 text-sm font-medium text-gray-700 flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4 text-purple-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Export as Markdown
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 shadow-lg overflow-hidden">
          <div className="flex items-center bg-slate-800/50">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-4 py-3 flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-300 relative group ${
                    activeTab === tab.id
                      ? "text-blue-400 bg-slate-700/50"
                      : "text-gray-400 hover:text-gray-200 hover:bg-slate-700/30"
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                        : "bg-slate-700 group-hover:bg-slate-600"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Filters and Date Range (except for Realtime) */}
          {activeTab !== "realtime" && (
            <div className="p-4 border-t border-slate-700 space-y-3 bg-slate-800/30">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-300 bg-slate-700/50 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-slate-600">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  <span>Date Range:</span>
                </div>
                <DateRangeSelector onDateRangeChange={setRange} />
                <FiltersPanel
                  filters={filters}
                  onFilterChange={updateFilter}
                  onClearFilters={clearFilters}
                />
              </div>

              {hasActiveFilters && (
                <ActiveFilters
                  filters={filters}
                  onRemoveFilter={(key) => updateFilter(key, undefined)}
                />
              )}
            </div>
          )}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "overview" && (
            <>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                  <p className="font-medium">Error loading analytics data</p>
                  <p className="text-sm">{error.message}</p>
                </div>
              )}

              {loading && !data && (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading analytics data...</p>
                  </div>
                </div>
              )}

              {data && (
                <>
                  {/* Stats Overview */}
                  <StatsOverview
                    summary={{
                      pageviews: { value: data.stats.pageviews, change: 0 },
                      visitors: { value: data.stats.visitors, change: 0 },
                      visits: { value: data.stats.visits, change: 0 },
                      bounces: { value: data.stats.bounces || 0, change: 0 },
                      totaltime: {
                        value: data.stats.totaltime || 0,
                        change: 0,
                      },
                    }}
                  />

                  {/* Pageviews Chart */}
                  {data.pageviews &&
                    data.pageviews.pageviews &&
                    data.pageviews.pageviews.length > 0 && (
                      <ChartCard
                        title="Pageviews & Visitors"
                        data={data.pageviews.pageviews.map((pv) => ({
                          x: pv.x,
                          y: pv.y,
                        }))}
                        type="line"
                      />
                    )}

                  {/* Grid Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Pages */}
                    {data.pages && data.pages.length > 0 && (
                      <TopList
                        title="Top Pages"
                        icon={
                          <svg
                            className="w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        }
                        data={data.pages}
                      />
                    )}

                    {/* Top Referrers */}
                    {data.referrers && data.referrers.length > 0 && (
                      <TopList
                        title="Top Referrers"
                        icon={
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                            />
                          </svg>
                        }
                        data={data.referrers}
                      />
                    )}

                    {/* Browsers */}
                    {data.browsers && data.browsers.length > 0 && (
                      <TopList
                        title="Browsers"
                        icon={
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        }
                        data={data.browsers}
                      />
                    )}

                    {/* Operating Systems */}
                    {data.os && data.os.length > 0 && (
                      <TopList
                        title="Operating Systems"
                        icon={
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        }
                        data={data.os}
                      />
                    )}

                    {/* Devices */}
                    {data.devices && data.devices.length > 0 && (
                      <TopList
                        title="Devices"
                        icon={
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                          </svg>
                        }
                        data={data.devices}
                      />
                    )}

                    {/* Top Countries */}
                    {data.countries && data.countries.length > 0 && (
                      <TopList
                        title="Top Countries"
                        icon={<span className="text-2xl">🌍</span>}
                        data={data.countries}
                      />
                    )}
                  </div>

                  {/* Country Map */}
                  {data.countries && data.countries.length > 0 && (
                    <CountryMap data={data.countries} />
                  )}
                </>
              )}
            </>
          )}

          {activeTab === "realtime" && (
            <RealtimeMonitor websiteId={websiteId} />
          )}

          {activeTab === "events" && (
            <EventsDashboard
              websiteId={websiteId}
              startAt={startAt}
              endAt={endAt}
              filters={filters}
            />
          )}

          {activeTab === "sessions" && (
            <SessionsViewer
              websiteId={websiteId}
              startAt={startAt}
              endAt={endAt}
              filters={filters}
            />
          )}
        </div>
      </div>
    </div>
  );
};
