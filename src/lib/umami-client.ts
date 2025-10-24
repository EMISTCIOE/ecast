/**
 * Comprehensive Umami Analytics API Client
 * Provides type-safe methods for all Umami API endpoints
 */

import {
  AnalyticsFilters,
  MeResponse,
  TeamsResponse,
  WebsitesResponse,
  WebsiteStats,
  MetricData,
  ExpandedMetricData,
  PageviewsResponse,
  EventsResponse,
  EventDataField,
  EventDataEvent,
  EventDataProperty,
  EventDataValue,
  EventDataFieldSummary,
  EventDataStats,
  EventSeriesData,
  SessionsResponse,
  SessionStats,
  FullSessionDetails,
  SessionActivity,
  SessionProperty,
  SessionDataProperty,
  SessionDataValue,
  RealtimeResponse,
  ActiveUsersResponse,
  SendEventRequest,
  SendEventResponse,
  MetricType,
  TimeUnit,
} from "@/types/analytics";

interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}

export class UmamiClient {
  private baseUrl: string;
  private apiToken?: string;

  constructor(baseUrl?: string, apiToken?: string) {
    this.baseUrl = baseUrl || "/api/analytics";
    this.apiToken = apiToken;
  }

  /**
   * Build query string from filters
   */
  private buildFilterQuery(filters?: AnalyticsFilters): string {
    if (!filters) return "";

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    const query = params.toString();
    return query ? `&${query}` : "";
  }

  /**
   * Make API request
   */
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.apiToken && !endpoint.startsWith("/api/")) {
      headers.Authorization = `Bearer ${this.apiToken}`;
    }

    const config: RequestInit = {
      method: options.method || "GET",
      headers,
    };

    if (options.body) {
      config.body = JSON.stringify(options.body);
    }

    const url = endpoint.startsWith("http")
      ? endpoint
      : `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Umami API Error (${response.status}): ${
          errorText || response.statusText
        }`
      );
    }

    return response.json();
  }

  // ==================== ME ENDPOINTS ====================

  /**
   * GET /api/me - Get user information
   */
  async getMe(): Promise<MeResponse> {
    return this.request<MeResponse>("/me");
  }

  /**
   * GET /api/me/teams - Get all teams
   */
  async getTeams(): Promise<TeamsResponse> {
    return this.request<TeamsResponse>("/me/teams");
  }

  /**
   * GET /api/me/websites - Get all websites
   */
  async getWebsites(includeTeams?: boolean): Promise<WebsitesResponse> {
    const query = includeTeams ? "?includeTeams=true" : "";
    return this.request<WebsitesResponse>(`/me/websites${query}`);
  }

  // ==================== WEBSITE STATS ====================

  /**
   * GET /api/websites/:websiteId/active - Get active users
   */
  async getActiveUsers(websiteId: string): Promise<ActiveUsersResponse> {
    return this.request<ActiveUsersResponse>(`/websites/${websiteId}/active`);
  }

  /**
   * GET /api/websites/:websiteId/stats - Get website statistics
   */
  async getWebsiteStats(
    websiteId: string,
    startAt: number,
    endAt: number,
    filters?: AnalyticsFilters,
    unit?: TimeUnit,
    timezone?: string
  ): Promise<WebsiteStats> {
    const filterQuery = this.buildFilterQuery(filters);
    const unitParam = unit ? `&unit=${unit}` : "";
    const tzParam = timezone ? `&timezone=${timezone}` : "";

    return this.request<WebsiteStats>(
      `/websites/${websiteId}/stats?startAt=${startAt}&endAt=${endAt}${unitParam}${tzParam}${filterQuery}`
    );
  }

  /**
   * GET /api/websites/:websiteId/pageviews - Get pageviews time series
   */
  async getPageviews(
    websiteId: string,
    startAt: number,
    endAt: number,
    unit: TimeUnit,
    timezone?: string,
    compare?: "prev" | "yoy",
    filters?: AnalyticsFilters
  ): Promise<PageviewsResponse> {
    const filterQuery = this.buildFilterQuery(filters);
    const tzParam = timezone ? `&timezone=${timezone}` : "";
    const compareParam = compare ? `&compare=${compare}` : "";

    return this.request<PageviewsResponse>(
      `/websites/${websiteId}/pageviews?startAt=${startAt}&endAt=${endAt}&unit=${unit}${tzParam}${compareParam}${filterQuery}`
    );
  }

  /**
   * GET /api/websites/:websiteId/metrics - Get metrics by type
   */
  async getMetrics(
    websiteId: string,
    type: MetricType,
    startAt: number,
    endAt: number,
    unit?: TimeUnit,
    timezone?: string,
    filters?: AnalyticsFilters,
    limit?: number,
    offset?: number
  ): Promise<MetricData[]> {
    const filterQuery = this.buildFilterQuery(filters);
    const unitParam = unit ? `&unit=${unit}` : "";
    const tzParam = timezone ? `&timezone=${timezone}` : "";
    const limitParam = limit ? `&limit=${limit}` : "";
    const offsetParam = offset ? `&offset=${offset}` : "";

    return this.request<MetricData[]>(
      `/websites/${websiteId}/metrics?type=${type}&startAt=${startAt}&endAt=${endAt}${unitParam}${tzParam}${limitParam}${offsetParam}${filterQuery}`
    );
  }

  /**
   * GET /api/websites/:websiteId/metrics/expanded - Get expanded metrics
   */
  async getExpandedMetrics(
    websiteId: string,
    type: MetricType,
    startAt: number,
    endAt: number,
    unit?: TimeUnit,
    timezone?: string,
    filters?: AnalyticsFilters,
    limit?: number,
    offset?: number
  ): Promise<ExpandedMetricData[]> {
    const filterQuery = this.buildFilterQuery(filters);
    const unitParam = unit ? `&unit=${unit}` : "";
    const tzParam = timezone ? `&timezone=${timezone}` : "";
    const limitParam = limit ? `&limit=${limit}` : "";
    const offsetParam = offset ? `&offset=${offset}` : "";

    return this.request<ExpandedMetricData[]>(
      `/websites/${websiteId}/metrics/expanded?type=${type}&startAt=${startAt}&endAt=${endAt}${unitParam}${tzParam}${limitParam}${offsetParam}${filterQuery}`
    );
  }

  // ==================== EVENTS ====================

  /**
   * GET /api/websites/:websiteId/events - Get website events
   */
  async getEvents(
    websiteId: string,
    startAt: number,
    endAt: number,
    search?: string,
    page?: number,
    pageSize?: number,
    filters?: AnalyticsFilters
  ): Promise<EventsResponse> {
    const filterQuery = this.buildFilterQuery(filters);
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
    const pageParam = page ? `&page=${page}` : "";
    const pageSizeParam = pageSize ? `&pageSize=${pageSize}` : "";

    return this.request<EventsResponse>(
      `/websites/${websiteId}/events?startAt=${startAt}&endAt=${endAt}${searchParam}${pageParam}${pageSizeParam}${filterQuery}`
    );
  }

  /**
   * GET /api/websites/:websiteId/events/series - Get event time series
   */
  async getEventSeries(
    websiteId: string,
    startAt: number,
    endAt: number,
    unit: TimeUnit,
    timezone?: string,
    filters?: AnalyticsFilters
  ): Promise<EventSeriesData[]> {
    const filterQuery = this.buildFilterQuery(filters);
    const tzParam = timezone ? `&timezone=${timezone}` : "";

    return this.request<EventSeriesData[]>(
      `/websites/${websiteId}/events/series?startAt=${startAt}&endAt=${endAt}&unit=${unit}${tzParam}${filterQuery}`
    );
  }

  /**
   * GET /api/websites/:websiteId/event-data/:eventId - Get event data by ID
   */
  async getEventData(
    websiteId: string,
    eventId: string
  ): Promise<EventDataField[]> {
    return this.request<EventDataField[]>(
      `/websites/${websiteId}/event-data/${eventId}`
    );
  }

  /**
   * GET /api/websites/:websiteId/event-data/events - Get event data names
   */
  async getEventDataEvents(
    websiteId: string,
    startAt: number,
    endAt: number,
    event?: string,
    filters?: AnalyticsFilters
  ): Promise<EventDataEvent[]> {
    const filterQuery = this.buildFilterQuery(filters);
    const eventParam = event ? `&event=${encodeURIComponent(event)}` : "";

    return this.request<EventDataEvent[]>(
      `/websites/${websiteId}/event-data/events?startAt=${startAt}&endAt=${endAt}${eventParam}${filterQuery}`
    );
  }

  /**
   * GET /api/websites/:websiteId/event-data/fields - Get event data fields
   */
  async getEventDataFields(
    websiteId: string,
    startAt: number,
    endAt: number,
    filters?: AnalyticsFilters
  ): Promise<EventDataFieldSummary[]> {
    const filterQuery = this.buildFilterQuery(filters);

    return this.request<EventDataFieldSummary[]>(
      `/websites/${websiteId}/event-data/fields?startAt=${startAt}&endAt=${endAt}${filterQuery}`
    );
  }

  /**
   * GET /api/websites/:websiteId/event-data/properties - Get event properties
   */
  async getEventDataProperties(
    websiteId: string,
    startAt: number,
    endAt: number,
    filters?: AnalyticsFilters
  ): Promise<EventDataProperty[]> {
    const filterQuery = this.buildFilterQuery(filters);

    return this.request<EventDataProperty[]>(
      `/websites/${websiteId}/event-data/properties?startAt=${startAt}&endAt=${endAt}${filterQuery}`
    );
  }

  /**
   * GET /api/websites/:websiteId/event-data/values - Get event data values
   */
  async getEventDataValues(
    websiteId: string,
    startAt: number,
    endAt: number,
    event: string,
    propertyName: string,
    filters?: AnalyticsFilters
  ): Promise<EventDataValue[]> {
    const filterQuery = this.buildFilterQuery(filters);

    return this.request<EventDataValue[]>(
      `/websites/${websiteId}/event-data/values?startAt=${startAt}&endAt=${endAt}&event=${encodeURIComponent(
        event
      )}&propertyName=${encodeURIComponent(propertyName)}${filterQuery}`
    );
  }

  /**
   * GET /api/websites/:websiteId/event-data/stats - Get event data stats
   */
  async getEventDataStats(
    websiteId: string,
    startAt: number,
    endAt: number,
    filters?: AnalyticsFilters
  ): Promise<EventDataStats> {
    const filterQuery = this.buildFilterQuery(filters);

    return this.request<EventDataStats>(
      `/websites/${websiteId}/event-data/stats?startAt=${startAt}&endAt=${endAt}${filterQuery}`
    );
  }

  // ==================== SESSIONS ====================

  /**
   * GET /api/websites/:websiteId/sessions - Get sessions
   */
  async getSessions(
    websiteId: string,
    startAt: number,
    endAt: number,
    search?: string,
    page?: number,
    pageSize?: number,
    filters?: AnalyticsFilters
  ): Promise<SessionsResponse> {
    const filterQuery = this.buildFilterQuery(filters);
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
    const pageParam = page ? `&page=${page}` : "";
    const pageSizeParam = pageSize ? `&pageSize=${pageSize}` : "";

    return this.request<SessionsResponse>(
      `/websites/${websiteId}/sessions?startAt=${startAt}&endAt=${endAt}${searchParam}${pageParam}${pageSizeParam}${filterQuery}`
    );
  }

  /**
   * GET /api/websites/:websiteId/sessions/stats - Get session stats
   */
  async getSessionStats(
    websiteId: string,
    startAt: number,
    endAt: number,
    filters?: AnalyticsFilters
  ): Promise<SessionStats> {
    const filterQuery = this.buildFilterQuery(filters);

    return this.request<SessionStats>(
      `/websites/${websiteId}/sessions/stats?startAt=${startAt}&endAt=${endAt}${filterQuery}`
    );
  }

  /**
   * GET /api/websites/:websiteId/sessions/weekly - Get weekly session data
   */
  async getSessionsWeekly(
    websiteId: string,
    startAt: number,
    endAt: number,
    timezone: string,
    filters?: AnalyticsFilters
  ): Promise<number[][]> {
    const filterQuery = this.buildFilterQuery(filters);

    return this.request<number[][]>(
      `/websites/${websiteId}/sessions/weekly?startAt=${startAt}&endAt=${endAt}&timezone=${timezone}${filterQuery}`
    );
  }

  /**
   * GET /api/websites/:websiteId/sessions/:sessionId - Get session details
   */
  async getSessionDetails(
    websiteId: string,
    sessionId: string
  ): Promise<FullSessionDetails> {
    return this.request<FullSessionDetails>(
      `/websites/${websiteId}/sessions/${sessionId}`
    );
  }

  /**
   * GET /api/websites/:websiteId/sessions/:sessionId/activity - Get session activity
   */
  async getSessionActivity(
    websiteId: string,
    sessionId: string,
    startAt: number,
    endAt: number
  ): Promise<SessionActivity[]> {
    return this.request<SessionActivity[]>(
      `/websites/${websiteId}/sessions/${sessionId}/activity?startAt=${startAt}&endAt=${endAt}`
    );
  }

  /**
   * GET /api/websites/:websiteId/sessions/:sessionId/properties - Get session properties
   */
  async getSessionProperties(
    websiteId: string,
    sessionId: string
  ): Promise<SessionProperty[]> {
    return this.request<SessionProperty[]>(
      `/websites/${websiteId}/sessions/${sessionId}/properties`
    );
  }

  /**
   * GET /api/websites/:websiteId/session-data/properties - Get session data properties
   */
  async getSessionDataProperties(
    websiteId: string,
    startAt: number,
    endAt: number,
    filters?: AnalyticsFilters
  ): Promise<SessionDataProperty[]> {
    const filterQuery = this.buildFilterQuery(filters);

    return this.request<SessionDataProperty[]>(
      `/websites/${websiteId}/session-data/properties?startAt=${startAt}&endAt=${endAt}${filterQuery}`
    );
  }

  /**
   * GET /api/websites/:websiteId/session-data/values - Get session data values
   */
  async getSessionDataValues(
    websiteId: string,
    startAt: number,
    endAt: number,
    propertyName: string,
    filters?: AnalyticsFilters
  ): Promise<SessionDataValue[]> {
    const filterQuery = this.buildFilterQuery(filters);

    return this.request<SessionDataValue[]>(
      `/websites/${websiteId}/session-data/values?startAt=${startAt}&endAt=${endAt}&propertyName=${encodeURIComponent(
        propertyName
      )}${filterQuery}`
    );
  }

  // ==================== REALTIME ====================

  /**
   * GET /api/realtime/:websiteId - Get realtime data
   */
  async getRealtime(
    websiteId: string,
    timezone?: string
  ): Promise<RealtimeResponse> {
    const tzParam = timezone ? `?timezone=${timezone}` : "";
    return this.request<RealtimeResponse>(`/realtime/${websiteId}${tzParam}`);
  }

  // ==================== SEND EVENT ====================

  /**
   * POST /api/send - Send custom event
   */
  async sendEvent(payload: SendEventRequest): Promise<SendEventResponse> {
    return this.request<SendEventResponse>("/send", {
      method: "POST",
      body: payload,
    });
  }

  // ==================== HELPER METHODS ====================

  /**
   * Get comprehensive analytics data for a time range
   */
  async getComprehensiveAnalytics(
    websiteId: string,
    startAt: number,
    endAt: number,
    timezone?: string,
    filters?: AnalyticsFilters
  ) {
    const [
      stats,
      pageviews,
      countries,
      pages,
      referrers,
      browsers,
      os,
      devices,
      events,
      sessionStats,
    ] = await Promise.all([
      this.getWebsiteStats(websiteId, startAt, endAt, filters),
      this.getPageviews(
        websiteId,
        startAt,
        endAt,
        "day",
        timezone,
        undefined,
        filters
      ),
      this.getMetrics(
        websiteId,
        "country",
        startAt,
        endAt,
        undefined,
        timezone,
        filters,
        10
      ),
      this.getMetrics(
        websiteId,
        "path",
        startAt,
        endAt,
        undefined,
        timezone,
        filters,
        10
      ),
      this.getMetrics(
        websiteId,
        "referrer",
        startAt,
        endAt,
        undefined,
        timezone,
        filters,
        10
      ),
      this.getMetrics(
        websiteId,
        "browser",
        startAt,
        endAt,
        undefined,
        timezone,
        filters,
        10
      ),
      this.getMetrics(
        websiteId,
        "os",
        startAt,
        endAt,
        undefined,
        timezone,
        filters,
        10
      ),
      this.getMetrics(
        websiteId,
        "device",
        startAt,
        endAt,
        undefined,
        timezone,
        filters,
        10
      ),
      this.getEvents(websiteId, startAt, endAt, undefined, 1, 20, filters),
      this.getSessionStats(websiteId, startAt, endAt, filters),
    ]);

    return {
      stats,
      pageviews,
      countries,
      pages,
      referrers,
      browsers,
      os,
      devices,
      events,
      sessionStats,
    };
  }
}

// Export singleton instance for internal API calls
export const umamiClient = new UmamiClient();

// Export configured client for direct Umami Cloud/self-hosted calls
export const createUmamiClient = (baseUrl: string, apiToken: string) => {
  return new UmamiClient(baseUrl, apiToken);
};
