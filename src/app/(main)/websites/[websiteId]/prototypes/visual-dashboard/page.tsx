'use client';

import { useMemo } from 'react';
import { Column, Row, Grid, Heading, Text, Box } from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { Panel } from '@/components/common/Panel';
import { PieChart } from '@/components/charts/PieChart';
import { BarChart } from '@/components/charts/BarChart';

// Chart color palette from design system
const CHART_COLORS = ['#2680eb', '#9256d9', '#44b556', '#e68619', '#e34850', '#f7bd12', '#01bad7'];

// Generate realistic pageview data for the last 14 days
function generatePageviewData() {
  const labels: string[] = [];
  const data: { x: string; y: number }[] = [];
  const baseDate = new Date('2024-11-20');

  const dailyValues = [
    3245, 2987, 3521, 3876, 4012, 3654, 2134,
    3456, 3789, 4123, 4567, 3890, 3234, 2876
  ];

  for (let i = 0; i < 14; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    labels.push(dateStr);
    data.push({ x: dateStr, y: dailyValues[i] });
  }

  return {
    labels,
    datasets: [
      {
        label: 'Pageviews',
        data,
        backgroundColor: '#2680eb',
        borderRadius: 4,
      },
    ],
  };
}

// Metrics data as badges
const metricsData = [
  { label: 'Visitors', value: '12,847', change: '+12.4%', positive: true },
  { label: 'Visits', value: '18,234', change: '+8.7%', positive: true },
  { label: 'Pageviews', value: '45,621', change: '+15.2%', positive: true },
  { label: 'Bounce Rate', value: '42.3%', change: '-3.1%', positive: true },
  { label: 'Avg Duration', value: '3m 24s', change: '+0.8%', positive: true },
];

// Browser distribution data
const browserData = {
  labels: ['Chrome', 'Safari', 'Firefox', 'Edge', 'Other'],
  datasets: [
    {
      data: [65, 18, 10, 5, 2],
      backgroundColor: [CHART_COLORS[0], CHART_COLORS[1], CHART_COLORS[2], CHART_COLORS[3], CHART_COLORS[4]],
      borderWidth: 0,
    },
  ],
};

// Device distribution data
const deviceData = {
  labels: ['Desktop', 'Mobile', 'Tablet'],
  datasets: [
    {
      data: [72, 24, 4],
      backgroundColor: [CHART_COLORS[0], CHART_COLORS[2], CHART_COLORS[5]],
      borderWidth: 0,
    },
  ],
};

// OS distribution data
const osData = {
  labels: ['Windows', 'macOS', 'iOS', 'Android', 'Linux'],
  datasets: [
    {
      data: [42, 28, 15, 10, 5],
      backgroundColor: [CHART_COLORS[0], CHART_COLORS[1], CHART_COLORS[2], CHART_COLORS[3], CHART_COLORS[6]],
      borderWidth: 0,
    },
  ],
};

// Country data for map legend
const topCountries = [
  { name: 'United States', visitors: 5781, percentage: 45 },
  { name: 'United Kingdom', visitors: 1542, percentage: 12 },
  { name: 'Germany', visitors: 1028, percentage: 8 },
  { name: 'France', visitors: 771, percentage: 6 },
  { name: 'Canada', visitors: 642, percentage: 5 },
];

// Top pages mini preview
const topPages = [
  { path: '/dashboard', views: 8234, percentage: 18.0 },
  { path: '/pricing', views: 6521, percentage: 14.3 },
  { path: '/features', views: 5876, percentage: 12.9 },
  { path: '/about', views: 4123, percentage: 9.0 },
  { path: '/blog/analytics-guide', views: 3654, percentage: 8.0 },
];

// Weekly traffic heatmap data (7 days x 24 hours)
function generateWeeklyHeatmapData() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const data: { day: string; hour: number; value: number }[] = [];

  // Peak hours pattern: higher during business hours, lower at night
  const hourlyPattern = [
    2, 1, 1, 1, 1, 2, 4, 8, 12, 15, 14, 13,
    14, 15, 14, 13, 12, 10, 8, 6, 5, 4, 3, 2
  ];

  // Day multipliers: higher on weekdays
  const dayMultipliers = [0.6, 1.0, 1.1, 1.2, 1.1, 1.0, 0.5];

  days.forEach((day, dayIndex) => {
    for (let hour = 0; hour < 24; hour++) {
      const baseValue = hourlyPattern[hour];
      const multiplier = dayMultipliers[dayIndex];
      const randomVariation = 0.8 + Math.random() * 0.4;
      data.push({
        day,
        hour,
        value: Math.round(baseValue * multiplier * randomVariation * 10),
      });
    }
  });

  return { days, data };
}

// Metric Badge Component
function MetricBadge({ label, value, change, positive }: {
  label: string;
  value: string;
  change: string;
  positive: boolean;
}) {
  return (
    <Row
      gap="3"
      alignItems="center"
      paddingX="4"
      paddingY="2"
      backgroundColor
      border
      borderRadius="3"
      style={{
        animation: 'fadeSlideIn 0.5s ease-out forwards',
        opacity: 0,
      }}
    >
      <Text size="2" color="muted" weight="medium">{label}</Text>
      <Text size="3" weight="bold">{value}</Text>
      <Text
        size="1"
        weight="medium"
        style={{ color: positive ? 'var(--color-green-9)' : 'var(--color-red-9)' }}
      >
        {change}
      </Text>
    </Row>
  );
}

// Chart Legend Item
function LegendItem({ color, label, value, percentage }: {
  color: string;
  label: string;
  value?: number;
  percentage: number;
}) {
  return (
    <Row gap="2" alignItems="center">
      <Box
        style={{
          width: 10,
          height: 10,
          borderRadius: 2,
          backgroundColor: color,
          flexShrink: 0,
        }}
      />
      <Text size="2" style={{ flex: 1 }}>{label}</Text>
      <Text size="2" weight="medium">{percentage}%</Text>
    </Row>
  );
}

// Weekly Heatmap Component
function WeeklyHeatmap() {
  const { days, data } = useMemo(() => generateWeeklyHeatmapData(), []);
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <Column gap="3">
      <Row gap="1" justifyContent="flex-end" paddingRight="2">
        {Array.from({ length: 24 }, (_, i) => (
          <Text
            key={i}
            size="1"
            color="muted"
            align="center"
            style={{ width: 14, fontSize: 9 }}
          >
            {i % 4 === 0 ? `${i}` : ''}
          </Text>
        ))}
      </Row>
      {days.map((day, dayIndex) => (
        <Row key={day} gap="1" alignItems="center">
          <Text size="2" weight="medium" style={{ width: 32 }}>{day}</Text>
          {Array.from({ length: 24 }, (_, hour) => {
            const cellData = data.find(d => d.day === day && d.hour === hour);
            const intensity = cellData ? cellData.value / maxValue : 0;
            return (
              <Box
                key={hour}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 2,
                  backgroundColor: `rgba(38, 128, 235, ${0.1 + intensity * 0.9})`,
                  transition: 'transform 0.2s ease',
                }}
              />
            );
          })}
        </Row>
      ))}
      <Row gap="2" justifyContent="flex-end" paddingTop="2">
        <Text size="1" color="muted">Less</Text>
        {[0.1, 0.3, 0.5, 0.7, 0.9].map((intensity, i) => (
          <Box
            key={i}
            style={{
              width: 12,
              height: 12,
              borderRadius: 2,
              backgroundColor: `rgba(38, 128, 235, ${intensity})`,
            }}
          />
        ))}
        <Text size="1" color="muted">More</Text>
      </Row>
    </Column>
  );
}

// Mini Table Preview
function MiniTablePreview({ title, data }: {
  title: string;
  data: { path: string; views: number; percentage: number }[];
}) {
  return (
    <Column gap="3">
      <Text size="2" weight="bold" color="muted">{title}</Text>
      {data.slice(0, 5).map((item, index) => (
        <Row key={item.path} gap="3" alignItems="center">
          <Text size="1" color="muted" style={{ width: 16 }}>{index + 1}</Text>
          <Text size="2" style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {item.path}
          </Text>
          <Row
            style={{
              width: `${item.percentage}%`,
              maxWidth: 60,
              height: 4,
              backgroundColor: '#2680eb',
              borderRadius: 2,
            }}
          />
          <Text size="2" weight="medium" style={{ width: 50, textAlign: 'right' }}>
            {item.views.toLocaleString()}
          </Text>
        </Row>
      ))}
    </Column>
  );
}

// World Map Placeholder with Data Overlay
function WorldMapVisual() {
  return (
    <Column gap="4" style={{ position: 'relative', height: '100%' }}>
      {/* Map background with gradient */}
      <Box
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, var(--base-color-3) 0%, var(--base-color-2) 100%)',
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        {/* Stylized world map silhouette */}
        <svg viewBox="0 0 800 400" style={{ width: '100%', height: '100%', opacity: 0.6 }}>
          {/* Simplified continent shapes */}
          <ellipse cx="180" cy="180" rx="80" ry="100" fill="var(--base-color-5)" /> {/* North America */}
          <ellipse cx="200" cy="300" rx="40" ry="60" fill="var(--base-color-5)" /> {/* South America */}
          <ellipse cx="400" cy="150" rx="70" ry="80" fill="var(--base-color-5)" /> {/* Europe */}
          <ellipse cx="450" cy="220" rx="100" ry="90" fill="var(--base-color-5)" /> {/* Africa */}
          <ellipse cx="600" cy="180" rx="120" ry="100" fill="var(--base-color-5)" /> {/* Asia */}
          <ellipse cx="700" cy="320" rx="50" ry="40" fill="var(--base-color-5)" /> {/* Australia */}

          {/* Hotspot indicators */}
          <circle cx="150" cy="160" r="20" fill="#2680eb" opacity="0.4">
            <animate attributeName="r" values="15;25;15" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="150" cy="160" r="6" fill="#2680eb" />

          <circle cx="380" cy="140" r="14" fill="#9256d9" opacity="0.4">
            <animate attributeName="r" values="10;18;10" dur="2s" repeatCount="indefinite" begin="0.3s" />
          </circle>
          <circle cx="380" cy="140" r="5" fill="#9256d9" />

          <circle cx="390" cy="165" r="10" fill="#44b556" opacity="0.4">
            <animate attributeName="r" values="8;14;8" dur="2s" repeatCount="indefinite" begin="0.6s" />
          </circle>
          <circle cx="390" cy="165" r="4" fill="#44b556" />

          <circle cx="360" cy="155" r="8" fill="#e68619" opacity="0.4">
            <animate attributeName="r" values="6;12;6" dur="2s" repeatCount="indefinite" begin="0.9s" />
          </circle>
          <circle cx="360" cy="155" r="3" fill="#e68619" />
        </svg>
      </Box>

      {/* Country Legend Overlay */}
      <Column
        gap="2"
        style={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          padding: 12,
          backgroundColor: 'var(--base-color-1)',
          borderRadius: 8,
          border: '1px solid var(--base-color-5)',
          minWidth: 180,
        }}
      >
        <Text size="2" weight="bold">Top Countries</Text>
        {topCountries.map((country, index) => (
          <Row key={country.name} gap="2" alignItems="center">
            <Box
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: CHART_COLORS[index],
              }}
            />
            <Text size="1" style={{ flex: 1 }}>{country.name}</Text>
            <Text size="1" weight="medium">{country.percentage}%</Text>
          </Row>
        ))}
      </Column>
    </Column>
  );
}

export default function VisualDashboardPage() {
  const pageviewData = useMemo(() => generatePageviewData(), []);

  return (
    <PageBody maxWidth="1440px">
      <style>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .chart-panel {
          animation: scaleIn 0.6s ease-out forwards;
          opacity: 0;
        }

        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }
        .delay-5 { animation-delay: 0.5s; }
        .delay-6 { animation-delay: 0.6s; }
      `}</style>

      <Column gap="6" paddingTop="6">
        {/* Header with Title and Metric Badges */}
        <Row
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap="4"
        >
          <Column gap="1">
            <Heading size="5">Analytics Dashboard</Heading>
            <Text color="muted" size="2">November 20 - December 3, 2024</Text>
          </Column>

          <Row gap="2" flexWrap="wrap">
            {metricsData.map((metric, index) => (
              <Box key={metric.label} style={{ animationDelay: `${index * 0.1}s` }}>
                <MetricBadge {...metric} />
              </Box>
            ))}
          </Row>
        </Row>

        {/* Hero Chart Section - Pageviews Over Time */}
        <Panel
          title="Pageviews Over Time"
          allowFullscreen
          className="chart-panel delay-1"
          style={{ minHeight: 400 }}
        >
          <Box style={{ height: 320 }}>
            <BarChart
              chartData={pageviewData}
              unit="day"
              XAxisType="timeseries"
            />
          </Box>
        </Panel>

        {/* Two Column Layout: Map + Weekly Traffic */}
        <Grid
          columns={{ xs: '1fr', lg: '2fr 1fr' }}
          gap="4"
        >
          {/* World Map - Prominently Featured */}
          <Panel
            title="Geographic Distribution"
            allowFullscreen
            className="chart-panel delay-2"
            style={{ minHeight: 380 }}
          >
            <WorldMapVisual />
          </Panel>

          {/* Weekly Traffic Heatmap */}
          <Panel
            title="Weekly Traffic Pattern"
            allowFullscreen
            className="chart-panel delay-3"
          >
            <WeeklyHeatmap />
          </Panel>
        </Grid>

        {/* Three Column Layout: Pie Charts */}
        <Grid
          columns={{ xs: '1fr', md: 'repeat(3, 1fr)' }}
          gap="4"
        >
          {/* Browser Distribution */}
          <Panel
            title="Browsers"
            className="chart-panel delay-4"
          >
            <Column gap="4" alignItems="center">
              <Box style={{ width: 180, height: 180 }}>
                <PieChart type="doughnut" chartData={browserData} />
              </Box>
              <Column gap="2" width="100%">
                {browserData.labels.map((label, index) => (
                  <LegendItem
                    key={label}
                    color={browserData.datasets[0].backgroundColor[index]}
                    label={label}
                    percentage={browserData.datasets[0].data[index]}
                  />
                ))}
              </Column>
            </Column>
          </Panel>

          {/* Device Distribution */}
          <Panel
            title="Devices"
            className="chart-panel delay-5"
          >
            <Column gap="4" alignItems="center">
              <Box style={{ width: 180, height: 180 }}>
                <PieChart type="doughnut" chartData={deviceData} />
              </Box>
              <Column gap="2" width="100%">
                {deviceData.labels.map((label, index) => (
                  <LegendItem
                    key={label}
                    color={deviceData.datasets[0].backgroundColor[index]}
                    label={label}
                    percentage={deviceData.datasets[0].data[index]}
                  />
                ))}
              </Column>
            </Column>
          </Panel>

          {/* OS Distribution */}
          <Panel
            title="Operating Systems"
            className="chart-panel delay-6"
          >
            <Column gap="4" alignItems="center">
              <Box style={{ width: 180, height: 180 }}>
                <PieChart type="doughnut" chartData={osData} />
              </Box>
              <Column gap="2" width="100%">
                {osData.labels.map((label, index) => (
                  <LegendItem
                    key={label}
                    color={osData.datasets[0].backgroundColor[index]}
                    label={label}
                    percentage={osData.datasets[0].data[index]}
                  />
                ))}
              </Column>
            </Column>
          </Panel>
        </Grid>

        {/* Secondary: Mini Table Previews */}
        <Grid
          columns={{ xs: '1fr', md: 'repeat(2, 1fr)' }}
          gap="4"
        >
          <Panel className="chart-panel" style={{ animationDelay: '0.7s' }}>
            <MiniTablePreview title="TOP PAGES" data={topPages} />
          </Panel>

          <Panel className="chart-panel" style={{ animationDelay: '0.8s' }}>
            <MiniTablePreview
              title="TOP REFERRERS"
              data={[
                { path: 'google.com', views: 4521, percentage: 22 },
                { path: 'twitter.com', views: 2876, percentage: 14 },
                { path: 'linkedin.com', views: 2234, percentage: 11 },
                { path: 'github.com', views: 1876, percentage: 9 },
                { path: 'reddit.com', views: 1234, percentage: 6 },
              ]}
            />
          </Panel>
        </Grid>
      </Column>
    </PageBody>
  );
}
