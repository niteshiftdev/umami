'use client';

import { Column, Row, Grid, Heading, Text, Box } from '@umami/react-zen';

// Custom Badge component since @umami/react-zen doesn't export Badge
const Badge = ({ children, color = 'default', size = 'md' }: any) => (
  <Box
    padding={size === 'sm' ? '1' : '2'}
    borderRadius="2"
    style={{
      background:
        color === 'success'
          ? '#44b55620'
          : color === 'danger'
            ? '#e3485020'
            : color === 'warning'
              ? '#FFA50020'
              : '#2680eb20',
      color:
        color === 'success'
          ? '#44b556'
          : color === 'danger'
            ? '#e34850'
            : color === 'warning'
              ? '#FFA500'
              : '#2680eb',
      fontSize: size === 'sm' ? '11px' : '12px',
      fontWeight: 500,
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </Box>
);
import { Panel } from '@/components/common/Panel';
import { PageBody } from '@/components/common/PageBody';
import { LoadingPanel } from '@/components/common/LoadingPanel';
import { Chart } from '@/components/charts/Chart';
import { CHART_COLORS } from '@/lib/constants';

// Mock data
const campaignMetrics = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [
    {
      type: 'bar',
      label: 'Open Rate',
      data: [24, 28, 26, 32],
      backgroundColor: CHART_COLORS[0],
    },
    {
      type: 'bar',
      label: 'Click Rate',
      data: [8, 9, 8, 11],
      backgroundColor: CHART_COLORS[1],
    },
  ],
};

const conversionChart = {
  labels: ['Welcome Series', 'Product Update', 'Weekly Digest', 'Re-engagement', 'Promotional'],
  datasets: [
    {
      type: 'bar',
      data: [45, 38, 32, 18, 24],
      backgroundColor: CHART_COLORS,
    },
  ],
};

const campaigns = [
  {
    name: 'Welcome Series',
    sent: 12450,
    opened: 5786,
    clicked: 1876,
    converted: 856,
    status: 'Active',
    performance: 87,
  },
  {
    name: 'Product Update',
    sent: 8934,
    opened: 3567,
    clicked: 987,
    converted: 423,
    status: 'Active',
    performance: 72,
  },
  {
    name: 'Weekly Digest',
    sent: 45120,
    opened: 18048,
    clicked: 3629,
    converted: 1089,
    status: 'Scheduled',
    performance: 64,
  },
  {
    name: 'Re-engagement',
    sent: 6234,
    opened: 1560,
    clicked: 234,
    converted: 45,
    status: 'Completed',
    performance: 38,
  },
];

const automationSequences = [
  { name: 'Abandoned Cart', triggers: 1234, conversions: 234, revenue: '$18,720', health: 'Good' },
  { name: 'Post-Purchase', triggers: 8945, conversions: 2134, revenue: '$142,340', health: 'Good' },
  { name: 'Win-back', triggers: 567, conversions: 89, revenue: '$7,120', health: 'Fair' },
  { name: 'Trial Expires', triggers: 432, conversions: 156, revenue: '$24,960', health: 'Good' },
];

export default function EngagementEmail() {
  return (
    <PageBody gap>
      <Row justifyContent="space-between" alignItems="flex-start">
        <Column gap="1">
          <Heading level={1}>Email & Communication Analytics</Heading>
          <Text color="muted">Monitor campaign performance, automation sequences, and customer nurture</Text>
        </Column>
      </Row>

      {/* Key Metrics */}
      <Grid columns={{ xs: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }} gap="2">
        {[
          { label: 'Campaigns Sent', value: '73,738', subtext: '+12% vs last month', color: CHART_COLORS[0] },
          { label: 'Avg Open Rate', value: '27.5%', subtext: '+2.3% vs last month', color: CHART_COLORS[1] },
          { label: 'Avg Click Rate', value: '9.2%', subtext: '+1.1% vs last month', color: CHART_COLORS[2] },
          { label: 'Est. Revenue', value: '$193.1K', subtext: '+18% vs last month', color: CHART_COLORS[3] },
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

      {/* Campaign Performance Trend */}
      <Panel title="Campaign Performance Trend">
        <Box height="300px">
          <Chart type="bar" chartData={campaignMetrics} height="100%" />
        </Box>
      </Panel>

      {/* Active Campaigns */}
      <Panel title="Active Campaigns">
        <LoadingPanel data={campaigns} isLoading={false} error={null}>
          <Column gap="2">
            {campaigns.map((campaign) => (
              <Box
                key={campaign.name}
                padding="3"
                borderRadius="2"
                style={{ background: 'var(--color-background)', border: '1px solid var(--color-border)' }}
              >
                <Row justifyContent="space-between" alignItems="start" margin="0 0 12px 0">
                  <Column gap="1" style={{ flex: 1 }}>
                    <Row gap="2" alignItems="center">
                      <Text weight={500}>{campaign.name}</Text>
                      <Badge size="sm" color={campaign.status === 'Active' ? 'success' : 'default'}>
                        {campaign.status}
                      </Badge>
                    </Row>
                    <Text size="xs" color="muted">
                      Sent to {campaign.sent.toLocaleString()} subscribers
                    </Text>
                  </Column>
                  <Column gap="1" style={{ textAlign: 'right' }}>
                    <Text weight={500}>{campaign.performance}%</Text>
                    <Text size="xs" color="muted">
                      Performance Score
                    </Text>
                  </Column>
                </Row>

                <Grid columns="repeat(4, 1fr)" gap="2" margin="12px 0">
                  <Column gap="1">
                    <Text size="xs" color="muted">
                      Opens
                    </Text>
                    <Text weight={500}>
                      {((campaign.opened / campaign.sent) * 100).toFixed(1)}%
                    </Text>
                    <Text size="xs" color="muted">
                      {campaign.opened.toLocaleString()}
                    </Text>
                  </Column>
                  <Column gap="1">
                    <Text size="xs" color="muted">
                      Clicks
                    </Text>
                    <Text weight={500}>
                      {((campaign.clicked / campaign.sent) * 100).toFixed(1)}%
                    </Text>
                    <Text size="xs" color="muted">
                      {campaign.clicked.toLocaleString()}
                    </Text>
                  </Column>
                  <Column gap="1">
                    <Text size="xs" color="muted">
                      Conversions
                    </Text>
                    <Text weight={500}>
                      {((campaign.converted / campaign.sent) * 100).toFixed(1)}%
                    </Text>
                    <Text size="xs" color="muted">
                      {campaign.converted.toLocaleString()}
                    </Text>
                  </Column>
                  <Column gap="1">
                    <Text size="xs" color="muted">
                      Est. Revenue
                    </Text>
                    <Text weight={500}>
                      ${(campaign.converted * 42.5).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    </Text>
                  </Column>
                </Grid>

                <Box height="4px" backgroundColor="1" borderRadius="full" overflow="hidden">
                  <Box
                    height="100%"
                    backgroundColor={campaign.performance > 75 ? 'success' : campaign.performance > 50 ? 'warning' : 'danger'}
                    width={`${campaign.performance}%`}
                  />
                </Box>
              </Box>
            ))}
          </Column>
        </LoadingPanel>
      </Panel>

      {/* Two Column - Automation + Conversion */}
      <Grid columns={{ xs: '1fr', lg: '1fr 1fr' }} gap="3">
        <Panel title="Automation Sequences">
          <LoadingPanel data={automationSequences} isLoading={false} error={null}>
            <Column gap="2">
              {automationSequences.map((seq, idx) => (
                <Box
                  key={seq.name}
                  padding="3"
                  borderRadius="2"
                  style={{ background: 'var(--color-background)' }}
                >
                  <Row justifyContent="space-between" alignItems="start" margin="0 0 12px 0">
                    <Column gap="1">
                      <Row gap="2" alignItems="center">
                        <Text weight={500}>{seq.name}</Text>
                        <Badge
                          size="sm"
                          color={seq.health === 'Good' ? 'success' : seq.health === 'Fair' ? 'warning' : 'default'}
                        >
                          {seq.health}
                        </Badge>
                      </Row>
                      <Text size="xs" color="muted">
                        {seq.triggers.toLocaleString()} triggers
                      </Text>
                    </Column>
                  </Row>

                  <Grid columns="repeat(3, 1fr)" gap="2">
                    <Column gap="1">
                      <Text size="xs" color="muted">
                        Conversions
                      </Text>
                      <Text weight={500}>{seq.conversions.toLocaleString()}</Text>
                    </Column>
                    <Column gap="1">
                      <Text size="xs" color="muted">
                        Revenue
                      </Text>
                      <Text weight={500}>{seq.revenue}</Text>
                    </Column>
                    <Column gap="1">
                      <Text size="xs" color="muted">
                        Conv. Rate
                      </Text>
                      <Text weight={500}>
                        {((seq.conversions / seq.triggers) * 100).toFixed(1)}%
                      </Text>
                    </Column>
                  </Grid>
                </Box>
              ))}
            </Column>
          </LoadingPanel>
        </Panel>

        <Panel title="Conversion Rate by Type">
          <Box height="320px">
            <Chart type="bar" chartData={conversionChart} height="100%" />
          </Box>
        </Panel>
      </Grid>

      {/* Health Indicators */}
      <Panel title="Deliverability & List Health">
        <Grid columns={{ xs: '1fr', md: '1fr 1fr 1fr' }} gap="2">
          {[
            { label: 'Bounce Rate', value: '1.2%', target: '< 2%', status: 'good' },
            { label: 'Spam Reports', value: '0.03%', target: '< 0.1%', status: 'good' },
            { label: 'Unsubscribe Rate', value: '0.5%', target: '< 0.3%', status: 'warning' },
          ].map((health) => (
            <Box key={health.label} padding="3" borderRadius="2" style={{ background: 'var(--color-background)' }}>
              <Row justifyContent="space-between" alignItems="start" margin="0 0 12px 0">
                <Column>
                  <Text size="sm" color="muted">
                    {health.label}
                  </Text>
                  <Heading level={3} style={{ margin: '4px 0' }}>
                    {health.value}
                  </Heading>
                </Column>
                <Badge color={health.status === 'good' ? 'success' : 'warning'} size="sm">
                  {health.status}
                </Badge>
              </Row>
              <Text size="xs" color="muted">
                Target: {health.target}
              </Text>
            </Box>
          ))}
        </Grid>
      </Panel>
    </PageBody>
  );
}
