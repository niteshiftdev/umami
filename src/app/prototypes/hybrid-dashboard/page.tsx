'use client';

import { Column, Grid, Heading, Row, Text, Tabs, Tab, TabList, TabPanel } from '@umami/react-zen';
import { useMemo, useState } from 'react';
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

export default function HybridDashboard() {
  const { formatMessage, labels } = useMessages();
  const { theme } = useTheme();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);
  const [activeTab, setActiveTab] = useState('overview');

  // Combined engagement and revenue metrics
  const engagementRevenueData = useMemo(() => {
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
          label: 'MRR ($K)',
          data: dates.map((_, i) => ({
            x: dates[i].toISOString().split('T')[0],
            y: Math.floor(Math.random() * 20) + 650,
          })),
          backgroundColor: colors?.chart?.success || '#44b556',
          borderColor: colors?.chart?.success || '#44b556',
          borderWidth: 0,
        },
        {
          label: 'User Sessions',
          data: dates.map((_, i) => ({
            x: dates[i].toISOString().split('T')[0],
            y: Math.floor(Math.random() * 500) + 2500,
          })),
          backgroundColor: colors?.chart?.primary || '#2680eb',
          borderColor: colors?.chart?.primary || '#2680eb',
          borderWidth: 0,
        },
      ],
    };
  }, [colors]);

  // Channel performance with attribution
  const channelPerformanceData = useMemo(() => ({
    labels: ['Organic', 'Paid Ads', 'Social', 'Referral', 'Email'],
    datasets: [
      {
        label: 'Sessions',
        data: [8234, 4156, 2847, 1923, 1408],
        backgroundColor: [
          colors?.chart?.primary || '#2680eb',
          colors?.chart?.secondary || '#9256d9',
          colors?.chart?.tertiary || '#44b556',
          colors?.chart?.warning || '#e68619',
          colors?.chart?.info || '#01bad7',
        ],
      },
    ],
  }), [colors]);

  // Feature usage vs revenue impact
  const featureRevenueData = useMemo(() => ({
    labels: ['Search', 'Filters', 'Exports', 'Custom Alerts', 'API Access'],
    datasets: [
      {
        label: 'Adoption Rate (%)',
        data: [92, 78, 65, 43, 38],
        backgroundColor: 'rgba(38, 128, 235, 0.7)',
        borderColor: '#2680eb',
        borderWidth: 1,
      },
      {
        label: 'Revenue Impact ($K)',
        data: [120, 95, 75, 42, 38],
        backgroundColor: 'rgba(68, 181, 86, 0.7)',
        borderColor: '#44b556',
        borderWidth: 1,
      },
    ],
  }), [colors]);

  // Customer lifecycle cohort
  const cohortAnalysisData = useMemo(() => ({
    labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'],
    datasets: [
      {
        label: 'Cohort: Jan 2024',
        data: [
          { x: 'Month 1', y: 100 },
          { x: 'Month 2', y: 87 },
          { x: 'Month 3', y: 76 },
          { x: 'Month 4', y: 68 },
          { x: 'Month 5', y: 62 },
          { x: 'Month 6', y: 58 },
        ],
        backgroundColor: colors?.chart?.primary || '#2680eb',
        borderColor: colors?.chart?.primary || '#2680eb',
        borderWidth: 2,
      },
      {
        label: 'Cohort: Apr 2024',
        data: [
          { x: 'Month 1', y: 100 },
          { x: 'Month 2', y: 91 },
          { x: 'Month 3', y: 83 },
          { x: 'Month 4', y: 76 },
          { x: 'Month 5', y: 71 },
          { x: 'Month 6', y: 67 },
        ],
        backgroundColor: colors?.chart?.secondary || '#9256d9',
        borderColor: colors?.chart?.secondary || '#9256d9',
        borderWidth: 2,
      },
    ],
  }), [colors]);

  // Growth metrics by segment
  const growthBySegmentData = useMemo(() => ({
    labels: ['Enterprise', 'Mid-Market', 'SMB', 'Startup'],
    datasets: [
      {
        label: 'Growth Rate (% MoM)',
        data: [12, 18, 25, 35],
        backgroundColor: colors?.chart?.primary || '#2680eb',
        borderColor: colors?.chart?.primary || '#2680eb',
        borderWidth: 0,
      },
      {
        label: 'Churn Rate (% MoM)',
        data: [2, 3, 5, 8],
        backgroundColor: colors?.chart?.danger || '#e34850',
        borderColor: colors?.chart?.danger || '#e34850',
        borderWidth: 0,
      },
    ],
  }), [colors]);

  return (
    <PageBody>
      <Column margin="2">
        <PageHeader
          title="Hybrid Dashboard"
          description="Combined view of product engagement, marketing attribution, and revenue metrics"
        />

        {/* Executive KPIs */}
        <GridRow layout="three" marginBottom="4">
          <Panel>
            <MetricCard
              label="Monthly Revenue"
              value={682000}
              previousValue={628000}
              change={54000}
              showLabel
              showChange
              formatValue={(v) => `$${(v / 1000).toFixed(0)}K`}
            />
          </Panel>
          <Panel>
            <MetricCard
              label="Active Users"
              value={12847}
              previousValue={11256}
              change={1591}
              showLabel
              showChange
              formatValue={(v) => `${(v / 1000).toFixed(1)}K`}
            />
          </Panel>
          <Panel>
            <MetricCard
              label="Overall Health"
              value={87.5}
              previousValue={85.2}
              change={2.3}
              showLabel
              showChange
              formatValue={(v) => `${v.toFixed(1)}%`}
            />
          </Panel>
        </GridRow>

        {/* Engagement & Revenue Correlation */}
        <GridRow layout="one" minHeight="400px" marginBottom="4">
          <Panel allowFullscreen title="MRR & User Engagement Correlation (30 Days)">
            <BarChart
              chartData={engagementRevenueData}
              stacked={false}
              height="350px"
              XAxisType="linear"
              renderXLabel={(label, index, values) => {
                return index % 5 === 0 ? label : '';
              }}
            />
          </Panel>
        </GridRow>

        {/* Tabs for different views */}
        <Panel allowFullscreen>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabList>
              <Tab value="overview">Channel Performance</Tab>
              <Tab value="features">Feature ROI</Tab>
              <Tab value="cohort">Cohort Analysis</Tab>
              <Tab value="segments">Growth by Segment</Tab>
            </TabList>

            {/* Channel Performance View */}
            <TabPanel value="overview">
              <GridRow layout="two" minHeight="400px" marginTop="4">
                <Panel allowFullscreen title="Traffic & Revenue by Channel">
                  <PieChart
                    chartData={channelPerformanceData}
                    type="doughnut"
                    height="350px"
                  />
                </Panel>
                <Panel allowFullscreen title="Channel Efficiency Metrics">
                  <Column gap="3" padding="4">
                    <Row gap="2">
                      <Text weight="bold" flex="1">Channel</Text>
                      <Text weight="bold" flex="1">Sessions</Text>
                      <Text weight="bold" flex="1">Conv. Rate</Text>
                      <Text weight="bold" flex="1">CAC</Text>
                    </Row>
                    <Row gap="2">
                      <Text flex="1">Organic</Text>
                      <Text flex="1">8,234</Text>
                      <Text flex="1">4.2%</Text>
                      <Text flex="1">$18</Text>
                    </Row>
                    <Row gap="2">
                      <Text flex="1">Paid Ads</Text>
                      <Text flex="1">4,156</Text>
                      <Text flex="1">3.8%</Text>
                      <Text flex="1">$45</Text>
                    </Row>
                    <Row gap="2">
                      <Text flex="1">Social Media</Text>
                      <Text flex="1">2,847</Text>
                      <Text flex="1">2.1%</Text>
                      <Text flex="1">$52</Text>
                    </Row>
                    <Row gap="2">
                      <Text flex="1">Referral</Text>
                      <Text flex="1">1,923</Text>
                      <Text flex="1">5.3%</Text>
                      <Text flex="1">$12</Text>
                    </Row>
                    <Row gap="2">
                      <Text flex="1">Email</Text>
                      <Text flex="1">1,408</Text>
                      <Text flex="1">6.7%</Text>
                      <Text flex="1">$8</Text>
                    </Row>
                  </Column>
                </Panel>
              </GridRow>
            </TabPanel>

            {/* Feature ROI View */}
            <TabPanel value="features">
              <GridRow layout="one" minHeight="400px" marginTop="4">
                <Panel allowFullscreen title="Feature Adoption vs Revenue Impact">
                  <BarChart
                    chartData={featureRevenueData}
                    stacked={false}
                    height="350px"
                    XAxisType="linear"
                    renderYLabel={(label, index) => {
                      // Alternate between % and $K labels
                      return index % 2 === 0 ? `${label}%` : `$${label}K`;
                    }}
                  />
                </Panel>
              </GridRow>
            </TabPanel>

            {/* Cohort Analysis View */}
            <TabPanel value="cohort">
              <GridRow layout="one" minHeight="400px" marginTop="4">
                <Panel allowFullscreen title="Customer Retention by Cohort">
                  <BarChart
                    chartData={cohortAnalysisData}
                    stacked={false}
                    height="350px"
                    XAxisType="linear"
                    renderYLabel={(label) => `${label}%`}
                  />
                </Panel>
              </GridRow>
            </TabPanel>

            {/* Growth by Segment View */}
            <TabPanel value="segments">
              <GridRow layout="one" minHeight="400px" marginTop="4">
                <Panel allowFullscreen title="Growth vs Churn by Customer Segment">
                  <BarChart
                    chartData={growthBySegmentData}
                    stacked={false}
                    height="350px"
                    XAxisType="linear"
                    renderYLabel={(label) => `${label}%`}
                  />
                </Panel>
              </GridRow>
            </TabPanel>
          </Tabs>
        </Panel>

        {/* Executive Summary */}
        <Panel allowFullscreen title="Executive Summary & Strategic Insights">
          <Column gap="3" padding="4">
            <Row gap="4">
              <Column flex="1">
                <Heading size="3">📊 Business Overview</Heading>
                <Text size="1" style={{ lineHeight: '1.6', marginTop: '1rem' }}>
                  • MRR growing 8.6% month-over-month, on pace for $8.5M ARR<br/>
                  • User engagement and revenue correlate strongly (0.87 correlation)<br/>
                  • Organic channel provides best ROI with $18 CAC and 4.2% conversion<br/>
                  • Product Health Score: 87.5% (up 2.3% from previous period)
                </Text>
              </Column>
              <Column flex="1">
                <Heading size="3">🎯 Strategic Opportunities</Heading>
                <Text size="1" style={{ lineHeight: '1.6', marginTop: '1rem' }}>
                  • Startup segment showing highest growth (35% MoM) but highest churn (8%)<br/>
                  • Email channel most efficient for conversions (6.7%) - expand program<br/>
                  • API access feature has untapped revenue potential ($38K from 38% adoption)<br/>
                  • Cohort retention improving - Jan cohort 58% vs. Apr cohort 67% retention
                </Text>
              </Column>
            </Row>
            <Row gap="4" style={{ marginTop: '2rem' }}>
              <Column flex="1">
                <Heading size="3">⚡ Immediate Actions</Heading>
                <Text size="1" style={{ lineHeight: '1.6', marginTop: '1rem' }}>
                  • Launch feature education campaign for 65% adoption products (Exports)<br/>
                  • Implement startup-specific retention playbook to reduce 8% churn<br/>
                  • Scale email marketing - highest conversion channel at $8 CAC<br/>
                  • Develop API monetization tier to capitalize on growing demand
                </Text>
              </Column>
              <Column flex="1">
                <Heading size="3">📈 Forward Outlook</Heading>
                <Text size="1" style={{ lineHeight: '1.6', marginTop: '1rem' }}>
                  • Q4 Target: $800K MRR (achievable at current 8.6% growth rate)<br/>
                  • Forecast: 15K+ active users by year-end (currently 12.8K)<br/>
                  • Enterprise expansion potential: 12% growth rate vs. market 9%<br/>
                  • Projected Year-end ARR: $9.6M (up from $8.2M YoY)
                </Text>
              </Column>
            </Row>
          </Column>
        </Panel>
      </Column>
    </PageBody>
  );
}
