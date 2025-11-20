# Architecture Documentation Index

This folder contains comprehensive documentation of the Umami codebase architecture, designed to help you create 4 homepage variations.

## Documentation Files

### 1. EXPLORATION_SUMMARY.md (START HERE)
**Length**: ~200 lines | **Read Time**: 10-15 minutes
- Quick overview of findings
- Project stack summary
- Key architectural decisions
- Quick start for creating variations
- Contact points for typical tasks

### 2. QUICK_REFERENCE.md (FOR IMPLEMENTATION)
**Length**: ~100 lines | **Read Time**: 5-10 minutes
- File location shortcuts
- Step-by-step route creation
- Key imports reference
- Color palette
- Layout props
- Data fetching pattern
- Best files to reference

### 3. CODEBASE_ARCHITECTURE.md (COMPLETE REFERENCE)
**Length**: ~643 lines | **Read Time**: 30-45 minutes
- Full 12-section architecture guide
- Detailed explanations
- Code examples
- Complete file structure
- Design system deep dive
- API patterns
- Authentication flow
- Component library details
- Responsive design patterns

---

## Quick Navigation

### I want to... then read...

**Create a new homepage page**
1. QUICK_REFERENCE.md - "Creating a New Homepage Variation" section
2. Reference: `/root/umami/src/app/(main)/websites/[websiteId]/WebsitePage.tsx`

**Understand the theme/design system**
- CODEBASE_ARCHITECTURE.md - Section 2 "Design System & Styling"
- File: `/root/umami/src/lib/constants.ts`

**Find a chart component**
- CODEBASE_ARCHITECTURE.md - Section 4 "Available Chart & Visualization Components"
- Directory: `/root/umami/src/components/charts/`

**Use metric components**
- CODEBASE_ARCHITECTURE.md - Section 4 "Metric Components"
- Directory: `/root/umami/src/components/metrics/`

**Understand data fetching**
- CODEBASE_ARCHITECTURE.md - Section 5 "Data Fetching & API Structure"
- File: `/root/umami/src/components/hooks/useApi.ts`
- Example: `/root/umami/src/components/hooks/queries/useWebsiteMetricsQuery.ts`

**Handle authentication**
- CODEBASE_ARCHITECTURE.md - Section 6 "Authentication Setup"
- File: `/root/umami/src/lib/auth.ts`
- Note: Pages under /(main)/ are auto-protected

**Learn component patterns**
- CODEBASE_ARCHITECTURE.md - Section 7 "Example Page Implementation"
- Reference: `/root/umami/src/components/common/Panel.tsx`
- Reference: `/root/umami/src/components/common/PageHeader.tsx`

**Understand import patterns**
- CODEBASE_ARCHITECTURE.md - Section 8 "Component Export/Import Patterns"
- Use: `@/` alias for all imports

**Get styling props**
- QUICK_REFERENCE.md - "Layout Props" section
- CODEBASE_ARCHITECTURE.md - Section 3 "Component Library Architecture"

---

## File Structure Reference

```
Key Files for Your Work:
├── Documentation (you are here)
│   ├── ARCHITECTURE_INDEX.md           <- Navigation guide
│   ├── EXPLORATION_SUMMARY.md          <- Quick overview
│   ├── QUICK_REFERENCE.md              <- Implementation tips
│   └── CODEBASE_ARCHITECTURE.md        <- Complete reference
│
└── Source Code
    ├── src/app/(main)/
    │   ├── App.tsx                     <- Main layout + auth
    │   ├── layout.tsx                  <- Layout wrapper
    │   ├── dashboard/                  <- Example: simple page
    │   ├── websites/[websiteId]/       <- Example: complex page
    │   └── [YOUR_PAGES_HERE]/          <- Create here
    │
    ├── src/components/
    │   ├── common/                     <- UI components (Panel, PageHeader, etc.)
    │   ├── charts/                     <- Chart components (Bar, Pie, etc.)
    │   ├── metrics/                    <- Metric components (Card, Bar, Table, etc.)
    │   └── hooks/
    │       └── queries/                <- 50+ data fetching hooks
    │
    ├── src/lib/
    │   ├── constants.ts                <- Colors, roles, permissions
    │   ├── colors.ts                   <- Color utilities
    │   └── auth.ts                     <- Authentication logic
    │
    └── src/styles/
        ├── global.css                  <- Global styles
        └── variables.css               <- CSS variables
```

---

## Technology Stack at a Glance

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | Next.js | 15.5.3 |
| UI Library | React | 19.2.0 |
| Language | TypeScript | 5.9 |
| Component Library | @umami/react-zen | 0.203.0 |
| Charting | Chart.js | 4.5.1 |
| State Management | React Query | 5.90.5 |
| Database | Prisma | 6.18.0 |
| Styling | CSS Modules + Props-based |  |
| i18n | react-intl | 7.1.14 |

---

## Key Design Decisions

1. **App Router, not Pages Router** - Using Next.js 15 App Router
2. **Props-based Styling** - @umami/react-zen provides components with prop-based styling
3. **React Query for Data** - 50+ pre-built query hooks for API calls
4. **Automatic Authentication** - Pages under /(main)/ auto-redirect to /login if not authenticated
5. **Chart.js for Visualizations** - Configured with interactive tooltips and legends
6. **Flexbox Layout** - All layouts use flexbox via Column/Row components

---

## Common Tasks Quick Links

### Task: Display a metric
**File**: `/root/umami/src/components/metrics/MetricCard.tsx`
```typescript
<MetricCard 
  label="Total Views"
  value={1234}
  change={+12}
/>
```

### Task: Create a bar chart
**File**: `/root/umami/src/components/charts/BarChart.tsx`
```typescript
<BarChart chartData={timeSeriesData} unit="day" />
```

### Task: Fetch website metrics
**File**: `/root/umami/src/components/hooks/queries/useWebsiteMetricsQuery.ts`
```typescript
const { data, isLoading } = useWebsiteMetricsQuery(websiteId, {
  type: 'pageviews'
});
```

### Task: Create page wrapper
**File**: `/root/umami/src/components/common/PageBody.tsx`
```typescript
<PageBody>
  <Column margin="2">
    <PageHeader title="My Page" />
    {content}
  </Column>
</PageBody>
```

### Task: Use primary color
**File**: `/root/umami/src/lib/constants.ts`
```typescript
import { THEME_COLORS } from '@/lib/constants';
// THEME_COLORS.light.primary === '#2680eb'
```

---

## Development Workflow

### 1. Start Dev Server
```bash
cd /root/umami
npm run dev
# Server runs on http://localhost:3001
```

### 2. Create Your Page
```bash
mkdir -p src/app/\(main\)/homepage-variation-1
touch src/app/\(main\)/homepage-variation-1/page.tsx
```

### 3. Use Template
- Copy structure from `/root/umami/src/app/(main)/dashboard/DashboardPage.tsx`
- Or see QUICK_REFERENCE.md "Basic Template" section

### 4. Test Locally
- Open http://localhost:3001
- Navigate to `/homepage-variation-1`
- Login is automatic (if DB configured) or set `DISABLE_AUTH=1`

### 5. Iterate
- Modify components
- Changes hot-reload automatically
- Use Chrome DevTools to inspect

---

## Getting Help

### Understanding Framework Patterns
- Read: CODEBASE_ARCHITECTURE.md Section 7-8
- Reference: `/root/umami/src/app/(main)/websites/[websiteId]/WebsitePage.tsx`

### Finding Components
- Search: `/root/umami/src/components/`
- Browse: `/root/umami/src/components/metrics/` for metric components
- Browse: `/root/umami/src/components/charts/` for chart components

### Understanding Styling
- Read: CODEBASE_ARCHITECTURE.md Section 2-3
- Reference: `/root/umami/src/lib/constants.ts` for colors
- Reference: @umami/react-zen components for props

### Debugging Data Issues
- Check: `/root/umami/src/components/hooks/useApi.ts` for API client
- Check: `/root/umami/src/app/api/` for available endpoints
- Check: Network tab in DevTools for actual requests

---

## Next Steps

1. Read **EXPLORATION_SUMMARY.md** (5-10 minutes)
2. Read **QUICK_REFERENCE.md** (5-10 minutes)
3. Look at **example file**: `/root/umami/src/app/(main)/websites/[websiteId]/WebsitePage.tsx`
4. Create your first variation using QUICK_REFERENCE.md template
5. Reference **CODEBASE_ARCHITECTURE.md** as needed for details

---

## Summary

You now have:
- Complete architecture documentation
- Quick reference guide
- File location map
- Example files to reference
- Technology stack overview
- Key design decisions explained

Ready to create homepage variations! Start with EXPLORATION_SUMMARY.md.

