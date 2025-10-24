/**
 * Analytics Export Utilities
 * Export analytics data to various formats (CSV, JSON, PDF)
 */

import { format } from "date-fns";
import {
  WebsiteStats,
  MetricData,
  EventsResponse,
  SessionsResponse,
  RealtimeResponse,
} from "@/types/analytics";

// ==================== CSV EXPORT ====================

/**
 * Convert array of objects to CSV string
 */
export function arrayToCSV(data: any[], headers?: string[]): string {
  if (!data || data.length === 0) return "";

  const keys = headers || Object.keys(data[0]);
  const csvRows = [];

  // Add header row
  csvRows.push(keys.join(","));

  // Add data rows
  for (const row of data) {
    const values = keys.map((key) => {
      const value = row[key];
      // Escape and quote values containing commas, quotes, or newlines
      if (value === null || value === undefined) return "";
      const stringValue = String(value);
      if (
        stringValue.includes(",") ||
        stringValue.includes('"') ||
        stringValue.includes("\n")
      ) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    });
    csvRows.push(values.join(","));
  }

  return csvRows.join("\n");
}

/**
 * Download data as CSV file
 */
export function downloadCSV(
  data: any[],
  filename: string,
  headers?: string[]
): void {
  const csv = arrayToCSV(data, headers);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, `${filename}.csv`);
}

/**
 * Export website stats to CSV
 */
export function exportStatsToCSV(
  stats: WebsiteStats,
  filename: string = "website-stats"
): void {
  const data = [
    {
      metric: "Pageviews",
      value: stats.pageviews,
      comparison: stats.comparison?.pageviews || "",
    },
    {
      metric: "Visitors",
      value: stats.visitors,
      comparison: stats.comparison?.visitors || "",
    },
    {
      metric: "Visits",
      value: stats.visits,
      comparison: stats.comparison?.visits || "",
    },
    {
      metric: "Bounces",
      value: stats.bounces,
      comparison: stats.comparison?.bounces || "",
    },
    {
      metric: "Total Time (seconds)",
      value: stats.totaltime,
      comparison: stats.comparison?.totaltime || "",
    },
  ];

  downloadCSV(data, filename, ["Metric", "Value", "Comparison"]);
}

/**
 * Export metrics to CSV
 */
export function exportMetricsToCSV(
  metrics: MetricData[],
  metricType: string,
  filename?: string
): void {
  const data = metrics.map((m) => ({
    name: m.x,
    count: m.y,
  }));

  downloadCSV(data, filename || `${metricType}-metrics`, ["Name", "Count"]);
}

/**
 * Export events to CSV
 */
export function exportEventsToCSV(
  events: EventsResponse,
  filename: string = "events"
): void {
  const data = events.data.map((event) => ({
    id: event.id,
    timestamp: format(new Date(event.createdAt), "yyyy-MM-dd HH:mm:ss"),
    eventType: event.eventType === 1 ? "Pageview" : "Event",
    eventName: event.eventName || "",
    url: event.urlPath,
    title: event.pageTitle || "",
    country: event.country,
    city: event.city,
    device: event.device,
    browser: event.browser,
    os: event.os,
    referrer: event.referrerDomain,
  }));

  downloadCSV(data, filename, [
    "ID",
    "Timestamp",
    "Type",
    "Event Name",
    "URL",
    "Title",
    "Country",
    "City",
    "Device",
    "Browser",
    "OS",
    "Referrer",
  ]);
}

/**
 * Export sessions to CSV
 */
export function exportSessionsToCSV(
  sessions: SessionsResponse,
  filename: string = "sessions"
): void {
  const data = sessions.data.map((session) => ({
    id: session.id,
    startTime: format(new Date(session.firstAt), "yyyy-MM-dd HH:mm:ss"),
    endTime: format(new Date(session.lastAt), "yyyy-MM-dd HH:mm:ss"),
    visits: session.visits,
    views: session.views,
    country: session.country,
    region: session.region,
    city: session.city,
    device: session.device,
    browser: session.browser,
    os: session.os,
    screen: session.screen,
    language: session.language,
  }));

  downloadCSV(data, filename, [
    "Session ID",
    "Start Time",
    "End Time",
    "Visits",
    "Views",
    "Country",
    "Region",
    "City",
    "Device",
    "Browser",
    "OS",
    "Screen",
    "Language",
  ]);
}

// ==================== JSON EXPORT ====================

/**
 * Download data as JSON file
 */
export function downloadJSON(data: any, filename: string): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json;charset=utf-8;" });
  downloadBlob(blob, `${filename}.json`);
}

/**
 * Export comprehensive analytics report as JSON
 */
export function exportAnalyticsReportJSON(
  data: any,
  dateRange: { start: Date; end: Date }
): void {
  const report = {
    generatedAt: new Date().toISOString(),
    dateRange: {
      start: dateRange.start.toISOString(),
      end: dateRange.end.toISOString(),
    },
    data,
  };

  const filename = `analytics-report-${format(
    new Date(),
    "yyyy-MM-dd-HHmmss"
  )}`;
  downloadJSON(report, filename);
}

// ==================== REALTIME DATA EXPORT ====================

/**
 * Export realtime snapshot to JSON
 */
export function exportRealtimeSnapshotJSON(
  data: RealtimeResponse,
  filename?: string
): void {
  const snapshot = {
    timestamp: new Date(data.timestamp).toISOString(),
    totals: data.totals,
    countries: data.countries,
    urls: data.urls,
    referrers: data.referrers,
    recentEvents: data.events.slice(0, 50), // Limit to 50 most recent
  };

  downloadJSON(
    snapshot,
    filename || `realtime-snapshot-${format(new Date(), "yyyy-MM-dd-HHmmss")}`
  );
}

// ==================== MARKDOWN EXPORT ====================

/**
 * Generate markdown report
 */
export function generateMarkdownReport(data: {
  title: string;
  dateRange: { start: Date; end: Date };
  stats: WebsiteStats;
  topPages?: MetricData[];
  topCountries?: MetricData[];
}): string {
  const { title, dateRange, stats, topPages, topCountries } = data;

  let markdown = `# ${title}\n\n`;
  markdown += `**Report Period:** ${format(
    dateRange.start,
    "MMM dd, yyyy"
  )} - ${format(dateRange.end, "MMM dd, yyyy")}\n\n`;
  markdown += `**Generated:** ${format(
    new Date(),
    "MMM dd, yyyy HH:mm:ss"
  )}\n\n`;

  markdown += `## Overview Statistics\n\n`;
  markdown += `| Metric | Value |\n`;
  markdown += `|--------|-------|\n`;
  markdown += `| Pageviews | ${stats.pageviews.toLocaleString()} |\n`;
  markdown += `| Visitors | ${stats.visitors.toLocaleString()} |\n`;
  markdown += `| Visits | ${stats.visits.toLocaleString()} |\n`;
  markdown += `| Bounces | ${stats.bounces.toLocaleString()} |\n`;
  markdown += `| Avg. Time | ${(stats.totaltime / 1000).toFixed(2)}s |\n\n`;

  if (topPages && topPages.length > 0) {
    markdown += `## Top Pages\n\n`;
    markdown += `| Page | Views |\n`;
    markdown += `|------|-------|\n`;
    topPages.slice(0, 10).forEach((page) => {
      markdown += `| ${page.x} | ${page.y.toLocaleString()} |\n`;
    });
    markdown += `\n`;
  }

  if (topCountries && topCountries.length > 0) {
    markdown += `## Top Countries\n\n`;
    markdown += `| Country | Visitors |\n`;
    markdown += `|---------|----------|\n`;
    topCountries.slice(0, 10).forEach((country) => {
      markdown += `| ${country.x} | ${country.y.toLocaleString()} |\n`;
    });
    markdown += `\n`;
  }

  return markdown;
}

/**
 * Download markdown report
 */
export function downloadMarkdownReport(
  report: string,
  filename: string = "analytics-report"
): void {
  const blob = new Blob([report], { type: "text/markdown;charset=utf-8;" });
  downloadBlob(blob, `${filename}.md`);
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Download blob as file
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copy data to clipboard as JSON
 */
export async function copyToClipboard(data: any): Promise<void> {
  const json = JSON.stringify(data, null, 2);
  await navigator.clipboard.writeText(json);
}

// ==================== SCHEDULED REPORTS ====================

export interface ReportSchedule {
  id: string;
  name: string;
  frequency: "daily" | "weekly" | "monthly";
  format: "csv" | "json" | "markdown";
  recipients: string[];
  enabled: boolean;
  lastRun?: string;
  nextRun?: string;
}

/**
 * Store report schedule in localStorage
 */
export function saveReportSchedule(schedule: ReportSchedule): void {
  const schedules = getReportSchedules();
  const index = schedules.findIndex((s) => s.id === schedule.id);

  if (index >= 0) {
    schedules[index] = schedule;
  } else {
    schedules.push(schedule);
  }

  localStorage.setItem("analytics-report-schedules", JSON.stringify(schedules));
}

/**
 * Get all report schedules from localStorage
 */
export function getReportSchedules(): ReportSchedule[] {
  const stored = localStorage.getItem("analytics-report-schedules");
  return stored ? JSON.parse(stored) : [];
}

/**
 * Delete report schedule
 */
export function deleteReportSchedule(id: string): void {
  const schedules = getReportSchedules().filter((s) => s.id !== id);
  localStorage.setItem("analytics-report-schedules", JSON.stringify(schedules));
}

// ==================== COMPARISON VIEWS ====================

/**
 * Calculate percentage change
 */
export function calculateChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Format change as string
 */
export function formatChange(change: number): string {
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(1)}%`;
}

/**
 * Generate comparison report
 */
export function generateComparisonReport(
  current: WebsiteStats,
  previous: WebsiteStats
): any {
  return {
    pageviews: {
      current: current.pageviews,
      previous: previous.pageviews,
      change: calculateChange(current.pageviews, previous.pageviews),
    },
    visitors: {
      current: current.visitors,
      previous: previous.visitors,
      change: calculateChange(current.visitors, previous.visitors),
    },
    visits: {
      current: current.visits,
      previous: previous.visits,
      change: calculateChange(current.visits, previous.visits),
    },
    bounces: {
      current: current.bounces,
      previous: previous.bounces,
      change: calculateChange(current.bounces, previous.bounces),
    },
    totaltime: {
      current: current.totaltime,
      previous: previous.totaltime,
      change: calculateChange(current.totaltime, previous.totaltime),
    },
  };
}
