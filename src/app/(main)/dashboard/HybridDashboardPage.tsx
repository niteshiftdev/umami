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

export function HybridDashboardPage() {
  const { formatMessage, labels } = useMessages();
  const { theme } = useTheme();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  // Mock data - Combined Key Metrics from all personas
  const monthlyRevenue = 1247600;
  const totalUsers = 24567;
  const totalVisits = 156789;
  const conversionRate = 3.2;
  const previousRevenue = 1189400;
  const previousUsers = 22103;
  const previousVisits = 142345;

  const now = new Date();

  // Mock data - Business Health Overview (combining revenue + users + traffic)
  const businessHealthData = useMemo(() => {
    const datasets = [];
    const revenue = [];
    const users = [];

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      date.setDate(1);
      date.setHours(0, 0, 0, 0);

      const monthIndex = 11 - i;
      const growthMultiplier = 1 + monthIndex * 0.04;

      // Revenue in thousands
      revenue.push({ x: date.getTime(), y: Math.floor((950 + Math.random() * 150) * growthMultiplier) });
      // Users in thousands
      users.push({ x: date.getTime(), y: Math.floor((18 + Math.random() * 4) * growthMultiplier) });
    }

    datasets.push({
      label: 'Revenue ($K)',
      data: revenue,
      backgroundColor: `${CHART_COLORS[0]}80`,
      borderColor: CHART_COLORS[0],
      borderWidth: 1,
      yAxisID: 'y',
    });

    datasets.push({
      label: 'Users (K)',
      data: users,
      backgroundColor: `${CHART_COLORS[2]}80`,
      borderColor: CHART_COLORS[2],
      borderWidth: 1,
      yAxisID: 'y',
    });

    return { datasets };
  }, []);

  // Mock data - Customer Journey Funnel
  const customerJourneyData = useMemo(() => {
    return {
      datasets: [{
        label: 'Count',
        data: [
          { x: 'Visitors', y: 156789 },
          { x: 'Sign-ups', y: 24567 },
          { x: 'Active Users', y: 18234 },
          { x: 'Trial Conversions', y: 5021 },
          { x: 'Paying Customers', y: 3456 },
        ],
        backgroundColor: CHART_COLORS.map(c => `${c}80`),
        borderColor: CHART_COLORS,
        borderWidth: 1,
      }],
    };
  }, []);

  // Mock data - Revenue Sources Mix
  const revenueSourcesData = useMemo(() => {
    return {
      labels: ['New Business', 'Renewals', 'Expansion', 'Professional Services'],
      datasets: [{
        label: 'Revenue Share',
        data: [420000, 612000, 187000, 28600],
        backgroundColor: CHART_COLORS.slice(0, 4).map(c => `${c}cc`),
        borderColor: CHART_COLORS.slice(0, 4),
        borderWidth: 2,
      }],
    };
  }, []);

  // Mock data - Growth Drivers (combining product engagement + marketing + sales)
  const growthDriversData = useMemo(() => {
    return {
      datasets: [{
        label: 'Impact Score',
        data: [
          { x: 'Feature Adoption', y: 87 },
          { x: 'Organic Traffic', y: 82 },
          { x: 'Customer Success', y: 76 },
          { x: 'Paid Campaigns', y: 68 },
          { x: 'Product Virality', y: 54 },
          { x: 'Partner Channel', y: 43 },
        ],
        backgroundColor: `${CHART_COLORS[1]}80`,
        borderColor: CHART_COLORS[1],
        borderWidth: 1,
      }],
    };
  }, []);

  // Mock data - Channel Performance Matrix (last 30 days)
  const channelPerformanceData = useMemo(() => {
    const datasets = [];
    const conversions = [];
    const engagement = [];

    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const dayOfWeek = date.getDay();
      const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.7 : 1.0;
      const trendMultiplier = 1 + (29 - i) * 0.01;

      conversions.push({ x: date.getTime(), y: Math.floor((120 + Math.random() * 40) * weekendMultiplier * trendMultiplier) });
      engagement.push({ x: date.getTime(), y: Math.floor((450 + Math.random() * 100) * weekendMultiplier * trendMultiplier) });
    }

    datasets.push({
      label: 'Conversions',
      data: conversions,
      backgroundColor: `${CHART_COLORS[4]}80`,
      borderColor: CHART_COLORS[4],
      borderWidth: 1,
    });

    datasets.push({
      label: 'Engaged Users',
      data: engagement,
      backgroundColor: `${CHART_COLORS[5]}80`,
      borderColor: CHART_COLORS[5],
      borderWidth: 1,
    });

    return { datasets };
  }, []);

  const minDateYear = useMemo(() => {
    const date = new Date(now);
    date.setMonth(date.getMonth() - 11);
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  const minDateMonth = useMemo(() => {
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
          title="Hybrid Dashboard"
          description="Complete business overview combining product, marketing, and revenue metrics"
        />
      </Column>

      <MetricsBar>
        <MetricCard
          label="Monthly Revenue"
          value={monthlyRevenue}
          change={monthlyRevenue - previousRevenue}
          showChange={true}
          formatValue={(v) => `$${formatLongNumber(v)}`}
        />
        <MetricCard
          label="Total Users"
          value={totalUsers}
          change={totalUsers - previousUsers}
          showChange={true}
        />
        <MetricCard
          label="Total Visits"
          value={totalVisits}
          change={totalVisits - previousVisits}
          showChange={true}
        />
        <MetricCard
          label="Conversion Rate"
          value={conversionRate}
          formatValue={(v) => `${v.toFixed(1)}%`}
        />
      </MetricsBar>

      <Panel minHeight="520px" title="Business Growth Trends">
        <BarChart
          chartData={businessHealthData}
          unit="month"
          stacked={false}
          minDate={minDateYear}
          maxDate={maxDate}
          height="400px"
        />
      </Panel>

      <Row gap>
        <Panel minHeight="400px" title="Customer Journey Funnel" style={{ flex: 1 }}>
          <BarChart
            chartData={customerJourneyData}
            XAxisType="category"
            height="300px"
          />
        </Panel>
        <Panel minHeight="400px" title="Revenue Source Mix" style={{ flex: 1 }}>
          <PieChart
            chartData={revenueSourcesData}
            height="300px"
          />
        </Panel>
      </Row>

      <Panel minHeight="400px" title="Growth Drivers by Impact">
        <BarChart
          chartData={growthDriversData}
          XAxisType="category"
          height="300px"
        />
      </Panel>

      <Panel minHeight="520px" title="Daily Conversions & Engagement">
        <BarChart
          chartData={channelPerformanceData}
          unit="day"
          stacked={false}
          minDate={minDateMonth}
          maxDate={maxDate}
          height="400px"
        />
      </Panel>
    </PageBody>
  );
}
