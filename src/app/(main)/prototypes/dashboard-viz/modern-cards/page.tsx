'use client';
import { Column, Row, Grid, Text } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { PageviewsChart } from '@/components/metrics/PageviewsChart';
import { PieChart } from '@/components/charts/PieChart';
import { BarChart } from '@/components/charts/BarChart';
import { useMemo } from 'react';
import { useTheme } from '@umami/react-zen';
import { getThemeColors } from '@/lib/colors';
import { CHART_COLORS } from '@/lib/constants';

export default function ModernCardsDashboard() {
  const { theme } = useTheme();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  // Generate realistic sample data for the past 7 days
  const generatePageviewData = () => {
    const now = new Date();
    const sessions = [];
    const pageviews = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const timestamp = date.getTime();

      // Generate realistic traffic patterns with weekday/weekend variation
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const baseTraffic = isWeekend ? 150 : 300;
      const variance = Math.random() * 0.3 + 0.85; // 85-115% variation

      const sessionCount = Math.floor(baseTraffic * variance);
      const pageviewCount = Math.floor(sessionCount * (2 + Math.random())); // 2-3 pages per session

      sessions.push({ x: timestamp, y: sessionCount });
      pageviews.push({ x: timestamp, y: pageviewCount });
    }

    return { sessions, pageviews };
  };

  // Traffic source distribution
  const trafficSourceData = {
    __id: Date.now(),
    labels: ['Direct', 'Search Engines', 'Social Media', 'Referrals', 'Email'],
    datasets: [{
      label: 'Traffic Sources',
      data: [35, 28, 18, 12, 7],
      backgroundColor: CHART_COLORS.slice(0, 5),
      borderWidth: 2,
      borderColor: colors.chart.line.borderColor,
    }],
  };

  // Top pages data
  const topPagesData = {
    __id: Date.now() + 1,
    labels: ['/home', '/products', '/about', '/blog', '/contact'],
    datasets: [{
      label: 'Page Views',
      data: [1250, 890, 645, 520, 380],
      ...colors.chart.views,
      borderWidth: 1,
    }],
  };

  // Device breakdown
  const deviceData = {
    __id: Date.now() + 2,
    labels: ['Desktop', 'Mobile', 'Tablet'],
    datasets: [{
      label: 'Devices',
      data: [52, 38, 10],
      backgroundColor: [CHART_COLORS[0], CHART_COLORS[1], CHART_COLORS[2]],
      borderWidth: 2,
      borderColor: colors.chart.line.borderColor,
    }],
  };

  // Browser breakdown
  const browserData = {
    __id: Date.now() + 3,
    labels: ['Chrome', 'Safari', 'Firefox', 'Edge', 'Other'],
    datasets: [{
      label: 'Browsers',
      data: [45, 25, 15, 10, 5],
      ...colors.chart.visitors,
      borderWidth: 1,
    }],
  };

  const pageviewData = useMemo(() => generatePageviewData(), []);
  const minDate = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);
  const maxDate = new Date();

  return (
    <PageBody>
      <Column gap="4" margin="2">
        <PageHeader title="Dashboard - Modern Cards" />

        {/* Key Metrics Cards */}
        <Grid columns="4" gap="3">
          <Column padding="3" borderRadius="3" backgroundColor border>
            <Column gap="1">
              <Text size="2" color="muted">Total Visitors</Text>
              <Text size="8" weight="bold">1,847</Text>
              <Text size="2" style={{ color: '#44b556' }}>+12.5% from last week</Text>
            </Column>
          </Column>
          <Column padding="3" borderRadius="3" backgroundColor border>
            <Column gap="1">
              <Text size="2" color="muted">Page Views</Text>
              <Text size="8" weight="bold">4,392</Text>
              <Text size="2" style={{ color: '#44b556' }}>+8.3% from last week</Text>
            </Column>
          </Column>
          <Column padding="3" borderRadius="3" backgroundColor border>
            <Column gap="1">
              <Text size="2" color="muted">Avg. Session</Text>
              <Text size="8" weight="bold">2m 34s</Text>
              <Text size="2" style={{ color: '#e68619' }}>-3.2% from last week</Text>
            </Column>
          </Column>
          <Column padding="3" borderRadius="3" backgroundColor border>
            <Column gap="1">
              <Text size="2" color="muted">Bounce Rate</Text>
              <Text size="8" weight="bold">42.8%</Text>
              <Text size="2" style={{ color: '#44b556' }}>-5.1% from last week</Text>
            </Column>
          </Column>
        </Grid>

        {/* Main Chart */}
        <Column padding="3" borderRadius="3" backgroundColor border>
          <Column gap="2">
            <Text size="4" weight="bold">Traffic Overview (Last 7 Days)</Text>
            <PageviewsChart
              data={pageviewData}
              unit="day"
              minDate={minDate}
              maxDate={maxDate}
            />
          </Column>
        </Column>

        {/* Two Column Grid */}
        <Grid columns="2" gap="3">
          <Column padding="3" borderRadius="3" backgroundColor border>
            <Column gap="2">
              <Text size="4" weight="bold">Traffic Sources</Text>
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '100%', maxWidth: '300px' }}>
                  <PieChart chartData={trafficSourceData} type="doughnut" />
                </div>
              </div>
            </Column>
          </Column>

          <Column padding="3" borderRadius="3" backgroundColor border>
            <Column gap="2">
              <Text size="4" weight="bold">Top Pages</Text>
              <div style={{ height: '300px' }}>
                <BarChart
                  chartData={topPagesData}
                  height="300px"
                />
              </div>
            </Column>
          </Column>
        </Grid>

        {/* Three Column Grid */}
        <Grid columns="3" gap="3">
          <Column padding="3" borderRadius="3" backgroundColor border>
            <Column gap="2">
              <Text size="4" weight="bold">Devices</Text>
              <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '100%', maxWidth: '220px' }}>
                  <PieChart chartData={deviceData} type="pie" />
                </div>
              </div>
            </Column>
          </Column>

          <Column padding="3" borderRadius="3" backgroundColor border>
            <Column gap="2">
              <Text size="4" weight="bold">Browsers</Text>
              <div style={{ height: '250px' }}>
                <BarChart
                  chartData={browserData}
                  height="250px"
                />
              </div>
            </Column>
          </Column>

          <Column padding="3" borderRadius="3" backgroundColor border style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Column gap="3" alignItems="center">
              <Text size="6" weight="bold" align="center">Performance</Text>
              <div style={{ position: 'relative', width: '120px', height: '120px' }}>
                <svg viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke={colors.base[3]}
                    strokeWidth="10"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#44b556"
                    strokeWidth="10"
                    strokeDasharray={`${2 * Math.PI * 50 * 0.87} ${2 * Math.PI * 50}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center'
                }}>
                  <Text size="8" weight="bold">87</Text>
                </div>
              </div>
              <Text size="3" color="muted" align="center">Site Health Score</Text>
            </Column>
          </Column>
        </Grid>
      </Column>
    </PageBody>
  );
}
