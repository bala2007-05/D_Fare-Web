# D-FARE Management Dashboard - Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages:
- Next.js 14
- React 18
- Tailwind CSS
- TanStack Query
- Apache ECharts
- Lucide React Icons

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

The dashboard will auto-reload as you make changes to the code.

### 3. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
D-fare WEb/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles with Tailwind
│   ├── layout.js                # Root layout wrapper
│   ├── page.js                  # Main dashboard page
│   └── providers.js             # TanStack Query provider
├── components/                   # React components
│   ├── analytics/               # Analytics & explainability
│   │   ├── ExplainabilityPanel.js
│   │   └── FairnessAnalytics.js
│   ├── dashboard/               # Dashboard components
│   │   ├── MetricCard.js
│   │   └── OperationalOverview.js
│   ├── drivers/                 # Driver monitoring
│   │   └── DriverTable.js
│   ├── layout/                  # Layout components
│   │   ├── MainLayout.js
│   │   ├── Sidebar.js
│   │   └── TopBar.js
│   ├── tasks/                   # Task management
│   │   └── TaskQueue.js
│   └── ui/                      # Reusable UI components
│       ├── Badge.js
│       ├── Card.js
│       ├── EmptyState.js
│       ├── Input.js
│       ├── Select.js
│       └── Skeleton.js
├── lib/                         # Utilities and data
│   ├── mockData.js             # Mock data for demo
│   └── utils.js                # Helper functions
├── public/                      # Static assets
├── jsconfig.json               # Path aliases config
├── next.config.js              # Next.js configuration
├── package.json                # Dependencies
├── postcss.config.js           # PostCSS config
└── tailwind.config.js          # Tailwind configuration
```

## Key Features

### 1. Live Operations Overview
- Real-time metrics cards
- System health indicators
- Driver and task statistics

### 2. Driver Monitoring
- Filterable driver table
- Status indicators (Online/Busy/Offline)
- Workload scores with color coding
- Search functionality

### 3. Task Queue
- Tabbed interface (Pending/Active/Completed)
- Comprehensive task details
- Route visualization
- Timestamp tracking

### 4. Fairness Analytics
- Workload distribution charts
- Fairness trend over time
- Driver effort comparison
- Real-time fairness scoring

### 5. AI Explainability
- Transparent assignment decisions
- Weighted factor breakdown
- Plain language explanations

## Customization

### Colors
Edit `tailwind.config.js` to customize the color palette:
- Primary (blue) - Main brand color
- Success (green) - Positive states
- Warning (yellow) - Caution states
- Danger (red) - Alert states
- Slate - Neutral grays

### Mock Data
Edit `lib/mockData.js` to modify demo data:
- Drivers
- Tasks
- Fairness metrics
- Explainability examples

### Real-Time Integration
The dashboard is prepared for real-time data:
- TanStack Query is configured for 5-second auto-refresh
- Replace mock data imports with API calls
- Use WebSocket or Server-Sent Events for live updates

## Design Philosophy

### Enterprise-Grade UI
- Clean, neutral color palette
- Card-based information architecture
- Dense but readable tables
- Minimal decorative elements

### Monitoring-First
- Read-only interface (no manual controls)
- Focus on visibility and transparency
- Real-time status indicators
- Clear visual hierarchy

### Fairness & Trust
- Transparent AI decision-making
- Balanced workload visualization
- No manual override capabilities
- Explainability built-in

## Browser Support

Optimized for modern desktop browsers:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Performance

- Server-side rendering with Next.js
- Optimized chart rendering with SVG
- Efficient component re-renders
- Lazy loading where applicable

## Next Steps

1. **Connect to Real Backend**: Replace mock data with actual API endpoints
2. **Add Authentication**: Implement user login (if required)
3. **Extend Analytics**: Add more charts and metrics as needed
4. **Mobile Optimization**: Add responsive layouts for tablet/mobile
5. **Real-Time Updates**: Integrate WebSocket for live data streaming

## Support

For questions or issues:
- Check the main README.md
- Review component documentation in code comments
- Consult Next.js and Tailwind CSS documentation

---

**Built with Next.js, React, Tailwind CSS, and Apache ECharts**
