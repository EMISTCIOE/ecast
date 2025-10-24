/**
 * Custom React hooks for Umami Analytics
 * Provides easy-to-use hooks with automatic refresh and caching
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { umamiClient } from "@/lib/umami-client";
import {
  AnalyticsFilters,
  WebsiteStats,
  PageviewsResponse,
  MetricData,
  ExpandedMetricData,
  EventsResponse,
  SessionsResponse,
  SessionStats,
  RealtimeResponse,
  ActiveUsersResponse,
  MetricType,
  TimeUnit,
  FullSessionDetails,
  SessionActivity,
  EventDataEvent,
  EventDataProperty,
  EventSeriesData,
} from "@/types/analytics";

interface UseAnalyticsOptions {
  websiteId: string;
  startAt: number;
  endAt: number;
  timezone?: string;
  filters?: AnalyticsFilters;
  enabled?: boolean;
  refreshInterval?: number; // in milliseconds
}

interface UseAnalyticsResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

/**
 * Base hook for analytics data fetching
 */
function useAnalyticsBase<T>(
  fetcher: () => Promise<T>,
  options: { enabled?: boolean; refreshInterval?: number } = {}
): UseAnalyticsResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const { enabled = true, refreshInterval } = options;

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  }, [fetcher, enabled]);

  useEffect(() => {
    fetchData();

    // Setup auto-refresh if interval is specified
    if (refreshInterval && refreshInterval > 0) {
      intervalRef.current = setInterval(fetchData, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchData, refreshInterval]);

  return {
    data,
    loading,
    error,
    refresh: fetchData,
  };
}

// ==================== WEBSITE STATS HOOKS ====================

/**
 * Hook for website statistics
 */
export function useWebsiteStats(
  options: UseAnalyticsOptions & { unit?: TimeUnit }
): UseAnalyticsResult<WebsiteStats> {
  const {
    websiteId,
    startAt,
    endAt,
    timezone,
    filters,
    unit,
    enabled,
    refreshInterval,
  } = options;

  const fetcher = useCallback(
    () =>
      umamiClient.getWebsiteStats(
        websiteId,
        startAt,
        endAt,
        filters,
        unit,
        timezone
      ),
    [websiteId, startAt, endAt, filters, unit, timezone]
  );

  return useAnalyticsBase(fetcher, { enabled, refreshInterval });
}

/**
 * Hook for pageviews time series
 */
export function usePageviews(
  options: UseAnalyticsOptions & {
    unit: TimeUnit;
    compare?: "prev" | "yoy";
  }
): UseAnalyticsResult<PageviewsResponse> {
  const {
    websiteId,
    startAt,
    endAt,
    unit,
    timezone,
    compare,
    filters,
    enabled,
    refreshInterval,
  } = options;

  const fetcher = useCallback(
    () =>
      umamiClient.getPageviews(
        websiteId,
        startAt,
        endAt,
        unit,
        timezone,
        compare,
        filters
      ),
    [websiteId, startAt, endAt, unit, timezone, compare, filters]
  );

  return useAnalyticsBase(fetcher, { enabled, refreshInterval });
}

/**
 * Hook for metrics by type
 */
export function useMetrics(
  options: UseAnalyticsOptions & {
    type: MetricType;
    unit?: TimeUnit;
    limit?: number;
    offset?: number;
  }
): UseAnalyticsResult<MetricData[]> {
  const {
    websiteId,
    startAt,
    endAt,
    type,
    unit,
    timezone,
    filters,
    limit,
    offset,
    enabled,
    refreshInterval,
  } = options;

  const fetcher = useCallback(
    () =>
      umamiClient.getMetrics(
        websiteId,
        type,
        startAt,
        endAt,
        unit,
        timezone,
        filters,
        limit,
        offset
      ),
    [websiteId, type, startAt, endAt, unit, timezone, filters, limit, offset]
  );

  return useAnalyticsBase(fetcher, { enabled, refreshInterval });
}

/**
 * Hook for expanded metrics with detailed stats
 */
export function useExpandedMetrics(
  options: UseAnalyticsOptions & {
    type: MetricType;
    unit?: TimeUnit;
    limit?: number;
    offset?: number;
  }
): UseAnalyticsResult<ExpandedMetricData[]> {
  const {
    websiteId,
    startAt,
    endAt,
    type,
    unit,
    timezone,
    filters,
    limit,
    offset,
    enabled,
    refreshInterval,
  } = options;

  const fetcher = useCallback(
    () =>
      umamiClient.getExpandedMetrics(
        websiteId,
        type,
        startAt,
        endAt,
        unit,
        timezone,
        filters,
        limit,
        offset
      ),
    [websiteId, type, startAt, endAt, unit, timezone, filters, limit, offset]
  );

  return useAnalyticsBase(fetcher, { enabled, refreshInterval });
}

/**
 * Hook for active users count
 */
export function useActiveUsers(
  websiteId: string,
  options: { enabled?: boolean; refreshInterval?: number } = {}
): UseAnalyticsResult<ActiveUsersResponse> {
  const { enabled = true, refreshInterval = 30000 } = options; // Default 30s refresh

  const fetcher = useCallback(
    () => umamiClient.getActiveUsers(websiteId),
    [websiteId]
  );

  return useAnalyticsBase(fetcher, { enabled, refreshInterval });
}

// ==================== EVENTS HOOKS ====================

/**
 * Hook for website events
 */
export function useEvents(
  options: UseAnalyticsOptions & {
    search?: string;
    page?: number;
    pageSize?: number;
  }
): UseAnalyticsResult<EventsResponse> {
  const {
    websiteId,
    startAt,
    endAt,
    search,
    page,
    pageSize,
    filters,
    enabled,
    refreshInterval,
  } = options;

  const fetcher = useCallback(
    () =>
      umamiClient.getEvents(
        websiteId,
        startAt,
        endAt,
        search,
        page,
        pageSize,
        filters
      ),
    [websiteId, startAt, endAt, search, page, pageSize, filters]
  );

  return useAnalyticsBase(fetcher, { enabled, refreshInterval });
}

/**
 * Hook for event time series
 */
export function useEventSeries(
  options: UseAnalyticsOptions & { unit: TimeUnit }
): UseAnalyticsResult<EventSeriesData[]> {
  const {
    websiteId,
    startAt,
    endAt,
    unit,
    timezone,
    filters,
    enabled,
    refreshInterval,
  } = options;

  const fetcher = useCallback(
    () =>
      umamiClient.getEventSeries(
        websiteId,
        startAt,
        endAt,
        unit,
        timezone,
        filters
      ),
    [websiteId, startAt, endAt, unit, timezone, filters]
  );

  return useAnalyticsBase(fetcher, { enabled, refreshInterval });
}

/**
 * Hook for event data events
 */
export function useEventDataEvents(
  options: UseAnalyticsOptions & { event?: string }
): UseAnalyticsResult<EventDataEvent[]> {
  const {
    websiteId,
    startAt,
    endAt,
    event,
    filters,
    enabled,
    refreshInterval,
  } = options;

  const fetcher = useCallback(
    () =>
      umamiClient.getEventDataEvents(websiteId, startAt, endAt, event, filters),
    [websiteId, startAt, endAt, event, filters]
  );

  return useAnalyticsBase(fetcher, { enabled, refreshInterval });
}

/**
 * Hook for event properties
 */
export function useEventDataProperties(
  options: UseAnalyticsOptions
): UseAnalyticsResult<EventDataProperty[]> {
  const { websiteId, startAt, endAt, filters, enabled, refreshInterval } =
    options;

  const fetcher = useCallback(
    () =>
      umamiClient.getEventDataProperties(websiteId, startAt, endAt, filters),
    [websiteId, startAt, endAt, filters]
  );

  return useAnalyticsBase(fetcher, { enabled, refreshInterval });
}

// ==================== SESSIONS HOOKS ====================

/**
 * Hook for sessions list
 */
export function useSessions(
  options: UseAnalyticsOptions & {
    search?: string;
    page?: number;
    pageSize?: number;
  }
): UseAnalyticsResult<SessionsResponse> {
  const {
    websiteId,
    startAt,
    endAt,
    search,
    page,
    pageSize,
    filters,
    enabled,
    refreshInterval,
  } = options;

  const fetcher = useCallback(
    () =>
      umamiClient.getSessions(
        websiteId,
        startAt,
        endAt,
        search,
        page,
        pageSize,
        filters
      ),
    [websiteId, startAt, endAt, search, page, pageSize, filters]
  );

  return useAnalyticsBase(fetcher, { enabled, refreshInterval });
}

/**
 * Hook for session statistics
 */
export function useSessionStats(
  options: UseAnalyticsOptions
): UseAnalyticsResult<SessionStats> {
  const { websiteId, startAt, endAt, filters, enabled, refreshInterval } =
    options;

  const fetcher = useCallback(
    () => umamiClient.getSessionStats(websiteId, startAt, endAt, filters),
    [websiteId, startAt, endAt, filters]
  );

  return useAnalyticsBase(fetcher, { enabled, refreshInterval });
}

/**
 * Hook for weekly session heatmap
 */
export function useSessionsWeekly(
  options: UseAnalyticsOptions & { timezone: string }
): UseAnalyticsResult<number[][]> {
  const {
    websiteId,
    startAt,
    endAt,
    timezone,
    filters,
    enabled,
    refreshInterval,
  } = options;

  const fetcher = useCallback(
    () =>
      umamiClient.getSessionsWeekly(
        websiteId,
        startAt,
        endAt,
        timezone,
        filters
      ),
    [websiteId, startAt, endAt, timezone, filters]
  );

  return useAnalyticsBase(fetcher, { enabled, refreshInterval });
}

/**
 * Hook for individual session details
 */
export function useSessionDetails(
  websiteId: string,
  sessionId: string,
  options: { enabled?: boolean } = {}
): UseAnalyticsResult<FullSessionDetails> {
  const { enabled = true } = options;

  const fetcher = useCallback(
    () => umamiClient.getSessionDetails(websiteId, sessionId),
    [websiteId, sessionId]
  );

  return useAnalyticsBase(fetcher, { enabled });
}

/**
 * Hook for session activity
 */
export function useSessionActivity(
  websiteId: string,
  sessionId: string,
  startAt: number,
  endAt: number,
  options: { enabled?: boolean } = {}
): UseAnalyticsResult<SessionActivity[]> {
  const { enabled = true } = options;

  const fetcher = useCallback(
    () => umamiClient.getSessionActivity(websiteId, sessionId, startAt, endAt),
    [websiteId, sessionId, startAt, endAt]
  );

  return useAnalyticsBase(fetcher, { enabled });
}

// ==================== REALTIME HOOKS ====================

/**
 * Hook for realtime data with auto-refresh
 */
export function useRealtime(
  websiteId: string,
  timezone?: string,
  options: { enabled?: boolean; refreshInterval?: number } = {}
): UseAnalyticsResult<RealtimeResponse> {
  const { enabled = true, refreshInterval = 5000 } = options; // Default 5s refresh

  const fetcher = useCallback(
    () => umamiClient.getRealtime(websiteId, timezone),
    [websiteId, timezone]
  );

  return useAnalyticsBase(fetcher, { enabled, refreshInterval });
}

// ==================== COMPREHENSIVE ANALYTICS HOOK ====================

/**
 * Hook that fetches all major analytics data at once
 */
export function useComprehensiveAnalytics(options: UseAnalyticsOptions) {
  const {
    websiteId,
    startAt,
    endAt,
    timezone,
    filters,
    enabled,
    refreshInterval,
  } = options;

  const fetcher = useCallback(
    () =>
      umamiClient.getComprehensiveAnalytics(
        websiteId,
        startAt,
        endAt,
        timezone,
        filters
      ),
    [websiteId, startAt, endAt, timezone, filters]
  );

  return useAnalyticsBase(fetcher, { enabled, refreshInterval });
}

// ==================== UTILITY HOOKS ====================

/**
 * Hook for managing date ranges
 */
export function useDateRange(initialStart: Date, initialEnd: Date) {
  const [startDate, setStartDate] = useState(initialStart);
  const [endDate, setEndDate] = useState(initialEnd);

  const setRange = useCallback((start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  }, []);

  const setPreset = useCallback((preset: string) => {
    const end = new Date();
    let start = new Date();

    switch (preset) {
      case "today":
        start.setHours(0, 0, 0, 0);
        break;
      case "7days":
        start.setDate(end.getDate() - 7);
        break;
      case "30days":
        start.setDate(end.getDate() - 30);
        break;
      case "90days":
        start.setDate(end.getDate() - 90);
        break;
      case "year":
        start.setFullYear(end.getFullYear() - 1);
        break;
    }

    setStartDate(start);
    setEndDate(end);
  }, []);

  return {
    startDate,
    endDate,
    startAt: startDate.getTime(),
    endAt: endDate.getTime(),
    setRange,
    setPreset,
  };
}

/**
 * Hook for managing filters
 */
export function useAnalyticsFilters(initialFilters: AnalyticsFilters = {}) {
  const [filters, setFilters] = useState<AnalyticsFilters>(initialFilters);

  const updateFilter = useCallback(
    (key: keyof AnalyticsFilters, value: string | undefined) => {
      setFilters((prev) => {
        if (value === undefined || value === "") {
          const { [key]: _, ...rest } = prev;
          return rest;
        }
        return { ...prev, [key]: value };
      });
    },
    []
  );

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const hasActiveFilters = Object.keys(filters).length > 0;

  return {
    filters,
    updateFilter,
    clearFilters,
    hasActiveFilters,
    setFilters,
  };
}
