'use client';

import { Column, useTheme } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { GridRow } from '@/components/common/GridRow';
import { Panel } from '@/components/common/Panel';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { ListTable } from '@/components/metrics/ListTable';
import { formatLongNumber, formatLongCurrency } from '@/lib/format';
import { useMemo } from 'react';
import { getThemeColors } from '@/lib/colors';
import { startOfDay, subDays, addDays, format } from 'date-fns';

export default function MarketingAttributionHomePage() {
  const { theme } = useTheme();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  // Generate realistic date range for last 30 days
  const { endDate, startDate } = useMemo(() => {
    const end = new Date();
    const start = subDays(end, 29);
    return { endDate: end, startDate: start };
  }, []);

  // Mock data for Marketing Attribution persona - focused on campaigns and traffic sources
  const campaignMetrics = [
    {
      value: 87234,
      label: 'Total Visitors',
      change: 5432,
      formatValue: formatLongNumber,
    },
    {
      value: 4567,
      label: 'Conversions',
      change: 234,
      formatValue: formatLongNumber,
    },
    {
      value: 5.23,
      label: 'Conversion Rate',
      change: 0.12,
      formatValue: (n: number) => `${n.toFixed(2)}%`,
    },
    {
      value: 45.67,
      label: 'Cost Per Acquisition',
      change: -2.34,
      formatValue: (n: number) => `$${n.toFixed(2)}`,
      reverseColors: true,
    },
    {
      value: 208567,
      label: 'Marketing Spend',
      change: 12450,
      formatValue: (n: number) => formatLongCurrency(n, 'USD'),
    },
  ];

  // Traffic sources over time - last 30 days with multiple channels
  const trafficOverTime = useMemo(() => {
    const organicData = [];
    const paidData = [];
    const socialData = [];
    const directData = [];

    for (let i = 0; i < 30; i++) {
      const date = addDays(startDate, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const weekdayFactor = [5, 6].includes(date.getDay()) ? 0.8 : 1.0;

      // Create realistic traffic patterns
      organicData.push({
        x: dateStr,
        y: Math.round((1200 + Math.sin(i / 3) * 200 + Math.random() * 150) * weekdayFactor),
      });

      paidData.push({
        x: dateStr,
        y: Math.round((800 + Math.cos(i / 4) * 150 + Math.random() * 100) * weekdayFactor),
      });

      socialData.push({
        x: dateStr,
        y: Math.round((500 + Math.sin(i / 5) * 100 + Math.random() * 80) * weekdayFactor),
      });

      directData.push({
        x: dateStr,
        y: Math.round((400 + Math.random() * 60) * weekdayFactor),
      });
    }

    return { organicData, paidData, socialData, directData };
  }, [startDate]);

  const trafficChartData = useMemo(() => ({
    datasets: [
      {
        label: 'Organic Search',
        data: trafficOverTime.organicData,
        backgroundColor: colors.chart.visitors.backgroundColor,
        borderColor: colors.chart.visitors.borderColor,
        borderWidth: 1,
      },
      {
        label: 'Paid Ads',
        data: trafficOverTime.paidData,
        backgroundColor: colors.chart.views.backgroundColor,
        borderColor: colors.chart.views.borderColor,
        borderWidth: 1,
      },
      {
        label: 'Social Media',
        data: trafficOverTime.socialData,
        backgroundColor: '#9b5de5',
        borderColor: '#7b3dc5',
        borderWidth: 1,
      },
      {
        label: 'Direct',
        data: trafficOverTime.directData,
        backgroundColor: '#fee440',
        borderColor: '#ddc420',
        borderWidth: 1,
      },
    ],
  }), [trafficOverTime, colors]);

  // Campaign performance breakdown
  const campaignData = useMemo(() => {
    const campaigns = [
      { label: 'Google Ads', value: 35.2 },
      { label: 'Facebook Ads', value: 28.4 },
      { label: 'LinkedIn Ads', value: 15.7 },
      { label: 'Twitter Ads', value: 8.9 },
      { label: 'Email Campaign', value: 7.3 },
      { label: 'Influencer', value: 4.5 },
    ];

    return {
      labels: campaigns.map(c => c.label),
      datasets: [
        {
          data: campaigns.map(c => c.value),
          backgroundColor: [
            colors.chart.visitors.backgroundColor,
            colors.chart.views.backgroundColor,
            '#9b5de5',
            '#f15bb5',
            '#fee440',
            '#00bbf9',
          ],
        },
      ],
    };
  }, [colors]);

  // Top referring domains
  const referringDomains = [
    { label: 'google.com', count: 23456, percent: 26.9 },
    { label: 'facebook.com', count: 18734, percent: 21.5 },
    { label: 'linkedin.com', count: 12845, percent: 14.7 },
    { label: 'twitter.com', count: 8932, percent: 10.2 },
    { label: 'reddit.com', count: 6723, percent: 7.7 },
    { label: 'medium.com', count: 4567, percent: 5.2 },
    { label: 'producthunt.com', count: 3891, percent: 4.5 },
    { label: 'youtube.com', count: 3234, percent: 3.7 },
  ];

  // Campaign ROI
  const campaignROI = [
    { label: 'Google Ads - Brand', count: 3.45, percent: 245 },
    { label: 'Facebook - Lookalike', count: 2.87, percent: 187 },
    { label: 'LinkedIn - B2B', count: 2.23, percent: 123 },
    { label: 'Email - Nurture', count: 4.67, percent: 367 },
    { label: 'Twitter - Awareness', count: 1.89, percent: 89 },
    { label: 'Influencer - Tech', count: 3.12, percent: 212 },
  ];

  // Landing page performance
  const landingPages = [
    { label: '/landing/product-demo', count: 12834, percent: 14.7 },
    { label: '/landing/free-trial', count: 9876, percent: 11.3 },
    { label: '/landing/webinar-signup', count: 7654, percent: 8.8 },
    { label: '/pricing', count: 6543, percent: 7.5 },
    { label: '/landing/case-studies', count: 5432, percent: 6.2 },
    { label: '/features', count: 4321, percent: 5.0 },
  ];

  // UTM campaign tracking
  const utmCampaigns = [
    { label: 'summer_sale_2024', count: 8932, percent: 10.2 },
    { label: 'product_launch_q4', count: 7845, percent: 9.0 },
    { label: 'webinar_series_nov', count: 6234, percent: 7.1 },
    { label: 'holiday_promo', count: 5678, percent: 6.5 },
    { label: 'referral_program', count: 4567, percent: 5.2 },
    { label: 'content_marketing', count: 3891, percent: 4.5 },
  ];

  return (
    <PageBody>
      <Column gap="3">
        <PageHeader title="Marketing Attribution Dashboard">
          <div style={{ fontSize: '14px', color: 'var(--gray500)', marginTop: '8px' }}>
            Track inbound sources, campaign performance, and marketing ROI
          </div>
        </PageHeader>

        <MetricsBar>
          {campaignMetrics.map(({ label, value, change, formatValue, reverseColors }) => (
            <MetricCard
              key={label}
              value={value}
              label={label}
              change={change}
              formatValue={formatValue}
              reverseColors={reverseColors}
              showChange={true}
            />
          ))}
        </MetricsBar>

        <GridRow layout="two">
          <Panel title="Traffic Sources (Last 30 Days)">
            <BarChart
              chartData={trafficChartData}
              XAxisType="category"
              stacked={true}
              height="350px"
            />
          </Panel>

          <Panel title="Campaign Performance (% of Conversions)">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '350px' }}>
              <PieChart
                chartData={campaignData}
                type="doughnut"
                height="350px"
              />
            </div>
          </Panel>
        </GridRow>

        <GridRow layout="three">
          <Panel title="Top Referring Domains">
            <ListTable
              data={referringDomains}
              showPercentage={true}
            />
          </Panel>

          <Panel title="Campaign ROI">
            <ListTable
              data={campaignROI.map(item => ({
                ...item,
                count: Math.round(item.count * 1000), // Convert to whole numbers for display
              }))}
              showPercentage={true}
            />
          </Panel>

          <Panel title="Top Landing Pages">
            <ListTable
              data={landingPages}
              showPercentage={true}
            />
          </Panel>
        </GridRow>

        <GridRow layout="two">
          <Panel title="UTM Campaign Tracking">
            <ListTable
              data={utmCampaigns}
              showPercentage={true}
            />
          </Panel>

          <Panel title="Key Insights">
            <div style={{ padding: '20px' }}>
              <ul style={{ lineHeight: '1.8', color: 'var(--gray600)' }}>
                <li><strong>Email nurture campaigns</strong> show highest ROI at 4.67x</li>
                <li><strong>Organic search</strong> drives 27% of total traffic</li>
                <li><strong>Product demo landing page</strong> has 14.7% conversion rate</li>
                <li><strong>Weekend traffic</strong> is 20% lower than weekdays</li>
                <li><strong>Cost per acquisition</strong> decreased by $2.34 this month</li>
              </ul>
            </div>
          </Panel>
        </GridRow>
      </Column>
    </PageBody>
  );
}
