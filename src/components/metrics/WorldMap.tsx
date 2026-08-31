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
  allowFilter?: boolean;
}

export function WorldMap({ websiteId, data, allowFilter = true, ...props }: WorldMapProps) {
  const [tooltip, setTooltipPopup] = useState();
  const { router, updateParams, query } = useNavigation();
  const { theme } = useTheme();
  const { colors } = getThemeColors(theme);
  const { locale } = useLocale();
  const { formatMessage, labels } = useMessages();
  const { countryNames } = useCountryNames(locale);
  const dragOrigin = useRef<[number, number]>(null);
  const visitorsLabel = formatMessage(labels.visitors).toLocaleLowerCase(locale);
  const unknownLabel = formatMessage(labels.unknown);

  const { data: mapData } = useWebsiteMetricsQuery(websiteId, {
    type: 'country',
  });
  const selectedCountry = query.country?.replace(/^eq\./, '');

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

    if (selectedCountry && selectedCountry === code) {
      return colors.map.baseColor;
    }

    return colord(colors.map.baseColor)
      [theme === 'light' ? 'lighten' : 'darken'](0.4 * (1.0 - country.z / 100))
      .toHex();
  };

  const getOpacity = (code: string) => {
    return code === 'AQ' ? 0 : 1;
  };

  const isClickable = (code: string) => {
    return allowFilter && !!code && code !== 'AQ' && metrics?.some(({ x }) => x === code);
  };

  const handleMouseDown = (e: any) => {
    dragOrigin.current = [e.clientX, e.clientY];
  };

  const handleClick = (code: string, e: any) => {
    const [x, y] = dragOrigin.current || [e.clientX, e.clientY];

    // ignore clicks that are the end of a map pan
    if (Math.abs(e.clientX - x) > 5 || Math.abs(e.clientY - y) > 5) return;

    if (!isClickable(code)) return;

    router.replace(updateParams({ country: selectedCountry === code ? undefined : `eq.${code}` }));
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

  return (
    <Column
      {...props}
      data-tip=""
      data-for="world-map-tooltip"
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
                      hover: { outline: 'none', fill: colors.map.hoverColor },
                      pressed: { outline: 'none' },
                    }}
                    cursor={isClickable(code) ? 'pointer' : 'default'}
                    onMouseOver={() => handleHover(code)}
                    onMouseOut={() => setTooltipPopup(null)}
                    onMouseDown={handleMouseDown}
                    onClick={(e: any) => handleClick(code, e)}
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
