# Landing Page Persona Variations Guide

This guide explains the landing page variations system that generates different website landing page experiences for different user personas, complete with realistic test data.

## Overview

The persona variations system includes:

1. **Four distinct user personas** with tailored messaging, CTAs, and features
2. **Realistic test data** for each persona reflecting their typical usage patterns
3. **Multiple ways to view variations** - showcase page, individual routes, and switchable components
4. **Easy integration** with existing Umami dashboard

## User Personas

### 1. Startup Founder 🚀
- **Focus**: Getting started quickly with minimal setup
- **Key Metrics**: 2,847 visitors, 42% bounce rate, 145s avg session
- **Pain Points**: Want to track product-market fit signals quickly
- **CTA**: "Start Free Trial"
- **Top Features**:
  - Real-time visitor insights
  - Zero configuration needed
  - GDPR compliant by default
  - Unlimited events & custom data

**Typical Flow**:
- High traffic from Product Hunt & Hacker News (launch announcements)
- Focus on signup and trial activation events
- Desktop-heavy audience (66%)

### 2. Marketing Manager 📊
- **Focus**: Campaign performance and audience optimization
- **Key Metrics**: 48,923 visitors, 38% bounce rate, 203s avg session
- **Pain Points**: Need to track campaign ROI across channels
- **CTA**: "Explore Features"
- **Top Features**:
  - UTM campaign tracking
  - Funnel analysis
  - Audience segmentation
  - Custom event tracking

**Typical Flow**:
- High traffic from Google Ads and Facebook Ads
- Mobile-dominant audience (60%)
- Focus on add-to-cart and purchase events
- International traffic (40% US, rest global)

### 3. Developer 👨‍💻
- **Focus**: API integration and technical implementation
- **Key Metrics**: 8,934 visitors, 28% bounce rate, 387s avg session
- **Pain Points**: Need flexible, lightweight tracking without JavaScript bloat
- **CTA**: "View API Docs"
- **Top Features**:
  - Open source & self-hostable
  - REST API & webhooks
  - Custom event schemas
  - Zero tracking bloat

**Typical Flow**:
- High traffic from GitHub, Stack Overflow, and Google Search
- Desktop-only audience (91%)
- Focus on docs, API reference, and code examples
- High engagement with documentation (longer sessions)

### 4. Enterprise Admin 🏢
- **Focus**: Team collaboration, compliance, and scale
- **Key Metrics**: 2.3M visitors, 22% bounce rate, 456s avg session
- **Pain Points**: Need multi-team management, SSO, and audit trails
- **CTA**: "Request Demo"
- **Top Features**:
  - Team-based access control
  - SOC 2 compliance
  - Data residency options
  - Dedicated support

**Typical Flow**:
- Internal app usage (49% from internal systems)
- Heavy report generation (89K+ reports/month)
- Global multi-office distribution
- Multiple property management (100+ properties)

## File Structure

```
/root/umami/
├── src/
│   ├── components/
│   │   └── landing/
│   │       ├── LandingPageVariations.tsx      # Core variation component
│   │       └── PersonaSwitcher.tsx            # UI switcher component
│   ├── lib/
│   │   └── testData.ts                        # Test data for all personas
│   └── app/
│       └── (main)/
│           └── landing/
│               ├── page.tsx                   # Showcase page with switcher
│               └── [persona]/
│                   └── page.tsx               # Individual persona pages
└── PERSONA_VARIATIONS_GUIDE.md                # This file
```

## How to Use

### Option 1: View the Showcase Page

Navigate to `/landing` to see all personas with a switcher and test data display:

- Select any persona from the buttons at the top
- View the customized landing page for that persona
- See detailed test data including:
  - Page views and bounce rates
  - Traffic sources and referrers
  - Custom events and conversion rates
  - Device breakdown
  - Geographic distribution

### Option 2: Individual Persona Routes

Visit individual persona landing pages directly:

- `/landing/startup_founder` - Startup founder experience
- `/landing/marketing_manager` - Marketing manager experience
- `/landing/developer` - Developer experience
- `/landing/enterprise_admin` - Enterprise admin experience

### Option 3: Embed in Components

Use the `LandingPageVariation` component in your own components:

```tsx
import { LandingPageVariation } from '@/components/landing/LandingPageVariations';
import { getPersonaTestData } from '@/lib/testData';

export function MyComponent() {
  const persona = 'startup_founder';
  const testData = getPersonaTestData(persona);

  return (
    <LandingPageVariation
      persona={persona}
      metrics={testData.metrics}
    />
  );
}
```

### Option 4: Use the Persona Switcher

Add the `PersonaSwitcher` component to your dashboard:

```tsx
import { PersonaSwitcher } from '@/components/landing/PersonaSwitcher';
import { LandingPageVariation, UserPersona } from '@/components/landing/LandingPageVariations';
import { getPersonaTestData } from '@/lib/testData';
import { useState } from 'react';

export function Dashboard() {
  const [persona, setPersona] = useState<UserPersona>('startup_founder');
  const testData = getPersonaTestData(persona);

  return (
    <>
      <PersonaSwitcher onChange={setPersona} />
      <LandingPageVariation
        persona={persona}
        metrics={testData.metrics}
      />
    </>
  );
}
```

## Test Data Characteristics

Each persona has carefully crafted test data that reflects realistic usage patterns:

### Startup Founder
- **High launch-related traffic** (Product Hunt, Hacker News)
- **Quick conversions** to trials and signups
- **Lower volume** but high engagement
- **Bounce rate**: 42% (typical for landing pages)

### Marketing Manager
- **High volume** from paid ads
- **Mobile-first** audience (e-commerce)
- **Clear conversion funnel** (product → cart → checkout)
- **Bounce rate**: 38% (good for marketing campaigns)
- **International reach** (50% US, 50% international)

### Developer
- **Organic traffic** from technical communities
- **Desktop-only** (developers on computers)
- **Long session duration** (reading docs, copying code)
- **Bounce rate**: 28% (engaged technical audience)

### Enterprise
- **Massive scale** (2.3M visitors)
- **Internal usage** patterns (SSO, team dashboards)
- **Low bounce rate** (22% - repeat visitors)
- **High feature adoption** (reports, integrations, team invites)

## Customization

To customize the persona variations:

### 1. Add a New Persona

Edit `/root/umami/src/components/landing/LandingPageVariations.tsx`:

```tsx
export type UserPersona = 'startup_founder' | 'marketing_manager' | 'developer' | 'enterprise_admin' | 'new_persona';

const personaConfigs: Record<UserPersona, PersonaConfig> = {
  // ... existing personas
  new_persona: {
    title: 'Your Custom Title',
    subtitle: 'Your custom subtitle',
    description: 'Your description...',
    primaryCTA: 'Your CTA',
    features: ['Feature 1', 'Feature 2', ...],
    useCaseExample: 'Example of real results',
    calloutHighlight: 'Key benefit highlight',
  },
};
```

Add a color for the persona:

```tsx
function getPersonaColor(persona: UserPersona): string {
  const colors: Record<UserPersona, string> = {
    // ... existing colors
    new_persona: '#FF0000', // Your color
  };
  return colors[persona];
}
```

### 2. Modify Test Data

Edit `/root/umami/src/lib/testData.ts`:

```tsx
export const personaTestDataMap: Record<UserPersona, PersonaTestData> = {
  // ... existing data
  new_persona: {
    persona: 'new_persona',
    description: 'Your description',
    metrics: {
      visitors: 10000,
      visits: 15000,
      pageviews: 50000,
      bounceRate: 0.35,
      visitDuration: 200,
    },
    pageViews: [...],
    referrers: [...],
    events: [...],
    devices: [...],
    countries: [...],
  },
};
```

### 3. Update Color Scheme

Each persona has:
- **Primary color**: Used for buttons, highlights, and gradients
- **Gradient**: Linear gradient for the hero section
- **Label**: Human-readable persona name

Colors are automatically applied to all UI elements.

## Measuring Effectiveness

To use these variations for A/B testing or personas evaluation:

1. **Track which persona each user views**: Add events to track persona exposure
2. **Compare conversion rates**: Use the event data to see which persona messaging works best
3. **Measure engagement**: Session duration and bounce rate indicate persona resonance
4. **Analyze traffic sources**: See which channels attract each persona

Example event tracking:

```tsx
const handlePersonaView = (persona: UserPersona) => {
  // Track persona exposure
  window.umami?.track('persona_viewed', { persona });
};
```

## API Integration

To integrate test data into your actual analytics dashboard:

1. **Create mock API endpoints** for each persona's metrics
2. **Use test data in development** while real data flows in production
3. **Combine with real data** for gradual rollout

Example:

```tsx
const { data: actualMetrics } = useWebsiteStatsQuery(websiteId);
const persona = determineUserPersona(actualMetrics);
const testData = getPersonaTestData(persona);

// Use actual metrics if available, fall back to test data
const displayMetrics = actualMetrics || testData.metrics;
```

## Performance Considerations

- **Landing page** component is optimized for light rendering
- **Test data** is imported as static constants (no runtime generation)
- **Color calculations** are pure functions (no state)
- **Components** are reusable and composable

## Future Enhancements

Potential improvements:

1. **Persona auto-detection**: Determine persona from user behavior
2. **Dynamic test data**: Generate realistic data based on parameters
3. **Advanced segmentation**: Create more specific sub-personas
4. **A/B test framework**: Built-in experiment tracking
5. **Real data synthesis**: Mix real Umami data with persona variations
6. **Analytics integration**: Track which personas convert best

## Troubleshooting

### Persona not appearing
- Check that the persona is included in the `validPersonas` array
- Verify the persona type matches `UserPersona` type

### Test data not loading
- Ensure `getPersonaTestData()` is called with a valid persona
- Check that the persona exists in `personaTestDataMap`

### Routes not generating
- Run `npm run build` to regenerate static pages
- Check that `[persona]` folder structure is correct

## Support

For questions or issues:

1. Check this guide's customization section
2. Review the test data structure in `testData.ts`
3. Examine the component implementation in `LandingPageVariations.tsx`
4. Add console logging to debug persona selection
