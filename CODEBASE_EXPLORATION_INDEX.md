# Umami Dashboard Codebase Exploration - Complete Index

**Date**: November 19, 2025  
**Branch**: conorbranagan/dashboard-usecase-variants-3p2q2w  
**Status**: Exploration Complete - Ready for Implementation

---

## Quick Summary

This repository is **Umami Analytics**, a privacy-focused web analytics platform built with **Next.js 15**, **React 19**, and **TypeScript**.

The **main dashboard** at `/dashboard` is currently **minimal** (just a header) and appears to be a blank canvas awaiting implementation. This aligns with the branch name suggesting work on "dashboard use case variants."

**Key Finding**: There are **NO existing use case variants or personas** in the codebase - these would need to be implemented from scratch.

---

## Documentation Files

This exploration created 4 comprehensive documentation files:

### 1. DASHBOARD_STRUCTURE.md (17 KB)
**Comprehensive analysis of the dashboard and application structure**

Covers:
- Current dashboard location and implementation
- Framework and routing pattern (Next.js 15 App Router)
- Main navigation structure and feature areas
- Component architecture and patterns
- Design system and styling approach
- Data fetching architecture (React Query)
- Internationalization setup
- Complete page structure overview
- Layout and provider setup
- Development patterns and API routes
- Key insights for implementing variants
- Complete file location reference

**Read this for**: Understanding the overall structure and how to implement variants.

---

### 2. ARCHITECTURE_DIAGRAMS.md (16 KB)
**Visual diagrams and data flow illustrations**

Includes:
- Application structure hierarchy (full page tree)
- Dashboard component hierarchy (current vs proposed)
- Component architecture layers
- Data flow example for dashboard variant display
- Key component locations map
- Store state architecture
- API and data fetching pattern flow
- Styling system explanation with examples
- Current vs proposed dashboard state
- Implementation roadmap for variants
- Responsive props examples

**Read this for**: Visual understanding of data flow and component relationships.

---

### 3. CODE_EXAMPLES.md (16 KB)
**Patterns and real code examples from the codebase**

Includes:
- Current dashboard implementation (actual code)
- Example: Website dashboard page (with rich content)
- Store pattern (Zustand example)
- Hook patterns (useMessages, useApi, query hooks)
- Form component pattern
- Layout components pattern
- Responsive props examples
- Global state examples
- DataGrid/List pattern
- Modal/Dialog pattern
- API route pattern
- Messages/i18n pattern
- Chart component example
- Complete page example
- CSS Module example
- Navigation pattern

**Read this for**: Copy-paste patterns and understanding how to code in this codebase.

---

### 4. CLAUDE.md (Already exists in repo - 21 KB)
**Official development guide for this project** (created by the team)

Covers:
- Niteshift sandbox setup (dev server already running)
- Tech stack overview
- UI component architecture
- Data fetching patterns
- State management
- Custom hooks reference
- Internationalization
- Styling approach
- Common UI patterns
- Page structure
- Tips for rapid prototyping

**Read this for**: Official development guidelines and rapid prototyping tips.

---

## Key Technical Details

| Aspect | Value |
|--------|-------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript 5.9 |
| **React** | React 19 |
| **UI Components** | @umami/react-zen (custom) |
| **State Management** | Zustand + React Query |
| **Database** | PostgreSQL (Prisma) + optional ClickHouse |
| **Styling** | CSS Modules + CSS Variables (90% from component library) |
| **Internationalization** | react-intl with 400+ messages |
| **Charts** | Chart.js + react-spring |
| **Dashboard Route** | `/dashboard` |
| **Dev Server** | Running on localhost:3001 |

---

## Dashboard Status

### Current State
- Location: `/root/umami/src/app/(main)/dashboard/`
- Route: `http://localhost:3001/dashboard`
- Files: `page.tsx` (SSR wrapper) + `DashboardPage.tsx` (Client)
- Content: Minimal - just a header with "Dashboard" title
- Purpose: Appears to be intentional blank canvas awaiting implementation

### Current Implementation
```tsx
<PageBody>
  <Column margin="2">
    <PageHeader title="Dashboard" />
  </Column>
</PageBody>
```

### Proposed (For Variants)
```tsx
<PageBody>
  <Column margin="2">
    <PageHeader title="Dashboard">
      <VariantSelector />
    </PageHeader>
    
    {/* Conditional rendering based on selected variant */}
    {variant === 'baseline' && <BaselineVariant />}
    {variant === 'ecommerce' && <EcommerceVariant />}
    {variant === 'saas' && <SaaSVariant />}
    // ... etc
  </Column>
</PageBody>
```

---

## Navigation Structure

### Sidebar Navigation Items
1. **Websites** (`/websites`) - Main analytics area
2. **Links** (`/links`) - Short link tracking
3. **Pixels** (`/pixels`) - Pixel tracking

### Feature Areas
- **Websites**: List of tracked websites
- **Website Analytics**: Dashboard for individual website (`/websites/[id]`)
  - Real-time tracking
  - Sessions & Events
  - Funnels, Revenue, Attribution reports
  - Retention & Cohorts
- **Custom Boards**: `/boards`
- **Admin**: Users, teams, websites
- **Settings**: Profile, preferences, team management

---

## Component Architecture

### Component Hierarchy
```
@umami/react-zen (30+ built-in)
    ├─ Layout: Row, Column, Grid, Sidebar
    ├─ Forms: Form, TextField, Select, Checkbox
    ├─ Buttons: Button, ActionButton, IconButton
    └─ Display: Modal, Dropdown, Menu, Tabs, Banner
        
Custom Components (/src/components/common/ - 26 components)
    ├─ PageBody (main container)
    ├─ PageHeader (title + actions)
    ├─ Panel (card containers)
    ├─ DataGrid (lists)
    └─ ... (forms, empty states, etc)

Feature-Specific Components
    ├─ /src/components/input/ (form inputs)
    ├─ /src/components/charts/ (visualizations)
    ├─ /src/components/metrics/ (KPI displays)
    └─ /src/components/boards/ (dashboard boards)
```

### Page Layout Pattern
All main pages follow this consistent structure:
```tsx
<PageBody>
  <Column margin="2">
    <PageHeader title="..." description="..." icon={...}>
      {/* Action buttons */}
    </PageHeader>
    
    {/* Content sections using Panel */}
    <Panel>...</Panel>
    <Panel>...</Panel>
  </Column>
</PageBody>
```

---

## Data Fetching Patterns

### Pattern 1: Pre-built Query Hooks (Recommended)
```typescript
import { useWebsiteMetricsQuery } from '@/components/hooks/queries/useWebsiteMetricsQuery';

const { data, isLoading } = useWebsiteMetricsQuery(websiteId, { dateRange: '7d' });
```

**Available hooks**: useWebsitesQuery, useUsersQuery, useReportsQuery, useTeamsQuery, and 20+ more

### Pattern 2: Custom API Calls
```typescript
import { useApi } from '@/components/hooks';
import { useQuery } from '@tanstack/react-query';

const { get } = useApi();
const { data, isLoading } = useQuery({
  queryKey: ['data'],
  queryFn: () => get('/api/endpoint'),
});
```

---

## State Management

### Zustand Stores (/src/store/)
- **app.ts**: Global state (user, locale, theme, timezone, config)
- **dashboard.ts**: Dashboard state (showCharts, limit, websiteOrder, editing)
- **websites.ts**: Website-specific state
- **cache.ts**: Cache management
- **version.ts**: Version checking

### Recommended Store Extension for Variants
Extend `/src/store/dashboard.ts`:
```typescript
{
  showCharts: true,
  limit: 10,
  websiteOrder: [],
  websiteActive: [],
  editing: false,
  // NEW FOR VARIANTS:
  selectedVariant: 'baseline' | 'ecommerce' | 'saas' | 'content' | 'conversion',
  variantSettings: { ... variant-specific config ... }
}
```

---

## Use Cases & Personas Status

### IMPORTANT: NOT YET IMPLEMENTED

The codebase currently has:
- No predefined use case variants
- No persona definitions
- No variant-specific dashboard layouts

### Potential Variants (Could be Implemented)

Based on existing platform features:

1. **E-Commerce Analytics**
   - Focus: Revenue, conversion funnels, product performance
   - Key metrics: AOV, conversion rate, revenue, top products
   - Key reports: Revenue, Funnels, Attribution

2. **SaaS Product Analytics**
   - Focus: User retention, feature adoption, growth
   - Key metrics: Churn rate, retention cohorts, DAU/MAU, feature usage
   - Key reports: Retention, Cohorts, Events, User segments

3. **Content Analytics**
   - Focus: Page performance, engagement, referrers
   - Key metrics: Page views, time on page, bounce rate, top referrers
   - Key reports: Pages, Referrers, Engagement metrics

4. **Conversion Optimization**
   - Focus: Funnel analysis, attribution, user paths
   - Key metrics: Conversion rate, drop-off, attribution credit
   - Key reports: Funnels, Attribution, UTM tracking, User journeys

5. **Marketing Analytics**
   - Focus: Campaign tracking, UTM parameters, attribution
   - Key metrics: Campaign performance, channel attribution, conversion value
   - Key reports: UTM, Attribution, Campaign analysis

---

## Implementation Roadmap for Variants

### Phase 1: Store & Configuration
1. Extend `/src/store/dashboard.ts` with variant state
2. Create `/src/app/(main)/dashboard/usecase/variants.config.ts`
3. Define available variants and their metadata

### Phase 2: Core Components
1. Create `/src/app/(main)/dashboard/variants/` directory
2. Create variant components:
   - `BaselineVariant.tsx` (default experience)
   - `EcommerceVariant.tsx`
   - `SaaSVariant.tsx`
   - `ContentVariant.tsx`
   - `ConversionVariant.tsx`

### Phase 3: Shared Sections
1. Create `/src/app/(main)/dashboard/sections/` directory
2. Create reusable section components:
   - `MetricsSection.tsx`
   - `ChartSection.tsx`
   - `RecentActivitySection.tsx`
   - `TopDataSection.tsx`

### Phase 4: UI & Selection
1. Create `VariantSelector.tsx` component
2. Update `DashboardPage.tsx` to use variant logic
3. Add variant selector to page header

### Phase 5: Data & Hooks
1. Create variant-specific data hooks if needed
2. Update queries to filter/transform based on variant
3. Customize metrics and charts per variant

---

## Key File Locations

### Core Dashboard
- `/root/umami/src/app/(main)/dashboard/page.tsx` - Server component
- `/root/umami/src/app/(main)/dashboard/DashboardPage.tsx` - Client component

### Layout & Navigation
- `/root/umami/src/app/(main)/App.tsx` - Main app layout
- `/root/umami/src/app/(main)/SideNav.tsx` - Sidebar navigation
- `/root/umami/src/app/(main)/TopNav.tsx` - Top navigation

### Components
- `/root/umami/src/components/common/` - 26 shared UI components
- `/root/umami/src/components/input/` - Form components
- `/root/umami/src/components/charts/` - Chart components
- `/root/umami/src/components/metrics/` - Analytics displays

### State & Data
- `/root/umami/src/store/app.ts` - Global state
- `/root/umami/src/store/dashboard.ts` - Dashboard state (modify for variants)
- `/root/umami/src/components/hooks/` - Custom hooks (30+ hooks)
- `/root/umami/src/components/hooks/queries/` - Pre-built query hooks

### Styles
- `/root/umami/src/styles/global.css` - Global styles
- `/root/umami/src/styles/variables.css` - CSS variables
- Primary color: `#147af3` (Blue)

---

## Development Setup

### Already Running
- Dev server on `http://localhost:3001` (hot reload enabled)
- Database: PostgreSQL (configured and migrated)
- All dependencies installed (pnpm)
- Environment variables: `.env` file exists

### Default Credentials
- Username: `admin`
- Password: `umami`

### Common Commands
```bash
pnpm dev              # Dev server (already running)
pnpm lint             # ESLint check
pnpm test             # Jest tests
pnpm build-db-client  # Regenerate Prisma after schema changes
```

---

## Next Steps for Your Project

### 1. Review the Documentation
- Start with **DASHBOARD_STRUCTURE.md** for overall understanding
- Review **ARCHITECTURE_DIAGRAMS.md** for visual data flow
- Study **CODE_EXAMPLES.md** for patterns and examples

### 2. Understand Current Implementation
- Examine `/root/umami/src/app/(main)/dashboard/DashboardPage.tsx`
- Look at `/root/umami/src/store/dashboard.ts`
- Review example pages like `/root/umami/src/app/(main)/websites/[websiteId]/WebsitePage.tsx`

### 3. Define Your Variants
- Decide which use case variants to implement
- Define what metrics/sections each variant needs
- Plan data fetching strategy per variant

### 4. Extend the Store
- Add `selectedVariant` and `variantSettings` to dashboard store
- Create setter functions for variant management

### 5. Create Components
- Create variant component files in `/src/app/(main)/dashboard/variants/`
- Create reusable section components in `/src/app/(main)/dashboard/sections/`
- Implement conditional rendering in `DashboardPage.tsx`

### 6. Test & Refine
- Test variant selection and persistence
- Verify data fetching per variant
- Check responsive design across breakpoints

---

## Quick Reference: Important Links

- **Dashboard Route**: `/dashboard` (http://localhost:3001/dashboard)
- **Component Library Docs**: @umami/react-zen (30+ built-in components)
- **State Store Location**: `/src/store/dashboard.ts` (modify here)
- **Custom Hooks**: `/src/components/hooks/` (30+ hooks available)
- **Messages/i18n**: `/src/components/messages.ts` (400+ labels)
- **Development Guide**: `/root/umami/CLAUDE.md` (official guide)

---

## Support Files in This Repository

1. **DASHBOARD_STRUCTURE.md** (17 KB)
   - Comprehensive structure analysis
   - Location: `/root/umami/DASHBOARD_STRUCTURE.md`

2. **ARCHITECTURE_DIAGRAMS.md** (16 KB)
   - Visual diagrams and data flow
   - Location: `/root/umami/ARCHITECTURE_DIAGRAMS.md`

3. **CODE_EXAMPLES.md** (16 KB)
   - Patterns and code examples
   - Location: `/root/umami/CODE_EXAMPLES.md`

4. **CLAUDE.md** (21 KB - Already exists)
   - Official development guide
   - Location: `/root/umami/CLAUDE.md`

---

## Summary

You now have:
- Complete understanding of the dashboard structure
- Knowledge of the tech stack and architecture
- Patterns and examples for implementation
- Clear roadmap for implementing use case variants
- All necessary file locations and references

The foundation is strong. You're ready to implement dashboard variants!

---

**Documentation Created**: November 19, 2025  
**Status**: Complete and Ready for Implementation  
**Total Documentation**: ~70 KB across 4 files
