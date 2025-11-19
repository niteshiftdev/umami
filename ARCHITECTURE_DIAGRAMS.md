# Umami Dashboard Architecture Diagram

## Application Structure Hierarchy

```
http://localhost:3001
│
├─ Root Layout (src/app/layout.tsx)
│  └─ Providers (ZenProvider, IntlProvider, QueryClientProvider, ErrorBoundary)
│     └─ App Layout (src/app/(main)/App.tsx)
│        │
│        ├─ MobileNav (xs only)
│        ├─ SideNav (lg+)
│        │  ├─ Logo
│        │  ├─ NavButton (Team/User selector)
│        │  ├─ Navigation Links
│        │  │  ├─ Websites (/websites)
│        │  │  ├─ Links (/links)
│        │  │  └─ Pixels (/pixels)
│        │  └─ Language & Theme Buttons
│        │
│        └─ Main Content Area
│           ├─ Dashboard (/dashboard) ← MINIMALIST (Header only)
│           ├─ Websites (/websites)
│           │  ├─ Website List
│           │  └─ [websiteId] Dashboard
│           │     ├─ Realtime (/realtime)
│           │     ├─ Sessions (/sessions)
│           │     ├─ Events (/events)
│           │     ├─ Compare (/compare)
│           │     ├─ Cohorts (/cohorts)
│           │     ├─ Segments (/segments)
│           │     └─ Reports (/reports)
│           │        ├─ Funnels
│           │        ├─ Revenue
│           │        ├─ Attribution
│           │        ├─ UTM
│           │        ├─ Journeys
│           │        ├─ Retention
│           │        └─ Breakdown
│           ├─ Boards (/boards)
│           ├─ Links (/links)
│           ├─ Pixels (/pixels)
│           ├─ Admin (/admin)
│           │  ├─ Teams
│           │  ├─ Users
│           │  └─ Websites
│           └─ Settings (/settings)
│              ├─ Profile
│              ├─ Preferences
│              └─ Teams
```

---

## Dashboard Page Component Hierarchy

```
DashboardPage (currently minimal)
│
└─ PageBody (max-width: 1320px, centered, paddingBottom: 6)
   └─ Column (margin: 2)
      └─ PageHeader
         ├─ title: "Dashboard"
         └─ (empty right side - action area)


PROPOSED STRUCTURE FOR VARIANTS:
═════════════════════════════════

DashboardPage
│
├─ Load variant preference from store (useDashboard)
│
└─ PageBody
   └─ Column
      ├─ PageHeader
      │  ├─ title: "Dashboard"
      │  └─ VariantSelector / SettingsButton
      │
      └─ {Variant Component}
         ├─ BaselineVariant (default)
         │  ├─ MetricCards (overview metrics)
         │  ├─ Chart (visitor trends)
         │  └─ Recent Activity
         │
         ├─ EcommerceVariant
         │  ├─ RevenueMetrics
         │  ├─ ConversionFunnel
         │  ├─ ProductPerformance
         │  └─ TopCampaigns
         │
         ├─ SaaSVariant
         │  ├─ CohortRetention
         │  ├─ EventAnalytics
         │  ├─ UserGrowth
         │  └─ FeatureAdoption
         │
         ├─ ContentVariant
         │  ├─ PageViews
         │  ├─ ReferrerAnalysis
         │  ├─ EngagementMetrics
         │  └─ TopPages
         │
         └─ ConversionVariant
            ├─ FunnelAnalysis
            ├─ AttributionModel
            ├─ UTMTracking
            └─ ConversionPaths
```

---

## Component Architecture Overview

```
COMPONENT LAYERS:
═════════════════

┌──────────────────────────────────────────────┐
│ Page Layer (Next.js)                         │
├──────────────────────────────────────────────┤
│ - src/app/(main)/[feature]/page.tsx (SSR)   │
│ - Passes params, handles metadata            │
│ - Renders Page Component                     │
└──────────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────┐
│ Page Component Layer (Client)                │
├──────────────────────────────────────────────┤
│ - src/app/(main)/[feature]/[Feature]Page.tsx│
│ - 'use client' directive                     │
│ - Handles page-level state & effects         │
│ - Composes sections & panels                 │
└──────────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────┐
│ Layout Components (@umami/react-zen)        │
├──────────────────────────────────────────────┤
│ PageBody, PageHeader, Panel, Column, Row    │
└──────────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────┐
│ Feature Components & UI Components          │
├──────────────────────────────────────────────┤
│ Charts, Metrics, Tables, Forms               │
│ (@umami/react-zen + @/components/*)          │
└──────────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────┐
│ Data Layer (Hooks)                          │
├──────────────────────────────────────────────┤
│ useApi(), useQuery hooks, useNavigation()   │
│ React Query + Zustand                        │
└──────────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────┐
│ Backend (API Routes + Database)              │
├──────────────────────────────────────────────┤
│ src/app/api/*, Prisma, PostgreSQL/ClickHouse│
└──────────────────────────────────────────────┘
```

---

## Data Flow Example: Dashboard Variant Display

```
User Navigate to /dashboard
         ↓
Page Component Renders
         ↓
useEffect: Check for variant selection
         ↓
Zustand Store (useDashboard)
    {
      variant: 'ecommerce',    // or 'saas', 'content', etc.
      showCharts: true,
      limit: 10,
      websiteOrder: [...],
      editing: false
    }
         ↓
Switch/Render VariantComponent
    - EcommerceVariant
    - SaaSVariant
    - etc.
         ↓
Each Variant:
    ├─ Query data (useWebsiteMetricsQuery, etc.)
    ├─ Transform for variant display
    └─ Render custom layout
         ↓
Components: MetricCards, Charts, Tables
    using @umami/react-zen + custom styles
         ↓
User sees relevant dashboard
```

---

## Key Component Locations Map

```
/src/components/
│
├─ common/               ← Layout & Page Structure
│  ├─ PageBody          ← Main container
│  ├─ PageHeader        ← Title, description, actions
│  ├─ Panel             ← Card containers
│  ├─ DataGrid          ← Lists with pagination
│  ├─ LoadingPanel      ← Loading states
│  ├─ EmptyPlaceholder  ← Empty states
│  └─ ... (20+ components)
│
├─ input/               ← Form & Input Components
│  ├─ DateFilter
│  ├─ WebsiteSelect
│  ├─ NavButton
│  ├─ PanelButton
│  └─ ... (form components)
│
├─ charts/              ← Chart Components
│  ├─ BarChart
│  ├─ LineChart
│  └─ ... (chart variations)
│
├─ metrics/             ← Analytics Display
│  ├─ MetricCard
│  ├─ StatsTable
│  └─ ... (metric displays)
│
├─ boards/              ← Dashboard Board Components
│  └─ ... (board-specific components)
│
└─ hooks/               ← Custom Hooks
   ├─ useMessages()     ← i18n
   ├─ useApi()          ← API calls
   ├─ useFormat()       ← Formatting
   ├─ useNavigation()   ← Navigation helpers
   ├─ queries/          ← Pre-built query hooks
   │  ├─ useWebsitesQuery()
   │  ├─ useWebsiteMetricsQuery()
   │  ├─ useUsersQuery()
   │  └─ ... (20+ query hooks)
   └─ ... (other hooks)
```

---

## Store State Architecture

```
Zustand Stores (/src/store/)
│
├─ app.ts (Global State)
│  ├─ locale
│  ├─ theme
│  ├─ timezone
│  ├─ dateRangeValue
│  ├─ user
│  ├─ config
│  └─ shareToken
│
├─ dashboard.ts (Dashboard-specific)
│  ├─ showCharts
│  ├─ limit (website display limit)
│  ├─ websiteOrder (custom ordering)
│  ├─ websiteActive (selected websites)
│  ├─ editing (edit mode toggle)
│  └─ isEdited (dirty flag)
│     ↑
│     └─ IDEAL LOCATION FOR VARIANT SELECTION:
│        ├─ selectedVariant: 'baseline' | 'ecommerce' | 'saas' | ...
│        └─ variantSettings: { ... variant-specific config ... }
│
├─ websites.ts (Website State)
│  └─ ... (website-specific data)
│
├─ cache.ts (Cache Management)
│  └─ ... (cache operations)
│
└─ version.ts (Version Checking)
   └─ ... (version data)
```

---

## API & Data Fetching Pattern

```
Component (Page/Section)
    ↓
Hook Layer
    ├─ Pre-built Query Hook (e.g., useWebsiteMetricsQuery)
    │  └─ Internally uses useApi() + useQuery()
    │
    └─ Custom Hook (useApi + useQuery/useMutation)
       └─ { get, post, put, delete }
    ↓
React Query (TanStack Query)
    ├─ queryKey: Caches results
    ├─ queryFn: Fetches data
    ├─ staleTime: 1 minute default
    └─ refetchOnWindowFocus: disabled
    ↓
API Route (/src/app/api/)
    ├─ parseRequest()  ← Parse & validate
    ├─ checkAuth()     ← Authorization
    ├─ Business Logic  ← Process data
    └─ json()          ← Return response
    ↓
Database Layer
    ├─ Prisma Client (PostgreSQL)
    ├─ Raw SQL Queries
    └─ ClickHouse (optional)
    ↓
Response Cache (React Query)
    └─ Available to components
```

---

## Styling System

```
UMAMI STYLING APPROACH:
═════════════════════════

    Component-First
         ↓
    @umami/react-zen
    (Custom Component Library)
         ↓
    ├─ Provides 90% of styling
    ├─ Built-in responsive props
    ├─ Theme support (light/dark)
    └─ CSS Variable integration
         ↓
    Custom CSS (10%) - Only when needed
    ├─ CSS Modules (.module.css)
    ├─ Global styles (/src/styles/)
    └─ CSS Variables (/src/styles/variables.css)
         ↓
    Primary Color: #147af3
    Font: Inter
    Responsive: xs, sm, md, lg, xl, xxl


EXAMPLE: Using Responsive Props
═════════════════════════════════

<Column 
  paddingX={{ xs: '3', md: '6' }}              // Padding X-axis
  paddingY={{ xs: '2', lg: '4' }}              // Padding Y-axis
  gap={{ xs: '2', md: '4' }}                   // Gap between children
  marginBottom="6"                              // Fixed margin
  display={{ xs: 'block', lg: 'grid' }}        // Responsive display
  columns={{ xs: '1fr', lg: 'auto 1fr' }}      // Grid columns
  width={{ xs: '100%', lg: '80%' }}            // Responsive width
>
  {/* Content */}
</Column>

Breakpoints applied at:
  xs: 0px     (default/mobile)
  sm: 576px
  md: 768px
  lg: 992px   (typical desktop)
  xl: 1200px
  xxl: 1400px
```

---

## Current vs. Proposed Dashboard State

```
CURRENT STATE (Before Variants):
═════════════════════════════════
/dashboard
    └─ DashboardPage
       └─ PageBody
          └─ Column
             └─ PageHeader with title only
                (No content, waiting for implementation)


PROPOSED STATE (With Variants):
═══════════════════════════════════
/dashboard
    └─ DashboardPage
       ├─ Load variant from useDashboard store
       ├─ Render VariantSelector UI
       │
       └─ PageBody
          └─ Column
             ├─ PageHeader
             │  ├─ title: "Dashboard"
             │  └─ variant settings button
             │
             └─ Conditional Rendering:
                ├─ if variant === 'baseline'    → BaselineVariant
                ├─ if variant === 'ecommerce'   → EcommerceVariant
                ├─ if variant === 'saas'        → SaaSVariant
                ├─ if variant === 'content'     → ContentVariant
                └─ if variant === 'conversion'  → ConversionVariant
```

---

## Key Implementation Files

```
IMPLEMENTATION ROADMAP FOR VARIANTS:
═════════════════════════════════════

1. STORE MODIFICATIONS:
   └─ /src/store/dashboard.ts
      └─ Add: selectedVariant, variantSettings
      └─ Add: setVariant() function

2. CONFIG FILE (NEW):
   └─ /src/app/(main)/dashboard/usecase/
      └─ variants.config.ts
         ├─ Define available variants
         ├─ Variant metadata (name, description, icon)
         └─ Default settings per variant

3. HOOK (NEW):
   └─ /src/app/(main)/dashboard/usecase/
      └─ useUseCaseSelection.ts
         ├─ Get selected variant
         ├─ Change variant
         └─ Reset to default

4. COMPONENTS (NEW):
   └─ /src/app/(main)/dashboard/
      ├─ VariantSelector.tsx (new)
      ├─ variants/
      │  ├─ BaselineVariant.tsx (new)
      │  ├─ EcommerceVariant.tsx (new)
      │  ├─ SaaSVariant.tsx (new)
      │  ├─ ContentVariant.tsx (new)
      │  ├─ ConversionVariant.tsx (new)
      │  └─ VariantLayout.tsx (shared wrapper)
      └─ sections/ (reusable sections)
         ├─ MetricsSection.tsx
         ├─ ChartSection.tsx
         ├─ RecentActivitySection.tsx
         └─ ... (other sections)

5. MAIN PAGE:
   └─ /src/app/(main)/dashboard/DashboardPage.tsx
      └─ Integrate variant logic
      └─ Conditional rendering
```

