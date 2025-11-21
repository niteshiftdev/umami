import { useCallback, useMemo } from 'react';
import { useTheme } from '@umami/react-zen';
import { BarChart, BarChartProps } from '@/components/charts/BarChart';
import { LineChart, LineChartProps } from '@/components/charts/LineChart';
import { useLocale, useMessages } from '@/components/hooks';
import { renderDateLabels } from '@/lib/charts';
import { getThemeColors } from '@/lib/colors';
import { generateTimeSeries } from '@/lib/date';
import { ChartType } from '@/components/charts/ChartTypeSelector';

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
  chartType?: ChartType;
}

export function PageviewsChart({ data, unit, minDate, maxDate, chartType = 'bar', ...props }: PageviewsChartProps) {
  const { formatMessage, labels } = useMessages();
  const { theme } = useTheme();
  const { locale, dateLocale } = useLocale();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  const chartData: any = useMemo(() => {
    if (!data) return;

    const baseChartType = chartType === 'line' ? 'line' : 'bar';
    const visitorDataConfig =
      chartType === 'line'
        ? {
            type: 'line',
            borderWidth: 2,
            fill: false,
            tension: 0.4,
          }
        : {
            type: 'bar',
            borderWidth: 1,
            barPercentage: 0.9,
            categoryPercentage: 0.9,
          };

    const viewDataConfig =
      chartType === 'line'
        ? {
            type: 'line',
            borderWidth: 2,
            fill: false,
            tension: 0.4,
          }
        : {
            type: 'bar',
            barPercentage: 0.9,
            categoryPercentage: 0.9,
            borderWidth: 1,
          };

    return {
      __id: new Date().getTime(),
      datasets: [
        {
          ...visitorDataConfig,
          label: formatMessage(labels.visitors),
          data: generateTimeSeries(data.sessions, minDate, maxDate, unit, dateLocale),
          ...colors.chart.visitors,
          order: 3,
        },
        {
          ...viewDataConfig,
          label: formatMessage(labels.views),
          data: generateTimeSeries(data.pageviews, minDate, maxDate, unit, dateLocale),
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

  const ChartComponent = chartType === 'line' ? LineChart : BarChart;

  return (
    <ChartComponent
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
