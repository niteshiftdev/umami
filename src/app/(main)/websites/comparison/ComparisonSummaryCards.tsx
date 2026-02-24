import { Column, Grid, Row, Text } from '@umami/react-zen';
import { useSpring } from '@react-spring/web';
import { useMemo } from 'react';
import { AnimatedDiv } from '@/components/common/AnimatedDiv';
import { Favicon } from '@/components/common/Favicon';
import { LoadingPanel } from '@/components/common/LoadingPanel';
import { useMessages } from '@/components/hooks';
import {
  useWebsiteComparisonQuery,
  type WebsiteComparisonData,
} from '@/components/hooks/queries/useWebsiteComparisonQuery';
import { ChangeLabel } from '@/components/metrics/ChangeLabel';
import { formatLongNumber } from '@/lib/format';

interface WebsiteScorecard {
  websiteId: string;
  websiteName: string;
  websiteDomain: string;
  totalVisitors: number;
  totalPageviews: number;
  bounceRate: number;
  avgDuration: number;
  rank: number;
  score: number;
}

function calculateScore(stats: any): number {
  if (!stats) return 0;

  const visitors = stats.visitors || 0;
  const pageviews = stats.pageviews || 0;
  const visits = stats.visits || 0;
  const bounces = stats.bounces || 0;
  const totaltime = stats.totaltime || 0;

  const bounceRate = visits > 0 ? bounces / visits : 1;
  const avgDuration = visits > 0 ? totaltime / visits : 0;
  const pagesPerVisit = visits > 0 ? pageviews / visits : 0;

  // Weighted score: more visitors + lower bounce rate + more pages + longer sessions
  return (
    visitors * 1.0 +
    pagesPerVisit * 100 +
    (1 - bounceRate) * 500 +
    Math.min(avgDuration, 300) * 0.5
  );
}

function buildScorecards(data: WebsiteComparisonData[]): WebsiteScorecard[] {
  const cards = data
    .filter(d => d.stats)
    .map(d => {
      const stats = d.stats!;
      const visits = stats.visits || 0;

      return {
        websiteId: d.websiteId,
        websiteName: d.websiteName,
        websiteDomain: d.websiteDomain,
        totalVisitors: stats.visitors || 0,
        totalPageviews: stats.pageviews || 0,
        bounceRate: visits > 0 ? (Math.min(visits, stats.bounces) / visits) * 100 : 0,
        avgDuration: visits > 0 ? stats.totaltime / visits : 0,
        rank: 0,
        score: calculateScore(stats),
      };
    });

  // Sort by score descending and assign ranks
  cards.sort((a, b) => b.score - a.score);
  cards.forEach((card, i) => {
    card.rank = i + 1;
  });

  return cards;
}

function ScorecardItem({
  card,
  isLeader,
}: {
  card: WebsiteScorecard;
  isLeader: boolean;
}) {
  const { formatMessage, labels } = useMessages();
  const visitorsSpring = useSpring({ x: card.totalVisitors, from: { x: 0 } });
  const pageviewsSpring = useSpring({ x: card.totalPageviews, from: { x: 0 } });
  const bounceSpring = useSpring({ x: card.bounceRate, from: { x: 0 } });

  const rankColors = ['var(--success-color)', 'var(--primary-color)', 'var(--warning-color)'];
  const rankColor = rankColors[card.rank - 1] || 'var(--font-color-muted)';

  return (
    <Column
      padding="5"
      border
      borderRadius="3"
      backgroundColor
      gap="4"
      style={{
        ...(isLeader
          ? {
              borderColor: 'var(--success-color)',
              boxShadow: '0 0 0 1px var(--success-color)',
            }
          : {}),
      }}
    >
      {/* Header */}
      <Row alignItems="center" justifyContent="space-between">
        <Row gap="2" alignItems="center">
          <Favicon domain={card.websiteDomain} />
          <Text size="2" weight="bold" truncate style={{ maxWidth: '160px' }}>
            {card.websiteName}
          </Text>
        </Row>
        <Row
          alignItems="center"
          justifyContent="center"
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: rankColor,
            color: 'white',
          }}
        >
          <Text size="1" weight="bold">
            #{card.rank}
          </Text>
        </Row>
      </Row>

      {/* Metrics */}
      <Grid columns="1fr 1fr" gap="3">
        <Column gap="1">
          <Text size="0" weight="medium" style={{ color: 'var(--font-color-muted)' }}>
            {formatMessage(labels.visitors)}
          </Text>
          <Text size="4" weight="bold">
            <AnimatedDiv>
              {visitorsSpring.x.to(x => formatLongNumber(x))}
            </AnimatedDiv>
          </Text>
        </Column>

        <Column gap="1">
          <Text size="0" weight="medium" style={{ color: 'var(--font-color-muted)' }}>
            {formatMessage(labels.views)}
          </Text>
          <Text size="4" weight="bold">
            <AnimatedDiv>
              {pageviewsSpring.x.to(x => formatLongNumber(x))}
            </AnimatedDiv>
          </Text>
        </Column>

        <Column gap="1">
          <Text size="0" weight="medium" style={{ color: 'var(--font-color-muted)' }}>
            {formatMessage(labels.bounceRate)}
          </Text>
          <Text size="4" weight="bold">
            <AnimatedDiv>
              {bounceSpring.x.to(x => `${Math.round(x)}%`)}
            </AnimatedDiv>
          </Text>
        </Column>

        <Column gap="1">
          <Text size="0" weight="medium" style={{ color: 'var(--font-color-muted)' }}>
            {formatMessage(labels.visitDuration)}
          </Text>
          <Text size="4" weight="bold">
            {Math.round(card.avgDuration)}s
          </Text>
        </Column>
      </Grid>
    </Column>
  );
}

export function ComparisonSummaryCards({ websiteIds }: { websiteIds: string[] }) {
  const { data, isLoading, isFetching, error } = useWebsiteComparisonQuery(websiteIds);
  const { getErrorMessage } = useMessages();

  const scorecards = useMemo(() => {
    if (!data) return [];
    return buildScorecards(data);
  }, [data]);

  return (
    <LoadingPanel
      data={scorecards.length > 0 ? scorecards : undefined}
      isLoading={isLoading}
      isFetching={isFetching}
      error={getErrorMessage(error)}
      minHeight="180px"
    >
      <Grid columns={{ xs: '1fr', md: `repeat(${Math.min(scorecards.length, 4)}, 1fr)` }} gap="4">
        {scorecards.map(card => (
          <ScorecardItem
            key={card.websiteId}
            card={card}
            isLeader={card.rank === 1}
          />
        ))}
      </Grid>
    </LoadingPanel>
  );
}
