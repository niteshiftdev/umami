import { UserPersona } from '@/components/landing/LandingPageVariations';

export interface PersonaTestData {
  persona: UserPersona;
  metrics: {
    visitors: number;
    visits: number;
    pageviews: number;
    bounceRate: number;
    visitDuration: number;
  };
  pageViews: Array<{
    path: string;
    views: number;
    entryPercentage: number;
    exitPercentage: number;
  }>;
  referrers: Array<{
    referrer: string;
    visits: number;
    percentage: number;
  }>;
  events: Array<{
    name: string;
    count: number;
    conversionRate: number;
  }>;
  devices: Array<{
    device: string;
    visitors: number;
    percentage: number;
  }>;
  countries: Array<{
    country: string;
    visitors: number;
    percentage: number;
  }>;
  description: string;
}

export const personaTestDataMap: Record<UserPersona, PersonaTestData> = {
  startup_founder: {
    persona: 'startup_founder',
    description: 'Early-stage SaaS product with growing traction',
    metrics: {
      visitors: 2847,
      visits: 3421,
      pageviews: 8934,
      bounceRate: 0.42, // 42%
      visitDuration: 145, // seconds
    },
    pageViews: [
      { path: '/', views: 2145, entryPercentage: 65, exitPercentage: 35 },
      { path: '/features', views: 1823, entryPercentage: 30, exitPercentage: 25 },
      { path: '/pricing', views: 1456, entryPercentage: 20, exitPercentage: 45 },
      { path: '/docs', views: 987, entryPercentage: 15, exitPercentage: 10 },
      { path: '/blog', views: 743, entryPercentage: 10, exitPercentage: 20 },
    ],
    referrers: [
      { referrer: 'Product Hunt', visits: 1245, percentage: 36 },
      { referrer: 'Hacker News', visits: 856, percentage: 25 },
      { referrer: 'Twitter', visits: 623, percentage: 18 },
      { referrer: 'Direct', visits: 489, percentage: 14 },
      { referrer: 'Google', visits: 208, percentage: 6 },
    ],
    events: [
      { name: 'signup', count: 432, conversionRate: 0.126 },
      { name: 'trial_started', count: 289, conversionRate: 0.084 },
      { name: 'feature_demo_watched', count: 1203, conversionRate: 0.352 },
      { name: 'docs_page_view', count: 567, conversionRate: 0.166 },
    ],
    devices: [
      { device: 'Desktop', visitors: 1876, percentage: 66 },
      { device: 'Mobile', visitors: 823, percentage: 29 },
      { device: 'Tablet', visitors: 148, percentage: 5 },
    ],
    countries: [
      { country: 'United States', visitors: 1423, percentage: 50 },
      { country: 'Canada', visitors: 456, percentage: 16 },
      { country: 'United Kingdom', visitors: 389, percentage: 14 },
      { country: 'Germany', visitors: 298, percentage: 10 },
      { country: 'Other', visitors: 281, percentage: 10 },
    ],
  },

  marketing_manager: {
    persona: 'marketing_manager',
    description: 'E-commerce company running multiple marketing campaigns',
    metrics: {
      visitors: 48923,
      visits: 67342,
      pageviews: 234567,
      bounceRate: 0.38, // 38%
      visitDuration: 203, // seconds
    },
    pageViews: [
      { path: '/', views: 45632, entryPercentage: 35, exitPercentage: 28 },
      { path: '/products', views: 87234, entryPercentage: 25, exitPercentage: 15 },
      { path: '/product/:id', views: 156890, entryPercentage: 20, exitPercentage: 22 },
      { path: '/cart', views: 34567, entryPercentage: 8, exitPercentage: 45 },
      { path: '/checkout', views: 28934, entryPercentage: 5, exitPercentage: 35 },
    ],
    referrers: [
      { referrer: 'Google Ads', visits: 28934, percentage: 43 },
      { referrer: 'Facebook Ads', visits: 18945, percentage: 28 },
      { referrer: 'Email Campaign', visits: 12456, percentage: 18 },
      { referrer: 'Organic Search', visits: 5678, percentage: 8 },
      { referrer: 'Direct', visits: 1329, percentage: 2 },
    ],
    events: [
      { name: 'add_to_cart', count: 18934, conversionRate: 0.281 },
      { name: 'purchase', count: 6234, conversionRate: 0.0925 },
      { name: 'wishlist_add', count: 12456, conversionRate: 0.185 },
      { name: 'product_view', count: 67234, conversionRate: 1.0 },
      { name: 'newsletter_signup', count: 2345, conversionRate: 0.0348 },
    ],
    devices: [
      { device: 'Mobile', visitors: 29348, percentage: 60 },
      { device: 'Desktop', visitors: 17789, percentage: 36 },
      { device: 'Tablet', visitors: 1786, percentage: 4 },
    ],
    countries: [
      { country: 'United States', visitors: 24461, percentage: 50 },
      { country: 'United Kingdom', visitors: 7477, percentage: 15 },
      { country: 'Canada', visitors: 5894, percentage: 12 },
      { country: 'Australia', visitors: 4893, percentage: 10 },
      { country: 'Other', visitors: 6198, percentage: 13 },
    ],
  },

  developer: {
    persona: 'developer',
    description: 'Developer tracking API usage and service performance',
    metrics: {
      visitors: 8934,
      visits: 12345,
      pageviews: 67432,
      bounceRate: 0.28, // 28%
      visitDuration: 387, // seconds - developers spend more time
    },
    pageViews: [
      { path: '/docs', views: 23456, entryPercentage: 45, exitPercentage: 10 },
      { path: '/api/reference', views: 18934, entryPercentage: 35, exitPercentage: 12 },
      { path: '/guides/quickstart', views: 12345, entryPercentage: 20, exitPercentage: 8 },
      { path: '/examples', views: 8934, entryPercentage: 15, exitPercentage: 15 },
      { path: '/status', views: 3763, entryPercentage: 5, exitPercentage: 25 },
    ],
    referrers: [
      { referrer: 'GitHub', visits: 4567, percentage: 37 },
      { referrer: 'Stack Overflow', visits: 2456, percentage: 20 },
      { referrer: 'Google Search', visits: 2789, percentage: 23 },
      { referrer: 'Dev.to', visits: 1234, percentage: 10 },
      { referrer: 'Direct', visits: 1299, percentage: 10 },
    ],
    events: [
      { name: 'api_key_generated', count: 234, conversionRate: 0.026 },
      { name: 'code_example_copied', count: 2145, conversionRate: 0.239 },
      { name: 'docs_searched', count: 5634, conversionRate: 0.63 },
      { name: 'github_repo_clicked', count: 1834, conversionRate: 0.205 },
      { name: 'integration_completed', count: 156, conversionRate: 0.0174 },
    ],
    devices: [
      { device: 'Desktop', visitors: 8123, percentage: 91 },
      { device: 'Mobile', visitors: 678, percentage: 8 },
      { device: 'Tablet', visitors: 133, percentage: 1 },
    ],
    countries: [
      { country: 'United States', visitors: 3572, percentage: 40 },
      { country: 'India', visitors: 1788, percentage: 20 },
      { country: 'Germany', visitors: 1072, percentage: 12 },
      { country: 'United Kingdom', visitors: 895, percentage: 10 },
      { country: 'Other', visitors: 1607, percentage: 18 },
    ],
  },

  enterprise_admin: {
    persona: 'enterprise_admin',
    description: 'Large enterprise with multiple teams and properties',
    metrics: {
      visitors: 2345678,
      visits: 4567890,
      pageviews: 45678901,
      bounceRate: 0.22, // 22%
      visitDuration: 456, // seconds
    },
    pageViews: [
      { path: '/dashboard', views: 12345678, entryPercentage: 30, exitPercentage: 5 },
      { path: '/properties', views: 8934567, entryPercentage: 20, exitPercentage: 8 },
      { path: '/team-settings', views: 5678934, entryPercentage: 15, exitPercentage: 10 },
      { path: '/reports', views: 9876543, entryPercentage: 22, exitPercentage: 12 },
      { path: '/integrations', views: 3456789, entryPercentage: 8, exitPercentage: 15 },
    ],
    referrers: [
      { referrer: 'Internal App', visits: 2234567, percentage: 49 },
      { referrer: 'SSO Login', visits: 1123456, percentage: 24 },
      { referrer: 'Bookmarks', visits: 890123, percentage: 19 },
      { referrer: 'Email Links', visits: 234567, percentage: 5 },
      { referrer: 'Other', visits: 85177, percentage: 2 },
    ],
    events: [
      { name: 'report_generated', count: 89345, conversionRate: 0.0195 },
      { name: 'team_member_invited', count: 12345, conversionRate: 0.0027 },
      { name: 'property_created', count: 5678, conversionRate: 0.00124 },
      { name: 'export_completed', count: 34567, conversionRate: 0.0076 },
      { name: 'custom_segment_created', count: 8934, conversionRate: 0.00195 },
    ],
    devices: [
      { device: 'Desktop', visitors: 2123456, percentage: 91 },
      { device: 'Mobile', visitors: 187654, percentage: 8 },
      { device: 'Tablet', visitors: 34568, percentage: 1 },
    ],
    countries: [
      { country: 'United States', visitors: 940000, percentage: 40 },
      { country: 'United Kingdom', visitors: 469000, percentage: 20 },
      { country: 'Germany', visitors: 281000, percentage: 12 },
      { country: 'France', visitors: 234000, percentage: 10 },
      { country: 'Other', visitors: 421678, percentage: 18 },
    ],
  },
};

export function getPersonaTestData(persona: UserPersona): PersonaTestData {
  return personaTestDataMap[persona];
}

export function getAllPersonaTestData(): PersonaTestData[] {
  return Object.values(personaTestDataMap);
}
