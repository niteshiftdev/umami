import { Column, type ColumnProps, FloatingTooltip, useTheme } from '@umami/react-zen';
import { colord } from 'colord';
import { type MouseEvent, useMemo, useRef, useState } from 'react';
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
  allowFilter?: boolean;
}

export function WorldMap({ websiteId, data, allowFilter = true, ...props }: WorldMapProps) {
  const [tooltip, setTooltipPopup] = useState();
  const mouseDownRef = useRef<{ x: number; y: number }>(null);
  const { theme } = useTheme();
  const { colors } = getThemeColors(theme);
  const { locale } = useLocale();
  const { formatMessage, labels } = useMessages();
  const { countryNames } = useCountryNames(locale);
  const { router, updateParams, query } = useNavigation();
  const selectedCountry = query.country?.replace(/^eq\./, '');
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

    if (code && selectedCountry === code) {
      return colors.map.baseColor;
    }

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

  const isSelectable = (code: string) => {
    return allowFilter && code && code !== 'AQ' && metrics?.some(({ x }) => x === code);
  };

  const handleMouseDown = (e: MouseEvent) => {
    mouseDownRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleClick = (code: string, e: MouseEvent) => {
    if (!isSelectable(code)) return;

    // ignore clicks that are the end of a pan/drag
    const start = mouseDownRef.current;

    if (start && Math.hypot(e.clientX - start.x, e.clientY - start.y) > 4) return;

    router.replace(
      updateParams({ country: selectedCountry === code ? undefined : `eq.${code}` } as any),
    );
  };

  return (
    <Column
      {...props}
      data-tip=""
      data-for="world-map-tooltip"
      style={{
        margin: 'auto 0',
        overflow: 'hidden',
        backgroundColor: colors.map.backgroundColor,
      }}
    >
      <ComposableMap projection="geoMercator">
        <ZoomableGroup zoom={0.8} minZoom={0.7} center={[0, 40]}>
          <Geographies geography={`${process.env.basePath || ''}${MAP_FILE}`}>
            {({ geographies }) => {
              return geographies.map(geo => {
                const code = ISO_COUNTRIES[geo.id];
                const selectable = isSelectable(code);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getFillColor(code)}
                    stroke={colors.map.strokeColor}
                    opacity={getOpacity(code)}
                    style={{
                      default: { outline: 'none', cursor: selectable ? 'pointer' : 'default' },
                      hover: {
                        outline: 'none',
                        fill: colors.map.hoverColor,
                        cursor: selectable ? 'pointer' : 'default',
                      },
                      pressed: { outline: 'none' },
                    }}
                    onMouseOver={() => handleHover(code)}
                    onMouseOut={() => setTooltipPopup(null)}
                    onMouseDown={handleMouseDown}
                    onClick={(e: MouseEvent) => handleClick(code, e)}
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
