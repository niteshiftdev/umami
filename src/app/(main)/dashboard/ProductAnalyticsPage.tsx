'use client';
import { Column, Row, Text, useTheme } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { Panel } from '@/components/common/Panel';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { useMessages } from '@/components/hooks';
import { getThemeColors } from '@/lib/colors';
import { CHART_COLORS } from '@/lib/constants';
import { useMemo } from 'react';
import { formatLongNumber } from '@/lib/format';

export function ProductAnalyticsPage() {
  const { formatMessage, labels } = useMessages();
  const { theme } = useTheme();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  // Mock data - User Engagement Metrics
  const totalUsers = 24567;
  const activeUsers = 18234;
  const avgSessionDuration = 342; // seconds
  const engagementRate = 74.2;
  const previousTotalUsers = 22103;
  const previousActiveUsers = 16891;

  // Mock data - User Activity Time Series (last 30 days)
  const now = new Date();
  const activityData = useMemo(() => {
    const datasets = [];
    const newUsers = [];
    const returningUsers = [];

    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      // Simulate realistic user patterns with weekly cycles
      const dayOfWeek = date.getDay();
      const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.7 : 1.0;
      const trendMultiplier = 1 + (29 - i) * 0.01; // Growth trend

      const newUserCount = Math.floor((150 + Math.random() * 100) * weekendMultiplier * trendMultiplier);
      const returningUserCount = Math.floor((400 + Math.random() * 150) * weekendMultiplier * trendMultiplier);

      newUsers.push({ x: date.getTime(), y: newUserCount });
      returningUsers.push({ x: date.getTime(), y: returningUserCount });
    }

    datasets.push({
      label: 'New Users',
      data: newUsers,
      backgroundColor: `${CHART_COLORS[0]}80`,
      borderColor: CHART_COLORS[0],
      borderWidth: 1,
    });

    datasets.push({
      label: 'Returning Users',
      data: returningUsers,
      backgroundColor: `${CHART_COLORS[2]}80`,
      borderColor: CHART_COLORS[2],
      borderWidth: 1,
    });

    return { datasets };
  }, []);

  // Mock data - Feature Adoption
  const featureAdoptionData = useMemo(() => {
    const features = [
      { x: 'Dashboard', y: 8934 },
      { x: 'Reports', y: 6521 },
      { x: 'Analytics', y: 5892 },
      { x: 'Exports', y: 4231 },
      { x: 'API Access', y: 2156 },
      { x: 'Integrations', y: 1876 },
    ];

    return {
      datasets: [{
        label: 'Users',
        data: features,
        backgroundColor: CHART_COLORS.map(c => `${c}80`),
        borderColor: CHART_COLORS,
        borderWidth: 1,
      }],
    };
  }, []);

  // Mock data - Session Duration Distribution
  const sessionDurationData = useMemo(() => {
    return {
      datasets: [{
        label: 'Sessions',
        data: [
          { x: '0-1 min', y: 3421 },
          { x: '1-3 min', y: 5678 },
          { x: '3-5 min', y: 4892 },
          { x: '5-10 min', y: 3245 },
          { x: '10-20 min', y: 1823 },
          { x: '20+ min', y: 1175 },
        ],
        backgroundColor: `${CHART_COLORS[1]}80`,
        borderColor: CHART_COLORS[1],
        borderWidth: 1,
      }],
    };
  }, []);

  // Mock data - User Retention Cohort
  const retentionData = useMemo(() => {
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'];
    const retentionRates = [100, 72, 58, 49, 43, 39];

    return {
      datasets: [{
        label: 'Retention %',
        data: weeks.map((week, idx) => ({ x: week, y: retentionRates[idx] })),
        backgroundColor: `${CHART_COLORS[3]}80`,
        borderColor: CHART_COLORS[3],
        borderWidth: 1,
      }],
    };
  }, []);

  const minDate = useMemo(() => {
    const date = new Date(now);
    date.setDate(date.getDate() - 29);
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  const maxDate = useMemo(() => {
    const date = new Date(now);
    date.setHours(23, 59, 59, 999);
    return date;
  }, []);

  return (
    <PageBody>
      <Column margin="2">
        <PageHeader
          title="Product Analytics"
          description="User engagement metrics and behavior patterns"
        />
      </Column>

      <MetricsBar>
        <MetricCard
          label="Total Users"
          value={totalUsers}
          change={totalUsers - previousTotalUsers}
          showChange={true}
        />
        <MetricCard
          label="Active Users (30d)"
          value={activeUsers}
          change={activeUsers - previousActiveUsers}
          showChange={true}
        />
        <MetricCard
          label="Avg Session Duration"
          value={avgSessionDuration}
          formatValue={(v) => `${Math.floor(v / 60)}m ${Math.floor(v % 60)}s`}
        />
        <MetricCard
          label="Engagement Rate"
          value={engagementRate}
          formatValue={(v) => `${v.toFixed(1)}%`}
        />
      </MetricsBar>

      <Panel minHeight="520px" title="User Activity Trends">
        <BarChart
          chartData={activityData}
          unit="day"
          stacked={true}
          minDate={minDate}
          maxDate={maxDate}
          height="400px"
        />
      </Panel>

      <Row gap>
        <Panel minHeight="400px" title="Feature Adoption" style={{ flex: 1 }}>
          <BarChart
            chartData={featureAdoptionData}
            XAxisType="category"
            height="300px"
          />
        </Panel>
        <Panel minHeight="400px" title="Session Duration" style={{ flex: 1 }}>
          <BarChart
            chartData={sessionDurationData}
            XAxisType="category"
            height="300px"
          />
        </Panel>
      </Row>

      <Panel minHeight="400px" title="6-Week User Retention">
        <BarChart
          chartData={retentionData}
          XAxisType="category"
          height="300px"
        />
      </Panel>
    </PageBody>
  );
}
