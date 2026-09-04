import { useTheme } from '@umami/react-zen';
import { colord } from 'colord';
import { useCallback, useMemo } from 'react';
import { BarChart, type BarChartProps } from '@/components/charts/BarChart';
import { useLocale, useMessages } from '@/components/hooks';
import { renderDateLabels } from '@/lib/charts';
import { getThemeColors } from '@/lib/colors';
import { generateTimeSeries } from '@/lib/date';

const chartRed = colord('#e34850');
const visitorsRed = {
  hoverBackgroundColor: chartRed.alpha(0.9).toRgbString(),
  backgroundColor: chartRed.alpha(0.6).toRgbString(),
  borderColor: chartRed.alpha(0.9).toRgbString(),
  hoverBorderColor: chartRed.toRgbString(),
};
const viewsRed = {
  hoverBackgroundColor: chartRed.alpha(0.7).toRgbString(),
  backgroundColor: chartRed.alpha(0.4).toRgbString(),
  borderColor: chartRed.alpha(0.7).toRgbString(),
  hoverBorderColor: chartRed.toRgbString(),
};

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
  palette?: 'theme' | 'red';
}

export function PageviewsChart({
  data,
  unit,
  minDate,
  maxDate,
  palette = 'theme',
  ...props
}: PageviewsChartProps) {
  const { formatMessage, labels } = useMessages();
  const { theme } = useTheme();
  const { locale, dateLocale } = useLocale();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);
  const visitorsColors = palette === 'red' ? visitorsRed : colors.chart.visitors;
  const viewsColors = palette === 'red' ? viewsRed : colors.chart.views;

  const chartData: any = useMemo(() => {
    if (!data) return;

    return {
      __id: Date.now(),
      datasets: [
        {
          type: 'bar',
          label: formatMessage(labels.visitors),
          data: generateTimeSeries(data.sessions, minDate, maxDate, unit, dateLocale),
          borderWidth: 1,
          barPercentage: 0.9,
          categoryPercentage: 0.9,
          ...visitorsColors,
          order: 3,
        },
        {
          type: 'bar',
          label: formatMessage(labels.views),
          data: generateTimeSeries(data.pageviews, minDate, maxDate, unit, dateLocale),
          barPercentage: 0.9,
          categoryPercentage: 0.9,
          borderWidth: 1,
          ...viewsColors,
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
                backgroundColor: '#8601B0',
                borderColor: '#8601B0',
                order: 1,
              },
              {
                type: 'line',
                label: `${formatMessage(labels.visitors)} (${formatMessage(labels.previous)})`,
                data: generateTimeSeries(data.compare.sessions, minDate, maxDate, unit, dateLocale),
                borderWidth: 2,
                backgroundColor: '#f15bb5',
                borderColor: '#f15bb5',
                order: 2,
              },
            ]
          : []),
      ],
    };
  }, [data, locale, visitorsColors, viewsColors]);

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
