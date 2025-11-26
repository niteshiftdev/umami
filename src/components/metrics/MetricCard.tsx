import { Text, Column } from '@umami/react-zen';
import { useSpring } from '@react-spring/web';
import { formatNumber } from '@/lib/format';
import { AnimatedDiv } from '@/components/common/AnimatedDiv';
import { ChangeLabel } from '@/components/metrics/ChangeLabel';

export interface MetricCardProps {
  value: number;
  previousValue?: number;
  change?: number;
  label?: string;
  reverseColors?: boolean;
  formatValue?: (n: any) => string;
  showLabel?: boolean;
  showChange?: boolean;
  metricIndex?: number;
}

const METRIC_COLORS = [
  {
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    accent: '#667eea',
  },
  {
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    accent: '#f093fb',
  },
  {
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    accent: '#4facfe',
  },
  {
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    accent: '#43e97b',
  },
  {
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    accent: '#fa709a',
  },
];

export const MetricCard = ({
  value = 0,
  change = 0,
  label,
  reverseColors = false,
  formatValue = formatNumber,
  showLabel = true,
  showChange = false,
  metricIndex = 0,
}: MetricCardProps) => {
  const diff = value - change;
  const pct = ((value - diff) / diff) * 100;
  const props = useSpring({ x: Number(value) || 0, from: { x: 0 } });
  const changeProps = useSpring({ x: Number(pct) || 0, from: { x: 0 } });

  const colorScheme = METRIC_COLORS[metricIndex % METRIC_COLORS.length];

  return (
    <Column
      justifyContent="center"
      paddingX="6"
      paddingY="4"
      borderRadius="3"
      style={{
        background: colorScheme.gradient,
        border: 'none',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
      }}
    >
      {showLabel && (
        <Text weight="bold" wrap="nowrap" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
          {label}
        </Text>
      )}
      <Text size="8" weight="bold" wrap="nowrap" style={{ color: '#ffffff' }}>
        <AnimatedDiv title={value?.toString()}>{props?.x?.to(x => formatValue(x))}</AnimatedDiv>
      </Text>
      {showChange && (
        <ChangeLabel value={change} title={formatValue(change)} reverseColors={reverseColors}>
          <AnimatedDiv>{changeProps?.x?.to(x => `${Math.abs(~~x)}%`)}</AnimatedDiv>
        </ChangeLabel>
      )}
    </Column>
  );
};
