# D-FARE Management Dashboard

A modern, enterprise-grade Management Web Dashboard UI for the AI-powered Fair Dispatch System (D-FARE).

## Overview

D-FARE is an AI-driven dispatch platform for last-mile delivery and field operations. This dashboard provides real-time operational visibility, fairness monitoring, and workload transparency — all through a read-only, monitoring-first interface.

## Features

- **Real-Time Operations Overview**: Live system metrics and status indicators
- **Driver Monitoring**: Comprehensive driver status, workload, and activity tracking
- **Task Queue Management**: Multi-state task tracking (Pending, Assigned, Completed)
- **Fairness Analytics**: Visual workload distribution and fairness trend analysis
- **AI Explainability**: Transparent insights into task assignment decisions

## Tech Stack

- **Framework**: Next.js 14 (React)
- **Language**: JavaScript
- **Styling**: Tailwind CSS
- **Data Fetching**: TanStack Query
- **Charts**: Apache ECharts
- **Icons**: Lucide React

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── layout.js          # Root layout
│   ├── page.js            # Main dashboard page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── layout/           # Layout components (Sidebar, TopBar)
│   ├── dashboard/        # Dashboard-specific components
│   ├── drivers/          # Driver monitoring components
│   ├── tasks/            # Task management components
│   ├── analytics/        # Analytics and charts
│   └── ui/               # Reusable UI components
├── lib/                  # Utilities and helpers
│   ├── mockData.js      # Mock data for demonstration
│   └── utils.js         # Utility functions
└── public/              # Static assets
```

## Design Principles

- **Monitoring-First**: Read-only interface focused on visibility, not control
- **AI-Driven**: All assignments are automatic; no manual overrides
- **Enterprise-Grade**: Clean, professional design suitable for operations teams
- **Real-Time Ready**: Built for live data synchronization
- **Fairness-Focused**: Transparent workload distribution and explainability

## Target Users

- Fleet Managers
- Dispatch Operations Teams
- Logistics Supervisors

## License

Proprietary
