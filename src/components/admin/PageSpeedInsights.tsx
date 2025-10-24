import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";

interface PageSpeedInsightsProps {
  url?: string;
}

interface PageSpeedScore {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  cls: number; // Cumulative Layout Shift
  tti: number; // Time to Interactive
}

export default function PageSpeedInsights({
  url: propUrl,
}: PageSpeedInsightsProps) {
  const [testUrl, setTestUrl] = useState(
    propUrl || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  );
  const [device, setDevice] = useState<"mobile" | "desktop">("mobile");
  const [shouldFetch, setShouldFetch] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["pagespeed", testUrl, device],
    queryFn: async () => {
      const apiKey = process.env.NEXT_PUBLIC_PAGESPEED_API_KEY;
      if (!apiKey) {
        throw new Error("PageSpeed API key not configured");
      }

      const strategy = device === "mobile" ? "mobile" : "desktop";
      const response = await fetch(
        `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
          testUrl
        )}&key=${apiKey}&strategy=${strategy}&category=performance&category=accessibility&category=best-practices&category=seo`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch PageSpeed data");
      }

      const result = await response.json();
      const lighthouseResult = result.lighthouseResult;
      const categories = lighthouseResult.categories;
      const audits = lighthouseResult.audits;

      return {
        performance: Math.round(categories.performance.score * 100),
        accessibility: Math.round(categories.accessibility.score * 100),
        bestPractices: Math.round(categories["best-practices"].score * 100),
        seo: Math.round(categories.seo.score * 100),
        fcp: audits["first-contentful-paint"].numericValue,
        lcp: audits["largest-contentful-paint"].numericValue,
        cls: audits["cumulative-layout-shift"].numericValue,
        tti: audits["interactive"].numericValue,
      } as PageSpeedScore;
    },
    enabled: shouldFetch,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return "bg-green-500/20 border-green-500/30";
    if (score >= 50) return "bg-yellow-500/20 border-yellow-500/30";
    return "bg-red-500/20 border-red-500/30";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90)
      return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
    if (score >= 50)
      return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" />;
    return <XCircleIcon className="w-5 h-5 text-red-400" />;
  };

  const formatTime = (ms: number) => {
    return (ms / 1000).toFixed(2) + "s";
  };

  const handleTest = () => {
    setShouldFetch(true);
    refetch();
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur p-6 rounded-xl border border-gray-800">
      <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            fill="currentColor"
            opacity="0.3"
          />
          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" />
          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" />
        </svg>
        Google PageSpeed Insights
      </h2>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Test URL
          </label>
          <input
            type="url"
            value={testUrl}
            onChange={(e) => setTestUrl(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setDevice("mobile")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                device === "mobile"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              <DevicePhoneMobileIcon className="w-5 h-5" />
              Mobile
            </button>
            <button
              onClick={() => setDevice("desktop")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                device === "desktop"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              <ComputerDesktopIcon className="w-5 h-5" />
              Desktop
            </button>
          </div>

          <button
            onClick={handleTest}
            disabled={isLoading}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ArrowPathIcon
              className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
            />
            {isLoading ? "Testing..." : "Run Test"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
          <p className="text-red-400">
            {error instanceof Error
              ? error.message
              : "Failed to fetch PageSpeed data"}
          </p>
        </div>
      )}

      {data && (
        <div className="space-y-6">
          {/* Core Web Vitals Scores */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              className={`p-4 rounded-lg border ${getScoreBg(
                data.performance
              )}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">Performance</span>
                {getScoreIcon(data.performance)}
              </div>
              <div
                className={`text-3xl font-bold ${getScoreColor(
                  data.performance
                )}`}
              >
                {data.performance}
              </div>
            </div>

            <div
              className={`p-4 rounded-lg border ${getScoreBg(
                data.accessibility
              )}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">Accessibility</span>
                {getScoreIcon(data.accessibility)}
              </div>
              <div
                className={`text-3xl font-bold ${getScoreColor(
                  data.accessibility
                )}`}
              >
                {data.accessibility}
              </div>
            </div>

            <div
              className={`p-4 rounded-lg border ${getScoreBg(
                data.bestPractices
              )}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">Best Practices</span>
                {getScoreIcon(data.bestPractices)}
              </div>
              <div
                className={`text-3xl font-bold ${getScoreColor(
                  data.bestPractices
                )}`}
              >
                {data.bestPractices}
              </div>
            </div>

            <div className={`p-4 rounded-lg border ${getScoreBg(data.seo)}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">SEO</span>
                {getScoreIcon(data.seo)}
              </div>
              <div className={`text-3xl font-bold ${getScoreColor(data.seo)}`}>
                {data.seo}
              </div>
            </div>
          </div>

          {/* Detailed Metrics */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              Performance Metrics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">
                  First Contentful Paint
                </p>
                <p className="text-xl font-bold text-white">
                  {formatTime(data.fcp)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">
                  Largest Contentful Paint
                </p>
                <p className="text-xl font-bold text-white">
                  {formatTime(data.lcp)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">
                  Cumulative Layout Shift
                </p>
                <p className="text-xl font-bold text-white">
                  {data.cls.toFixed(3)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">
                  Time to Interactive
                </p>
                <p className="text-xl font-bold text-white">
                  {formatTime(data.tti)}
                </p>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-400 italic">
            Note: Get your free API key from{" "}
            <a
              href="https://developers.google.com/speed/docs/insights/v5/get-started"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Google PageSpeed Insights API
            </a>
          </div>
        </div>
      )}

      {!data && !isLoading && !error && (
        <div className="text-center py-12 text-gray-400">
          <p>Click "Run Test" to analyze your website's performance</p>
        </div>
      )}
    </div>
  );
}
