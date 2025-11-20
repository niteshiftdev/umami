'use client';

import { Column, Row, Grid, Heading, Text, Box } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { PageBody } from '@/components/common/PageBody';
import { LoadingPanel } from '@/components/common/LoadingPanel';
import { Chart } from '@/components/charts/Chart';
import { CHART_COLORS } from '@/lib/constants';

// Mock data
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
            : '#2680eb20',
      color:
        color === 'success'
          ? '#44b556'
          : color === 'danger'
            ? '#e34850'
            : '#2680eb',
      fontSize: size === 'sm' ? '11px' : '12px',
      fontWeight: 500,
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </Box>
);

const platformMetrics = [
  { platform: 'Twitter/X', followers: 28450, growth: 12.5, engagement: 4.2, color: '#1DA1F2' },
  { platform: 'LinkedIn', followers: 15230, growth: 8.3, engagement: 6.8, color: '#0A66C2' },
  { platform: 'Instagram', followers: 42100, growth: 18.7, engagement: 7.4, color: '#E4405F' },
  { platform: 'TikTok', followers: 67850, growth: 35.2, engagement: 12.3, color: '#000000' },
  { platform: 'YouTube', followers: 8950, growth: 5.1, engagement: 8.9, color: '#FF0000' },
];

const engagementChart = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      type: 'line',
      label: 'Twitter/X',
      data: [1200, 1900, 1500, 2200, 2800, 3100, 2900],
      borderColor: '#1DA1F2',
      backgroundColor: '#1DA1F215',
      fill: true,
      tension: 0.4,
    },
    {
      type: 'line',
      label: 'Instagram',
      data: [2100, 2400, 2200, 2800, 3400, 3900, 3600],
      borderColor: '#E4405F',
      backgroundColor: '#E4405F15',
      fill: true,
      tension: 0.4,
    },
    {
      type: 'line',
      label: 'TikTok',
      data: [3200, 3800, 3400, 4200, 4900, 5600, 5200],
      borderColor: '#000000',
      backgroundColor: '#00000015',
      fill: true,
      tension: 0.4,
    },
  ],
};

const topPosts = [
  { platform: 'TikTok', content: 'Behind-the-scenes product demo', engagement: 245700, sentiment: 'positive', shares: 12400 },
  { platform: 'Twitter/X', content: 'New feature announcement', engagement: 89234, sentiment: 'positive', shares: 3450 },
  { platform: 'Instagram', content: 'Team spotlight', engagement: 45600, sentiment: 'positive', shares: 2100 },
  { platform: 'LinkedIn', content: 'Industry insights article', engagement: 34200, sentiment: 'positive', shares: 1890 },
  { platform: 'YouTube', content: 'Product tutorial', engagement: 12450, sentiment: 'positive', shares: 890 },
];

const sentimentData = {
  labels: ['Positive', 'Neutral', 'Negative'],
  datasets: [
    {
      type: 'doughnut',
      data: [72, 20, 8],
      backgroundColor: ['#44b556', '#FFA500', '#e34850'],
    },
  ],
};

export default function EngagementSocial() {
  return (
    <PageBody gap>
      <Row justifyContent="space-between" alignItems="flex-start">
        <Column gap="1">
          <Heading level={1}>Social Media Engagement</Heading>
          <Text color="muted">Track reach, resonance, and community sentiment across platforms</Text>
        </Column>
      </Row>

      {/* Platform Overview Grid */}
      <Grid columns={{ xs: '1fr', md: '1fr 1fr 1fr' }} gap="2">
        {platformMetrics.map((platform) => (
          <Box
            key={platform.platform}
            padding="3"
            borderRadius="2"
            style={{
              border: '1px solid var(--color-border)',
              borderLeft: `3px solid ${platform.color}`,
              background: 'var(--color-background)',
            }}
          >
            <Row justifyContent="space-between" alignItems="start" gap="2">
              <Column gap="1" style={{ flex: 1 }}>
                <Text size="sm" weight={500}>
                  {platform.platform}
                </Text>
                <Heading level={3} style={{ margin: 0 }}>
                  {(platform.followers / 1000).toFixed(1)}k
                </Heading>
                <Text size="xs" color="muted">
                  followers
                </Text>
              </Column>
              <Badge color="success" size="sm">
                +{platform.growth}%
              </Badge>
            </Row>
            <Box height="1px" backgroundColor="1" style={{ margin: '12px 0' }} />
            <Row justifyContent="space-between">
              <Text size="sm" color="muted">
                Engagement Rate
              </Text>
              <Text weight={500}>{platform.engagement}%</Text>
            </Row>
          </Box>
        ))}
      </Grid>

      {/* Engagement Trend */}
      <Panel title="Weekly Engagement Trend">
        <Box height="350px">
          <Chart type="line" chartData={engagementChart} height="100%" />
        </Box>
      </Panel>

      {/* Two Column - Sentiment + Top Posts */}
      <Grid columns={{ xs: '1fr', lg: '1fr 2fr' }} gap="3">
        <Panel title="Overall Sentiment">
          <Column gap="3">
            <Box height="250px">
              <Chart type="doughnut" chartData={sentimentData} height="100%" />
            </Box>
            <Column gap="2">
              <Row justifyContent="space-between" padding="2" style={{ background: 'var(--color-background)' }}>
                <Row gap="2" alignItems="center">
                  <Box width="12px" height="12px" borderRadius="full" backgroundColor="success" />
                  <Text size="sm">Positive</Text>
                </Row>
                <Text weight={500}>72%</Text>
              </Row>
              <Row justifyContent="space-between" padding="2" style={{ background: 'var(--color-background)' }}>
                <Row gap="2" alignItems="center">
                  <Box width="12px" height="12px" borderRadius="full" backgroundColor="warning" />
                  <Text size="sm">Neutral</Text>
                </Row>
                <Text weight={500}>20%</Text>
              </Row>
              <Row justifyContent="space-between" padding="2" style={{ background: 'var(--color-background)' }}>
                <Row gap="2" alignItems="center">
                  <Box width="12px" height="12px" borderRadius="full" backgroundColor="danger" />
                  <Text size="sm">Negative</Text>
                </Row>
                <Text weight={500}>8%</Text>
              </Row>
            </Column>
          </Column>
        </Panel>

        <Panel title="Top Performing Posts">
          <LoadingPanel data={topPosts} isLoading={false} error={null}>
            <Column gap="2">
              {topPosts.map((post, idx) => (
                <Box
                  key={idx}
                  padding="3"
                  borderRadius="2"
                  style={{ background: 'var(--color-background)', border: '1px solid var(--color-border)' }}
                >
                  <Row justifyContent="space-between" alignItems="start" gap="2" margin="0 0 8px 0">
                    <Row gap="2" alignItems="center">
                      <Badge size="sm" style={{ background: CHART_COLORS[idx % CHART_COLORS.length] }}>
                        {post.platform}
                      </Badge>
                      <Badge color="success" size="sm">
                        Positive
                      </Badge>
                    </Row>
                    <Text weight={500}>{(post.engagement / 1000).toFixed(1)}k</Text>
                  </Row>
                  <Text size="sm" weight={500} style={{ marginBottom: '8px' }}>
                    {post.content}
                  </Text>
                  <Row justifyContent="space-between">
                    <Text size="xs" color="muted">
                      {post.shares.toLocaleString()} shares
                    </Text>
                    <Text size="xs" color="muted">
                      Engagement
                    </Text>
                  </Row>
                </Box>
              ))}
            </Column>
          </LoadingPanel>
        </Panel>
      </Grid>

      {/* Influencer Mentions */}
      <Panel title="Influencer Mentions & Reach">
        <Column gap="2">
          {[
            { handle: '@influencer_a', followers: 245000, mentions: 12, reach: '2.9M' },
            { handle: '@tech_industry_b', followers: 189000, mentions: 8, reach: '1.5M' },
            { handle: '@opinion_leader_c', followers: 156000, mentions: 5, reach: '890K' },
            { handle: '@industry_voice_d', followers: 124000, mentions: 3, reach: '450K' },
          ].map((influencer, idx) => (
            <Row
              key={influencer.handle}
              justifyContent="space-between"
              padding="3"
              style={{ background: 'var(--color-background)', borderRadius: '4px' }}
            >
              <Column gap="1">
                <Text weight={500}>{influencer.handle}</Text>
                <Text size="xs" color="muted">
                  {influencer.followers.toLocaleString()} followers
                </Text>
              </Column>
              <Row gap="4">
                <Column gap="1" style={{ textAlign: 'right' }}>
                  <Text weight={500}>{influencer.mentions}</Text>
                  <Text size="xs" color="muted">
                    mentions
                  </Text>
                </Column>
                <Column gap="1" style={{ textAlign: 'right' }}>
                  <Text weight={500}>{influencer.reach}</Text>
                  <Text size="xs" color="muted">
                    reach
                  </Text>
                </Column>
              </Row>
            </Row>
          ))}
        </Column>
      </Panel>
    </PageBody>
  );
}
