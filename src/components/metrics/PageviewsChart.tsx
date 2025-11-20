import { useCallback, useMemo } from 'react';
import { useTheme } from '@umami/react-zen';
import { BarChart, BarChartProps } from '@/components/charts/BarChart';
import { useLocale, useMessages } from '@/components/hooks';
import { renderDateLabels } from '@/lib/charts';
import { getThemeColors } from '@/lib/colors';
import { generateTimeSeries } from '@/lib/date';

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
  chartType?: 'bar' | 'line';
}

export function PageviewsChart({ data, unit, minDate, maxDate, chartType = 'bar', ...props }: PageviewsChartProps) {
  const { formatMessage, labels } = useMessages();
  const { theme } = useTheme();
  const { locale, dateLocale } = useLocale();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  const chartData: any = useMemo(() => {
    if (!data) return;

    return {
      __id: new Date().getTime(),
      datasets: [
        {
          type: chartType,
          label: formatMessage(labels.visitors),
          data: generateTimeSeries(data.sessions, minDate, maxDate, unit, dateLocale),
          borderWidth: chartType === 'line' ? 2 : 1,
          barPercentage: chartType === 'bar' ? 0.9 : undefined,
          categoryPercentage: chartType === 'bar' ? 0.9 : undefined,
          tension: chartType === 'line' ? 0.4 : undefined,
          ...colors.chart.visitors,
          order: 3,
        },
        {
          type: chartType,
          label: formatMessage(labels.views),
          data: generateTimeSeries(data.pageviews, minDate, maxDate, unit, dateLocale),
          barPercentage: chartType === 'bar' ? 0.9 : undefined,
          categoryPercentage: chartType === 'bar' ? 0.9 : undefined,
          borderWidth: chartType === 'line' ? 2 : 1,
          tension: chartType === 'line' ? 0.4 : undefined,
          ...colors.chart.views,
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
  }, [data, locale, chartType]);

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
