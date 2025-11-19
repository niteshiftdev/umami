'use client';
import { Column, Row, Grid, Text, Heading, Icon } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { Panel } from '@/components/common/Panel';
import { useMessages } from '@/components/hooks';
import { Heart, MessageSquare, Share2, Eye, TrendingUp } from 'lucide-react';

export default function ContentCreatorDashboard() {
  const { formatMessage, labels } = useMessages();

  // Mock data for content creator use case
  const metrics = {
    totalViews: '2.4M',
    viewsChange: 34.2,
    engagement: '8.7%',
    engagementChange: 2.3,
    followers: '124.5K',
    followersChange: 12.8,
    avgDuration: '4m 32s',
    durationChange: 8.1,
  };

  const topContent = [
    { title: 'How to Build a Personal Brand in 2024', views: '324K', engagement: '12.3%', revenue: '$487 },
    { title: 'Behind the Scenes: Studio Setup Tour', views: '287K', engagement: '15.8%', revenue: '$654 },
    { title: 'Q&A with My Audience - Live Reaction', views: '156K', engagement: '22.1%', revenue: '$412 },
    { title: 'Tutorial: Content Creation Workflow', views: '98K', engagement: '9.4%', revenue: '$234 },
  ];

  const sourcesData = [
    { platform: 'YouTube', views: '1.2M', followers: '87K', engagement: '11.2%' },
    { platform: 'Instagram', views: '892K', followers: '45K', engagement: '6.8%' },
    { platform: 'TikTok', views: '312K', followers: '12K', engagement: '18.3%' },
  ];

  const audienceDemographics = [
    { segment: '18-24 years', percentage: 34, views: '816K' },
    { segment: '25-34 years', percentage: 42, views: '1.01M' },
    { segment: '35-44 years', percentage: 18, views: '432K' },
    { segment: '45+ years', percentage: 6, views: '144K' },
  ];

  return (
    <PageBody>
      <Column margin="2" gap="6">
        <PageHeader
          title="Content Creator Dashboard"
          description="Track audience growth, engagement, and content performance"
        />

        {/* Key Metrics */}
        <Grid columns={{ xs: 1, md: 2, lg: 4 }} gap="4">
          {/* Total Views */}
          <Panel>
            <Column gap="3">
              <Row justifyContent="space-between" alignItems="center">
                <Text size="sm" color="muted">Total Views</Text>
                <Icon size="sm" style={{ color: '#3b82f6' }}>
                  <Eye size={16} />
                </Icon>
              </Row>
              <Column>
                <Heading size="4">{metrics.totalViews}</Heading>
                <Text size="xs" color="muted">
                  <span style={{ color: '#10b981' }}>↑ {metrics.viewsChange}%</span>
                  {' '}vs last month
                </Text>
              </Column>
            </Column>
          </Panel>

          {/* Engagement Rate */}
          <Panel>
            <Column gap="3">
              <Row justifyContent="space-between" alignItems="center">
                <Text size="sm" color="muted">Engagement Rate</Text>
                <Icon size="sm" style={{ color: '#ec4899' }}>
                  <Heart size={16} />
                </Icon>
              </Row>
              <Column>
                <Heading size="4">{metrics.engagement}</Heading>
                <Text size="xs" color="muted">
                  <span style={{ color: '#10b981' }}>↑ {metrics.engagementChange}%</span>
                  {' '}vs last month
                </Text>
              </Column>
            </Column>
          </Panel>

          {/* Followers */}
          <Panel>
            <Column gap="3">
              <Row justifyContent="space-between" alignItems="center">
                <Text size="sm" color="muted">Followers</Text>
                <Icon size="sm" style={{ color: '#8b5cf6' }}>
                  <Share2 size={16} />
                </Icon>
              </Row>
              <Column>
                <Heading size="4">{metrics.followers}</Heading>
                <Text size="xs" color="muted">
                  <span style={{ color: '#10b981' }}>↑ {metrics.followersChange}%</span>
                  {' '}vs last month
                </Text>
              </Column>
            </Column>
          </Panel>

          {/* Avg Watch Duration */}
          <Panel>
            <Column gap="3">
              <Row justifyContent="space-between" alignItems="center">
                <Text size="sm" color="muted">Avg Duration</Text>
                <Icon size="sm" style={{ color: '#f59e0b' }}>
                  <TrendingUp size={16} />
                </Icon>
              </Row>
              <Column>
                <Heading size="4">{metrics.avgDuration}</Heading>
                <Text size="xs" color="muted">
                  <span style={{ color: '#10b981' }}>↑ {metrics.durationChange}%</span>
                  {' '}vs last month
                </Text>
              </Column>
            </Column>
          </Panel>
        </Grid>

        {/* Top Performing Content */}
        <Panel title="Top Performing Content">
          <Column gap="3">
            {topContent.map((content, idx) => (
              <Row
                key={idx}
                justifyContent="space-between"
                alignItems="flex-start"
                paddingY="2"
                style={{ borderBottom: idx < topContent.length - 1 ? '1px solid #e5e7eb' : 'none' }}
              >
                <Column gap="2" flex={1}>
                  <Text weight="bold">{content.title}</Text>
                  <Row gap="4" alignItems="center">
                    <Row gap="1" alignItems="center">
                      <Icon size="xs" style={{ color: '#6b7280' }}>
                        <Eye size={14} />
                      </Icon>
                      <Text size="xs" color="muted">{content.views}</Text>
                    </Row>
                    <Row gap="1" alignItems="center">
                      <Icon size="xs" style={{ color: '#6b7280' }}>
                        <Heart size={14} />
                      </Icon>
                      <Text size="xs" color="muted">{content.engagement}</Text>
                    </Row>
                  </Row>
                </Column>
                <Column alignItems="flex-end">
                  <Text weight="bold">${content.revenue}</Text>
                  <Text size="xs" color="muted">Ad Revenue</Text>
                </Column>
              </Row>
            ))}
          </Column>
        </Panel>

        <Grid columns={{ xs: 1, lg: 2 }} gap="4">
          {/* Platform Performance */}
          <Panel title="Platform Performance">
            <Column gap="3">
              {sourcesData.map((platform, idx) => (
                <Row
                  key={idx}
                  justifyContent="space-between"
                  alignItems="center"
                  paddingY="2"
                  style={{ borderBottom: idx < sourcesData.length - 1 ? '1px solid #e5e7eb' : 'none' }}
                >
                  <Column gap="1" flex={1}>
                    <Text weight="bold">{platform.platform}</Text>
                    <Text size="xs" color="muted">{platform.views} views</Text>
                  </Column>
                  <Column alignItems="flex-end" gap="1">
                    <Text weight="bold">{platform.followers}</Text>
                    <Text size="xs" style={{ color: '#8b5cf6' }}>{platform.engagement} eng.</Text>
                  </Column>
                </Row>
              ))}
            </Column>
          </Panel>

          {/* Audience Demographics */}
          <Panel title="Audience Demographics">
            <Column gap="3">
              {audienceDemographics.map((demo, idx) => (
                <Row
                  key={idx}
                  justifyContent="space-between"
                  alignItems="center"
                  paddingY="2"
                  style={{ borderBottom: idx < audienceDemographics.length - 1 ? '1px solid #e5e7eb' : 'none' }}
                >
                  <Column gap="1" flex={1}>
                    <Row justifyContent="space-between">
                      <Text size="sm">{demo.segment}</Text>
                      <Text weight="bold">{demo.percentage}%</Text>
                    </Row>
                    <div
                      style={{
                        height: '6px',
                        backgroundColor: '#e5e7eb',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${demo.percentage}%`,
                          backgroundColor: '#8b5cf6'
                        }}
                      />
                    </div>
                    <Text size="xs" color="muted">{demo.views}</Text>
                  </Column>
                </Row>
              ))}
            </Column>
          </Panel>
        </Grid>
      </Column>
    </PageBody>
  );
}
