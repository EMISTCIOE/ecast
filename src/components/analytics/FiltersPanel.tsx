/**
 * Analytics Filters Component
 * Comprehensive filter controls for all analytics views
 */

import React, { useState } from "react";
import { X, Filter as FilterIcon, Check } from "lucide-react";
import { AnalyticsFilters } from "@/types/analytics";

interface FiltersPanelProps {
  filters: AnalyticsFilters;
  onFilterChange: (
    key: keyof AnalyticsFilters,
    value: string | undefined
  ) => void;
  onClearFilters: () => void;
  availableFilters?: (keyof AnalyticsFilters)[];
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  availableFilters = [
    "path",
    "referrer",
    "title",
    "browser",
    "os",
    "device",
    "country",
    "city",
    "hostname",
  ],
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const hasActiveFilters = Object.keys(filters).length > 0;

  const filterLabels: Record<keyof AnalyticsFilters, string> = {
    path: "URL Path",
    referrer: "Referrer",
    title: "Page Title",
    query: "Query Parameter",
    browser: "Browser",
    os: "Operating System",
    device: "Device Type",
    country: "Country",
    region: "Region",
    city: "City",
    hostname: "Hostname",
    tag: "Tag",
    segment: "Segment",
    cohort: "Cohort",
  };

  const filterOptions: Record<string, string[]> = {
    device: ["desktop", "mobile", "tablet"],
    browser: ["chrome", "firefox", "safari", "edge", "opera"],
    os: ["Windows 10", "Mac OS", "Linux", "iOS", "Android OS", "Chrome OS"],
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-2 border rounded-lg flex items-center gap-2 transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md ${
          hasActiveFilters
            ? "border-purple-500 bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
            : "border-slate-600 hover:border-purple-500 bg-slate-700 hover:bg-slate-600 text-gray-300 hover:text-white"
        }`}
      >
        <FilterIcon className="w-4 h-4" />
        Filters
        {hasActiveFilters && (
          <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-white/20 rounded-full">
            {Object.keys(filters).length}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Filters Panel - Fixed positioned popup */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[110] w-[500px] max-h-[80vh] bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-600 overflow-hidden">
            <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-600 p-4 flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2 text-white">
                <FilterIcon className="w-4 h-4 text-blue-400" />
                Filters
              </h3>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <button
                    onClick={() => {
                      onClearFilters();
                      setIsOpen(false);
                    }}
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all duration-200"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-slate-700 rounded-lg transition-all duration-200"
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-white" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {availableFilters.map((filterKey) => (
                <FilterInput
                  key={filterKey}
                  label={filterLabels[filterKey]}
                  value={filters[filterKey] || ""}
                  onChange={(value) => onFilterChange(filterKey, value)}
                  options={filterOptions[filterKey]}
                  placeholder={`Filter by ${filterLabels[
                    filterKey
                  ].toLowerCase()}...`}
                />
              ))}
            </div>

            <div className="bg-slate-800/80 backdrop-blur-sm border-t border-slate-600 p-4 flex gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 flex items-center justify-center gap-2 text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 py-2 px-4"
              >
                <Check className="w-4 h-4" />
                Apply Filters
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Individual Filter Input
interface FilterInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options?: string[];
  placeholder?: string;
}

const FilterInput: React.FC<FilterInputProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder,
}) => {
  return (
    <div>
      <label className="block text-[10px] font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      {options ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-sm font-medium bg-white hover:border-purple-300"
        >
          <option value="">All</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-sm font-medium hover:border-purple-300"
          />
          {value && (
            <button
              onClick={() => onChange("")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600 bg-gray-100 hover:bg-purple-100 rounded p-0.5 transition-all duration-200"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// Active Filters Display
interface ActiveFiltersProps {
  filters: AnalyticsFilters;
  onRemoveFilter: (key: keyof AnalyticsFilters) => void;
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  onRemoveFilter,
}) => {
  const filterLabels: Record<keyof AnalyticsFilters, string> = {
    path: "Path",
    referrer: "Referrer",
    title: "Title",
    query: "Query",
    browser: "Browser",
    os: "OS",
    device: "Device",
    country: "Country",
    region: "Region",
    city: "City",
    hostname: "Hostname",
    tag: "Tag",
    segment: "Segment",
    cohort: "Cohort",
  };

  const activeFilters = Object.entries(filters).filter(([, value]) => value);

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 bg-slate-700/50 p-3 rounded-lg border border-slate-600">
      <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
        <FilterIcon className="w-3 h-3" />
        Active filters:
      </span>
      {activeFilters.map(([key, value]) => (
        <div
          key={key}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 border border-purple-500/50 text-purple-300 rounded-lg text-xs font-semibold shadow-sm hover:shadow-md transition-all duration-200"
        >
          <span className="font-bold text-blue-400">
            {filterLabels[key as keyof AnalyticsFilters]}:
          </span>
          <span className="text-gray-300">{value}</span>
          <button
            onClick={() => onRemoveFilter(key as keyof AnalyticsFilters)}
            className="ml-0.5 hover:bg-slate-700 rounded p-0.5 transition-all duration-200"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
};
