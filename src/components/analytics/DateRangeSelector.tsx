import React, { useState } from "react";
import { Calendar } from "lucide-react";
import { format, subDays, startOfDay, endOfDay } from "date-fns";

export type DateRangePreset =
  | "today"
  | "7days"
  | "30days"
  | "90days"
  | "year"
  | "custom";

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface DateRangeSelectorProps {
  onDateRangeChange: (startDate: Date, endDate: Date) => void;
}

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  onDateRangeChange,
}) => {
  const [activePreset, setActivePreset] = useState<DateRangePreset>("30days");
  const [customRange, setCustomRange] = useState<DateRange>({
    startDate: subDays(new Date(), 30),
    endDate: new Date(),
  });
  const [showCustom, setShowCustom] = useState(false);

  const presets = [
    { value: "today" as DateRangePreset, label: "Today" },
    { value: "7days" as DateRangePreset, label: "Last 7 Days" },
    { value: "30days" as DateRangePreset, label: "Last 30 Days" },
    { value: "90days" as DateRangePreset, label: "Last 90 Days" },
    { value: "year" as DateRangePreset, label: "Last Year" },
    { value: "custom" as DateRangePreset, label: "Custom Range" },
  ];

  const getDateRangeFromPreset = (preset: DateRangePreset): DateRange => {
    const now = new Date();
    switch (preset) {
      case "today":
        return { startDate: startOfDay(now), endDate: endOfDay(now) };
      case "7days":
        return { startDate: subDays(now, 7), endDate: now };
      case "30days":
        return { startDate: subDays(now, 30), endDate: now };
      case "90days":
        return { startDate: subDays(now, 90), endDate: now };
      case "year":
        return { startDate: subDays(now, 365), endDate: now };
      case "custom":
        return customRange;
      default:
        return { startDate: subDays(now, 30), endDate: now };
    }
  };

  const handlePresetClick = (preset: DateRangePreset) => {
    setActivePreset(preset);
    if (preset === "custom") {
      setShowCustom(true);
    } else {
      setShowCustom(false);
      const range = getDateRangeFromPreset(preset);
      onDateRangeChange(range.startDate, range.endDate);
    }
  };

  const handleCustomRangeApply = () => {
    onDateRangeChange(customRange.startDate, customRange.endDate);
    setShowCustom(false);
  };

  return (
    <div className="relative inline-flex gap-2">
      <div className="flex flex-wrap gap-1.5">
        {presets.map((preset) => (
          <button
            key={preset.value}
            onClick={() => handlePresetClick(preset.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activePreset === preset.value
                ? "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-md"
                : "bg-slate-700 text-gray-300 hover:bg-slate-600 hover:text-white border border-slate-600 hover:border-blue-500 shadow-sm"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {showCustom && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm"
            onClick={() => setShowCustom(false)}
          />

          {/* Popup */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[110] w-96 bg-white dark:bg-gray-800 rounded-xl border-2 border-purple-200 dark:border-purple-800 shadow-2xl">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-4 rounded-t-xl">
              <h3 className="text-white font-bold text-base">
                Custom Date Range
              </h3>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-900 dark:text-gray-100 mb-2 uppercase tracking-wider">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={format(customRange.startDate, "yyyy-MM-dd")}
                    onChange={(e) =>
                      setCustomRange({
                        ...customRange,
                        startDate: new Date(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-900 dark:text-gray-100 mb-2 uppercase tracking-wider">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={format(customRange.endDate, "yyyy-MM-dd")}
                    onChange={(e) =>
                      setCustomRange({
                        ...customRange,
                        endDate: new Date(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 text-sm font-medium"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCustom(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCustomRangeApply}
                  className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg text-sm"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
