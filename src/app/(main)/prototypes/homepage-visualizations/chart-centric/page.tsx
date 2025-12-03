'use client';

import { useMemo, useState } from 'react';
import { Column, Row, Grid, Text, Heading, useTheme, Box } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { PieChart } from '@/components/charts/PieChart';
import { BarChart } from '@/components/charts/BarChart';
import { MetricCard } from '@/components/metrics/MetricCard';
import { getThemeColors } from '@/lib/colors';

// Mock data for the hero time series chart
const generateMockTimeSeriesData = () => {
  const now = new Date();
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      x: date.toISOString(),
      y: Math.floor(Math.random() * 3000) + 1500 + (30 - i) * 50,
    });
  }
  return data;
};

const generateMockSessionsData = () => {
  const now = new Date();
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      x: date.toISOString(),
      y: Math.floor(Math.random() * 1500) + 800 + (30 - i) * 25,
    });
  }
  return data;
};

// Mock pie chart data
const browserData = {
  labels: ['Chrome', 'Safari', 'Firefox', 'Edge', 'Other'],
  datasets: [
    {
      data: [58, 22, 10, 6, 4],
      backgroundColor: ['#3e63dd', '#30a46c', '#f76b15', '#0090ff', '#8d8d8d'],
      borderWidth: 0,
    },
  ],
};

const deviceData = {
  labels: ['Desktop', 'Mobile', 'Tablet'],
  datasets: [
    {
      data: [62, 32, 6],
      backgroundColor: ['#3e63dd', '#30a46c', '#f76b15'],
      borderWidth: 0,
    },
  ],
};

const countryData = {
  labels: ['United States', 'Germany', 'United Kingdom', 'France', 'Canada', 'Other'],
  datasets: [
    {
      data: [42, 18, 14, 10, 8, 8],
      backgroundColor: ['#3e63dd', '#30a46c', '#f76b15', '#0090ff', '#e5484d', '#8d8d8d'],
      borderWidth: 0,
    },
  ],
};

const channelData = {
  labels: ['Direct', 'Organic Search', 'Social', 'Referral', 'Email'],
  datasets: [
    {
      data: [35, 30, 18, 12, 5],
      backgroundColor: ['#3e63dd', '#30a46c', '#f76b15', '#0090ff', '#e5484d'],
      borderWidth: 0,
    },
  ],
};

// Mock metrics data
const mockMetrics = {
  pageviews: { value: 127849, change: 112453 },
  visitors: { value: 34521, change: 31204 },
  visits: { value: 52847, change: 48123 },
  bounceRate: { value: 42.3, change: 45.1 },
  avgDuration: { value: 184, change: 167 },
};

// Horizontal scrolling metrics chart data
const metricsOverTimeData = [
  { name: 'Pageviews', color: '#3e63dd', values: [85000, 92000, 98000, 105000, 112000, 127849] },
  { name: 'Visitors', color: '#30a46c', values: [22000, 25000, 28000, 30000, 32000, 34521] },
  { name: 'Bounce Rate', color: '#e5484d', values: [48, 46, 45, 44, 43, 42.3], isPercentage: true },
];

const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function PieChartPanel({ title, data, delay }: { title: string; data: any; delay: number }) {
  return (
    <Column
      gap="4"
      style={{
        animation: `fadeSlideUp 0.5s ease-out ${delay}ms both`,
      }}
    >
      <Panel minHeight="280px" paddingX="4" paddingY="4">
        <Text weight="bold" size="2" style={{ marginBottom: '8px' }}>
          {title}
        </Text>
        <Box height="200px" position="relative">
          <PieChart type="doughnut" chartData={data} />
        </Box>
      </Panel>
    </Column>
  );
}

function MiniTrendChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  return (
    <Row gap="1" alignItems="flex-end" height="40px">
      {data.map((value, index) => {
        const height = ((value - min) / range) * 32 + 8;
        return (
          <Box
            key={index}
            style={{
              width: '12px',
              height: `${height}px`,
              backgroundColor: color,
              borderRadius: '2px',
              opacity: 0.6 + (index / data.length) * 0.4,
              transition: 'transform 0.2s ease',
            }}
          />
        );
      })}
    </Row>
  );
}

export default function ChartCentricPage() {
  const { theme } = useTheme();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const pageviewsData = useMemo(() => generateMockTimeSeriesData(), []);
  const sessionsData = useMemo(() => generateMockSessionsData(), []);

  const heroChartData = useMemo(() => {
    return {
      datasets: [
        {
          type: 'bar' as const,
          label: 'Visitors',
          data: sessionsData,
          borderWidth: 1,
          barPercentage: 0.9,
          categoryPercentage: 0.9,
          ...colors.chart.visitors,
          order: 2,
        },
        {
          type: 'bar' as const,
          label: 'Pageviews',
          data: pageviewsData,
          barPercentage: 0.9,
          categoryPercentage: 0.9,
          borderWidth: 1,
          ...colors.chart.views,
          order: 1,
        },
      ],
    };
  }, [pageviewsData, sessionsData, colors]);

  const now = new Date();
  const minDate = new Date(now);
  minDate.setDate(minDate.getDate() - 29);

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
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

        .metric-scroll-container {
          overflow-x: auto;
          scrollbar-width: thin;
          scrollbar-color: var(--base-color-6) transparent;
        }

        .metric-scroll-container::-webkit-scrollbar {
          height: 6px;
        }

        .metric-scroll-container::-webkit-scrollbar-track {
          background: transparent;
        }

        .metric-scroll-container::-webkit-scrollbar-thumb {
          background-color: var(--base-color-6);
          border-radius: 3px;
        }

        .expandable-section {
          overflow: hidden;
          transition: max-height 0.3s ease-out, opacity 0.3s ease-out;
        }

        .view-details-btn {
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .view-details-btn:hover {
          color: var(--primary-color);
        }
      `}</style>

      <Column gap="6" style={{ padding: '24px' }}>
        {/* Hero Section: Large Chart with Inline Metrics */}
        <Panel
          minHeight="600px"
          style={{
            animation: 'scaleIn 0.6s ease-out both',
          }}
        >
          {/* Header Row with Title and Compact Metrics */}
          <Row
            justifyContent="space-between"
            alignItems="flex-start"
            wrap="wrap"
            gap="4"
            style={{ marginBottom: '16px' }}
          >
            <Column gap="1">
              <Heading size="5">Traffic Overview</Heading>
              <Text color="muted" size="2">
                Last 30 days performance
              </Text>
            </Column>

            {/* Compact Inline Metrics */}
            <Row gap="4" wrap="wrap">
              <MetricCard
                value={mockMetrics.pageviews.value}
                change={mockMetrics.pageviews.change}
                label="Pageviews"
                showChange
                valueSize="6"
                labelSize="1"
              />
              <MetricCard
                value={mockMetrics.visitors.value}
                change={mockMetrics.visitors.change}
                label="Visitors"
                showChange
                valueSize="6"
                labelSize="1"
              />
              <MetricCard
                value={mockMetrics.visits.value}
                change={mockMetrics.visits.change}
                label="Visits"
                showChange
                valueSize="6"
                labelSize="1"
              />
              <MetricCard
                value={mockMetrics.bounceRate.value}
                change={mockMetrics.bounceRate.change}
                label="Bounce Rate"
                showChange
                reverseColors
                valueSize="6"
                labelSize="1"
                formatValue={(n: number) => `${n.toFixed(1)}%`}
              />
            </Row>
          </Row>

          {/* Hero Bar Chart */}
          <Box height="480px" style={{ animation: 'fadeIn 0.8s ease-out 0.3s both' }}>
            <BarChart chartData={heroChartData} unit="day" minDate={minDate} maxDate={now} />
          </Box>
        </Panel>

        {/* Horizontal Scrolling Metrics Gallery */}
        <Panel
          style={{
            animation: 'fadeSlideUp 0.5s ease-out 200ms both',
          }}
        >
          <Row justifyContent="space-between" alignItems="center" style={{ marginBottom: '16px' }}>
            <Heading size="3">Metrics Trends</Heading>
            <Text color="muted" size="1">
              6-month overview
            </Text>
          </Row>

          <div className="metric-scroll-container">
            <Row gap="4" style={{ minWidth: 'max-content', paddingBottom: '8px' }}>
              {metricsOverTimeData.map((metric, index) => (
                <Column
                  key={metric.name}
                  gap="3"
                  paddingX="5"
                  paddingY="4"
                  border
                  borderRadius="3"
                  backgroundColor="2"
                  style={{
                    minWidth: '200px',
                    animation: `fadeSlideUp 0.4s ease-out ${300 + index * 100}ms both`,
                  }}
                >
                  <Row justifyContent="space-between" alignItems="center">
                    <Text weight="bold" size="2">
                      {metric.name}
                    </Text>
                    <Box
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: metric.color,
                      }}
                    />
                  </Row>
                  <Text size="6" weight="bold">
                    {metric.isPercentage
                      ? `${metric.values[metric.values.length - 1]}%`
                      : metric.values[metric.values.length - 1].toLocaleString()}
                  </Text>
                  <MiniTrendChart data={metric.values} color={metric.color} />
                  <Row justifyContent="space-between">
                    {months.map((month, i) => (
                      <Text key={month} color="muted" size="1">
                        {month}
                      </Text>
                    ))}
                  </Row>
                </Column>
              ))}
            </Row>
          </div>
        </Panel>

        {/* Pie/Doughnut Charts Row */}
        <Grid
          columns={{ xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
          gap="4"
        >
          <PieChartPanel title="Browsers" data={browserData} delay={400} />
          <PieChartPanel title="Devices" data={deviceData} delay={500} />
          <PieChartPanel title="Countries" data={countryData} delay={600} />
          <PieChartPanel title="Channels" data={channelData} delay={700} />
        </Grid>

        {/* Full-Width World Map */}
        <Panel
          minHeight="450px"
          style={{
            animation: 'fadeSlideUp 0.5s ease-out 800ms both',
          }}
        >
          <Row justifyContent="space-between" alignItems="center" style={{ marginBottom: '16px' }}>
            <Column gap="1">
              <Heading size="3">Global Reach</Heading>
              <Text color="muted" size="2">
                Visitor distribution by geography
              </Text>
            </Column>
            <Row gap="3">
              {[
                { country: 'United States', visitors: '14,523', pct: '42%' },
                { country: 'Germany', visitors: '6,214', pct: '18%' },
                { country: 'United Kingdom', visitors: '4,833', pct: '14%' },
              ].map((item, index) => (
                <Column
                  key={item.country}
                  gap="1"
                  paddingX="4"
                  paddingY="2"
                  backgroundColor="2"
                  borderRadius="2"
                  style={{
                    animation: `fadeSlideUp 0.4s ease-out ${900 + index * 100}ms both`,
                  }}
                >
                  <Text size="1" color="muted">
                    {item.country}
                  </Text>
                  <Row gap="2" alignItems="baseline">
                    <Text weight="bold" size="3">
                      {item.visitors}
                    </Text>
                    <Text size="1" color="muted">
                      ({item.pct})
                    </Text>
                  </Row>
                </Column>
              ))}
            </Row>
          </Row>

          {/* SVG World Map Visualization */}
          <Box
            height="350px"
            backgroundColor="2"
            borderRadius="3"
            position="relative"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <svg viewBox="0 0 800 400" style={{ width: '100%', height: '100%', opacity: 0.8 }}>
              {/* Simplified world map paths */}
              <g fill="var(--base-color-5)" stroke="var(--base-color-6)" strokeWidth="0.5">
                {/* North America */}
                <path d="M120,80 L180,60 L220,80 L240,120 L220,180 L180,200 L140,180 L100,140 L100,100 Z" />
                {/* South America */}
                <path d="M180,220 L220,200 L240,240 L220,320 L180,340 L160,300 L160,240 Z" />
                {/* Europe */}
                <path d="M380,60 L440,50 L480,70 L480,120 L440,140 L380,130 L360,100 Z" />
                {/* Africa */}
                <path d="M380,160 L440,140 L480,180 L480,280 L440,320 L380,300 L360,240 L360,180 Z" />
                {/* Asia */}
                <path d="M500,40 L620,30 L700,60 L720,140 L680,200 L580,220 L500,180 L480,100 Z" />
                {/* Australia */}
                <path d="M620,260 L700,240 L740,280 L720,340 L660,350 L620,320 L600,280 Z" />
              </g>

              {/* Hotspot indicators */}
              <g>
                {/* USA hotspot */}
                <circle cx="170" cy="120" r="20" fill="#3e63dd" opacity="0.6">
                  <animate attributeName="r" values="18;22;18" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="170" cy="120" r="8" fill="#3e63dd" />

                {/* Germany hotspot */}
                <circle cx="420" cy="90" r="14" fill="#30a46c" opacity="0.6">
                  <animate attributeName="r" values="12;16;12" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="420" cy="90" r="6" fill="#30a46c" />

                {/* UK hotspot */}
                <circle cx="370" cy="80" r="12" fill="#f76b15" opacity="0.6">
                  <animate attributeName="r" values="10;14;10" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="370" cy="80" r="5" fill="#f76b15" />

                {/* Asia hotspot */}
                <circle cx="600" cy="100" r="10" fill="#0090ff" opacity="0.6">
                  <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="600" cy="100" r="4" fill="#0090ff" />
              </g>
            </svg>

            {/* Map legend */}
            <Row
              gap="4"
              position="absolute"
              style={{ bottom: '16px', left: '16px' }}
            >
              <Row gap="2" alignItems="center">
                <Box
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: '#3e63dd',
                  }}
                />
                <Text size="1">High traffic</Text>
              </Row>
              <Row gap="2" alignItems="center">
                <Box
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: '#30a46c',
                  }}
                />
                <Text size="1">Medium traffic</Text>
              </Row>
              <Row gap="2" alignItems="center">
                <Box
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--base-color-5)',
                  }}
                />
                <Text size="1">Low traffic</Text>
              </Row>
            </Row>
          </Box>
        </Panel>

        {/* Weekly Traffic Heatmap */}
        <Panel
          style={{
            animation: 'fadeSlideUp 0.5s ease-out 1000ms both',
          }}
        >
          <Row justifyContent="space-between" alignItems="center" style={{ marginBottom: '16px' }}>
            <Column gap="1">
              <Heading size="3">Traffic Patterns</Heading>
              <Text color="muted" size="2">
                Weekly visitor activity heatmap
              </Text>
            </Column>
          </Row>

          {/* Custom Heatmap Visualization */}
          <Box style={{ overflowX: 'auto' }}>
            <Grid columns="repeat(8, 1fr)" gap="2" style={{ minWidth: '600px' }}>
              {/* Header row */}
              <Box />
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <Row key={day} justifyContent="center">
                  <Text weight="bold" size="1">
                    {day}
                  </Text>
                </Row>
              ))}

              {/* Time rows */}
              {[0, 3, 6, 9, 12, 15, 18, 21].map(hour => (
                <>
                  <Row key={`label-${hour}`} justifyContent="flex-end" alignItems="center" paddingX="2">
                    <Text size="1" color="muted">
                      {hour.toString().padStart(2, '0')}:00
                    </Text>
                  </Row>
                  {[0, 1, 2, 3, 4, 5, 6].map(day => {
                    // Generate realistic traffic pattern
                    const isWeekend = day >= 5;
                    const isPeakHour = hour >= 9 && hour <= 18;
                    const baseIntensity = isWeekend ? 0.3 : 0.5;
                    const peakBonus = isPeakHour ? 0.4 : 0;
                    const randomness = Math.random() * 0.2;
                    const intensity = Math.min(baseIntensity + peakBonus + randomness, 1);

                    return (
                      <Box
                        key={`${hour}-${day}`}
                        borderRadius="2"
                        style={{
                          height: '24px',
                          backgroundColor: `rgba(62, 99, 221, ${intensity})`,
                          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={e => {
                          (e.target as HTMLElement).style.transform = 'scale(1.1)';
                          (e.target as HTMLElement).style.boxShadow =
                            '0 2px 8px rgba(62, 99, 221, 0.4)';
                        }}
                        onMouseLeave={e => {
                          (e.target as HTMLElement).style.transform = 'scale(1)';
                          (e.target as HTMLElement).style.boxShadow = 'none';
                        }}
                      />
                    );
                  })}
                </>
              ))}
            </Grid>
          </Box>

          {/* Heatmap Legend */}
          <Row gap="2" justifyContent="center" style={{ marginTop: '16px' }}>
            <Text size="1" color="muted">
              Less
            </Text>
            {[0.1, 0.3, 0.5, 0.7, 0.9].map((intensity, index) => (
              <Box
                key={index}
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '2px',
                  backgroundColor: `rgba(62, 99, 221, ${intensity})`,
                }}
              />
            ))}
            <Text size="1" color="muted">
              More
            </Text>
          </Row>
        </Panel>

        {/* Collapsible Details Section */}
        <Panel
          style={{
            animation: 'fadeSlideUp 0.5s ease-out 1100ms both',
          }}
        >
          <Row
            justifyContent="space-between"
            alignItems="center"
            className="view-details-btn"
            onClick={() => setExpandedSection(expandedSection === 'tables' ? null : 'tables')}
            style={{ cursor: 'pointer' }}
          >
            <Column gap="1">
              <Heading size="3">Detailed Breakdowns</Heading>
              <Text color="muted" size="2">
                Top pages, referrers, and more
              </Text>
            </Column>
            <Text
              size="2"
              style={{
                color: 'var(--primary-color)',
                transition: 'transform 0.2s ease',
                transform: expandedSection === 'tables' ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            >
              {expandedSection === 'tables' ? 'Hide Details' : 'View Details'}
            </Text>
          </Row>

          <div
            className="expandable-section"
            style={{
              maxHeight: expandedSection === 'tables' ? '600px' : '0px',
              opacity: expandedSection === 'tables' ? 1 : 0,
              marginTop: expandedSection === 'tables' ? '16px' : '0px',
            }}
          >
            <Grid columns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} gap="4">
              {/* Top Pages */}
              <Column gap="3" paddingX="4" paddingY="4" backgroundColor="2" borderRadius="3">
                <Text weight="bold" size="2">
                  Top Pages
                </Text>
                {[
                  { page: '/dashboard', views: '12,453', pct: 28 },
                  { page: '/analytics/reports', views: '8,721', pct: 20 },
                  { page: '/settings/account', views: '6,234', pct: 14 },
                  { page: '/integrations', views: '4,892', pct: 11 },
                  { page: '/help/getting-started', views: '3,456', pct: 8 },
                ].map((item, index) => (
                  <Row key={item.page} justifyContent="space-between" alignItems="center">
                    <Text size="2" style={{ flex: 1 }}>
                      {item.page}
                    </Text>
                    <Row gap="3" alignItems="center">
                      <Box
                        style={{
                          width: '60px',
                          height: '6px',
                          backgroundColor: 'var(--base-color-4)',
                          borderRadius: '3px',
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          style={{
                            width: `${item.pct}%`,
                            height: '100%',
                            backgroundColor: '#3e63dd',
                            borderRadius: '3px',
                          }}
                        />
                      </Box>
                      <Text size="1" color="muted" style={{ width: '50px', textAlign: 'right' }}>
                        {item.views}
                      </Text>
                    </Row>
                  </Row>
                ))}
              </Column>

              {/* Top Referrers */}
              <Column gap="3" paddingX="4" paddingY="4" backgroundColor="2" borderRadius="3">
                <Text weight="bold" size="2">
                  Top Referrers
                </Text>
                {[
                  { source: 'google.com', visits: '8,234', pct: 35 },
                  { source: 'twitter.com', visits: '4,521', pct: 19 },
                  { source: 'linkedin.com', visits: '3,892', pct: 16 },
                  { source: 'github.com', visits: '2,456', pct: 10 },
                  { source: 'reddit.com', visits: '1,823', pct: 8 },
                ].map((item, index) => (
                  <Row key={item.source} justifyContent="space-between" alignItems="center">
                    <Text size="2" style={{ flex: 1 }}>
                      {item.source}
                    </Text>
                    <Row gap="3" alignItems="center">
                      <Box
                        style={{
                          width: '60px',
                          height: '6px',
                          backgroundColor: 'var(--base-color-4)',
                          borderRadius: '3px',
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          style={{
                            width: `${item.pct}%`,
                            height: '100%',
                            backgroundColor: '#30a46c',
                            borderRadius: '3px',
                          }}
                        />
                      </Box>
                      <Text size="1" color="muted" style={{ width: '50px', textAlign: 'right' }}>
                        {item.visits}
                      </Text>
                    </Row>
                  </Row>
                ))}
              </Column>
            </Grid>
          </div>
        </Panel>
      </Column>
    </>
  );
}
