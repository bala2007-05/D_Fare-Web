# D-FARE Dashboard - Visual Guide

## Layout Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                          TOP BAR (Fixed)                            │
│  Operations Dashboard              [Live] [✓ System OK] [2:45 PM]  │
│  Real-time monitoring and analytics                                 │
└─────────────────────────────────────────────────────────────────────┘
┌──────────┐ ┌────────────────────────────────────────────────────────┐
│          │ │                                                        │
│  D-FARE  │ │         LIVE OPERATIONS OVERVIEW                       │
│          │ │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐             │
│          │ │  │ 47  │ │ 23  │ │  8  │ │ 156 │ │ OK  │             │
│ Sidebar  │ │  │Drivr│ │Activ│ │Pend │ │Cmpl │ │Hlth │             │
│  (Nav)   │ │  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘             │
│          │ │                                                        │
│ • Dashbd │ │         DRIVER MONITORING                              │
│ • Driver │ │  Search: [.......] Status: [v] Vehicle: [v]           │
│ • Tasks  │ │  ┌───────────────────────────────────────────────┐   │
│ • Analyt │ │  │ Driver  │Status│Vehicle│Workload│Tasks│Current │   │
│ • Status │ │  ├───────────────────────────────────────────────┤   │
│          │ │  │ Alex    │●Onlin│ Van   │ 7.2    │ 12  │TSK-156 │   │
│          │ │  │ Maria   │●Busy │ Bike  │ 8.5    │ 15  │TSK-157 │   │
│          │ │  │ James   │●Onlin│ Car   │ 6.1    │  9  │  --    │   │
│          │ │  └───────────────────────────────────────────────┘   │
│          │ │                                                        │
│          │ │         TASK QUEUE                                     │
│  v1.0.0  │ │  [Pending 2] [Active 5] [Completed 2]                 │
│          │ │  ┌───────────────────────────────────────────────┐   │
│          │ │  │Task ID │Route      │Driver │Status │Created   │   │
│          │ │  ├───────────────────────────────────────────────┤   │
│          │ │  │TSK-156 │Main→Oak   │DRV-001│●In Prg│45m ago   │   │
│          │ │  │TSK-157 │Elm→Pine   │DRV-002│●In Prg│30m ago   │   │
│          │ │  └───────────────────────────────────────────────┘   │
│          │ │                                                        │
│          │ │         FAIRNESS & WORKLOAD ANALYTICS                  │
│          │ │  ┌─────────────────────┐ ┌─────────────────────┐     │
│          │ │  │ Current Fairness: 94%                        │     │
│          │ │  └──────────────────────────────────────────────┘     │
│          │ │  ┌────────────────┐ ┌─────────────────────────┐      │
│          │ │  │Workload Distrib│ │   Fairness Trend        │      │
│          │ │  │  [BAR CHART]   │ │   [LINE CHART]          │      │
│          │ │  │  █ █ █ █ █ █   │ │      ╱‾‾‾‾╲            │      │
│          │ │  │  █ █ █ █ █ █   │ │    ╱        ╲          │      │
│          │ │  └────────────────┘ └─────────────────────────┘      │
│          │ │  ┌──────────────────────────────────────────────┐    │
│          │ │  │   Driver Effort Comparison                   │    │
│          │ │  │   [HORIZONTAL BAR CHART]                     │    │
│          │ │  │   Alex     ████████████ 12                   │    │
│          │ │  │   Maria    ███████████████ 15                │    │
│          │ │  └──────────────────────────────────────────────┘    │
│          │ │                                                        │
│          │ │         AI EXPLAINABILITY                              │
│          │ │  ┌──────────────────────────────────────────────┐    │
│          │ │  │ 💡 Why was Task TSK-157 assigned?           │    │
│          │ │  │                                              │    │
│          │ │  │ ┌────────────────────────────────────────┐  │    │
│          │ │  │ │ Proximity: High (35%) ████████████     │  │    │
│          │ │  │ │ Driver 0.8km from pickup               │  │    │
│          │ │  │ └────────────────────────────────────────┘  │    │
│          │ │  │ ┌────────────────────────────────────────┐  │    │
│          │ │  │ │ Historical Workload: Moderate (30%)    │  │    │
│          │ │  │ │ ██████████                             │  │    │
│          │ │  │ └────────────────────────────────────────┘  │    │
│          │ │  └──────────────────────────────────────────────┘    │
└──────────┘ └────────────────────────────────────────────────────────┘
```

## Color Palette

### Primary Colors
- **Primary Blue**: #0ea5e9 - Main actions, active states
- **Success Green**: #22c55e - Positive indicators, online status
- **Warning Yellow**: #f59e0b - Caution, moderate workload
- **Danger Red**: #ef4444 - Alerts, high workload
- **Slate Grays**: #f8fafc to #0f172a - Backgrounds, borders, text

### Status Colors
- **Online**: Green badge with pulsing dot
- **Busy**: Yellow badge with pulsing dot
- **Offline**: Gray badge
- **In Progress**: Blue badge
- **Completed**: Green badge
- **Pending**: Gray badge

### Workload Colors
- **< 6.0**: Green (balanced)
- **6.0 - 7.9**: Yellow (moderate)
- **≥ 8.0**: Red (high)

## Component Examples

### Metric Card
```
┌────────────────────────┐
│ Drivers Online    [👥] │
│                        │
│        47        ↑ +3  │
│                        │
│ Currently active       │
└────────────────────────┘
```

### Status Badge
```
[● Live] - Green with pulse
[● Online] - Green with pulse
[● Busy] - Yellow with pulse
[Offline] - Gray, no pulse
```

### Table Row (Driver)
```
┌─────────────────────────────────────────────────────────┐
│ Alex Chen  │ ● Online │ Van  │ 7.2  │ 12 │ TSK-156     │
│ DRV-001    │          │      │      │    │             │
└─────────────────────────────────────────────────────────┘
    Hover: Light gray background
```

### Task Route Display
```
123 Main St  →  456 Oak Ave
   (pickup)     (dropoff)
```

### Chart Tooltip (on hover)
```
┌───────────────────┐
│ Alex Chen         │
│ Workload: 7.2     │
│ Tasks: 12         │
└───────────────────┘
```

## Typography

### Headings
- **H1**: 24px, Bold - Page title (not used, TopBar has title)
- **H2**: 20px, Bold - Section headings
- **H3**: 16px, Semibold - Card titles
- **H4**: 14px, Semibold - Subsection titles

### Body Text
- **Base**: 14px, Regular - Default text
- **Small**: 12px, Regular - Supporting text
- **Extra Small**: 11px, Regular - Labels, captions

### Special
- **Monospace**: Task IDs, Driver IDs
- **Bold**: Metric values, important numbers
- **Medium**: Table headers, labels

## Spacing & Layout

### Grid System
```
5 Columns (Metric Cards):
┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
│     │ │     │ │     │ │     │ │     │
└─────┘ └─────┘ └─────┘ └─────┘ └─────┘

2 Columns (Charts):
┌──────────────┐ ┌──────────────┐
│              │ │              │
│              │ │              │
└──────────────┘ └──────────────┘
```

### Spacing Scale
- **xs**: 4px (0.25rem)
- **sm**: 8px (0.5rem)
- **md**: 16px (1rem)
- **lg**: 24px (1.5rem)
- **xl**: 32px (2rem)

## Interactive States

### Hover Effects
```
Default Card:
┌────────────┐
│   Content  │
└────────────┘

Hover Card:
┌────────────┐  ← Subtle shadow increase
│   Content  │  ← Border color brightens
└────────────┘
```

### Button/Tab States
```
Inactive Tab: Gray text, transparent border
[  Pending  ]

Active Tab: Blue text, blue bottom border
[  Active  ]
   ━━━━━━
```

### Input Focus
```
Default:
[Search drivers...     ]

Focused:
[Search drivers...     ]  ← Blue ring
 ━━━━━━━━━━━━━━━━━━━━━
```

## Animations

### Fade In (on load)
```
Opacity: 0 → 1
Transform: translateY(4px) → translateY(0)
Duration: 300ms
Easing: ease-in-out
```

### Pulse (live indicators)
```
Opacity: 1 → 0.7 → 1
Duration: 2000ms
Easing: cubic-bezier
Infinite loop
```

### Hover Transition
```
All properties
Duration: 200ms
Easing: ease
```

## Responsive Breakpoints (Future)

```
Mobile:    < 768px   (Vertical layout, bottom nav)
Tablet:    768-1023px (Collapsible sidebar)
Desktop:   1024-1439px (Standard layout)
Large:     ≥ 1440px   (Current optimized view)
```

## Icon Usage

### Navigation Icons
- Dashboard: LayoutDashboard
- Drivers: Users
- Tasks: ClipboardList
- Analytics: BarChart3
- Status: Activity

### Status Icons
- Online: Users (in badge)
- Success: CheckCircle2
- Warning: AlertCircle
- Info: Info
- Lightbulb: Lightbulb (explainability)

### Utility Icons
- Search: Search
- Clock: Clock
- Arrow Right: ArrowRight
- Trending Up: TrendingUp
- Trending Down: TrendingDown

## Chart Styles

### Bar Chart (Workload Distribution)
- Bar width: 50%
- Bar radius: Subtle rounded corners
- Colors: Conditional (green/yellow/red)
- Labels: On top of bars
- Grid: Minimal horizontal lines

### Line Chart (Fairness Trend)
- Line: 2px width, smooth curves
- Area fill: Gradient (blue, subtle)
- Points: 6px circles
- Grid: Minimal horizontal lines
- Y-axis: 80-100 range

### Horizontal Bar Chart (Driver Effort)
- Bar height: 60%
- Bar radius: Right side rounded
- Color: Consistent blue
- Labels: Right of bars
- Grid: Minimal vertical lines

## Best Practices Applied

### Visual Hierarchy
1. Metric cards (large numbers catch attention)
2. Section headings (guide flow)
3. Tables (detailed data)
4. Charts (visual analysis)
5. Explanations (supporting details)

### Whitespace
- Generous padding in cards (24px)
- Consistent gaps between sections (24px)
- Table cell padding (16px vertical, 24px horizontal)
- Breathing room around all elements

### Consistency
- All cards use same border radius (8px)
- All badges use same size and style
- All tables use same header style
- All charts use same color palette
- All animations use same timing

### Accessibility
- High contrast text (WCAG AA)
- Focus indicators on all interactive elements
- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigable

## UI Flow

1. **Entry**: User sees TopBar status immediately
2. **Overview**: Metric cards provide instant insights
3. **Monitoring**: Tables show detailed real-time data
4. **Analysis**: Charts reveal patterns and trends
5. **Understanding**: Explainability panel builds trust

## Design Philosophy

### Clean & Professional
- No unnecessary decorations
- Subtle shadows and borders
- Plenty of whitespace
- Focused color usage

### Information Dense
- Tables show maximum relevant data
- Charts are clear and readable
- No pagination needed for demo
- Efficient use of screen space

### User-Friendly
- Intuitive navigation
- Clear status indicators
- Helpful empty states
- Informative tooltips

### Enterprise-Grade
- Looks like a serious operations tool
- Inspires confidence and trust
- Professional throughout
- Ready for boardroom demos

---

**This visual guide helps understand the dashboard's appearance and interaction patterns.**

For implementation details, see COMPONENTS.md and ARCHITECTURE.md.
