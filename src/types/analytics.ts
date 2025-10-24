// ==================== BASIC TYPES ====================

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export type DateRangePreset =
  | "today"
  | "7days"
  | "30days"
  | "90days"
  | "year"
  | "custom";

export type TimeUnit = "minute" | "hour" | "day" | "month" | "year";

export type MetricType =
  | "path"
  | "entry"
  | "exit"
  | "title"
  | "query"
  | "referrer"
  | "channel"
  | "domain"
  | "country"
  | "region"
  | "city"
  | "browser"
  | "os"
  | "device"
  | "language"
  | "screen"
  | "event"
  | "hostname"
  | "tag";

// ==================== FILTER TYPES ====================

export interface AnalyticsFilters {
  path?: string;
  referrer?: string;
  title?: string;
  query?: string;
  browser?: string;
  os?: string;
  device?: string;
  country?: string;
  region?: string;
  city?: string;
  hostname?: string;
  tag?: string;
  segment?: string; // UUID
  cohort?: string; // UUID
}

// ==================== ME ENDPOINTS ====================

export interface UmamiUser {
  id: string;
  username: string;
  role: string;
  createdAt: string;
  isAdmin: boolean;
}

export interface MeResponse {
  token: string;
  authKey: string;
  shareToken: string | null;
  user: UmamiUser;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    username: string;
  };
}

export interface Team {
  id: string;
  name: string;
  accessCode: string;
  logoUrl: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  members: TeamMember[];
  _count: {
    websites: number;
    members: number;
  };
}

export interface TeamsResponse {
  data: Team[];
  count: number;
  page: number;
  pageSize: number;
}

export interface Website {
  id: string;
  name: string;
  domain: string;
  shareId: string | null;
  resetAt: string | null;
  userId: string;
  teamId: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  user: {
    username: string;
    id: string;
  };
}

export interface WebsitesResponse {
  data: Website[];
  count: number;
  page: number;
  pageSize: number;
}

// ==================== STATS & METRICS ====================

export interface StatValue {
  value: number;
  change?: number;
}

export interface UmamiSummary {
  pageviews: StatValue;
  visitors: StatValue;
  visits: StatValue;
  bounces?: StatValue;
  totaltime?: StatValue;
}

export interface WebsiteStats {
  pageviews: number;
  visitors: number;
  visits: number;
  bounces: number;
  totaltime: number;
  comparison?: WebsiteStats;
}

export interface MetricData {
  x: string;
  y: number;
}

export interface ExpandedMetricData {
  name: string;
  pageviews: number;
  visitors: number;
  visits: number;
  bounces: number;
  totaltime: number;
}

export interface TimeSeriesData {
  x: string; // Timestamp
  y: number;
}

export interface PageviewsResponse {
  pageviews: TimeSeriesData[];
  sessions: TimeSeriesData[];
}

// Legacy type aliases
export type CountryData = MetricData;
export type PageData = MetricData;
export type ReferrerData = MetricData;
export type BrowserData = MetricData;
export type OSData = MetricData;
export type DeviceData = MetricData;

// ==================== EVENTS ====================

export interface WebsiteEvent {
  id: string;
  websiteId: string;
  sessionId: string;
  createdAt: string;
  hostname: string;
  urlPath: string;
  urlQuery: string;
  referrerPath: string;
  referrerQuery: string;
  referrerDomain: string;
  country: string;
  city: string;
  device: string;
  os: string;
  browser: string;
  pageTitle: string;
  eventType: number;
  eventName: string;
  hasData: number;
}

export interface EventsResponse {
  data: WebsiteEvent[];
  count: number;
  page: number;
  pageSize: number;
}

export interface EventDataField {
  websiteId: string;
  sessionId: string;
  eventId: string;
  urlPath: string;
  eventName: string;
  dataKey: string;
  stringValue: string | null;
  numberValue: number | null;
  dateValue: string | null;
  dataType: number;
  createdAt: string;
}

export interface EventDataEvent {
  eventName: string;
  propertyName: string;
  dataType: number;
  total: number;
}

export interface EventDataProperty {
  eventName: string;
  propertyName: string;
  total: number;
}

export interface EventDataValue {
  value: string;
  total: number;
}

export interface EventDataFieldSummary {
  propertyName: string;
  dataType: number;
  value: string;
  total: number;
}

export interface EventDataStats {
  events: number;
  properties: number;
  records: number;
}

export interface EventSeriesData {
  x: string; // Event name
  t: string; // Timestamp
  y: number; // Count
}

// ==================== SESSIONS ====================

export interface SessionDetails {
  id: string;
  websiteId: string;
  hostname: string;
  browser: string;
  os: string;
  device: string;
  screen: string;
  language: string;
  country: string;
  region: string;
  city: string;
  firstAt: string;
  lastAt: string;
  visits: number;
  views: number;
  createdAt: string;
}

export interface SessionsResponse {
  data: SessionDetails[];
  count: number;
  page: number;
  pageSize: number;
}

export interface SessionStats {
  pageviews: StatValue;
  visitors: StatValue;
  visits: StatValue;
  countries: StatValue;
  events: StatValue;
}

export interface SessionWeeklyData {
  [day: number]: number[]; // Array of 24 hours
}

export interface FullSessionDetails extends SessionDetails {
  distinctId: string;
  events: number;
  totaltime: number;
}

export interface SessionActivity {
  createdAt: string;
  urlPath: string;
  urlQuery: string;
  referrerDomain: string;
  eventId: string;
  eventType: number;
  eventName: string;
  visitId: string;
  hasData: number;
}

export interface SessionProperty {
  websiteId: string;
  sessionId: string;
  dataKey: string;
  dataType: number;
  stringValue: string | null;
  numberValue: number | null;
  dateValue: string | null;
  createdAt: string;
}

export interface SessionDataProperty {
  propertyName: string;
  total: number;
}

export interface SessionDataValue {
  value: string;
  total: number;
}

// ==================== REALTIME ====================

export interface RealtimeEvent {
  __type: "pageview" | "event";
  sessionId: string;
  eventName: string;
  createdAt: string;
  browser: string;
  os: string;
  device: string;
  country: string;
  urlPath: string;
  referrerDomain: string;
}

export interface RealtimeSeries {
  views: TimeSeriesData[];
  visitors: TimeSeriesData[];
}

export interface RealtimeTotals {
  views: number;
  visitors: number;
  events: number;
  countries: number;
}

export interface RealtimeResponse {
  countries: Record<string, number>;
  urls: Record<string, number>;
  referrers: Record<string, number>;
  events: RealtimeEvent[];
  series: RealtimeSeries;
  totals: RealtimeTotals;
  timestamp: number;
}

// ==================== SEND EVENT ====================

export interface SendEventPayload {
  hostname: string;
  language: string;
  referrer: string;
  screen: string;
  title: string;
  url: string;
  website: string;
  name: string;
  data?: Record<string, any>;
}

export interface SendEventRequest {
  payload: SendEventPayload;
  type: "event";
}

export interface SendEventResponse {
  cache: string;
  sessionId: string;
  visitId: string;
}

// ==================== ACTIVE USERS ====================

export interface ActiveUsersResponse {
  visitors: number;
}

// ==================== AGGREGATED RESPONSE ====================

export interface UmamiResponse {
  summary: UmamiSummary;
  countries: CountryData[];
  pages: PageData[];
  referrers: ReferrerData[];
  browsers: BrowserData[];
  os: OSData[];
  devices: DeviceData[];
}

// ==================== API REQUEST PARAMS ====================

export interface BaseAnalyticsParams {
  websiteId: string;
  startAt: number;
  endAt: number;
  timezone?: string;
  filters?: AnalyticsFilters;
}

export interface MetricsParams extends BaseAnalyticsParams {
  type: MetricType;
  unit?: TimeUnit;
  limit?: number;
  offset?: number;
}

export interface EventsParams extends BaseAnalyticsParams {
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface SessionsParams extends BaseAnalyticsParams {
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface EventDataParams extends BaseAnalyticsParams {
  event?: string;
  propertyName?: string;
}

export interface PageviewsParams extends BaseAnalyticsParams {
  unit: TimeUnit;
  compare?: "prev" | "yoy";
}

export interface StatsParams extends BaseAnalyticsParams {
  unit?: TimeUnit;
}
