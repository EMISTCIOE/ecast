# Comprehensive Umami Analytics Integration

This is a complete, production-ready integration with Umami Analytics API, providing powerful website analytics with a beautiful, feature-rich dashboard.

## 🎯 Features

### **Core Analytics**

- ✅ **Real-time Analytics** - Live visitor tracking with auto-refresh
- ✅ **Website Statistics** - Pageviews, visitors, visits, bounce rate, time on site
- ✅ **Time Series Charts** - Pageviews and visitor trends over time
- ✅ **Geographic Data** - Country, region, and city-level analytics with world map
- ✅ **Device Analytics** - Desktop, mobile, and tablet breakdown
- ✅ **Browser & OS Tracking** - Detailed browser and operating system statistics
- ✅ **Referrer Analysis** - Traffic source tracking

### **Advanced Features**

- ✅ **Events Dashboard** - Track custom events with properties and drill-down
- ✅ **Session Viewer** - Detailed session analysis with activity timeline
- ✅ **Advanced Filtering** - Filter by path, referrer, country, device, browser, OS, and more
- ✅ **Date Range Selection** - Presets (today, 7 days, 30 days, 90 days, year) + custom range
- ✅ **Comparison Views** - Compare periods (previous period, year-over-year)
- ✅ **Data Export** - CSV, JSON, and Markdown report generation
- ✅ **Scheduled Reports** - Configure automatic report generation

### **Developer Experience**

- ✅ **Type-Safe API Client** - Full TypeScript support with comprehensive types
- ✅ **Custom React Hooks** - Reusable hooks with auto-refresh and caching
- ✅ **Proxy API Routes** - Secure server-side API calls
- ✅ **Responsive Design** - Mobile-friendly UI components
- ✅ **Error Handling** - Robust error handling and loading states

## 📁 Project Structure

```
src/
├── components/analytics/
│   ├── ComprehensiveAnalyticsDashboard.tsx  # Main dashboard with tabs
│   ├── AnalyticsDashboard.tsx               # Original overview dashboard
│   ├── RealtimeMonitor.tsx                  # Live activity monitor
│   ├── EventsDashboard.tsx                  # Events tracking & analysis
│   ├── SessionsViewer.tsx                   # Session details & activity
│   ├── FiltersPanel.tsx                     # Advanced filters UI
│   ├── StatCard.tsx                         # Stat display components
│   ├── Charts.tsx                           # Chart components
│   ├── CountryMap.tsx                       # Geographic visualization
│   └── DateRangeSelector.tsx                # Date range picker
├── hooks/
│   └── useAnalytics.ts                      # React hooks for data fetching
├── lib/
│   ├── umami-client.ts                      # TypeScript API client
│   └── analytics-export.ts                  # Export utilities
├── pages/api/analytics/
│   └── [...endpoint].ts                     # Proxy API route
└── types/
    └── analytics.ts                         # TypeScript type definitions
```

## 🚀 Getting Started

### 1. Environment Variables

Add these to your `.env` file:

```env
# Required: Your Umami website ID
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-website-id

# Required: Umami API token
UMAMI_API_TOKEN=your-api-token

# Required: Umami API base URL
UMAMI_BASE_URL=https://api.umami.is

# Or for self-hosted Umami:
# UMAMI_BASE_URL=https://your-umami-instance.com
```

### 2. Get Your Credentials

#### **Umami Cloud:**

1. Log in to [umami.is](https://umami.is)
2. Go to Settings → Websites → Your Website
3. Copy the **Website ID**
4. Go to Settings → Profile → Generate API Key
5. Copy the **API Token**

#### **Self-Hosted:**

1. Access your Umami instance
2. Navigate to Settings → Websites
3. Copy your **Website ID**
4. Generate an **API Token** from your profile settings

### 3. Use the Dashboard

```tsx
import { ComprehensiveAnalyticsDashboard } from "@/components/analytics/ComprehensiveAnalyticsDashboard";

export default function AnalyticsPage() {
  return (
    <ComprehensiveAnalyticsDashboard
      websiteId={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID!}
    />
  );
}
```

## 📊 Available Components

### **ComprehensiveAnalyticsDashboard**

The main dashboard with 4 tabs: Overview, Realtime, Events, and Sessions.

```tsx
<ComprehensiveAnalyticsDashboard websiteId="your-website-id" />
```

### **RealtimeMonitor**

Live activity monitor with auto-refresh.

```tsx
<RealtimeMonitor
  websiteId="your-website-id"
  timezone="America/Los_Angeles"
  refreshInterval={5000}
/>
```

### **EventsDashboard**

Events tracking and analysis.

```tsx
<EventsDashboard
  websiteId="your-website-id"
  startAt={Date.now() - 86400000}
  endAt={Date.now()}
  filters={{ device: "mobile" }}
/>
```

### **SessionsViewer**

Detailed session viewer with drill-down.

```tsx
<SessionsViewer
  websiteId="your-website-id"
  startAt={Date.now() - 86400000}
  endAt={Date.now()}
/>
```

## 🎣 Custom Hooks

### **useWebsiteStats**

Fetch website statistics.

```tsx
const { data, loading, error, refresh } = useWebsiteStats({
  websiteId: "your-website-id",
  startAt: Date.now() - 86400000,
  endAt: Date.now(),
  filters: { country: "US" },
  refreshInterval: 60000, // Auto-refresh every 60s
});
```

### **useRealtime**

Real-time analytics data.

```tsx
const { data, loading } = useRealtime(
  "your-website-id",
  "America/Los_Angeles",
  { refreshInterval: 5000 }
);
```

### **useEvents**

Fetch events data.

```tsx
const { data, loading } = useEvents({
  websiteId: "your-website-id",
  startAt: Date.now() - 86400000,
  endAt: Date.now(),
  page: 1,
  pageSize: 20,
});
```

### **useSessions**

Fetch sessions data.

```tsx
const { data, loading } = useSessions({
  websiteId: "your-website-id",
  startAt: Date.now() - 86400000,
  endAt: Date.now(),
  search: "user@example.com",
});
```

### **useComprehensiveAnalytics**

Fetch all analytics data at once.

```tsx
const { data, loading } = useComprehensiveAnalytics({
  websiteId: "your-website-id",
  startAt: Date.now() - 2592000000, // 30 days
  endAt: Date.now(),
});
```

## 🔧 API Client

Use the TypeScript client directly:

```typescript
import { umamiClient } from "@/lib/umami-client";

// Get website stats
const stats = await umamiClient.getWebsiteStats(
  websiteId,
  startAt,
  endAt,
  filters
);

// Get metrics
const pages = await umamiClient.getMetrics(websiteId, "path", startAt, endAt);

// Get real-time data
const realtime = await umamiClient.getRealtime(websiteId);
```

## 📤 Data Export

### **Export to CSV**

```typescript
import { exportStatsToCSV, exportEventsToCSV } from "@/lib/analytics-export";

// Export stats
exportStatsToCSV(stats, "website-stats");

// Export events
exportEventsToCSV(eventsData, "events-report");
```

### **Export to JSON**

```typescript
import {
  downloadJSON,
  exportAnalyticsReportJSON,
} from "@/lib/analytics-export";

// Export comprehensive report
exportAnalyticsReportJSON(analyticsData, {
  start: startDate,
  end: endDate,
});
```

### **Export to Markdown**

```typescript
import {
  generateMarkdownReport,
  downloadMarkdownReport,
} from "@/lib/analytics-export";

const report = generateMarkdownReport({
  title: "Weekly Analytics Report",
  dateRange: { start: startDate, end: endDate },
  stats: data.stats,
  topPages: data.pages,
  topCountries: data.countries,
});

downloadMarkdownReport(report, "weekly-report");
```

## 🎨 Filtering

All analytics hooks and components support comprehensive filtering:

```typescript
const filters: AnalyticsFilters = {
  path: "/blog",
  referrer: "google.com",
  title: "Home Page",
  browser: "chrome",
  os: "Mac OS",
  device: "desktop",
  country: "US",
  region: "CA",
  city: "San Francisco",
  hostname: "example.com",
  tag: "marketing",
};
```

## 🔒 Security

- **API Token** stored securely in environment variables (server-side only)
- **Proxy Routes** prevent exposing API credentials to clients
- **Rate Limiting** built into proxy API routes
- **CORS Protection** via Next.js API routes

## 🎯 Performance

- **Auto-refresh** with configurable intervals
- **Caching** built into React hooks
- **Optimistic Updates** for better UX
- **Lazy Loading** for chart components
- **Pagination** for large data sets

## 📈 Metrics Tracked

### **Website Stats**

- Pageviews
- Unique Visitors
- Visits
- Bounce Rate
- Average Time on Site

### **Traffic Sources**

- Direct
- Referrers
- Search Engines
- Social Media

### **Geographic**

- Countries
- Regions/States
- Cities

### **Technology**

- Browsers
- Operating Systems
- Device Types
- Screen Resolutions

### **Content**

- Page URLs
- Page Titles
- Entry Pages
- Exit Pages

### **Events**

- Custom Event Tracking
- Event Properties
- Event Data Analysis

### **Sessions**

- Session Details
- Session Duration
- Session Activity
- User Properties

## 🛠️ Advanced Usage

### **Custom Date Ranges**

```tsx
import { useDateRange } from "@/hooks/useAnalytics";

const { startDate, endDate, startAt, endAt, setRange, setPreset } =
  useDateRange(new Date("2024-01-01"), new Date());

// Use preset
setPreset("30days");

// Use custom range
setRange(new Date("2024-01-01"), new Date("2024-01-31"));
```

### **Filter Management**

```tsx
import { useAnalyticsFilters } from "@/hooks/useAnalytics";

const { filters, updateFilter, clearFilters, hasActiveFilters } =
  useAnalyticsFilters();

// Update single filter
updateFilter("country", "US");

// Clear all filters
clearFilters();
```

### **Comparison Views**

```tsx
import { generateComparisonReport } from "@/lib/analytics-export";

const comparison = generateComparisonReport(currentStats, previousStats);
// Returns: { pageviews: { current, previous, change }, ... }
```

## 🐛 Troubleshooting

### **401 Unauthorized**

- Check your `UMAMI_API_TOKEN` is correct
- Verify the token has necessary permissions

### **404 Not Found**

- Verify `NEXT_PUBLIC_UMAMI_WEBSITE_ID` is correct
- Check `UMAMI_BASE_URL` points to correct instance

### **No Data Showing**

- Ensure Umami tracking script is installed on your website
- Check date range includes data
- Verify filters aren't too restrictive

### **CORS Errors**

- Use the proxy API routes (`/api/analytics/[...endpoint]`)
- Don't call Umami API directly from client

## 📝 License

This implementation follows Umami's API documentation and is MIT licensed.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📚 Resources

- [Umami Documentation](https://umami.is/docs)
- [Umami API Reference](https://umami.is/docs/api)
- [Umami Cloud](https://cloud.umami.is)
- [GitHub Repository](https://github.com/umami-software/umami)

---

Built with ❤️ using Next.js, TypeScript, and Umami Analytics
