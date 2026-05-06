# LinkedIn Engagement Insights - Agent Documentation

## Quick Start

To launch the application in Antigravity IDE terminal:

```powershell
.\run-li-insights.ps1
```

Or manually:

```powershell
npm install
npm run dev
```

## Available Commands

- `.\run-li-insights.ps1 -Install` - Install dependencies
- `.\run-li-insights.ps1 -Build` - Build for production
- `npm run dev` - Start development server

## Features Implemented

### Phase 1: Core Functionality
- Multi-field input form for LinkedIn metrics (Impressions, Clicks, Reactions, Comments, Shares)
- Engagement Rate calculation: `((Reactions + Comments + Shares + Clicks) / Impressions) * 100`
- JSON-structured data storage

### Phase 2: UI/UX & Visualization
- LinkedIn brand colors: #0a66c2 (brand blue), #ffffff, #f3f6f8
- Source Sans 3 font family
- Two-column responsive layout
- Collapsible input panel with tooltips
- KPI cards for Impressions, Clicks, Reactions, Engagement Rate
- Central engagement gauge with color-graded segments (Red/Yellow/Green)
- Bar chart with benchmark comparison (Personal vs Company)
- Interactive posts table with engagement badges

### Phase 3: Platform Integration
- React + Vite setup
- Terminal activation script
- PDF report generation with "Generate Report" button
- Mock data pre-loaded for visualization demo

## Tech Stack
- React 18
- Vite
- Chart.js + react-chartjs-2
- html2canvas + jspdf for PDF export