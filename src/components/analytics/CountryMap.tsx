import React, { useState } from "react";
import { Globe } from "lucide-react";

interface CountryData {
  x: string; // Country code
  y: number; // Visit count
}

interface CountryMapProps {
  data: CountryData[];
}

// Country code to name mapping (partial list - add more as needed)
const COUNTRY_NAMES: Record<string, string> = {
  US: "United States",
  GB: "United Kingdom",
  CA: "Canada",
  AU: "Australia",
  DE: "Germany",
  FR: "France",
  ES: "Spain",
  IT: "Italy",
  JP: "Japan",
  CN: "China",
  IN: "India",
  BR: "Brazil",
  MX: "Mexico",
  RU: "Russia",
  KR: "South Korea",
  NL: "Netherlands",
  SE: "Sweden",
  NO: "Norway",
  DK: "Denmark",
  FI: "Finland",
  PL: "Poland",
  CH: "Switzerland",
  AT: "Austria",
  BE: "Belgium",
  GR: "Greece",
  PT: "Portugal",
  CZ: "Czech Republic",
  HU: "Hungary",
  IE: "Ireland",
  NZ: "New Zealand",
  SG: "Singapore",
  MY: "Malaysia",
  TH: "Thailand",
  ID: "Indonesia",
  PH: "Philippines",
  VN: "Vietnam",
  ZA: "South Africa",
  EG: "Egypt",
  NG: "Nigeria",
  AR: "Argentina",
  CL: "Chile",
  CO: "Colombia",
  PE: "Peru",
  VE: "Venezuela",
  TR: "Turkey",
  SA: "Saudi Arabia",
  AE: "UAE",
  IL: "Israel",
  PK: "Pakistan",
  BD: "Bangladesh",
  UA: "Ukraine",
  RO: "Romania",
  BG: "Bulgaria",
};

export const CountryMap: React.FC<CountryMapProps> = ({ data }) => {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  // Sort data by visits
  const sortedData = [...data].sort((a, b) => b.y - a.y);
  const maxValue = Math.max(...data.map((d) => d.y), 1);

  const getColorIntensity = (value: number): string => {
    const intensity = (value / maxValue) * 100;
    if (intensity >= 75) return "bg-blue-700";
    if (intensity >= 50) return "bg-blue-600";
    if (intensity >= 25) return "bg-blue-500";
    return "bg-blue-400";
  };

  const topCountries = sortedData.slice(0, 15);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Globe className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Visitors by Country
        </h3>
      </div>

      {/* Visual Country Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {topCountries.slice(0, 10).map((country) => {
          const percentage = ((country.y / maxValue) * 100).toFixed(0);
          return (
            <div
              key={country.x}
              className="relative group cursor-pointer"
              onMouseEnter={() => setHoveredCountry(country.x)}
              onMouseLeave={() => setHoveredCountry(null)}
            >
              <div
                className={`${getColorIntensity(
                  country.y
                )} rounded-lg p-4 text-white transition-all duration-300 hover:scale-105 hover:shadow-xl`}
              >
                <div className="text-2xl font-bold mb-1">{country.x}</div>
                <div className="text-sm opacity-90">
                  {country.y.toLocaleString()}
                </div>
                {hoveredCountry === country.x && (
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded-md text-xs whitespace-nowrap z-10">
                    {COUNTRY_NAMES[country.x] || country.x}: {percentage}%
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed List */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
          Top Countries
        </h4>
        {topCountries.map((country, index) => {
          const percentage = (country.y / maxValue) * 100;
          return (
            <div key={country.x} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-6">
                    #{index + 1}
                  </span>
                  <span className="text-lg font-bold text-blue-600">
                    {country.x}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {COUNTRY_NAMES[country.x] || "Unknown"}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {country.y.toLocaleString()} visits
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`${getColorIntensity(
                    country.y
                  )} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {data.length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Total Countries
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {data.reduce((sum, c) => sum + c.y, 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Total Visits
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {sortedData[0]?.x || "N/A"}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Top Country
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
