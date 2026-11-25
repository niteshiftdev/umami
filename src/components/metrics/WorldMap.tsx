import { Column, type ColumnProps, FloatingTooltip, useTheme } from '@umami/react-zen';
import { colord } from 'colord';
import { type KeyboardEvent, type SyntheticEvent, useMemo, useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import {
  useCountryNames,
  useLocale,
  useMessages,
  useNavigation,
  useWebsiteMetricsQuery,
} from '@/components/hooks';
import { getThemeColors } from '@/lib/colors';
import { ISO_COUNTRIES, MAP_FILE } from '@/lib/constants';
import { percentFilter } from '@/lib/filters';
import { formatLongNumber } from '@/lib/format';

const HIDDEN_CODE = 'AQ';
const SELECTED_STROKE_WIDTH = 1.5;

export interface WorldMapProps extends ColumnProps {
  websiteId?: string;
  data?: any[];
}

// Reads the ISO country code stamped on each <Geography> path, so a single set of
// delegated handlers can serve every country instead of one closure per path.
function getEventCode(e: SyntheticEvent): string | undefined {
  const code = (e.target as Element)?.getAttribute?.('data-code');
  return code && code !== HIDDEN_CODE ? code : undefined;
}

export function WorldMap({ websiteId, data, ...props }: WorldMapProps) {
  const { theme } = useTheme();
  const { locale } = useLocale();
  const { countryNames } = useCountryNames(locale);
  const {
    router,
    updateParams,
    query: { country: countryFilter },
  } = useNavigation();
  const canFilter = !!websiteId;
  const selectedCode = countryFilter?.startsWith('eq.') ? countryFilter.slice(3) : undefined;

  const { data: mapData } = useWebsiteMetricsQuery(websiteId, {
    type: 'country',
  });

  const metrics = useMemo(() => {
    const rows = data || mapData;
    return new Map<string, { y: number; z: number }>(
      rows ? percentFilter(rows as any[]).map(row => [row.x, row]) : [],
    );
  }, [data, mapData]);

  // Memoized so hover changes in MapInteractionLayer never re-render the ~180 country paths;
  // it only rebuilds when data, theme, locale or the selected country change.
  const map = useMemo(() => {
    const { colors } = getThemeColors(theme);
    const adjust = theme === 'light' ? 'lighten' : 'darken';
    const staticStyle = {
      default: { outline: 'none' },
      hover: { outline: 'none', fill: colors.map.hoverColor },
      pressed: { outline: 'none' },
    };
    const interactiveStyle = {
      default: { ...staticStyle.default, cursor: 'pointer' },
      hover: { ...staticStyle.hover, cursor: 'pointer' },
      pressed: staticStyle.pressed,
    };

    const getFillColor = (code: string) => {
      const country = metrics.get(code);

      if (!country) {
        return colors.map.fillColor;
      }

      return colord(colors.map.baseColor)
        [adjust](0.4 * (1.0 - country.z / 100))
        .toHex();
    };

    return (
      <ComposableMap projection="geoMercator">
        <ZoomableGroup zoom={0.8} minZoom={0.7} center={[0, 40]}>
          <Geographies geography={`${process.env.basePath || ''}${MAP_FILE}`}>
            {({ geographies }) =>
              geographies.map(geo => {
                const code = ISO_COUNTRIES[geo.id];
                const hidden = code === HIDDEN_CODE;
                const selected = code === selectedCode;
                const interactive = canFilter && !!code && !hidden;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    data-code={code}
                    aria-label={countryNames[code]}
                    role={interactive ? 'button' : undefined}
                    aria-pressed={interactive ? selected : undefined}
                    fill={hidden ? undefined : getFillColor(code)}
                    stroke={colors.map.strokeColor}
                    strokeWidth={selected ? SELECTED_STROKE_WIDTH : undefined}
                    opacity={hidden ? 0 : 1}
                    style={interactive ? interactiveStyle : staticStyle}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    );
  }, [theme, metrics, selectedCode, canFilter, countryNames]);

  const toggleFilter = (code: string) => {
    router.replace(updateParams({ country: code === selectedCode ? undefined : `eq.${code}` }), {
      scroll: false,
    });
  };

  return (
    <MapInteractionLayer
      {...props}
      metrics={metrics}
      countryNames={countryNames}
      onSelectCountry={canFilter ? toggleFilter : undefined}
    >
      {map}
    </MapInteractionLayer>
  );
}

interface MapInteractionLayerProps extends ColumnProps {
  metrics: Map<string, { y: number }>;
  countryNames: Record<string, string>;
  onSelectCountry?: (code: string) => void;
}

// Owns hover/tooltip state so hovering re-renders only this layer and the tooltip. The map
// itself is passed in as a stable `children` element and is skipped by React on hover.
function MapInteractionLayer({
  metrics,
  countryNames,
  onSelectCountry,
  children,
  ...props
}: MapInteractionLayerProps) {
  const [hoveredCode, setHoveredCode] = useState<string>();
  const { locale } = useLocale();
  const { formatMessage, labels } = useMessages();

  const handleClick = (e: SyntheticEvent) => {
    const code = getEventCode(e);
    if (onSelectCountry && code) onSelectCountry(code);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const code = getEventCode(e);
    if (onSelectCountry && code) {
      e.preventDefault();
      onSelectCountry(code);
    }
  };

  const handleHover = (e: SyntheticEvent) => setHoveredCode(getEventCode(e));
  const clearHover = () => setHoveredCode(undefined);

  const tooltip =
    hoveredCode &&
    `${countryNames[hoveredCode] || formatMessage(labels.unknown)}: ${formatLongNumber(
      metrics.get(hoveredCode)?.y || 0,
    )} ${formatMessage(labels.visitors).toLocaleLowerCase(locale)}`;

  return (
    <Column
      {...props}
      data-tip=""
      data-for="world-map-tooltip"
      style={{ margin: 'auto 0', overflow: 'hidden' }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseOver={handleHover}
      onMouseLeave={clearHover}
      onFocus={handleHover}
      onBlur={clearHover}
    >
      {children}
      {tooltip && <FloatingTooltip>{tooltip}</FloatingTooltip>}
    </Column>
  );
}
