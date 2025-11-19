'use client';
import { Column, Row, Grid, Text, Heading, Icon } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { Panel } from '@/components/common/Panel';
import { useMessages } from '@/components/hooks';
import { Zap, Target, TrendingUp, BarChart3, Users, AlertCircle } from 'lucide-react';

export default function MarketingAgencyDashboard() {
  const { formatMessage, labels } = useMessages();

  // Mock data for marketing agency use case
  const metrics = {
    roi: '3.8x',
    roiChange: 0.4,
    campaigns: 24,
    activeChange: 3,
    leads: '1,847',
    leadsChange: 28.3,
    adSpend: '$42,300',
    spendChange: 12.1,
  };

  const clientCampaigns = [
    { client: 'TechStartup Inc', campaign: 'Product Launch', roi: 4.2, spend: '$8,500, clicks: 12400, leads: 287 },
    { client: 'Fashion Boutique', campaign: 'Summer Sale', roi: 3.9, spend: '$5,200, clicks: 8900, leads: 156 },
    { client: 'SaaS Platform', campaign: 'Lead Generation', roi: 3.1, spend: '$12,300, clicks: 18700, leads: 892 },
    { client: 'Local Services', campaign: 'Awareness', roi: 2.4, spend: '$3,100, clicks: 5600, leads: 134 },
  ];

  const channels = [
    { channel: 'Google Ads', spend: '$15,200, impressions: 284K, clicks: 8900, ctr: '3.13%', cpc: '$1.71' },
    { channel: 'Facebook Ads', spend: '$12,800, impressions: 198K, clicks: 5670, ctr: '2.86%', cpc: '$2.26' },
    { channel: 'LinkedIn Ads', spend: '$8,300, impressions: 92K, clicks: 2100, ctr: '2.28%', cpc: '$3.95' },
    { channel: 'Instagram Ads', spend: '$6,000, impressions: 156K, clicks: 3200, ctr: '2.05%', cpc: '$1.88' },
  ];

  const alerts = [
    { type: 'Warning', message: 'TechStartup campaign CTR dropped 15% - review creatives', severity: 'high' },
    { type: 'Info', message: 'LinkedIn Ads CPC increased to $3.95 - consider bid adjustment', severity: 'medium' },
    { type: 'Success', message: 'Fashion Boutique reached 200% of lead target this week', severity: 'low' },
  ];

  return (
    <PageBody>
      <Column margin="2" gap="6">
        <PageHeader
          title="Marketing Agency Dashboard"
          description="Multi-client campaign performance and ROI tracking"
        />

        {/* Key Metrics */}
        <Grid columns={{ xs: 1, md: 2, lg: 4 }} gap="4">
          {/* Overall ROI */}
          <Panel>
            <Column gap="3">
              <Row justifyContent="space-between" alignItems="center">
                <Text size="sm" color="muted">Overall ROI</Text>
                <Icon size="sm" style={{ color: '#10b981' }}>
                  <TrendingUp size={16} />
                </Icon>
              </Row>
              <Column>
                <Heading size="4">{metrics.roi}</Heading>
                <Text size="xs" color="muted">
                  <span style={{ color: '#10b981' }}>↑ {metrics.roiChange}x</span>
                  {' '}vs last month
                </Text>
              </Column>
            </Column>
          </Panel>

          {/* Active Campaigns */}
          <Panel>
            <Column gap="3">
              <Row justifyContent="space-between" alignItems="center">
                <Text size="sm" color="muted">Active Campaigns</Text>
                <Icon size="sm" style={{ color: '#3b82f6' }}>
                  <Target size={16} />
                </Icon>
              </Row>
              <Column>
                <Heading size="4">{metrics.campaigns}</Heading>
                <Text size="xs" color="muted">
                  <span style={{ color: '#10b981' }}>↑ {metrics.activeChange} new</span>
                  {' '}this month
                </Text>
              </Column>
            </Column>
          </Panel>

          {/* Total Leads */}
          <Panel>
            <Column gap="3">
              <Row justifyContent="space-between" alignItems="center">
                <Text size="sm" color="muted">Total Leads</Text>
                <Icon size="sm" style={{ color: '#8b5cf6' }}>
                  <Users size={16} />
                </Icon>
              </Row>
              <Column>
                <Heading size="4">{metrics.leads}</Heading>
                <Text size="xs" color="muted">
                  <span style={{ color: '#10b981' }}>↑ {metrics.leadsChange}%</span>
                  {' '}vs last month
                </Text>
              </Column>
            </Column>
          </Panel>

          {/* Ad Spend */}
          <Panel>
            <Column gap="3">
              <Row justifyContent="space-between" alignItems="center">
                <Text size="sm" color="muted">Total Ad Spend</Text>
                <Icon size="sm" style={{ color: '#f59e0b' }}>
                  <Zap size={16} />
                </Icon>
              </Row>
              <Column>
                <Heading size="4">{metrics.adSpend}</Heading>
                <Text size="xs" color="muted">
                  <span style={{ color: '#10b981' }}>↑ {metrics.spendChange}%</span>
                  {' '}vs last month
                </Text>
              </Column>
            </Column>
          </Panel>
        </Grid>

        {/* Client Campaigns Performance */}
        <Panel title="Client Campaigns Performance">
          <Column gap="3">
            {clientCampaigns.map((campaign, idx) => (
              <Row
                key={idx}
                justifyContent="space-between"
                alignItems="center"
                paddingY="2"
                style={{ borderBottom: idx < clientCampaigns.length - 1 ? '1px solid #e5e7eb' : 'none' }}
              >
                <Column gap="1" flex={1}>
                  <Text weight="bold">{campaign.client}</Text>
                  <Text size="xs" color="muted">{campaign.campaign}</Text>
                </Column>
                <Column alignItems="flex-end" gap="2">
                  <Row gap="4">
                    <Column alignItems="flex-end">
                      <Text weight="bold" style={{ color: '#10b981' }}>{campaign.roi}x ROI</Text>
                      <Text size="xs" color="muted">{campaign.spend}</Text>
                    </Column>
                    <Column alignItems="flex-end">
                      <Text weight="bold">{campaign.leads}</Text>
                      <Text size="xs" color="muted">{campaign.clicks}</Text>
                    </Column>
                  </Row>
                </Column>
              </Row>
            ))}
          </Column>
        </Panel>

        {/* Channel Performance */}
        <Panel title="Channel Performance">
          <Column gap="3">
            {channels.map((channel, idx) => (
              <Column
                key={idx}
                gap="2"
                paddingY="3"
                style={{ borderBottom: idx < channels.length - 1 ? '1px solid #e5e7eb' : 'none' }}
              >
                <Row justifyContent="space-between" alignItems="center">
                  <Text weight="bold">{channel.channel}</Text>
                  <Text size="sm">{channel.spend}</Text>
                </Row>
                <Grid columns={{ xs: 2, md: 3 }} gap="3">
                  <Column>
                    <Text size="xs" color="muted">Impressions</Text>
                    <Text size="sm" weight="bold">{channel.impressions}</Text>
                  </Column>
                  <Column>
                    <Text size="xs" color="muted">CTR</Text>
                    <Text size="sm" weight="bold">{channel.ctr}</Text>
                  </Column>
                  <Column>
                    <Text size="xs" color="muted">CPC</Text>
                    <Text size="sm" weight="bold">{channel.cpc}</Text>
                  </Column>
                </Grid>
              </Column>
            ))}
          </Column>
        </Panel>

        {/* Alerts & Actions */}
        <Panel title="Alerts & Optimization Opportunities">
          <Column gap="3">
            {alerts.map((alert, idx) => (
              <Row
                key={idx}
                alignItems="flex-start"
                gap="3"
                paddingY="2"
                paddingX="3"
                style={{
                  backgroundColor: alert.severity === 'high' ? '#fee2e2' : alert.severity === 'medium' ? '#fef3c7' : '#dcfce7',
                  borderRadius: '6px',
                  borderLeft: `4px solid ${alert.severity === 'high' ? '#dc2626' : alert.severity === 'medium' ? '#d97706' : '#16a34a'}`
                }}
              >
                <Icon
                  size="sm"
                  style={{
                    color: alert.severity === 'high' ? '#dc2626' : alert.severity === 'medium' ? '#d97706' : '#16a34a',
                    marginTop: '2px'
                  }}
                >
                  <AlertCircle size={16} />
                </Icon>
                <Column gap="1" flex={1}>
                  <Text
                    weight="bold"
                    size="sm"
                    style={{
                      color: alert.severity === 'high' ? '#dc2626' : alert.severity === 'medium' ? '#d97706' : '#16a34a'
                    }}
                  >
                    {alert.type}
                  </Text>
                  <Text size="sm">{alert.message}</Text>
                </Column>
              </Row>
            ))}
          </Column>
        </Panel>
      </Column>
    </PageBody>
  );
}
