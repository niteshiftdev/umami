'use client';
import { Column, Row, Grid, Text, Heading } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { MetricCard } from '@/components/metrics/MetricCard';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { ListTable } from '@/components/metrics/ListTable';
import { CHART_COLORS } from '@/lib/constants';
import { formatNumber } from '@/lib/format';

export default function HybridDashboardHomepage() {
  // Generate comprehensive business intelligence data
  const today = new Date();
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (29 - i));
    return date;
  });

  // Combined revenue and engagement metrics
  const revenueData = last30Days.map(date => ({
    x: date.getTime(),
    y: Math.floor(18000 + Math.random() * 4000 + Math.sin(date.getDay() / 7 * Math.PI) * 2000),
  }));

  const activeUsersData = last30Days.map(date => ({
    x: date.getTime(),
    y: Math.floor(8500 + Math.random() * 1500 + Math.sin(date.getDay() / 7 * Math.PI) * 1000),
  }));

  const conversionsData = last30Days.map(date => ({
    x: date.getTime(),
    y: Math.floor(280 + Math.random() * 80 + Math.sin(date.getDay() / 7 * Math.PI) * 40),
  }));

  // Business health metrics
  const healthMetrics = [
    { category: 'Revenue', score: 92, trend: 'up', data: '$548K MRR' },
    { category: 'User Growth', score: 85, trend: 'up', data: '+12% MoM' },
    { category: 'Engagement', score: 78, trend: 'stable', data: '4.2 sessions/user' },
    { category: 'Retention', score: 88, trend: 'up', data: '112% NRR' },
    { category: 'Marketing ROI', score: 82, trend: 'up', data: '3.8x ROAS' },
    { category: 'Sales Pipeline', score: 75, trend: 'down', data: '$8.2M pipeline' },
  ];

  // Multi-dimensional performance by channel
  const channelPerformance = [
    {
      channel: 'Organic Search',
      sessions: 38200,
      users: 24500,
      conversions: 1248,
      revenue: 52480,
      engagement: 4.8,
    },
    {
      channel: 'Paid Search',
      sessions: 24500,
      users: 18900,
      conversions: 982,
      revenue: 41328,
      engagement: 3.2,
    },
    {
      channel: 'Direct',
      sessions: 18900,
      users: 12600,
      conversions: 756,
      revenue: 31752,
      engagement: 5.6,
    },
    {
      channel: 'Social Media',
      sessions: 12600,
      users: 10400,
      conversions: 504,
      revenue: 21168,
      engagement: 2.8,
    },
    {
      channel: 'Email',
      sessions: 10400,
      users: 8200,
      conversions: 624,
      revenue: 26208,
      engagement: 6.2,
    },
  ];

  // Customer lifecycle metrics
  const lifecycleData = {
    labels: ['Awareness', 'Consideration', 'Purchase', 'Retention', 'Advocacy'],
    datasets: [
      {
        label: 'Customers',
        data: [42800, 18900, 8420, 6240, 2180],
        backgroundColor: CHART_COLORS.slice(0, 5),
      },
    ],
  };

  // Top insights and alerts
  const businessInsights = [
    {
      type: 'opportunity',
      priority: 'high',
      title: 'Email campaigns driving 6x engagement',
      description: 'Email traffic shows highest session depth at 6.2 pages/session',
      metric: '+45% vs avg',
      action: 'Increase email frequency',
    },
    {
      type: 'risk',
      priority: 'critical',
      title: 'Pipeline velocity declining',
      description: 'Average deal cycle extended from 42 to 58 days',
      metric: '+38% cycle time',
      action: 'Review sales process',
    },
    {
      type: 'achievement',
      priority: 'medium',
      title: 'Product adoption milestone reached',
      description: '68% of users activated core feature within first week',
      metric: '12% above target',
      action: 'Document best practices',
    },
    {
      type: 'opportunity',
      priority: 'high',
      title: 'Organic search traffic surging',
      description: 'SEO improvements driving 42% increase in qualified organic leads',
      metric: '+42% MoM',
      action: 'Scale content strategy',
    },
  ];

  // Revenue breakdown by source
  const revenueBySource = {
    labels: ['Product Sales', 'Subscriptions', 'Professional Services', 'Marketplace'],
    datasets: [
      {
        label: 'Revenue',
        data: [312000, 198000, 68000, 42000],
        backgroundColor: CHART_COLORS.slice(0, 4),
      },
    ],
  };

  // Key account activity
  const accountActivity = [
    { account: 'Acme Corporation', activity: 'Renewed + $75K expansion', impact: 'high', timestamp: '2h ago' },
    { account: 'TechStart Ventures', activity: 'Usage dropped 35%', impact: 'critical', timestamp: '4h ago' },
    { account: 'Global Industries', activity: 'New user onboarded', impact: 'medium', timestamp: '6h ago' },
    { account: 'Innovation Labs', activity: 'Requested demo of new feature', impact: 'high', timestamp: '8h ago' },
    { account: 'Digital Solutions', activity: 'Support ticket escalated', impact: 'medium', timestamp: '12h ago' },
  ];

  // Cross-functional KPIs
  const kpiData = [
    { kpi: 'Customer Acquisition Cost', value: 2840, target: 3000, unit: '$' },
    { kpi: 'Lifetime Value', value: 12600, target: 10000, unit: '$' },
    { kpi: 'LTV:CAC Ratio', value: 4.4, target: 3.0, unit: 'x' },
    { kpi: 'Monthly Active Users', value: 14250, target: 12000, unit: '' },
    { kpi: 'Net Promoter Score', value: 68, target: 50, unit: '' },
    { kpi: 'Churn Rate', value: 3.2, target: 5.0, unit: '%', reverseGood: true },
  ];

  return (
    <Column gap margin="4">
      <Column gap="2">
        <Heading size="9" weight="bold">Business Intelligence Dashboard</Heading>
        <Text size="4" color="gray">Unified view across product, marketing, and revenue</Text>
      </Column>

      {/* Executive Metrics - Top Level */}
      <Grid columns={{ xs: 1, md: 2, lg: 4 }} gap>
        <MetricCard
          label="Monthly Revenue"
          value={548000}
          change={492000}
          showChange={true}
          formatValue={(n) => `$${formatNumber(Math.round(n))}`}
        />
        <MetricCard
          label="Active Users"
          value={14250}
          change={12890}
          showChange={true}
          formatValue={formatNumber}
        />
        <MetricCard
          label="Conversion Rate"
          value={4.2}
          change={3.8}
          showChange={true}
          formatValue={(n) => `${n.toFixed(1)}%`}
        />
        <MetricCard
          label="Net Revenue Retention"
          value={112}
          change={108}
          showChange={true}
          formatValue={(n) => `${Math.round(n)}%`}
        />
      </Grid>

      {/* Business Health Scorecard */}
      <Panel title="Business Health Scorecard">
        <Grid columns={{ xs: 1, md: 2, lg: 3 }} gap="4" paddingY="4">
          {healthMetrics.map((metric, index) => (
            <Column key={index} gap="2" padding="3" borderRadius="2" border>
              <Row justifyContent="space-between" alignItems="center">
                <Text weight="bold">{metric.category}</Text>
                <Text size="6" weight="bold" color={metric.score >= 80 ? 'green' : metric.score >= 65 ? 'orange' : 'red'}>
                  {metric.score}
                </Text>
              </Row>
              <Text size="2" color="gray">{metric.data}</Text>
              <Row gap="2" alignItems="center">
                <div
                  style={{
                    width: '100%',
                    height: '6px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '3px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${metric.score}%`,
                      height: '100%',
                      backgroundColor: metric.score >= 80 ? CHART_COLORS[2] : metric.score >= 65 ? CHART_COLORS[5] : CHART_COLORS[4],
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
                <Text size="1" weight="bold" color={metric.trend === 'up' ? 'green' : metric.trend === 'down' ? 'red' : 'gray'}>
                  {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
                </Text>
              </Row>
            </Column>
          ))}
        </Grid>
      </Panel>

      {/* Combined Performance Trends */}
      <Panel title="Key Performance Trends - Last 30 Days">
        <BarChart
          chartData={{
            datasets: [
              {
                label: 'Daily Revenue',
                data: revenueData,
                backgroundColor: CHART_COLORS[0],
                borderColor: CHART_COLORS[0],
                borderWidth: 1,
                yAxisID: 'y',
              },
              {
                label: 'Active Users',
                data: activeUsersData,
                backgroundColor: CHART_COLORS[2],
                borderColor: CHART_COLORS[2],
                borderWidth: 1,
                yAxisID: 'y1',
              },
              {
                label: 'Conversions',
                data: conversionsData,
                backgroundColor: CHART_COLORS[5],
                borderColor: CHART_COLORS[5],
                borderWidth: 1,
                yAxisID: 'y2',
              },
            ],
          }}
          unit="day"
          height={320}
        />
      </Panel>

      {/* Business Insights and Alerts */}
      <Panel title="Business Insights & Alerts">
        <Column gap="3" paddingY="2">
          {businessInsights.map((insight, index) => {
            const bgColor = insight.type === 'risk' ? '#fff5f5' : insight.type === 'opportunity' ? '#f0f9ff' : '#f0fff4';
            const borderColor = insight.type === 'risk' ? '#fed7d7' : insight.type === 'opportunity' ? '#bfdbfe' : '#c6f6d5';
            const accentColor = insight.type === 'risk' ? CHART_COLORS[4] : insight.type === 'opportunity' ? CHART_COLORS[0] : CHART_COLORS[2];

            return (
              <Row
                key={index}
                gap="3"
                padding="3"
                borderRadius="2"
                style={{
                  backgroundColor: bgColor,
                  border: `1px solid ${borderColor}`,
                }}
              >
                <div
                  style={{
                    width: '4px',
                    backgroundColor: accentColor,
                    borderRadius: '2px',
                  }}
                />
                <Column gap="2" style={{ flex: 1 }}>
                  <Row justifyContent="space-between" alignItems="center">
                    <Text weight="bold" size="3">{insight.title}</Text>
                    <Row gap="2" alignItems="center">
                      <Text
                        size="1"
                        weight="bold"
                        style={{
                          padding: '2px 8px',
                          borderRadius: '12px',
                          backgroundColor: insight.priority === 'critical' ? '#fee' : insight.priority === 'high' ? '#ffe' : '#efe',
                          color: insight.priority === 'critical' ? '#c00' : insight.priority === 'high' ? '#c90' : '#090',
                        }}
                      >
                        {insight.priority.toUpperCase()}
                      </Text>
                      <Text size="2" weight="bold" color={insight.type === 'risk' ? 'red' : 'green'}>
                        {insight.metric}
                      </Text>
                    </Row>
                  </Row>
                  <Text size="2" color="gray">{insight.description}</Text>
                  <Text size="2" weight="bold" style={{ color: accentColor }}>
                    → {insight.action}
                  </Text>
                </Column>
              </Row>
            );
          })}
        </Column>
      </Panel>

      {/* Revenue Sources and Customer Lifecycle */}
      <Grid columns={{ xs: 1, lg: 2 }} gap>
        <Panel title="Revenue by Source">
          <PieChart
            type="doughnut"
            chartData={revenueBySource}
            height={280}
          />
          <Column gap="2" paddingY="3">
            <Row justifyContent="space-between">
              <Text size="2" color="gray">Total Monthly Revenue</Text>
              <Text weight="bold">$620,000</Text>
            </Row>
            <Row justifyContent="space-between">
              <Text size="2" color="gray">YoY Growth</Text>
              <Text weight="bold" color="green">+28%</Text>
            </Row>
          </Column>
        </Panel>

        <Panel title="Customer Lifecycle Funnel">
          <PieChart
            type="doughnut"
            chartData={lifecycleData}
            height={280}
          />
          <Column gap="2" paddingY="3">
            <Row justifyContent="space-between">
              <Text size="2" color="gray">Awareness → Advocacy</Text>
              <Text weight="bold">5.1% conversion</Text>
            </Row>
            <Row justifyContent="space-between">
              <Text size="2" color="gray">Active Advocates</Text>
              <Text weight="bold">2,180 customers</Text>
            </Row>
          </Column>
        </Panel>
      </Grid>

      {/* Channel Performance Table */}
      <Panel title="Integrated Channel Performance">
        <Column gap="3" paddingY="2">
          <Row paddingX="4" paddingY="2" style={{ borderBottom: '1px solid #d9d9d9' }}>
            <Grid columns={7} gap="2" style={{ width: '100%' }}>
              <Text weight="bold" size="2">Channel</Text>
              <Text weight="bold" size="2" style={{ textAlign: 'right' }}>Sessions</Text>
              <Text weight="bold" size="2" style={{ textAlign: 'right' }}>Users</Text>
              <Text weight="bold" size="2" style={{ textAlign: 'right' }}>Conv.</Text>
              <Text weight="bold" size="2" style={{ textAlign: 'right' }}>CVR</Text>
              <Text weight="bold" size="2" style={{ textAlign: 'right' }}>Revenue</Text>
              <Text weight="bold" size="2" style={{ textAlign: 'right' }}>Eng.</Text>
            </Grid>
          </Row>
          {channelPerformance.map((channel, index) => {
            const cvr = ((channel.conversions / channel.sessions) * 100).toFixed(1);
            return (
              <Row key={index} paddingX="4" paddingY="3" style={{ borderBottom: '1px solid #f0f0f0' }}>
                <Grid columns={7} gap="2" style={{ width: '100%' }} alignItems="center">
                  <Row gap="2" alignItems="center">
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                      }}
                    />
                    <Text weight="bold">{channel.channel}</Text>
                  </Row>
                  <Text style={{ textAlign: 'right' }}>{formatNumber(channel.sessions)}</Text>
                  <Text style={{ textAlign: 'right' }}>{formatNumber(channel.users)}</Text>
                  <Text style={{ textAlign: 'right' }}>{formatNumber(channel.conversions)}</Text>
                  <Text style={{ textAlign: 'right' }} color={parseFloat(cvr) >= 4 ? 'green' : 'gray'}>
                    {cvr}%
                  </Text>
                  <Text style={{ textAlign: 'right' }} weight="bold">
                    ${formatNumber(channel.revenue)}
                  </Text>
                  <Text style={{ textAlign: 'right' }} color={channel.engagement >= 5 ? 'green' : 'gray'}>
                    {channel.engagement.toFixed(1)}
                  </Text>
                </Grid>
              </Row>
            );
          })}
        </Column>
      </Panel>

      {/* Cross-Functional KPIs and Account Activity */}
      <Grid columns={{ xs: 1, lg: 2 }} gap>
        <Panel title="Cross-Functional KPIs">
          <Column gap="3" paddingY="2">
            {kpiData.map((kpi, index) => {
              const performance = kpi.reverseGood
                ? (kpi.target / kpi.value) * 100
                : (kpi.value / kpi.target) * 100;
              const isGood = performance >= 100;

              return (
                <Column key={index} gap="2">
                  <Row justifyContent="space-between" alignItems="center">
                    <Text weight="bold">{kpi.kpi}</Text>
                    <Row gap="2" alignItems="center">
                      <Text size="6" weight="bold" color={isGood ? 'green' : 'orange'}>
                        {kpi.unit === '$' ? '$' : ''}
                        {formatNumber(kpi.value)}
                        {kpi.unit !== '$' ? kpi.unit : ''}
                      </Text>
                    </Row>
                  </Row>
                  <Row gap="2" alignItems="center">
                    <div
                      style={{
                        width: '100%',
                        height: '6px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '3px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.min(performance, 150)}%`,
                          height: '100%',
                          backgroundColor: isGood ? CHART_COLORS[2] : CHART_COLORS[5],
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                    <Text size="2" color="gray">
                      Target: {kpi.unit === '$' ? '$' : ''}{formatNumber(kpi.target)}{kpi.unit !== '$' ? kpi.unit : ''}
                    </Text>
                  </Row>
                </Column>
              );
            })}
          </Column>
        </Panel>

        <Panel title="Recent Account Activity">
          <Column gap="3" paddingY="2">
            {accountActivity.map((activity, index) => {
              const impactColor = activity.impact === 'critical' ? CHART_COLORS[4] : activity.impact === 'high' ? CHART_COLORS[0] : CHART_COLORS[5];
              const bgColor = activity.impact === 'critical' ? '#fff5f5' : activity.impact === 'high' ? '#f0f9ff' : '#f9f9f9';

              return (
                <Row
                  key={index}
                  gap="3"
                  padding="3"
                  borderRadius="2"
                  style={{
                    backgroundColor: bgColor,
                    border: '1px solid #e0e0e0',
                  }}
                >
                  <div
                    style={{
                      width: '4px',
                      backgroundColor: impactColor,
                      borderRadius: '2px',
                    }}
                  />
                  <Column gap="1" style={{ flex: 1 }}>
                    <Row justifyContent="space-between" alignItems="center">
                      <Text weight="bold" size="3">{activity.account}</Text>
                      <Text size="1" color="gray">{activity.timestamp}</Text>
                    </Row>
                    <Text size="2">{activity.activity}</Text>
                  </Column>
                </Row>
              );
            })}
          </Column>
        </Panel>
      </Grid>
    </Column>
  );
}
