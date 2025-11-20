'use client';

import { Column, Row, Grid, Heading, Text, Box, Badge } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { PageBody } from '@/components/common/PageBody';
import { LoadingPanel } from '@/components/common/LoadingPanel';
import { Chart } from '@/components/charts/Chart';
import { CHART_COLORS } from '@/lib/constants';

// Mock data
const retentionChart = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
  datasets: [
    {
      type: 'line',
      label: 'Day 1 Cohort',
      data: [100, 85, 72, 61, 53, 48, 43, 38],
      borderColor: CHART_COLORS[0],
      fill: false,
      tension: 0.4,
    },
    {
      type: 'line',
      label: 'Day 7 Cohort',
      data: [null, 100, 78, 62, 51, 45, 40, 35],
      borderColor: CHART_COLORS[1],
      fill: false,
      tension: 0.4,
    },
    {
      type: 'line',
      label: 'Day 30 Cohort',
      data: [null, null, 100, 69, 54, 47, 41, 36],
      borderColor: CHART_COLORS[2],
      fill: false,
      tension: 0.4,
    },
  ],
};

const funnelChart = {
  labels: ['Sign Up', 'Email Verified', 'First Login', 'Dashboard Visit', 'Add Data Source', 'First Report'],
  datasets: [
    {
      type: 'bar',
      data: [1000, 845, 723, 612, 489, 342],
      backgroundColor: CHART_COLORS,
    },
  ],
};

const features = [
  { name: 'Dashboard Views', dailyActive: 2834, weeklyActive: 8945, usageRate: 89.4, trend: 12 },
  { name: 'Report Generation', dailyActive: 1567, weeklyActive: 5234, usageRate: 52.3, trend: 8 },
  { name: 'Data Export', dailyActive: 892, weeklyActive: 3456, usageRate: 34.5, trend: -2 },
  { name: 'Sharing Features', dailyActive: 756, weeklyActive: 2890, usageRate: 28.9, trend: 15 },
  { name: 'API Access', dailyActive: 543, weeklyActive: 1876, usageRate: 18.8, trend: 22 },
  { name: 'Custom Alerts', dailyActive: 234, weeklyActive: 876, usageRate: 8.7, trend: 5 },
];

const cohortData = [
  { cohort: 'Jan 2024', size: 1234, m0: 100, m1: 78, m2: 61, m3: 48, m4: 39, m5: 33, m6: 28 },
  { cohort: 'Feb 2024', size: 1890, m0: 100, m1: 82, m2: 65, m3: 52, m4: 43, m5: 36, m6: 30 },
  { cohort: 'Mar 2024', size: 2456, m0: 100, m1: 85, m2: 68, m3: 55, m4: 46, m5: 39, m6: null },
  { cohort: 'Apr 2024', size: 2890, m0: 100, m1: 81, m2: 64, m3: 51, m4: null, m5: null, m6: null },
  { cohort: 'May 2024', size: 3123, m0: 100, m1: 79, m2: 62, m3: null, m4: null, m5: null, m6: null },
  { cohort: 'Jun 2024', size: 3567, m0: 100, m1: 80, m2: null, m3: null, m4: null, m5: null, m6: null },
  { cohort: 'Jul 2024', size: 4012, m0: 100, m1: null, m2: null, m3: null, m4: null, m5: null, m6: null },
];

export default function ProductUsage() {
  return (
    <PageBody gap>
      <Row justifyContent="space-between" alignItems="flex-start">
        <Column gap="1">
          <Heading level={1}>Product Usage & Retention</Heading>
          <Text color="muted">Monitor feature adoption, user retention cohorts, and engagement funnels</Text>
        </Column>
      </Row>

      {/* Key Metrics */}
      <Grid columns={{ xs: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }} gap="2">
        {[
          { label: 'DAU', value: '3,456', subtext: 'Daily Active Users', color: CHART_COLORS[0] },
          { label: 'WAU', value: '8,923', subtext: 'Weekly Active Users', color: CHART_COLORS[1] },
          { label: 'MAU', value: '12,534', subtext: 'Monthly Active Users', color: CHART_COLORS[2] },
          { label: 'D30 Retention', value: '38%', subtext: 'Day 30 Retention Rate', color: CHART_COLORS[3] },
        ].map((metric, idx) => (
          <Box
            key={metric.label}
            padding="3"
            borderRadius="2"
            style={{
              border: `2px solid ${metric.color}30`,
              borderLeft: `4px solid ${metric.color}`,
              background: 'var(--color-background-secondary)',
            }}
          >
            <Text size="sm" color="muted">
              {metric.label}
            </Text>
            <Heading level={2} style={{ margin: '8px 0' }}>
              {metric.value}
            </Heading>
            <Text size="xs" color="muted">
              {metric.subtext}
            </Text>
          </Box>
        ))}
      </Grid>

      {/* Retention Cohorts */}
      <Panel title="User Retention Cohorts">
        <Box height="300px">
          <Chart type="line" chartData={retentionChart} height="100%" />
        </Box>
      </Panel>

      {/* Feature Adoption */}
      <Panel title="Feature Adoption & Usage">
        <LoadingPanel data={features} isLoading={false} error={null}>
          <Column gap="2">
            {features.map((feature, idx) => (
              <Box
                key={feature.name}
                padding="3"
                borderRadius="2"
                style={{ background: 'var(--color-background)' }}
              >
                <Row justifyContent="space-between" alignItems="start" margin="0 0 12px 0">
                  <Column gap="1" style={{ flex: 1 }}>
                    <Text weight={500}>{feature.name}</Text>
                    <Row gap="2" alignItems="center">
                      <Text size="xs" color="muted">
                        {feature.dailyActive.toLocaleString()} DAU
                      </Text>
                      <Text size="xs" color="muted">
                        •
                      </Text>
                      <Text size="xs" color="muted">
                        {feature.weeklyActive.toLocaleString()} WAU
                      </Text>
                    </Row>
                  </Column>
                  <Column gap="1" style={{ textAlign: 'right' }}>
                    <Text weight={500}>{feature.usageRate}%</Text>
                    <Badge color={feature.trend > 0 ? 'success' : 'default'} size="sm">
                      {feature.trend > 0 ? '+' : ''}{feature.trend}%
                    </Badge>
                  </Column>
                </Row>

                <Box height="4px" backgroundColor="1" borderRadius="full" overflow="hidden">
                  <Box
                    height="100%"
                    backgroundColor={CHART_COLORS[idx % CHART_COLORS.length]}
                    width={`${feature.usageRate}%`}
                  />
                </Box>
              </Box>
            ))}
          </Column>
        </LoadingPanel>
      </Panel>

      {/* Funnel & Cohorts */}
      <Grid columns={{ xs: '1fr', lg: '1fr 1fr' }} gap="3">
        <Panel title="Onboarding Funnel">
          <Box height="300px">
            <Chart type="bar" chartData={funnelChart} height="100%" />
          </Box>
          <Column gap="2" margin="16px 0 0 0">
            {[
              { step: 'Sign Up', count: 1000, dropoff: '-' },
              { step: 'Email Verified', count: 845, dropoff: '15.5%' },
              { step: 'First Login', count: 723, dropoff: '14.4%' },
              { step: 'Dashboard Visit', count: 612, dropoff: '15.4%' },
              { step: 'Add Data Source', count: 489, dropoff: '20.1%' },
              { step: 'First Report', count: 342, dropoff: '30.1%' },
            ].map((step, idx) => (
              <Row key={step.step} justifyContent="space-between" padding="2" style={{ fontSize: '12px' }}>
                <Text size="xs">{step.step}</Text>
                <Text size="xs" color="muted">
                  {step.count} users {step.dropoff !== '-' && `(${step.dropoff} dropoff)`}
                </Text>
              </Row>
            ))}
          </Column>
        </Panel>

        <Panel title="Cohort Retention Matrix">
          <Box
            style={{
              overflowX: 'auto',
              fontSize: '12px',
            }}
          >
            <Box style={{ minWidth: '600px' }}>
              <Row
                padding="2"
                style={{
                  background: 'var(--color-background)',
                  borderBottom: '1px solid var(--color-border)',
                  fontWeight: 500,
                }}
              >
                <Box style={{ width: '80px' }}>
                  <Text size="xs" weight={500}>
                    Cohort
                  </Text>
                </Box>
                {[0, 1, 2, 3, 4, 5, 6].map((month) => (
                  <Box key={month} style={{ flex: 1, textAlign: 'center' }}>
                    <Text size="xs">M{month}</Text>
                  </Box>
                ))}
              </Row>
              {cohortData.map((row) => (
                <Row key={row.cohort} padding="2" style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <Box style={{ width: '80px' }}>
                    <Text size="xs">{row.cohort}</Text>
                  </Box>
                  {[row.m0, row.m1, row.m2, row.m3, row.m4, row.m5, row.m6].map((value, idx) => (
                    <Box
                      key={idx}
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        background:
                          value === null
                            ? 'transparent'
                            : value >= 75
                              ? '#44b55620'
                              : value >= 50
                                ? '#FFA50020'
                                : '#e3485020',
                        borderRadius: '4px',
                      }}
                    >
                      <Text size="xs" weight={500}>
                        {value === null ? '-' : `${value}%`}
                      </Text>
                    </Box>
                  ))}
                </Row>
              ))}
            </Box>
          </Box>
        </Panel>
      </Grid>

      {/* Session Insights */}
      <Panel title="Session Insights">
        <Grid columns={{ xs: '1fr', md: '1fr 1fr 1fr 1fr' }} gap="2">
          {[
            { label: 'Avg Session Duration', value: '8m 24s', subtext: '+2m 15s vs last month' },
            { label: 'Sessions per User', value: '12.3', subtext: '+1.2 vs last month' },
            { label: 'Bounce Rate', value: '22.5%', subtext: '-3.2% vs last month' },
            { label: 'New vs Returning', value: '35% / 65%', subtext: '+5% new user growth' },
          ].map((insight) => (
            <Box key={insight.label} padding="3" borderRadius="2" style={{ background: 'var(--color-background)' }}>
              <Text size="sm" color="muted">
                {insight.label}
              </Text>
              <Heading level={3} style={{ margin: '8px 0' }}>
                {insight.value}
              </Heading>
              <Text size="xs" color="muted">
                {insight.subtext}
              </Text>
            </Box>
          ))}
        </Grid>
      </Panel>
    </PageBody>
  );
}
