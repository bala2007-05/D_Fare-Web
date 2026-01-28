# D-FARE Dashboard Architecture

## Overview

The D-FARE Management Dashboard is a monitoring-first, read-only interface built with modern web technologies. It provides real-time visibility into an AI-powered dispatch system with a focus on fairness, transparency, and operational efficiency.

## Core Principles

### 1. Monitoring-First Design
- **Read-Only Interface**: No manual task assignment or overrides
- **Real-Time Updates**: Live data synchronization (5-second refresh cycle)
- **Visibility Over Control**: Focus on observability, not manipulation

### 2. Component Architecture

```
┌─────────────────────────────────────────────────┐
│              MainLayout (Fixed)                  │
│  ┌──────────┐  ┌───────────────────────────┐   │
│  │          │  │       TopBar              │   │
│  │          │  │  - System Status          │   │
│  │ Sidebar  │  │  - Live Indicator         │   │
│  │          │  │  - Timestamp              │   │
│  │ - Nav    │  └───────────────────────────┘   │
│  │ - Logo   │                                   │
│  │          │  ┌───────────────────────────┐   │
│  │          │  │   Main Content Area       │   │
│  │          │  │                           │   │
│  │          │  │  - Operations Overview    │   │
│  │          │  │  - Driver Monitoring      │   │
│  │          │  │  - Task Queue             │   │
│  │          │  │  - Fairness Analytics     │   │
│  │          │  │  - Explainability Panel   │   │
│  │          │  │                           │   │
│  └──────────┘  └───────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

### 3. Component Hierarchy

#### Layout Components
- **MainLayout**: Root container with sidebar and top bar
- **Sidebar**: Navigation with active state management
- **TopBar**: System status, live indicator, time display

#### Dashboard Components
- **OperationalOverview**: Metric cards with trends
- **MetricCard**: Reusable card for key metrics

#### Driver Components
- **DriverTable**: Filterable table with search
  - Status filters (Online/Busy/Offline)
  - Vehicle type filters
  - Real-time workload scores

#### Task Components
- **TaskQueue**: Tabbed interface for task states
  - Pending tasks (unassigned)
  - Active tasks (in progress)
  - Completed tasks (finished)

#### Analytics Components
- **FairnessAnalytics**: Multiple ECharts visualizations
  - Workload distribution (bar chart)
  - Fairness trend (line chart)
  - Driver effort comparison (horizontal bar)
- **ExplainabilityPanel**: AI decision transparency
  - Factor breakdown with weights
  - Plain language explanations

#### UI Components
- **Badge**: Status indicators with color variants
- **Card**: Container with header/content sections
- **Input/Select**: Form controls with consistent styling
- **EmptyState**: User-friendly empty data display
- **Skeleton**: Loading state placeholders

## Data Flow

```
Mock Data (lib/mockData.js)
    ↓
Components (direct import)
    ↓
Render with TanStack Query
    ↓
Auto-refresh every 5 seconds
```

### Production Data Flow (Future)
```
Backend API
    ↓
TanStack Query
    ↓
Component State
    ↓
Real-time Updates (WebSocket/SSE)
```

## Styling Strategy

### Tailwind CSS Utility-First
- **No custom CSS files** (except globals.css for base styles)
- **Consistent spacing**: 4px base unit (1 = 0.25rem)
- **Color system**: Extended Tailwind palette with custom colors
- **Typography**: System font stack for readability

### Design Tokens
```javascript
// Colors
primary: Blue (#0ea5e9)
success: Green (#22c55e)
warning: Yellow (#f59e0b)
danger: Red (#ef4444)
slate: Neutral grays

// Spacing
gap-4: 1rem (16px)
gap-6: 1.5rem (24px)
p-6: 1.5rem padding

// Shadows
card: Subtle elevation
card-hover: Enhanced on interaction
```

## State Management

### Current (Client-Side Only)
- **Local State**: useState for filters, tabs, search
- **No Global State**: Each component manages its own state
- **TanStack Query**: Ready for data fetching/caching

### Production Enhancement
- Add TanStack Query hooks for API calls
- Implement optimistic updates
- Add error boundaries
- Add retry logic

## Performance Considerations

### Optimization Techniques
1. **Client-Side Rendering**: All components use 'use client'
2. **Efficient Re-renders**: useMemo for filtered data
3. **SVG Charts**: ECharts with SVG renderer (better than Canvas for small datasets)
4. **Minimal Dependencies**: Only essential packages

### Scalability
- Table virtualization (if driver/task count exceeds 100)
- Chart data sampling (if time series data becomes large)
- Lazy loading for analytics section
- Code splitting by route (future enhancement)

## Accessibility

### WCAG 2.1 AA Compliance
- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Color contrast ratios meet standards
- Focus indicators on interactive elements

### Screen Reader Support
- Proper heading hierarchy (h1 → h2 → h3)
- Alt text for icons (via Lucide React)
- Table headers properly associated
- Status changes announced

## Responsiveness

### Desktop-First (Current)
- Optimized for 1440px+ screens
- Fixed sidebar (256px width)
- Flexible content area

### Future Enhancements
- Responsive breakpoints:
  - Large desktop: 1440px+
  - Desktop: 1024px - 1439px
  - Tablet: 768px - 1023px (collapsible sidebar)
  - Mobile: < 768px (bottom nav)

## Browser Compatibility

### Target Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Polyfills Not Required
- ES6+ syntax (supported by Next.js)
- CSS Grid and Flexbox (modern browsers)
- CSS Custom Properties (native support)

## Testing Strategy (Recommended)

### Unit Tests
- Component rendering
- Utility functions
- Data transformations

### Integration Tests
- Filter interactions
- Tab switching
- Search functionality

### E2E Tests
- Full user workflows
- Real-time data updates
- Navigation

### Visual Regression
- Screenshot comparisons
- Responsive layouts
- Theme consistency

## Security Considerations

### Frontend Security
- No sensitive data in client code
- XSS prevention (React escapes by default)
- CSRF tokens (when backend added)
- Content Security Policy headers

### Read-Only Nature
- No write operations to backend
- No form submissions (except filters/search)
- No file uploads
- No state mutations on server

## Deployment

### Build Output
```bash
npm run build
# Generates .next/ folder with optimized build
```

### Hosting Options
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Docker container

### Environment Variables (Future)
```
NEXT_PUBLIC_API_URL=https://api.dfare.com
NEXT_PUBLIC_WS_URL=wss://api.dfare.com/ws
```

## Monitoring & Observability

### Client-Side Monitoring (Recommended)
- Error tracking (Sentry, LogRocket)
- Performance monitoring (Web Vitals)
- User analytics (Plausible, Fathom)
- Real-time connection health

### Key Metrics to Track
- Time to Interactive (TTI)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- Chart render times

## Future Enhancements

### Phase 2
- Historical data views (date range picker)
- Export functionality (CSV, PDF)
- Custom dashboard layouts
- User preferences/settings

### Phase 3
- Multi-region support
- Advanced filtering options
- Saved views/bookmarks
- Notification system

### Phase 4
- Mobile app (React Native)
- Offline support
- Advanced analytics (ML insights)
- Custom report builder

## Code Quality

### Standards
- ESLint with Next.js config
- Consistent naming conventions
- Component documentation in comments
- Utility function JSDoc comments

### File Organization
```
Component files: PascalCase (DriverTable.js)
Utility files: camelCase (utils.js)
Config files: lowercase (tailwind.config.js)
Constants: UPPER_SNAKE_CASE
```

### Best Practices
- Keep components under 300 lines
- Extract reusable logic to utilities
- Use composition over inheritance
- Prefer functional components
- Document complex logic with comments

---

**Architecture Version**: 1.0.0  
**Last Updated**: January 2026  
**Tech Stack**: Next.js 14, React 18, Tailwind CSS 3, ECharts 5
