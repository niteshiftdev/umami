'use client';
import React from 'react';
import { Column, Row, Grid, Text } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { useMemo } from 'react';
import { useTheme } from '@umami/react-zen';
import { getThemeColors } from '@/lib/colors';
import { format, startOfDay, addHours } from 'date-fns';

export default function HeatmapFocusDashboard() {
  const { theme } = useTheme();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  // Generate realistic weekly traffic heatmap data
  const generateWeeklyData = () => {
    const data: number[][] = [];
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    daysOfWeek.forEach((_, dayIndex) => {
      const dayData: number[] = [];
      const isWeekend = dayIndex === 0 || dayIndex === 6;

      for (let hour = 0; hour < 24; hour++) {
        let baseTraffic;
        // Different traffic patterns for weekday vs weekend
        if (isWeekend) {
          // Weekend pattern: slower morning, peak afternoon
          if (hour < 8) baseTraffic = 10;
          else if (hour < 12) baseTraffic = 40;
          else if (hour < 18) baseTraffic = 60;
          else if (hour < 22) baseTraffic = 45;
          else baseTraffic = 15;
        } else {
          // Weekday pattern: morning rush, lunch, evening peak
          if (hour < 7) baseTraffic = 5;
          else if (hour < 9) baseTraffic = 55;
          else if (hour < 12) baseTraffic = 75;
          else if (hour < 14) baseTraffic = 65;
          else if (hour < 17) baseTraffic = 85;
          else if (hour < 20) baseTraffic = 70;
          else if (hour < 23) baseTraffic = 40;
          else baseTraffic = 10;
        }

        // Add some random variation
        const variance = Math.random() * 0.4 + 0.8; // 80-120% variance
        dayData.push(Math.floor(baseTraffic * variance));
      }
      data.push(dayData);
    });

    return data;
  };

  const weeklyData = useMemo(() => generateWeeklyData(), []);
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calculate max for normalization
  const maxValue = useMemo(() => {
    return Math.max(...weeklyData.flat());
  }, [weeklyData]);

  // Generate monthly trend sparkline data
  const generateMonthlyTrend = () => {
    const data: number[] = [];
    for (let i = 0; i < 30; i++) {
      const baseValue = 200;
      const trend = i * 5; // Upward trend
      const variance = Math.random() * 50 - 25;
      data.push(baseValue + trend + variance);
    }
    return data;
  };

  const monthlyTrend = useMemo(() => generateMonthlyTrend(), []);
  const maxTrend = Math.max(...monthlyTrend);

  return (
    <PageBody>
      <Column gap="4" margin="2">
        <PageHeader title="Dashboard - Heatmap Analytics" />

        {/* Summary Stats */}
        <Grid columns="5" gap="3">
          <Column padding="3" borderRadius="3" backgroundColor border>
            <Column gap="1">
              <Text size="2" color="muted">This Week</Text>
              <Text size="7" weight="bold">12,450</Text>
              <Text size="2" color="muted">total visitors</Text>
            </Column>
          </Column>
          <Column padding="3" borderRadius="3" backgroundColor border>
            <Column gap="1">
              <Text size="2" color="muted">Peak Hour</Text>
              <Text size="7" weight="bold">4 PM</Text>
              <Text size="2" color="muted">285 visitors</Text>
            </Column>
          </Column>
          <Column padding="3" borderRadius="3" backgroundColor border>
            <Column gap="1">
              <Text size="2" color="muted">Best Day</Text>
              <Text size="7" weight="bold">Wed</Text>
              <Text size="2" color="muted">2,140 visitors</Text>
            </Column>
          </Column>
          <Column padding="3" borderRadius="3" backgroundColor border>
            <Column gap="1">
              <Text size="2" color="muted">Avg Daily</Text>
              <Text size="7" weight="bold">1,779</Text>
              <Text size="2" style={{ color: '#44b556' }}>+18% vs last week</Text>
            </Column>
          </Column>
          <Column padding="3" borderRadius="3" backgroundColor border>
            <Column gap="1">
              <Text size="2" color="muted">Engagement</Text>
              <Text size="7" weight="bold">3.2</Text>
              <Text size="2" color="muted">pages/session</Text>
            </Column>
          </Column>
        </Grid>

        {/* Main Heatmap */}
        <Column padding="4" borderRadius="3" backgroundColor border>
          <Column gap="3">
            <Row justifyContent="space-between" alignItems="center">
              <Text size="5" weight="bold">Weekly Traffic Pattern</Text>
              <Row gap="2" alignItems="center">
                <Text size="2" color="muted">Low</Text>
                <Row gap="1">
                  {[0.2, 0.4, 0.6, 0.8, 1.0].map((opacity, i) => (
                    <div
                      key={i}
                      style={{
                        width: '20px',
                        height: '16px',
                        backgroundColor: colors.primary,
                        opacity: opacity,
                        borderRadius: '2px',
                      }}
                    />
                  ))}
                </Row>
                <Text size="2" color="muted">High</Text>
              </Row>
            </Row>

            <div style={{ overflowX: 'auto' }}>
              <Grid columns="25" gap="2" style={{ minWidth: '900px' }}>
                {/* Header row - hours */}
                <div />
                {Array.from({ length: 24 }, (_, i) => (
                  <Text key={i} size="2" color="muted" align="center">
                    {i.toString().padStart(2, '0')}
                  </Text>
                ))}

                {/* Data rows - days */}
                {daysOfWeek.map((day, dayIndex) => (
                  <React.Fragment key={day}>
                    <Row alignItems="center">
                      <Text size="3" weight="bold">{day}</Text>
                    </Row>
                    {weeklyData[dayIndex].map((value, hourIndex) => {
                      const opacity = maxValue > 0 ? value / maxValue : 0;
                      const scale = Math.max(0.3, opacity);
                      return (
                        <div
                          key={hourIndex}
                          style={{
                            width: '100%',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                          }}
                          title={`${day} ${hourIndex}:00 - ${value} visitors`}
                        >
                          <div
                            style={{
                              width: '28px',
                              height: '28px',
                              backgroundColor: colors.primary,
                              opacity: Math.max(0.1, opacity),
                              borderRadius: '4px',
                              transform: `scale(${scale})`,
                              transition: 'all 0.2s ease',
                              cursor: 'pointer',
                            }}
                          />
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </Grid>
            </div>
          </Column>
        </Column>

        {/* Bottom Row */}
        <Grid columns="2" gap="3">
          {/* Monthly Trend */}
          <Column padding="3" borderRadius="3" backgroundColor border>
            <Column gap="3">
              <Row justifyContent="space-between" alignItems="center">
                <Text size="4" weight="bold">30-Day Trend</Text>
                <Text size="2" style={{ color: '#44b556' }}>↑ 28.5%</Text>
              </Row>
              <div style={{ height: '120px', position: 'relative' }}>
                <svg width="100%" height="100%" style={{ display: 'block' }}>
                  <polyline
                    points={monthlyTrend.map((value, i) => {
                      const x = (i / (monthlyTrend.length - 1)) * 100;
                      const y = 100 - ((value / maxTrend) * 90);
                      return `${x}%,${y}%`;
                    }).join(' ')}
                    fill="none"
                    stroke={colors.primary}
                    strokeWidth="2"
                    style={{ vectorEffect: 'non-scaling-stroke' }}
                  />
                  <polygon
                    points={`0,100% ${monthlyTrend.map((value, i) => {
                      const x = (i / (monthlyTrend.length - 1)) * 100;
                      const y = 100 - ((value / maxTrend) * 90);
                      return `${x}%,${y}%`;
                    }).join(' ')} 100%,100%`}
                    fill={colors.primary}
                    opacity="0.1"
                  />
                </svg>
              </div>
              <Row justifyContent="space-between">
                <Text size="2" color="muted">30 days ago</Text>
                <Text size="2" color="muted">Today</Text>
              </Row>
            </Column>
          </Column>

          {/* Top Locations */}
          <Column padding="3" borderRadius="3" backgroundColor border>
            <Column gap="3">
              <Text size="4" weight="bold">Top Locations (This Week)</Text>
              <Column gap="2">
                {[
                  { country: 'United States', count: 4250, flag: '🇺🇸' },
                  { country: 'United Kingdom', count: 2180, flag: '🇬🇧' },
                  { country: 'Canada', count: 1840, flag: '🇨🇦' },
                  { country: 'Germany', count: 1520, flag: '🇩🇪' },
                  { country: 'France', count: 1340, flag: '🇫🇷' },
                ].map((loc, i) => (
                  <Row key={i} justifyContent="space-between" alignItems="center">
                    <Row gap="2" alignItems="center">
                      <Text size="4">{loc.flag}</Text>
                      <Text size="3">{loc.country}</Text>
                    </Row>
                    <Row gap="3" alignItems="center">
                      <div style={{
                        width: '120px',
                        height: '6px',
                        backgroundColor: colors.base[3],
                        borderRadius: '3px',
                        overflow: 'hidden',
                      }}>
                        <div style={{
                          width: `${(loc.count / 4250) * 100}%`,
                          height: '100%',
                          backgroundColor: colors.primary,
                        }} />
                      </div>
                      <Text size="3" weight="bold" style={{ minWidth: '60px', textAlign: 'right' }}>
                        {loc.count.toLocaleString()}
                      </Text>
                    </Row>
                  </Row>
                ))}
              </Column>
            </Column>
          </Column>
        </Grid>
      </Column>
    </PageBody>
  );
}
