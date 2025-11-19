# Umami Project Exploration - Documentation Index

## Overview

This directory contains comprehensive documentation about the Umami analytics platform structure, specifically focused on understanding and creating homepage engagement variations.

## Available Documentation

### 1. EXPLORATION_SUMMARY.md (START HERE)
**Location**: `/root/umami/EXPLORATION_SUMMARY.md`
**Length**: ~306 lines
**Purpose**: Executive summary with quick stats and key findings
**Contains**:
- Quick answers to all 6 exploration questions
- File statistics and components overview
- Recommendations for creating variations
- Next steps and resources

**When to read**: First - to get the big picture

---

### 2. PROJECT_STRUCTURE_ANALYSIS.md (COMPREHENSIVE)
**Location**: `/root/umami/PROJECT_STRUCTURE_ANALYSIS.md`
**Length**: ~652 lines  
**Purpose**: Complete deep-dive analysis of the entire project
**Contains**:
1. Tech stack details (dependencies, versions)
2. Full directory structure with descriptions
3. Homepage layout and hierarchy
4. Design system (colors, themes, typography)
5. Data visualization implementation
6. Engagement/analytics data displayed
7. API and data flow architecture
8. Responsive design system
9. Key files for customization
10. Build and deployment information

**When to read**: For comprehensive understanding of all systems

---

### 3. HOMEPAGE_COMPONENTS_GUIDE.md (QUICK REFERENCE)
**Location**: `/root/umami/HOMEPAGE_COMPONENTS_GUIDE.md`
**Length**: ~273 lines
**Purpose**: Quick reference guide for homepage components
**Contains**:
- Homepage file locations
- Component hierarchy diagram (ASCII art)
- Key component props and data flow
- Metrics being displayed (table format)
- Design system integration
- Custom hooks usage
- State management patterns
- Styling approach
- Animation and accessibility
- Performance optimizations
- Common modification points

**When to read**: For quick lookups and common tasks

---

### 4. CRITICAL_FILES_FOR_VARIATIONS.md (DEVELOPER GUIDE)
**Location**: `/root/umami/CRITICAL_FILES_FOR_VARIATIONS.md`
**Length**: ~324 lines
**Purpose**: Detailed guide for creating homepage variations
**Contains**:
- Absolute file paths for all critical files
- Main homepage components
- Chart and visualization components
- Metric and card components
- Data query hooks (48+ hooks)
- UI state hooks (20+ hooks)
- Design system and styles files
- Global setup files
- Key data structures (TypeScript interfaces)
- Development workflow (7 steps)
- Key concepts for variations
- Common customization tasks with code examples
- Performance considerations
- Testing checklist

**When to read**: When actually implementing variations

---

## Quick Navigation by Task

### "I want to understand the overall structure"
→ Read: **EXPLORATION_SUMMARY.md** (5 min)
→ Then: **PROJECT_STRUCTURE_ANALYSIS.md** section 2 (10 min)

### "I need to modify the homepage layout"
→ Read: **HOMEPAGE_COMPONENTS_GUIDE.md** (10 min)
→ Then: **CRITICAL_FILES_FOR_VARIATIONS.md** sections "Reorder Panels" (5 min)

### "I need to change colors/theme"
→ Read: **PROJECT_STRUCTURE_ANALYSIS.md** section 4 (5 min)
→ Then: **CRITICAL_FILES_FOR_VARIATIONS.md** sections "Change Color Scheme" (5 min)

### "I need to add a new metric card"
→ Read: **HOMEPAGE_COMPONENTS_GUIDE.md** "To Add a New Metric Card" (5 min)
→ Then: **CRITICAL_FILES_FOR_VARIATIONS.md** "Modify Metric Cards" (10 min)

### "I need to create a new dashboard variant"
→ Read: **CRITICAL_FILES_FOR_VARIATIONS.md** "Development Workflow for Variations" (15 min)
→ Follow the 7-step process

### "I need to understand the data flow"
→ Read: **PROJECT_STRUCTURE_ANALYSIS.md** section 7 (10 min)
→ Then: **HOMEPAGE_COMPONENTS_GUIDE.md** "Data Queries" (5 min)

---

## File Structure Reference

```
/root/umami/
├── DOCUMENTATION_INDEX.md (this file)
├── EXPLORATION_SUMMARY.md (START HERE)
├── PROJECT_STRUCTURE_ANALYSIS.md (comprehensive)
├── HOMEPAGE_COMPONENTS_GUIDE.md (quick ref)
├── CRITICAL_FILES_FOR_VARIATIONS.md (dev guide)
│
├── src/
│   ├── app/(main)/websites/[websiteId]/
│   │   ├── WebsitePage.tsx (MAIN FILE)
│   │   ├── WebsiteMetricsBar.tsx
│   │   ├── WebsitePanels.tsx
│   │   ├── WebsiteChart.tsx
│   │   └── WebsiteControls.tsx
│   ├── components/
│   │   ├── charts/
│   │   ├── metrics/
│   │   ├── common/
│   │   └── hooks/
│   ├── lib/
│   │   ├── constants.ts (THEME COLORS)
│   │   ├── colors.ts
│   │   └── ...
│   └── styles/
│       ├── global.css
│       └── variables.css
│
├── package.json (dependencies)
└── next.config.ts (build config)
```

---

## Key Concepts Explained

### Component Hierarchy
The homepage (WebsitePage) is composed of:
1. WebsiteControls - Top control bar
2. WebsiteMetricsBar - 5 KPI cards
3. WebsiteChart - Time series visualization
4. WebsitePanels - 6 data panel sections
5. ExpandedViewModal - Optional expanded view

### Data Flow
```
Component (e.g., WebsiteMetricsBar)
    ↓
Custom Hook (e.g., useWebsiteStatsQuery)
    ↓
React Query (caching, fetching)
    ↓
API Endpoint (e.g., /websites/[websiteId]/stats)
    ↓
Database (Prisma → PostgreSQL/ClickHouse)
    ↓
UI Display (Metric Cards, Charts, Tables)
```

### State Management
- **Global**: Zustand (date range, filters, user prefs)
- **Server**: React Query (API data, caching)
- **Local**: React useState (UI state, modals)

### Styling Approach
- **Design System**: @umami/react-zen components
- **Props**: Responsive values (xs, sm, md, lg, xl)
- **CSS**: Custom properties + CSS modules (limited use)
- **Colors**: Theme system with light/dark support

---

## Common File Paths

### Most Important Files
```
/root/umami/src/app/(main)/websites/[websiteId]/WebsitePage.tsx
/root/umami/src/app/(main)/websites/[websiteId]/WebsiteMetricsBar.tsx
/root/umami/src/app/(main)/websites/[websiteId]/WebsitePanels.tsx
/root/umami/src/lib/constants.ts (colors)
/root/umami/src/components/metrics/MetricCard.tsx
```

### For Data Fetching
```
/root/umami/src/components/hooks/queries/useWebsiteStatsQuery.ts
/root/umami/src/components/hooks/queries/useWebsitePageviewsQuery.ts
/root/umami/src/components/hooks/useDateRange.ts
```

### For Styling
```
/root/umami/src/styles/global.css
/root/umami/src/styles/variables.css
/root/umami/src/lib/colors.ts
```

---

## Technology Stack Summary

**Frontend Framework**
- Next.js 15.5.3
- React 19.2.0
- TypeScript 5.9.3

**UI & Styling**
- @umami/react-zen (design system)
- CSS Modules + PostCSS
- CSS Custom Properties

**Visualizations**
- Chart.js 4.5.1
- react-simple-maps
- @react-spring/web (animations)

**State & Data**
- TanStack React Query
- Zustand
- Immer

**Internationalization**
- react-intl

**Backend**
- Node.js
- Prisma 6.18.0 (ORM)
- PostgreSQL
- ClickHouse (analytics)
- Redis (caching)
- Kafka (messaging)

---

## Development Quick Start

### Prerequisites
- Node.js 18+
- pnpm 10.22.0+
- PostgreSQL
- ClickHouse (optional for development)

### Setup
```bash
cd /root/umami
pnpm install
npm run dev              # Start on port 3001
```

### Key Commands
```bash
npm run build           # Build for production
npm run start          # Run production server
npm run lint           # Lint code
npm test              # Run tests
npm run build-icons   # Generate icon components
```

---

## Documentation Statistics

| Document | Lines | Focus | Audience |
|----------|-------|-------|----------|
| EXPLORATION_SUMMARY.md | 306 | Overview | Everyone |
| PROJECT_STRUCTURE_ANALYSIS.md | 652 | Comprehensive | Developers |
| HOMEPAGE_COMPONENTS_GUIDE.md | 273 | Quick Ref | Developers |
| CRITICAL_FILES_FOR_VARIATIONS.md | 324 | Practical | Implementation |
| **Total** | **1,555** | **Complete** | **All Levels** |

---

## Support & Troubleshooting

### Common Questions

**Q: Where do I start?**
A: Read EXPLORATION_SUMMARY.md first

**Q: How do I change colors?**
A: See PROJECT_STRUCTURE_ANALYSIS.md section 4 or CRITICAL_FILES_FOR_VARIATIONS.md "Change Color Scheme"

**Q: How do I modify the layout?**
A: See HOMEPAGE_COMPONENTS_GUIDE.md "To Modify Layout" or CRITICAL_FILES_FOR_VARIATIONS.md "Reorder Panels"

**Q: What files should I edit for a new variation?**
A: Check CRITICAL_FILES_FOR_VARIATIONS.md "Key Files" section

**Q: How do I test my changes?**
A: Run `npm run dev` and navigate to http://localhost:3001

---

## Next Steps

1. **Read** EXPLORATION_SUMMARY.md (5 minutes)
2. **Understand** the component structure from HOMEPAGE_COMPONENTS_GUIDE.md (10 minutes)
3. **Plan** your variation requirements
4. **Reference** CRITICAL_FILES_FOR_VARIATIONS.md while implementing
5. **Test** locally with `npm run dev`
6. **Build** and deploy with `npm run build`

---

## Document Versions

- **Created**: 2025-11-19
- **Project**: Umami v3.0.0
- **Next.js**: 15.5.3
- **React**: 19.2.0
- **TypeScript**: 5.9.3

All documentation uses absolute paths for easy navigation and reference.

---

## Questions?

Refer to the appropriate documentation:
- **"What?"** → EXPLORATION_SUMMARY.md
- **"How?"** → HOMEPAGE_COMPONENTS_GUIDE.md
- **"Why?"** → PROJECT_STRUCTURE_ANALYSIS.md
- **"Show me"** → CRITICAL_FILES_FOR_VARIATIONS.md

