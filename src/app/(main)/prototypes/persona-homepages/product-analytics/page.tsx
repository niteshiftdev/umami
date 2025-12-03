'use client';

import { Column, Row, Grid, Text, Heading, Box } from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { ListTable } from '@/components/metrics/ListTable';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import {
  useDynamicVariant,
  useDynamicBoolean,
  useDynamicNumber,
} from '@niteshift/dials';

// Chart colors from design system
const CHART_COLORS = [
  '#2680eb',
  '#9256d9',
  '#44b556',
  '#e68619',
  '#e34850',
  '#f7bd12',
  '#01bad7',
  '#6734bc',
  '#89c541',
  '#ffc301',
];

// Generate dates for the past 30 days
function generateDates(days: number): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
}

// Realistic DAU data with weekly patterns
function generateDAUData(dates: string[]): { x: string; y: number }[] {
  const baseDAU = 12500;
  return dates.map((date, i) => {
    const dayOfWeek = new Date(date).getDay();
    const weekendDrop = dayOfWeek === 0 || dayOfWeek === 6 ? 0.65 : 1;
    const trend = 1 + i * 0.008;
    const noise = 0.9 + Math.random() * 0.2;
    return {
      x: date,
      y: Math.round(baseDAU * weekendDrop * trend * noise),
    };
  });
}

// Realistic session data
function generateSessionData(dates: string[]): { x: string; y: number }[] {
  return dates.map((date, i) => {
    const base = 2.3;
    const trend = 1 + i * 0.003;
    const noise = 0.95 + Math.random() * 0.1;
    return {
      x: date,
      y: Math.round(base * trend * noise * 100) / 100,
    };
  });
}

const dates30 = generateDates(30);

// Create date objects for chart bounds
const getDateBounds = (dates: string[]) => {
  const minDate = new Date(dates[0]);
  const maxDate = new Date(dates[dates.length - 1]);
  return { minDate, maxDate };
};

const dateBounds30 = getDateBounds(dates30);

// Mock data for engagement trends
const engagementTrendsData = {
  labels: dates30,
  datasets: [
    {
      label: 'Active Users',
      data: generateDAUData(dates30),
      backgroundColor: CHART_COLORS[0],
      borderColor: CHART_COLORS[0],
      borderWidth: 1,
    },
  ],
};

const sessionsPerUserData = {
  labels: dates30,
  datasets: [
    {
      label: 'Sessions',
      data: generateSessionData(dates30),
      backgroundColor: CHART_COLORS[1],
      borderColor: CHART_COLORS[1],
      borderWidth: 1,
    },
  ],
};

// Feature adoption data for pie chart
const featureUsageData = {
  labels: [
    'Dashboard',
    'Reports',
    'Analytics',
    'Settings',
    'Integrations',
    'API',
    'Export',
    'Alerts',
  ],
  datasets: [
    {
      data: [28, 22, 18, 12, 8, 6, 4, 2],
      backgroundColor: CHART_COLORS.slice(0, 8),
      borderColor: CHART_COLORS.slice(0, 8),
    },
  ],
};

// Top features list data
const topFeaturesData = [
  { label: 'Dashboard Overview', count: 45892, percent: 100 },
  { label: 'Custom Reports Builder', count: 38421, percent: 84 },
  { label: 'Real-time Analytics', count: 31205, percent: 68 },
  { label: 'User Segmentation', count: 24891, percent: 54 },
  { label: 'A/B Test Results', count: 19234, percent: 42 },
  { label: 'Funnel Analysis', count: 15678, percent: 34 },
  { label: 'Cohort Reports', count: 12456, percent: 27 },
  { label: 'Export to CSV', count: 9823, percent: 21 },
];

// Top events data
const topEventsData = [
  { label: 'page_view', count: 892456, percent: 100 },
  { label: 'button_click', count: 567234, percent: 64 },
  { label: 'form_submit', count: 234567, percent: 26 },
  { label: 'search_query', count: 189234, percent: 21 },
  { label: 'add_to_cart', count: 145678, percent: 16 },
  { label: 'checkout_start', count: 98234, percent: 11 },
  { label: 'purchase_complete', count: 45678, percent: 5 },
  { label: 'share_content', count: 34567, percent: 4 },
];

// Funnel data
const funnelStages = [
  { name: 'Visitors', value: 100000, rate: 100 },
  { name: 'Signed Up', value: 35000, rate: 35 },
  { name: 'Activated', value: 21000, rate: 60 },
  { name: 'Week 1 Active', value: 14700, rate: 70 },
  { name: 'Week 4 Active', value: 8820, rate: 60 },
  { name: 'Converted', value: 5292, rate: 60 },
];

// Retention cohort data
const retentionCohorts = [
  { week: 'Week 0', day1: 100, day7: 68, day14: 52, day30: 38 },
  { week: 'Week 1', day1: 100, day7: 71, day14: 55, day30: 41 },
  { week: 'Week 2', day1: 100, day7: 65, day14: 48, day30: 35 },
  { week: 'Week 3', day1: 100, day7: 73, day14: 58, day30: 44 },
];

export default function ProductAnalyticsDashboard() {
  // Dials for layout customization
  const layoutColumns = useDynamicVariant('layout-columns', {
    label: 'Panel Layout',
    description: 'Number of columns for panel grid',
    default: '2',
    options: ['1', '2', '3'] as const,
    group: 'Layout',
  });

  const showFunnel = useDynamicBoolean('show-funnel', {
    label: 'Show Funnel',
    description: 'Display the conversion funnel section',
    default: true,
    group: 'Sections',
  });

  const showRetention = useDynamicBoolean('show-retention', {
    label: 'Show Retention',
    description: 'Display the retention cohort section',
    default: true,
    group: 'Sections',
  });

  const showFeatureUsage = useDynamicBoolean('show-feature-usage', {
    label: 'Show Feature Usage',
    description: 'Display the feature usage breakdown',
    default: true,
    group: 'Sections',
  });

  const chartType = useDynamicVariant('chart-type', {
    label: 'Feature Chart Type',
    description: 'Chart type for feature usage',
    default: 'doughnut',
    options: ['pie', 'doughnut'] as const,
    group: 'Charts',
  });

  const funnelStyle = useDynamicVariant('funnel-style', {
    label: 'Funnel Style',
    description: 'Visual style for the funnel',
    default: 'horizontal',
    options: ['horizontal', 'vertical'] as const,
    group: 'Charts',
  });

  const metricSize = useDynamicVariant('metric-size', {
    label: 'Metric Size',
    description: 'Size of metric values',
    default: '7',
    options: ['5', '6', '7', '8'] as const,
    group: 'Typography',
  });

  const gridCols =
    layoutColumns === '1'
      ? '1fr'
      : layoutColumns === '3'
        ? 'repeat(3, 1fr)'
        : 'repeat(2, 1fr)';

  return (
    <PageBody>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(16px);
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
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
        .animate-scale-in {
          animation: scaleIn 0.4s ease-out forwards;
          opacity: 0;
        }
        .animate-slide-in-left {
          animation: slideInLeft 0.4s ease-out forwards;
          opacity: 0;
        }
        .funnel-stage {
          transition: all 0.2s ease;
        }
        .funnel-stage:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .retention-cell {
          transition: background-color 0.15s ease;
        }
        .retention-cell:hover {
          filter: brightness(1.1);
        }
      `}</style>

      <PageHeader
        title="Product Analytics"
        description="User engagement, feature adoption, and retention insights"
      />

      {/* Key Metrics */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0ms' }}>
        <MetricsBar>
          <MetricCard
            label="Daily Active Users"
            value={14892}
            change={12.4}
            showChange
            valueSize={metricSize as '5' | '6' | '7' | '8'}
          />
          <MetricCard
            label="Weekly Active Users"
            value={47823}
            change={8.2}
            showChange
            valueSize={metricSize as '5' | '6' | '7' | '8'}
          />
          <MetricCard
            label="Monthly Active Users"
            value={128456}
            change={15.7}
            showChange
            valueSize={metricSize as '5' | '6' | '7' | '8'}
          />
          <MetricCard
            label="Avg Session Duration"
            value={8.4}
            formatValue={(n) => `${n.toFixed(1)}m`}
            change={5.3}
            showChange
            valueSize={metricSize as '5' | '6' | '7' | '8'}
          />
          <MetricCard
            label="Sessions per User"
            value={2.8}
            formatValue={(n) => n.toFixed(1)}
            change={3.1}
            showChange
            valueSize={metricSize as '5' | '6' | '7' | '8'}
          />
          <MetricCard
            label="Feature Adoption"
            value={68}
            formatValue={(n) => `${Math.round(n)}%`}
            change={4.2}
            showChange
            valueSize={metricSize as '5' | '6' | '7' | '8'}
          />
        </MetricsBar>
      </div>

      {/* Engagement Charts */}
      <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <Grid columns={{ xs: '1fr', lg: gridCols }} gap="6" style={{ marginTop: 'var(--spacing-6)' }}>
          <Panel title="Daily Active Users (30 days)">
            <Box style={{ height: 300 }}>
              <BarChart
                chartData={engagementTrendsData}
                unit="day"
                minDate={dateBounds30.minDate}
                maxDate={dateBounds30.maxDate}
              />
            </Box>
          </Panel>
          <Panel title="Sessions per User Trend">
            <Box style={{ height: 300 }}>
              <BarChart
                chartData={sessionsPerUserData}
                unit="day"
                minDate={dateBounds30.minDate}
                maxDate={dateBounds30.maxDate}
              />
            </Box>
          </Panel>
        </Grid>
      </div>

      {/* Funnel Section */}
      {showFunnel && (
        <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <Panel title="Conversion Funnel" style={{ marginTop: 'var(--spacing-6)' }}>
            {funnelStyle === 'horizontal' ? (
              <Row gap="3" style={{ overflowX: 'auto', padding: 'var(--spacing-4) 0' }}>
                {funnelStages.map((stage, index) => {
                  const widthPercent = 100 - index * 12;
                  return (
                    <Column
                      key={stage.name}
                      className="funnel-stage animate-slide-in-left"
                      style={{
                        flex: '1 0 140px',
                        animationDelay: `${300 + index * 80}ms`,
                      }}
                      gap="2"
                      alignItems="center"
                    >
                      <Box
                        style={{
                          width: `${widthPercent}%`,
                          minWidth: 80,
                          height: 64,
                          background: `linear-gradient(135deg, ${CHART_COLORS[index]} 0%, ${CHART_COLORS[index]}dd 100%)`,
                          borderRadius: 'var(--border-radius-2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Text size="5" weight="bold" style={{ color: '#fff' }}>
                          {stage.value.toLocaleString()}
                        </Text>
                      </Box>
                      <Text weight="semibold" size="2">
                        {stage.name}
                      </Text>
                      <Text color="muted" size="1">
                        {stage.rate}%{index > 0 ? ' of prev' : ''}
                      </Text>
                    </Column>
                  );
                })}
              </Row>
            ) : (
              <Column gap="3" style={{ padding: 'var(--spacing-4) 0' }}>
                {funnelStages.map((stage, index) => {
                  const widthPercent = 100 - index * 10;
                  return (
                    <Row
                      key={stage.name}
                      className="funnel-stage animate-slide-in-left"
                      style={{
                        animationDelay: `${300 + index * 80}ms`,
                      }}
                      gap="4"
                      alignItems="center"
                    >
                      <Box style={{ width: 120, flexShrink: 0 }}>
                        <Text weight="semibold" size="2">
                          {stage.name}
                        </Text>
                      </Box>
                      <Box
                        style={{
                          width: `${widthPercent}%`,
                          height: 36,
                          background: `linear-gradient(90deg, ${CHART_COLORS[index]} 0%, ${CHART_COLORS[index]}cc 100%)`,
                          borderRadius: 'var(--border-radius-2)',
                          display: 'flex',
                          alignItems: 'center',
                          paddingLeft: 'var(--spacing-4)',
                        }}
                      >
                        <Text size="3" weight="bold" style={{ color: '#fff' }}>
                          {stage.value.toLocaleString()}
                        </Text>
                      </Box>
                      <Box style={{ width: 60, flexShrink: 0 }}>
                        <Text color="muted" size="2">
                          {stage.rate}%
                        </Text>
                      </Box>
                    </Row>
                  );
                })}
              </Column>
            )}
          </Panel>
        </div>
      )}

      {/* Feature Usage and Events */}
      <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <Grid columns={{ xs: '1fr', lg: gridCols }} gap="6" style={{ marginTop: 'var(--spacing-6)' }}>
          {showFeatureUsage && (
            <Panel title="Feature Usage Breakdown">
              <Row gap="6" alignItems="flex-start">
                <Box style={{ width: 200, height: 200, flexShrink: 0 }}>
                  <PieChart
                    type={chartType as 'pie' | 'doughnut'}
                    chartData={featureUsageData}
                  />
                </Box>
                <Column gap="2" style={{ flex: 1 }}>
                  {featureUsageData.labels.map((label, i) => (
                    <Row key={label} gap="3" alignItems="center">
                      <Box
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: 2,
                          backgroundColor: CHART_COLORS[i],
                          flexShrink: 0,
                        }}
                      />
                      <Text size="2" style={{ flex: 1 }}>
                        {label}
                      </Text>
                      <Text size="2" weight="semibold">
                        {featureUsageData.datasets[0].data[i]}%
                      </Text>
                    </Row>
                  ))}
                </Column>
              </Row>
            </Panel>
          )}
          <Panel title="Top Features">
            <ListTable
              data={topFeaturesData}
              title="Feature"
              metric="Sessions"
              showPercentage
            />
          </Panel>
        </Grid>
      </div>

      {/* Events and Retention */}
      <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <Grid columns={{ xs: '1fr', lg: gridCols }} gap="6" style={{ marginTop: 'var(--spacing-6)' }}>
          <Panel title="Top Events">
            <ListTable
              data={topEventsData}
              title="Event"
              metric="Count"
              showPercentage
            />
          </Panel>

          {showRetention && (
            <Panel title="Retention Cohorts">
              <Column gap="3">
                {/* Header row */}
                <Grid
                  columns="100px repeat(4, 1fr)"
                  gap="2"
                  style={{ paddingBottom: 'var(--spacing-2)', borderBottom: '1px solid var(--base-border-color)' }}
                >
                  <Text weight="bold" size="1">
                    Cohort
                  </Text>
                  <Text weight="bold" size="1" align="center">
                    Day 1
                  </Text>
                  <Text weight="bold" size="1" align="center">
                    Day 7
                  </Text>
                  <Text weight="bold" size="1" align="center">
                    Day 14
                  </Text>
                  <Text weight="bold" size="1" align="center">
                    Day 30
                  </Text>
                </Grid>
                {/* Data rows */}
                {retentionCohorts.map((cohort, rowIndex) => (
                  <Grid
                    key={cohort.week}
                    columns="100px repeat(4, 1fr)"
                    gap="2"
                    className="animate-slide-in-left"
                    style={{ animationDelay: `${500 + rowIndex * 60}ms` }}
                  >
                    <Text weight="semibold" size="2">
                      {cohort.week}
                    </Text>
                    {[cohort.day1, cohort.day7, cohort.day14, cohort.day30].map(
                      (value, colIndex) => {
                        const intensity = value / 100;
                        const bgColor = `rgba(38, 128, 235, ${intensity * 0.8})`;
                        const textColor = intensity > 0.5 ? '#fff' : 'inherit';
                        return (
                          <Box
                            key={colIndex}
                            className="retention-cell"
                            style={{
                              backgroundColor: bgColor,
                              borderRadius: 'var(--border-radius-2)',
                              padding: 'var(--spacing-2)',
                              textAlign: 'center',
                            }}
                          >
                            <Text
                              size="2"
                              weight="semibold"
                              style={{ color: textColor }}
                            >
                              {value}%
                            </Text>
                          </Box>
                        );
                      }
                    )}
                  </Grid>
                ))}
              </Column>
            </Panel>
          )}
        </Grid>
      </div>

      {/* Engagement Insights */}
      <div className="animate-fade-in-up" style={{ animationDelay: '500ms' }}>
        <Panel title="Engagement Insights" style={{ marginTop: 'var(--spacing-6)' }}>
          <Grid columns={{ xs: '1fr', md: 'repeat(3, 1fr)' }} gap="6">
            <Column
              gap="2"
              padding="4"
              style={{
                backgroundColor: 'var(--base-color-2)',
                borderRadius: 'var(--border-radius-2)',
                borderLeft: `4px solid ${CHART_COLORS[4]}`,
              }}
            >
              <Text weight="bold" size="2">
                Power Users
              </Text>
              <Text size="6" weight="bold" style={{ color: CHART_COLORS[4] }}>
                2,847
              </Text>
              <Text color="muted" size="1">
                Users with 10+ sessions this week
              </Text>
            </Column>
            <Column
              gap="2"
              padding="4"
              style={{
                backgroundColor: 'var(--base-color-2)',
                borderRadius: 'var(--border-radius-2)',
                borderLeft: `4px solid ${CHART_COLORS[2]}`,
              }}
            >
              <Text weight="bold" size="2">
                Activation Rate
              </Text>
              <Text size="6" weight="bold" style={{ color: CHART_COLORS[2] }}>
                67.4%
              </Text>
              <Text color="muted" size="1">
                New users completing onboarding
              </Text>
            </Column>
            <Column
              gap="2"
              padding="4"
              style={{
                backgroundColor: 'var(--base-color-2)',
                borderRadius: 'var(--border-radius-2)',
                borderLeft: `4px solid ${CHART_COLORS[0]}`,
              }}
            >
              <Text weight="bold" size="2">
                Stickiness (DAU/MAU)
              </Text>
              <Text size="6" weight="bold" style={{ color: CHART_COLORS[0] }}>
                11.6%
              </Text>
              <Text color="muted" size="1">
                Industry benchmark: 10-15%
              </Text>
            </Column>
          </Grid>
        </Panel>
      </div>
    </PageBody>
  );
}
