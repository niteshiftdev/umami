import { useCallback, useMemo, useContext } from 'react';
import { useTheme } from '@umami/react-zen';
import { BarChart, BarChartProps } from '@/components/charts/BarChart';
import { useLocale, useMessages } from '@/components/hooks';
import { renderDateLabels } from '@/lib/charts';
import { getThemeColors } from '@/lib/colors';
import { generateTimeSeries } from '@/lib/date';
import { VisualizationContext } from '@/app/(main)/websites/[websiteId]/WebsitePage';

export interface PageviewsChartProps extends BarChartProps {
  data: {
    pageviews: any[];
    sessions: any[];
    compare?: {
      pageviews: any[];
      sessions: any[];
    };
  };
  unit: string;
}

// Color scheme definitions
const COLOR_SCHEMES = {
  default: {
    visitors: { primary: '#5865f2', secondary: '#5865f280' },
    views: { primary: '#57d9a3', secondary: '#57d9a380' },
    comparison: { visitors: '#f15bb5', views: '#8601B0' },
  },
  vibrant: {
    visitors: { primary: '#ff006e', secondary: '#ff006e80' },
    views: { primary: '#ffbe0b', secondary: '#ffbe0b80' },
    comparison: { visitors: '#fb5607', views: '#8338ec' },
  },
  pastel: {
    visitors: { primary: '#a8dadc', secondary: '#a8dadc80' },
    views: { primary: '#f1faee', secondary: '#f1faee80' },
    comparison: { visitors: '#e63946', views: '#457b9d' },
  },
  monochrome: {
    visitors: { primary: '#495057', secondary: '#49505780' },
    views: { primary: '#adb5bd', secondary: '#adb5bd80' },
    comparison: { visitors: '#212529', views: '#6c757d' },
  },
  warm: {
    visitors: { primary: '#ff9770', secondary: '#ff977080' },
    views: { primary: '#ffd670', secondary: '#ffd67080' },
    comparison: { visitors: '#e8927c', views: '#ffa987' },
  },
  cool: {
    visitors: { primary: '#4cc9f0', secondary: '#4cc9f080' },
    views: { primary: '#4895ef', secondary: '#4895ef80' },
    comparison: { visitors: '#3a0ca3', views: '#560bad' },
  },
};

export function PageviewsChart({ data, unit, minDate, maxDate, ...props }: PageviewsChartProps) {
  const { formatMessage, labels } = useMessages();
  const { theme } = useTheme();
  const { locale, dateLocale } = useLocale();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);
  const visualization = useContext(VisualizationContext);

  const chartType = visualization?.chartType || 'bar';
  const colorScheme = visualization?.colorScheme || 'default';
  const selectedColors = COLOR_SCHEMES[colorScheme] || COLOR_SCHEMES.default;

  const chartData: any = useMemo(() => {
    if (!data) return;

    // Determine fill configuration based on chart type
    const isFilled = chartType === 'area';
    const isLine = chartType === 'line' || chartType === 'area';

    return {
      __id: new Date().getTime(),
      datasets: [
        {
          type: isLine ? 'line' : 'bar',
          label: formatMessage(labels.visitors),
          data: generateTimeSeries(data.sessions, minDate, maxDate, unit, dateLocale),
          borderWidth: isLine ? 2 : 1,
          barPercentage: 0.9,
          categoryPercentage: 0.9,
          backgroundColor: isFilled ? selectedColors.visitors.secondary : selectedColors.visitors.primary,
          borderColor: selectedColors.visitors.primary,
          fill: isFilled,
          tension: isLine ? 0.4 : 0,
          order: 3,
        },
        {
          type: isLine ? 'line' : 'bar',
          label: formatMessage(labels.views),
          data: generateTimeSeries(data.pageviews, minDate, maxDate, unit, dateLocale),
          barPercentage: 0.9,
          categoryPercentage: 0.9,
          borderWidth: isLine ? 2 : 1,
          backgroundColor: isFilled ? selectedColors.views.secondary : selectedColors.views.primary,
          borderColor: selectedColors.views.primary,
          fill: isFilled,
          tension: isLine ? 0.4 : 0,
          order: 4,
        },
        ...(data.compare
          ? [
              {
                type: 'line',
                label: `${formatMessage(labels.views)} (${formatMessage(labels.previous)})`,
                data: generateTimeSeries(
                  data.compare.pageviews,
                  minDate,
                  maxDate,
                  unit,
                  dateLocale,
                ),
                borderWidth: 2,
                backgroundColor: selectedColors.comparison.views,
                borderColor: selectedColors.comparison.views,
                order: 1,
              },
              {
                type: 'line',
                label: `${formatMessage(labels.visitors)} (${formatMessage(labels.previous)})`,
                data: generateTimeSeries(data.compare.sessions, minDate, maxDate, unit, dateLocale),
                borderWidth: 2,
                backgroundColor: selectedColors.comparison.visitors,
                borderColor: selectedColors.comparison.visitors,
                order: 2,
              },
            ]
          : []),
      ],
    };
  }, [data, locale, chartType, colorScheme, selectedColors]);

  const renderXLabel = useCallback(renderDateLabels(unit, locale), [unit, locale]);

  return (
    <BarChart
      {...props}
      chartData={chartData}
      unit={unit}
      minDate={minDate}
      maxDate={maxDate}
      renderXLabel={renderXLabel}
      height="400px"
    />
  );
}
