import { Column, type ColumnProps, FloatingTooltip, useTheme } from '@umami/react-zen';
import { colord } from 'colord';
import { useMemo, useState } from 'react';
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

  // Filtering only applies when the map is backed by website metrics (not static data, e.g. realtime)
  const canFilter = !!websiteId && !data;
  const selectedCountry = query.country?.startsWith('eq.') ? query.country.slice(3) : undefined;

  const hasData = (code: string) => !!metrics?.find(({ x }) => x === code);

  const handleClick = (code: string) => {
    if (!canFilter || !code || code === 'AQ') return;
    if (code === selectedCountry) {
      router.replace(updateParams({ country: undefined }));
    } else if (hasData(code)) {
      router.replace(updateParams({ country: `eq.${code}` }));
    }
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
                // Antarctica (ATA) has no ISO mapping; keep it non-interactive
                const interactive = geo.id !== 'ATA';
                const fill = getFillColor(code);
                const clickable =
                  interactive && canFilter && (code === selectedCountry || hasData(code));
                const cursor = clickable ? 'pointer' : undefined;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fill}
                    stroke={colors.map.strokeColor}
                    opacity={getOpacity(code)}
                    style={{
                      default: { outline: 'none', cursor },
                      hover: {
                        outline: 'none',
                        fill: interactive ? colors.map.hoverColor : fill,
                        cursor,
                      },
                      pressed: { outline: 'none', cursor },
                    }}
                    onClick={interactive ? () => handleClick(code) : undefined}
                    onMouseOver={interactive ? () => handleHover(code) : undefined}
                    onMouseOut={interactive ? () => setTooltipPopup(null) : undefined}
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
