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
  chartType?: string;
}

export function PageviewsChart({ data, unit, minDate, maxDate, chartType = 'bar', ...props }: PageviewsChartProps) {
  const { formatMessage, labels } = useMessages();
  const { theme } = useTheme();
  const { locale, dateLocale } = useLocale();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  const chartData: any = useMemo(() => {
    if (!data) return;

    const mainChartType = chartType === 'bar' ? 'bar' : chartType === 'area' ? 'line' : 'line';
    const mainFilled = chartType === 'area';

    return {
      __id: new Date().getTime(),
      datasets: [
        {
          type: mainChartType,
          label: formatMessage(labels.visitors),
          data: generateTimeSeries(data.sessions, minDate, maxDate, unit, dateLocale),
          borderWidth: mainChartType === 'bar' ? 1 : 2,
          ...(mainChartType === 'bar' && {
            barPercentage: 0.9,
            categoryPercentage: 0.9,
          }),
          ...(mainFilled && {
            fill: true,
            backgroundColor: colors.chart.visitors.backgroundColor + '40',
          }),
          ...colors.chart.visitors,
          order: 3,
        },
        {
          type: mainChartType,
          label: formatMessage(labels.views),
          data: generateTimeSeries(data.pageviews, minDate, maxDate, unit, dateLocale),
          ...(mainChartType === 'bar' && {
            barPercentage: 0.9,
            categoryPercentage: 0.9,
            borderWidth: 1,
          }),
          ...(mainChartType === 'line' && {
            borderWidth: 2,
          }),
          ...(mainFilled && {
            fill: true,
            backgroundColor: colors.chart.views.backgroundColor + '40',
          }),
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
