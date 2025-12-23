'use client';
import { useState, useMemo } from 'react';
import {
  Column,
  Row,
  Grid,
  Text,
  Heading,
  Button,
  useTheme,
} from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { MetricCard } from '@/components/metrics/MetricCard';
import { BarChart } from '@/components/charts/BarChart';
import { useMessages } from '@/components/hooks';
import { formatNumber } from '@/lib/format';
import { getThemeColors } from '@/lib/colors';
import { generateTimeSeries } from '@/lib/date';

// Sample data for the prototype
const SAMPLE_METRICS = {
  visitors: 12847,
  visits: 18293,
  views: 42156,
  bounceRate: 42,
  duration: 204, // 3m 24s in seconds
  countries: 48,
};

const SAMPLE_CHART_DATA = {
  pageviews: [
    { x: '2025-12-16', y: 3245 },
    { x: '2025-12-17', y: 3892 },
    { x: '2025-12-18', y: 4156 },
    { x: '2025-12-19', y: 3678 },
    { x: '2025-12-20', y: 4523 },
    { x: '2025-12-21', y: 3234 },
    { x: '2025-12-22', y: 2987 },
  ],
  sessions: [
    { x: '2025-12-16', y: 2134 },
    { x: '2025-12-17', y: 2567 },
    { x: '2025-12-18', y: 2843 },
    { x: '2025-12-19', y: 2456 },
    { x: '2025-12-20', y: 3012 },
    { x: '2025-12-21', y: 2189 },
    { x: '2025-12-22', y: 1987 },
  ],
};

const SAMPLE_PAGES_DATA = [
  { label: '/home', count: 8234, percent: 19.5 },
  { label: '/products', count: 6543, percent: 15.5 },
  { label: '/about', count: 5432, percent: 12.9 },
  { label: '/contact', count: 4321, percent: 10.2 },
  { label: '/blog', count: 3876, percent: 9.2 },
  { label: '/pricing', count: 3234, percent: 7.7 },
  { label: '/features', count: 2987, percent: 7.1 },
  { label: '/docs', count: 2456, percent: 5.8 },
];

const SAMPLE_SOURCES_DATA = [
  { label: 'Google', count: 15234, percent: 36.1 },
  { label: 'Direct', count: 12456, percent: 29.5 },
  { label: 'Twitter', count: 6789, percent: 16.1 },
  { label: 'LinkedIn', count: 4321, percent: 10.2 },
  { label: 'Facebook', count: 2345, percent: 5.6 },
  { label: 'Reddit', count: 1011, percent: 2.4 },
];

const SAMPLE_ENVIRONMENT_DATA = [
  { label: 'Chrome', count: 18234, percent: 43.2 },
  { label: 'Safari', count: 12456, percent: 29.5 },
  { label: 'Firefox', count: 6789, percent: 16.1 },
  { label: 'Edge', count: 3234, percent: 7.7 },
  { label: 'Other', count: 1443, percent: 3.4 },
];

const SAMPLE_LOCATION_DATA = [
  { label: 'United States', count: 15234, percent: 36.1 },
  { label: 'United Kingdom', count: 8456, percent: 20.0 },
  { label: 'Germany', count: 6789, percent: 16.1 },
  { label: 'France', count: 4321, percent: 10.2 },
  { label: 'Canada', count: 3234, percent: 7.7 },
  { label: 'Australia', count: 2345, percent: 5.6 },
  { label: 'Japan', count: 1777, percent: 4.2 },
];

type CategoryType = 'pages' | 'sources' | 'environment' | 'location';

const CATEGORY_DATA: Record<CategoryType, any[]> = {
  pages: SAMPLE_PAGES_DATA,
  sources: SAMPLE_SOURCES_DATA,
  environment: SAMPLE_ENVIRONMENT_DATA,
  location: SAMPLE_LOCATION_DATA,
};

const CATEGORY_TITLES: Record<CategoryType, string> = {
  pages: 'Top Pages',
  sources: 'Traffic Sources',
  environment: 'Browsers',
  location: 'Locations',
};

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

export default function FocusModePage() {
  const { formatMessage, labels } = useMessages();
  const { theme } = useTheme();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('pages');

  const chartData = useMemo(() => {
    return {
      __id: new Date().getTime(),
      datasets: [
        {
          type: 'bar',
          label: 'Visitors',
          data: SAMPLE_CHART_DATA.sessions,
          borderWidth: 1,
          barPercentage: 0.9,
          categoryPercentage: 0.9,
          ...colors.chart.visitors,
        },
        {
          type: 'bar',
          label: 'Views',
          data: SAMPLE_CHART_DATA.pageviews,
          barPercentage: 0.9,
          categoryPercentage: 0.9,
          borderWidth: 1,
          ...colors.chart.views,
        },
      ],
    };
  }, [colors]);

  const currentData = CATEGORY_DATA[selectedCategory];

  return (
    <Column gap="8" paddingX={{ xs: '4', md: '8' }} paddingY="8" maxWidth="1400px" margin="0 auto">
      {/* Header */}
      <Column gap="2">
        <Heading size="7" weight="bold">
          Focus Mode Analytics
        </Heading>
        <Text size="3" style={{ color: 'var(--gray11)' }}>
          A simplified, single-column view for focused analysis
        </Text>
      </Column>

      {/* Metrics Grid - Large Cards */}
      <Grid columns={{ xs: '2', md: '3' }} gap="6">
        <MetricCard
          value={SAMPLE_METRICS.visitors}
          label="Visitors"
          formatValue={formatNumber}
          showLabel={true}
          labelSize="2"
          valueSize="9"
          labelWeight="semibold"
          valueWeight="bold"
        />
        <MetricCard
          value={SAMPLE_METRICS.visits}
          label="Visits"
          formatValue={formatNumber}
          showLabel={true}
          labelSize="2"
          valueSize="9"
          labelWeight="semibold"
          valueWeight="bold"
        />
        <MetricCard
          value={SAMPLE_METRICS.views}
          label="Views"
          formatValue={formatNumber}
          showLabel={true}
          labelSize="2"
          valueSize="9"
          labelWeight="semibold"
          valueWeight="bold"
        />
        <MetricCard
          value={SAMPLE_METRICS.bounceRate}
          label="Bounce Rate"
          formatValue={(n: number) => `${Math.round(n)}%`}
          showLabel={true}
          labelSize="2"
          valueSize="9"
          labelWeight="semibold"
          valueWeight="bold"
        />
        <MetricCard
          value={SAMPLE_METRICS.duration}
          label="Avg. Duration"
          formatValue={formatDuration}
          showLabel={true}
          labelSize="2"
          valueSize="9"
          labelWeight="semibold"
          valueWeight="bold"
        />
        <MetricCard
          value={SAMPLE_METRICS.countries}
          label="Countries"
          formatValue={formatNumber}
          showLabel={true}
          labelSize="2"
          valueSize="9"
          labelWeight="semibold"
          valueWeight="bold"
        />
      </Grid>

      {/* Chart Section */}
      <Panel>
        <Column gap="4">
          <Heading size="4" weight="bold">
            Traffic Overview
          </Heading>
          <BarChart
            chartData={chartData}
            unit="day"
            minDate={new Date('2025-12-16')}
            maxDate={new Date('2025-12-22')}
            height="400px"
          />
        </Column>
      </Panel>

      {/* Category Toggle Buttons */}
      <Row gap="4" wrap="wrap" justifyContent="center">
        <Button
          size="lg"
          variant={selectedCategory === 'pages' ? 'primary' : 'secondary'}
          onPress={() => setSelectedCategory('pages')}
          style={{ minWidth: '140px', fontSize: '16px', padding: '12px 24px' }}
        >
          Pages
        </Button>
        <Button
          size="lg"
          variant={selectedCategory === 'sources' ? 'primary' : 'secondary'}
          onPress={() => setSelectedCategory('sources')}
          style={{ minWidth: '140px', fontSize: '16px', padding: '12px 24px' }}
        >
          Sources
        </Button>
        <Button
          size="lg"
          variant={selectedCategory === 'environment' ? 'primary' : 'secondary'}
          onPress={() => setSelectedCategory('environment')}
          style={{ minWidth: '140px', fontSize: '16px', padding: '12px 24px' }}
        >
          Environment
        </Button>
        <Button
          size="lg"
          variant={selectedCategory === 'location' ? 'primary' : 'secondary'}
          onPress={() => setSelectedCategory('location')}
          style={{ minWidth: '140px', fontSize: '16px', padding: '12px 24px' }}
        >
          Location
        </Button>
      </Row>

      {/* Data Category Panel */}
      <Panel>
        <Column gap="6">
          <Heading size="5" weight="bold">
            {CATEGORY_TITLES[selectedCategory]}
          </Heading>

          {/* Data Table */}
          <Column gap="2">
            {currentData.map((item, index) => (
              <Row
                key={index}
                justifyContent="space-between"
                alignItems="center"
                paddingY="4"
                paddingX="4"
                borderRadius="2"
                style={{
                  backgroundColor: index % 2 === 0 ? 'var(--gray2)' : 'transparent',
                  transition: 'background-color 0.2s',
                }}
              >
                <Column gap="1" flex="1">
                  <Text size="3" weight="semibold">
                    {item.label}
                  </Text>
                  <Text size="2" style={{ color: 'var(--gray11)' }}>
                    {item.percent.toFixed(1)}% of total
                  </Text>
                </Column>
                <Text size="4" weight="bold" style={{ minWidth: '100px', textAlign: 'right' }}>
                  {formatNumber(item.count)}
                </Text>
              </Row>
            ))}
          </Column>
        </Column>
      </Panel>

      {/* Footer Spacing */}
      <div style={{ height: '40px' }} />
    </Column>
  );
}
