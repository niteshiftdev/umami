import { Row, Column, Text, Heading, Grid } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { useRealtimeQuery } from '@/components/hooks';
import { Activity } from '@/components/icons';
import { CSSProperties } from 'react';

export function OverviewAltRealtimePreview({
  websiteId,
  panelStyle,
}: {
  websiteId: string;
  panelStyle?: CSSProperties;
}) {
  const { data, isLoading } = useRealtimeQuery(websiteId);

  if (isLoading || !data) {
    return null;
  }

  const pageviews = data.pageviews || [];
  const totalVisitors = pageviews.length;
  const uniquePages = new Set(pageviews.map((p: any) => p.x)).size;
  const topCountries = Object.entries(data.countries || {})
    .sort(([, a]: any, [, b]: any) => b - a)
    .slice(0, 3);

  return (
    <Panel style={panelStyle}>
      <Row gap="4" alignItems="center" justifyContent="space-between" wrap="wrap">
        <Row gap="2" alignItems="center">
          <Activity width={20} height={20} />
          <Column gap="1">
            <Text size="1" color="gray" weight="500">
              LIVE NOW
            </Text>
            <Row gap="2" alignItems="baseline">
              <Heading size="4">{totalVisitors}</Heading>
              <Text size="2" color="gray">
                active visitors
              </Text>
            </Row>
          </Column>
        </Row>

        <Grid columns="repeat(2, auto)" gap="6">
          <Column gap="1">
            <Text size="1" color="gray" weight="500">
              PAGES VIEWED
            </Text>
            <Heading size="3">{uniquePages}</Heading>
          </Column>
          {topCountries.length > 0 && (
            <Column gap="1">
              <Text size="1" color="gray" weight="500">
                TOP LOCATION
              </Text>
              <Row gap="2" alignItems="baseline">
                <Heading size="3">{topCountries[0][0]}</Heading>
                <Text size="2" color="gray">
                  {topCountries[0][1]}
                </Text>
              </Row>
            </Column>
          )}
        </Grid>
      </Row>
    </Panel>
  );
}
