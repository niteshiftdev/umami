'use client';

import { useMemo, useState } from 'react';
import { useTheme } from '@umami/react-zen';
import { ChartTooltip } from '@/components/charts/ChartTooltip';
import { Chart, ChartProps } from '@/components/charts/Chart';
import { useLocale } from '@/components/hooks';
import { renderNumberLabels } from '@/lib/charts';
import { getThemeColors } from '@/lib/colors';
import { formatDate, DATE_FORMATS } from '@/lib/date';
import { formatLongCurrency, formatLongNumber } from '@/lib/format';
import { useAnnotationDials } from '@/components/annotations';

const dateFormats = {
  millisecond: 'T',
  second: 'pp',
  minute: 'p',
  hour: 'p - PP',
  day: 'PPPP',
  week: 'PPPP',
  month: 'LLLL yyyy',
  quarter: 'qqq',
  year: 'yyyy',
};

export interface BarChartProps extends ChartProps {
  unit?: string;
  stacked?: boolean;
  currency?: string;
  renderXLabel?: (label: string, index: number, values: any[]) => string;
  renderYLabel?: (label: string, index: number, values: any[]) => string;
  XAxisType?: string;
  YAxisType?: string;
  minDate?: Date;
  maxDate?: Date;
  annotationGroups?: Record<
    string,
    { color?: string; items: { title: string; description?: string | null }[] }
  >;
  onBarClick?: (payload: { label: string; raw: any }) => void;
}

export function BarChart({
  chartData,
  renderXLabel,
  renderYLabel,
  unit,
  XAxisType = 'timeseries',
  YAxisType = 'linear',
  stacked = false,
  minDate,
  maxDate,
  currency,
  annotationGroups,
  onBarClick,
  ...props
}: BarChartProps) {
  const [tooltip, setTooltip] = useState(null);
  const { theme } = useTheme();
  const { locale } = useLocale();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  // Get annotation styles from dials
  const { currentStyle } = useAnnotationDials();

  const annotationMarks = useMemo(() => {
    if (!annotationGroups) return [];
    return Object.entries(annotationGroups).map(([label, group]) => ({
      label,
      color: group.color,
      count: group.items.length,
    }));
  }, [annotationGroups]);

  // Build annotation style config for the chart plugin
  const annotationStyle = useMemo(() => {
    return {
      indicator: {
        shape: currentStyle.indicator.shape,
        size: currentStyle.indicator.size,
        strokeWidth: currentStyle.indicator.strokeWidth,
        filled: currentStyle.indicator.filled,
        glowEffect: currentStyle.indicator.glowEffect,
      },
      defaultColor: currentStyle.colors.primary,
      countFont: `${currentStyle.typography.countSize} ${currentStyle.typography.fontFamily}`,
      countColor: currentStyle.colors.text,
    };
  }, [currentStyle]);

  const chartOptions: any = useMemo(() => {
    return {
      __id: new Date().getTime(),
      annotationMarks,
      annotationStyle,
      scales: {
        x: {
          type: XAxisType,
          stacked: true,
          min: formatDate(minDate, DATE_FORMATS[unit], locale),
          max: formatDate(maxDate, DATE_FORMATS[unit], locale),
          offset: true,
          time: {
            unit,
          },
          grid: {
            display: false,
          },
          border: {
            color: colors.chart.line,
          },
          ticks: {
            color: colors.chart.text,
            autoSkip: false,
            maxRotation: 0,
            callback: renderXLabel,
          },
        },
        y: {
          type: YAxisType,
          min: 0,
          beginAtZero: true,
          stacked: !!stacked,
          grid: {
            color: colors.chart.line,
          },
          border: {
            color: colors.chart.line,
          },
          ticks: {
            color: colors.chart.text,
            callback: renderYLabel || renderNumberLabels,
          },
        },
      },
    };
  }, [chartData, colors, unit, stacked, renderXLabel, renderYLabel, annotationMarks, annotationStyle]);

  const handleTooltip = ({ tooltip }: { tooltip: any }) => {
    const { opacity, labelColors, dataPoints } = tooltip;
    const rawValue = dataPoints?.[0]?.raw?.d || dataPoints?.[0]?.raw?.x;
    const key = rawValue ? formatDate(rawValue, DATE_FORMATS[unit], locale) : undefined;
    const group = key ? annotationGroups?.[key] : undefined;

    setTooltip(
      opacity
        ? {
            title: formatDate(
              new Date(dataPoints[0].raw?.d || dataPoints[0].raw?.x || dataPoints[0].raw),
              dateFormats[unit],
              locale,
            ),
            color: labelColors?.[0]?.backgroundColor,
            value: currency
              ? formatLongCurrency(dataPoints[0].raw.y, currency)
              : `${formatLongNumber(dataPoints[0].raw.y)} ${dataPoints[0].dataset.label}`,
            annotations: group?.items,
          }
        : null,
    );
  };

  return (
    <>
      <Chart
        {...props}
        type="bar"
        chartData={chartData}
        chartOptions={chartOptions}
        onTooltip={handleTooltip}
        onElementClick={({ event, chart: chartInstance }) => {
          if (!onBarClick) return;
          const elements = chartInstance.getElementsAtEventForMode(
            event,
            'index',
            { intersect: false, axis: 'x' },
            false,
          );
          if (!onBarClick || !elements.length) return;
          const { datasetIndex, index } = elements[0];
          const dataset = chartInstance.data.datasets?.[datasetIndex];
          const rawPoint = dataset?.data?.[index];
          const labelValue = typeof rawPoint === 'object' ? (rawPoint?.x ?? rawPoint?.d) : rawPoint;
          if (labelValue !== undefined) {
            onBarClick({ label: String(labelValue), raw: rawPoint });
          }
        }}
      />
      {tooltip && <ChartTooltip {...tooltip} />}
    </>
  );
}
