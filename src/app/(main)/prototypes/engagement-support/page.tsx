'use client';

import { Column, Row, Grid, Heading, Text, Box, Badge } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { PageBody } from '@/components/common/PageBody';
import { LoadingPanel } from '@/components/common/LoadingPanel';
import { Chart } from '@/components/charts/Chart';
import { CHART_COLORS } from '@/lib/constants';

// Mock data
const supportMetrics = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      type: 'bar',
      label: 'Tickets Created',
      data: [145, 167, 142, 189, 156, 98, 76],
      backgroundColor: CHART_COLORS[0],
    },
    {
      type: 'bar',
      label: 'Resolved',
      data: [134, 152, 138, 176, 148, 92, 71],
      backgroundColor: CHART_COLORS[1],
    },
  ],
};

const sentimentChart = {
  labels: ['Very Satisfied', 'Satisfied', 'Neutral', 'Unsatisfied', 'Very Unsatisfied'],
  datasets: [
    {
      type: 'bar',
      data: [456, 234, 89, 34, 12],
      backgroundColor: ['#44b556', '#90EE90', '#FFA500', '#FF6347', '#e34850'],
    },
  ],
};

const tickets = [
  {
    id: 'TKT-4521',
    category: 'Bug',
    subject: 'Dashboard not loading after update',
    status: 'Open',
    priority: 'High',
    created: '2 hours ago',
    sentiment: 'negative',
    resolution: 0,
  },
  {
    id: 'TKT-4520',
    category: 'Feature Request',
    subject: 'Need ability to export custom reports',
    status: 'In Progress',
    priority: 'Medium',
    created: '4 hours ago',
    sentiment: 'neutral',
    resolution: 45,
  },
  {
    id: 'TKT-4519',
    category: 'Integration',
    subject: 'Slack integration setup guide needed',
    status: 'Resolved',
    priority: 'Low',
    created: '8 hours ago',
    sentiment: 'positive',
    resolution: 100,
  },
  {
    id: 'TKT-4518',
    category: 'Billing',
    subject: 'Incorrect charge on invoice',
    status: 'In Progress',
    priority: 'High',
    created: '12 hours ago',
    sentiment: 'negative',
    resolution: 60,
  },
  {
    id: 'TKT-4517',
    category: 'Documentation',
    subject: 'API docs missing authentication examples',
    status: 'Open',
    priority: 'Medium',
    created: '1 day ago',
    sentiment: 'neutral',
    resolution: 0,
  },
];

const categoryMetrics = [
  { category: 'Bug', count: 234, avgResolutionTime: '4.2 hours', satisfaction: 78 },
  { category: 'Feature Request', count: 189, avgResolutionTime: '2.1 days', satisfaction: 82 },
  { category: 'Integration', count: 156, avgResolutionTime: '6.5 hours', satisfaction: 85 },
  { category: 'Billing', count: 123, avgResolutionTime: '3.1 hours', satisfaction: 72 },
  { category: 'Documentation', count: 98, avgResolutionTime: '1.2 days', satisfaction: 88 },
];

const teamPerformance = [
  { agent: 'Sarah Chen', tickets: 234, resolved: 228, satisfaction: 4.7, avgTime: '2.3h' },
  { agent: 'Marcus Johnson', tickets: 198, resolved: 192, satisfaction: 4.5, avgTime: '2.8h' },
  { agent: 'Elena Rodriguez', tickets: 212, resolved: 206, satisfaction: 4.8, avgTime: '2.1h' },
  { agent: 'Raj Patel', tickets: 156, resolved: 148, satisfaction: 4.4, avgTime: '3.2h' },
];

export default function EngagementSupport() {
  return (
    <PageBody gap>
      <Row justifyContent="space-between" alignItems="flex-start">
        <Column gap="1">
          <Heading level={1}>Customer Support & Feedback</Heading>
          <Text color="muted">Track tickets, sentiment, resolution times, and team performance</Text>
        </Column>
      </Row>

      {/* Key Metrics */}
      <Grid columns={{ xs: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }} gap="2">
        {[
          { label: 'Open Tickets', value: '156', subtext: '↓ 12% from last week', trend: 'down' },
          { label: 'Avg Resolution', value: '3.2h', subtext: '↓ 0.4h from last week', trend: 'down' },
          { label: 'Customer CSAT', value: '4.6/5', subtext: '↑ 0.2 from last week', trend: 'up' },
          { label: 'First Response', value: '18m', subtext: '↓ 3m from last week', trend: 'down' },
        ].map((metric, idx) => (
          <Box
            key={metric.label}
            padding="3"
            borderRadius="2"
            style={{
              border: `2px solid ${metric.trend === 'up' ? '#44b556' : '#2680eb'}30`,
              borderLeft: `4px solid ${metric.trend === 'up' ? '#44b556' : '#2680eb'}`,
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

      {/* Ticket & Resolution Trend */}
      <Panel title="Ticket Volume & Resolution Rate">
        <Box height="300px">
          <Chart type="bar" chartData={supportMetrics} height="100%" />
        </Box>
      </Panel>

      {/* Recent Tickets */}
      <Panel title="Open & In-Progress Tickets">
        <LoadingPanel data={tickets} isLoading={false} error={null}>
          <Column gap="2">
            {tickets.map((ticket) => (
              <Box
                key={ticket.id}
                padding="3"
                borderRadius="2"
                style={{ background: 'var(--color-background)', border: '1px solid var(--color-border)' }}
              >
                <Row justifyContent="space-between" alignItems="start" margin="0 0 12px 0">
                  <Column gap="1" style={{ flex: 1 }}>
                    <Row gap="2" alignItems="center">
                      <Text weight={500} size="sm">
                        {ticket.id}
                      </Text>
                      <Badge size="sm">{ticket.category}</Badge>
                      <Badge
                        size="sm"
                        color={
                          ticket.priority === 'High'
                            ? 'danger'
                            : ticket.priority === 'Medium'
                              ? 'warning'
                              : 'default'
                        }
                      >
                        {ticket.priority}
                      </Badge>
                      <Badge
                        size="sm"
                        color={
                          ticket.sentiment === 'positive'
                            ? 'success'
                            : ticket.sentiment === 'negative'
                              ? 'danger'
                              : 'default'
                        }
                      >
                        {ticket.sentiment}
                      </Badge>
                    </Row>
                    <Text size="sm" weight={500}>
                      {ticket.subject}
                    </Text>
                    <Text size="xs" color="muted">
                      Created {ticket.created}
                    </Text>
                  </Column>
                  <Column gap="1" style={{ textAlign: 'right', minWidth: '120px' }}>
                    <Badge size="sm" color={ticket.status === 'Resolved' ? 'success' : 'default'}>
                      {ticket.status}
                    </Badge>
                    {ticket.resolution > 0 && (
                      <>
                        <Text size="xs" color="muted">
                          {ticket.resolution}% resolved
                        </Text>
                        <Box height="4px" backgroundColor="1" borderRadius="full" overflow="hidden">
                          <Box
                            height="100%"
                            backgroundColor={ticket.resolution === 100 ? 'success' : 'primary'}
                            width={`${ticket.resolution}%`}
                          />
                        </Box>
                      </>
                    )}
                  </Column>
                </Row>
              </Box>
            ))}
          </Column>
        </LoadingPanel>
      </Panel>

      {/* Two Column - Sentiment + Categories */}
      <Grid columns={{ xs: '1fr', lg: '1fr 1fr' }} gap="3">
        <Panel title="Customer Sentiment">
          <Box height="300px">
            <Chart type="bar" chartData={sentimentChart} height="100%" />
          </Box>
        </Panel>

        <Panel title="Support Categories Performance">
          <LoadingPanel data={categoryMetrics} isLoading={false} error={null}>
            <Column gap="2">
              {categoryMetrics.map((cat) => (
                <Box
                  key={cat.category}
                  padding="3"
                  borderRadius="2"
                  style={{ background: 'var(--color-background)' }}
                >
                  <Row justifyContent="space-between" alignItems="start" margin="0 0 12px 0">
                    <Column gap="1">
                      <Text weight={500}>{cat.category}</Text>
                      <Text size="xs" color="muted">
                        {cat.count} tickets
                      </Text>
                    </Column>
                    <Box
                      padding="2"
                      borderRadius="2"
                      style={{
                        background: `${cat.satisfaction > 80 ? '#44b556' : '#FFA500'}20`,
                        textAlign: 'center',
                      }}
                    >
                      <Text weight={500} size="sm">
                        {cat.satisfaction}%
                      </Text>
                    </Box>
                  </Row>
                  <Grid columns="repeat(2, 1fr)" gap="1">
                    <Column gap="1">
                      <Text size="xs" color="muted">
                        Avg Resolution
                      </Text>
                      <Text weight={500} size="sm">
                        {cat.avgResolutionTime}
                      </Text>
                    </Column>
                    <Column gap="1">
                      <Text size="xs" color="muted">
                        Satisfaction
                      </Text>
                      <Text weight={500} size="sm">
                        {cat.satisfaction}%
                      </Text>
                    </Column>
                  </Grid>
                </Box>
              ))}
            </Column>
          </LoadingPanel>
        </Panel>
      </Grid>

      {/* Team Performance */}
      <Panel title="Support Team Performance">
        <LoadingPanel data={teamPerformance} isLoading={false} error={null}>
          <Column gap="2">
            {teamPerformance.map((agent, idx) => (
              <Box
                key={agent.agent}
                padding="3"
                borderRadius="2"
                style={{ background: 'var(--color-background)' }}
              >
                <Row justifyContent="space-between" alignItems="start" margin="0 0 12px 0">
                  <Column gap="1">
                    <Text weight={500}>{agent.agent}</Text>
                    <Text size="xs" color="muted">
                      {agent.tickets} tickets handled
                    </Text>
                  </Column>
                  <Box
                    padding="2"
                    borderRadius="2"
                    style={{ background: CHART_COLORS[idx % CHART_COLORS.length] + '20', textAlign: 'center' }}
                  >
                    <Heading level={4} style={{ margin: 0 }}>
                      ⭐ {agent.satisfaction}
                    </Heading>
                  </Box>
                </Row>
                <Grid columns="repeat(3, 1fr)" gap="2">
                  <Column gap="1">
                    <Text size="xs" color="muted">
                      Resolved
                    </Text>
                    <Text weight={500}>
                      {agent.resolved}/{agent.tickets}
                    </Text>
                  </Column>
                  <Column gap="1">
                    <Text size="xs" color="muted">
                      Resolution Rate
                    </Text>
                    <Text weight={500}>
                      {((agent.resolved / agent.tickets) * 100).toFixed(0)}%
                    </Text>
                  </Column>
                  <Column gap="1">
                    <Text size="xs" color="muted">
                      Avg Time
                    </Text>
                    <Text weight={500}>{agent.avgTime}</Text>
                  </Column>
                </Grid>
              </Box>
            ))}
          </Column>
        </LoadingPanel>
      </Panel>
    </PageBody>
  );
}
