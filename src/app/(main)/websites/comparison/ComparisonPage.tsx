'use client';

import { Button, Column, Grid, Heading, Icon, ListItem, Row, Select, Text } from '@umami/react-zen';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { useDateRange, useLoginQuery, useMessages, useNavigation } from '@/components/hooks';
import { useUserWebsitesQuery } from '@/components/hooks/queries/useUserWebsitesQuery';
import { WebsiteDateFilter } from '@/components/input/WebsiteDateFilter';
import { BarChart3, RefreshCw } from '@/components/icons';
import { ComparisonChart } from './ComparisonChart';
import { ComparisonMetricsBar } from './ComparisonMetricsBar';
import { ComparisonMetricsTables } from './ComparisonMetricsTables';
import { ComparisonSummaryCards } from './ComparisonSummaryCards';
import { WebsiteMultiSelect } from './WebsiteMultiSelect';

interface SelectedWebsite {
  id: string;
  name: string;
  domain: string;
}

type ChartMetric = 'pageviews' | 'sessions';

export function ComparisonPage() {
  const { formatMessage, labels } = useMessages();
  const { teamId } = useNavigation();
  const { user } = useLoginQuery();
  const [selectedWebsites, setSelectedWebsites] = useState<SelectedWebsite[]>([]);
  const [chartMetric, setChartMetric] = useState<ChartMetric>('pageviews');
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch all user websites to auto-select first 2
  const { data: websitesData } = useUserWebsitesQuery(
    { userId: user?.id, teamId },
    { pageSize: 10 },
  );

  // BUG 4: Missing dependency in useEffect causes stale initial selection
  // The effect depends on websitesData but also uses selectedWebsites
  // to guard against re-initialization. However since selectedWebsites
  // is not in the dep array, if websitesData changes after initial load
  // (e.g. cache invalidation), it will overwrite user selections
  useEffect(() => {
    if (websitesData?.data && websitesData.data.length >= 2 && !isInitialized) {
      const initialWebsites = websitesData.data.slice(0, 2).map((w: any) => ({
        id: w.id,
        name: w.name,
        domain: w.domain,
      }));
      setSelectedWebsites(initialWebsites);
      setIsInitialized(true);
    }
  }, [websitesData]);

  const websiteIds = useMemo(
    () => selectedWebsites.map(w => w.id),
    [selectedWebsites],
  );

  const websiteInfos = useMemo(
    () =>
      selectedWebsites.map(w => ({
        id: w.id,
        name: w.name,
        domain: w.domain,
      })),
    [selectedWebsites],
  );

  const chartWebsites = useMemo(
    () => selectedWebsites.map(w => ({ id: w.id, name: w.name })),
    [selectedWebsites],
  );

  const handleAddWebsite = useCallback((website: SelectedWebsite) => {
    setSelectedWebsites(prev => {
      if (prev.some(w => w.id === website.id)) return prev;
      if (prev.length >= 4) return prev;
      return [...prev, website];
    });
  }, []);

  const handleRemoveWebsite = useCallback((websiteId: string) => {
    setSelectedWebsites(prev => prev.filter(w => w.id !== websiteId));
  }, []);

  const handleChartMetricChange = useCallback((value: any) => {
    setChartMetric(value as ChartMetric);
  }, []);

  const hasWebsites = selectedWebsites.length >= 2;

  return (
    <PageBody>
      <Column gap="6" padding="4">
        <PageHeader title="Website Comparison" icon={<BarChart3 />}>
          <Row alignItems="center" gap="3">
            <Select
              items={[
                { id: 'pageviews', label: formatMessage(labels.views) },
                { id: 'sessions', label: formatMessage(labels.sessions) },
              ]}
              value={chartMetric}
              onChange={handleChartMetricChange}
              label={formatMessage(labels.chart)}
            >
              {[
                { id: 'pageviews', label: formatMessage(labels.views) },
                { id: 'sessions', label: formatMessage(labels.sessions) },
              ].map(({ id, label }) => (
                <ListItem key={id} id={id}>
                  {label}
                </ListItem>
              ))}
            </Select>
          </Row>
        </PageHeader>

        {/* Website Selector */}
        <Panel>
          <Column gap="3">
            <Text size="1" weight="bold" style={{ color: 'var(--font-color-muted)' }}>
              {formatMessage(labels.selectWebsite).toUpperCase()}
            </Text>
            <WebsiteMultiSelect
              selectedWebsites={selectedWebsites}
              onAdd={handleAddWebsite}
              onRemove={handleRemoveWebsite}
              maxSelections={4}
            />
          </Column>
        </Panel>

        {!hasWebsites && (
          <Panel>
            <Column alignItems="center" justifyContent="center" padding="10" gap="3">
              <Icon size="xl" style={{ color: 'var(--font-color-muted)' }}>
                <BarChart3 />
              </Icon>
              <Heading size="3" style={{ color: 'var(--font-color-muted)' }}>
                Select at least 2 websites to compare
              </Heading>
              <Text size="1" style={{ color: 'var(--font-color-muted)' }}>
                Choose websites from the selector above to see their analytics side by side.
              </Text>
            </Column>
          </Panel>
        )}

        {hasWebsites && (
          <>
            {/* Summary Scorecards */}
            <ComparisonSummaryCards websiteIds={websiteIds} />

            {/* Metrics Comparison Table */}
            <Panel title="Metrics Comparison">
              <ComparisonMetricsBar websiteIds={websiteIds} />
            </Panel>

            {/* Chart Comparison */}
            <Panel title="Traffic Over Time" allowFullscreen>
              <ComparisonChart websites={chartWebsites} metric={chartMetric} />
            </Panel>

            {/* Detailed Metrics Tables */}
            <ComparisonMetricsTables websites={websiteInfos} />
          </>
        )}
      </Column>
    </PageBody>
  );
}
