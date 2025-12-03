'use client';

import { Column, Row, Text, Heading, Box } from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { ChangeLabel } from '@/components/metrics/ChangeLabel';
import styles from './timeline.module.css';

// Sample data for 7-day sparkline data
const generateSparklineData = (baseValue: number, volatility: number) => {
  const data = [];
  let current = baseValue;
  for (let i = 0; i < 7; i++) {
    const change = (Math.random() - 0.5) * volatility;
    current = Math.max(0, current + change);
    data.push(Math.round(current));
  }
  return data;
};

// Mock timeline metrics data
const timelineMetrics = [
  {
    id: 'pageviews',
    label: 'Page Views',
    current: 24856,
    previous: 21324,
    trend: 16.5,
    sparkline: generateSparklineData(24856, 2500),
    color: 'rgb(20, 122, 243)',
  },
  {
    id: 'visitors',
    label: 'Unique Visitors',
    current: 8934,
    previous: 9234,
    trend: -3.2,
    sparkline: generateSparklineData(8934, 800),
    color: 'rgb(48, 164, 108)',
  },
  {
    id: 'sessions',
    label: 'Sessions',
    current: 12567,
    previous: 11845,
    trend: 6.1,
    sparkline: generateSparklineData(12567, 1200),
    color: 'rgb(20, 122, 243)',
  },
  {
    id: 'bounce_rate',
    label: 'Bounce Rate',
    current: 42.3,
    previous: 45.8,
    trend: -7.6,
    sparkline: [45.8, 44.2, 43.5, 42.9, 42.6, 42.4, 42.3],
    color: 'rgb(48, 164, 108)',
    reverseColors: true,
  },
  {
    id: 'avg_duration',
    label: 'Avg. Session Duration',
    current: 185,
    previous: 162,
    trend: 14.2,
    sparkline: generateSparklineData(185, 25),
    unit: 's',
    color: 'rgb(20, 122, 243)',
  },
  {
    id: 'conversion_rate',
    label: 'Conversion Rate',
    current: 3.24,
    previous: 2.89,
    trend: 12.1,
    sparkline: [2.89, 2.95, 3.01, 3.08, 3.14, 3.19, 3.24],
    unit: '%',
    color: 'rgb(48, 164, 108)',
  },
];

// Simple sparkline chart component
interface SparklineProps {
  data: number[];
  color: string;
  height?: number;
  width?: number;
}

function Sparkline({ data, color, height = 40, width = 120 }: SparklineProps) {
  if (!data || data.length === 0) return null;

  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  const range = maxValue - minValue || 1;
  const pointSpacing = width / (data.length - 1);

  // Generate SVG points for the sparkline
  const points = data
    .map((value, index) => {
      const x = index * pointSpacing;
      const normalizedValue = (value - minValue) / range;
      const y = height - normalizedValue * (height * 0.8) - height * 0.1;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: 'inline-block' }}
      className={styles.sparkline}
    >
      {/* Background area fill */}
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Area under the line */}
      <polygon
        points={`0,${height} ${points} ${width},${height}`}
        fill={`url(#gradient-${color})`}
      />

      {/* Line chart */}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Data point dots */}
      {data.map((value, index) => {
        const x = index * pointSpacing;
        const normalizedValue = (value - minValue) / range;
        const y = height - normalizedValue * (height * 0.8) - height * 0.1;
        return (
          <circle
            key={index}
            cx={x}
            cy={y}
            r="2"
            fill={color}
            opacity={index === data.length - 1 ? 1 : 0.4}
          />
        );
      })}
    </svg>
  );
}

// Timeline row component
interface TimelineRowProps {
  metric: (typeof timelineMetrics)[0];
}

function TimelineRow({ metric }: TimelineRowProps) {
  const percentChange = ((metric.current - metric.previous) / metric.previous) * 100;

  return (
    <Row
      className={styles.timelineRow}
      alignItems="center"
      justifyContent="space-between"
      padding="4"
      paddingX="6"
      borderBottom
      style={{
        borderColor: 'var(--base-color-4)',
        transition: 'background-color 0.2s ease',
      }}
    >
      {/* Metric Label - Left side */}
      <Column gap="1" flex={{ basis: '200px' }}>
        <Text
          style={{
            fontSize: 'var(--font-size-3)',
            fontWeight: 500,
            color: 'var(--base-color-12)',
          }}
        >
          {metric.label}
        </Text>
      </Column>

      {/* Current Value - Center-Left */}
      <Column
        gap="1"
        flex={{ basis: '140px' }}
        alignItems="flex-end"
        style={{ paddingRight: 'var(--spacing-4)' }}
      >
        <Text
          style={{
            fontSize: 'var(--font-size-4)',
            fontWeight: 600,
            color: 'var(--base-color-12)',
          }}
        >
          {metric.unit ? `${metric.current}${metric.unit}` : metric.current.toLocaleString()}
        </Text>
        <Text
          style={{
            fontSize: 'var(--font-size-1)',
            color: 'var(--font-color-muted)',
          }}
        >
          vs {metric.previous.toLocaleString()}
        </Text>
      </Column>

      {/* Trend Indicator - Center-Right */}
      <Column flex={{ basis: '100px' }} alignItems="flex-end">
        <ChangeLabel
          value={percentChange}
          reverseColors={metric.reverseColors}
          style={{ paddingX: 'var(--spacing-2)', paddingY: 'var(--spacing-1)' }}
        >
          {Math.abs(percentChange).toFixed(1)}%
        </ChangeLabel>
      </Column>

      {/* Sparkline Chart - Right side */}
      <Box
        flex={{ basis: '150px' }}
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          paddingLeft: 'var(--spacing-4)',
        }}
      >
        <Sparkline data={metric.sparkline} color={metric.color} width={120} height={40} />
      </Box>
    </Row>
  );
}

export default function TimelineSparklesPage() {
  return (
    <PageBody>
      <Column gap="6">
        {/* Page Header */}
        <PageHeader
          title="Timeline with Sparklines"
          description="Compact metrics monitoring with 7-day trend visualization"
        />

        {/* Timeline Container */}
        <Panel
          title="Analytics Metrics"
          style={{
            backgroundColor: 'var(--base-color-1)',
            borderColor: 'var(--base-color-4)',
            boxShadow: 'var(--box-shadow-1)',
          }}
        >
          <Column gap="0">
            {/* Header row */}
            <Row
              alignItems="center"
              justifyContent="space-between"
              padding="4"
              paddingX="6"
              borderBottom
              style={{
                backgroundColor: 'var(--base-color-2)',
                borderColor: 'var(--base-color-4)',
                fontWeight: 600,
                fontSize: 'var(--font-size-2)',
                color: 'var(--font-color-muted)',
              }}
            >
              <Column flex={{ basis: '200px' }}>
                <Text style={{ fontSize: 'var(--font-size-2)', fontWeight: 600 }}>
                  Metric
                </Text>
              </Column>
              <Column
                flex={{ basis: '140px' }}
                alignItems="flex-end"
                style={{ paddingRight: 'var(--spacing-4)' }}
              >
                <Text style={{ fontSize: 'var(--font-size-2)', fontWeight: 600 }}>
                  Current
                </Text>
              </Column>
              <Column flex={{ basis: '100px' }} alignItems="flex-end">
                <Text style={{ fontSize: 'var(--font-size-2)', fontWeight: 600 }}>
                  Change
                </Text>
              </Column>
              <Box
                flex={{ basis: '150px' }}
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  paddingLeft: 'var(--spacing-4)',
                }}
              >
                <Text style={{ fontSize: 'var(--font-size-2)', fontWeight: 600 }}>
                  7-Day Trend
                </Text>
              </Box>
            </Row>

            {/* Timeline rows with animation stagger */}
            {timelineMetrics.map((metric, index) => (
              <div
                key={metric.id}
                style={{
                  animation: `slideInUp 0.5s ease-out ${index * 0.05}s both`,
                }}
              >
                <TimelineRow metric={metric} />
              </div>
            ))}
          </Column>
        </Panel>

        {/* Additional info */}
        <Row
          justifyContent="center"
          padding="4"
          style={{
            fontSize: 'var(--font-size-2)',
            color: 'var(--font-color-muted)',
          }}
        >
          <Text>Data represents the last 7 days • Last updated: Today 2:45 PM</Text>
        </Row>
      </Column>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </PageBody>
  );
}
