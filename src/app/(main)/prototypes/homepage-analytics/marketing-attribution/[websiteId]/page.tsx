'use client';
import { useMessages } from '@/components/hooks';
import PageHeader from '@/components/layout/PageHeader';
import PageBody from '@/components/layout/PageBody';
import GridRow from '@/components/layout/GridRow';
import Panel from '@/components/common/Panel';
import MetricCard from '@/components/metrics/MetricCard';
import MetricsTable from '@/components/metrics/MetricsTable';
import PageviewsChart from '@/components/metrics/PageviewsChart';
import EventsChart from '@/components/metrics/EventsChart';

export default function MarketingAttributionPage({ params }: { params: { websiteId: string } }) {
  const { formatMessage, labels } = useMessages();

  // Marketing channel performance metrics
  const channelMetrics = [
    { label: 'Total Conversions', value: 2847, change: 23.4, changeType: 'increase' as const },
    { label: 'Cost per Acquisition', value: '$42.50', change: -8.2, changeType: 'increase' as const },
    { label: 'Marketing ROI', value: '3.2x', change: 15.7, changeType: 'increase' as const },
    { label: 'Attribution Rate', value: '84.3%', change: 4.1, changeType: 'increase' as const },
  ];

  // Traffic sources performance
  const trafficSourceData = [
    { x: 'Organic Search (Google)', y: 12456, z: 38.2 },
    { x: 'Paid Search (Google Ads)', y: 8234, z: 25.3 },
    { x: 'Social Media (LinkedIn)', y: 4567, z: 14.0 },
    { x: 'Email Campaigns', y: 3456, z: 10.6 },
    { x: 'Direct Traffic', y: 2345, z: 7.2 },
    { x: 'Referral Sites', y: 1234, z: 3.8 },
    { x: 'Display Ads', y: 289, z: 0.9 },
  ];

  // Campaign performance
  const campaignPerformanceData = [
    { x: 'Summer Product Launch', y: 4523, z: 31.8 },
    { x: 'Enterprise SEO Push', y: 3892, z: 27.3 },
    { x: 'LinkedIn Thought Leadership', y: 2145, z: 15.1 },
    { x: 'Partner Co-marketing', y: 1834, z: 12.9 },
    { x: 'Webinar Series Q4', y: 1245, z: 8.7 },
    { x: 'Retargeting Campaign', y: 598, z: 4.2 },
  ];

  // Landing page effectiveness
  const landingPageData = [
    { x: '/product/enterprise', y: 5678, z: 42.3 },
    { x: '/solutions/analytics', y: 3456, z: 28.7 },
    { x: '/pricing', y: 2145, z: 18.9 },
    { x: '/case-studies/acme', y: 1234, z: 6.4 },
    { x: '/webinar/registration', y: 456, z: 3.7 },
  ];

  // UTM parameter analysis
  const utmSourceData = [
    { x: 'google / cpc', y: 8234, z: 35.4 },
    { x: 'linkedin / social', y: 4567, z: 19.6 },
    { x: 'newsletter / email', y: 3456, z: 14.9 },
    { x: 'partner-site / referral', y: 2834, z: 12.2 },
    { x: 'facebook / cpc', y: 2145, z: 9.2 },
    { x: 'twitter / social', y: 1234, z: 5.3 },
    { x: 'display-network / banner', y: 789, z: 3.4 },
  ];

  // Conversion path analysis
  const conversionPathData = [
    { x: 'Organic → Direct → Email', y: 1245, z: 22.3 },
    { x: 'Paid Search → Direct', y: 1089, z: 19.5 },
    { x: 'Social → Organic → Direct', y: 892, z: 16.0 },
    { x: 'Email → Direct', y: 734, z: 13.1 },
    { x: 'Referral → Organic', y: 567, z: 10.2 },
    { x: 'Display → Paid Search → Direct', y: 456, z: 8.2 },
    { x: 'Direct Only', y: 345, z: 6.2 },
    { x: 'Other Multi-touch', y: 254, z: 4.5 },
  ];

  // Geographic marketing performance
  const geoMarketingData = [
    { x: 'United States', y: 1523, z: 53.5 },
    { x: 'United Kingdom', y: 456, z: 16.0 },
    { x: 'Germany', y: 289, z: 10.2 },
    { x: 'Canada', y: 234, z: 8.2 },
    { x: 'Australia', y: 178, z: 6.3 },
    { x: 'France', y: 89, z: 3.1 },
    { x: 'Netherlands', y: 45, z: 1.6 },
    { x: 'Singapore', y: 33, z: 1.1 },
  ];

  return (
    <>
      <PageHeader title="Marketing Attribution Analytics">
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px' }}>
          Track marketing source effectiveness and conversion paths
        </div>
      </PageHeader>
      <PageBody>
        {/* Key Marketing Metrics */}
        <GridRow>
          {channelMetrics.map((metric, index) => (
            <Panel key={index}>
              <MetricCard
                label={metric.label}
                value={metric.value}
                change={metric.change}
                changeType={metric.changeType}
              />
            </Panel>
          ))}
        </GridRow>

        {/* Traffic Sources & Campaigns */}
        <GridRow columns="two">
          <Panel title="Traffic Sources" subtitle="Visits by marketing channel (last 30 days)">
            <MetricsTable data={trafficSourceData} />
          </Panel>
          <Panel title="Campaign Performance" subtitle="Conversions by campaign">
            <MetricsTable data={campaignPerformanceData} />
          </Panel>
        </GridRow>

        {/* Landing Pages & UTM Tracking */}
        <GridRow columns="two">
          <Panel title="Top Landing Pages" subtitle="Conversion rate by entry page">
            <MetricsTable data={landingPageData} />
          </Panel>
          <Panel title="UTM Source Tracking" subtitle="Traffic by utm_source/utm_medium">
            <MetricsTable data={utmSourceData} />
          </Panel>
        </GridRow>

        {/* Multi-touch Attribution */}
        <GridRow columns="two-one">
          <Panel title="Conversion Path Analysis" subtitle="Most common multi-touch journeys">
            <MetricsTable data={conversionPathData} />
          </Panel>
          <Panel>
            <div style={{ padding: '20px' }}>
              <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>Attribution Insights</h3>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Avg Touches to Convert
                </div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--primary)' }}>
                  3.7
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', marginBottom: '4px' }}>First-Touch Impact</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Organic Search</div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>42% of conversions</div>
              </div>
              <div>
                <div style={{ fontSize: '14px', marginBottom: '4px' }}>Last-Touch Impact</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Email</div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>38% of conversions</div>
              </div>
            </div>
          </Panel>
        </GridRow>

        {/* Marketing Trends */}
        <GridRow columns="two">
          <Panel title="Traffic Trends by Source" subtitle="30-day traffic patterns">
            <PageviewsChart websiteId={params.websiteId} />
          </Panel>
          <Panel title="Conversion Trends" subtitle="Daily conversion events">
            <EventsChart websiteId={params.websiteId} />
          </Panel>
        </GridRow>

        {/* Geographic Performance */}
        <GridRow>
          <Panel title="Conversions by Geography" subtitle="Marketing performance by region">
            <MetricsTable data={geoMarketingData} />
          </Panel>
        </GridRow>
      </PageBody>
    </>
  );
}
