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

type AnnotationIndicatorStyle = {
  shape: 'circle' | 'diamond' | 'square' | 'flag' | 'circleOutline' | 'circleGlow';
  size: number;
  strokeWidth: number;
  filled: boolean;
  glowEffect: boolean;
};

type AnnotationStyleConfig = {
  indicator: AnnotationIndicatorStyle;
  defaultColor: string;
  countFont: string;
  countColor: string;
};

declare module 'chart.js' {
  interface ChartOptions {
    annotationMarks?: AnnotationMark[];
    annotationStyle?: AnnotationStyleConfig;
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

// Default annotation style
const defaultAnnotationStyle: AnnotationStyleConfig = {
  indicator: {
    shape: 'circle',
    size: 4,
    strokeWidth: 0,
    filled: true,
    glowEffect: false,
  },
  defaultColor: '#f97316',
  countFont: '10px Inter',
  countColor: '#111',
};

function drawAnnotationIndicator(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  style: AnnotationIndicatorStyle
) {
  const { shape, size, strokeWidth, filled, glowEffect } = style;

  ctx.save();

  // Add glow effect if enabled
  if (glowEffect) {
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }

  ctx.fillStyle = filled ? color : 'transparent';
  ctx.strokeStyle = color;
  ctx.lineWidth = strokeWidth;

  switch (shape) {
    case 'circle':
    case 'circleGlow':
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      if (filled) {
        ctx.fill();
      }
      if (strokeWidth > 0) {
        ctx.stroke();
      }
      break;

    case 'circleOutline':
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
      break;

    case 'diamond':
      ctx.beginPath();
      ctx.moveTo(x, y - size);
      ctx.lineTo(x + size, y);
      ctx.lineTo(x, y + size);
      ctx.lineTo(x - size, y);
      ctx.closePath();
      if (filled) {
        ctx.fill();
      }
      if (strokeWidth > 0) {
        ctx.stroke();
      }
      break;

    case 'square':
      if (filled) {
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
      }
      if (strokeWidth > 0) {
        ctx.strokeRect(x - size / 2, y - size / 2, size, size);
      }
      break;

    case 'flag':
      // Draw flag shape
      ctx.beginPath();
      ctx.lineWidth = 1.5;
      // Pole
      ctx.moveTo(x, y - size);
      ctx.lineTo(x, y + size / 2);
      ctx.stroke();
      // Flag banner
      ctx.beginPath();
      ctx.moveTo(x, y - size);
      ctx.lineTo(x + size, y - size / 2);
      ctx.lineTo(x, y);
      ctx.closePath();
      if (filled) {
        ctx.fill();
      }
      break;
  }

  ctx.restore();
}

const annotationPlugin = {
  id: 'annotationPlugin',
  afterDraw: (chart: ChartJS) => {
    const annotations = chart?.options?.annotationMarks;
    if (!annotations?.length) return;

    const style = chart?.options?.annotationStyle || defaultAnnotationStyle;

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
      const color = annotation.color || style.defaultColor;

      ctx.save();

      // Draw background highlight
      ctx.fillStyle = withAlpha(color, 0.15);
      ctx.fillRect(x - width / 2, top, width, bottom - top);

      // Draw indicator using the style configuration
      drawAnnotationIndicator(ctx, x, top + 8, color, style.indicator);

      // Draw count if multiple annotations
      if (annotation.count && annotation.count > 1) {
        ctx.font = style.countFont;
        ctx.textAlign = 'center';
        ctx.fillStyle = style.countColor;
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
