import { useId } from 'react';

export interface SparklineProps {
  data: number[];
  height?: number;
  color?: string;
  title?: string;
}

const VIEW_WIDTH = 100;

export function Sparkline({
  data,
  height = 28,
  color = 'var(--primary-color)',
  title,
}: SparklineProps) {
  const gradientId = useId();

  if (!data?.length) {
    return <div style={{ height }} />;
  }

  const values = data.map(n => (Number.isFinite(n) ? n : 0));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pad = 2;
  const step = values.length > 1 ? VIEW_WIDTH / (values.length - 1) : 0;

  const points = values.map((n, i) => {
    const x = values.length > 1 ? i * step : VIEW_WIDTH / 2;
    // Flat series sit in the middle rather than on the floor
    const y = max === min ? height / 2 : pad + (1 - (n - min) / range) * (height - pad * 2);
    return [x, y];
  });

  const line = points.map(([x, y]) => `${x},${y}`).join(' ');
  const area = `0,${height} ${line} ${VIEW_WIDTH},${height}`;
  const [lastX, lastY] = points[points.length - 1];

  return (
    <svg
      role="img"
      aria-label={title}
      width="100%"
      height={height}
      viewBox={`0 0 ${VIEW_WIDTH} ${height}`}
      preserveAspectRatio="none"
      style={{ display: 'block', overflow: 'visible' }}
    >
      {title && <title>{title}</title>}
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.25} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${gradientId})`} />
      <polyline
        points={line}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <line
        x1={lastX}
        y1={lastY}
        x2={lastX}
        y2={lastY}
        stroke={color}
        strokeWidth={5}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
