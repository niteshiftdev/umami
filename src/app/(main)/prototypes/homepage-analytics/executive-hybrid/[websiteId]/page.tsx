'use client';
import { useMessages } from '@/components/hooks';
import PageHeader from '@/components/layout/PageHeader';
import PageBody from '@/components/layout/PageBody';
import GridRow from '@/components/layout/GridRow';
import Panel from '@/components/common/Panel';
import MetricCard from '@/components/metrics/MetricCard';
import MetricsTable from '@/components/metrics/MetricsTable';
import EventsChart from '@/components/metrics/EventsChart';
import PageviewsChart from '@/components/metrics/PageviewsChart';

export default function ExecutiveHybridPage({ params }: { params: { websiteId: string } }) {
  const { formatMessage, labels } = useMessages();

  // Cross-functional executive KPIs
  const executiveMetrics = [
    { label: 'Revenue Growth', value: '+23.5%', change: 5.2, changeType: 'increase' as const },
    { label: 'Customer Acquisition', value: '847', change: 18.3, changeType: 'increase' as const },
    { label: 'Product Engagement', value: '78.2%', change: 4.7, changeType: 'increase' as const },
    { label: 'Marketing ROI', value: '3.2x', change: 12.1, changeType: 'increase' as const },
  ];

  // Business health scorecard
  const healthScorecardData = [
    { x: 'Revenue Health', y: 92, z: 100 },
    { x: 'Customer Satisfaction', y: 87, z: 100 },
    { x: 'Product Adoption', y: 83, z: 100 },
    { x: 'Market Share Growth', y: 78, z: 100 },
    { x: 'Operational Efficiency', y: 74, z: 100 },
  ];

  // Key initiatives tracking
  const initiativesData = [
    { x: 'Enterprise Expansion Program', y: 87, z: 100 },
    { x: 'Product Feature Launch Q4', y: 78, z: 100 },
    { x: 'Customer Success Automation', y: 92, z: 100 },
    { x: 'Marketing Campaign Refresh', y: 65, z: 100 },
    { x: 'International Market Entry', y: 43, z: 100 },
  ];

  // Revenue & growth drivers
  const growthDriversData = [
    { x: 'New Customer Acquisition', y: 1240000, z: 42.1 },
    { x: 'Existing Customer Expansion', y: 980000, z: 33.3 },
    { x: 'Product Upsells', y: 456000, z: 15.5 },
    { x: 'Geographic Expansion', y: 234000, z: 7.9 },
    { x: 'Partnership Revenue', y: 35000, z: 1.2 },
  ];

  // Customer funnel performance
  const funnelPerformanceData = [
    { x: 'Website Visitors', y: 125000, z: 100.0 },
    { x: 'Marketing Qualified Leads', y: 12500, z: 10.0 },
    { x: 'Sales Qualified Leads', y: 5000, z: 4.0 },
    { x: 'Active Opportunities', y: 2500, z: 2.0 },
    { x: 'Closed Won Customers', y: 847, z: 0.68 },
    { x: 'Active Engaged Users', y: 6625, z: 5.3 },
  ];

  // Risk & opportunity matrix
  const riskOpportunityData = [
    { x: 'High-Value Expansion Opps', y: 456000, z: 38.1 },
    { x: 'At-Risk Customer Revenue', y: -67000, z: -5.6 },
    { x: 'Pipeline Growth Potential', y: 890000, z: 74.3 },
    { x: 'Competitive Threat Impact', y: -120000, z: -10.0 },
    { x: 'Market Expansion Value', y: 234000, z: 19.5 },
  ];

  // Department performance
  const departmentPerformanceData = [
    { x: 'Sales - Quota Attainment', y: 112, z: 100 },
    { x: 'Marketing - Lead Quality', y: 94, z: 100 },
    { x: 'Product - Feature Adoption', y: 87, z: 100 },
    { x: 'Customer Success - NPS', y: 78, z: 100 },
    { x: 'Engineering - Velocity', y: 91, z: 100 },
  ];

  // Geographic expansion status
  const geoExpansionData = [
    { x: 'North America (Mature)', y: 3240000, z: 55.5 },
    { x: 'Europe (Growing)', y: 1620000, z: 27.7 },
    { x: 'Asia Pacific (Emerging)', y: 720000, z: 12.3 },
    { x: 'Latin America (New)', y: 180000, z: 3.1 },
    { x: 'Middle East (Pilot)', y: 80000, z: 1.4 },
  ];

  // Competitive positioning metrics
  const competitiveData = [
    { x: 'Feature Parity Score', y: 94, z: 100 },
    { x: 'Pricing Competitiveness', y: 87, z: 100 },
    { x: 'Customer Satisfaction Gap', y: 12, z: 100 },
    { x: 'Market Share Position', y: 23, z: 100 },
    { x: 'Brand Awareness', y: 68, z: 100 },
  ];

  return (
    <>
      <PageHeader title="Executive Command Center">
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px' }}>
          Unified view of business health, growth drivers, and strategic initiatives
        </div>
      </PageHeader>
      <PageBody>
        {/* Top-Level KPIs */}
        <GridRow>
          {executiveMetrics.map((metric, index) => (
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

        {/* Business Health & Strategic Initiatives */}
        <GridRow columns="two">
          <Panel title="Business Health Scorecard" subtitle="Key performance indicators">
            <MetricsTable data={healthScorecardData} />
          </Panel>
          <Panel title="Strategic Initiatives" subtitle="Progress on key company goals">
            <MetricsTable data={initiativesData} />
          </Panel>
        </GridRow>

        {/* Growth Analysis */}
        <GridRow columns="two-one">
          <Panel title="Revenue Growth Drivers" subtitle="Contribution to total revenue growth">
            <MetricsTable data={growthDriversData} />
          </Panel>
          <Panel>
            <div style={{ padding: '20px' }}>
              <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>Company Snapshot</h3>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Annual Run Rate
                </div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--primary)' }}>
                  $7.2M
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', marginBottom: '4px' }}>Total Customers</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>847</div>
                <div style={{ fontSize: '14px', color: '#22c55e' }}>+23.5% YoY</div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', marginBottom: '4px' }}>Team Size</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>124</div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>+18 this quarter</div>
              </div>
              <div>
                <div style={{ fontSize: '14px', marginBottom: '4px' }}>Cash Runway</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>18 months</div>
              </div>
            </div>
          </Panel>
        </GridRow>

        {/* Customer Funnel & Risk/Opportunity */}
        <GridRow columns="two">
          <Panel title="End-to-End Customer Funnel" subtitle="From visitor to engaged user">
            <MetricsTable data={funnelPerformanceData} />
          </Panel>
          <Panel title="Risk & Opportunity Matrix" subtitle="Threats and growth potential">
            <MetricsTable data={riskOpportunityData} />
          </Panel>
        </GridRow>

        {/* Department Performance */}
        <GridRow>
          <Panel title="Cross-Functional Performance" subtitle="Department KPI achievement">
            <MetricsTable data={departmentPerformanceData} />
          </Panel>
        </GridRow>

        {/* Trends */}
        <GridRow columns="two">
          <Panel title="Revenue & Growth Trends" subtitle="30-day performance">
            <EventsChart websiteId={params.websiteId} />
          </Panel>
          <Panel title="Customer Acquisition Trends" subtitle="Daily new customer signups">
            <PageviewsChart websiteId={params.websiteId} />
          </Panel>
        </GridRow>

        {/* Geographic & Competitive */}
        <GridRow columns="two">
          <Panel title="Geographic Expansion Status" subtitle="Revenue by market maturity">
            <MetricsTable data={geoExpansionData} />
          </Panel>
          <Panel title="Competitive Positioning" subtitle="Market performance vs competitors">
            <MetricsTable data={competitiveData} />
          </Panel>
        </GridRow>
      </PageBody>
    </>
  );
}
