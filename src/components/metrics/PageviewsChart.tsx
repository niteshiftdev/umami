import { useCallback, useMemo, useState } from 'react';
import { useTheme, Box, Row } from '@umami/react-zen';
import { BarChart, BarChartProps } from '@/components/charts/BarChart';
import { LineChart } from '@/components/charts/LineChart';
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
}

const chartTypeStyles = {
  button: {
    padding: '6px 12px',
    border: '1px solid transparent',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
  },
  active: {
    backgroundColor: 'var(--color-primary)',
    color: 'white',
    borderColor: 'var(--color-primary)',
  },
  inactive: {
    backgroundColor: 'transparent',
    color: 'var(--color-text)',
    border: '1px solid var(--color-border)',
  },
};

export function PageviewsChart({ data, unit, minDate, maxDate, ...props }: PageviewsChartProps) {
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
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
          barPercentage: 0.9,
          categoryPercentage: 0.9,
          ...colors.chart.visitors,
          order: 3,
          tension: 0.3,
        },
        {
          type: chartType,
          label: formatMessage(labels.views),
          data: generateTimeSeries(data.pageviews, minDate, maxDate, unit, dateLocale),
          barPercentage: 0.9,
          categoryPercentage: 0.9,
          borderWidth: chartType === 'line' ? 2 : 1,
          ...colors.chart.views,
          order: 4,
          tension: 0.3,
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
                tension: 0.3,
              },
              {
                type: 'line',
                label: `${formatMessage(labels.visitors)} (${formatMessage(labels.previous)})`,
                data: generateTimeSeries(data.compare.sessions, minDate, maxDate, unit, dateLocale),
                borderWidth: 2,
                backgroundColor: '#f15bb5',
                borderColor: '#f15bb5',
                order: 2,
                tension: 0.3,
              },
            ]
          : []),
      ],
    };
  }, [data, locale, chartType]);

  const renderXLabel = useCallback(renderDateLabels(unit, locale), [unit, locale]);

  const ChartComponent = chartType === 'bar' ? BarChart : LineChart;

  return (
    <Box>
      <Row gap="3" style={{ marginBottom: '12px' }}>
        <button
          onClick={() => setChartType('bar')}
          style={{
            ...chartTypeStyles.button,
            ...(chartType === 'bar' ? chartTypeStyles.active : chartTypeStyles.inactive),
          }}
          title="Bar Chart"
        >
          📊 Bar
        </button>
        <button
          onClick={() => setChartType('line')}
          style={{
            ...chartTypeStyles.button,
            ...(chartType === 'line' ? chartTypeStyles.active : chartTypeStyles.inactive),
          }}
          title="Line Chart"
        >
          📈 Line
        </button>
      </Row>
      <ChartComponent
        {...props}
        chartData={chartData}
        unit={unit}
        minDate={minDate}
        maxDate={maxDate}
        renderXLabel={renderXLabel}
        height="400px"
      />
    </Box>
  );
}
