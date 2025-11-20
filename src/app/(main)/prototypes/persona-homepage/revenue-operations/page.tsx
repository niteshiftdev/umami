'use client';
import { Column, Row, Grid, Text, Heading } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { MetricCard } from '@/components/metrics/MetricCard';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { ListTable } from '@/components/metrics/ListTable';
import { CHART_COLORS } from '@/lib/constants';
import { formatNumber } from '@/lib/format';

export default function RevenueOperationsHomepage() {
  // Generate realistic revenue operations data with proper date formatting
  const today = new Date();
  const last12Months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(today);
    date.setMonth(date.getMonth() - (11 - i));
    // Format as YYYY-MM for month unit
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  });

  // Generate deterministic data based on index for consistency
  const generateValue = (base: number, variance: number, index: number) => {
    return Math.floor(base + Math.sin(index * 0.5) * variance + index * (variance / 6));
  };

  // Monthly Recurring Revenue (MRR) trend
  const mrrData = last12Months.map((date, i) => ({
    x: date,
    y: generateValue(450000, 20000, i),
  }));

  // New vs Expansion vs Churn
  const revenueBreakdown = last12Months.map((date, i) => {
    return {
      date: date,
      new: generateValue(45000, 8000, i),
      expansion: generateValue(18000, 4000, i),
      churn: -generateValue(8000, 2000, i),
    };
  });

  // Deal pipeline by stage
  const pipelineData = {
    labels: ['Prospecting', 'Qualified', 'Demo', 'Proposal', 'Negotiation', 'Closed Won'],
    datasets: [
      {
        label: 'Pipeline Value',
        data: [2800000, 1950000, 1420000, 980000, 640000, 420000],
        backgroundColor: CHART_COLORS.slice(0, 6),
      },
    ],
  };

  // Customer health scores
  const customerHealthData = [
    { segment: 'Enterprise', healthy: 42, at_risk: 8, churn_risk: 3, arr: 1850000 },
    { segment: 'Mid-Market', healthy: 128, at_risk: 24, churn_risk: 11, arr: 980000 },
    { segment: 'SMB', healthy: 486, at_risk: 94, churn_risk: 38, arr: 420000 },
  ];

  // Revenue by customer segment
  const segmentRevenueData = {
    labels: ['Enterprise', 'Mid-Market', 'SMB', 'Self-Serve'],
    datasets: [
      {
        label: 'ARR',
        data: [1850000, 980000, 420000, 180000],
        backgroundColor: CHART_COLORS.slice(0, 4),
      },
    ],
  };

  // Top accounts by revenue
  const topAccounts = [
    { name: 'Acme Corporation', arr: 285000, growth: 42, health: 95, owner: 'Sarah Chen' },
    { name: 'Global Industries Ltd', arr: 198000, growth: 28, health: 88, owner: 'Mike Johnson' },
    { name: 'TechStart Ventures', arr: 156000, growth: -8, health: 62, owner: 'Emma Davis' },
    { name: 'Innovation Labs', arr: 142000, growth: 15, health: 78, owner: 'James Wilson' },
    { name: 'Future Systems Inc', arr: 128000, growth: 55, health: 92, owner: 'Sarah Chen' },
    { name: 'Digital Solutions Co', arr: 118000, growth: 12, health: 82, owner: 'Alex Martinez' },
  ];

  // Churn risks and opportunities
  const accountAlerts = [
    { account: 'Acme Corporation', type: 'opportunity', message: 'Expansion opportunity: $75k upsell', urgency: 'high' },
    { account: 'TechStart Ventures', type: 'risk', message: 'Usage down 35% - renewal in 45 days', urgency: 'critical' },
    { account: 'Digital Solutions Co', type: 'opportunity', message: 'New buyer engaged, cross-sell potential', urgency: 'medium' },
    { account: 'Beta Systems', type: 'risk', message: 'Support tickets increased 3x', urgency: 'high' },
    { account: 'Innovation Labs', type: 'opportunity', message: 'Annual renewal - upsell to Enterprise', urgency: 'medium' },
  ];

  // Sales team performance
  const teamPerformance = [
    { name: 'Sarah Chen', deals: 18, pipeline: 1240000, closed: 680000, quota: 750000 },
    { name: 'Mike Johnson', deals: 15, pipeline: 980000, closed: 520000, quota: 600000 },
    { name: 'Emma Davis', deals: 12, pipeline: 840000, closed: 420000, quota: 550000 },
    { name: 'James Wilson', deals: 14, pipeline: 760000, closed: 380000, quota: 500000 },
    { name: 'Alex Martinez', deals: 11, pipeline: 620000, closed: 340000, quota: 450000 },
  ];

  // Calculate totals
  const totalMRR = 548000;
  const totalARR = totalMRR * 12;
  const netRevenueRetention = 112;
  const avgDealSize = 42000;

  return (
    <Column gap margin="4">
      <Column gap="2">
        <Heading size="9" weight="bold">Revenue Operations</Heading>
        <Text size="4" color="gray">Sales pipeline, revenue drivers, and account health</Text>
      </Column>

      {/* Key Revenue Metrics */}
      <Grid columns={{ xs: 1, md: 2, lg: 4 }} gap>
        <MetricCard
          label="Monthly Recurring Revenue"
          value={totalMRR}
          change={492000}
          showChange={true}
          formatValue={(n) => `$${formatNumber(Math.round(n))}`}
        />
        <MetricCard
          label="Annual Recurring Revenue"
          value={totalARR}
          change={totalARR - 672000}
          showChange={true}
          formatValue={(n) => `$${(Math.round(n / 1000000 * 10) / 10).toFixed(1)}M`}
        />
        <MetricCard
          label="Net Revenue Retention"
          value={netRevenueRetention}
          change={108}
          showChange={true}
          formatValue={(n) => `${Math.round(n)}%`}
        />
        <MetricCard
          label="Avg Deal Size"
          value={avgDealSize}
          change={38500}
          showChange={true}
          formatValue={(n) => `$${formatNumber(Math.round(n))}`}
        />
      </Grid>

      {/* MRR Trend and Revenue Components */}
      <Grid columns={{ xs: 1, lg: 2 }} gap>
        <Panel title="MRR Growth - Last 12 Months">
          <BarChart
            chartData={{
              datasets: [
                {
                  label: 'MRR',
                  data: mrrData,
                  backgroundColor: CHART_COLORS[0],
                  borderColor: CHART_COLORS[0],
                  borderWidth: 1,
                },
              ],
            }}
            unit="month"
            height={280}
            renderYLabel={(value) => `$${(parseInt(value) / 1000).toFixed(0)}k`}
          />
        </Panel>

        <Panel title="Revenue Components - Monthly">
          <BarChart
            chartData={{
              datasets: [
                {
                  label: 'New Revenue',
                  data: revenueBreakdown.map(d => ({ x: d.date, y: d.new })),
                  backgroundColor: CHART_COLORS[2],
                  borderColor: CHART_COLORS[2],
                  borderWidth: 1,
                },
                {
                  label: 'Expansion',
                  data: revenueBreakdown.map(d => ({ x: d.date, y: d.expansion })),
                  backgroundColor: CHART_COLORS[0],
                  borderColor: CHART_COLORS[0],
                  borderWidth: 1,
                },
                {
                  label: 'Churn',
                  data: revenueBreakdown.map(d => ({ x: d.date, y: d.churn })),
                  backgroundColor: CHART_COLORS[4],
                  borderColor: CHART_COLORS[4],
                  borderWidth: 1,
                },
              ],
            }}
            unit="month"
            stacked={true}
            height={280}
            renderYLabel={(value) => `$${(parseInt(value) / 1000).toFixed(0)}k`}
          />
        </Panel>
      </Grid>

      {/* Pipeline and Customer Segments */}
      <Grid columns={{ xs: 1, lg: 2 }} gap>
        <Panel title="Deal Pipeline by Stage">
          <PieChart
            type="doughnut"
            chartData={pipelineData}
            height={300}
          />
          <Column gap="2" paddingY="4">
            <Row justifyContent="space-between">
              <Text size="2" color="gray">Total Pipeline Value</Text>
              <Text weight="bold">$8.21M</Text>
            </Row>
            <Row justifyContent="space-between">
              <Text size="2" color="gray">Weighted Pipeline</Text>
              <Text weight="bold">$3.18M</Text>
            </Row>
          </Column>
        </Panel>

        <Panel title="ARR by Customer Segment">
          <PieChart
            type="doughnut"
            chartData={segmentRevenueData}
            height={300}
          />
          <Column gap="2" paddingY="4">
            <Row justifyContent="space-between">
              <Text size="2" color="gray">Total ARR</Text>
              <Text weight="bold">$3.43M</Text>
            </Row>
            <Row justifyContent="space-between">
              <Text size="2" color="gray">Avg ARR per Customer</Text>
              <Text weight="bold">$5,237</Text>
            </Row>
          </Column>
        </Panel>
      </Grid>

      {/* Customer Health Overview */}
      <Panel title="Customer Health by Segment">
        <Column gap="3" paddingY="2">
          <Row paddingX="4" paddingY="2" style={{ borderBottom: '1px solid #d9d9d9' }}>
            <Grid columns={6} gap="2" style={{ width: '100%' }}>
              <Text weight="bold" size="2">Segment</Text>
              <Text weight="bold" size="2" style={{ textAlign: 'right' }}>Healthy</Text>
              <Text weight="bold" size="2" style={{ textAlign: 'right' }}>At Risk</Text>
              <Text weight="bold" size="2" style={{ textAlign: 'right' }}>Churn Risk</Text>
              <Text weight="bold" size="2" style={{ textAlign: 'right' }}>Total</Text>
              <Text weight="bold" size="2" style={{ textAlign: 'right' }}>ARR</Text>
            </Grid>
          </Row>
          {customerHealthData.map((segment, index) => {
            const total = segment.healthy + segment.at_risk + segment.churn_risk;
            return (
              <Row key={index} paddingX="4" paddingY="3" style={{ borderBottom: '1px solid #f0f0f0' }}>
                <Grid columns={6} gap="2" style={{ width: '100%' }} alignItems="center">
                  <Text weight="bold">{segment.segment}</Text>
                  <Text style={{ textAlign: 'right' }} color="green">{segment.healthy}</Text>
                  <Text style={{ textAlign: 'right' }} color="orange">{segment.at_risk}</Text>
                  <Text style={{ textAlign: 'right' }} color="red">{segment.churn_risk}</Text>
                  <Text style={{ textAlign: 'right' }}>{total}</Text>
                  <Text style={{ textAlign: 'right' }} weight="bold">
                    ${formatNumber(segment.arr)}
                  </Text>
                </Grid>
              </Row>
            );
          })}
        </Column>
      </Panel>

      {/* Account Alerts and Top Accounts */}
      <Grid columns={{ xs: 1, lg: 2 }} gap>
        <Panel title="Account Alerts & Opportunities">
          <Column gap="3" paddingY="2">
            {accountAlerts.map((alert, index) => (
              <Row
                key={index}
                gap="3"
                padding="3"
                borderRadius="2"
                style={{
                  backgroundColor: alert.type === 'risk' ? '#fff5f5' : '#f0f9ff',
                  border: `1px solid ${alert.type === 'risk' ? '#fed7d7' : '#bfdbfe'}`,
                }}
              >
                <div
                  style={{
                    width: '4px',
                    backgroundColor: alert.type === 'risk' ? CHART_COLORS[4] : CHART_COLORS[0],
                    borderRadius: '2px',
                  }}
                />
                <Column gap="1" style={{ flex: 1 }}>
                  <Row justifyContent="space-between" alignItems="center">
                    <Text weight="bold" size="3">{alert.account}</Text>
                    <Text
                      size="1"
                      weight="bold"
                      style={{
                        padding: '2px 8px',
                        borderRadius: '12px',
                        backgroundColor: alert.urgency === 'critical' ? '#fee' : alert.urgency === 'high' ? '#ffe' : '#efe',
                        color: alert.urgency === 'critical' ? '#c00' : alert.urgency === 'high' ? '#c90' : '#090',
                      }}
                    >
                      {alert.urgency.toUpperCase()}
                    </Text>
                  </Row>
                  <Text size="2" color="gray">{alert.message}</Text>
                </Column>
              </Row>
            ))}
          </Column>
        </Panel>

        <Panel title="Top Accounts by ARR">
          <Column gap="2" paddingY="2">
            {topAccounts.map((account, index) => (
              <Column key={index} gap="2" paddingY="2" style={{ borderBottom: index < topAccounts.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                <Row justifyContent="space-between" alignItems="center">
                  <Column gap="1">
                    <Text weight="bold">{account.name}</Text>
                    <Text size="2" color="gray">Owner: {account.owner}</Text>
                  </Column>
                  <Text size="6" weight="bold">${formatNumber(account.arr)}</Text>
                </Row>
                <Row gap="4" alignItems="center">
                  <Row gap="2" alignItems="center">
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: account.health >= 80 ? CHART_COLORS[2] : account.health >= 65 ? CHART_COLORS[5] : CHART_COLORS[4],
                      }}
                    />
                    <Text size="2" color="gray">Health: {account.health}</Text>
                  </Row>
                  <Text size="2" color={account.growth >= 0 ? 'green' : 'red'}>
                    {account.growth >= 0 ? '+' : ''}{account.growth}% Growth
                  </Text>
                </Row>
              </Column>
            ))}
          </Column>
        </Panel>
      </Grid>

      {/* Sales Team Performance */}
      <Panel title="Sales Team Performance - This Quarter">
        <Column gap="3" paddingY="2">
          <Row paddingX="4" paddingY="2" style={{ borderBottom: '1px solid #d9d9d9' }}>
            <Grid columns={6} gap="2" style={{ width: '100%' }}>
              <Text weight="bold" size="2">Rep</Text>
              <Text weight="bold" size="2" style={{ textAlign: 'right' }}>Deals</Text>
              <Text weight="bold" size="2" style={{ textAlign: 'right' }}>Pipeline</Text>
              <Text weight="bold" size="2" style={{ textAlign: 'right' }}>Closed</Text>
              <Text weight="bold" size="2" style={{ textAlign: 'right' }}>Quota</Text>
              <Text weight="bold" size="2" style={{ textAlign: 'right' }}>Attainment</Text>
            </Grid>
          </Row>
          {teamPerformance.map((rep, index) => {
            const attainment = Math.round((rep.closed / rep.quota) * 100);
            return (
              <Row key={index} paddingX="4" paddingY="3" style={{ borderBottom: '1px solid #f0f0f0' }}>
                <Grid columns={6} gap="2" style={{ width: '100%' }} alignItems="center">
                  <Text weight="bold">{rep.name}</Text>
                  <Text style={{ textAlign: 'right' }}>{rep.deals}</Text>
                  <Text style={{ textAlign: 'right' }}>${formatNumber(rep.pipeline / 1000)}k</Text>
                  <Text style={{ textAlign: 'right' }}>${formatNumber(rep.closed / 1000)}k</Text>
                  <Text style={{ textAlign: 'right' }}>${formatNumber(rep.quota / 1000)}k</Text>
                  <Text
                    style={{ textAlign: 'right' }}
                    weight="bold"
                    color={attainment >= 100 ? 'green' : attainment >= 75 ? 'orange' : 'red'}
                  >
                    {attainment}%
                  </Text>
                </Grid>
              </Row>
            );
          })}
        </Column>
      </Panel>
    </Column>
  );
}
