'use client';

import { Column, Row, Text, Box, useTheme } from '@umami/react-zen';
import { useSpring, animated, useTrail, config } from '@react-spring/web';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRealtimeQuery } from '@/components/hooks/queries/useRealtimeQuery';
import { useCountryNames, useMessages } from '@/components/hooks';
import { useLocale } from '@/components/hooks/useLocale';
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from 'react-simple-maps';
import { getThemeColors } from '@/lib/colors';
import { ISO_COUNTRIES, MAP_FILE, BROWSERS } from '@/lib/constants';
import { formatNumber } from '@/lib/format';
import styles from './LivePulsePage.module.css';

interface ActivityEvent {
  __type: string;
  sessionId: string;
  eventName?: string;
  createdAt: string;
  browser: string;
  os: string;
  device: string;
  country: string;
  urlPath: string;
  referrerDomain?: string;
}

interface PulsePoint {
  id: string;
  country: string;
  coordinates: [number, number];
  timestamp: number;
}

// Country coordinates for map markers
const COUNTRY_COORDS: Record<string, [number, number]> = {
  US: [-95.7, 37.1],
  GB: [-3.4, 55.4],
  DE: [10.4, 51.2],
  FR: [2.2, 46.2],
  JP: [138.3, 36.2],
  CN: [104.2, 35.9],
  IN: [78.9, 20.6],
  BR: [-51.9, -14.2],
  CA: [-106.3, 56.1],
  AU: [133.8, -25.3],
  RU: [105.3, 61.5],
  KR: [127.8, 35.9],
  MX: [-102.5, 23.6],
  ES: [-3.7, 40.5],
  IT: [12.6, 41.9],
  NL: [5.3, 52.1],
  PL: [19.1, 51.9],
  SE: [18.6, 60.1],
  CH: [8.2, 46.8],
  AR: [-63.6, -38.4],
  ZA: [22.9, -30.6],
  SG: [103.8, 1.4],
  AE: [53.8, 23.4],
  TH: [100.5, 15.9],
  VN: [108.3, 14.1],
  PH: [121.8, 12.9],
  MY: [101.9, 4.2],
  ID: [113.9, -0.8],
  TR: [35.2, 38.9],
  SA: [45.1, 23.9],
  EG: [30.8, 26.8],
  NG: [8.7, 9.1],
  KE: [37.9, -0.0],
  PK: [69.3, 30.4],
  BD: [90.4, 23.7],
  UA: [31.2, 48.4],
  RO: [24.9, 45.9],
  CZ: [15.5, 49.8],
  PT: [-8.2, 39.4],
  GR: [21.8, 39.1],
  HU: [19.5, 47.2],
  AT: [14.6, 47.5],
  BE: [4.5, 50.5],
  IE: [-8.2, 53.4],
  FI: [25.7, 61.9],
  NO: [8.5, 60.5],
  DK: [9.5, 56.3],
  NZ: [174.9, -40.9],
  CL: [-71.5, -35.7],
  CO: [-74.3, 4.6],
  PE: [-75.0, -9.2],
};

const getDeviceIcon = (device: string) => {
  switch (device?.toLowerCase()) {
    case 'mobile':
      return '📱';
    case 'tablet':
      return '📲';
    default:
      return '💻';
  }
};

const getEventIcon = (type: string) => {
  switch (type) {
    case 'session':
      return '👋';
    case 'event':
      return '⚡';
    default:
      return '👁';
  }
};

const getBrowserName = (browser: string) => {
  return BROWSERS[browser as keyof typeof BROWSERS] || browser || 'Unknown';
};

function AnimatedMetric({
  value,
  label,
  color,
  delay = 0,
}: {
  value: number;
  label: string;
  color: string;
  delay?: number;
}) {
  const props = useSpring({
    from: { number: 0, opacity: 0, scale: 0.8 },
    to: { number: value, opacity: 1, scale: 1 },
    delay,
    config: config.gentle,
  });

  return (
    <Column alignItems="center" gap="2" className={styles.metricCard}>
      <animated.div
        style={{
          opacity: props.opacity,
          transform: props.scale.to(s => `scale(${s})`),
        }}
      >
        <Text size="9" weight="bold" style={{ color }}>
          <animated.span>{props.number.to(n => formatNumber(Math.floor(n)))}</animated.span>
        </Text>
      </animated.div>
      <Text size="2" style={{ opacity: 0.7 }}>
        {label}
      </Text>
    </Column>
  );
}

function ActivityItem({
  event,
  countryNames,
  index,
}: {
  event: ActivityEvent;
  countryNames: Record<string, string>;
  index: number;
}) {
  const props = useSpring({
    from: { opacity: 0, x: -50 },
    to: { opacity: 1, x: 0 },
    delay: index * 50,
    config: config.gentle,
  });

  const timeAgo = useMemo(() => {
    const seconds = Math.floor((Date.now() - new Date(event.createdAt).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  }, [event.createdAt]);

  return (
    <animated.div style={props} className={styles.activityItem}>
      <Row alignItems="center" gap="3">
        <Box className={styles.eventIcon}>{getEventIcon(event.__type)}</Box>
        <Column gap="1" style={{ flex: 1, minWidth: 0 }}>
          <Row alignItems="center" gap="2">
            <Text size="2" weight="medium" className={styles.truncate}>
              {event.urlPath || '/'}
            </Text>
            {event.eventName && (
              <Box className={styles.eventBadge}>
                <Text size="1">{event.eventName}</Text>
              </Box>
            )}
          </Row>
          <Row alignItems="center" gap="2">
            <Text size="1" style={{ opacity: 0.6 }}>
              {getDeviceIcon(event.device)} {getBrowserName(event.browser)}
            </Text>
            <Text size="1" style={{ opacity: 0.6 }}>
              •
            </Text>
            <Text size="1" style={{ opacity: 0.6 }}>
              {countryNames[event.country] || event.country || 'Unknown'}
            </Text>
          </Row>
        </Column>
        <Text size="1" style={{ opacity: 0.5 }}>
          {timeAgo}
        </Text>
      </Row>
    </animated.div>
  );
}

function PulseMarker({ point, onComplete }: { point: PulsePoint; onComplete: () => void }) {
  const props = useSpring({
    from: { scale: 0, opacity: 1 },
    to: { scale: 3, opacity: 0 },
    config: { duration: 2000 },
    onRest: onComplete,
  });

  return (
    <Marker coordinates={point.coordinates}>
      <animated.circle
        r={8}
        fill="none"
        stroke="#2680eb"
        strokeWidth={2}
        style={{
          transform: props.scale.to(s => `scale(${s})`),
          opacity: props.opacity,
        }}
      />
      <circle r={4} fill="#2680eb" />
    </Marker>
  );
}

function LiveGlobe({
  countries,
  pulsePoints,
  onPulseComplete,
}: {
  countries: Record<string, number>;
  pulsePoints: PulsePoint[];
  onPulseComplete: (id: string) => void;
}) {
  const { theme } = useTheme();
  const { colors } = getThemeColors(theme);

  const getFillColor = useCallback(
    (code: string) => {
      if (code === 'AQ') return 'transparent';
      const count = countries[code] || 0;
      if (count === 0) return colors.map.fillColor;
      const intensity = Math.min(count / 10, 1);
      return `rgba(38, 128, 235, ${0.2 + intensity * 0.6})`;
    },
    [countries, colors.map.fillColor],
  );

  return (
    <Box className={styles.globeContainer}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 120 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ZoomableGroup zoom={1} center={[0, 20]}>
          <Geographies geography={`${process.env.basePath || ''}${MAP_FILE}`}>
            {({ geographies }) =>
              geographies.map(geo => {
                const code = ISO_COUNTRIES[geo.id as keyof typeof ISO_COUNTRIES];
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getFillColor(code)}
                    stroke={colors.map.strokeColor}
                    strokeWidth={0.5}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none', fill: colors.map.hoverColor },
                      pressed: { outline: 'none' },
                    }}
                  />
                );
              })
            }
          </Geographies>
          {pulsePoints.map(point => (
            <PulseMarker
              key={point.id}
              point={point}
              onComplete={() => onPulseComplete(point.id)}
            />
          ))}
        </ZoomableGroup>
      </ComposableMap>
    </Box>
  );
}

function LiveIndicator() {
  const props = useSpring({
    from: { opacity: 0.4, scale: 1 },
    to: async next => {
      while (true) {
        await next({ opacity: 1, scale: 1.2 });
        await next({ opacity: 0.4, scale: 1 });
      }
    },
    config: { duration: 1000 },
  });

  return (
    <Row alignItems="center" gap="2">
      <animated.div
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          backgroundColor: '#22c55e',
          opacity: props.opacity,
          transform: props.scale.to(s => `scale(${s})`),
        }}
      />
      <Text size="2" weight="medium" style={{ color: '#22c55e' }}>
        LIVE
      </Text>
    </Row>
  );
}

function TopCountries({
  countries,
  countryNames,
}: {
  countries: Record<string, number>;
  countryNames: Record<string, string>;
}) {
  const sorted = useMemo(() => {
    return Object.entries(countries)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  }, [countries]);

  const maxValue = sorted[0]?.[1] || 1;

  const trail = useTrail(sorted.length, {
    from: { opacity: 0, width: '0%' },
    to: { opacity: 1, width: '100%' },
    config: config.gentle,
  });

  return (
    <Column gap="3" className={styles.topCountries}>
      <Text size="2" weight="bold" style={{ opacity: 0.7 }}>
        TOP LOCATIONS
      </Text>
      {trail.map((props, index) => {
        const [code, count] = sorted[index];
        const percentage = (count / maxValue) * 100;
        return (
          <animated.div key={code} style={{ opacity: props.opacity }}>
            <Row alignItems="center" gap="3">
              <Text size="2" style={{ width: 120 }}>
                {countryNames[code] || code}
              </Text>
              <Box style={{ flex: 1, position: 'relative', height: 8 }}>
                <Box className={styles.barBackground} />
                <animated.div
                  className={styles.barFill}
                  style={{
                    width: props.width.to(w => `${(percentage * parseFloat(w)) / 100}%`),
                  }}
                />
              </Box>
              <Text size="1" weight="medium" style={{ width: 30, textAlign: 'right' }}>
                {count}
              </Text>
            </Row>
          </animated.div>
        );
      })}
    </Column>
  );
}

export function LivePulsePage({ websiteId }: { websiteId: string }) {
  const { data, isLoading } = useRealtimeQuery(websiteId);
  const { locale } = useLocale();
  const { countryNames } = useCountryNames(locale);
  const { formatMessage, labels } = useMessages();
  const [pulsePoints, setPulsePoints] = useState<PulsePoint[]>([]);
  const [prevEvents, setPrevEvents] = useState<ActivityEvent[]>([]);

  // Generate pulse points for new visitors
  useEffect(() => {
    if (!data?.events) return;

    const newEvents = data.events.filter(
      (e: ActivityEvent) =>
        e.__type === 'session' && !prevEvents.some(p => p.sessionId === e.sessionId),
    );

    if (newEvents.length > 0) {
      const newPulses = newEvents
        .filter((e: ActivityEvent) => e.country && COUNTRY_COORDS[e.country])
        .map((e: ActivityEvent) => ({
          id: `${e.sessionId}-${Date.now()}`,
          country: e.country,
          coordinates: COUNTRY_COORDS[e.country],
          timestamp: Date.now(),
        }));

      setPulsePoints(prev => [...prev, ...newPulses]);
    }

    setPrevEvents(data.events);
  }, [data?.events, prevEvents]);

  const handlePulseComplete = useCallback((id: string) => {
    setPulsePoints(prev => prev.filter(p => p.id !== id));
  }, []);

  const headerProps = useSpring({
    from: { opacity: 0, y: -20 },
    to: { opacity: 1, y: 0 },
    config: config.gentle,
  });

  if (isLoading) {
    return (
      <Column
        alignItems="center"
        justifyContent="center"
        style={{ height: '100vh' }}
        className={styles.container}
      >
        <div className={styles.loader} />
        <Text size="3" style={{ marginTop: 16 }}>
          Loading real-time data...
        </Text>
      </Column>
    );
  }

  const events = (data?.events || []).slice(0, 15);
  const totals = data?.totals || { views: 0, visitors: 0, events: 0, countries: 0 };
  const countries = data?.countries || {};

  return (
    <Column className={styles.container} gap="6">
      <animated.div style={headerProps}>
        <Row alignItems="center" justifyContent="space-between" style={{ marginBottom: 8 }}>
          <Column gap="1">
            <Text size="6" weight="bold">
              Live Pulse
            </Text>
            <Text size="2" style={{ opacity: 0.6 }}>
              Real-time activity visualization
            </Text>
          </Column>
          <LiveIndicator />
        </Row>
      </animated.div>

      {/* Metrics Row */}
      <Row gap="4" className={styles.metricsRow}>
        <AnimatedMetric
          value={totals.visitors}
          label={formatMessage(labels.visitors)}
          color="#2680eb"
          delay={0}
        />
        <AnimatedMetric
          value={totals.views}
          label={formatMessage(labels.views)}
          color="#9256d9"
          delay={100}
        />
        <AnimatedMetric
          value={totals.events}
          label={formatMessage(labels.events)}
          color="#44b556"
          delay={200}
        />
        <AnimatedMetric
          value={totals.countries}
          label={formatMessage(labels.countries)}
          color="#e68619"
          delay={300}
        />
      </Row>

      {/* Main Content */}
      <Row gap="6" className={styles.mainContent}>
        {/* Globe */}
        <Column style={{ flex: 2 }} gap="4">
          <LiveGlobe
            countries={countries}
            pulsePoints={pulsePoints}
            onPulseComplete={handlePulseComplete}
          />
          <TopCountries countries={countries} countryNames={countryNames} />
        </Column>

        {/* Activity Feed */}
        <Column style={{ flex: 1 }} gap="3" className={styles.activityFeed}>
          <Row alignItems="center" justifyContent="space-between">
            <Text size="2" weight="bold" style={{ opacity: 0.7 }}>
              LIVE ACTIVITY
            </Text>
            <Text size="1" style={{ opacity: 0.5 }}>
              Last 30 minutes
            </Text>
          </Row>
          <Column gap="2" className={styles.activityList}>
            {events.length === 0 ? (
              <Column alignItems="center" justifyContent="center" style={{ padding: 40 }}>
                <Text size="3" style={{ opacity: 0.5 }}>
                  Waiting for activity...
                </Text>
              </Column>
            ) : (
              events.map((event: ActivityEvent, index: number) => (
                <ActivityItem
                  key={`${event.sessionId}-${event.createdAt}-${index}`}
                  event={event}
                  countryNames={countryNames}
                  index={index}
                />
              ))
            )}
          </Column>
        </Column>
      </Row>
    </Column>
  );
}
