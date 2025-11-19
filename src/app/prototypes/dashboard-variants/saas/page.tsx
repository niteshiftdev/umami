'use client';
import { Column, Row, Grid, Text, Heading, Icon, Button } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { Panel } from '@/components/common/Panel';
import { useMessages } from '@/components/hooks';
import { TrendingUp, Users, CreditCard, AlertCircle } from 'lucide-react';

export default function SaaSDashboard() {
  const { formatMessage, labels } = useMessages();

  // Mock data for SaaS use case
  const metrics = {
    activeUsers: 2847,
    activeUsersChange: 12.5,
    revenue: '$48,230',
    revenueChange: 8.3,
    churn: '2.3%',
    churnChange: -0.5,
    signups: 342,
    signupsChange: 24.1,
  };

  const topPages = [
    { path: '/pricing', visitors: 8234, conversionRate: 12.5, revenue: '$2,847 },
    { path: '/features', visitors: 6521, conversionRate: 8.2, revenue: '$1,456 },
    { path: '/dashboard', visitors: 5432, conversionRate: 45.3, revenue: '$6,234 },
    { path: '/integrations', visitors: 3421, conversionRate: 5.1, revenue: '$892 },
  ];

  const recentEvents = [
    { type: 'Signup', user: 'company.com', time: '2 min ago', value: '$0' },
    { type: 'Subscription', user: 'startupxyz.io', time: '15 min ago', value: '$299' },
    { type: 'Upgrade', user: 'enterprise.com', time: '1 hour ago', value: '$999' },
    { type: 'Churn', user: 'failed-startup.com', time: '3 hours ago', value: '-$199' },
  ];

  return (
    <PageBody>
      <Column margin="2" gap="6">
        <PageHeader
          title="SaaS Dashboard"
          description="Key metrics and revenue tracking for subscription business"
        />

        {/* Top Metrics Row */}
        <Grid columns={{ xs: 1, md: 2, lg: 4 }} gap="4">
          {/* Active Users */}
          <Panel>
            <Column gap="3">
              <Row justifyContent="space-between" alignItems="center">
                <Text size="sm" color="muted">Active Users</Text>
                <Icon size="sm" color="blue" style={{ color: '#3b82f6' }}>
                  <Users size={16} />
                </Icon>
              </Row>
              <Column>
                <Heading size="4">{metrics.activeUsers.toLocaleString()}</Heading>
                <Text size="xs" color="muted">
                  <span style={{ color: '#10b981' }}>↑ {metrics.activeUsersChange}%</span>
                  {' '}vs last month
                </Text>
              </Column>
            </Column>
          </Panel>

          {/* Monthly Revenue */}
          <Panel>
            <Column gap="3">
              <Row justifyContent="space-between" alignItems="center">
                <Text size="sm" color="muted">Monthly Revenue</Text>
                <Icon size="sm" style={{ color: '#f59e0b' }}>
                  <CreditCard size={16} />
                </Icon>
              </Row>
              <Column>
                <Heading size="4">{metrics.revenue}</Heading>
                <Text size="xs" color="muted">
                  <span style={{ color: '#10b981' }}>↑ {metrics.revenueChange}%</span>
                  {' '}vs last month
                </Text>
              </Column>
            </Column>
          </Panel>

          {/* New Signups */}
          <Panel>
            <Column gap="3">
              <Row justifyContent="space-between" alignItems="center">
                <Text size="sm" color="muted">New Signups</Text>
                <Icon size="sm" style={{ color: '#8b5cf6' }}>
                  <TrendingUp size={16} />
                </Icon>
              </Row>
              <Column>
                <Heading size="4">{metrics.signups}</Heading>
                <Text size="xs" color="muted">
                  <span style={{ color: '#10b981' }}>↑ {metrics.signupsChange}%</span>
                  {' '}vs last month
                </Text>
              </Column>
            </Column>
          </Panel>

          {/* Churn Rate */}
          <Panel>
            <Column gap="3">
              <Row justifyContent="space-between" alignItems="center">
                <Text size="sm" color="muted">Churn Rate</Text>
                <Icon size="sm" style={{ color: '#ef4444' }}>
                  <AlertCircle size={16} />
                </Icon>
              </Row>
              <Column>
                <Heading size="4">{metrics.churn}</Heading>
                <Text size="xs" color="muted">
                  <span style={{ color: '#10b981' }}>↓ {Math.abs(metrics.churnChange)}%</span>
                  {' '}vs last month (good)
                </Text>
              </Column>
            </Column>
          </Panel>
        </Grid>

        {/* Top Converting Pages */}
        <Panel title="Top Converting Pages">
          <Column gap="3">
            {topPages.map((page, idx) => (
              <Row key={idx} justifyContent="space-between" alignItems="center" paddingY="2">
                <Column gap="1" flex={1}>
                  <Text weight="bold">{page.path}</Text>
                  <Text size="xs" color="muted">{page.visitors.toLocaleString()} visitors</Text>
                </Column>
                <Column alignItems="flex-end" gap="1">
                  <Text weight="bold">{page.conversionRate}%</Text>
                  <Text size="xs" color="muted">{page.revenue}</Text>
                </Column>
              </Row>
            ))}
          </Column>
        </Panel>

        {/* Recent Activity */}
        <Panel title="Recent Activity">
          <Column gap="2">
            {recentEvents.map((event, idx) => (
              <Row
                key={idx}
                justifyContent="space-between"
                alignItems="center"
                paddingY="2"
                style={{ borderBottom: idx < recentEvents.length - 1 ? '1px solid #e5e7eb' : 'none' }}
              >
                <Column gap="1" flex={1}>
                  <Row gap="2" alignItems="center">
                    <Text
                      weight="bold"
                      size="sm"
                      style={{
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: event.type === 'Churn' ? '#fee2e2' : '#dbeafe',
                        color: event.type === 'Churn' ? '#dc2626' : '#2563eb',
                        fontSize: '11px'
                      }}
                    >
                      {event.type}
                    </Text>
                    <Text>{event.user}</Text>
                  </Row>
                  <Text size="xs" color="muted">{event.time}</Text>
                </Column>
                <Text weight="bold" style={{ color: event.value.includes('-') ? '#dc2626' : '#059669' }}>
                  {event.value}
                </Text>
              </Row>
            ))}
          </Column>
        </Panel>
      </Column>
    </PageBody>
  );
}
