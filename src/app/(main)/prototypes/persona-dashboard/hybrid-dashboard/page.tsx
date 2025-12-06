'use client';

import { Column, Row, Grid, Heading, Text } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { Panel } from '@/components/common/Panel';
import { GridRow } from '@/components/common/GridRow';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { ListTable } from '@/components/metrics/ListTable';
import { formatLongNumber, formatLongCurrency } from '@/lib/format';
import { DATE_FORMATS } from '@/lib/date';
import { format, subDays } from 'date-fns';
import { CHART_COLORS } from '@/lib/constants';
import {
  useDynamicVariant,
  useDynamicColor,
  useDynamicSpacing,
  useDynamicNumber,
  useDynamicBoolean,
} from '@niteshift/dials';

// Generate dates for the last 14 days
const generateDates = (days: number) => {
  const dates: Date[] = [];
  for (let i = days - 1; i >= 0; i--) {
    dates.push(subDays(new Date('2024-12-04'), i));
  }
  return dates;
};

const dates14 = generateDates(14);

// Executive Summary KPIs
const executiveKpis = {
  mrr: 2847500,
  mrrChange: 142375,
  dau: 48720,
  dauChange: 4150,
  conversionRate: 3.8,
  conversionChange: 0.4,
  nps: 72,
  npsChange: 5,
  cac: 287,
  cacChange: -23,
  ltv: 4250,
  ltvChange: 380,
};

// Product Health Data
const productHealthMetrics = {
  dauMauRatio: 0.42,
  engagementScore: 78,
  featureAdoption: 64,
  sessionDuration: 12.4,
  retentionD7: 68,
  retentionD30: 42,
};

const dauTrendData = {
  __id: Date.now(),
  datasets: [
    {
      type: 'bar' as const,
      label: 'DAU',
      data: dates14.map((date, i) => ({
        x: format(date, DATE_FORMATS.day),
        y: 42000 + Math.floor(Math.random() * 8000) + (i * 300),
        d: date.toISOString(),
      })),
      backgroundColor: CHART_COLORS[0],
      borderColor: CHART_COLORS[0],
      borderWidth: 0,
    },
  ],
};

const featureAdoptionData = [
  { label: 'Advanced Analytics', count: 8420, percent: 78 },
  { label: 'Team Collaboration', count: 7150, percent: 66 },
  { label: 'Custom Dashboards', count: 6380, percent: 59 },
  { label: 'API Integrations', count: 5210, percent: 48 },
  { label: 'Export Reports', count: 4890, percent: 45 },
];

// Marketing Performance Data
const marketingMetrics = {
  totalVisitors: 284500,
  visitorsChange: 31200,
  leadConversion: 4.2,
  conversionChange: 0.5,
  campaignROI: 3.8,
  roiChange: 0.4,
  blendedCac: 156,
  cacChange: -12,
};

const trafficTrendData = {
  __id: Date.now() + 1,
  datasets: [
    {
      type: 'bar' as const,
      label: 'Organic',
      data: dates14.map((date, i) => ({
        x: format(date, DATE_FORMATS.day),
        y: 8500 + Math.floor(Math.random() * 2000) + (i * 150),
        d: date.toISOString(),
      })),
      backgroundColor: CHART_COLORS[2],
      borderColor: CHART_COLORS[2],
      borderWidth: 0,
    },
    {
      type: 'bar' as const,
      label: 'Paid',
      data: dates14.map((date, i) => ({
        x: format(date, DATE_FORMATS.day),
        y: 4200 + Math.floor(Math.random() * 1500) + (i * 80),
        d: date.toISOString(),
      })),
      backgroundColor: CHART_COLORS[3],
      borderColor: CHART_COLORS[3],
      borderWidth: 0,
    },
  ],
};

const channelPerformanceData = [
  { label: 'Google Organic', count: 94200, percent: 33 },
  { label: 'Direct Traffic', count: 71125, percent: 25 },
  { label: 'LinkedIn Ads', count: 48365, percent: 17 },
  { label: 'Google Ads', count: 34140, percent: 12 },
  { label: 'Referral Partners', count: 22760, percent: 8 },
  { label: 'Email Marketing', count: 13910, percent: 5 },
];

const channelPieData = {
  labels: ['Organic', 'Direct', 'Paid Social', 'Paid Search', 'Referral', 'Email'],
  datasets: [
    {
      label: 'Traffic',
      data: [33, 25, 17, 12, 8, 5],
      backgroundColor: [CHART_COLORS[2], CHART_COLORS[0], CHART_COLORS[1], CHART_COLORS[3], CHART_COLORS[6], CHART_COLORS[4]],
      borderColor: 'transparent',
      borderWidth: 0,
    },
  ],
};

// Revenue Performance Data
const revenueMetrics = {
  arr: 34170000,
  arrChange: 4200000,
  pipeline: 8420000,
  pipelineChange: 1250000,
  churnRate: 2.1,
  churnChange: -0.3,
  netRevRetention: 118,
  nrrChange: 4,
};

const revenueTrendData = {
  __id: Date.now() + 2,
  datasets: [
    {
      type: 'bar' as const,
      label: 'Revenue',
      data: dates14.map((date, i) => ({
        x: format(date, DATE_FORMATS.day),
        y: 85000 + Math.floor(Math.random() * 25000) + (i * 2000),
        d: date.toISOString(),
      })),
      backgroundColor: CHART_COLORS[0],
      borderColor: CHART_COLORS[0],
      borderWidth: 0,
    },
  ],
};

const topAccountsData = [
  { label: 'Meridian Technologies', count: 42500, percent: 100 },
  { label: 'Vertex Solutions', count: 38200, percent: 90 },
  { label: 'NovaSphere Inc', count: 31800, percent: 75 },
  { label: 'Pinnacle Systems', count: 28500, percent: 67 },
  { label: 'Catalyst Partners', count: 24200, percent: 57 },
];

// Alerts and Risks
const alerts = [
  { type: 'warning', title: 'Churn Risk: Acme Corp', description: 'Usage dropped 45% in last 30 days. Contract renewal in 60 days.', value: '$18,500 ARR' },
  { type: 'success', title: 'Expansion Opportunity', description: 'Meridian Technologies hitting 90% seat utilization.', value: '+$12,000 potential' },
  { type: 'danger', title: 'Support Escalation', description: 'NovaSphere Inc opened 3 P1 tickets this week.', value: '$31,800 ARR at risk' },
  { type: 'info', title: 'Campaign Performance', description: 'Q4 LinkedIn campaign exceeding targets by 23%.', value: 'CAC: $142' },
];

const alertColors: Record<string, string> = {
  warning: '#e68619',
  success: '#44b556',
  danger: '#e34850',
  info: '#2680eb',
};

export default function HybridDashboardPage() {
  // === DIALS: Layout & Spacing ===
  const sectionGap = useDynamicSpacing('hd-section-gap', {
    label: 'Section Gap',
    group: 'Layout',
    default: '24px',
    options: ['16px', '24px', '32px', '40px'],
  });

  const panelPadding = useDynamicSpacing('hd-panel-padding', {
    label: 'Panel Padding',
    group: 'Layout',
    default: '20px',
    options: ['16px', '20px', '24px', '28px'],
  });

  const columnLayout = useDynamicVariant('hd-column-layout', {
    label: 'Main Layout',
    group: 'Layout',
    default: 'three',
    options: ['two', 'three'] as const,
  });

  // === DIALS: Typography ===
  const metricValueSize = useDynamicVariant('hd-metric-value-size', {
    label: 'Metric Value Size',
    group: 'Typography',
    default: '6',
    options: ['5', '6', '7', '8'] as const,
  });

  const sectionHeadingSize = useDynamicVariant('hd-section-heading', {
    label: 'Section Heading Size',
    group: 'Typography',
    default: '2',
    options: ['1', '2', '3'] as const,
  });

  // === DIALS: Colors ===
  const productColor = useDynamicColor('hd-product-color', {
    label: 'Product Section Color',
    group: 'Colors',
    default: CHART_COLORS[0],
    options: [CHART_COLORS[0], '#3e63dd', '#0090ff', '#12a594'],
    allowCustom: true,
  });

  const marketingColor = useDynamicColor('hd-marketing-color', {
    label: 'Marketing Section Color',
    group: 'Colors',
    default: CHART_COLORS[1],
    options: [CHART_COLORS[1], '#8e4ec6', '#6e56cf', '#d6409f'],
    allowCustom: true,
  });

  const revenueColor = useDynamicColor('hd-revenue-color', {
    label: 'Revenue Section Color',
    group: 'Colors',
    default: CHART_COLORS[2],
    options: [CHART_COLORS[2], '#30a46c', '#12a594', '#0090ff'],
    allowCustom: true,
  });

  const alertColor = useDynamicColor('hd-alert-color', {
    label: 'Alert Color',
    group: 'Colors',
    default: '#e5484d',
    options: ['#e5484d', '#f76b15', '#ffc53d', '#d6409f'],
    allowCustom: true,
  });

  // === DIALS: Visualization ===
  const chartHeight = useDynamicNumber('hd-chart-height', {
    label: 'Chart Height',
    group: 'Visualization',
    default: 180,
    min: 140,
    max: 280,
    step: 20,
    unit: 'px',
  });

  const pieChartType = useDynamicVariant('hd-pie-chart-type', {
    label: 'Pie Chart Style',
    group: 'Visualization',
    default: 'doughnut',
    options: ['pie', 'doughnut'] as const,
  });

  // === DIALS: Features ===
  const showAlerts = useDynamicBoolean('hd-show-alerts', {
    label: 'Show Alerts Section',
    group: 'Features',
    default: true,
  });

  const showProductSection = useDynamicBoolean('hd-show-product', {
    label: 'Show Product Health',
    group: 'Features',
    default: true,
  });

  const showMarketingSection = useDynamicBoolean('hd-show-marketing', {
    label: 'Show Marketing',
    group: 'Features',
    default: true,
  });

  const showRevenueSection = useDynamicBoolean('hd-show-revenue', {
    label: 'Show Revenue',
    group: 'Features',
    default: true,
  });

  return (
    <PageBody>
      <Column gap="6" style={{ gap: sectionGap }}>
        <PageHeader
          title="Executive Dashboard"
          description="Unified view of product, marketing, and revenue performance"
        />

        {/* Executive Summary - Cross-functional KPIs */}
        <Column gap="4" style={{ animation: 'fadeIn 0.4s ease-out' }}>
          <Row alignItems="center" gap="3">
            <Heading size="2">Executive Summary</Heading>
            <Text color="muted" size="2">Last 30 days</Text>
          </Row>
          <MetricsBar>
            <MetricCard
              value={executiveKpis.mrr}
              change={executiveKpis.mrrChange}
              label="Monthly Revenue"
              formatValue={(n) => formatLongCurrency(n, 'USD')}
              showChange
            />
            <MetricCard
              value={executiveKpis.dau}
              change={executiveKpis.dauChange}
              label="Daily Active Users"
              formatValue={formatLongNumber}
              showChange
            />
            <MetricCard
              value={executiveKpis.conversionRate}
              change={executiveKpis.conversionChange}
              label="Conversion Rate"
              formatValue={(n) => `${n.toFixed(1)}%`}
              showChange
            />
            <MetricCard
              value={executiveKpis.nps}
              change={executiveKpis.npsChange}
              label="NPS Score"
              formatValue={(n) => n.toFixed(0)}
              showChange
            />
            <MetricCard
              value={executiveKpis.cac}
              change={executiveKpis.cacChange}
              label="Blended CAC"
              formatValue={(n) => formatLongCurrency(n, 'USD')}
              showChange
              reverseColors
            />
            <MetricCard
              value={executiveKpis.ltv}
              change={executiveKpis.ltvChange}
              label="Customer LTV"
              formatValue={(n) => formatLongCurrency(n, 'USD')}
              showChange
            />
          </MetricsBar>
        </Column>

        {/* Alerts and Risks Section */}
        <Column gap="4" style={{ animation: 'fadeIn 0.5s ease-out 0.1s backwards' }}>
          <Heading size="2">Alerts and Opportunities</Heading>
          <Grid columns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} gap="3">
            {alerts.map((alert, i) => (
              <Panel key={i} paddingY="4" paddingX="5">
                <Row alignItems="flex-start" gap="4">
                  <Column
                    style={{
                      width: 4,
                      height: '100%',
                      minHeight: 50,
                      backgroundColor: alertColors[alert.type],
                      borderRadius: 2,
                      flexShrink: 0,
                    }}
                  />
                  <Column gap="1" style={{ flex: 1 }}>
                    <Row justifyContent="space-between" alignItems="center">
                      <Text weight="bold" size="2">{alert.title}</Text>
                      <Text
                        size="1"
                        weight="semibold"
                        style={{ color: alertColors[alert.type] }}
                      >
                        {alert.value}
                      </Text>
                    </Row>
                    <Text color="muted" size="1">{alert.description}</Text>
                  </Column>
                </Row>
              </Panel>
            ))}
          </Grid>
        </Column>

        {/* Three Column Layout: Product | Marketing | Revenue */}
        <Grid columns={{ xs: '1fr', lg: 'repeat(3, 1fr)' }} gap="4" style={{ animation: 'fadeIn 0.5s ease-out 0.2s backwards' }}>
          {/* Product Health Column */}
          <Column gap="4">
            <Panel>
              <Column gap="4">
                <Row alignItems="center" justifyContent="space-between">
                  <Heading size="2">Product Health</Heading>
                  <Text
                    size="1"
                    weight="semibold"
                    style={{
                      backgroundColor: CHART_COLORS[2],
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: 4,
                    }}
                  >
                    Score: {productHealthMetrics.engagementScore}
                  </Text>
                </Row>
                <Grid columns="repeat(2, 1fr)" gap="3">
                  <Column gap="1" paddingY="2">
                    <Text color="muted" size="1">DAU/MAU Ratio</Text>
                    <Text weight="bold" size="5">{(productHealthMetrics.dauMauRatio * 100).toFixed(0)}%</Text>
                  </Column>
                  <Column gap="1" paddingY="2">
                    <Text color="muted" size="1">Feature Adoption</Text>
                    <Text weight="bold" size="5">{productHealthMetrics.featureAdoption}%</Text>
                  </Column>
                  <Column gap="1" paddingY="2">
                    <Text color="muted" size="1">D7 Retention</Text>
                    <Text weight="bold" size="5">{productHealthMetrics.retentionD7}%</Text>
                  </Column>
                  <Column gap="1" paddingY="2">
                    <Text color="muted" size="1">Avg Session</Text>
                    <Text weight="bold" size="5">{productHealthMetrics.sessionDuration}m</Text>
                  </Column>
                </Grid>
              </Column>
            </Panel>
            <Panel>
              <Column gap="3">
                <Text weight="bold" size="2">Daily Active Users</Text>
                <BarChart chartData={dauTrendData} unit="day" height={180} />
              </Column>
            </Panel>
            <Panel>
              <ListTable
                data={featureAdoptionData}
                title="Top Features"
                metric="Users"
                itemCount={5}
              />
            </Panel>
          </Column>

          {/* Marketing Performance Column */}
          <Column gap="4">
            <Panel>
              <Column gap="4">
                <Row alignItems="center" justifyContent="space-between">
                  <Heading size="2">Marketing</Heading>
                  <Text
                    size="1"
                    weight="semibold"
                    style={{
                      backgroundColor: CHART_COLORS[3],
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: 4,
                    }}
                  >
                    ROI: {marketingMetrics.campaignROI}x
                  </Text>
                </Row>
                <Grid columns="repeat(2, 1fr)" gap="3">
                  <Column gap="1" paddingY="2">
                    <Text color="muted" size="1">Total Visitors</Text>
                    <Text weight="bold" size="5">{formatLongNumber(marketingMetrics.totalVisitors)}</Text>
                  </Column>
                  <Column gap="1" paddingY="2">
                    <Text color="muted" size="1">Lead Conv.</Text>
                    <Text weight="bold" size="5">{marketingMetrics.leadConversion}%</Text>
                  </Column>
                  <Column gap="1" paddingY="2">
                    <Text color="muted" size="1">Blended CAC</Text>
                    <Text weight="bold" size="5">${marketingMetrics.blendedCac}</Text>
                  </Column>
                  <Column gap="1" paddingY="2">
                    <Text color="muted" size="1">MQLs Generated</Text>
                    <Text weight="bold" size="5">1,842</Text>
                  </Column>
                </Grid>
              </Column>
            </Panel>
            <Panel>
              <Column gap="3">
                <Text weight="bold" size="2">Traffic by Source</Text>
                <BarChart chartData={trafficTrendData} unit="day" height={180} stacked />
              </Column>
            </Panel>
            <Panel>
              <Column gap="3">
                <Text weight="bold" size="2">Channel Mix</Text>
                <Row justifyContent="center" paddingY="2">
                  <div style={{ width: 180, height: 180 }}>
                    <PieChart chartData={channelPieData} type="doughnut" />
                  </div>
                </Row>
              </Column>
            </Panel>
          </Column>

          {/* Revenue Performance Column */}
          <Column gap="4">
            <Panel>
              <Column gap="4">
                <Row alignItems="center" justifyContent="space-between">
                  <Heading size="2">Revenue</Heading>
                  <Text
                    size="1"
                    weight="semibold"
                    style={{
                      backgroundColor: CHART_COLORS[0],
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: 4,
                    }}
                  >
                    NRR: {revenueMetrics.netRevRetention}%
                  </Text>
                </Row>
                <Grid columns="repeat(2, 1fr)" gap="3">
                  <Column gap="1" paddingY="2">
                    <Text color="muted" size="1">ARR</Text>
                    <Text weight="bold" size="5">{formatLongCurrency(revenueMetrics.arr, 'USD')}</Text>
                  </Column>
                  <Column gap="1" paddingY="2">
                    <Text color="muted" size="1">Pipeline</Text>
                    <Text weight="bold" size="5">{formatLongCurrency(revenueMetrics.pipeline, 'USD')}</Text>
                  </Column>
                  <Column gap="1" paddingY="2">
                    <Text color="muted" size="1">Churn Rate</Text>
                    <Text weight="bold" size="5" style={{ color: revenueMetrics.churnRate > 3 ? CHART_COLORS[4] : undefined }}>{revenueMetrics.churnRate}%</Text>
                  </Column>
                  <Column gap="1" paddingY="2">
                    <Text color="muted" size="1">Avg Deal Size</Text>
                    <Text weight="bold" size="5">$8,420</Text>
                  </Column>
                </Grid>
              </Column>
            </Panel>
            <Panel>
              <Column gap="3">
                <Text weight="bold" size="2">Daily Revenue</Text>
                <BarChart chartData={revenueTrendData} unit="day" height={180} currency="USD" />
              </Column>
            </Panel>
            <Panel>
              <ListTable
                data={topAccountsData}
                title="Top Accounts"
                metric="MRR"
                itemCount={5}
                currency="USD"
              />
            </Panel>
          </Column>
        </Grid>

        {/* Bottom Row: Cohort Performance */}
        <GridRow layout="two" style={{ animation: 'fadeIn 0.5s ease-out 0.3s backwards' }}>
          <Panel>
            <Column gap="4">
              <Heading size="2">Cohort Performance Summary</Heading>
              <Grid columns={{ xs: '1fr', md: 'repeat(4, 1fr)' }} gap="4">
                <Column gap="2" padding="3" style={{ backgroundColor: 'var(--base-color-2)', borderRadius: 6 }}>
                  <Text color="muted" size="1">Q4 2024 Cohort</Text>
                  <Text weight="bold" size="4">842 customers</Text>
                  <Row gap="2" alignItems="center">
                    <Text size="1" style={{ color: CHART_COLORS[2] }}>+12% vs Q3</Text>
                  </Row>
                </Column>
                <Column gap="2" padding="3" style={{ backgroundColor: 'var(--base-color-2)', borderRadius: 6 }}>
                  <Text color="muted" size="1">Avg Time to Value</Text>
                  <Text weight="bold" size="4">4.2 days</Text>
                  <Row gap="2" alignItems="center">
                    <Text size="1" style={{ color: CHART_COLORS[2] }}>-18% vs target</Text>
                  </Row>
                </Column>
                <Column gap="2" padding="3" style={{ backgroundColor: 'var(--base-color-2)', borderRadius: 6 }}>
                  <Text color="muted" size="1">First Month Revenue</Text>
                  <Text weight="bold" size="4">$1.24M</Text>
                  <Row gap="2" alignItems="center">
                    <Text size="1" style={{ color: CHART_COLORS[2] }}>+8% vs forecast</Text>
                  </Row>
                </Column>
                <Column gap="2" padding="3" style={{ backgroundColor: 'var(--base-color-2)', borderRadius: 6 }}>
                  <Text color="muted" size="1">Week 4 Activation</Text>
                  <Text weight="bold" size="4">78%</Text>
                  <Row gap="2" alignItems="center">
                    <Text size="1" style={{ color: CHART_COLORS[2] }}>Above 70% target</Text>
                  </Row>
                </Column>
              </Grid>
            </Column>
          </Panel>
          <Panel>
            <Column gap="4">
              <Heading size="2">Channel Attribution</Heading>
              <ListTable
                data={channelPerformanceData}
                title="Source"
                metric="Visitors"
                itemCount={6}
              />
            </Column>
          </Panel>
        </GridRow>

        <style>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </Column>
    </PageBody>
  );
}
