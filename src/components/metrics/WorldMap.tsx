import { Column, type ColumnProps, FloatingTooltip, useTheme } from '@umami/react-zen';
import { colord } from 'colord';
import {
  memo,
  type Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
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

const GEOGRAPHY_URL = `${process.env.basePath || ''}${MAP_FILE}`;
const MAP_CENTER: [number, number] = [0, 40];

type MapColors = ReturnType<typeof getThemeColors>['colors']['map'];
type CountryMetrics = Map<string, { visitors: number; fill: string }>;
type TooltipHandle = { show: (text: string | null) => void };

export interface WorldMapProps extends ColumnProps {
  websiteId?: string;
  data?: any[];
  allowFilter?: boolean;
}

export function WorldMap({ websiteId, data, allowFilter = !!websiteId, ...props }: WorldMapProps) {
  const tooltipRef = useRef<TooltipHandle>(null);
  const { theme } = useTheme();
  const mapColors = useMemo(() => getThemeColors(theme).colors.map, [theme]);
  const { locale } = useLocale();
  const { formatMessage, labels } = useMessages();
  const { countryNames } = useCountryNames(locale);
  const { router, query, updateParams } = useNavigation();
  const visitorsLabel = formatMessage(labels.visitors).toLocaleLowerCase(locale);
  const unknownLabel = formatMessage(labels.unknown);

  const { data: mapData } = useWebsiteMetricsQuery(websiteId, {
    type: 'country',
  });

  // Country code -> visitors + fill, computed once per data/theme change instead of
  // a linear scan + color conversion for every country on every render.
  const countries: CountryMetrics = useMemo(() => {
    const rows = data || mapData ? percentFilter((data || mapData) as any[]) : [];
    const map: CountryMetrics = new Map();
    for (const { x, y, z } of rows) {
      if (map.has(x)) continue;
      map.set(x, {
        visitors: y,
        fill: colord(mapColors.baseColor)
          [theme === 'light' ? 'lighten' : 'darken'](0.4 * (1.0 - z / 100))
          .toHex(),
      });
    }
    return map;
  }, [data, mapData, mapColors, theme]);

  const handleHover = useCallback(
    (code: string) => {
      if (code === 'AQ') return;
      tooltipRef.current?.show(
        `${countryNames[code] || unknownLabel}: ${formatLongNumber(
          countries.get(code)?.visitors || 0,
        )} ${visitorsLabel}`,
      );
    },
    [countries, countryNames, unknownLabel, visitorsLabel],
  );

  const handleLeave = useCallback(() => tooltipRef.current?.show(null), []);

  // Navigation helpers change identity on every render; read the latest through a ref so the
  // memoized map below doesn't re-render because of them.
  const filterRef = useRef<(code: string) => void>(null);
  useEffect(() => {
    filterRef.current = (code: string) => {
      const value = `eq.${code}`;
      router.replace(updateParams({ country: query.country === value ? undefined : value }));
    };
  });
  const handleClick = useCallback((code: string) => filterRef.current?.(code), []);

  return (
    <Column
      {...props}
      data-tip=""
      data-for="world-map-tooltip"
      style={{ margin: 'auto 0', overflow: 'hidden' }}
    >
      <MapCountries
        countries={countries}
        colors={mapColors}
        allowFilter={allowFilter}
        onHover={handleHover}
        onLeave={handleLeave}
        onClick={handleClick}
      />
      <MapTooltip ref={tooltipRef} />
    </Column>
  );
}

// Owns the hover text so showing/hiding it re-renders only the tooltip, not WorldMap
// (whose data/date/navigation hooks are comparatively expensive to re-run on every hover).
function MapTooltip({ ref }: { ref: Ref<TooltipHandle> }) {
  const [text, setText] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({ show: setText }), []);

  return text ? <FloatingTooltip>{text}</FloatingTooltip> : null;
}

// Memoized so the ~180 country paths only re-render when country data or theme changes.
const MapCountries = memo(function MapCountries({
  countries,
  colors,
  allowFilter,
  onHover,
  onLeave,
  onClick,
}: {
  countries: CountryMetrics;
  colors: MapColors;
  allowFilter: boolean;
  onHover: (code: string) => void;
  onLeave: () => void;
  onClick: (code: string) => void;
}) {
  const styles = useMemo(() => {
    const plain = { outline: 'none' };
    const hover = { outline: 'none', fill: colors.hoverColor };
    return {
      static: { default: plain, hover, pressed: plain },
      clickable: { default: plain, hover: { ...hover, cursor: 'pointer' }, pressed: plain },
    };
  }, [colors]);

  return (
    <ComposableMap projection="geoMercator">
      <ZoomableGroup zoom={0.8} minZoom={0.7} center={MAP_CENTER}>
        <Geographies geography={GEOGRAPHY_URL}>
          {({ geographies }) =>
            geographies.map(geo => {
              const code = ISO_COUNTRIES[geo.id];
              const isHidden = code === 'AQ';
              const country = countries.get(code);
              const isClickable = allowFilter && !isHidden && !!country;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={isHidden ? undefined : country?.fill || colors.fillColor}
                  stroke={colors.strokeColor}
                  opacity={isHidden ? 0 : 1}
                  style={isClickable ? styles.clickable : styles.static}
                  onClick={isClickable ? () => onClick(code) : undefined}
                  onMouseOver={() => onHover(code)}
                  onMouseOut={onLeave}
                />
              );
            })
          }
        </Geographies>
      </ZoomableGroup>
    </ComposableMap>
  );
});
