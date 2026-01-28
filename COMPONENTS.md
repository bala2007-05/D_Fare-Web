# Component Documentation

## UI Components (components/ui/)

### Badge
Status indicator with color variants.

**Props:**
- `children`: Content to display
- `variant`: Color variant ('online', 'busy', 'offline', 'pending', 'in_progress', 'completed')
- `dot`: Show pulsing dot indicator (boolean)
- `className`: Additional CSS classes

**Usage:**
```javascript
<Badge variant="online" dot>Online</Badge>
<Badge variant="busy">Busy</Badge>
```

---

### Card, CardHeader, CardContent, CardTitle
Flexible card container components.

**Props:**
- Card:
  - `children`: Content
  - `hover`: Enable hover effect (boolean)
  - `className`: Additional CSS classes

**Usage:**
```javascript
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

---

### Input
Styled text input field.

**Props:**
- Standard HTML input props
- `className`: Additional CSS classes

**Usage:**
```javascript
<Input 
  type="text" 
  placeholder="Search..." 
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

---

### Select
Styled select dropdown.

**Props:**
- Standard HTML select props
- `className`: Additional CSS classes

**Usage:**
```javascript
<Select value={filter} onChange={(e) => setFilter(e.target.value)}>
  <option value="all">All</option>
  <option value="active">Active</option>
</Select>
```

---

### EmptyState
User-friendly empty data display.

**Props:**
- `icon`: Lucide React icon component
- `title`: Main message
- `description`: Supporting text
- `className`: Additional CSS classes

**Usage:**
```javascript
<EmptyState
  icon={Search}
  title="No results found"
  description="Try adjusting your filters"
/>
```

---

### Skeleton
Loading state placeholder.

**Props:**
- `className`: CSS classes for size/shape

**Usage:**
```javascript
<Skeleton className="h-8 w-32" />
```

---

## Layout Components (components/layout/)

### MainLayout
Root layout with sidebar and top bar.

**Props:**
- `children`: Page content

**Usage:**
```javascript
<MainLayout>
  <YourPageContent />
</MainLayout>
```

---

### Sidebar
Fixed left navigation panel.

**Features:**
- Logo/brand section
- Navigation links with active states
- Footer info
- Fixed positioning (256px width)

**Navigation Items:**
- Dashboard
- Drivers
- Tasks
- Fairness Analytics
- System Status

---

### TopBar
Fixed top status bar.

**Features:**
- Page title and description
- Live status indicator
- System health badge
- Last update timestamp
- Current date/time
- Auto-updates every second

---

## Dashboard Components (components/dashboard/)

### OperationalOverview
Grid of metric cards showing key statistics.

**Data Source:** `operationalMetrics` from mockData

**Metrics Displayed:**
- Drivers Online
- Active Tasks
- Pending Tasks
- Completed Today
- System Health

---

### MetricCard
Reusable metric display card.

**Props:**
- `title`: Metric name
- `value`: Main value to display
- `icon`: Lucide React icon
- `color`: Color variant ('blue', 'green', 'yellow', 'red', 'slate')
- `trend`: Trend direction ('up', 'down', 'neutral')
- `trendValue`: Trend indicator text
- `subtitle`: Additional context

**Usage:**
```javascript
<MetricCard
  title="Drivers Online"
  value={47}
  icon={Users}
  color="blue"
  trend="up"
  trendValue="+3"
  subtitle="Currently active"
/>
```

---

## Driver Components (components/drivers/)

### DriverTable
Comprehensive driver monitoring table with filters.

**Features:**
- Search by name or ID
- Status filter (All/Online/Busy/Offline)
- Vehicle type filter
- Sticky table header
- Hover effects on rows
- Color-coded workload scores

**Columns:**
- Driver (Name + ID)
- Status (Badge with dot)
- Vehicle Type
- Workload Score (color-coded)
- Tasks Today
- Current Task

**Data Source:** `drivers` from mockData

---

## Task Components (components/tasks/)

### TaskQueue
Tabbed task management interface.

**Features:**
- Three tabs: Pending / Active / Completed
- Task count badges per tab
- Comprehensive task details
- Route visualization (Pickup → Dropoff)
- Priority indicators
- Timestamp formatting

**Columns:**
- Task ID (monospace)
- Route (truncated with arrows)
- Priority (color-coded)
- Assigned Driver
- Status (Badge)
- Created (datetime + relative)
- Completion Time (if completed)
- Duration

**Data Source:** `tasks` from mockData

---

## Analytics Components (components/analytics/)

### FairnessAnalytics
Comprehensive analytics dashboard with multiple charts.

**Charts Included:**

1. **Fairness Score Summary**
   - Large metric display
   - Min/Avg/Max workload stats
   - Percentage-based fairness score

2. **Workload Distribution (Bar Chart)**
   - Shows current workload per driver
   - Color-coded by threshold:
     - Red: ≥8
     - Yellow: 6-7.9
     - Green: <6

3. **Fairness Trend (Line Chart)**
   - Time-series fairness scores
   - Smooth line with area fill
   - Hourly data points

4. **Driver Effort Comparison (Horizontal Bar)**
   - Total tasks completed by each driver
   - Easy comparison of workload

**Data Source:** `fairnessData` from mockData

**Chart Configuration:**
- SVG rendering for crisp visuals
- Minimal design (no unnecessary decorations)
- Neutral color palette
- Responsive tooltips
- Proper axis labels

---

### ExplainabilityPanel
AI decision transparency interface.

**Features:**
- Example task assignment breakdown
- Weighted factor analysis
- Visual weight indicators (progress bars)
- Plain language summary
- Read-only notice

**Factor Display:**
- Factor name
- Value assessment (High/Moderate/Low/Optimal)
- Detailed description
- Weight percentage
- Visual weight bar

**Data Source:** `explainabilityExample` from mockData

---

## Utility Functions (lib/utils.js)

### cn(...inputs)
Merges CSS class names.

```javascript
cn('base-class', condition && 'conditional-class', className)
```

### formatTime(isoString)
Formats ISO timestamp to time (HH:MM).

### formatDateTime(isoString)
Formats ISO timestamp to date + time.

### formatRelativeTime(isoString)
Returns relative time (e.g., "5m ago", "2h ago").

### getStatusColor(status)
Returns Tailwind classes for status badges.

**Statuses:** online, busy, offline, pending, in_progress, completed, operational, warning, critical

### getPriorityColor(priority)
Returns Tailwind classes for priority indicators.

**Priorities:** urgent, high, normal, low

### getWorkloadColor(score)
Returns Tailwind classes for workload scores.
- Red: ≥8
- Yellow: 6-7.9
- Green: <6

### calculateFairnessScore(workloads)
Calculates fairness score (0-100) based on workload distribution.
Lower standard deviation = higher fairness.

### formatStatus(status)
Capitalizes and formats status strings (removes underscores).

### capitalize(text)
Capitalizes first letter of string.

### truncate(text, maxLength)
Truncates text with ellipsis.

---

## Mock Data (lib/mockData.js)

### systemStatus
Current system operational status.

### operationalMetrics
Key performance indicators for dashboard overview.

### drivers
Array of driver objects with:
- id, name, status, vehicleType
- workloadScore, tasksToday
- location (lat/lng)
- currentTask

### tasks
Array of task objects with:
- id, pickup, dropoff
- assignedDriver, state
- createdTime, completionTime
- priority, estimatedDuration

### fairnessData
Analytics data including:
- workloadDistribution (per driver)
- fairnessTrend (time series)

### explainabilityExample
Example AI assignment explanation with:
- taskId, assignedDriver, driverName
- factors (array of weighted decision factors)
- explanation (summary text)

---

## Styling Guidelines

### Color Usage
- **Primary (Blue)**: Main actions, links, active states
- **Success (Green)**: Positive indicators, completed items
- **Warning (Yellow)**: Caution states, moderate loads
- **Danger (Red)**: Alerts, high workload, errors
- **Slate**: Neutral content, borders, backgrounds

### Spacing Scale
- gap-2: 0.5rem (8px)
- gap-3: 0.75rem (12px)
- gap-4: 1rem (16px)
- gap-6: 1.5rem (24px)
- gap-8: 2rem (32px)

### Typography Scale
- text-xs: 0.75rem (12px)
- text-sm: 0.875rem (14px)
- text-base: 1rem (16px)
- text-lg: 1.125rem (18px)
- text-xl: 1.25rem (20px)
- text-2xl: 1.5rem (24px)
- text-3xl: 1.875rem (30px)
- text-4xl: 2.25rem (36px)

### Font Weights
- font-normal: 400
- font-medium: 500
- font-semibold: 600
- font-bold: 700

---

## Animation Classes

### Custom Animations (in globals.css)
- `animate-fade-in`: Fade in with slight upward motion
- `animate-pulse-soft`: Gentle pulsing effect for live indicators

### Usage
```javascript
<div className="animate-fade-in">Content</div>
<span className="animate-pulse-soft">●</span>
```

---

## Responsive Patterns (Future)

### Current: Desktop-First
- Fixed sidebar (256px)
- Content area: calc(100% - 256px)
- Min-width: 1024px recommended

### Future Breakpoints
```javascript
// Tailwind breakpoints
sm: '640px'   // Small tablets
md: '768px'   // Tablets
lg: '1024px'  // Small desktops
xl: '1280px'  // Large desktops
2xl: '1536px' // Extra large
```

---

## Accessibility Features

### Keyboard Navigation
- Tab through interactive elements
- Enter/Space to activate buttons
- Escape to close modals (future)

### Screen Reader Support
- Semantic HTML (nav, main, section, article)
- Proper heading hierarchy
- ARIA labels on icons
- Table headers with scope

### Color Contrast
- All text meets WCAG AA standards
- Status colors have sufficient contrast
- Focus indicators visible

---

## Best Practices

### Component Creation
1. Keep components focused (single responsibility)
2. Extract reusable logic to utilities
3. Use meaningful prop names
4. Document complex components
5. Add PropTypes/TypeScript (future)

### State Management
1. Keep state close to where it's used
2. Use useMemo for expensive computations
3. Avoid prop drilling (use composition)
4. Consider context for truly global state

### Performance
1. Avoid inline function definitions in loops
2. Use React.memo for expensive components
3. Implement virtualization for large lists
4. Optimize chart data before rendering

### Code Style
1. Use ESLint and Prettier
2. Consistent naming conventions
3. Group related imports
4. Comment complex logic
5. Keep files under 300 lines

---

**Component Library Version**: 1.0.0  
**Compatible with**: Next.js 14, React 18
