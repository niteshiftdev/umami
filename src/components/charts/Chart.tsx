import { useState, useRef, useEffect, useMemo } from 'react';
import { Box, Column, BoxProps } from '@umami/react-zen';
import ChartJS, { LegendItem, ChartOptions, ChartData, UpdateMode } from 'chart.js/auto';
import { Legend } from '@/components/metrics/Legend';
import { DEFAULT_ANIMATION_DURATION } from '@/lib/constants';

ChartJS.defaults.font.family = 'Inter';

type AnnotationMark = {
  label: string;
  color?: string;
  count?: number;
};

declare module 'chart.js' {
  interface ChartOptions {
    annotationMarks?: AnnotationMark[];
  }
}

function withAlpha(color: string, alpha: number) {
  if (typeof document === 'undefined') return color;
  const ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) return color;
  ctx.fillStyle = color;
  const parsed = ctx.fillStyle;
  if (parsed.startsWith('#')) {
    const hex = parsed.slice(1);
    const normalizedHex =
      hex.length === 3
        ? hex
            .split('')
            .map(c => c + c)
            .join('')
        : hex;
    const bigint = parseInt(normalizedHex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return parsed;
}

const annotationPlugin = {
  id: 'annotationPlugin',
  afterDraw: (chart: ChartJS) => {
    const annotations = chart?.options?.annotationMarks;
    if (!annotations?.length) return;

    const baseMeta = chart.getDatasetMeta(0);
    const bars = baseMeta?.data || [];
    const dataset = chart.data.datasets?.[baseMeta?.index ?? 0];
    const rawData = (dataset?.data as any[]) || [];
    const fallbackLabels = chart.data.labels || [];

    const labelMap = new Map<string, { element: any; raw: any }>();
    bars.forEach((bar, index) => {
      const raw = rawData[index];
      const fallbackLabel = fallbackLabels[index];
      const labelValue =
        typeof raw === 'object'
          ? (raw?.x ?? raw?.label ?? raw?.d ?? fallbackLabel)
          : (raw ?? fallbackLabel);
      if (labelValue !== undefined) {
        labelMap.set(String(labelValue), { element: bar, raw });
      }
    });

    if (labelMap.size === 0) return;

    const ctx = chart.ctx;
    const { top, bottom } = chart.chartArea;

    annotations.forEach(annotation => {
      const entry = labelMap.get(annotation.label);
      if (!entry) return;
      const props = entry.element.getProps(['x', 'width'], true);
      const x = props.x;
      const width = props.width || entry.element.width || 0;
      const color = annotation.color || '#f97316';
      ctx.save();
      ctx.fillStyle = withAlpha(color, 0.15);
      ctx.fillRect(x - width / 2, top, width, bottom - top);

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, top + 8, 4, 0, 2 * Math.PI);
      ctx.fill();

      if (annotation.count && annotation.count > 1) {
        ctx.font = '10px Inter';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#111';
        ctx.fillText(`×${annotation.count}`, x, top + 24);
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
  onElementClick?: (params: { elements: any[]; chart: ChartJS; event: MouseEvent }) => void;
}

export function Chart({
  type,
  chartData,
  animationDuration = DEFAULT_ANIMATION_DURATION,
  updateMode,
  onTooltip,
  onElementClick,
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
      interaction: {
        mode: 'index',
        axis: 'x',
        intersect: false,
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
          intersect: false,
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

  useEffect(() => {
    if (!canvas.current || !chart.current || !onElementClick) return;

    const handleClick = (event: MouseEvent) => {
      if (event.button !== 0) return;
      const elements = chart.current?.getElementsAtEventForMode(
        event,
        'nearest',
        { intersect: true },
        false,
      );

      if (elements && elements.length) {
        onElementClick({ elements, chart: chart.current, event });
      }
    };

    const canvasEl: HTMLCanvasElement = canvas.current;
    canvasEl.addEventListener('click', handleClick);

    return () => {
      canvasEl.removeEventListener('click', handleClick);
    };
  }, [onElementClick]);

  return (
    <Column gap="6">
      <Box {...props}>
        <canvas ref={canvas} />
      </Box>
      <Legend items={legendItems} onClick={handleLegendClick} />
    </Column>
  );
}
