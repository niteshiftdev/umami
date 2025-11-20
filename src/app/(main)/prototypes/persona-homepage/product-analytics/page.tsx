'use client';
import { Column, Row, Grid, Text, Heading } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { MetricCard } from '@/components/metrics/MetricCard';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { ListTable } from '@/components/metrics/ListTable';
import { CHART_COLORS } from '@/lib/constants';
import { formatNumber } from '@/lib/format';

export default function ProductAnalyticsHomepage() {
  // Generate realistic product analytics data with proper date formatting
  const today = new Date();
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (29 - i));
    return date.toISOString().split('T')[0];
  });

  // Generate deterministic data based on index for consistency
  const generateValue = (base: number, variance: number, index: number) => {
    return Math.floor(base + Math.sin(index * 0.5) * variance + (index % 7 === 0 || index % 7 === 6 ? variance * 0.5 : 0));
  };

  // User engagement metrics
  const dailyActiveUsers = last30Days.map((date, i) => ({
    x: date,
    d: date,
    y: generateValue(12000, 2000, i),
  }));

  const sessionDuration = last30Days.map((date, i) => ({
    x: date,
    d: date,
    y: generateValue(180, 40, i),
  }));

  // Feature adoption data
  const featureUsageData = {
    labels: ['Dashboard', 'Reports', 'Search', 'Settings', 'Export', 'Sharing', 'API', 'Integrations'],
    datasets: [
      {
        label: 'Daily Active Users',
        data: [8500, 6200, 5800, 3200, 2100, 1800, 950, 720],
        backgroundColor: CHART_COLORS.slice(0, 8),
      },
    ],
  };

  // User retention cohort
  const retentionData = [
    { name: 'Week 1', value: 10000, change: 0, color: CHART_COLORS[0] },
    { name: 'Week 2', value: 7800, change: -2200, color: CHART_COLORS[1] },
    { name: 'Week 3', value: 6500, change: -1300, color: CHART_COLORS[2] },
    { name: 'Week 4', value: 5900, change: -600, color: CHART_COLORS[3] },
    { name: 'Week 8', value: 5200, change: -700, color: CHART_COLORS[4] },
  ];

  // Funnel conversion data
  const funnelStages = [
    { name: 'Sign Up Started', value: 15000, percentage: 100 },
    { name: 'Email Verified', value: 12750, percentage: 85 },
    { name: 'Profile Completed', value: 10200, percentage: 68 },
    { name: 'First Action', value: 8160, percentage: 54 },
    { name: 'Active User (7d)', value: 6120, percentage: 41 },
  ];

  // Event breakdown
  const topEvents = [
    { name: 'button_click', value: 45280, change: 2340 },
    { name: 'page_view', value: 38920, change: 1820 },
    { name: 'form_submit', value: 12450, change: -340 },
    { name: 'video_play', value: 8760, change: 890 },
    { name: 'file_download', value: 6230, change: 450 },
    { name: 'share_click', value: 4120, change: 280 },
  ];

  return (
    <Column gap margin="4">
      <Column gap="2">
        <Heading size="9" weight="bold">Product Analytics</Heading>
        <Text size="4" color="gray">User engagement metrics and behavior patterns</Text>
      </Column>

      {/* Key Metrics Row */}
      <Grid columns={{ xs: 1, md: 2, lg: 4 }} gap>
        <MetricCard
          label="Daily Active Users"
          value={14250}
          change={12890}
          showChange={true}
          formatValue={formatNumber}
        />
        <MetricCard
          label="Avg Session Duration"
          value={205}
          change={185}
          showChange={true}
          formatValue={(n) => `${Math.round(n)}s`}
        />
        <MetricCard
          label="Feature Adoption"
          value={68}
          change={62}
          showChange={true}
          formatValue={(n) => `${Math.round(n)}%`}
        />
        <MetricCard
          label="7-Day Retention"
          value={41}
          change={38}
          showChange={true}
          formatValue={(n) => `${Math.round(n)}%`}
        />
      </Grid>

      {/* User Engagement Charts */}
      <Grid columns={{ xs: 1, lg: 2 }} gap>
        <Panel title="Daily Active Users - 30 Days">
          <BarChart
            chartData={{
              datasets: [
                {
                  label: 'Users',
                  data: dailyActiveUsers,
                  backgroundColor: CHART_COLORS[0],
                  borderColor: CHART_COLORS[0],
                  borderWidth: 1,
                },
              ],
            }}
            unit="day"
            height={280}
          />
        </Panel>

        <Panel title="Avg Session Duration - 30 Days">
          <BarChart
            chartData={{
              datasets: [
                {
                  label: 'Seconds',
                  data: sessionDuration,
                  backgroundColor: CHART_COLORS[1],
                  borderColor: CHART_COLORS[1],
                  borderWidth: 1,
                },
              ],
            }}
            unit="day"
            height={280}
          />
        </Panel>
      </Grid>

      {/* Feature Usage and Retention */}
      <Grid columns={{ xs: 1, lg: 2 }} gap>
        <Panel title="Feature Usage by DAU">
          <PieChart
            type="doughnut"
            chartData={featureUsageData}
            height={300}
          />
        </Panel>

        <Panel title="User Retention Cohort">
          <Column gap="4" paddingY="4">
            {retentionData.map((item, index) => (
              <Column key={index} gap="2">
                <Row justifyContent="space-between" alignItems="center">
                  <Text weight="bold">{item.name}</Text>
                  <Text size="6" weight="bold">{formatNumber(item.value)}</Text>
                </Row>
                <Row gap="2" alignItems="center">
                  <div
                    style={{
                      height: '8px',
                      width: `${(item.value / 10000) * 100}%`,
                      backgroundColor: item.color,
                      borderRadius: '4px',
                      transition: 'width 0.3s ease',
                    }}
                  />
                  <Text size="2" color="gray">
                    {index > 0 ? `${Math.round((item.value / retentionData[0].value) * 100)}%` : '100%'}
                  </Text>
                </Row>
              </Column>
            ))}
          </Column>
        </Panel>
      </Grid>

      {/* Conversion Funnel */}
      <Panel title="User Activation Funnel">
        <Column gap="4" paddingY="4">
          {funnelStages.map((stage, index) => (
            <Column key={index} gap="2">
              <Row justifyContent="space-between" alignItems="center">
                <Text weight="bold">{stage.name}</Text>
                <Row gap="4" alignItems="center">
                  <Text size="2" color="gray">{stage.percentage}%</Text>
                  <Text size="6" weight="bold">{formatNumber(stage.value)}</Text>
                </Row>
              </Row>
              <div
                style={{
                  height: '12px',
                  width: `${stage.percentage}%`,
                  backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                  borderRadius: '6px',
                  transition: 'width 0.3s ease',
                }}
              />
            </Column>
          ))}
        </Column>
      </Panel>

      {/* Top Events Table */}
      <Panel title="Top Events - Last 24 Hours">
        <ListTable
          data={topEvents.map((event, index) => ({
            label: event.name,
            count: event.value,
            percent: (event.value / topEvents[0].value) * 100,
            color: CHART_COLORS[index % CHART_COLORS.length],
          }))}
          metric="Events"
          renderLabel={(row: any) => (
            <Row gap="2" alignItems="center">
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: row.color,
                }}
              />
              <Text>{row.label}</Text>
            </Row>
          )}
        />
      </Panel>
    </Column>
  );
}
