'use client';

import { Column, Grid, Heading, Row, Text } from '@umami/react-zen';
import { useMemo } from 'react';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { GridRow } from '@/components/common/GridRow';
import { MetricCard } from '@/components/metrics/MetricCard';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { useMessages } from '@/components/hooks';
import { getThemeColors } from '@/lib/colors';
import { useTheme } from '@umami/react-zen';
import { formatNumber, formatCurrency } from '@/lib/format';

export default function MarketingAttributionDashboard() {
  const { formatMessage, labels } = useMessages();
  const { theme } = useTheme();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  // Campaign performance over time (last 30 days)
  const campaignPerformanceData = useMemo(() => {
    const today = new Date();
    const dates = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      dates.push(d);
    }

    return {
      labels: dates.map(d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      datasets: [
        {
          label: 'Organic Search',
          data: dates.map((_, i) => ({
            x: dates[i].toISOString().split('T')[0],
            y: Math.floor(Math.random() * 400) + 800,
          })),
          backgroundColor: colors?.chart?.primary || '#2680eb',
          borderColor: colors?.chart?.primary || '#2680eb',
          borderWidth: 0,
        },
        {
          label: 'Paid Ads',
          data: dates.map((_, i) => ({
            x: dates[i].toISOString().split('T')[0],
            y: Math.floor(Math.random() * 250) + 450,
          })),
          backgroundColor: colors?.chart?.secondary || '#9256d9',
          borderColor: colors?.chart?.secondary || '#9256d9',
          borderWidth: 0,
        },
        {
          label: 'Social Media',
          data: dates.map((_, i) => ({
            x: dates[i].toISOString().split('T')[0],
            y: Math.floor(Math.random() * 300) + 250,
          })),
          backgroundColor: colors?.chart?.tertiary || '#44b556',
          borderColor: colors?.chart?.tertiary || '#44b556',
          borderWidth: 0,
        },
      ],
    };
  }, [colors]);

  // Traffic source attribution
  const sourceAttributionData = useMemo(() => ({
    labels: ['Organic Search', 'Direct Traffic', 'Paid Ads', 'Social Media', 'Referrals', 'Email'],
    datasets: [
      {
        label: 'Sessions',
        data: [8234, 5432, 4156, 2847, 1923, 1408],
        backgroundColor: [
          colors?.chart?.primary || '#2680eb',
          colors?.chart?.secondary || '#9256d9',
          colors?.chart?.tertiary || '#44b556',
          colors?.chart?.warning || '#e68619',
          colors?.chart?.danger || '#e34850',
          colors?.chart?.info || '#01bad7',
        ],
      },
    ],
  }), [colors]);

  // ROI by campaign
  const roiByCampaignData = useMemo(() => {
    const campaigns = [
      { name: 'Q4 Holiday Campaign', roi: 340 },
      { name: 'Black Friday Flash Sale', roi: 520 },
      { name: 'Q4 Re-engagement', roi: 185 },
      { name: 'Holiday Gift Guide', roi: 420 },
      { name: 'New Year Promo', roi: 280 },
    ];
    return {
      labels: campaigns.map(c => c.name),
      datasets: [
        {
          label: 'ROI (%)',
          data: campaigns.map(c => c.roi),
          backgroundColor: colors?.chart?.primary || '#2680eb',
          borderColor: colors?.chart?.primary || '#2680eb',
          borderWidth: 0,
        },
      ],
    };
  }, [colors]);

  // Conversion rate by channel
  const conversionRateData = useMemo(() => ({
    labels: ['Organic Search', 'Paid Ads', 'Social Media', 'Direct', 'Email', 'Referrals'],
    datasets: [
      {
        label: 'Conversion Rate (%)',
        data: [4.2, 3.8, 2.1, 3.5, 6.7, 2.8],
        backgroundColor: colors?.chart?.primary || '#2680eb',
        borderColor: colors?.chart?.primary || '#2680eb',
        borderWidth: 0,
      },
    ],
  }), [colors]);

  // Attribution model comparison
  const attributionModelData = useMemo(() => ({
    labels: ['Organic Search', 'Paid Ads', 'Social Media', 'Email', 'Direct'],
    datasets: [
      {
        label: 'First-Touch',
        data: [2845, 1923, 1456, 847, 1320],
        backgroundColor: 'rgba(38, 128, 235, 0.7)',
        borderColor: '#2680eb',
        borderWidth: 1,
      },
      {
        label: 'Last-Touch',
        data: [3428, 2156, 987, 1234, 1645],
        backgroundColor: 'rgba(146, 86, 217, 0.7)',
        borderColor: '#9256d9',
        borderWidth: 1,
      },
      {
        label: 'Multi-Touch',
        data: [3156, 1987, 1834, 1056, 1876],
        backgroundColor: 'rgba(68, 181, 86, 0.7)',
        borderColor: '#44b556',
        borderWidth: 1,
      },
    ],
  }), [colors]);

  return (
    <PageBody>
      <Column margin="2">
        <PageHeader
          title="Marketing Attribution Dashboard"
          description="Campaign performance, channel attribution, and ROI tracking"
        />

        {/* Campaign KPIs */}
        <GridRow layout="three" marginBottom="4">
          <Panel>
            <MetricCard
              label="Total Sessions"
              value={23000}
              previousValue={18500}
              change={4500}
              showLabel
              showChange
              formatValue={(v) => `${(v / 1000).toFixed(1)}K`}
            />
          </Panel>
          <Panel>
            <MetricCard
              label="Conversion Rate"
              value={3.8}
              previousValue={3.2}
              change={0.6}
              showLabel
              showChange
              formatValue={(v) => `${v.toFixed(1)}%`}
            />
          </Panel>
          <Panel>
            <MetricCard
              label="Avg. Cost per Acquisition"
              value={42.5}
              previousValue={48.0}
              change={-5.5}
              showLabel
              showChange
              formatValue={(v) => `$${v.toFixed(2)}`}
            />
          </Panel>
        </GridRow>

        {/* Campaign Performance Over Time */}
        <GridRow layout="one" minHeight="400px" marginBottom="4">
          <Panel allowFullscreen title="Campaign Traffic Trends (30 Days)">
            <BarChart
              chartData={campaignPerformanceData}
              stacked={true}
              height="350px"
              XAxisType="linear"
              renderXLabel={(label, index, values) => {
                return index % 5 === 0 ? label : '';
              }}
            />
          </Panel>
        </GridRow>

        {/* Source Attribution & Conversion Rates */}
        <GridRow layout="two" minHeight="400px" marginBottom="4">
          <Panel allowFullscreen title="Traffic Source Attribution">
            <PieChart
              chartData={sourceAttributionData}
              type="doughnut"
              height="350px"
            />
          </Panel>
          <Panel allowFullscreen title="Conversion Rate by Channel">
            <BarChart
              chartData={conversionRateData}
              height="350px"
              XAxisType="linear"
              renderYLabel={(label) => `${label}%`}
            />
          </Panel>
        </GridRow>

        {/* ROI by Campaign & Attribution Models */}
        <GridRow layout="two" minHeight="400px" marginBottom="4">
          <Panel allowFullscreen title="ROI by Campaign">
            <BarChart
              chartData={roiByCampaignData}
              height="350px"
              XAxisType="linear"
              renderYLabel={(label) => `${label}%`}
            />
          </Panel>
          <Panel allowFullscreen title="Attribution Model Comparison">
            <BarChart
              chartData={attributionModelData}
              stacked={false}
              height="350px"
              XAxisType="linear"
            />
          </Panel>
        </GridRow>

        {/* Marketing Insights */}
        <Panel allowFullscreen title="Attribution Insights & Optimization">
          <Column gap="3" padding="4">
            <Row gap="4">
              <Column flex="1">
                <Heading size="3">📊 Attribution Analysis</Heading>
                <Text size="1" style={{ lineHeight: '1.6', marginTop: '1rem' }}>
                  • Organic search drives 36% of traffic with 4.2% conversion rate<br/>
                  • Email campaigns show highest conversion rate at 6.7%, ideal for high-intent audiences<br/>
                  • Black Friday campaign achieved 520% ROI, highest performer<br/>
                  • Multi-touch attribution reveals 35% of conversions involve 2+ touchpoints
                </Text>
              </Column>
              <Column flex="1">
                <Heading size="3">💡 Recommendations</Heading>
                <Text size="1" style={{ lineHeight: '1.6', marginTop: '1rem' }}>
                  • Increase organic search investment - highest volume with strong ROI<br/>
                  • Expand email segmentation for better targeting (6.7% conversion rate)<br/>
                  • Optimize paid ads landing pages - 3.8% conversion vs. 4.2% for organic<br/>
                  • Implement sequential messaging strategy based on multi-touch model
                </Text>
              </Column>
            </Row>
          </Column>
        </Panel>
      </Column>
    </PageBody>
  );
}
