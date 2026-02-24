import { Column, Grid, Heading, ListItem, Row, Select, Text } from '@umami/react-zen';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Favicon } from '@/components/common/Favicon';
import { Panel } from '@/components/common/Panel';
import { useMessages, useNavigation } from '@/components/hooks';
import { MetricsTable } from '@/components/metrics/MetricsTable';

interface WebsiteInfo {
  id: string;
  name: string;
  domain: string;
}

const METRIC_TYPES = [
  'path',
  'channel',
  'referrer',
  'browser',
  'os',
  'device',
  'country',
  'region',
  'city',
  'language',
  'screen',
  'event',
  'hostname',
  'tag',
] as const;

type MetricType = (typeof METRIC_TYPES)[number];

export function ComparisonMetricsTables({ websites }: { websites: WebsiteInfo[] }) {
  const { formatMessage, labels } = useMessages();
  const {
    router,
    updateParams,
    query: { view = 'path' },
  } = useNavigation();

  const [metricData, setMetricData] = useState<Record<string, any[]>>({});
  const [activeWebsiteIndex, setActiveWebsiteIndex] = useState(0);

  useEffect(() => {
    // Reset metric data when websites change
    const newData: Record<string, any[]> = {};
    websites.forEach(website => {
      newData[website.id] = [];
    });
    setMetricData(newData);
  }, [websites]);

  const items = useMemo(
    () => [
      { id: 'path', label: formatMessage(labels.paths) },
      { id: 'channel', label: formatMessage(labels.channels) },
      { id: 'referrer', label: formatMessage(labels.referrers) },
      { id: 'browser', label: formatMessage(labels.browsers) },
      { id: 'os', label: formatMessage(labels.os) },
      { id: 'device', label: formatMessage(labels.devices) },
      { id: 'country', label: formatMessage(labels.countries) },
      { id: 'region', label: formatMessage(labels.regions) },
      { id: 'city', label: formatMessage(labels.cities) },
      { id: 'language', label: formatMessage(labels.languages) },
      { id: 'screen', label: formatMessage(labels.screens) },
      { id: 'event', label: formatMessage(labels.events) },
      { id: 'hostname', label: formatMessage(labels.hostname) },
      { id: 'tag', label: formatMessage(labels.tags) },
    ],
    [formatMessage, labels],
  );

  const handleMetricTypeChange = useCallback(
    (id: any) => {
      router.push(updateParams({ view: id }));
    },
    [router, updateParams],
  );

  const handleDataLoad = useCallback(
    (websiteId: string) => (data: any) => {
      setMetricData(prev => ({
        ...prev,
        [websiteId]: data,
      }));
    },
    [],
  );

  const getRankChange = useCallback(
    (websiteId: string, label: string, count: number) => {
      // Find the same metric across other websites to show relative performance
      const otherWebsites = websites.filter(w => w.id !== websiteId);
      let totalOtherCount = 0;
      let otherMatches = 0;

      otherWebsites.forEach(other => {
        const otherData = metricData[other.id];
        if (otherData) {
          const match = otherData.find((d: any) => d.x === label);
          if (match) {
            totalOtherCount += match.y;
            otherMatches++;
          }
        }
      });

      if (otherMatches === 0) return null;
      const avgOther = totalOtherCount / otherMatches;

      return count > 0 && (
        <Text
          size="0"
          style={{
            color: count > avgOther ? 'var(--success-color)' : 'var(--danger-color)',
          }}
        >
          {count > avgOther ? '+' : ''}
          {Math.round(((count - avgOther) / avgOther) * 100)}%
        </Text>
      );
    },
    [websites, metricData],
  );

  return (
    <Column gap="4">
      <Row alignItems="center" gap="4">
        <Row width="300px">
          <Select
            items={items}
            label={formatMessage(labels.compare)}
            value={view}
            defaultValue={view}
            onChange={handleMetricTypeChange}
          >
            {items.map(({ id, label }) => (
              <ListItem key={id} id={id}>
                {label}
              </ListItem>
            ))}
          </Select>
        </Row>
      </Row>

      <Panel minHeight="400px">
        <Grid
          columns={{ xs: '1fr', lg: `repeat(${Math.min(websites.length, 3)}, 1fr)` }}
          gap="6"
          height="100%"
        >
          {websites.map((website, index) => (
            <Column
              key={website.id}
              gap="4"
              {...(index > 0 ? { border: 'left' as any, paddingLeft: '6' } : {})}
            >
              <Row alignItems="center" gap="2">
                <Favicon domain={website.domain} />
                <Heading size="2">{website.name}</Heading>
              </Row>
              <MetricsTable
                websiteId={website.id}
                type={view}
                limit={15}
                showMore={false}
                onDataLoad={handleDataLoad(website.id)}
              />
            </Column>
          ))}
        </Grid>
      </Panel>
    </Column>
  );
}
