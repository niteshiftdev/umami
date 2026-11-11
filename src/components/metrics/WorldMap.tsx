import { Column, type ColumnProps, FloatingTooltip, useTheme } from '@umami/react-zen';
import { colord } from 'colord';
import { useMemo, useRef, useState } from 'react';
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

export interface WorldMapProps extends ColumnProps {
  websiteId?: string;
  data?: any[];
}

export function WorldMap({ websiteId, data, ...props }: WorldMapProps) {
  const [tooltip, setTooltipPopup] = useState();
  const { theme } = useTheme();
  const { colors } = getThemeColors(theme);
  const { locale } = useLocale();
  const { formatMessage, labels } = useMessages();
  const { countryNames } = useCountryNames(locale);
  const { router, updateParams, query } = useNavigation();
  const canFilter = !!websiteId;
  const pointerDown = useRef<{ x: number; y: number } | null>(null);
  const visitorsLabel = formatMessage(labels.visitors).toLocaleLowerCase(locale);
  const unknownLabel = formatMessage(labels.unknown);

  const { data: mapData } = useWebsiteMetricsQuery(websiteId, {
    type: 'country',
  });

  const metrics = useMemo(
    () => (data || mapData ? percentFilter((data || mapData) as any[]) : []),
    [data, mapData],
  );

  const getFillColor = (code: string) => {
    if (code === 'AQ') return;
    const country = metrics?.find(({ x }) => x === code);

    if (!country) {
      return colors.map.fillColor;
    }

    return colord(colors.map.baseColor)
      [theme === 'light' ? 'lighten' : 'darken'](0.4 * (1.0 - country.z / 100))
      .toHex();
  };

  const getOpacity = (code: string) => {
    return code === 'AQ' ? 0 : 1;
  };

  const handleHover = (code: string) => {
    if (code === 'AQ') return;
    const country = metrics?.find(({ x }) => x === code);
    setTooltipPopup(
      `${countryNames[code] || unknownLabel}: ${formatLongNumber(
        country?.y || 0,
      )} ${visitorsLabel}` as any,
    );
  };

  const isFilterable = (code: string) => canFilter && !!code && code !== 'AQ';

  const handleMouseDown = (e: React.MouseEvent) => {
    pointerDown.current = { x: e.clientX, y: e.clientY };
  };

  const handleClick = (code: string, e: React.MouseEvent) => {
    if (!isFilterable(code)) return;
    // Ignore clicks that end a map pan (drag).
    const start = pointerDown.current;
    if (start && Math.hypot(e.clientX - start.x, e.clientY - start.y) > 5) return;
    const value = `eq.${code}`;
    // Clicking the currently filtered country clears the filter.
    router.replace(updateParams({ country: query.country === value ? undefined : value }));
  };

  return (
    <Column
      {...props}
      data-tip=""
      data-for="world-map-tooltip"
      onMouseDownCapture={handleMouseDown}
      style={{ margin: 'auto 0', overflow: 'hidden' }}
    >
      <ComposableMap projection="geoMercator">
        <ZoomableGroup zoom={0.8} minZoom={0.7} center={[0, 40]}>
          <Geographies geography={`${process.env.basePath || ''}${MAP_FILE}`}>
            {({ geographies }) => {
              return geographies.map(geo => {
                const code = ISO_COUNTRIES[geo.id];

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getFillColor(code)}
                    stroke={colors.map.strokeColor}
                    opacity={getOpacity(code)}
                    style={{
                      default: { outline: 'none' },
                      hover: {
                        outline: 'none',
                        fill: colors.map.hoverColor,
                        cursor: isFilterable(code) ? 'pointer' : undefined,
                      },
                      pressed: { outline: 'none' },
                    }}
                    onClick={e => handleClick(code, e)}
                    onMouseOver={() => handleHover(code)}
                    onMouseOut={() => setTooltipPopup(null)}
                  />
                );
              });
            }}
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      {tooltip && <FloatingTooltip>{tooltip}</FloatingTooltip>}
    </Column>
  );
}
