# Umami Project Exploration Summary

## Executive Summary

The Umami project is a comprehensive, privacy-focused analytics platform built with modern web technologies. I've completed a thorough exploration of the project structure, identifying all key files, components, and systems needed to create homepage engagement variants.

### Quick Stats
- **Framework**: Next.js 15.5.3 + React 19.2.0
- **Language**: TypeScript 5.9.3
- **Total Components**: 50+ in `/src/components/`
- **Hook Queries**: 48+ custom hooks for data fetching
- **Design System**: @umami/react-zen (custom Umami library)
- **Visualization**: Chart.js 4.5.1
- **State Management**: Zustand + React Query + React Context

---

## What I Found

### 1. Project Structure (COMPLETE)
The Umami project follows Next.js 13+ App Router pattern with clear separation of concerns:
- Frontend UI in `/src/app/` and `/src/components/`
- Backend API routes in `/src/app/api/`
- Utilities and helpers in `/src/lib/`
- Styling system in `/src/styles/` with CSS variables

### 2. Homepage Location (IDENTIFIED)
**Main homepage file**: `/root/umami/src/app/(main)/websites/[websiteId]/WebsitePage.tsx`

This is the primary analytics dashboard where users view their website data. It's composed of:
- WebsiteControls - Top control bar
- WebsiteMetricsBar - 5 KPI metric cards
- WebsiteChart - Main time series visualization
- WebsitePanels - Grid of 6 data sections
- ExpandedViewModal - Optional expanded view

### 3. Tech Stack Confirmed
**Frontend**:
- Next.js 15.5.3 with App Router
- React 19.2.0
- TypeScript 5.9.3
- Styling: CSS Modules + PostCSS + Custom CSS Properties

**Components & UI**:
- @umami/react-zen (custom Umami design system)
- Chart.js 4.5.1 for visualizations
- @react-spring/web for animations
- react-simple-maps for geographic visualizations

**State & Data**:
- TanStack React Query for server state
- Zustand for global state
- Immer for immutable updates
- react-intl for i18n

**Backend**:
- Prisma 6.18.0 (ORM)
- PostgreSQL (primary database)
- ClickHouse (analytics engine)
- Redis (caching)
- Kafka (message queue)

### 4. Design System Overview (DOCUMENTED)
**File**: `/root/umami/src/lib/constants.ts`

**Color System**:
- Primary: #2680eb (Umami Blue)
- 12-color chart palette
- Light/Dark theme support
- CSS custom properties for theming

**Components** (from @umami/react-zen):
- Grid, Row, Column for layout
- Text, Button, Tab, Select for forms
- Responsive props: xs, sm, md, lg, xl
- Theme-aware styling

### 5. Data Visualizations (MAPPED)
**Chart Types Used**:
- Bar Charts (time series, stacked)
- Pie/Donut Charts
- Bubble Charts
- Geographic heatmaps
- Custom metric cards with animations
- Data tables with sorting/pagination

**Key Visualizations**:
- Time series (pageviews vs visitors over time)
- World map (geographic distribution)
- Device/browser distribution charts
- Traffic source breakdowns
- Real-time metrics

### 6. Engagement Data Displayed (COMPREHENSIVE)

**Top-Level Metrics (5 cards)**:
1. Visitors - Unique visitor count
2. Visits - Session count
3. Pageviews - Total page views
4. Bounce Rate - % single-page sessions
5. Visit Duration - Average time on site

**Detailed Analytics**:
- Page paths with metrics per page
- Entry/exit pages
- Traffic referrers
- Marketing channels (UTM)
- Browser analytics
- OS/device breakdown
- Geographic data (country/region/city)
- Weekly traffic patterns
- Custom events tracking

**Additional Features**:
- Real-time active users
- Session replay/analysis
- Funnel tracking
- Goal conversions
- User cohorts
- Custom segments
- Data comparison modes

---

## Key Files Referenced

### Documentation Created
1. **/root/umami/PROJECT_STRUCTURE_ANALYSIS.md** - Complete 10-section analysis
2. **/root/umami/HOMEPAGE_COMPONENTS_GUIDE.md** - Component hierarchy and usage
3. **/root/umami/CRITICAL_FILES_FOR_VARIATIONS.md** - Absolute paths and modification guide
4. **/root/umami/EXPLORATION_SUMMARY.md** - This file

### Most Important Files for Variations

**Core Homepage Files**:
- `/root/umami/src/app/(main)/websites/[websiteId]/WebsitePage.tsx`
- `/root/umami/src/app/(main)/websites/[websiteId]/WebsiteMetricsBar.tsx`
- `/root/umami/src/app/(main)/websites/[websiteId]/WebsitePanels.tsx`
- `/root/umami/src/app/(main)/websites/[websiteId]/WebsiteChart.tsx`

**Visualization Components**:
- `/root/umami/src/components/metrics/MetricCard.tsx`
- `/root/umami/src/components/charts/BarChart.tsx`
- `/root/umami/src/components/charts/Chart.tsx`

**Design System**:
- `/root/umami/src/lib/constants.ts` (colors, theme)
- `/root/umami/src/lib/colors.ts` (color utilities)
- `/root/umami/src/styles/` (global CSS)

**Data Fetching**:
- `/root/umami/src/components/hooks/queries/` (48+ query hooks)
- `/root/umami/src/components/hooks/` (UI state hooks)

---

## Answers to Your Questions

### 1. Overall Project Structure
✓ **Answered**: Next.js 15 full-stack app with React 19, TypeScript, Prisma ORM, PostgreSQL/ClickHouse databases
- Frontend: `/src/app/` (routes) + `/src/components/` (UI)
- Backend: `/src/app/api/` (API routes)
- Utilities: `/src/lib/` (functions), `/src/store/` (state)

### 2. Homepage Location & Structure
✓ **Answered**: Located at `/src/app/(main)/websites/[websiteId]/WebsitePage.tsx`
- 5 main sections: Controls, Metrics Bar, Chart, Panels, Modal
- 6 data panel sections: Pages, Sources, Environment, Location, Geography, Events

### 3. Framework & Tech Stack
✓ **Answered**: 
- Frontend: Next.js 15, React 19, TypeScript, @umami/react-zen
- Charts: Chart.js 4.5.1
- State: Zustand, React Query, Immer
- Backend: Node.js, Prisma, PostgreSQL, ClickHouse
- Styling: CSS Modules, PostCSS, CSS variables

### 4. Design System
✓ **Answered**: 
- Custom `@umami/react-zen` component library
- 12-color palette + primary blue (#2680eb)
- Responsive grid system (xs-xl breakpoints)
- Light/dark theme support
- Inter font family

### 5. Data Visualizations
✓ **Answered**: 
- Chart.js with bar/pie/bubble/line types
- react-simple-maps for geography
- Custom animated metric cards
- Data tables with sorting/pagination
- Real-time metrics, cohorts, segments

### 6. Engagement/Analytics Data
✓ **Answered**: 
- 5 top-level KPIs
- 6 data breakdown sections
- Time series with multiple granularities
- Visitor behavior: pages, sources, devices, locations
- Advanced: sessions, events, funnels, goals, journeys, retention

---

## Ready for Homepage Variations

### What's Prepared
1. Complete file structure mapping with absolute paths
2. Component hierarchy diagrams
3. Data flow patterns documented
4. Design system constants identified
5. Query hook listing (48+ hooks)
6. Common modification points identified
7. Development workflow outlined

### Variation Points Identified
- **Metric cards**: Can be reordered, restyled, or replaced
- **Panel layout**: Grid configuration can be modified
- **Chart types**: Can switch between bar/line/pie/bubble
- **Colors**: Theme system allows full customization
- **Data tables**: Can be filtered, sorted, or hidden
- **Responsive breakpoints**: Adjustable via @umami/react-zen props
- **Animation**: Configurable via @react-spring and Chart.js

### Next Steps for Creating Variations
1. Copy core page component as template: `WebsitePage.Variant1.tsx`
2. Modify component composition and props
3. Adjust styling via design system
4. Update layout using GridRow and responsive props
5. Test locally with `npm run dev`
6. Build and deploy with `npm run build`

---

## File Statistics

### Component Files
- **homepage-specific**: 5 files
- **chart/visualization**: 8 files
- **metric/card**: 5 files
- **common UI**: 26 files
- **Total components**: 50+ files

### Hook Files
- **query hooks**: 48 files
- **UI state hooks**: 20+ files
- **Total hooks**: 68+ files

### Library Files
- **utilities**: 20+ files
- **API/data**: 10+ files
- **styling**: 2 files

### Configuration Files
- **Next.js**: next.config.ts, tsconfig.json
- **Build**: package.json, rollup configs
- **Database**: prisma/, db/ directories

---

## Recommendations

### For Creating Engagement Variants
1. **Start with layout variations**: Reorder panels, hide sections
2. **Then add styling variations**: Colors, spacing, typography
3. **Finally, data variations**: Different metrics, chart types
4. **Test each level**: Check responsiveness and data loading

### Best Practices Observed
- Component composition over monolithic files
- Custom hooks for data fetching (great for testing)
- Design system props over CSS (maintainable theming)
- React Query for state sync (automatic caching)
- Zustand for UI state (lightweight, simple)

### Performance Considerations
- React Query caching (1 minute stale time)
- Virtual lists for large tables (react-window)
- Lazy-loaded modals
- Memoized expensive calculations
- Code splitting via Next.js

---

## Resources Created for You

All documents are in `/root/umami/`:
1. **PROJECT_STRUCTURE_ANALYSIS.md** - 5000+ lines, comprehensive
2. **HOMEPAGE_COMPONENTS_GUIDE.md** - Quick reference guide
3. **CRITICAL_FILES_FOR_VARIATIONS.md** - Absolute paths + modification guide
4. **EXPLORATION_SUMMARY.md** - This executive summary

All files use absolute paths for easy navigation and reference.

---

## Conclusion

The Umami project is well-structured for creating variations. The separation of concerns, design system, and modular component architecture make it straightforward to:
- Reorder and restyle sections
- Add/remove metrics
- Change color schemes
- Modify layouts
- Create variants for different user segments

You have everything needed to create engaging homepage variations that maintain consistency with the existing design system while offering fresh perspectives on data presentation.

