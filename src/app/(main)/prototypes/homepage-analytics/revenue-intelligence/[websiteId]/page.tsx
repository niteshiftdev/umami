'use client';
import { useMessages } from '@/components/hooks';
import PageHeader from '@/components/layout/PageHeader';
import PageBody from '@/components/layout/PageBody';
import GridRow from '@/components/layout/GridRow';
import Panel from '@/components/common/Panel';
import MetricCard from '@/components/metrics/MetricCard';
import MetricsTable from '@/components/metrics/MetricsTable';
import EventsChart from '@/components/metrics/EventsChart';

export default function RevenueIntelligencePage({ params }: { params: { websiteId: string } }) {
  const { formatMessage, labels } = useMessages();

  // Revenue KPIs
  const revenueMetrics = [
    { label: 'Monthly Recurring Revenue', value: '$487K', change: 18.2, changeType: 'increase' as const },
    { label: 'Annual Contract Value', value: '$5.84M', change: 23.5, changeType: 'increase' as const },
    { label: 'Net Revenue Retention', value: '118%', change: 6.8, changeType: 'increase' as const },
    { label: 'Churn Risk Value', value: '$67K', change: -12.4, changeType: 'increase' as const },
  ];

  // Revenue by customer segment
  const segmentRevenueData = [
    { x: 'Enterprise (500+ employees)', y: 2840000, z: 48.6 },
    { x: 'Mid-Market (100-499 employees)', y: 1680000, z: 28.8 },
    { x: 'SMB (20-99 employees)', y: 892000, z: 15.3 },
    { x: 'Startup (<20 employees)', y: 428000, z: 7.3 },
  ];

  // Top accounts by revenue
  const topAccountsData = [
    { x: 'Acme Corporation', y: 285000, z: 4.9 },
    { x: 'Global Tech Industries', y: 247000, z: 4.2 },
    { x: 'DataFlow Systems', y: 198000, z: 3.4 },
    { x: 'CloudScale Inc', y: 176000, z: 3.0 },
    { x: 'NextGen Analytics', y: 154000, z: 2.6 },
    { x: 'Phoenix Ventures', y: 132000, z: 2.3 },
    { x: 'Summit Solutions', y: 118000, z: 2.0 },
    { x: 'Velocity Partners', y: 97000, z: 1.7 },
  ];

  // Revenue growth opportunities
  const expansionOpportunities = [
    { x: 'Upsell to Enterprise Tier', y: 456000, z: 38.2 },
    { x: 'Add Premium Features', y: 289000, z: 24.2 },
    { x: 'Increase User Seats', y: 234000, z: 19.6 },
    { x: 'Annual Commitment Upgrade', y: 156000, z: 13.1 },
    { x: 'Additional Integrations', y: 59000, z: 4.9 },
  ];

  // Churn risk accounts
  const churnRiskData = [
    { x: 'DataCorp LLC - Low Usage', y: 24000, z: 35.8 },
    { x: 'TechStart Solutions - Support Issues', y: 18000, z: 26.9 },
    { x: 'Digital Innovations - Budget Concerns', y: 12000, z: 17.9 },
    { x: 'SmartData Inc - Competitor Interest', y: 8000, z: 11.9 },
    { x: 'CloudFirst Ltd - Contract Ending', y: 5000, z: 7.5 },
  ];

  // Revenue by product line
  const productRevenueData = [
    { x: 'Analytics Pro', y: 2450000, z: 42.0 },
    { x: 'Enterprise Suite', y: 1890000, z: 32.4 },
    { x: 'Team Collaboration', y: 980000, z: 16.8 },
    { x: 'Data Integration Hub', y: 420000, z: 7.2 },
    { x: 'Custom Solutions', y: 100000, z: 1.6 },
  ];

  // Sales pipeline health
  const pipelineHealthData = [
    { x: 'Qualified Leads', y: 1890000, z: 100.0 },
    { x: 'Discovery', y: 1512000, z: 80.0 },
    { x: 'Proposal Sent', y: 1134000, z: 60.0 },
    { x: 'Negotiation', y: 756000, z: 40.0 },
    { x: 'Verbal Commit', y: 378000, z: 20.0 },
    { x: 'Closed Won', y: 189000, z: 10.0 },
  ];

  // Customer health scores
  const customerHealthData = [
    { x: 'Healthy (90-100 score)', y: 142, z: 68.9 },
    { x: 'At Risk (70-89 score)', y: 45, z: 21.8 },
    { x: 'Critical (50-69 score)', y: 15, z: 7.3 },
    { x: 'Churning (<50 score)', y: 4, z: 2.0 },
  ];

  // Geographic revenue distribution
  const geoRevenueData = [
    { x: 'North America', y: 3240000, z: 55.5 },
    { x: 'Europe', y: 1620000, z: 27.7 },
    { x: 'Asia Pacific', y: 720000, z: 12.3 },
    { x: 'Latin America', y: 180000, z: 3.1 },
    { x: 'Middle East & Africa', y: 80000, z: 1.4 },
  ];

  return (
    <>
      <PageHeader title="Revenue Intelligence Dashboard">
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px' }}>
          Sales and CSM insights for revenue growth and risk management
        </div>
      </PageHeader>
      <PageBody>
        {/* Key Revenue Metrics */}
        <GridRow>
          {revenueMetrics.map((metric, index) => (
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

        {/* Revenue Breakdown */}
        <GridRow columns="two">
          <Panel title="Revenue by Customer Segment" subtitle="Annual recurring revenue">
            <MetricsTable data={segmentRevenueData} />
          </Panel>
          <Panel title="Top Accounts" subtitle="Highest revenue customers">
            <MetricsTable data={topAccountsData} />
          </Panel>
        </GridRow>

        {/* Growth & Risk */}
        <GridRow columns="two">
          <Panel title="Expansion Opportunities" subtitle="Potential upsell revenue">
            <MetricsTable data={expansionOpportunities} />
          </Panel>
          <Panel title="Accounts at Risk" subtitle="Churn risk by account value">
            <MetricsTable data={churnRiskData} />
          </Panel>
        </GridRow>

        {/* Product & Pipeline */}
        <GridRow columns="two-one">
          <Panel title="Revenue by Product Line" subtitle="ARR breakdown">
            <MetricsTable data={productRevenueData} />
          </Panel>
          <Panel>
            <div style={{ padding: '20px' }}>
              <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>Quick Stats</h3>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Avg Deal Size
                </div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--primary)' }}>
                  $28.4K
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', marginBottom: '4px' }}>Sales Cycle</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>47 days</div>
                <div style={{ fontSize: '14px', color: '#22c55e' }}>-8 days from Q3</div>
              </div>
              <div>
                <div style={{ fontSize: '14px', marginBottom: '4px' }}>Win Rate</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>24.3%</div>
                <div style={{ fontSize: '14px', color: '#22c55e' }}>+3.1% QoQ</div>
              </div>
            </div>
          </Panel>
        </GridRow>

        {/* Pipeline & Health */}
        <GridRow columns="two">
          <Panel title="Sales Pipeline" subtitle="Current quarter opportunity value">
            <MetricsTable data={pipelineHealthData} />
          </Panel>
          <Panel title="Customer Health Distribution" subtitle="Account health scores">
            <MetricsTable data={customerHealthData} />
          </Panel>
        </GridRow>

        {/* Revenue Trends */}
        <GridRow>
          <Panel title="Revenue Trends" subtitle="30-day revenue and expansion activity">
            <EventsChart websiteId={params.websiteId} />
          </Panel>
        </GridRow>

        {/* Geographic Revenue */}
        <GridRow>
          <Panel title="Revenue by Region" subtitle="Geographic distribution">
            <MetricsTable data={geoRevenueData} />
          </Panel>
        </GridRow>
      </PageBody>
    </>
  );
}
