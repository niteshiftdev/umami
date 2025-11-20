'use client';
import { Column, Row, useTheme, Text, Grid } from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { GridRow } from '@/components/common/GridRow';
import { MetricCard } from '@/components/metrics/MetricCard';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { Chart } from '@/components/charts/Chart';
import { useMessages, useLocale } from '@/components/hooks';
import { useMemo } from 'react';
import { getThemeColors } from '@/lib/colors';
import { formatLongNumber, formatNumber } from '@/lib/format';
import { CHART_COLORS } from '@/lib/constants';
import { startOfDay, subDays, format } from 'date-fns';

export default function MarketingAttributionPage() {
  const { formatMessage, labels } = useMessages();
  const { theme } = useTheme();
  const { locale } = useLocale();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  // Generate realistic mock data
  const now = new Date();
  const minDate = startOfDay(subDays(now, 29));
  const maxDate = startOfDay(now);

  // Traffic by Source data
  const trafficBySourceData = useMemo(() => {
    const data = [];
    for (let i = 29; i >= 0; i--) {
      const date = subDays(now, i);
      const dateStr = format(startOfDay(date), 'yyyy-MM-dd');

      // Organic search baseline with variation
      const organic = 3200 + Math.sin(i / 5) * 400 + Math.random() * 300;
      data.push({ x: dateStr, y: Math.floor(organic) });
    }
    return data;
  }, []);

  const paidTrafficData = useMemo(() => {
    const data = [];
    for (let i = 29; i >= 0; i--) {
      const date = subDays(now, i);
      const dateStr = format(startOfDay(date), 'yyyy-MM-dd');

      // Paid ads with spikes on weekdays
      const dayOfWeek = date.getDay();
      const isWeekday = dayOfWeek > 0 && dayOfWeek < 6;
      const base = isWeekday ? 2100 : 1200;
      const paid = base + Math.random() * 400;
      data.push({ x: dateStr, y: Math.floor(paid) });
    }
    return data;
  }, []);

  const socialTrafficData = useMemo(() => {
    const data = [];
    for (let i = 29; i >= 0; i--) {
      const date = subDays(now, i);
      const dateStr = format(startOfDay(date), 'yyyy-MM-dd');

      // Social with weekend spikes
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const base = isWeekend ? 1800 : 1200;
      const social = base + Math.random() * 300;
      data.push({ x: dateStr, y: Math.floor(social) });
    }
    return data;
  }, []);

  // Campaign Performance data
  const campaignPerformanceData = useMemo(() => {
    return {
      labels: ['Google Ads', 'Facebook Ads', 'LinkedIn', 'Email Campaign', 'Affiliate', 'Display'],
      datasets: [
        {
          label: 'Conversions',
          data: [892, 654, 423, 1247, 328, 189],
          backgroundColor: CHART_COLORS.slice(0, 6),
          borderWidth: 0,
        },
      ],
    };
  }, []);

  // Conversion funnel data
  const conversionFunnelData = useMemo(() => {
    return {
      labels: ['Landing Page', 'Product View', 'Add to Cart', 'Checkout', 'Purchase'],
      datasets: [
        {
          label: 'Users in Stage',
          data: [45820, 28934, 12456, 8721, 6834],
          backgroundColor: CHART_COLORS[0],
          borderColor: CHART_COLORS[0],
          borderWidth: 1,
        },
      ],
    };
  }, []);

  const trafficChartData = useMemo(() => {
    return {
      datasets: [
        {
          type: 'bar',
          label: 'Organic Search',
          data: trafficBySourceData,
          borderWidth: 1,
          barPercentage: 0.9,
          categoryPercentage: 0.9,
          backgroundColor: CHART_COLORS[0],
          borderColor: CHART_COLORS[0],
        },
        {
          type: 'bar',
          label: 'Paid Ads',
          data: paidTrafficData,
          borderWidth: 1,
          barPercentage: 0.9,
          categoryPercentage: 0.9,
          backgroundColor: CHART_COLORS[1],
          borderColor: CHART_COLORS[1],
        },
        {
          type: 'bar',
          label: 'Social Media',
          data: socialTrafficData,
          borderWidth: 1,
          barPercentage: 0.9,
          categoryPercentage: 0.9,
          backgroundColor: CHART_COLORS[2],
          borderColor: CHART_COLORS[2],
        },
      ],
    };
  }, [trafficBySourceData, paidTrafficData, socialTrafficData]);

  const campaignChartOptions = useMemo(() => {
    return {
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
        },
        tooltip: {
          enabled: true,
        },
      },
    };
  }, []);

  const funnelChartOptions = useMemo(() => {
    return {
      indexAxis: 'y',
      scales: {
        x: {
          type: 'linear',
          beginAtZero: true,
          grid: {
            color: colors.chart.line,
          },
          border: {
            color: colors.chart.line,
          },
          ticks: {
            color: colors.chart.text,
          },
        },
        y: {
          type: 'category',
          grid: {
            display: false,
          },
          border: {
            color: colors.chart.line,
          },
          ticks: {
            color: colors.chart.text,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    };
  }, [colors]);

  return (
    <PageBody>
      <Column gap margin="2">
        <PageHeader
          title="Marketing Attribution Dashboard"
          description="Track inbound sources and campaign performance"
        />

        <Row gap="3">
          <MetricCard
            value={162847}
            change={151230}
            label="Total Visits"
            showChange={true}
            formatValue={formatLongNumber}
          />
          <MetricCard
            value={6834}
            change={6012}
            label="Conversions"
            showChange={true}
            formatValue={formatLongNumber}
          />
          <MetricCard
            value={4.2}
            change={4.0}
            label="Conversion Rate (%)"
            showChange={true}
            formatValue={(n) => `${n.toFixed(1)}%`}
          />
          <MetricCard
            value={28.50}
            change={31.20}
            label="Cost per Acquisition"
            showChange={true}
            reverseColors={true}
            formatValue={(n) => `$${n.toFixed(2)}`}
          />
        </Row>

        <Panel title="Traffic by Source (Last 30 Days)" minHeight="420px">
          <BarChart
            chartData={trafficChartData}
            unit="day"
            minDate={minDate}
            maxDate={maxDate}
            height="370px"
            stacked={true}
          />
        </Panel>

        <GridRow layout="two">
          <Panel title="Campaign Performance (Conversions)" minHeight="400px">
            <PieChart
              chartData={campaignPerformanceData}
              chartOptions={campaignChartOptions}
              height="350px"
              type="doughnut"
            />
          </Panel>

          <Panel title="Conversion Funnel" minHeight="400px">
            <Chart
              type="bar"
              chartData={conversionFunnelData}
              chartOptions={funnelChartOptions}
              height="350px"
            />
          </Panel>
        </GridRow>

        <GridRow layout="two">
          <Panel title="Top Referrers (Last 30 Days)">
            <Column gap="2" padding="4">
              {[
                { source: 'google.com', visits: 87234, conversions: 2845 },
                { source: 'facebook.com', visits: 42891, conversions: 1234 },
                { source: 'linkedin.com', visits: 28456, conversions: 892 },
                { source: 'twitter.com', visits: 19834, conversions: 567 },
                { source: 'newsletter.company.com', visits: 15672, conversions: 1456 },
              ].map((item, index) => (
                <Row key={index} justifyContent="space-between" alignItems="center">
                  <Text weight="medium" style={{ flex: 1 }}>{item.source}</Text>
                  <Row gap="4" alignItems="center">
                    <Text style={{ minWidth: '80px', textAlign: 'right' }}>
                      {formatLongNumber(item.visits)} visits
                    </Text>
                    <Text weight="medium" style={{ minWidth: '100px', textAlign: 'right' }}>
                      {formatLongNumber(item.conversions)} conv.
                    </Text>
                  </Row>
                </Row>
              ))}
            </Column>
          </Panel>

          <Panel title="UTM Campaign Performance">
            <Column gap="2" padding="4">
              {[
                { campaign: 'summer_sale_2025', clicks: 45892, ctr: 3.8, conversions: 1247 },
                { campaign: 'product_launch_q1', clicks: 32451, ctr: 4.2, conversions: 892 },
                { campaign: 'retargeting_jan', clicks: 28934, ctr: 5.1, conversions: 654 },
                { campaign: 'brand_awareness', clicks: 19823, ctr: 2.9, conversions: 423 },
                { campaign: 'webinar_promotion', clicks: 15672, ctr: 6.3, conversions: 328 },
              ].map((item, index) => (
                <Column key={index} gap="1">
                  <Row justifyContent="space-between" alignItems="center">
                    <Text weight="medium">{item.campaign}</Text>
                    <Text>{formatLongNumber(item.conversions)} conversions</Text>
                  </Row>
                  <Row justifyContent="space-between" alignItems="center">
                    <Text size="sm" color="secondary">
                      {formatLongNumber(item.clicks)} clicks
                    </Text>
                    <Text size="sm" color="secondary">
                      {item.ctr.toFixed(1)}% CTR
                    </Text>
                  </Row>
                </Column>
              ))}
            </Column>
          </Panel>
        </GridRow>
      </Column>
    </PageBody>
  );
}
