'use client';
/**
 * Product Analytics - Dial 2: "Visual Focus"
 * Design exploration: Larger visualizations, cooler color palette, more whitespace
 * Focus: Visual impact, blue/purple tones, generous spacing, large typography
 */
import { useMemo, useCallback } from 'react';
import { Column, Row, Grid, Heading, Text, useTheme } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { Panel } from '@/components/common/Panel';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { getThemeColors } from '@/lib/colors';
import { renderDateLabels } from '@/lib/charts';
import { formatNumber } from '@/lib/format';
import { Overview } from '@/components/svg';

// Cool color palette
const COOL_COLORS = ['#2680eb', '#9256d9', '#01bad7', '#6734bc', '#44b556', '#f7bd12'];

function generateEngagementData() {
  const today = new Date();
  const data = [];
  for (let i = 13; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseActive = isWeekend ? 8500 : 12000;
    data.push({ x: dateStr, y: Math.round(baseActive + Math.random() * 3000 - 1500) });
  }
  return data;
}

function generateSessionData() {
  const today = new Date();
  const data = [];
  for (let i = 13; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    data.push({ x: dateStr, y: Math.round((isWeekend ? 4.2 : 5.8) + Math.random() * 1.5 - 0.75) });
  }
  return data;
}

const userSegments = [
  { segment: 'Power Users', count: 2845, percentage: 12.4 },
  { segment: 'Regular Users', count: 8932, percentage: 38.9 },
  { segment: 'Occasional Users', count: 7621, percentage: 33.2 },
  { segment: 'New Users', count: 3562, percentage: 15.5 },
];

// Large metric card with emphasis
function LargeMetric({ label, value, sublabel }: { label: string; value: string; sublabel?: string }) {
  return (
    <Column paddingX="6" paddingY="5" borderRadius="3" backgroundColor border gap="2" alignItems="center">
      <Text size="2" color="muted" weight="bold" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
        {label}
      </Text>
      <Text style={{ fontSize: 42, fontWeight: 700, lineHeight: 1, color: COOL_COLORS[0] }}>
        {value}
      </Text>
      {sublabel && (
        <Text size="2" color="muted">
          {sublabel}
        </Text>
      )}
    </Column>
  );
}

export default function ProductAnalyticsDial2Page() {
  const { theme } = useTheme();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  const engagementData = useMemo(() => generateEngagementData(), []);
  const sessionData = useMemo(() => generateSessionData(), []);

  const today = new Date();
  const twoWeeksAgo = new Date(today);
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 13);

  const engagementChartData = useMemo(
    () => ({
      datasets: [
        {
          type: 'bar' as const,
          label: 'Daily Active Users',
          data: engagementData,
          backgroundColor: COOL_COLORS[0],
          borderColor: COOL_COLORS[0],
          borderWidth: 0,
          barPercentage: 0.6,
          categoryPercentage: 0.7,
          borderRadius: 4,
        },
      ],
    }),
    [engagementData],
  );

  const sessionChartData = useMemo(
    () => ({
      datasets: [
        {
          type: 'bar' as const,
          label: 'Sessions per User',
          data: sessionData,
          backgroundColor: COOL_COLORS[1],
          borderColor: COOL_COLORS[1],
          borderWidth: 0,
          barPercentage: 0.6,
          categoryPercentage: 0.7,
          borderRadius: 4,
        },
      ],
    }),
    [sessionData],
  );

  const segmentPieData = useMemo(
    () => ({
      labels: userSegments.map(s => s.segment),
      datasets: [
        {
          data: userSegments.map(s => s.count),
          backgroundColor: COOL_COLORS.slice(0, userSegments.length),
          borderWidth: 0,
        },
      ],
    }),
    [],
  );

  const renderXLabel = useCallback(renderDateLabels('day', 'en-US'), []);

  return (
    <PageBody>
      <PageHeader title="Product Analytics" icon={<Overview />} description="Visual Focus Layout - Cool Palette" />

      {/* Large Hero Metrics */}
      <Grid columns={{ xs: '1fr', md: 'repeat(4, 1fr)' }} gap="4">
        <LargeMetric label="Daily Active" value="22.9K" sublabel="+7.0% vs last period" />
        <LargeMetric label="Monthly Active" value="156K" sublabel="+5.0% vs last period" />
        <LargeMetric label="Avg Sessions" value="5.2" sublabel="per user per day" />
        <LargeMetric label="Retention" value="42.3%" sublabel="7-day retention" />
      </Grid>

      {/* Primary Chart - Large */}
      <Panel title="User Engagement Trend">
        <BarChart
          chartData={engagementChartData}
          unit="day"
          minDate={twoWeeksAgo}
          maxDate={today}
          renderXLabel={renderXLabel}
          height="380px"
        />
      </Panel>

      {/* Secondary Charts */}
      <Grid columns={{ xs: '1fr', md: '1fr 1fr' }} gap="4">
        <Panel title="Sessions per User">
          <BarChart
            chartData={sessionChartData}
            unit="day"
            minDate={twoWeeksAgo}
            maxDate={today}
            renderXLabel={renderXLabel}
            height="300px"
          />
        </Panel>

        <Panel title="User Segment Distribution">
          <Column gap="4" paddingY="3">
            <Row justifyContent="center">
              <PieChart type="doughnut" chartData={segmentPieData} width="220px" height="220px" />
            </Row>
            <Column gap="2" paddingX="4">
              {userSegments.map((item, idx) => (
                <Row key={idx} justifyContent="space-between" alignItems="center">
                  <Row gap="3" alignItems="center">
                    <div style={{ width: 16, height: 16, borderRadius: 4, backgroundColor: COOL_COLORS[idx] }} />
                    <Text size="2" weight="bold">{item.segment}</Text>
                  </Row>
                  <Row gap="4">
                    <Text size="2" color="muted">{formatNumber(item.count)}</Text>
                    <Text size="2" weight="bold">{item.percentage}%</Text>
                  </Row>
                </Row>
              ))}
            </Column>
          </Column>
        </Panel>
      </Grid>
    </PageBody>
  );
}
