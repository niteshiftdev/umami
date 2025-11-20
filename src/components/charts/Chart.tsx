import { useState, useRef, useEffect, useMemo } from 'react';
import { Box, Column, BoxProps } from '@umami/react-zen';
import ChartJS, { LegendItem, ChartOptions, ChartData, UpdateMode } from 'chart.js/auto';
import { Legend } from '@/components/metrics/Legend';
import { DEFAULT_ANIMATION_DURATION } from '@/lib/constants';

ChartJS.defaults.font.family = 'Inter';

type AnnotationMark = {
  timestamp: number | string | Date;
  color?: string;
  title?: string;
};

declare module 'chart.js' {
  interface ChartOptions {
    annotationMarks?: AnnotationMark[];
  }
}

const annotationPlugin = {
  id: 'annotationPlugin',
  afterDraw: (chart: ChartJS) => {
    const annotations = chart?.options?.annotationMarks;
    if (!annotations?.length) return;

    const xScale = chart.scales?.x;
    const { top, bottom } = chart.chartArea;
    const ctx = chart.ctx;

    annotations.forEach(annotation => {
      const xPixel = xScale?.getPixelForValue(annotation.timestamp as any);
      if (xPixel === undefined || Number.isNaN(xPixel)) return;

      const color = annotation.color || '#f97316';
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(xPixel, top);
      ctx.lineTo(xPixel, bottom);
      ctx.stroke();

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(xPixel, top + 8, 4, 0, 2 * Math.PI);
      ctx.fill();

      if (annotation.title) {
        ctx.font = '10px Inter';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#111';
        ctx.fillText(annotation.title, xPixel, top + 24);
      }

      ctx.restore();
    });
  },
};

ChartJS.register(annotationPlugin);

export interface ChartProps extends BoxProps {
  type?: 'bar' | 'bubble' | 'doughnut' | 'pie' | 'line' | 'polarArea' | 'radar' | 'scatter';
  chartData?: ChartData & { focusLabel?: string };
  chartOptions?: ChartOptions;
  updateMode?: UpdateMode;
  animationDuration?: number;
  onTooltip?: (model: any) => void;
}

export function Chart({
  type,
  chartData,
  animationDuration = DEFAULT_ANIMATION_DURATION,
  updateMode,
  onTooltip,
  chartOptions,
  ...props
}: ChartProps) {
  const canvas = useRef(null);
  const chart = useRef(null);
  const [legendItems, setLegendItems] = useState([]);

  const options = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: animationDuration,
        resize: {
          duration: 0,
        },
        active: {
          duration: 0,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
          intersect: true,
          external: onTooltip,
        },
      },
      ...chartOptions,
    };
  }, [chartOptions]);

  const handleLegendClick = (item: LegendItem) => {
    if (type === 'bar') {
      const { datasetIndex } = item;
      const meta = chart.current.getDatasetMeta(datasetIndex);

      meta.hidden =
        meta.hidden === null ? !chart.current.data.datasets[datasetIndex]?.hidden : null;
    } else {
      const { index } = item;
      const meta = chart.current.getDatasetMeta(0);
      const hidden = !!meta?.data?.[index]?.hidden;

      meta.data[index].hidden = !hidden;
      chart.current.legend.legendItems[index].hidden = !hidden;
    }

    chart.current.update(updateMode);

    setLegendItems(chart.current.legend.legendItems);
  };

  // Create chart
  useEffect(() => {
    if (canvas.current) {
      chart.current = new ChartJS(canvas.current, {
        type,
        data: chartData,
        options,
      });

      setLegendItems(chart.current.legend.legendItems);
    }

    return () => {
      chart.current?.destroy();
    };
  }, []);

  // Update chart
  useEffect(() => {
    if (chart.current && chartData) {
      // Replace labels and datasets *in-place*
      chart.current.data.labels = chartData.labels;
      chart.current.data.datasets = chartData.datasets;

      if (chartData.focusLabel !== null) {
        chart.current.data.datasets.forEach((ds: { hidden: boolean; label: any }) => {
          ds.hidden = chartData.focusLabel ? ds.label !== chartData.focusLabel : false;
        });
      }

      chart.current.options = options;

      chart.current.update(updateMode);

      setLegendItems(chart.current.legend.legendItems);
    }
  }, [chartData, options, updateMode]);

  return (
    <Column gap="6">
      <Box {...props}>
        <canvas ref={canvas} />
      </Box>
      <Legend items={legendItems} onClick={handleLegendClick} />
    </Column>
  );
}
