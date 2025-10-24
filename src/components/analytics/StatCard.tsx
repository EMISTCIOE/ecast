import React from "react";
import {
  Users,
  Eye,
  MousePointer,
  TrendingUp,
  TrendingDown,
  Clock,
  Activity,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  change?: number;
  icon: React.ReactNode;
  format?: "number" | "duration" | "percentage";
}

const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  format = "number",
}) => {
  const formattedValue =
    format === "duration" && typeof value === "number"
      ? formatDuration(value)
      : format === "percentage"
      ? `${value}%`
      : typeof value === "number"
      ? formatNumber(value)
      : value;

  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 border border-slate-700 hover:border-purple-500 overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-white mt-1 mb-2">
            {formattedValue}
          </p>
          {change !== undefined && (
            <div className="flex items-center space-x-1.5">
              {isPositive && (
                <>
                  <div className="flex items-center gap-0.5 bg-green-500/20 border border-green-500/30 px-1.5 py-0.5 rounded">
                    <TrendingUp className="w-2.5 h-2.5 text-green-400" />
                    <span className="text-[10px] font-bold text-green-400">
                      +{Math.abs(change)}%
                    </span>
                  </div>
                </>
              )}
              {isNegative && (
                <>
                  <div className="flex items-center gap-0.5 bg-red-500/20 border border-red-500/30 px-1.5 py-0.5 rounded">
                    <TrendingDown className="w-2.5 h-2.5 text-red-400" />
                    <span className="text-[10px] font-bold text-red-400">
                      {change}%
                    </span>
                  </div>
                </>
              )}
              {!isPositive && !isNegative && (
                <div className="flex items-center gap-0.5 bg-gray-700 px-1.5 py-0.5 rounded">
                  <span className="text-[10px] font-bold text-gray-300">
                    {change}%
                  </span>
                </div>
              )}
              <span className="text-[9px] font-medium text-gray-400">
                vs previous
              </span>
            </div>
          )}
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg blur-md opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
          <div className="relative bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-lg p-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatsOverviewProps {
  summary: {
    pageviews: { value: number; change: number };
    visitors: { value: number; change: number };
    visits: { value: number; change: number };
    bounces: { value: number; change: number };
    totaltime: { value: number; change: number };
  };
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ summary }) => {
  const avgDuration =
    summary.visits.value > 0
      ? Math.round(summary.totaltime.value / summary.visits.value)
      : 0;

  const bounceRate =
    summary.visits.value > 0
      ? Math.round((summary.bounces.value / summary.visits.value) * 100)
      : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Visitors"
        value={summary.visitors.value}
        change={summary.visitors.change}
        icon={<Users className="w-6 h-6 text-white" />}
      />
      <StatCard
        title="Page Views"
        value={summary.pageviews.value}
        change={summary.pageviews.change}
        icon={<Eye className="w-6 h-6 text-white" />}
      />
      <StatCard
        title="Total Visits"
        value={summary.visits.value}
        change={summary.visits.change}
        icon={<MousePointer className="w-6 h-6 text-white" />}
      />
      <StatCard
        title="Avg. Visit Duration"
        value={avgDuration}
        format="duration"
        icon={<Clock className="w-6 h-6 text-white" />}
      />
      <StatCard
        title="Bounce Rate"
        value={bounceRate}
        change={summary.bounces.change}
        format="percentage"
        icon={<Activity className="w-6 h-6 text-white" />}
      />
    </div>
  );
};
