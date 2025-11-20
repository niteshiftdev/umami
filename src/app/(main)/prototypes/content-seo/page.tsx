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
const organicTrafficChart = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
  datasets: [
    {
      type: 'line',
      label: 'Organic Traffic',
      data: [4234, 4567, 5123, 5678, 6234, 6890, 7456, 8123],
      borderColor: CHART_COLORS[0],
      backgroundColor: `${CHART_COLORS[0]}15`,
      fill: true,
      tension: 0.4,
    },
  ],
};

const rankingChart = {
  labels: ['Top 3', 'Top 5', 'Top 10', 'Top 20', 'Top 50', 'Top 100'],
  datasets: [
    {
      type: 'bar',
      label: 'Keywords Ranking',
      data: [45, 89, 156, 234, 456, 789],
      backgroundColor: CHART_COLORS[0],
    },
  ],
};

const topKeywords = [
  { keyword: 'analytics dashboard', volume: 8900, position: 2, ctr: 12.5, trend: 'up', change: 1 },
  { keyword: 'web analytics', volume: 12400, position: 4, ctr: 8.3, trend: 'up', change: 2 },
  { keyword: 'user tracking', volume: 5600, position: 7, ctr: 6.2, trend: 'down', change: -1 },
  { keyword: 'behavior analytics', volume: 4200, position: 5, ctr: 9.1, trend: 'up', change: 3 },
  { keyword: 'real-time analytics', volume: 3400, position: 9, ctr: 7.8, trend: 'stable', change: 0 },
  { keyword: 'privacy first analytics', volume: 2100, position: 1, ctr: 18.5, trend: 'up', change: 1 },
];

const topPages = [
  { url: '/docs/getting-started', views: 45600, avgTime: '4m 23s', bounceRate: 18, traffic: 'organic' },
  { url: '/pricing', views: 32100, avgTime: '2m 15s', bounceRate: 35, traffic: 'mixed' },
  { url: '/features/real-time', views: 28900, avgTime: '5m 12s', bounceRate: 12, traffic: 'organic' },
  { url: '/blog/analytics-101', views: 24567, avgTime: '6m 45s', bounceRate: 22, traffic: 'organic' },
  { url: '/docs/api', views: 18234, avgTime: '8m 31s', bounceRate: 8, traffic: 'organic' },
];

const backlinks = [
  { domain: 'techcrunch.com', authority: 92, links: 4, traffic: 'high', status: 'active' },
  { domain: 'producthunt.com', authority: 87, links: 2, traffic: 'medium', status: 'active' },
  { domain: 'github.com', authority: 95, links: 8, traffic: 'high', status: 'active' },
  { domain: 'dev.to', authority: 76, links: 12, traffic: 'medium', status: 'active' },
  { domain: 'reddit.com', authority: 81, links: 5, traffic: 'medium', status: 'active' },
];

const competitorSov = [
  { competitor: 'Your Company', sov: 28, keywords: 1234, topKeywords: 156 },
  { competitor: 'Competitor A', sov: 22, keywords: 945, topKeywords: 128 },
  { competitor: 'Competitor B', sov: 18, keywords: 756, topKeywords: 94 },
  { competitor: 'Competitor C', sov: 15, keywords: 634, topKeywords: 76 },
  { competitor: 'Others', sov: 17, keywords: 812, topKeywords: 98 },
];

export default function ContentSEO() {
  return (
    <PageBody gap>
      <Row justifyContent="space-between" alignItems="flex-start">
        <Column gap="1">
          <Heading level={1}>SEO & Content Performance</Heading>
          <Text color="muted">Track organic traffic, keyword rankings, backlinks, and competitive positioning</Text>
        </Column>
      </Row>

      {/* Key Metrics */}
      <Grid columns={{ xs: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }} gap="2">
        {[
          { label: 'Organic Traffic', value: '8,123', subtext: '+18.5% vs last month' },
          { label: 'Keywords Ranking', value: '1,234', subtext: '+156 new keywords' },
          { label: 'Top 3 Rankings', value: '156', subtext: '+23 this month' },
          { label: 'Avg Position', value: '4.2', subtext: 'Improved 0.3' },
        ].map((metric, idx) => (
          <Box
            key={metric.label}
            padding="3"
            borderRadius="2"
            style={{
              border: `1px solid var(--color-border)`,
              borderLeft: `3px solid ${CHART_COLORS[idx]}`,
              background: 'var(--color-background-secondary)',
            }}
          >
            <Column gap="1">
              <Text size="sm" color="muted">
                {metric.label}
              </Text>
              <Heading level={2} style={{ margin: '8px 0' }}>
                {metric.value}
              </Heading>
              <Text size="xs" color="muted">
                {metric.subtext}
              </Text>
            </Column>
          </Box>
        ))}
      </Grid>

      {/* Organic Traffic Trend */}
      <Panel title="Organic Traffic Trend">
        <Box height="300px">
          <Chart type="line" chartData={organicTrafficChart} height="100%" />
        </Box>
      </Panel>

      {/* Two Column - Keywords + Rankings */}
      <Grid columns={{ xs: '1fr', lg: '1fr 1fr' }} gap="3">
        <Panel title="Keyword Rankings by Position">
          <Box height="300px">
            <Chart type="bar" chartData={rankingChart} height="100%" />
          </Box>
        </Panel>

        <Panel title="Top Performing Keywords">
          <LoadingPanel data={topKeywords} isLoading={false} error={null}>
            <Column gap="2">
              {topKeywords.map((kw, idx) => (
                <Box
                  key={kw.keyword}
                  padding="3"
                  borderRadius="2"
                  style={{ background: 'var(--color-background)' }}
                >
                  <Row justifyContent="space-between" alignItems="start" margin="0 0 12px 0">
                    <Column gap="1" style={{ flex: 1 }}>
                      <Row gap="2" alignItems="center">
                        <Text weight={500}>{kw.keyword}</Text>
                        <Text
                          size="xs"
                          style={{
                            color:
                              kw.trend === 'up'
                                ? '#44b556'
                                : kw.trend === 'down'
                                  ? '#e34850'
                                  : 'var(--color-text-secondary)',
                          }}
                        >
                          {kw.trend === 'up' ? 'Trending up' : kw.trend === 'down' ? 'Trending down' : 'Stable'}
                        </Text>
                      </Row>
                      <Text size="xs" color="muted">
                        Volume: {kw.volume.toLocaleString()} • Search traffic
                      </Text>
                    </Column>
                    <Column gap="1" style={{ textAlign: 'right' }}>
                      <Text weight={500} size="sm">
                        Position #{kw.position}
                      </Text>
                      <Text size="xs" color="muted">
                        CTR: {kw.ctr}%
                      </Text>
                    </Column>
                  </Row>
                </Box>
              ))}
            </Column>
          </LoadingPanel>
        </Panel>
      </Grid>

      {/* Top Content */}
      <Panel title="Top Performing Content">
        <LoadingPanel data={topPages} isLoading={false} error={null}>
          <Column gap="2">
            {topPages.map((page, idx) => (
              <Box
                key={page.url}
                padding="3"
                borderRadius="2"
                style={{ background: 'var(--color-background)' }}
              >
                <Row justifyContent="space-between" alignItems="start" margin="0 0 12px 0">
                  <Column gap="1" style={{ flex: 1 }}>
                    <Row gap="2" alignItems="center">
                      <Text weight={500} size="sm">
                        {page.url}
                      </Text>
                      <Badge size="sm" color={page.traffic === 'organic' ? 'success' : 'default'}>
                        {page.traffic}
                      </Badge>
                    </Row>
                    <Text size="xs" color="muted">
                      {page.views.toLocaleString()} views • {page.avgTime} avg time
                    </Text>
                  </Column>
                </Row>

                <Grid columns="repeat(2, 1fr)" gap="2">
                  <Column gap="1">
                    <Text size="xs" color="muted">
                      Bounce Rate
                    </Text>
                    <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Box
                        height="4px"
                        backgroundColor="1"
                        borderRadius="full"
                        overflow="hidden"
                        style={{ flex: 1 }}
                      >
                        <Box
                          height="100%"
                          backgroundColor={page.bounceRate > 30 ? '#e34850' : '#FFA500'}
                          width={`${page.bounceRate}%`}
                        />
                      </Box>
                      <Text weight={500} size="sm">
                        {page.bounceRate}%
                      </Text>
                    </Box>
                  </Column>
                  <Column gap="1">
                    <Text size="xs" color="muted">
                      Organic Share
                    </Text>
                    <Text weight={500} size="sm">
                      {Math.round(Math.random() * 100)}% of traffic
                    </Text>
                  </Column>
                </Grid>
              </Box>
            ))}
          </Column>
        </LoadingPanel>
      </Panel>

      {/* Backlinks & Competition */}
      <Grid columns={{ xs: '1fr', lg: '1fr 1fr' }} gap="3">
        <Panel title="Top Referral Domains">
          <LoadingPanel data={backlinks} isLoading={false} error={null}>
            <Column gap="2">
              {backlinks.map((backlink) => (
                <Box
                  key={backlink.domain}
                  padding="3"
                  borderRadius="2"
                  style={{ background: 'var(--color-background)' }}
                >
                  <Row justifyContent="space-between" alignItems="start" margin="0 0 8px 0">
                    <Column gap="1">
                      <Text weight={500} size="sm">
                        {backlink.domain}
                      </Text>
                      <Row gap="2" alignItems="center">
                        <Badge size="sm">DA {backlink.authority}</Badge>
                        <Text size="xs" color="muted">
                          {backlink.links} links
                        </Text>
                      </Row>
                    </Column>
                  </Row>
                  <Text size="xs" color="muted">
                    Referral traffic: {backlink.traffic}
                  </Text>
                </Box>
              ))}
            </Column>
          </LoadingPanel>
        </Panel>

        <Panel title="Search Share of Voice">
          <Column gap="3">
            {competitorSov.map((comp, idx) => (
              <Column key={comp.competitor} gap="1">
                <Row justifyContent="space-between">
                  <Text size="sm" weight={comp.competitor === 'Your Company' ? 600 : 400}>
                    {comp.competitor}
                  </Text>
                  <Text weight={500}>{comp.sov}%</Text>
                </Row>
                <Box height="6px" backgroundColor="1" borderRadius="full" overflow="hidden">
                  <Box
                    height="100%"
                    backgroundColor={idx === 0 ? CHART_COLORS[0] : CHART_COLORS[idx % CHART_COLORS.length]}
                    width={`${comp.sov}%`}
                  />
                </Box>
                <Text size="xs" color="muted">
                  {comp.keywords} keywords • {comp.topKeywords} in top 3
                </Text>
              </Column>
            ))}
          </Column>
        </Panel>
      </Grid>
    </PageBody>
  );
}
