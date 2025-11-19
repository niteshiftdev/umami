# Umami Homepage Variations

This directory contains four distinct homepage layouts, each optimized for different user journeys and personas in the Umami analytics platform.

## Overview

The variations focus on delivering the right information at the right time, based on user goals and experience level:

| Variation | Target User | Primary Goal | Key Focus |
|-----------|------------|--------------|-----------|
| **Analytics-First** | Data analysts, PMs, Marketers | Analyze data quickly | Metrics, Reports, Dashboards |
| **Privacy-Focused** | Privacy teams, Compliance officers | Ensure compliance | Privacy features, Data control |
| **Getting-Started** | New users | Onboarding | Education, Setup, Feature discovery |
| **Team/Enterprise** | Teams, Agencies | Manage multiple sites | Collaboration, Permissions, Organization |

---

## 1. Analytics-First Homepage

**File:** `AnalyticsFirstHomepage.tsx`

### Target User
- Active data analysts
- Product managers
- Marketing professionals
- Users who spend significant time in the platform

### User Journey
1. See aggregated metrics across all websites
2. Quickly identify top-performing sites
3. Jump directly to analytics dashboards
4. Create advanced reports and segments
5. Share findings with stakeholders

### Key Components
- **Quick Overview Stats**: Total visitors, page views, bounce rate, avg session duration
- **Top Performing Sites Table**: Detailed metrics per site with quick-access buttons
- **Recent Reports**: Quick links to previously created reports
- **Quick Actions Grid**: Buttons for common advanced workflows (Funnel, Segment, Custom Report)

### Layout Strategy
- Emphasizes data presentation with tables and grids
- Multiple CTAs for advanced features
- Shows aggregated metrics upfront
- Minimal explanation text (assumes user knowledge)

### Typical Workflow
```
Home → View Quick Stats → Click "Analytics" → Deep dive into site data → Create Report
```

### Real Data Integration
```typescript
// Replace mock data with:
const { data: websites } = useWebsitesQuery();
const { data: metrics } = useWebsiteMetricsQuery({ dateRange });
const { data: reports } = useReportsQuery();
```

---

## 2. Privacy-Focused Homepage

**File:** `PrivacyFocusedHomepage.tsx`

### Target User
- Privacy-conscious website owners
- Compliance officers (GDPR, CCPA)
- Legal teams
- Organizations with strict data policies
- Consultants helping with compliance

### User Journey
1. Verify privacy and compliance status
2. Review data retention and deletion policies
3. Manage consent and user preferences
4. Audit tracking compliance
5. Generate compliance reports

### Key Components
- **Privacy Compliance Banner**: Status overview with compliance report link
- **Privacy & Compliance Grid**: Feature cards highlighting privacy protections
- **Data Management Section**: Retention period, third-party integration status
- **Sites Privacy Status Table**: Per-site compliance verification
- **Settings & Configuration List**: Privacy-specific settings
- **Resources Section**: Privacy guides, policy templates, expert support

### Layout Strategy
- Emphasizes trust and transparency
- Highlights privacy features prominently
- Provides compliance documentation and resources
- Shows audit trails and data management controls
- Uses reassuring messaging and visual design

### Typical Workflow
```
Home → Check Compliance Status → Verify Data Retention → Review Privacy Settings → Generate Audit Report
```

### Real Data Integration
```typescript
// Replace mock data with:
const { data: complianceStatus } = useComplianceStatusQuery();
const { data: privacySettings } = usePrivacySettingsQuery();
const { data: websites } = useWebsitesQuery();
```

---

## 3. Getting-Started Homepage

**File:** `GettingStartedHomepage.tsx`

### Target User
- New users (first login)
- Users without websites configured
- Users during onboarding
- Users who need education on features

### User Journey
1. Understand what Umami does
2. Add first website
3. Install tracking code
4. View first data
5. Learn what features are available
6. Explore advanced capabilities

### Key Components
- **Hero Section**: Welcome message and primary CTA
- **Onboarding Steps**: 3-step setup with input fields and code examples
- **Feature Highlights Grid**: 6-card grid showing what can be tracked
- **FAQ Section**: Common questions with expandable answers
- **Next Steps CTA**: Prominent buttons to continue onboarding

### Layout Strategy
- Progressive disclosure (one step at a time)
- Practical code examples and instructions
- Visual demonstrations of features
- Answering common questions upfront
- Celebratory tone and encouraging messaging

### Typical Workflow
```
Home → Add Website → Copy Code → Install & Wait → See First Data → Explore Features → View Documentation
```

### Real Data Integration
```typescript
// Replace mock data with:
const { data: user } = useUserQuery();
const { data: websites } = useWebsitesQuery();
// Check if user.websites.length === 0 to show this variation
```

### Onboarding State Detection
```typescript
// In src/app/page.tsx or middleware:
const hasWebsites = websites && websites.length > 0;
const isNewUser = user?.createdAt && isWithinLastDay(user.createdAt);

if (!hasWebsites || isNewUser) {
  return redirect('/homepages?variant=getting-started');
}
```

---

## 4. Team/Enterprise Homepage

**File:** `TeamEnterpriseHomepage.tsx`

### Target User
- Team leads and managers
- Agencies managing multiple client sites
- Enterprise administrators
- Users managing shared resources
- Teams with complex permission structures

### User Journey
1. See all team sites and their status
2. Manage team members and permissions
3. Invite new team members
4. Share reports and dashboards
5. Monitor team activity
6. Configure team-level settings

### Key Components
- **Team Overview Stats**: Sites, members, total visitors count
- **Quick Actions**: Team management and creation buttons
- **Team Members Table**: Member list with roles and permissions
- **All Websites Table**: Multi-site view with owner and member avatars
- **Shared Dashboards**: Accessible dashboards and reports
- **Team Settings**: Retention, integrations, privacy settings
- **Activity Feed**: Recent team activities and changes

### Layout Strategy
- Emphasizes collaboration and organization
- Shows multi-site overview with team context
- Highlights permission management
- Activity tracking for audit purposes
- Team-level settings and controls

### Typical Workflow
```
Home → View Team Sites → Invite Member → Manage Permissions → Create Shared Dashboard → Monitor Activity
```

### Real Data Integration
```typescript
// Replace mock data with:
const { data: team } = useTeamQuery();
const { data: websites } = useWebsitesQuery();
const { data: members } = useTeamMembersQuery();
const { data: activity } = useActivityFeedQuery();
```

---

## Implementation Guide

### 1. Feature Flag Setup

Add to `src/store/app.ts` (Zustand store):

```typescript
interface AppState {
  homepageVariant: 'analytics' | 'privacy' | 'getting-started' | 'team' | 'auto';
  setHomepageVariant: (variant: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  homepageVariant: 'auto',
  setHomepageVariant: (variant) => set({ homepageVariant: variant }),
}));
```

### 2. Routing Logic

Update `src/app/page.tsx`:

```typescript
'use client';
import { redirect } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { useAppStore } from '@/store/app';

export default function RootPage() {
  const { user } = useUser();
  const { homepageVariant } = useAppStore();

  // Determine which variant to show
  if (homepageVariant !== 'auto') {
    return redirect(`/homepages?variant=${homepageVariant}`);
  }

  // Auto-detect based on user state
  if (!user?.websites || user.websites.length === 0) {
    return redirect('/homepages?variant=getting-started');
  }

  if (user.role === 'team-admin') {
    return redirect('/homepages?variant=team');
  }

  // Default behavior
  return redirect('/websites');
}
```

### 3. Homepage Router Component

Create `src/app/(main)/homepages/HomepageRouter.tsx`:

```typescript
'use client';
import { useSearchParams } from 'next/navigation';
import { AnalyticsFirstHomepage } from './AnalyticsFirstHomepage';
import { PrivacyFocusedHomepage } from './PrivacyFocusedHomepage';
import { GettingStartedHomepage } from './GettingStartedHomepage';
import { TeamEnterpriseHomepage } from './TeamEnterpriseHomepage';

export function HomepageRouter() {
  const searchParams = useSearchParams();
  const variant = searchParams.get('variant') || 'analytics';

  switch (variant) {
    case 'privacy':
      return <PrivacyFocusedHomepage />;
    case 'getting-started':
      return <GettingStartedHomepage />;
    case 'team':
      return <TeamEnterpriseHomepage />;
    case 'analytics':
    default:
      return <AnalyticsFirstHomepage />;
  }
}
```

### 4. User Preferences

Add to user settings to allow switching between variations:

```typescript
// src/app/(main)/settings/profile/ProfilePage.tsx
<Select
  label="Homepage Layout"
  value={preferences.homepageVariant}
  onChange={(value) => updatePreferences({ homepageVariant: value })}
>
  <Option value="auto">Auto-detect (default)</Option>
  <Option value="analytics">Analytics-First</Option>
  <Option value="privacy">Privacy-Focused</Option>
  <Option value="team">Team/Enterprise</Option>
</Select>
```

### 5. A/B Testing

Using a feature flag service:

```typescript
// In middleware or getServerSideProps
const variant = await getFeatureFlagVariant('homepage_variation', userId);
// Values: 'analytics', 'privacy', 'getting-started', 'team'
// Store in session or cookie for consistent experience
```

---

## Styling

All variations use:

- **Component Library**: `@umami/react-zen` components
- **CSS Module**: `Homepages.module.css` for custom styling
- **CSS Variables**: Existing Umami brand colors and typography
- **Responsive Design**: Mobile-first, tested at xs and md breakpoints

### Key CSS Classes

- `.statCard` - Statistics card with value and label
- `.analyticsTable` - Metrics table styling
- `.privacyFeature` - Privacy feature card
- `.step` - Onboarding step with number badge
- `.featureCard` - Feature highlight card
- `.teamTable` - Team member table
- `.activityFeed` - Activity feed styling

---

## Data Requirements

### Analytics-First
- All websites for account
- Metrics aggregation (visitors, pageviews, bounce rate)
- Recent reports list

### Privacy-Focused
- Compliance status per website
- Data retention configuration
- Privacy settings
- Audit log summary

### Getting-Started
- User creation date
- Website count
- Feature documentation links

### Team/Enterprise
- Team members list
- Role/permission information
- All team websites
- Activity feed
- Shared resources (dashboards, reports)

---

## Performance Considerations

- **Mock Data**: All components use mock data for demonstration
- **Query Optimization**: Use React Query hooks to batch requests
- **Lazy Loading**: Consider lazy-loading detailed data on scroll
- **Caching**: Utilize React Query's cache for team data
- **SSR**: Components are client-rendered; can be converted to SSR

---

## Testing Recommendations

### Unit Tests
- Component rendering with various data states
- Empty states and error states
- Interactive elements (buttons, forms)

### Integration Tests
- Navigation between variations
- Data loading and display
- Real data integration

### E2E Tests
- Complete user journeys per variation
- Variant switching
- Feature discovery workflows

### User Testing
- A/B test variations by user segment
- Collect feedback on usefulness and clarity
- Measure engagement and feature usage

---

## Future Enhancements

1. **Personalization**: ML-based variant selection based on user behavior
2. **Dynamic Content**: Show different content based on user's websites and data
3. **Comparison View**: Side-by-side comparison of all variations
4. **Custom Variations**: Allow users to build custom homepage layouts
5. **Mobile Optimization**: Tablet and mobile-specific layouts
6. **Dark Mode**: Variations optimized for dark theme
7. **Localization**: Support for multiple languages with culturally appropriate content

---

## Files Reference

```
src/app/(main)/homepages/
├── AnalyticsFirstHomepage.tsx      # Analytics-focused layout
├── PrivacyFocusedHomepage.tsx      # Privacy-focused layout
├── GettingStartedHomepage.tsx      # Onboarding layout
├── TeamEnterpriseHomepage.tsx      # Team collaboration layout
├── page.tsx                        # Showcase/demo page
├── index.ts                        # Component exports
├── Homepages.module.css           # All styling
└── README.md                       # This file
```

---

## Questions?

Refer to the component implementations for:
- Detailed component structure
- Props and data shape
- Real data integration points
- Styling and responsive design details
