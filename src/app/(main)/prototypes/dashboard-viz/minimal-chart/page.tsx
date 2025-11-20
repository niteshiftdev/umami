'use client';
import { Column, Row, Grid, Text } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { PageviewsChart } from '@/components/metrics/PageviewsChart';
import { useMemo } from 'react';
import { useTheme } from '@umami/react-zen';
import { getThemeColors } from '@/lib/colors';

export default function MinimalChartDashboard() {
  const { theme } = useTheme();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  // Generate realistic sample data for the past 30 days
  const generateRealisticData = () => {
    const now = new Date();
    const sessions = [];
    const pageviews = [];

    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const timestamp = date.getTime();

      // Create realistic weekly patterns
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      // Base traffic with weekly pattern
      let baseTraffic = 400;
      if (isWeekend) {
        baseTraffic = 250;
      }

      // Add growth trend over the month
      const growthFactor = 1 + (29 - i) * 0.015; // 1.5% daily growth

      // Add some natural variance
      const variance = Math.random() * 0.25 + 0.875; // 87.5-112.5% variance

      const sessionCount = Math.floor(baseTraffic * growthFactor * variance);
      const pageviewCount = Math.floor(sessionCount * (2.3 + Math.random() * 0.8)); // 2.3-3.1 pages per session

      sessions.push({ x: timestamp, y: sessionCount });
      pageviews.push({ x: timestamp, y: pageviewCount });
    }

    return { sessions, pageviews };
  };

  const chartData = useMemo(() => generateRealisticData(), []);
  const minDate = new Date(Date.now() - 29 * 24 * 60 * 60 * 1000);
  const maxDate = new Date();

  // Calculate summary stats
  const totalSessions = chartData.sessions.reduce((sum, item) => sum + item.y, 0);
  const totalPageviews = chartData.pageviews.reduce((sum, item) => sum + item.y, 0);
  const avgPagesPerSession = totalPageviews / totalSessions;

  const recentSessions = chartData.sessions.slice(-7).reduce((sum, item) => sum + item.y, 0);
  const previousSessions = chartData.sessions.slice(-14, -7).reduce((sum, item) => sum + item.y, 0);
  const weeklyGrowth = ((recentSessions - previousSessions) / previousSessions) * 100;

  return (
    <PageBody>
      <Column gap="4" margin="2">
        {/* Header with inline stats */}
        <Column gap="2">
          <Row justifyContent="space-between" alignItems="flex-start">
            <Column>
              <Text size="8" weight="bold">Analytics Overview</Text>
              <Text size="3" color="muted">Last 30 days of traffic data</Text>
            </Column>
            <Column padding="2" borderRadius="3" backgroundColor border>
              <Row gap="4" alignItems="center">
                <Column gap="0" alignItems="center">
                  <Text size="2" color="muted">Growth</Text>
                  <Text size="5" weight="bold" style={{ color: weeklyGrowth > 0 ? '#44b556' : '#e34850' }}>
                    {weeklyGrowth > 0 ? '+' : ''}{weeklyGrowth.toFixed(1)}%
                  </Text>
                </Column>
                <div style={{ width: '1px', height: '40px', backgroundColor: colors.base[3] }} />
                <Column gap="0" alignItems="center">
                  <Text size="2" color="muted">Avg Pages</Text>
                  <Text size="5" weight="bold">{avgPagesPerSession.toFixed(1)}</Text>
                </Column>
              </Row>
            </Column>
          </Row>
        </Column>

        {/* Large Main Chart */}
        <Column padding="4" borderRadius="3" backgroundColor border>
          <Column gap="3">
            <Row justifyContent="space-between" alignItems="center">
              <Text size="5" weight="bold">Traffic Trends</Text>
              <Row gap="4" alignItems="center">
                <Row gap="2" alignItems="center">
                  <div style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: colors.chart.visitors.backgroundColor,
                    borderRadius: '2px',
                  }} />
                  <Column gap="0">
                    <Text size="2" color="muted">Visitors</Text>
                    <Text size="4" weight="bold">{totalSessions.toLocaleString()}</Text>
                  </Column>
                </Row>
                <Row gap="2" alignItems="center">
                  <div style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: colors.chart.views.backgroundColor,
                    borderRadius: '2px',
                  }} />
                  <Column gap="0">
                    <Text size="2" color="muted">Views</Text>
                    <Text size="4" weight="bold">{totalPageviews.toLocaleString()}</Text>
                  </Column>
                </Row>
              </Row>
            </Row>

            <PageviewsChart
              data={chartData}
              unit="day"
              minDate={minDate}
              maxDate={maxDate}
            />
          </Column>
        </Column>

        {/* Secondary Metrics Grid */}
        <Grid columns="4" gap="3">
          <Column padding="3" borderRadius="3" backgroundColor border>
            <Column gap="2">
              <Row justifyContent="space-between" alignItems="center">
                <Text size="2" color="muted">Daily Average</Text>
                <div style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: colors.base[3],
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Text size="4">📊</Text>
                </div>
              </Row>
              <Text size="7" weight="bold">{Math.floor(totalSessions / 30).toLocaleString()}</Text>
              <Text size="2" color="muted">visitors per day</Text>
            </Column>
          </Column>

          <Column padding="3" borderRadius="3" backgroundColor border>
            <Column gap="2">
              <Row justifyContent="space-between" alignItems="center">
                <Text size="2" color="muted">Peak Day</Text>
                <div style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: colors.base[3],
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Text size="4">🚀</Text>
                </div>
              </Row>
              <Text size="7" weight="bold">
                {Math.max(...chartData.sessions.map(d => d.y)).toLocaleString()}
              </Text>
              <Text size="2" color="muted">highest traffic</Text>
            </Column>
          </Column>

          <Column padding="3" borderRadius="3" backgroundColor border>
            <Column gap="2">
              <Row justifyContent="space-between" alignItems="center">
                <Text size="2" color="muted">Consistency</Text>
                <div style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: colors.base[3],
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Text size="4">📈</Text>
                </div>
              </Row>
              <Text size="7" weight="bold">92%</Text>
              <Text size="2" color="muted">uptime & reliability</Text>
            </Column>
          </Column>

          <Column padding="3" borderRadius="3" backgroundColor border>
            <Column gap="2">
              <Row justifyContent="space-between" alignItems="center">
                <Text size="2" color="muted">New vs Return</Text>
                <div style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: colors.base[3],
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Text size="4">👥</Text>
                </div>
              </Row>
              <Row gap="1" alignItems="baseline">
                <Text size="7" weight="bold">58</Text>
                <Text size="4" color="muted">/</Text>
                <Text size="5" color="muted">42</Text>
              </Row>
              <Text size="2" color="muted">new/returning ratio</Text>
            </Column>
          </Column>
        </Grid>

        {/* Quick Insights */}
        <Column padding="3" borderRadius="3" backgroundColor border style={{ borderLeft: `4px solid ${colors.primary}` }}>
          <Column gap="2">
            <Row gap="2" alignItems="center">
              <Text size="5">💡</Text>
              <Text size="4" weight="bold">Quick Insights</Text>
            </Row>
            <Grid columns="3" gap="3">
              <Column gap="1">
                <Text size="3" weight="bold">Strong Growth Trend</Text>
                <Text size="2" color="muted">
                  Traffic has increased by {weeklyGrowth.toFixed(1)}% over the past week, indicating positive momentum.
                </Text>
              </Column>
              <Column gap="1">
                <Text size="3" weight="bold">High Engagement</Text>
                <Text size="2" color="muted">
                  Users view an average of {avgPagesPerSession.toFixed(1)} pages per session, showing strong content engagement.
                </Text>
              </Column>
              <Column gap="1">
                <Text size="3" weight="bold">Weekday Focus</Text>
                <Text size="2" color="muted">
                  Traffic peaks during weekdays, suggesting a professional or B2B audience demographic.
                </Text>
              </Column>
            </Grid>
          </Column>
        </Column>
      </Column>
    </PageBody>
  );
}
