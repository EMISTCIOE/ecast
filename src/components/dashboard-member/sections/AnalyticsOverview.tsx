/**
 * Analytics Overview Component for Member Dashboard
 * Shows analytics for member's approved content with URL filtering
 */

import { useState, useEffect } from "react";
import {
  ChartBarIcon,
  EyeIcon,
  CursorArrowRippleIcon,
  ClockIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";

interface AnalyticsOverviewProps {
  blogs: any[];
}

interface AnalyticsSummary {
  totalViews: number;
  totalClicks: number;
  avgTime: string;
  topContent: string;
  browsers: Record<string, number>;
  devices: Record<string, number>;
}

export default function AnalyticsOverview({ blogs }: AnalyticsOverviewProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [analytics, setAnalytics] = useState<AnalyticsSummary>({
    totalViews: 0,
    totalClicks: 0,
    avgTime: "0s",
    topContent: "N/A",
    browsers: {},
    devices: {},
  });

  // Get approved blogs only
  const approvedBlogs = blogs.filter((b: any) => b.status === "APPROVED");

  const contentUrls = approvedBlogs.map((b: any) => ({
    url: `/blogs/${b.slug || b.id}`,
    title: b.title,
    type: "blog",
  }));

  useEffect(() => {
    // Fetch analytics data
    fetchAnalytics();
  }, [selectedFilter]);

  const fetchAnalytics = async () => {
    try {
      const access = localStorage.getItem("access");
      if (!access) return;

      // Construct filter URL
      let filterPath = "";
      if (selectedFilter !== "all") {
        const content = contentUrls.find((c) => c.url === selectedFilter);
        if (content) {
          filterPath = `?path=${encodeURIComponent(content.url)}`;
        }
      }

      // Fetch analytics from your analytics API
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000"
        }/analytics/summary${filterPath}`,
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAnalytics({
          totalViews: data.views || 0,
          totalClicks: data.clicks || 0,
          avgTime: formatTime(data.avg_time || 0),
          topContent: data.top_page || "N/A",
          browsers: data.browsers || {},
          devices: data.devices || {},
        });
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    }
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${minutes}m ${secs}s`;
  };

  const getTopBrowser = () => {
    const entries = Object.entries(analytics.browsers);
    if (entries.length === 0) return "N/A";
    const sorted = entries.sort((a, b) => b[1] - a[1]);
    return sorted[0][0];
  };

  const getTopDevice = () => {
    const entries = Object.entries(analytics.devices);
    if (entries.length === 0) return "N/A";
    const sorted = entries.sort((a, b) => b[1] - a[1]);
    return sorted[0][0];
  };

  if (contentUrls.length === 0) {
    return (
      <div className="bg-gray-900/50 backdrop-blur p-6 rounded-lg border border-gray-800">
        <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
          <ChartBarIcon className="w-5 h-5 text-blue-400" />
          Blog Analytics
        </h3>
        <div className="text-center py-8">
          <ChartBarIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No approved blogs yet</p>
          <p className="text-gray-500 text-xs mt-1">
            Analytics will appear once your blogs are approved
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Analytics Header with Filter */}
      <div className="bg-gray-900/50 backdrop-blur p-4 rounded-lg border border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold flex items-center gap-2">
            <ChartBarIcon className="w-5 h-5 text-blue-400" />
            Blog Analytics
          </h3>
        </div>

        {/* Blog Filter Dropdown */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-400 mb-2">
            Filter by Blog
          </label>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer hover:border-gray-600"
          >
            <option value="all" className="bg-gray-800 text-white py-2">
              All Approved Blogs
            </option>
            {contentUrls.map((content) => (
              <option
                key={content.url}
                value={content.url}
                className="bg-gray-800 text-white py-2"
              >
                {content.title}
              </option>
            ))}
          </select>
        </div>

        {/* Analytics Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 p-3 rounded-lg border border-blue-500/20">
            <div className="flex items-center gap-2 mb-1">
              <EyeIcon className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-gray-400">Total Views</span>
            </div>
            <p className="text-xl font-bold text-blue-300">
              {analytics.totalViews.toLocaleString()}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 p-3 rounded-lg border border-purple-500/20">
            <div className="flex items-center gap-2 mb-1">
              <CursorArrowRippleIcon className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-gray-400">Total Clicks</span>
            </div>
            <p className="text-xl font-bold text-purple-300">
              {analytics.totalClicks.toLocaleString()}
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 p-3 rounded-lg border border-green-500/20">
            <div className="flex items-center gap-2 mb-1">
              <ClockIcon className="w-4 h-4 text-green-400" />
              <span className="text-xs text-gray-400">Avg. Time</span>
            </div>
            <p className="text-xl font-bold text-green-300">
              {analytics.avgTime}
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 p-3 rounded-lg border border-orange-500/20">
            <div className="flex items-center gap-2 mb-1">
              <GlobeAltIcon className="w-4 h-4 text-orange-400" />
              <span className="text-xs text-gray-400">Top Browser</span>
            </div>
            <p className="text-sm font-bold text-orange-300 capitalize">
              {getTopBrowser()}
            </p>
          </div>
        </div>
      </div>

      {/* Device & Browser Breakdown */}
      <div className="bg-gray-900/50 backdrop-blur p-4 rounded-lg border border-gray-800">
        <h4 className="text-sm font-semibold mb-3 text-gray-300">
          Visitor Breakdown
        </h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400 flex items-center gap-1.5">
              <DevicePhoneMobileIcon className="w-3 h-3" />
              Top Device
            </span>
            <span className="font-semibold text-white capitalize">
              {getTopDevice()}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">Total Blogs</span>
            <span className="font-semibold text-white">{blogs.length}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">Approved Blogs</span>
            <span className="font-semibold text-white">
              {approvedBlogs.length}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">Pending Blogs</span>
            <span className="font-semibold text-white">
              {blogs.filter((b: any) => b.status === "PENDING").length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
