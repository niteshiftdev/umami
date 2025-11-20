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

export function MarketingAttributionPage() {
  const { formatMessage, labels } = useMessages();
  const { theme } = useTheme();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  // Mock data - Marketing Metrics
  const totalVisits = 156789;
  const organicTraffic = 78234;
  const paidTraffic = 45678;
  const conversionRate = 3.2;
  const previousTotalVisits = 142345;
  const previousOrganicTraffic = 71223;

  // Mock data - Traffic Sources Over Time (last 30 days)
  const now = new Date();
  const trafficSourcesData = useMemo(() => {
    const datasets = [];
    const organic = [];
    const paid = [];
    const social = [];
    const direct = [];

    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      // Simulate realistic traffic patterns
      const dayOfWeek = date.getDay();
      const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.6 : 1.0;
      const trendMultiplier = 1 + (29 - i) * 0.015;

      organic.push({ x: date.getTime(), y: Math.floor((1800 + Math.random() * 400) * weekendMultiplier * trendMultiplier) });
      paid.push({ x: date.getTime(), y: Math.floor((1200 + Math.random() * 300) * weekendMultiplier * trendMultiplier) });
      social.push({ x: date.getTime(), y: Math.floor((800 + Math.random() * 200) * weekendMultiplier * trendMultiplier) });
      direct.push({ x: date.getTime(), y: Math.floor((500 + Math.random() * 150) * weekendMultiplier * trendMultiplier) });
    }

    datasets.push({
      label: 'Organic',
      data: organic,
      backgroundColor: `${CHART_COLORS[2]}80`,
      borderColor: CHART_COLORS[2],
      borderWidth: 1,
    });

    datasets.push({
      label: 'Paid',
      data: paid,
      backgroundColor: `${CHART_COLORS[0]}80`,
      borderColor: CHART_COLORS[0],
      borderWidth: 1,
    });

    datasets.push({
      label: 'Social',
      data: social,
      backgroundColor: `${CHART_COLORS[1]}80`,
      borderColor: CHART_COLORS[1],
      borderWidth: 1,
    });

    datasets.push({
      label: 'Direct',
      data: direct,
      backgroundColor: `${CHART_COLORS[3]}80`,
      borderColor: CHART_COLORS[3],
      borderWidth: 1,
    });

    return { datasets };
  }, []);

  // Mock data - Campaign Performance
  const campaignData = useMemo(() => {
    const campaigns = [
      { x: 'Summer Sale', y: 12456 },
      { x: 'Product Launch', y: 9876 },
      { x: 'Email Newsletter', y: 8234 },
      { x: 'Social Media', y: 6789 },
      { x: 'Partner Referral', y: 4532 },
      { x: 'Retargeting', y: 3421 },
    ];

    return {
      datasets: [{
        label: 'Conversions',
        data: campaigns,
        backgroundColor: CHART_COLORS.map(c => `${c}80`),
        borderColor: CHART_COLORS,
        borderWidth: 1,
      }],
    };
  }, []);

  // Mock data - Channel ROI
  const channelROIData = useMemo(() => {
    return {
      datasets: [{
        label: 'ROI %',
        data: [
          { x: 'Organic Search', y: 342 },
          { x: 'Email', y: 289 },
          { x: 'Social Ads', y: 156 },
          { x: 'Display Ads', y: 134 },
          { x: 'Affiliate', y: 98 },
          { x: 'Video Ads', y: 67 },
        ],
        backgroundColor: `${CHART_COLORS[4]}80`,
        borderColor: CHART_COLORS[4],
        borderWidth: 1,
      }],
    };
  }, []);

  // Mock data - UTM Source Distribution (Pie Chart)
  const utmSourceData = useMemo(() => {
    return {
      labels: ['Google', 'Facebook', 'LinkedIn', 'Twitter', 'Email', 'Direct'],
      datasets: [{
        label: 'Traffic Share',
        data: [35234, 23456, 12345, 8976, 6543, 4321],
        backgroundColor: CHART_COLORS.map(c => `${c}cc`),
        borderColor: CHART_COLORS,
        borderWidth: 2,
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
          title="Marketing Attribution"
          description="Track inbound sources and campaign performance"
        />
      </Column>

      <MetricsBar>
        <MetricCard
          label="Total Visits"
          value={totalVisits}
          change={totalVisits - previousTotalVisits}
          showChange={true}
        />
        <MetricCard
          label="Organic Traffic"
          value={organicTraffic}
          change={organicTraffic - previousOrganicTraffic}
          showChange={true}
        />
        <MetricCard
          label="Paid Traffic"
          value={paidTraffic}
        />
        <MetricCard
          label="Conversion Rate"
          value={conversionRate}
          formatValue={(v) => `${v.toFixed(1)}%`}
        />
      </MetricsBar>

      <Panel minHeight="520px" title="Traffic Sources Over Time">
        <BarChart
          chartData={trafficSourcesData}
          unit="day"
          stacked={true}
          minDate={minDate}
          maxDate={maxDate}
          height="400px"
        />
      </Panel>

      <Row gap>
        <Panel minHeight="400px" title="Campaign Performance" style={{ flex: 1 }}>
          <BarChart
            chartData={campaignData}
            XAxisType="category"
            height="300px"
          />
        </Panel>
        <Panel minHeight="400px" title="Traffic Source Distribution" style={{ flex: 1 }}>
          <PieChart
            chartData={utmSourceData}
            height="300px"
          />
        </Panel>
      </Row>

      <Panel minHeight="400px" title="Channel ROI Performance">
        <BarChart
          chartData={channelROIData}
          XAxisType="category"
          height="300px"
        />
      </Panel>
    </PageBody>
  );
}
