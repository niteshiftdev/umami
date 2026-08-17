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
  const { theme } = useTheme();
  const { colors } = getThemeColors(theme);
  const { locale } = useLocale();
  const { formatMessage, labels } = useMessages();
  const { countryNames } = useCountryNames(locale);
  const { router, updateParams, query } = useNavigation();
  const pointerDown = useRef<{ x: number; y: number }>(null);
  const visitorsLabel = formatMessage(labels.visitors).toLocaleLowerCase(locale);
  const unknownLabel = formatMessage(labels.unknown);

  const { data: mapData } = useWebsiteMetricsQuery(websiteId, {
    type: 'country',
  });

  const metrics = useMemo(
    () => (data || mapData ? percentFilter((data || mapData) as any[]) : []),
    [data, mapData],
  );

  const selectedCountry = query?.country?.startsWith('eq.') ? query.country.slice(3) : null;

  const isClickable = (code: string) => {
    if (!allowFilter || !code || code === 'AQ') return false;

    return code === selectedCountry || metrics?.some(({ x }) => x === code);
  };

  const getFillColor = (code: string) => {
    if (code === 'AQ') return;
    const country = metrics?.find(({ x }) => x === code);

    if (!country) {
      return colors.map.fillColor;
    }

    if (code === selectedCountry) {
      return colors.map.baseColor;
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

  const handleClick = (code: string, e: { clientX: number; clientY: number }) => {
    if (!isClickable(code)) return;

    // ignore clicks that are the end of a map pan
    const start = pointerDown.current;

    if (start && Math.abs(e.clientX - start.x) + Math.abs(e.clientY - start.y) > 5) {
      return;
    }

    setTooltipPopup(null);

    router.replace(updateParams({ country: code === selectedCountry ? undefined : `eq.${code}` }), {
      scroll: false,
    });
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
                const clickable = isClickable(code);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getFillColor(code)}
                    stroke={colors.map.strokeColor}
                    opacity={getOpacity(code)}
                    style={{
                      default: { outline: 'none', cursor: clickable ? 'pointer' : 'default' },
                      hover: {
                        outline: 'none',
                        fill: colors.map.hoverColor,
                        cursor: clickable ? 'pointer' : 'default',
                      },
                      pressed: { outline: 'none', cursor: clickable ? 'pointer' : 'default' },
                    }}
                    onMouseOver={() => handleHover(code)}
                    onMouseOut={() => setTooltipPopup(null)}
                    onPointerDown={(e: any) => {
                      pointerDown.current = { x: e.clientX, y: e.clientY };
                    }}
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
