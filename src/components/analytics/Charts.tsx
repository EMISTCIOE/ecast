import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface ChartData {
  x: string;
  y: number;
}

interface ChartCardProps {
  title: string;
  data: ChartData[];
  type?: "bar" | "line" | "area" | "pie";
  color?: string;
  height?: number;
}

const COLORS = [
  "#3B82F6", // blue
  "#8B5CF6", // purple
  "#EC4899", // pink
  "#10B981", // green
  "#F59E0B", // amber
  "#EF4444", // red
  "#14B8A6", // teal
  "#F97316", // orange
  "#06B6D4", // cyan
  "#84CC16", // lime
];

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  data,
  type = "bar",
  color = "#8B5CF6",
  height = 300,
}) => {
  const transformedData = data.map((item) => ({
    name: item.x,
    value: item.y,
  }));

  const renderChart = () => {
    switch (type) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={transformedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6B7280" tick={{ fontSize: 12 }} />
              <YAxis stroke="#6B7280" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "2px solid #8B5CF6",
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px rgba(139, 92, 246, 0.2)",
                }}
                labelStyle={{ fontWeight: "bold", color: "#4B5563" }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="url(#colorGradient)"
                strokeWidth={3}
                dot={{ r: 5, fill: "#8B5CF6", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{
                  r: 8,
                  fill: "#8B5CF6",
                  strokeWidth: 3,
                  stroke: "#fff",
                }}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="50%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        );

      case "area":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={transformedData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.9} />
                  <stop offset="50%" stopColor="#EC4899" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="50%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                opacity={0.5}
              />
              <XAxis
                dataKey="name"
                stroke="#6B7280"
                tick={{ fontSize: 12, fontWeight: 600 }}
              />
              <YAxis
                stroke="#6B7280"
                tick={{ fontSize: 12, fontWeight: 600 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "2px solid #8B5CF6",
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px rgba(139, 92, 246, 0.2)",
                }}
                labelStyle={{ fontWeight: "bold", color: "#4B5563" }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="url(#strokeGradient)"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={transformedData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(props: any) =>
                  `${props.name}: ${(props.percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {transformedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      default: // bar
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={transformedData}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                opacity={0.5}
              />
              <XAxis
                dataKey="name"
                stroke="#6B7280"
                tick={{ fontSize: 12, fontWeight: 600 }}
              />
              <YAxis
                stroke="#6B7280"
                tick={{ fontSize: 12, fontWeight: 600 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "2px solid #8B5CF6",
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px rgba(139, 92, 246, 0.2)",
                }}
                labelStyle={{ fontWeight: "bold", color: "#4B5563" }}
              />
              <Bar
                dataKey="value"
                fill="url(#barGradient)"
                radius={[10, 10, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-4 border border-slate-700 hover:shadow-xl transition-all duration-300">
      <h3 className="text-base font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-4">
        {title}
      </h3>
      {data.length > 0 ? (
        <div className="relative bg-slate-900/50 rounded-lg p-2">
          <div className="relative">{renderChart()}</div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 text-gray-400 bg-slate-900/50 rounded-lg">
          <div className="text-center">
            <svg
              className="w-12 h-12 mx-auto text-gray-400 mb-2"
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
            <p className="text-sm font-medium">No data available</p>
          </div>
        </div>
      )}
    </div>
  );
};

interface TopListProps {
  title: string;
  data: ChartData[];
  icon?: React.ReactNode;
  limit?: number;
}

export const TopList: React.FC<TopListProps> = ({
  title,
  data,
  icon,
  limit = 10,
}) => {
  const topData = data.slice(0, limit);
  const maxValue = Math.max(...topData.map((d) => d.y));

  return (
    <div className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-4 border border-slate-700 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center space-x-2 mb-4">
        <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-base font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
          {title}
        </h3>
      </div>
      <div className="space-y-3">
        {topData.map((item, index) => {
          const percentage = (item.y / maxValue) * 100;
          const colorIndex = index % COLORS.length;
          return (
            <div
              key={index}
              className="space-y-1.5 p-2 rounded-lg hover:bg-slate-700/50 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-[10px] font-bold flex items-center justify-center shadow-md">
                    {index + 1}
                  </span>
                  <span className="text-xs font-semibold text-gray-200 truncate">
                    {item.x}
                  </span>
                </div>
                <span className="text-xs font-bold text-blue-400 ml-2 flex-shrink-0">
                  {item.y.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 rounded-full transition-all duration-700 ease-out shadow-md"
                  style={{
                    width: `${percentage}%`,
                    background: `linear-gradient(90deg, ${
                      COLORS[colorIndex]
                    }, ${COLORS[(colorIndex + 1) % COLORS.length]})`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
